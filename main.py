from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os
import markdown

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

MD_PATH = Path("content/portfolio.md")

PROFILE_NAME = os.getenv("PROFILE_NAME", "Your Name")
def render_markdown(md_text: str) -> tuple[str, str]:
    md = markdown.Markdown(
        extensions=["toc", "fenced_code", "tables", "codehilite", "smarty"],
        extension_configs={
        "toc": {
            "toc_depth": "2-2",
            "slugify": lambda s, sep: "-".join(
                "".join(ch.lower() if ch.isalnum() else " " for ch in s).split()
            ),
        }
    },
    output_format="html5",
)
    body_html = md.convert(md_text)
    toc_html = md.toc
    return body_html, toc_html


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    md_text = MD_PATH.read_text(encoding="utf-8")
    body_html, toc_html = render_markdown(md_text)
    return templates.TemplateResponse(
        "page.html",
        {
            "request": request,
            "body": body_html,
            "toc": toc_html,
            "title": "Portfolio",
            "profile_name": PROFILE_NAME,
        },
    )
