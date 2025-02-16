
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_CONFIG } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MessageSquarePlus, Circle } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addCSRFToken } from "@/lib/csrf";
import ChatDetail from "./ChatDetail";

interface Chat {
  id: number;
  topic: string;
  created_at: string;
  is_active: boolean;
}

interface ChatsResponse {
  data: Chat[];
  message: string;
}

const ChatList = ({ 
  chats, 
  selectedChatId, 
  onChatSelect,
  isLoading 
}: { 
  chats: Chat[],
  selectedChatId?: string,
  onChatSelect: (chatId: string) => void,
  isLoading: boolean
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!chats?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        У вас пока нет чатов
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      {chats.map((chat) => (
        <Card 
          key={chat.id}
          className={cn(
            "p-4 mb-2 cursor-pointer hover:bg-accent transition-colors",
            selectedChatId === chat.id.toString() && "bg-accent"
          )}
          onClick={() => onChatSelect(chat.id.toString())}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold truncate">#{chat.id} {chat.topic}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(chat.created_at).toLocaleString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Circle
                className={`h-3 w-3 ${
                  chat.is_active ? "text-green-500" : "text-gray-500"
                }`}
                fill="currentColor"
              />
              <span className="text-sm whitespace-nowrap">
                {chat.is_active ? "Активен" : "Закрыт"}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </ScrollArea>
  );
};

const Chats = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newChatTopic, setNewChatTopic] = useState("");
  const isMobile = useIsMobile();

  const { data: chatsData, isLoading } = useQuery<ChatsResponse>({
    queryKey: ["chats"],
    queryFn: async () => {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.support.chats}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }
      return response.json();
    },
    meta: {
      onError: () => {
        toast.error("Не удалось загрузить чаты");
      },
    },
  });

  const createChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatTopic.trim()) return;

    try {
      const headers = await addCSRFToken();
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.support.chats}`,
        {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({ topic: newChatTopic }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const data = await response.json();
      setIsDialogOpen(false);
      setNewChatTopic("");
      setSelectedChatId(data.data.id.toString());
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Не удалось создать чат");
    }
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)]">
      <div className={cn(
        "h-full",
        isMobile ? "grid grid-cols-1" : "grid grid-cols-[300px_1fr] gap-6"
      )}>
        <div className={cn(
          "border-r pr-6",
          isMobile && "pr-0 border-r-0"
        )}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Чаты</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <MessageSquarePlus className="h-4 w-4" />
                  Новый
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создание нового чата</DialogTitle>
                </DialogHeader>
                <form onSubmit={createChat} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="topic" className="text-sm font-medium">
                      Тема чата
                    </label>
                    <Input
                      id="topic"
                      value={newChatTopic}
                      onChange={(e) => setNewChatTopic(e.target.value)}
                      placeholder="Введите тему чата..."
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Отмена
                    </Button>
                    <Button type="submit">Создать</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <ChatList 
            chats={chatsData?.data || []}
            selectedChatId={selectedChatId}
            onChatSelect={handleChatSelect}
            isLoading={isLoading}
          />
        </div>
        <div className="flex flex-col h-full">
          {selectedChatId ? (
            <ChatDetail id={selectedChatId} />
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

export default Chats;
