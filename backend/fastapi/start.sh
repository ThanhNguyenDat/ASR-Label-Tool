fuser -k -n tcp 6002
python3 -m uvicorn app:app --host 0.0.0.0 --port 6002 --workers 5
