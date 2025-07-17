// src/app/dashboard/admin/documentation/components/CodeBlock.tsx
"use client";

export const CodeBlock = ({ code, language }: { code: string; language: string }) => (
    <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
    </pre>
);
