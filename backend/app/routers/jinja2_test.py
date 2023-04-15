from fastapi import APIRouter, Request

from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

router = APIRouter()

templates = Jinja2Templates(directory="templates")

@router.get("/items/1", response_class=HTMLResponse)
async def read_item_1(request: Request):
    return templates.TemplateResponse("item.html", {"request": request, "id": 1})


@router.get("/items/2", response_class=HTMLResponse)
async def read_item_2(request: Request):
    return templates.TemplateResponse("item2.html", {"request": request, "id": 2})
