// src/components/emails/email-template.tsx
import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  message,
}) => (
  <div>
    <h1>Hallo {firstName},</h1>
    <p>{message}</p>
    <p>Met vriendelijke groet,</p>
    <p>Het MindNavigator Team</p>
  </div>
);
