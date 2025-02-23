import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chat {
  id: number;
  topic: string;
  created_at: string;
  is_active: boolean;
}

interface ChatListProps {
  chats: Chat[];
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
  isLoading: boolean;
  onClose?: () => void;
}

export const ChatList = ({ 
  chats, 
  selectedChatId, 
  onChatSelect,
  isLoading,
  onClose 
}: ChatListProps) => {
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
    <ScrollArea className="h-full">
      <div className="space-y-2 pr-4 pb-4">
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