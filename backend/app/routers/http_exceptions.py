from fastapi import HTTPException, status

incorrect_username_password_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Incorrect username or password",
    headers={"WWW-Authenticate": "Bearer"},
)


permission_denied_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Permission denied",
    headers={"WWW-Authenticate": "Bearer"},
)


credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

role_exist_exception = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Role already exist",
    headers={"WWW-Authenticate": "Bearer"},
)