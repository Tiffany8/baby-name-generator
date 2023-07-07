import logging
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import openai
from openai.error import APIError
import os
from pydantic import BaseModel, Field
from typing import List

load_dotenv()

MODEL_NAME = os.getenv("GPT_MODEL_NAME")
API_KEY = os.getenv("OPEN_API_KEY")

openai.api_key = API_KEY
app = FastAPI()


class ParentData(BaseModel):
    parent1_name: str = Field(..., description="Name of parent 1")
    parent2_name: str = Field(..., description="Name of parent 2")
    values: List[str] = Field(
        ..., description="List of values important to the parents"
    )
    cultural_backgrounds: List[str] = Field(
        ..., description="List of cultural backgrounds"
    )
    popularity: str = Field(..., description="Preference for popular names")
    role_models: str = Field(..., description="List of role models for the parents")
    family_names: str = Field(..., description="List of family names to consider")
    # Fields for importance
    parent1_name_importance: int = Field(
        ..., description="Importance of parent 1's name", ge=1, le=5
    )
    parent2_name_importance: int = Field(
        ..., description="Importance of parent 2's name", ge=1, le=5
    )
    values_importance: int = Field(..., description="Importance of values", ge=1, le=5)
    cultural_backgrounds_importance: int = Field(
        ..., description="Importance of cultural backgrounds", ge=1, le=5
    )
    popularity_importance: int = Field(
        ..., description="Importance of name popularity", ge=1, le=5
    )
    role_models_importance: int = Field(
        ..., description="Importance of role models", ge=1, le=5
    )
    family_names_importance: int = Field(
        ..., description="Importance of family names", ge=1, le=5
    )


origins = [os.getenv("REACT_APP_URL")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/generate-names")
async def generate_names(data: ParentData):
    values_str = ", ".join(data.values)
    cultural_backgrounds_str = ", ".join(data.cultural_backgrounds)
    family_names_str = (
        ", ".join(data.family_names.split(",")) if data.family_names else None
    )
    role_models_str = (
        ", ".join(data.role_models.split(",")) if data.role_models else None
    )
    popularity_bool = data.popularity == "yes"

    # Creating the message content
    content = (
        f"You are an Assistant that specializes in onomastics, linguistics, and etymology.  We are two parents."
        f"We will share with you several factors that we are considering for naming our baby. With each factor, we will rank it on a scale of 1 to 5, "
        f"with 1 being 'not important at all' and 5 being 'extremely important. The importance of each factor we provide will be denoted in this format: (importance: [1-5]/5)."
        f"Our names are {data.parent1_name} (importance: {data.parent1_name_importance}/5) and "
        f"{data.parent2_name} (importance: {data.parent2_name_importance}/5). We hold the following values: {values_str} "
        f"(importance: {data.values_importance}/5). We identify with the following cultural backgrounds: {cultural_backgrounds_str} "
        f"(importance: {data.cultural_backgrounds_importance}/5), suggest some suitable baby names. We prefer "
        f"names that are {'popular' if popularity_bool else 'not popular'} (importance: {data.popularity_importance}/5). "
    )
    if role_models_str:
        content += f" We are inspired by these role models: {role_models_str} (importance: {data.role_models_importance}/5)."

    if family_names_str:
        content += f" We would like to consider these family names: {family_names_str} (importance: {data.family_names_importance}/5)."

    content += (
        "Return the data as an object with two fields: 'preference summary' and 'names'. "
        "The 'preference_summary' should summarize the user's preferences. It should be written in a personable, conversational manner, "
        "addressing the parents by their first names.  The 'names' field should point to an array of objects.  "
        "The objects have two fields: 'name' and 'reasoning'. "
        "The field 'name' should hold the suggested name, and the field 'reasoning' should be written in a conversational, casual, and informative tone, "
        "explaining why the name was selected and the names meaning."
    )

    try:
        response = await openai.ChatCompletion.acreate(
            model=f"{MODEL_NAME}",
            messages=[{"role": "user", "content": content}],
            temperature=1,
        )
        return response["choices"][0]["message"]["content"]
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


@app.get("/")
def index():
    return {"status": "ok"}
