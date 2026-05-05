'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  findChatRoom,
  createChatRoom,
  addChatMessage,
  getChatMessages,
  getUserById,
} from '@/lib/firestore-service';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ChatRoom, ChatMessage, Provider } from '@/types';

export default function ChatPage() {
  const params = useParams();
  const providerId = params.providerId as string;
  const { user } = useAuth();
  const { showError } = useToast();

  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [provider, setProvider] = useState<Provider | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initChat = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Get provider info
        const providerData = (await getUserById(providerId)) as Provider;
        setProvider(providerData);

        // Find or create chat room
        let room = await findChatRoom(user.uid, providerId);
        if (!room) {
          room = await createChatRoom([user.uid, providerId]);
        }
        setChatRoom(room as ChatRoom);

        // Load messages
        const msgs = await getChatMessages(room.id || room.id);
        setMessages((msgs as ChatMessage[]).reverse());
      } catch (error) {
        console.error('Error initializing chat:', error);
        showError('Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [user, providerId, showError]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageText.trim() || !chatRoom || !user) return;

    setSending(true);
    try {
      const newMessage = await addChatMessage(chatRoom.id || chatRoom.id, {
        senderId: user.uid,
        message: messageText,
        roomId: chatRoom.id || chatRoom.id,
      }) as ChatMessage;

      setMessages((prev) => [...prev, newMessage]);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['customer']}>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading chat...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />

        <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
            <Link
              href="/home"
              className="text-primary hover:text-primary-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-foreground">
                {provider?.displayName}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-600 dark:text-gray-400">
                  Start a conversation
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === user?.uid ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      msg.senderId === user?.uid
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-foreground'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              disabled={sending}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={sending || !messageText.trim()}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-600 disabled:opacity-50 transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
