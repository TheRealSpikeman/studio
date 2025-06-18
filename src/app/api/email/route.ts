"use server";

import { EmailTemplate } from "@/components/emails/email-template";
import { Resend } from "resend";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, subject, message } = body;
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      react: EmailTemplate({ firstName: "voornaam", message: message }) as React.ReactElement,
      text: message,
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
