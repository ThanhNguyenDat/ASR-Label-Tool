import os
from dotenv import load_dotenv

load_dotenv('.env')

from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import json

import psycopg2

from .routes import users

app = FastAPI()

# cors
origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    users.router,
    prefix="/api/v1/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


@app.get("/")
async def hello():
    
    data = []
    
    content = {
        "error_code": 0,
        "data": data
    }
    return JSONResponse(content=content)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, port=5000)
