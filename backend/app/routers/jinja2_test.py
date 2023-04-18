from fastapi import APIRouter, Request

from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import requests

router = APIRouter()

templates = Jinja2Templates(directory="templates")

@router.get("/items/1", response_class=HTMLResponse)
async def read_item_1(request: Request):
    return templates.TemplateResponse("item.html", {"request": request, "id": 1})

@router.get("/test_react")
async def test_react(request: Request):
    return templates.TemplateResponse("build/index.html", {"request": request, "id": 1})
