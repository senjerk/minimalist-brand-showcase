import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { API_CONFIG } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { addCSRFToken } from "@/lib/csrf";
import Cookies from 'js-cookie';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

interface ChatDetailResponse {
  data: {
    id: number;
    topic: string;
    created_at: string;
    is_active: boolean;
    user: User;
  };
  message: string;
}

const ChatDetail = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (data.type === 'chat_history') {
        setMessages(data.messages);
        setUserData(data.user);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}/api/users/search/?query=${query}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setSearchResults(data.data);
    } catch (error) {
      console.error('Ошибка при поиске пользователей:', error);
      toast.error("Не удалось найти пользователей");
    }
  };

  const addUser = async (userId: number) => {
    try {
      const headers = await addCSRFToken();
      const response = await fetch(
        `${API_CONFIG.baseURL}/api/staff/support/chats/${id}/invite/`,
        {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({ user_id: userId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      setIsSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
      toast.success("Пользователь добавлен в чат");
    } catch (error) {
      console.error('Ошибка при добавлении пользователя:', error);
      toast.error("Не удалось добавить пользователя");
    }
  };

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Чат #{id}
          </h1>
          {userData?.is_staff && (
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Добавить ответственного
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить ответственного</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      searchUsers(e.target.value);
                    }}
                    placeholder="Введите имя пользователя..."
                  />
                  <div className="space-y-2">
                    {searchResults.map(user => (
                      <div
                        key={user.id}
                        onClick={() => addUser(user.id)}
                        className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                      >
                        {user.username}
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4 h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.user_id === userData?.user_id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.is_system 
                      ? "bg-gray-200 text-gray-700"
                      : message.user_id === userData?.user_id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <div className="text-xs opacity-70 mb-1">
                    {message.username} • {new Date(message.created_at).toLocaleString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение..."
            className="flex-1"
          />
          <Button type="submit" className="flex items-center gap-2" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
            Отправить
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatDetail; 