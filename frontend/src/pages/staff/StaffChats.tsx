import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { API_CONFIG } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, ChevronLeft, Menu, MessageSquarePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Cookies from 'js-cookie';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CreateChatDialog } from "@/components/CreateChatDialog";
import StaffChatDetail from "./StaffChatDetail";

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
  isLoading?: boolean;
  onClose?: () => void;
}

const ChatList = ({ 
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
  );
};

interface MessageContentProps {
  content: string;
  onImageLoad: (imageUrl: string) => void;
  onImageError: (imageUrl: string) => void;
}

const parseMessageContent = (content: string) => {
  if (!content.includes('https://')) {
    return { text: content, images: [] };
  }

  const urlRegex = /(https:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);
  const matches = content.match(urlRegex) || [];
  
  return {
    text: parts.filter(part => !part.startsWith('https://')).join(' ').trim(),
    images: matches.map(url => url.trim())
  };
};

const MessageContent = ({ content, onImageLoad, onImageError }: MessageContentProps) => {
  const { text, images } = parseMessageContent(content);
  
  useEffect(() => {
    if (images.length > 0) {
      const imageLoaders = images.map(url => {
        const img = new Image();
        img.src = url;
        return new Promise<string>((resolve) => {
          img.onload = () => resolve(url);
          img.onerror = () => resolve(url);
        });
      });

      Promise.all(imageLoaders).then((loadedUrls) => {
        loadedUrls.forEach(url => onImageLoad(url));
      });
    }
  }, []);

  return (
    <div className="space-y-2">
      {images.length > 0 && images.map((imageUrl, index) => (
        <div key={index} className="max-w-[300px]">
          <img 
            src={imageUrl} 
            alt="Message attachment" 
            className="rounded-lg w-full h-auto"
            loading="eager"
          />
        </div>
      ))}
      {text && <p className="whitespace-pre-wrap break-words">{text}</p>}
    </div>
  );
};

interface ChatMessageProps {
  message: Message;
  currentUserId: number;
  onImageLoad: (imageUrl: string) => void;
  onImageError: (imageUrl: string) => void;
}

const ChatMessage = ({ 
  message, 
  currentUserId,
  onImageLoad,
  onImageError 
}: ChatMessageProps) => {
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
          {!isOwn && (
            <span className="text-sm text-muted-foreground mb-1">
              {message.username}
            </span>
          )}
          <div className={cn(
            "rounded-lg p-3",
            isOwn 
              ? "bg-blue-500 text-white ml-auto" 
              : "bg-gray-100 dark:bg-gray-800"
          )}>
            <MessageContent 
              content={message.content} 
              onImageLoad={onImageLoad}
              onImageError={onImageError}
            />
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
    </div>
  );
};

const DRAFTS_STORAGE_KEY = 'chat_drafts';

const getDraftMessage = (chatId: string): string => {
  try {
    const drafts = JSON.parse(localStorage.getItem(DRAFTS_STORAGE_KEY) || '{}');
    return drafts[chatId] || '';
  } catch {
    return '';
  }
};

const saveDraftMessage = (chatId: string, message: string) => {
  try {
    const drafts = JSON.parse(localStorage.getItem(DRAFTS_STORAGE_KEY) || '{}');
    drafts[chatId] = message;
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.error('Error saving draft:', error);
  }
};

