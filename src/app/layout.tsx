import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: 'MindNavigator – Ontdek je unieke sterktes en uitdagingen',
  description: 'MindNavigator helpt jou via korte quizzes, verdiepende subtests en dagelijkse coaching om je neurodiversiteitsprofiel te ontdekken en te benutten.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${GeistSans.variable} font-sans antialiased`}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
