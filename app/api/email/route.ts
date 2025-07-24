import { EmailTemplate } from "@/components/emails/email-template";
import { Resend } from "resend";
import * as React from "react";

let resend: Resend | null = null;

if (process.env.RESEND_API_KEY) {
  try {
    resend = new Resend(process.env.RESEND_API_KEY);
  } catch (error) {
    console.error("Failed to initialize Resend client:", error);
    resend = null; // Ensure resend is null if initialization fails
  }
} else {
  // This log will appear in the server console during development or when the API route is first hit.
  // In a production environment, you'd typically ensure RESEND_API_KEY is always set.
  // For local development, you might not want this log on every hot reload if the key is intentionally missing.
  // However, for diagnosing startup issues, it's useful.
  if (process.env.NODE_ENV === 'development') {
    console.warn("RESEND_API_KEY is not set. Email functionality via /api/email will be disabled.");
  }
}

export async function POST(request: Request) {
  if (!resend) {
    console.error("Resend client is not initialized. RESEND_API_KEY might be missing or invalid.");
    return Response.json({ error: "Email service not configured or failed to initialize." }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { email, subject, message } = body;

    if (!email || !subject || !message) {
      return Response.json({ error: "Missing required fields: email, subject, or message." }, { status: 400 });
    }

    const fromAddress = process.env.RESEND_FROM_EMAIL || "MindNavigator <onboarding@resend.dev>";

    const data = await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject: subject,
      react: EmailTemplate({ firstName: "Gebruiker", message: message }) as React.ReactElement, // Assuming firstName might be dynamic later
      text: message,
    });

    if (data.error) {
      console.error("Resend API Error:", data.error);
      return Response.json({ error: data.error.message || "Failed to send email via Resend." }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Error in email POST handler:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while processing the email request.";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
