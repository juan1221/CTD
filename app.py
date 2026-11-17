import os
from flask import Flask, request, render_template_string, render_template
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from dotenv import load_dotenv


load_dotenv

app = Flask(__name__)

# ==========================
# CONFIGURACIÓN SMTP (Desde Variables de Entorno)
# ==========================

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.office365.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))

EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

# Correo destino (puedes sacarlo también del .env o dejarlo fijo)
EMAIL_RECEIVER = os.getenv("EMAIL_RECEIVER")

# ==========================
# RUTA PRINCIPAL
# ==========================

@app.route('/')
def home():
    return render_template('index.html')


# ==========================
# ENVÍO DE CORREO
# ==========================

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

        msg.attach(
            MIMEText(
                body,
                "plain",
                "utf-8"
            )
        )

        server = smtplib.SMTP(
            SMTP_SERVER,
            SMTP_PORT
        )

        server.ehlo()
        server.starttls()
        server.ehlo()

        server.login(
            EMAIL_SENDER,
            EMAIL_PASSWORD
        )

        # Enviar en bytes UTF-8
        server.sendmail(
            EMAIL_SENDER,
            EMAIL_RECEIVER,
            msg.as_bytes()
        )

        server.quit()

        return render_template('index.html')
       

    except Exception as e:

        print("ERROR:", str(e))

        return f"""
        <h2>Error enviando correo</h2>
        <pre>{str(e)}</pre>
        """


# ==========================
# EJECUCIÓN
# ==========================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )


