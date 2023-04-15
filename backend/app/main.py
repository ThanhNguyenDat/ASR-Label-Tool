import os
from dotenv import load_dotenv

load_dotenv('.env')

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi_sqlalchemy import DBSessionMiddleware, db

# from .dependencies import get_query_token, get_token_header

from .internal import admin
from .routers import account, jinja2_test

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

# postgres db
app.add_middleware(DBSessionMiddleware, db_url=os.environ['POSTGRES_CONNECT_STRING'])

app.include_router(
    account.router,
    prefix="/api/account",
    tags=["account"],
    responses={404: {"description": "Not found"}},
    # dependencies=[Depends()],    
)
# app.include_router(
#     admin.router,
#     prefix="/admin",
#     tags=['admin'],
#     dependencies=[],
#     response={418, {"description": "I'm Iron Man"}}
# )

# test template jinja2
app.include_router(
    jinja2_test.router,
    prefix="/api/jinja2-test",
    tags=["jinja2_test"],
    responses={404: {"description": "Not found"}},
)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, port=5000)

