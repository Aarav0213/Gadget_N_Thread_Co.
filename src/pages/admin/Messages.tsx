import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Search, Send, User, CheckCircle, Clock } from 'lucide-react';
import { messagesApi } from '@/lib/api';
import type { Conversation, Message } from '@/lib/api';

interface ConversationWithMeta extends Conversation {
  customerName: string;
  lastMessage: string;
  unread: number;
}

export default function AdminMessages() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<ConversationWithMeta[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithMeta | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await messagesApi.getConversations();
      // Map to include display fields
      const mapped: ConversationWithMeta[] = (data || []).map((conv: Conversation) => ({
        ...conv,
        customerName: `Customer ${conv.user_id?.slice(0, 8) || 'Unknown'}`,
        lastMessage: conv.last_message || conv.subject || 'No message',
        unread: conv.unread_count || 0,
      }));
      setConversations(mapped);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const conv = await messagesApi.getConversation(conversationId);
      setMessages(conv.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConversation) return;

    try {
      await messagesApi.sendMessage({
        conversation_id: selectedConversation.id,
        sender_id: 'admin',
        content: replyText,
      });
      setReplyText('');
      loadMessages(selectedConversation.id);
      
      toast({
        title: 'Message sent',
        description: 'Your reply has been sent to the customer.',
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message.',
        variant: 'destructive',
      });
    }
  };

  const handleResolve = async () => {
    if (!selectedConversation) return;
    
    try {
      await messagesApi.updateConversationStatus(selectedConversation.id, 'resolved');
      toast({
        title: 'Conversation resolved',
        description: 'The conversation has been marked as resolved.',
      });
      loadConversations();
    } catch (error) {
      console.error('Failed to resolve conversation:', error);
    }
  };

  // Helper to determine if message is from admin
  const isAdminMessage = (message: Message) => {
    return message.sender_id === 'admin';
  };

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
                {loading ? (
                  <p className="p-4 text-muted-foreground">Loading conversations...</p>
                ) : filteredConversations.length === 0 ? (
                  <p className="p-4 text-muted-foreground">No conversations yet</p>
                ) : (
                  filteredConversations.map((conv) => (
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
                        {new Date(conv.updated_at).toLocaleDateString()}
                      </div>
                    </button>
                  ))
                )}
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
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${isAdminMessage(message) ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              isAdminMessage(message)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              isAdminMessage(message)
                                ? 'text-primary-foreground/70'
                                : 'text-muted-foreground'
                            }`}>
                              {new Date(message.created_at).toLocaleTimeString([], {
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
