import psycopg2
import json
import time
from datetime import datetime

from ailabtools.connection_pool_postgresql import ConnectionPoolPostgreSql

config = {
    "min": 2,
    "max": 3,
    "host": "localhost",
    "port": 5432,
    "user": "postgres",
    "password": "postgres",
    "database": "asr_label_log",
    "n_try": 1,
    "folder_log": "log",
    "keep_connection": True,
    "project_name": "ConnectionPoolPostgreSql",
    "print_log": False
}

def json_default(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f'Object of type {obj.__class__.__name__} is not JSON serializable')


class Database():
    def __init__(self, host, port, user, password, database):
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.database = database
    
    def connect(self):
        create_conn = psycopg2.connect(user=self.user, 
                                       password=self.password,
                                       host=self.host,
                                       port=self.port,
                                       database=self.database)
        create_conn.set_session(autocommit=True)
        return create_conn
    

    def close_cur_and_conn(self, cur, conn):
        try:
            cur.close()
        except:
            pass
        
        try:
            conn.rollback()
        except:
            pass
        
        try:
            conn.close()
        except:
            pass

    def execute(self, *args, **kwargs):
        conn = self.connect()

        if(conn is None):
            print("ERROR: ", "Cannot create connection to db")
            return None
        result = None

        try:
            cur = conn.cursor()
            cur.execute(*args, **kwargs)
            result = cur.fetchall()
        except:
            result = None
            self.close_cur_and_conn(cur, conn)
        result = json.loads(json.dumps(result, default=json_default))
        return result
    
    def parseColumnToKey(self, result):
        return [{
            result
        }]

def get_db():
    try:
        conn = psycopg2.connect(**config)
        db = conn.cursor()
        yield db
    finally:
        db.close()
