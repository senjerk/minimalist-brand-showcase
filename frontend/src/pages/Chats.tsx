import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface Chat {
  id: string;
  last_message?: {
    content: string;
    created_at: string;
    is_read: boolean;
  };
  user: {
    username: string;
  };
  unread_count: number;
}

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
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.user.username}`} />
              <AvatarFallback>{chat.user.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold truncate flex-1">{chat.user.username}</h3>
                {chat.unread_count > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0 self-center ml-2">
                    {chat.unread_count}
                  </span>
                )}
              </div>
              {chat.last_message && (
                <p className="text-sm text-muted-foreground truncate">
                  {chat.last_message.content}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </ScrollArea>
  );
};

const Chats = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleChatSelect = (chatId: string) => {
    navigate(`/support/${chatId}`);
  };

  const mockChats: Chat[] = [];

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
          <h2 className="text-xl font-bold mb-4">Чаты</h2>
          <ChatList 
            chats={mockChats}
            selectedChatId={selectedChatId}
            onChatSelect={handleChatSelect}
          />
        </div>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Выберите чат для начала общения
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
