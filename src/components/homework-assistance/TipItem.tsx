// src/components/homework-assistance/TipItem.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Youtube, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';


interface TipItemProps {
  title: string;
  description: string;
  type: 'article' | 'video';
}

export function TipItem({ title, description, type }: TipItemProps) {
  const [isRead, setIsRead] = useState(false);
  const { toast } = useToast();

  const handleMarkAsRead = () => {
    setIsRead(!isRead);
    toast({
        title: isRead ? "Tip gemarkeerd als ongelezen" : "Tip gemarkeerd als gelezen",
        description: `"${title}" is ${isRead ? 'nu ongelezen' : 'nu gelezen'}.`
    });
  };

  const Icon = type === 'article' ? FileText : Youtube;

  return (
    <Card className={`transition-all duration-300 ${isRead ? 'bg-green-50 border-green-200' : 'bg-card hover:shadow-md'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${isRead ? 'text-green-600' : 'text-primary'}`} />
            <CardTitle className={`text-lg ${isRead ? 'text-green-700' : 'text-foreground'}`}>{title}</CardTitle>
          </div>
          <Button 
            variant={isRead ? "default" : "outline"} 
            size="sm" 
            onClick={handleMarkAsRead}
            className={isRead ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isRead && <Check className="mr-2 h-4 w-4" />}
            {isRead ? 'Gelezen' : 'Markeer als gelezen'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className={`text-sm ${isRead ? 'text-green-800' :'text-muted-foreground'}`}>{description}</p>
      </CardContent>
    </Card>
  );
}
