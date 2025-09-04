import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from dotenv import load_dotenv

load_dotenv()

def send_contact_email(name: str, email: str, message: str):
    sender_email = os.getenv("SENDER_EMAIL")
    receiver_email = os.getenv("RECEIVER_EMAIL")
    google_email_api_pass = os.getenv("GOOGLE_EMAIL_API_PASS")

    if not all([sender_email, receiver_email, google_email_api_pass]):
        raise ValueError("Missing email configuration in environment variables")

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Reply-To"] = email
    msg["Subject"] = f"New contact form submission from {name}"

    body = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, google_email_api_pass)
        text = msg.as_string()
        server.sendmail(sender_email, receiver_email, text)
        server.quit()
    except Exception as e:
        # You might want to log this error
        print(f"Failed to send email: {e}")
        raise
