import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const SendNewsletterSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  html: z.string().min(1),
});

export const sendNewsletterEmail = createServerFn({ method: "POST" })
  .validator((d: any) => SendNewsletterSchema.parse(d))
  .handler(async ({ data }) => {
    const { to, subject, html } = data;

    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    try {
      const { data: emailData, error } = await resend.emails.send({
        from: "FinanceHub USA <newsletter@financehubusa.example>",
        to: [to],
        subject: subject,
        html: html,
      });

      if (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
      }

      return { success: true, id: emailData?.id };
    } catch (error: any) {
      console.error("Error sending email:", error);
      throw new Error(error?.message || "Failed to send email");
    }
  });

// Función para enviar un correo de bienvenida
export const sendWelcomeEmail = createServerFn({ method: "POST" })
  .validator((d: { email: string; name?: string }) => z.object({
    email: z.string().email(),
    name: z.string().optional(),
  }).parse(d))
  .handler(async ({ data }) => {
    const { email, name } = data;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to FinanceHub USA</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #0b2545; }
          .accent { color: #6ee7b7; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <h1>Welcome to <span class="accent">FinanceHub USA</span> 🎉</h1>
        <p>Hi ${name || "there"},</p>
        <p>Thanks for subscribing to <strong>FinanceHub USA</strong>! You'll now receive:</p>
        <ul>
          <li>📈 Daily market updates</li>
          <li>💰 Personal finance tips</li>
          <li>📊 Investment strategies</li>
          <li>🚀 Exclusive content and tools</li>
        </ul>
        <p>We're excited to help you build lasting wealth!</p>
        <p>Cheers,<br><strong>The FinanceHub Team</strong></p>
        <div class="footer">
          <p>You're receiving this email because you subscribed to FinanceHub USA.</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8080'}/unsubscribe?email=${email}">Unsubscribe</a> at any time.</p>
        </div>
      </body>
      </html>
    `;

    return sendNewsletterEmail({ data: { to: email, subject: "Welcome to FinanceHub USA! 🎉", html } });
  });