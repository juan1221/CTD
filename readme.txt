# CTD


Debes instalar el Python
winget install Python.Python.3.11

Debes instalar Flask
pip install Flask 
#(Copia y pega este codigo en la terminar de la raiz de tu proyecto)

#Debes instalar el dotenv para las varibles de entorno

pip install python-dotenv 
pip install Flask python-dotenv



#Definir las variables de entorno en un archivo llamado .env

SMTP_SERVER=smtp.office365.com /* o el de Gmail*/
SMTP_PORT=587
EMAIL_SENDER= Correo a la que quieres recibir los emails
EMAIL_PASSWORD=contraseña real o una contraseña de aplicacion( para eso tienes que tener activado el factor de autenticacion de dos factores)
EMAIL_RECEIVER= Pon el mismo correo que pusiste arriba


#Quedara algo asi

import os
from flask import Flask, request, render_template_string, render_template
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from dotenv import load_dotenv

# Cargar las variables del archivo .env
load_dotenv()

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

