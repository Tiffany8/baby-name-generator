import logging
from dotenv import load_dotenv
from starlette.responses import JSONResponse
from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException, Request, status
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import (
    ConnectionFailure,
    ConfigurationError,
    ServerSelectionTimeoutError,
)
import motor.motor_asyncio
import os
import openai

from email_helpers import send_email, EmailNameResultsRequest
from database import create_name_results
from models import ParentData
from openai_helpers import create_prompt

load_dotenv()

API_KEY_NAME = "X-API-Key"
MODEL_NAME = os.getenv("GPT_MODEL_NAME")
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("REACT_APP_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)


async def check_api_key(request: Request):
    if request.headers.get("x-api-key") != os.getenv("API_KEY"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API Key"
        )


@app.post("/names")
async def generate_names(data: ParentData, api_key: str = Depends(check_api_key)):
    content = create_prompt(data)
    try:
        response = await openai.ChatCompletion.acreate(
            model=f"{MODEL_NAME}",
            messages=[{"role": "user", "content": content}],
            temperature=1,
        )
        print(response["choices"][0]["message"]["content"])
        results = await create_name_results(
            client=app.database,
            name_results=response["choices"][0]["message"]["content"],
        )
        return results
    except openai.error.RateLimitError as error:
        logging.error(error)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="OpenAI API rate limit exceeded. Please try again later.",
        )
    except openai.error.APIError as error:
        logging.error(error)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error. Please try again later.",
        )
    except Exception as error:
        logging.error(error)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error. Please try again later.",
        )


@app.post("/email-results")
async def email_results(
    background_task: BackgroundTasks,
    email_results_request: EmailNameResultsRequest,
    api_key: str = Depends(check_api_key),
):
    background_task.add_task(
        send_email, app.database, results_request=email_results_request
    )
    return {"message": "Email sent successfully"}


@app.get("/")
def index(api_key: str = Depends(check_api_key)):
    return {"status": "ok"}


@app.on_event("startup")
def startup_db_client():
    try:
        app.mongodb_client = motor.motor_asyncio.AsyncIOMotorClient(
            os.getenv("MONGO_URL")
        )
        app.database = app.mongodb_client.app_database
        print("Connected to the MongoDB database!")
    except (
        ConfigurationError,
        ServerSelectionTimeoutError,
        ConnectionFailure,
    ) as error:
        logging.error("Configuration Error:", error)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error. Please try again later.",
        )
    except Exception as e:
        # fyi - raise with no argument preserves original traceback
        logging.error("An unexpected error occurred:", str(e))
        raise


@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()
