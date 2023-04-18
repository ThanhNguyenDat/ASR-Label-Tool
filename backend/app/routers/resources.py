import sys
sys.path.append("src")

from fastapi import APIRouter, UploadFile, File, Request
from fastapi.responses import FileResponse

import uuid

IMAGE_DIR = "/code/app/resources/images/"

router = APIRouter()

@router.post("/upload/image")
async def upload_image(request: Request, file: UploadFile = File(...) ):
    file.filename = f"{uuid.uuid4()}.jpg"
    contents = await file.read()
    # print('contents: ', contents)
    path_image = f"{IMAGE_DIR}{file.filename}" 
    # save file
    with open(path_image, "wb") as f:
        f.write(contents)
    # response = {'url': f'{request.url.scheme}://{request.url.hostname}:{request.url.port}{path_image}'}
    # print("response: ", response)
    # response = {'url': 'https://www.seiu1000.org/sites/main/files/imagecache/hero/main-images/camera_lense_0.jpeg'}
    # return response
    return FileResponse(path_image)