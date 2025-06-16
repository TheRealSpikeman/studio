// src/app/dashboard/ouder/berichten/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessagesSquare, Send, PlusCircle, Search, Users, FileText, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell'; // Assuming this can be reused for time formatting

interface Message {
  id: string;
  sender: 'ouder' | 'tutor';
  text: string;
  timestamp: string; // ISO string
  isRead?: boolean;
}

interface Conversation {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  childName: string; // Associated child
  lastMessage: string;
  lastMessageTimestamp: string; // ISO string
  unreadCount: number;
  messages: Message[];
}

const dummyConversations: Conversation[] = [
  {
    id: 'conv1',
    tutorId: 'tutor1',
    tutorName: 'Mevr. Jansen',
    tutorAvatar: 'https://picsum.photos/seed/jansen/40/40',
    childName: 'Sofie de Tester',
    lastMessage: 'Prima, dan zie ik Sofie volgende week dinsdag om 15:00.',
    lastMessageTimestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    messages: [
      { id: 'm1a', sender: 'ouder', text: 'Hoi Mevr. Jansen, zou de les van Sofie aanstaande dinsdag een half uurtje later kunnen?', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { id: 'm1b', sender: 'tutor', text: 'Hallo! Ja hoor, dat is geen probleem. Zullen we dan 15:00 uur afspreken?', timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString() },
      { id: 'm1c', sender: 'ouder', text: 'Perfect, dank u wel!', timestamp: new Date(Date.now() - 1.2 * 60 * 60 * 1000).toISOString() },
      { id: 'm1d', sender: 'tutor', text: 'Prima, dan zie ik Sofie volgende week dinsdag om 15:00.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'conv2',
    tutorId: 'tutor2',
    tutorName: 'Dhr. Pietersen',
    tutorAvatar: 'https://picsum.photos/seed/pietersen/40/40',
    childName: 'Max de Tester',
    lastMessage: 'Dank voor het lesverslag, Dhr. Pietersen!',
    lastMessageTimestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 1,
    messages: [
      { id: 'm2a', sender: 'tutor', text: 'Max heeft vandaag goed gewerkt aan de onregelmatige werkwoorden. Zie lesverslag.', timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), isRead: false },
      { id: 'm2b', sender: 'ouder', text: 'Dank voor het lesverslag, Dhr. Pietersen!', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), isRead: true },
    ],
  },
  {
    id: 'conv3',
    tutorId: 'tutor3',
    tutorName: 'Juf Anja',
    childName: 'Lisa Voorbeeld',
    lastMessage: 'Zou Lisa de volgende les de afronding van H3 willen voorbereiden?',
    lastMessageTimestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    messages: [
      { id: 'm3a', sender: 'tutor', text: 'Zou Lisa de volgende les de afronding van H3 willen voorbereiden?', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
];

export default function BerichtencentrumPage() {
  const [conversations, setConversations] = useState<Conversation[]>(dummyConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [selectedConversation?.messages]);

  const handleSelectConversation = (convId: string) => {
    const newSelectedConv = conversations.find(c => c.id === convId);
    if (newSelectedConv) {
        setSelectedConversation(newSelectedConv);
        // Mark messages as read (simulation)
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
    setSelectedConversation(prev => prev ? ({
      ...prev,
      messages: [...prev.messages, newMsg],
      lastMessage: newMessage,
      lastMessageTimestamp: newMsg.timestamp,
    }) : null);
    setConversations(prev => prev.map(c => 
      c.id === selectedConversation.id ? {
        ...c, 
        messages: [...c.messages, newMsg],
        lastMessage: newMessage,
        lastMessageTimestamp: newMsg.timestamp,
      } : c
    ));
    setNewMessage('');
  };
  
  const handleNewConversation = () => {
    // Simulate starting a new conversation - in a real app, a modal would appear
    // to select child and tutor.
    alert("Nieuw gesprek starten (gesimuleerd). Selecteer een kind en tutor.");
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      tutorId: 'new-tutor',
      tutorName: 'Nieuwe Tutor',
      tutorAvatar: `https://placehold.co/40x40.png?text=${getInitials('Nieuwe Tutor')}`,
      childName: 'Kind X',
      lastMessage: 'Start van nieuw gesprek...',
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0,
      messages: [{id: 'init', sender: 'ouder', text: 'Hallo, ik wil graag een vraag stellen over...', timestamp: new Date().toISOString(), isRead: true}],
    };
    setConversations(prev => [newConv, ...prev]);
    setSelectedConversation(newConv);
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

      <Card className="shadow-lg h-[calc(100vh-200px)] flex flex-col">
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
          <ScrollArea className="w-full md:w-1/3 border-r">
            <div className="p-3 space-y-2">
              {conversations.sort((a,b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime()).map(conv => (
                <Button
                  key={conv.id}
                  variant="ghost"
                  className={cn(
                    "w-full h-auto justify-start p-3 text-left hover:bg-muted",
                    selectedConversation?.id === conv.id && "bg-muted font-semibold"
                  )}
                  onClick={() => handleSelectConversation(conv.id)}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={conv.tutorAvatar} alt={conv.tutorName} data-ai-hint="person avatar" />
                    <AvatarFallback>{getInitials(conv.tutorName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                        <p className="truncate font-medium">{conv.tutorName} <span className="text-xs text-muted-foreground"> (Kind: {conv.childName})</span></p>
                        {conv.unreadCount > 0 && (
                            <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">{conv.unreadCount}</span>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                     <p className="text-xs text-muted-foreground/70 mt-0.5">
                        <FormattedDateCell isoDateString={conv.lastMessageTimestamp} dateFormatPattern="Pp" />
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
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                         <AvatarImage src={selectedConversation.tutorAvatar} alt={selectedConversation.tutorName} data-ai-hint="person avatar" />
                        <AvatarFallback>{getInitials(selectedConversation.tutorName)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-lg">{selectedConversation.tutorName}</CardTitle>
                        <CardDescription>Gesprek over {selectedConversation.childName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <ScrollArea className="flex-1 p-4 space-y-4 bg-slate-50">
                  {selectedConversation.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex items-end gap-2 max-w-[80%]",
                        msg.sender === 'ouder' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                      )}
                    >
                      <div
                        className={cn(
                          "p-3 rounded-xl text-sm shadow-sm",
                          msg.sender === 'ouder' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none border'
                        )}
                      >
                        {msg.text}
                      </div>
                      <p className="text-[10px] text-muted-foreground/70 mb-0.5">
                        <FormattedDateCell isoDateString={msg.timestamp} dateFormatPattern="p" />
                      </p>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </ScrollArea>
                <CardFooter className="p-4 border-t">
                  <div className="flex w-full items-center gap-2">
                    <Textarea
                      placeholder="Typ een bericht..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage();}}}
                      rows={1}
                      className="min-h-[40px] max-h-[120px] resize-none"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Verstuur</span>
                    </Button>
                  </div>
                </CardFooter>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/30">
                <MessageCircle className="h-16 w-16 text-muted-foreground/50 mb-4" />
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
