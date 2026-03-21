# api/email.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import uuid4

import pendulum
from app.services.ses_email import send_plain_email, send_email_with_ics
from app.services.ics_lib import build_ics_request, build_ics_cancel

router = APIRouter(
    prefix="/email",
    tags=["email"],
    responses={404: {"description": "Not found"}},
)


class BaseMailArgs(BaseModel):
    to: str = Field(..., description="Recipient email")
    subject: str = Field(..., description="Email subject")
    body: str = Field(..., description="Plain text body")


class EventInfo(BaseModel):
    uid: Optional[str] = Field(None, description="Event UID; auto-generated when omitted")
    summary: str = Field(..., description="Event title")
    start: datetime = Field(..., description="Start time, ISO8601")
    end: datetime = Field(..., description="End time, ISO8601")
    description: Optional[str] = Field(None, description="Event description")
    location: Optional[str] = Field(None, description="Event location")
    organizer_name: str = Field("DispatchAI", description="Organizer name")
    organizer_email: str = Field("no-reply@dispatchai.com", description="Organizer email")
    attendees: List[str] = Field(default_factory=list, description="Participant email list")
    sequence: int = Field(0, description="Update sequence number, increment on update/cancel")
    rrule: Optional[Dict[str, Any]] = Field(
        None,
        description='Recurrence rule, for example {"freq":"DAILY","count":5} or {"freq":"WEEKLY","interval":1}',
    )
    alarm_minutes_before: Optional[int] = Field(None, description="Reminder minutes before event")
    cancel: bool = Field(False, description="Whether to cancel (CANCEL)")
    timezone: str = Field(
        "Australia/Sydney", description="Event timezone (IANA name), defaults to Sydney"
    )


class SendPlainArgs(BaseMailArgs):
    pass


@router.post(
    "/send",
    summary="Send plain email",
    operation_id="send_email",
)
async def send_email(args: SendPlainArgs):
    try:
        await send_plain_email(args.to, args.subject, args.body)
        return {"status": "ok", "sent_to": args.to}
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


class SendICSArgs(BaseMailArgs, EventInfo):
    pass


def _to_pendulum_with_tz(dt: datetime, tz_name: str) -> pendulum.DateTime:
    return pendulum.instance(dt, tz=tz_name)


@router.post(
    "/send-ics",
    summary="Send email with ICS invite",
    operation_id="send_email_with_ics",
)
async def send_email_with_ics_api(args: SendICSArgs):
    try:
        if args.end <= args.start:
            raise HTTPException(status_code=400, detail="end must be after start")

        uid = args.uid or f"{uuid4()}@dispatchai"
        start = _to_pendulum_with_tz(args.start, args.timezone)
        end = _to_pendulum_with_tz(args.end, args.timezone)

        if args.cancel:
            ics = build_ics_cancel(
                uid=uid,
                summary=args.summary,
                start=start,
                end=end,
                organizer_email=args.organizer_email,
                organizer_name=args.organizer_name,
                attendees=args.attendees,
                sequence=max(1, args.sequence),
            )
            method = "CANCEL"
        else:
            ics = build_ics_request(
                uid=uid,
                summary=args.summary,
                start=start,
                end=end,
                description=args.description,
                location=args.location,
                organizer_email=args.organizer_email,
                organizer_name=args.organizer_name,
                attendees=args.attendees,
                sequence=args.sequence,
                rrule=args.rrule,
                alarm_minutes_before=args.alarm_minutes_before,
            )
            method = "REQUEST"

        await send_email_with_ics(
            to=args.to,
            subject=args.subject,
            body=args.body,
            ics_content=ics,
            method=method,
        )
        return {
            "status": "ok",
            "sent_to": args.to,
            "uid": uid,
            "method": method,
            "sequence": args.sequence,
            "timezone": args.timezone,
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


class SendGoogleCalArgs(BaseMailArgs, EventInfo):
    access_token: str = Field(..., description="Google OAuth Access Token")
    calendar_id: str = Field(..., description="Target calendar ID")


@router.post(
    "/send-google-calendar",
    summary="Create event in Google Calendar",
    operation_id="send_email_with_google_calendar",
)
async def send_email_with_google_calendar(args: SendGoogleCalArgs):
    """
    TODO: Call Google Calendar API via an HTTP client. Example implementation is provided in docs.
    """
    # Temporarily return received parameters until implementation is completed.
    return {
        "status": "pending",
        "tool": "google_calendar",
        "received": args.model_dump(),
    }


class SendOutlookCalArgs(BaseMailArgs, EventInfo):
    access_token: str = Field(..., description="Outlook OAuth Access Token")
    calendar_id: str = Field(..., description="Target calendar ID")


@router.post(
    "/send-outlook-calendar",
    summary="Create event in Outlook Calendar",
    operation_id="send_email_with_outlook_calendar",
)
async def send_email_with_outlook_calendar(args: SendOutlookCalArgs):
    """
    TODO: Call Microsoft Graph API via an HTTP client. Example implementation is provided in docs.
    """
    return {
        "status": "pending",
        "tool": "outlook_calendar",
        "received": args.model_dump(),
    }
