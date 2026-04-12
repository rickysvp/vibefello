import { Resend } from "resend";
import { getResendApiKey, getResendFromEmail } from "./env";

export type EmailService = {
  sendWaitlistConfirmationEmail: (email: string) => Promise<void>;
  sendPriorityAccessEmail: (email: string) => Promise<void>;
};

export function buildWaitlistConfirmationEmailHtml(email: string) {
  return `
    <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 24px; color: #111827;">
      <h1 style="font-size: 28px; margin: 0 0 16px;">You're on the VibeFello waitlist.</h1>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        We saved <strong>${email}</strong> to the VibeFello waitlist.
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        We'll reach out as we open more access and share launch updates.
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin: 0;">
        If you decide to join the founding member club later, you'll receive a separate payment confirmation email.
      </p>
    </div>
  `;
}

export function buildPriorityAccessEmailHtml(email: string) {
  return `
    <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 24px; color: #111827;">
      <h1 style="font-size: 28px; margin: 0 0 16px;">Your founding member access is confirmed.</h1>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Thanks for joining the VibeFello founding member club. We've marked <strong>${email}</strong> for manual priority follow-up from our team.
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
    async sendWaitlistConfirmationEmail(email) {
      const apiKey = getResendApiKey();

      if (!apiKey) {
        return;
      }

      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: getResendFromEmail(),
        to: email,
        subject: "You're on the VibeFello waitlist",
        html: buildWaitlistConfirmationEmailHtml(email),
      });
    },
    async sendPriorityAccessEmail(email) {
      const apiKey = getResendApiKey();

      if (!apiKey) {
        return;
      }

      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: getResendFromEmail(),
        to: email,
        subject: "Your VibeFello founding member access is confirmed",
        html: buildPriorityAccessEmailHtml(email),
      });
    },
  };
}
