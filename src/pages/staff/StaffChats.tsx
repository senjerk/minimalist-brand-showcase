
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, CheckCheck, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chat, Message } from "@/types/chat";

// Тестовые данные
const mockChats: Chat[] = [
  {
    id: "1",
    user: {
      id: "u1",
      name: "Анна Смирнова",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna"
    },
    lastMessage: {
      id: "m1",
      text: "Добрый день! Подскажите, пожалуйста, по заказу",
      isOwn: false,
      isRead: true,
      timestamp: "2024-02-13T14:30:00",
      sender: {
        id: "u1",
        name: "Анна Смирнова",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna"
      }
    },
    unreadCount: 0
  },
  {
    id: "2",
    user: {
      id: "u2",
      name: "Иван Петров",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan"
    },
    lastMessage: {
      id: "m2",
      text: "Когда будет доставка?",
      isOwn: false,
      isRead: false,
      timestamp: "2024-02-13T15:45:00",
      sender: {
        id: "u2",
        name: "Иван Петров",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan"
      }
    },
    unreadCount: 2
  }
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      text: "Добрый день! Подскажите, пожалуйста, по заказу",
      isOwn: false,
      isRead: true,
      timestamp: "2024-02-13T14:30:00",
      sender: {
        id: "u1",
        name: "Анна Смирнова",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna"
      }
    },
    {
      id: "m2",
      text: "Здравствуйте! Конечно, я помогу вам с информацией по заказу",
      isOwn: true,
      isRead: true,
      timestamp: "2024-02-13T14:32:00",
      sender: {
        id: "staff1",
        name: "Менеджер",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Manager"
      }
    },
    {
      id: "m3",
      text: "Спасибо! Хотела уточнить срок доставки",
      isOwn: false,
      isRead: true,
      timestamp: "2024-02-13T14:33:00",
      sender: {
        id: "u1",
        name: "Анна Смирнова",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna"
      }
    }
  ],
  "2": [
    {
      id: "m4",
      text: "Когда будет доставка?",
      isOwn: false,
      isRead: false,
      timestamp: "2024-02-13T15:45:00",
      sender: {
        id: "u2",
        name: "Иван Петров",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan"
      }
    }
  ]
};

const ChatMessage = ({ message }: { message: Message }) => {
  return (
    <div className={cn(
      "flex gap-3 mb-4",
      message.isOwn ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="w-8 h-8">
        <AvatarImage src={message.sender.avatar} />
        <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
      </Avatar>
      <div className={cn(
        "max-w-[70%]",
        message.isOwn ? "items-end" : "items-start"
      )}>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground mb-1">
            {message.sender.name}
          </span>
          <div className={cn(
            "rounded-lg p-3",
            message.isOwn 
              ? "bg-blue-500 text-white ml-auto" 
              : "bg-gray-100 dark:bg-gray-800"
          )}>
            {message.text}
          </div>
        </div>
        {message.isOwn && (
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {message.isRead ? <CheckCheck className="w-4 h-4 text-blue-500" /> : <Check className="w-4 h-4 text-muted-foreground" />}
          </div>
        )}
      </div>
    </div>
  );
};

const ChatList = ({ 
  chats, 
  selectedChatId, 
  onChatSelect 
}: { 
  chats: Chat[],
  selectedChatId?: string,
  onChatSelect: (chatId: string) => void
}) => {
  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      {chats.map((chat) => (
        <Card 
          key={chat.id}
          className={cn(
            "p-4 mb-2 cursor-pointer hover:bg-accent transition-colors",
            selectedChatId === chat.id && "bg-accent"
          )}
          onClick={() => onChatSelect(chat.id)}
        >
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={chat.user.avatar} />
              <AvatarFallback>{chat.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{chat.user.name}</h3>
                {chat.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
              {chat.lastMessage && (
                <p className="text-sm text-muted-foreground truncate">
                  {chat.lastMessage.text}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </ScrollArea>
  );
};

const StaffChats = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-[300px_1fr] gap-6 h-full">
        {/* Список чатов */}
        <div className="border-r pr-6">
          <h2 className="text-xl font-bold mb-4">Чаты</h2>
          <ChatList 
            chats={mockChats}
            selectedChatId={selectedChatId}
            onChatSelect={setSelectedChatId}
          />
        </div>

        {/* Область чата */}
        <div className="flex flex-col h-full">
          {selectedChatId ? (
            <>
              {/* Заголовок чата */}
              <div className="border-b pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={mockChats.find(c => c.id === selectedChatId)?.user.avatar} />
                    <AvatarFallback>
                      {mockChats.find(c => c.id === selectedChatId)?.user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">
                    {mockChats.find(c => c.id === selectedChatId)?.user.name}
                  </h2>
                </div>
              </div>

              {/* Сообщения */}
              <ScrollArea className="flex-1 pr-4">
                {mockMessages[selectedChatId]?.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </ScrollArea>

              {/* Поле ввода */}
              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Введите сообщение..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Выберите чат для начала общения
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffChats;
