from .brevo_client import BrevoClient
from .email_templates import EmailTemplates

class EmailService:
    def __init__(self):
        self.client = BrevoClient()

    async def send_account_confirmation(self, email: str, nombre: str, confirmation_link: str):
        payload = {
            "to": [{"email": email, "name": nombre}],
            "templateId": EmailTemplates.ACCOUNT_CONFIRMATION,
            "params": {
                "nombre": nombre,
                "confirmationLink": confirmation_link
            }
        }
        return await self.client.send_email(payload)

    async def send_password_reset(self, email: str, nombre: str, resetPasswordLink: str):
        payload = {
            "to": [{"email": email, "name": nombre}],
            "templateId": EmailTemplates.PASSWORD_RESET,
            "params": {
                "nombre": nombre,
                "resetPasswordLink": resetPasswordLink
            }
        }
        return await self.client.send_email(payload)
