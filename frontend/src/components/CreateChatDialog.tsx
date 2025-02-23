import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquarePlus, Loader2 } from "lucide-react";
import { useState } from "react";

interface CreateChatDialogProps {
  onCreateChat: (topic: string) => Promise<void>;
  trigger?: React.ReactNode;
}

export const CreateChatDialog = ({ onCreateChat, trigger }: CreateChatDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newChatTopic, setNewChatTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatTopic.trim()) return;

    setIsLoading(true);
    try {
      await onCreateChat(newChatTopic);
      setNewChatTopic("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="flex items-center gap-2">
            <MessageSquarePlus className="h-4 w-4" />
            Новый
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создание нового чата</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Создание...
                </>
              ) : (
                'Создать'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 