const StaffChats = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [pendingImages, setPendingImages] = useState<Set<string>>(new Set());
  const [processedImages, setProcessedImages] = useState<Set<string>>(new Set());
  const [showLoader, setShowLoader] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isChatsLoading, setIsChatsLoading] = useState(true);

  const isMobile = useIsMobile();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChatId]);

  useEffect(() => {
    if (!selectedChatId) return;

    setIsChatLoading(true);
    const csrftoken = Cookies.get('csrftoken');
    const ws = new WebSocket(
      `ws://127.0.0.1/ws/support/chat/${selectedChatId}/`,
      ['X-CSRFToken', csrftoken]
    );

    ws.onopen = () => {
      console.log('WebSocket соединение установлено');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'chat_message') {
        setMessages(prev => [...prev, data.message]);
        if (data.message.user_id === userData?.user_id) {
          setTimeout(scrollToBottom, 0);
        }
      } else if (data.type === 'chat_history') {
        setMessages(data.messages);
        setUserData(data.user);
        setIsChatLoading(false);
        setTimeout(scrollToBottom, 0);
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
  }, [selectedChatId]);

  useEffect(() => {
    if (selectedChatId) {
      setNewMessage(getDraftMessage(selectedChatId));
    }
  }, [selectedChatId]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'inherit';
    
    const maxHeight = isMobile ? 100 : 200;
    const computed = Math.min(textarea.scrollHeight, maxHeight);
    
    textarea.style.height = `${computed}px`;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    if (selectedChatId) {
      saveDraftMessage(selectedChatId, value);
    }
    adjustTextareaHeight();
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.send(JSON.stringify({
      type: 'chat_message',
      message: newMessage
    }));
    setNewMessage("");
    if (selectedChatId) {
      saveDraftMessage(selectedChatId, "");
    }
    setTimeout(scrollToBottom, 100);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      return;
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e as unknown as React.FormEvent);
    }
  };

  const extractImagesFromMessages = useCallback((messages: Message[]) => {
    const urls = new Set<string>();
    messages.forEach(message => {
      const { images } = parseMessageContent(message.content);
      images.forEach(url => urls.add(url));
    });
    return urls;
  }, []);

  useEffect(() => {
    const imageUrls = extractImagesFromMessages(messages);
    setPendingImages(imageUrls);
  }, [messages]);

  const onImageLoad = useCallback((imageUrl: string) => {
    setProcessedImages(prev => new Set([...prev, imageUrl]));
  }, []);

  const onImageError = useCallback((imageUrl: string) => {
    setProcessedImages(prev => new Set([...prev, imageUrl]));
  }, []);

  const isLoading = useMemo(() => {
    return isChatLoading || ![...pendingImages].every(url => processedImages.has(url));
  }, [isChatLoading, pendingImages, processedImages]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (!isLoading) {
      timeout = setTimeout(() => {
        setShowLoader(false);
        scrollToBottom();
      }, 250);
    } else {
      setShowLoader(true);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading]);

  useEffect(() => {
    setIsChatLoading(true);
    setShowLoader(true);
    setPendingImages(new Set());
    setProcessedImages(new Set());
  }, [selectedChatId]);

  const handleCreateChat = async (topic: string) => {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/api/chats/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to create chat');
      }

      const data = await response.json();
      setChats(prev => [...prev, data]);
      setSelectedChatId(data.id.toString());
      setIsSidebarOpen(false);
    } catch (error) {
      toast.error('Не удалось создать чат');
    }
  };

  return (
    <div className="h-screen bg-background">
      <div className={cn(
        "h-full overflow-hidden",
        isMobile ? "block" : "grid grid-cols-[300px_1fr]"
      )}>
        {(!isMobile || !selectedChatId) && (
          <div className="border-r p-6">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Чаты</h2>
                <CreateChatDialog onCreateChat={handleCreateChat} />
              </div>
              <div className="flex-1 min-h-0">
                <ChatList 
                  chats={chats}
                  selectedChatId={selectedChatId}
                  onChatSelect={setSelectedChatId}
                  isLoading={isChatsLoading}
                  onClose={() => setIsSidebarOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

        <div className={cn(
          "h-full",
          isMobile && selectedChatId && "fixed inset-0 z-40 bg-background"
        )}>
          {selectedChatId ? (
            <div className="flex flex-col fixed inset-0 bg-background">
              <div className="border-b bg-background z-10">
                <div className="flex items-center gap-3 p-4">
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedChatId(undefined)}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  )}
                  <h2 className="text-xl font-bold truncate">
                    Чат #{selectedChatId}
                  </h2>
                </div>
              </div>

              <div className="relative flex-1">
                <div 
                  ref={messagesContainerRef}
                  className="absolute inset-0 overflow-y-auto"
                >
                  <div className="flex flex-col h-full">
                    <div className={cn(
                      "space-y-4 p-4",
                      messages.length < 10 && "mt-auto"
                    )}>
                      {messages.length > 0 ? (
                        messages.map((message) => (
                          <ChatMessage 
                            key={message.id} 
                            message={message} 
                            currentUserId={userData?.user_id || 0}
                            onImageLoad={onImageLoad}
                            onImageError={onImageError}
                          />
                        ))
                      ) : (
                        <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
                          В этом чате пока пусто.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {showLoader && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-md z-50 transition-opacity duration-200">
                    <div className="flex flex-col items-center gap-2 bg-background/50 p-6 rounded-lg">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Загрузка чата...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t bg-background p-4">
                <form onSubmit={sendMessage} className="flex w-full gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={newMessage}
                    onChange={handleTextChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Введите сообщение..."
                    className={cn(
                      "flex-1 min-h-[40px]",
                      isMobile ? "max-h-[100px]" : "max-h-[200px]"
                    )}
                    rows={1}
                    style={{
                      resize: 'none',
                      overflow: 'auto',
                      transition: 'height 0.1s ease'
                    }}
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          ) : !isMobile && (
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
