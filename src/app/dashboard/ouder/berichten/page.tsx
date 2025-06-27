// src/app/dashboard/ouder/berichten/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessagesSquare, Send, PlusCircle, Search, User, FileText, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import type { Conversation, Message } from '@/types';
import { dummyConversations } from '@/lib/data/dummy-data';

export default function BerichtencentrumPage() {
  const [conversations, setConversations] = useState<Conversation[]>(dummyConversations.sort((a,b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime()));
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [selectedConversation?.messages]);
  useEffect(() => { 
    if (selectedConversation) {
        setTimeout(scrollToBottom, 0); 
    }
  }, [selectedConversation]);


  const handleSelectConversation = (convId: string) => {
    const newSelectedConv = conversations.find(c => c.id === convId);
    if (newSelectedConv) {
        setSelectedConversation(newSelectedConv);
        setConversations(prev => prev.map(c => 
            c.id === convId ? {...c, unreadCount: 0, messages: c.messages.map(m => ({...m, isRead: true}))} : c
        ));
    }
  };
  
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !selectedConversation) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'ouder',
      text: newMessage,
      timestamp: new Date().toISOString(),
      isRead: true,
    };
    
    const updatedConversation = {
        ...selectedConversation,
        messages: [...selectedConversation.messages, newMsg],
        lastMessage: newMessage, 
        lastMessageTimestamp: newMsg.timestamp, 
    };
    setSelectedConversation(updatedConversation);

    setConversations(prev => prev.map(c => 
      c.id === selectedConversation.id ? updatedConversation : c
    ).sort((a,b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime())
    );
    setNewMessage('');
  };
  
  const handleNewConversation = () => {
    alert("Nieuw gesprek starten (gesimuleerd). In een echte app kunt u hier een kind en tutor selecteren waarvan het kind les heeft gehad.");
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      tutorId: 'new-tutor-id',
      tutorName: 'Nieuwe Tutor (Voorbeeld)',
      tutorAvatar: `https://placehold.co/40x40.png?text=${getInitials('Nieuwe Tutor')}`,
      childName: 'Selecteer Kind',
      lastMessage: 'Start van nieuw gesprek...',
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0,
      messages: [{id: 'init', sender: 'ouder', text: 'Hallo, ik wil graag een vraag stellen over...', timestamp: new Date().toISOString(), isRead: true}],
    };
    setConversations(prev => [newConv, ...prev.sort((a,b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime())]);
    setSelectedConversation(newConv);
  };

  const truncateMessage = (message: string, maxLength: number = 20): string => {
    if (message.length > maxLength + 2) { // +2 to account for ".."
      return message.substring(0, maxLength) + "..";
    }
    return message;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <MessagesSquare className="h-8 w-8 text-primary" />
          Berichtencentrum
        </h1>
        <p className="text-muted-foreground">
          Communiceer hier direct met de tutors van uw kinderen.
        </p>
      </div>

      <Card className="shadow-lg h-[calc(100vh-230px)] flex flex-col">
        <CardHeader className="flex-row items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Input placeholder="Zoek gesprekken..." className="max-w-xs h-9 hidden sm:block" />
            <Button variant="outline" size="icon" className="h-9 w-9 sm:hidden"><Search className="h-4 w-4"/></Button>
          </div>
          <Button onClick={handleNewConversation} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> Nieuw Gesprek
          </Button>
        </CardHeader>
        <div className="flex flex-1 overflow-hidden">
          {/* Conversations List */}
          <ScrollArea className="w-full md:w-1/3 border-r bg-muted/30">
            <div className="p-2 space-y-1.5">
              {conversations.map(conv => (
                <Button
                  key={conv.id}
                  variant="ghost"
                  className={cn(
                    "w-full h-auto justify-start p-3 text-left rounded-md",
                    selectedConversation?.id === conv.id 
                      ? "bg-accent text-accent-foreground shadow-sm" 
                      : "bg-card hover:bg-muted/50 text-card-foreground"
                  )}
                  onClick={() => handleSelectConversation(conv.id)}
                >
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={conv.tutorAvatar} alt={conv.tutorName} data-ai-hint="person avatar" />
                    <AvatarFallback>{getInitials(conv.tutorName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden space-y-0.5">
                    <div className="flex justify-between items-center">
                        <p className={cn("truncate text-sm", selectedConversation?.id === conv.id ? "text-accent-foreground font-semibold" : "text-foreground font-medium")}>{conv.tutorName}</p>
                        {conv.unreadCount > 0 && (
                            <Badge variant={selectedConversation?.id === conv.id ? "default" : "secondary"} className={cn(selectedConversation?.id === conv.id ? "bg-background text-foreground" : "bg-primary/20 text-primary", "h-5 px-1.5 text-xs")}>{conv.unreadCount}</Badge>
                        )}
                    </div>
                    <p className={cn("text-xs truncate", selectedConversation?.id === conv.id ? "text-accent-foreground/80" : "text-muted-foreground")}>Kind: {conv.childName}</p>
                    <p className={cn("text-xs", selectedConversation?.id === conv.id ? "text-accent-foreground/80" : "text-muted-foreground")}>
                      {truncateMessage(conv.lastMessage, 22)}
                    </p>
                     <p className={cn("text-[10px] mt-0.5", selectedConversation?.id === conv.id ? "text-accent-foreground/70" : "text-muted-foreground/80")}>
                        <FormattedDateCell isoDateString={conv.lastMessageTimestamp} dateFormatPattern="p" />
                    </p>
                  </div>
                </Button>
              ))}
              {conversations.length === 0 && (
                <p className="p-4 text-center text-sm text-muted-foreground">Geen gesprekken gestart.</p>
              )}
            </div>
          </ScrollArea>

          {/* Message View */}
          <div className="flex-1 flex flex-col bg-background">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b p-3 bg-card">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                         <AvatarImage src={selectedConversation.tutorAvatar} alt={selectedConversation.tutorName} data-ai-hint="person avatar" />
                        <AvatarFallback>{getInitials(selectedConversation.tutorName)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-md font-semibold">{selectedConversation.tutorName}</CardTitle>
                        <CardDescription className="text-xs">Gesprek over {selectedConversation.childName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <ScrollArea className="flex-1 p-4 bg-muted/10">
                  {selectedConversation.messages.map(msg => (
                    <div 
                      key={msg.id} 
                      className="w-full flex mb-6"
                    >
                      <div className={cn("max-w-[85%] sm:max-w-[75%]", msg.sender === 'ouder' ? 'ml-auto' : 'mr-auto')}>
                        <div className={cn(
                          "p-3 rounded-xl text-sm shadow",
                          msg.sender === 'ouder' 
                            ? 'bg-primary text-primary-foreground rounded-br-none' 
                            : 'bg-card text-card-foreground border rounded-bl-none'
                        )}>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        <p className={cn(
                          "text-[10px] text-muted-foreground/70 mt-1",
                          msg.sender === 'ouder' ? 'text-right pr-1' : 'text-left pl-1'
                        )}>
                          <FormattedDateCell isoDateString={msg.timestamp} dateFormatPattern="p" />
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </ScrollArea>
                <CardFooter className="p-3 border-t bg-card">
                  <div className="flex w-full items-center gap-2">
                    <Textarea
                      placeholder="Typ een bericht..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage();}}}
                      rows={1}
                      className="min-h-[40px] max-h-[100px] resize-none text-sm"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="icon" className="h-10 w-10">
                      <Send className="h-5 w-5" />
                      <span className="sr-only">Verstuur</span>
                    </Button>
                  </div>
                </CardFooter>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/20">
                <MessageCircle className="h-16 w-16 text-muted-foreground/40 mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground">Selecteer een gesprek</h3>
                <p className="text-sm text-muted-foreground">Of start een nieuw gesprek met een tutor.</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
