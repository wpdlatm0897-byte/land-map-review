from fastapi import APIRouter
from app.schemas import LaunchIssueRequest
import subprocess
import os

router = APIRouter()


@router.post("/launch-issue")
def launch_issue(req: LaunchIssueRequest):
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
    automation_dir = os.path.join(root_dir, "automation")
    script_path = os.path.join(automation_dir, "gov_issue_playwright.ts")

    subprocess.Popen(
        ["npm", "run", "issue", "--", req.pnu, req.address, req.jibun],
        cwd=automation_dir,
        shell=True,
    )

    return {
        "ok": True,
        "message": "Automation launched",
        "pnu": req.pnu,
    }
