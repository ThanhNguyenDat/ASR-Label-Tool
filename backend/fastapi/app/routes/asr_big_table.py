from datetime import timedelta
import json
import requests

from fastapi import Depends, APIRouter, Request, Query, Response, HTTPException, status
from fastapi.responses import JSONResponse

from passlib.context import CryptContext

from typing_extensions import Annotated
from ..database import Database
import psycopg2
import jiwer

config = {
    "host": "localhost",
    # "port": 8210,
    # "host": "postgres-db-asr-label",
    "user": "postgres",
    "password": "postgres",
    "port": 5432,
    "database": "asr_label_log",   
}


db = Database(**config)

router = APIRouter()
