
import { useState, useEffect, useRef } from "react";
import { API_CONFIG } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Cookies from 'js-cookie';

interface Message {
  id: number;
  content: string;
  created_at: string;
  username: string;
  user_id: number;
  is_staff: boolean;
  is_system: boolean;
}

interface User {
  id: number;
  username: string;
  is_staff: boolean;
  user_id: number;
}

const ChatMessage = ({ message, currentUserId }: { message: Message; currentUserId: number }) => {
  if (message.is_system) {
    return (
      <div className="flex justify-center my-4">
        <span className="text-sm text-muted-foreground bg-accent px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  const isOwn = message.user_id === currentUserId;

  return (
    <div className={cn(
      "flex gap-3 mb-4",
      isOwn ? "flex-row-reverse" : "flex-row"
    )}>
      {!isOwn && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.username}`} />
          <AvatarFallback>{message.username[0]}</AvatarFallback>
        </Avatar>
      )}
      <div className={cn(
        "max-w-[70%]",
        isOwn ? "items-end" : "items-start"
      )}>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground mb-1">
            {!isOwn && message.username}
          </span>
          <div className={cn(
            "rounded-lg p-3",
            isOwn 
              ? "bg-blue-500 text-white ml-auto" 
              : "bg-gray-100 dark:bg-gray-800"
          )}>
            {message.content}
          </div>
        </div>
        {isOwn && (
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-xs text-muted-foreground">
              {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

interface ChatDetailProps {
  id: string;
  onOpenSidebar?: () => void;
}

const ChatDetail = ({ id, onOpenSidebar }: ChatDetailProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (!id) return;

    const csrftoken = Cookies.get('csrftoken');
    const ws = new WebSocket(
      `ws://localhost:8000/ws/support/chat/${id}/`,
      ['X-CSRFToken', csrftoken]
    );

    ws.onopen = () => {
      console.log('WebSocket соединение установлено');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Получено сообщение:', data);

      if (data.type === 'chat_message') {
        setMessages(prev => [...prev, data.message]);
        scrollToBottom();
      } else if (data.type === 'chat_history') {
        setMessages(data.messages);
        setUserData(data.user);
        scrollToBottom();
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket ошибка:', error);
      toast.error("Ошибка подключения к чату");
    };

    ws.onclose = () => {
      console.log('WebSocket соединение закрыто');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [id]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      socket.send(JSON.stringify({
        type: 'chat_message',
        message: newMessage
      }));
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b pb-4 mb-4">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenSidebar}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-xl font-bold truncate">
            Чат #{id}
          </h2>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pr-4 min-h-0"
      >
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              currentUserId={userData?.user_id || 0}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex gap-2 pt-4 border-t">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение..."
          className="flex-1"
        />
        <Button type="submit" disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatDetail;
