# api/dispatch.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Literal, Optional, List, Dict, Any
from uuid import uuid4
from app.client.mcp_client import call_tool

router = APIRouter(prefix="/dispatch", tags=["dispatch"])


class SendEmailAndCalArgs(BaseModel):
    to: str = Field(..., description="Recipient email")
    subject: str = Field(..., description="Email subject")
    body: str = Field(..., description="Email body")
    summary: str = Field(..., description="Calendar event title")
    start: str = Field(..., description="Start time, ISO8601 with timezone")
    end: str = Field(..., description="End time, ISO8601 with timezone")
    description: Optional[str] = Field(None, description="Event description")
    location: Optional[str] = Field(None, description="Event location")
    attendees: List[str] = Field(default_factory=list, description="Attendee email list")
    alarm_minutes_before: Optional[int] = Field(None, description="Reminder minutes before event")
    timezone: str = Field("Australia/Sydney", description="Event timezone")
    calendarapp: Literal["none", "google", "outlook"] = Field(
        "none", description="Calendar platform: none (ICS only), google, or outlook"
    )
    access_token: Optional[str] = Field(
        None, description="OAuth2 access token, required only for google/outlook mode"
    )
    calendar_id: Optional[str] = Field(
        None, description="Target calendar ID, required only for google/outlook mode"
    )


@router.post(
    "/send-email-and-calendar", summary="Send email + calendar via chosen platform"
)
async def send_email_and_calendar(args: SendEmailAndCalArgs):
    uid = f"{uuid4()}@dispatchai"

    if args.calendarapp == "none":
        tool_id = "send_email_with_ics"
    elif args.calendarapp == "google":
        tool_id = "send_email_with_google_calendar"
    elif args.calendarapp == "outlook":
        tool_id = "send_email_with_outlook_calendar"
    else:
        raise HTTPException(status_code=400, detail="Invalid calendarapp value")

    if args.calendarapp in ("google", "outlook"):
        if not args.access_token or not args.calendar_id:
            raise HTTPException(
                status_code=400,
                detail="When calendarapp is google or outlook, access_token and calendar_id are required",
            )

    payload: Dict[str, Any] = {
        "to": args.to,
        "subject": args.subject,
        "body": args.body,
        "uid": uid,
        "summary": args.summary,
        "start": args.start,
        "end": args.end,
        "description": args.description,
        "location": args.location,
        "attendees": args.attendees,
        "alarm_minutes_before": args.alarm_minutes_before,
        "timezone": args.timezone,
    }

    if args.calendarapp in ("google", "outlook"):
        payload.update(
            {
                "access_token": args.access_token,
                "calendar_id": args.calendar_id,
            }
        )

    try:
        raw = await call_tool(tool_id, payload)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"MCP call to {tool_id} failed: {exc}")

    result = getattr(raw, "model_dump", lambda: raw)()
    return {
        "status": "ok",
        "used_tool": tool_id,
        "result": result,
    }
