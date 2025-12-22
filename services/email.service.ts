import { mailer } from "@/lib/mailer";
import { logger } from "@/lib/logger";
import nodemailer from "nodemailer";


function baseTemplate({title,body,actionUrl,actionText,}:{title: string;body: string;actionUrl: string;actionText: string;}) {
  const brandColor = "#0B1F3B"; // Dark blue
  const accentColor = "#1E3A8A"; // Indigo
  const textColor = "#E5E7EB"; // Light gray
  const mutedText = "#9CA3AF";

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
    </head>
    <body style="margin:0;padding:0;background-color:${brandColor};font-family:Inter,Segoe UI,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 16px;">
            <table width="100%" max-width="520" style="background:#0F172A;border-radius:12px;padding:32px;">
              <tr>
                <td>
                  <h1 style="margin:0 0 16px;color:white;font-size:22px;">
                    ${title}
                  </h1>

                  <p style="color:${textColor};font-size:15px;line-height:1.6;margin-bottom:24px;">
                    ${body}
                  </p>

                  <a href="${actionUrl}"
                     style="
                       display:inline-block;
                       background:${accentColor};
                       color:white;
                       padding:12px 20px;
                       border-radius:8px;
                       text-decoration:none;
                       font-weight:600;
                       font-size:14px;
                     ">
                    ${actionText}
                  </a>

                  <p style="margin-top:32px;color:${mutedText};font-size:13px;">
                    If the button doesn’t work, copy and paste this link:
                    <br />
                    <span style="word-break:break-all;">${actionUrl}</span>
                  </p>

                  <hr style="margin:32px 0;border:none;border-top:1px solid #1F2937;" />

                  <p style="color:${mutedText};font-size:12px;">
                    If you didn’t request this, you can safely ignore this email.
                  </p>
                </td>
              </tr>
            </table>

            <p style="margin-top:16px;color:${mutedText};font-size:12px;">
              © ${new Date().getFullYear()} Your Company. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${process.env.APP_URL}/verify-email?token=${token}`;

  try {
    const info = await mailer.sendMail({
      to: email,
      subject: "Verify your email address",
      html: baseTemplate({
        title: "Verify your email",
        body: `
        Thanks for signing up! To complete your registration and secure your account,
        please verify your email address by clicking the button below.
      `,
        actionUrl: link,
        actionText: "Verify Email",
      }),
    });

    const preview = nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : undefined;
    logger.info("Verification email queued", { email, messageId: info.messageId, preview });
  } catch (err: any) {
    logger.error("Failed to send verification email", { email, error: err?.message || err });
  }
}


export async function sendPasswordResetEmail(email: string, token: string) {
  const link = `${process.env.APP_URL}/reset-password?token=${token}`;

  try {
    const info = await mailer.sendMail({
      to: email,
      subject: "Reset your password",
      html: baseTemplate({
        title: "Reset your password",
        body: `
        We received a request to reset your password. This link will expire in
        1 hour. Click the button below to set a new password.
      `,
        actionUrl: link,
        actionText: "Reset Password",
      }),
    });

    const preview = nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : undefined;
    logger.info("Password reset email queued", { email, messageId: info.messageId, preview });
  } catch (err: any) {
    logger.error("Failed to send password reset email", { email, error: err?.message || err });
  }
}
