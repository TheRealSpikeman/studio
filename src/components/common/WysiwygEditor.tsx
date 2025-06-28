'use client';

import { useMemo, useState, useEffect } from 'react';

// Dynamically import to avoid SSR issues, which is the root cause of the findDOMNode error.
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface WysiwygEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function WysiwygEditor({ value, onChange, placeholder }: WysiwygEditorProps) {

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block',
    'link', 'image'
  ];
  
  // Render a loading state on the server and until the module is loaded on the client.
  if (!ReactQuill) {
    return (
       <div className="flex h-48 w-full animate-pulse items-center justify-center rounded-md border bg-muted">
        <p className="text-muted-foreground">Editor laden...</p>
      </div>
    );
  }

  return (
    <div className="wysiwyg-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-background"
        style={{ minHeight: '200px' }}
      />
    </div>
  );
}
