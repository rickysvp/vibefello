import { Resend } from "resend";
import { getResendApiKey, getResendFromEmail } from "./env";

export type EmailService = {
  sendPriorityAccessEmail: (email: string) => Promise<void>;
};

export function buildPriorityAccessEmailHtml(email: string) {
  return `
    <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 24px; color: #111827;">
      <h1 style="font-size: 28px; margin: 0 0 16px;">You're marked for priority access.</h1>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Thanks for securing priority access with VibeFello. We've marked <strong>${email}</strong> for manual priority follow-up from our team.
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Please follow our official X account for the latest product updates and launch news:
        <a href="https://x.com/vibefello">https://x.com/vibefello</a>
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin: 0;">
        We will contact you directly when there is a relevant next step.
      </p>
    </div>
  `;
}

export function createEmailService(): EmailService {
  return {
    async sendPriorityAccessEmail(email) {
      const apiKey = getResendApiKey();

      if (!apiKey) {
        return;
      }

      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: getResendFromEmail(),
        to: email,
        subject: "Your VibeFello priority access is confirmed",
        html: buildPriorityAccessEmailHtml(email),
      });
    },
  };
}
