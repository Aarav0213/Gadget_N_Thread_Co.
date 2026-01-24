import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Search, Send, User, CheckCircle, Clock } from 'lucide-react';
import type { Conversation, Message } from '@/lib/api';

// Mock conversations
const mockConversations: (Conversation & { customerName: string; lastMessage: string; unread: number })[] = [
  {
    id: '1',
    userId: 'user-1',
    customerName: 'John Doe',
    productId: 'prod-1',
    subject: 'Question about Wireless Headphones',
    status: 'open',
    lastMessage: 'Thanks for reaching out! How can I help?',
    lastMessageAt: '2024-01-22T10:30:00Z',
    createdAt: '2024-01-22T09:00:00Z',
    unread: 2,
  },
  {
    id: '2',
    userId: 'user-2',
    customerName: 'Sarah M.',
    subject: 'Shipping inquiry',
    status: 'open',
    lastMessage: 'When will my order arrive?',
    lastMessageAt: '2024-01-21T15:00:00Z',
    createdAt: '2024-01-21T14:30:00Z',
    unread: 1,
  },
  {
    id: '3',
    userId: 'user-3',
    customerName: 'Mike R.',
    subject: 'Return request',
    status: 'resolved',
    lastMessage: 'Thank you for your help!',
    lastMessageAt: '2024-01-20T12:00:00Z',
    createdAt: '2024-01-19T10:00:00Z',
    unread: 0,
  },
];

// Mock messages
const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      conversationId: '1',
      senderId: 'user-1',
      senderType: 'customer',
      content: 'Hi, I have a question about the Wireless Headphones Pro. Do they work with iPhone?',
      isRead: true,
      createdAt: '2024-01-22T09:00:00Z',
    },
    {
      id: 'm2',
      conversationId: '1',
      senderId: 'admin',
      senderType: 'admin',
      content: 'Hello! Yes, the Wireless Headphones Pro work perfectly with all iPhones. They use Bluetooth 5.0 for seamless connectivity.',
      isRead: true,
      createdAt: '2024-01-22T09:15:00Z',
    },
    {
      id: 'm3',
      conversationId: '1',
      senderId: 'user-1',
      senderType: 'customer',
      content: 'Great! What about the battery life? I need them for long flights.',
      isRead: true,
      createdAt: '2024-01-22T10:00:00Z',
    },
    {
      id: 'm4',
      conversationId: '1',
      senderId: 'admin',
      senderType: 'admin',
      content: 'The battery lasts up to 30 hours on a single charge, perfect for long flights! Plus, a quick 10-minute charge gives you 3 hours of playback.',
      isRead: true,
      createdAt: '2024-01-22T10:30:00Z',
    },
  ],
  '2': [
    {
      id: 'm5',
      conversationId: '2',
      senderId: 'user-2',
      senderType: 'customer',
      content: 'Hi, I placed an order yesterday (GT-XYZ789). When will it ship?',
      isRead: true,
      createdAt: '2024-01-21T14:30:00Z',
    },
    {
      id: 'm6',
      conversationId: '2',
      senderId: 'user-2',
      senderType: 'customer',
      content: 'When will my order arrive?',
      isRead: false,
      createdAt: '2024-01-21T15:00:00Z',
    },
  ],
  '3': [
    {
      id: 'm7',
      conversationId: '3',
      senderId: 'user-3',
      senderType: 'customer',
      content: 'I would like to return my USB-C Hub. It arrived damaged.',
      isRead: true,
      createdAt: '2024-01-19T10:00:00Z',
    },
    {
      id: 'm8',
      conversationId: '3',
      senderId: 'admin',
      senderType: 'admin',
      content: 'I\'m sorry to hear that! I\'ve initiated a return for you and a replacement will be shipped today. You\'ll receive a prepaid return label via email.',
      isRead: true,
      createdAt: '2024-01-19T10:30:00Z',
    },
    {
      id: 'm9',
      conversationId: '3',
      senderId: 'user-3',
      senderType: 'customer',
      content: 'Thank you for your help!',
      isRead: true,
      createdAt: '2024-01-20T12:00:00Z',
    },
  ],
};

export default function AdminMessages() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<typeof mockConversations[0] | null>(null);
  const [replyText, setReplyText] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const filteredConversations = mockConversations.filter(conv =>
    conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: 'admin',
      senderType: 'admin',
      content: replyText,
      isRead: true,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage],
    }));

    setReplyText('');

    toast({
      title: 'Message sent',
      description: 'Your reply has been sent to the customer.',
    });
  };

  const handleResolve = () => {
    toast({
      title: 'Conversation resolved',
      description: 'The conversation has been marked as resolved.',
    });
  };

  const currentMessages = selectedConversation ? messages[selectedConversation.id] || [] : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Customer support conversations</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-320px)]">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${
                      selectedConversation?.id === conv.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{conv.customerName}</span>
                      </div>
                      {conv.unread > 0 && (
                        <Badge className="bg-primary">{conv.unread}</Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium truncate">{conv.subject}</p>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      {conv.status === 'resolved' ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {new Date(conv.lastMessageAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Message Thread */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{selectedConversation.subject}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        with {selectedConversation.customerName}
                      </p>
                    </div>
                    {selectedConversation.status === 'open' && (
                      <Button variant="outline" size="sm" onClick={handleResolve}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 flex flex-col">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {currentMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.senderType === 'admin'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderType === 'admin'
                                ? 'text-primary-foreground/70'
                                : 'text-muted-foreground'
                            }`}>
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  {selectedConversation.status === 'open' && (
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply..."
                          rows={2}
                          className="resize-none"
                        />
                        <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Select a conversation to view messages</p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
