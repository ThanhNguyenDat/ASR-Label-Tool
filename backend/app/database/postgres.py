import os
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from ..models.accountModel import Base

engine = create_engine(os.environ["POSTGRES_CONNECT_STRING"])

Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)