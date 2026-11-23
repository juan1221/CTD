import os
import re
import secrets
import smtplib
import ssl
from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from urllib.parse import quote, urlencode

from dotenv import load_dotenv
from flask import Flask, abort, redirect, render_template, request, session, url_for


load_dotenv()

app = Flask(__name__)
is_deployed = bool(os.getenv("VERCEL"))
is_production = (
    os.getenv("VERCEL_ENV") == "production"
    or os.getenv("FLASK_ENV") == "production"
)
secret_key = os.getenv("FLASK_SECRET_KEY")
if (is_production or is_deployed) and not secret_key:
    raise RuntimeError("FLASK_SECRET_KEY must be configured for deployment.")

app.config.update(
    SECRET_KEY=secret_key or secrets.token_hex(32),
    MAX_CONTENT_LENGTH=16 * 1024,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SECURE=is_production or is_deployed,
    SESSION_COOKIE_SAMESITE="Lax",
)

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_RECEIVER = os.getenv("EMAIL_RECEIVER")

MAX_LENGTHS = {
    "fullname": 120,
    "email": 254,
    "organization": 160,
    "message": 5000,
}
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@app.after_request
def add_security_headers(response):
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; base-uri 'self'; object-src 'none'; "
        "frame-ancestors 'none'; form-action 'self'; "
        "img-src 'self' data:; script-src 'self'; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com"
    )
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = (
        "camera=(), microphone=(), geolocation=()"
    )
    if is_production:
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains"
        )
    return response


@app.route("/")
@app.route("/index.html")
def home():
    session.setdefault("_csrf_token", secrets.token_urlsafe(32))
    return render_template("index.html")


@app.route("/send-email", methods=["POST"])
def send_email():
    submitted_token = request.form.get("csrf_token", "")
    expected_token = session.get("_csrf_token", "")
    if not expected_token or not secrets.compare_digest(
        submitted_token, expected_token
    ):
        abort(400)

    fullname = request.form.get("fullname", "").strip()
    email = request.form.get("email", "").strip()
    organization = request.form.get("organization", "").strip()
    message = request.form.get("message", "").strip()

    values = {
        "fullname": fullname,
        "email": email,
        "organization": organization,
        "message": message,
    }
    if any(len(value) > MAX_LENGTHS[field] for field, value in values.items()):
        abort(400)
    if not fullname or not EMAIL_PATTERN.fullmatch(email):
        abort(400)
    if any("\r" in value or "\n" in value for value in (fullname, email)):
        abort(400)

    if not all((SMTP_SERVER, EMAIL_SENDER, EMAIL_PASSWORD, EMAIL_RECEIVER)):
        app.logger.error("SMTP settings are incomplete.")
        abort(503)

    subject = f"Start a Confidential Conversation CTD - {fullname}"
    reply_subject = f"Re: {subject}"
    reply_url = (
        f"mailto:{quote(email, safe='@.+-_')}?"
        f"{urlencode({'subject': reply_subject, 'body': message})}"
    )
    organization_display = organization or "Not provided"
    email_css_path = Path(app.static_folder) / "css" / "tcorreo.css"
    email_css = email_css_path.read_text(encoding="utf-8")

    plain_body = f"""NEW CONFIDENTIAL CONVERSATION

Name: {fullname}
Email: {email}
Organization: {organization_display}

Message
{message}

Submitted through the CTD website."""

    html_body = render_template(
        "templates_correo.html",
        subject=subject,
        fullname=fullname,
        email=email,
        organization=organization_display,
        message=message,
        reply_url=reply_url,
        email_css=email_css,
    )

    try:
        msg = MIMEMultipart("alternative")
        msg["From"] = EMAIL_SENDER
        msg["To"] = EMAIL_RECEIVER
        msg["Subject"] = Header(subject, "utf-8")
        msg["Reply-To"] = email
        msg.attach(MIMEText(plain_body, "plain", "utf-8"))
        msg.attach(MIMEText(html_body, "html", "utf-8"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
            server.ehlo()
            server.starttls(context=ssl.create_default_context())
            server.ehlo()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, EMAIL_RECEIVER, msg.as_bytes())

    except (OSError, smtplib.SMTPException):
        app.logger.exception("Failed to send contact form email.")
        abort(503)

    session.pop("_csrf_token", None)
    return redirect(url_for("home") + "#contact")


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=int(os.getenv("PORT", "5000")),
        debug=os.getenv("FLASK_DEBUG") == "1" and not is_production,
    )
