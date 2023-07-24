import logging
from jinja2 import Environment, FileSystemLoader
import os
import time
from pathlib import Path
from dotenv import load_dotenv
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pymongo.errors import (
    ConfigurationError,
    ConnectionFailure,
    ServerSelectionTimeoutError,
    OperationFailure,
    InvalidOperation,
)
from pydantic import BaseModel, Field

from database import get_name_results_by_id

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAILGUN_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAILGUN_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=os.getenv("MAILGUN_PORT"),
    MAIL_SERVER=os.getenv("MAILGUN_SERVER"),
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=False,
    TEMPLATE_FOLDER=Path(__file__).parent / "templates",
)


class EmailNameResultsSchema(BaseModel):
    email_address: str = Field(..., description="List of emails to send to")
    results_id: str = Field(..., description="ID of results to send")


def load_template(template_name, **kwargs):
    env = Environment(loader=FileSystemLoader(os.path.join(os.getcwd(), "templates")))
    template = env.get_template(template_name)
    return template.render(**kwargs)


async def send_email(client, results_request: EmailNameResultsSchema, retries=3):
    try:
        name_results = await get_name_results_by_id(client, results_request.results_id)
    except (
        ConfigurationError,
        ConnectionFailure,
        ServerSelectionTimeoutError,
        OperationFailure,
        InvalidOperation,
    ) as error:
        logging.error(f"An error occurred while querying the database: {error}")
        return

    for _ in range(retries):
        try:
            name_results["app_url"] = os.getenv("REACT_APP_URL")
            message = MessageSchema(
                subject="Your Baby Name Results",
                recipients=[results_request.email_address],
                template_body=name_results,
                subtype=MessageType.html,
            )
            fm = FastMail(conf)
            await fm.send_message(message, template_name="name_results_email.html")
            return
        except Exception as e:
            logging.error(f"An error occurred while sending the email: {e}")
            time.sleep(5)  # Wait for 5 seconds before retrying
    logging.error(f"Failed to send email after {retries} attempts")
