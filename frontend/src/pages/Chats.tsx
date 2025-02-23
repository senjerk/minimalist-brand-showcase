import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_CONFIG } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  isLoading,
  onClose 
}: { 
  chats: Chat[],
  selectedChatId?: string,
  onChatSelect: (chatId: string) => void,
  isLoading: boolean,
  onClose?: () => void
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

  const handleChatClick = (chatId: string) => {
    onChatSelect(chatId);
    if (onClose) {
      onClose();
    }
  };

  return (
    <ScrollArea>
      <div className="space-y-2 pr-4">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatClick(chat.id.toString())}
            className={cn(
              "bg-card rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors",
              selectedChatId === chat.id.toString() && "bg-accent"
            )}
          >
            <div className="flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">#{chat.id} {chat.topic}</h3>
                <span className={`h-2 w-2 rounded-full ${
                  chat.is_active ? "bg-green-500" : "bg-gray-500"
                }`} />
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(chat.created_at).toLocaleString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

const Chats = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Не удалось создать чат");
    }
  };

  const ChatListComponent = (
    <div className="flex flex-col h-full">
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

      <div className="flex-1 min-h-0">
        <ChatList 
          chats={chatsData?.data || []}
          selectedChatId={selectedChatId}
          onChatSelect={setSelectedChatId}
          isLoading={isLoading}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-background">
      <div className={cn(
        "h-full relative",
        isMobile ? "block" : "flex"
      )}>
        {isMobile ? (
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-6">
              {ChatListComponent}
            </SheetContent>
          </Sheet>
        ) : (
          <div className="w-[300px] h-full border-r overflow-hidden p-6 flex-shrink-0">
            {ChatListComponent}
          </div>
        )}

        <div className={cn(
          "flex-1 h-full relative",
          isMobile && "fixed inset-0 z-50 bg-background"
        )}>
          {selectedChatId ? (
            <div className="absolute inset-0">
              <ChatDetail 
                id={selectedChatId} 
                onOpenSidebar={() => setIsSidebarOpen(true)}
              />
            </div>
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
