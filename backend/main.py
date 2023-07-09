import logging
from database import create_name_results
from models import ParentData
from dotenv import load_dotenv
from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import (
    ConnectionFailure,
    ConfigurationError,
    ServerSelectionTimeoutError,
)
import motor.motor_asyncio
import openai
import os

from openai_helpers import create_prompt
from email_helpers import send_email, EmailNameResultsRequest

load_dotenv()

MODEL_NAME = os.getenv("GPT_MODEL_NAME")
API_KEY = os.getenv("OPENAI_API_KEY")

openai.api_key = API_KEY
app = FastAPI()

origins = [os.getenv("REACT_APP_URL")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/names")
async def generate_names(data: ParentData):
    content = create_prompt(data)
    try:
        response = await openai.ChatCompletion.acreate(
            model=f"{MODEL_NAME}",
            messages=[{"role": "user", "content": content}],
            temperature=1,
        )
        results = await create_name_results(
            client=app.database,
            name_results=response["choices"][0]["message"]["content"],
        )
        return results
    except openai.error.RateLimitError as error:
        logging.error(error)
        raise HTTPException(
            status_code=429,
            detail="OpenAI API rate limit exceeded. Please try again later.",
        )
    except openai.error.APIError as error:
        logging.error(error)
        raise HTTPException(
            status_code=500,
            detail="Internal Server Error. Please try again later.",
        )
    except Exception as error:
        logging.error(error)
        raise HTTPException(
            status_code=500,
            detail="Internal Server Error. Please try again later.",
        )


@app.post("/email-results")
async def email_results(
    background_task: BackgroundTasks, email_results_request: EmailNameResultsRequest
):
    background_task.add_task(
        send_email, app.database, results_request=email_results_request
    )
    return {"message": "Email sent successfully"}


@app.get("/")
def index():
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
            status_code=500, detail="Internal Server Error. Please try again later."
        )
    except Exception as e:
        # fyi - raise with no argument preserves original traceback
        logging.error("An unexpected error occurred:", str(e))
        raise


@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()
