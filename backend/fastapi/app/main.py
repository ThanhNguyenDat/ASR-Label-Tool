import os
from dotenv import load_dotenv

load_dotenv('.env')

from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import requests

import json

import psycopg2

from .routes import asr_benchmark, users, asr_label, asr_segments

app = FastAPI()

# cors
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    
    # port of flask api
    "http://localhost:5000",
    "http://localhost:8003",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(asr_segments.router)
app.include_router(asr_label.router)
app.include_router(asr_benchmark.router)

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

