import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_CONFIG } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MessageSquarePlus, Circle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addCSRFToken } from "@/lib/csrf";

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

const Chats = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newChatTopic, setNewChatTopic] = useState("");

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
      navigate(`/support/${data.data.id}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Не удалось создать чат");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Чаты поддержки</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <MessageSquarePlus className="h-4 w-4" />
                Новый чат
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

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : chatsData?.data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            У вас пока нет чатов. Создайте новый чат для общения с поддержкой.
          </div>
        ) : (
          <div className="space-y-4">
            {chatsData?.data.map((chat) => (
              <div
                key={chat.id}
                onClick={() => navigate(`/support/${chat.id}`)}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">#{chat.id} {chat.topic}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(chat.created_at).toLocaleString("ru-RU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Circle
                      className={`h-3 w-3 ${
                        chat.is_active ? "text-green-500" : "text-gray-500"
                      }`}
                      fill="currentColor"
                    />
                    <span className="text-sm">
                      {chat.is_active ? "Активен" : "Закрыт"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats; 