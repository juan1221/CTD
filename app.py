import os
from flask import Flask, request, render_template, redirect, url_for
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header


#from dotenv import load_dotenv

# CORRECCIÓN 1: Agregar los paréntesis a load_dotenv()

#load_dotenv()
app = Flask(__name__)

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = os.getenv("SMTP_PORT")
EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_RECEIVER = os.getenv("EMAIL_RECEIVER")



@app.route('/')

@app.route('/index.html')
def home():
    return render_template('index.html')


@app.route('/send-email', methods=['POST'])
def send_email():
    fullname = request.form.get('fullname', '').strip()
    email = request.form.get('email', '').strip()
    organization = request.form.get('organization', '').strip()
    message = request.form.get('message', '').strip()

    subject = f"Start a Confidential Conversation CTD - {fullname}"

    body = f"""
New Contact Form Submission

Name: {fullname}
Email: {email}
Organization: {organization}
Message:
{message}
"""

    try:
        msg = MIMEMultipart()
        msg["From"] = EMAIL_SENDER
        msg["To"] = EMAIL_RECEIVER
        msg["Subject"] = Header(subject, "utf-8")
        msg.attach(MIMEText(body, "plain", "utf-8"))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)

        server.sendmail(EMAIL_SENDER, EMAIL_RECEIVER, msg.as_bytes())
        server.quit()

        # CORRECCIÓN 2: Redirigir en lugar de renderizar directamente
        return redirect(url_for('contact'))

    except Exception as e:
        print("ERROR:", str(e))
        return f"""
        <h2>Error enviando correo</h2>
        <pre>{str(e)}</pre>
        """

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)