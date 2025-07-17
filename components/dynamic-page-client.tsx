// components/dynamic-page-client.tsx
"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

// Custom components that can be used in MDX
const components = {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  // Add any other components you want to use in MDX here
};

interface DynamicPageClientProps {
  source: MDXRemoteSerializeResult;
  title: string;
}

export default function DynamicPageClient({ source, title }: DynamicPageClientProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50/50 py-12 md:py-20">
        <div className="container mx-auto max-w-3xl">
          <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80">
            <h1>{title}</h1>
            {/* @ts-ignore */}
            <MDXRemote {...source} components={components} />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
