import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_CONFIG } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MessageSquarePlus, Menu } from "lucide-react";
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
import { CreateChatDialog } from "@/components/CreateChatDialog";

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
    <ScrollArea className="flex-1">
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
                <h3 className="font-medium break-words">#{chat.id} {chat.topic}</h3>
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
  const queryClient = useQueryClient();

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

  const handleCreateChat = async (topic: string) => {
    try {
      const headers = await addCSRFToken();
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.support.chats}`,
        {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({ topic }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const data = await response.json();
      
      await queryClient.invalidateQueries({ queryKey: ["chats"] });
      
      setSelectedChatId(data.data.id.toString());
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Не удалось создать чат");
      throw error;
    }
  };

  const ChatListComponent = (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Чаты</h2>
        <CreateChatDialog onCreateChat={handleCreateChat} />
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
        "h-full overflow-hidden",
        isMobile ? "block" : "grid grid-cols-[300px_1fr]"
      )}>
        {!isMobile && (
          <div className="border-r p-6">
            {ChatListComponent}
          </div>
        )}

        <div className={cn(
          "h-full",
          isMobile && selectedChatId && "fixed inset-0 z-40 bg-background"
        )}>
          {isMobile ? (
            selectedChatId ? (
              <ChatDetail 
                id={selectedChatId} 
                onOpenSidebar={() => setIsSidebarOpen(true)}
                chats={chatsData?.data || []}
                onChatSelect={setSelectedChatId}
                isChatsLoading={isLoading}
                onCreateChat={handleCreateChat}
              />
            ) : (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Чаты</h2>
                  <CreateChatDialog onCreateChat={handleCreateChat} />
                </div>
                <ChatList 
                  chats={chatsData?.data || []}
                  selectedChatId={selectedChatId}
                  onChatSelect={setSelectedChatId}
                  isLoading={isLoading}
                />
              </div>
            )
          ) : (
            selectedChatId ? (
              <ChatDetail 
                id={selectedChatId} 
                onOpenSidebar={() => setIsSidebarOpen(true)}
                chats={chatsData?.data || []}
                onChatSelect={setSelectedChatId}
                isChatsLoading={isLoading}
                onCreateChat={handleCreateChat}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Выберите чат для начала общения
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;
