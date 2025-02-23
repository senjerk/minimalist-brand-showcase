import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { API_CONFIG } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ChevronLeft, Menu, MessageSquarePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Cookies from 'js-cookie';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChatList } from "@/components/ChatList";
import { CreateChatDialog } from "@/components/CreateChatDialog";
import { Textarea } from "@/components/ui/textarea";

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

interface ChatDetailProps {
  id: string;
  onOpenSidebar?: () => void;
  chats?: Chat[];
  onChatSelect: (chatId: string) => void;
  isChatsLoading?: boolean;
  onCreateChat?: (topic: string) => Promise<void>;
}

interface MessageContentProps {
  content: string;
  onImageLoad: (imageUrl: string) => void;
  onImageError: (imageUrl: string) => void;
}

const parseMessageContent = (content: string) => {
  console.log('Parsing message:', content);

  if (!content.includes('https://')) {
    return { text: content, images: [] };
  }

  const urlRegex = /(https:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);
  const matches = content.match(urlRegex) || [];
  
  console.log('Parts:', parts);
  console.log('URLs found:', matches);

  const result = {
    text: parts.filter(part => !part.startsWith('https://')).join(' ').trim(),
    images: matches.map(url => url.trim())
  };

  console.log('Parsed result:', result);
  return result;
};

const MessageContent = ({ content, onImageLoad, onImageError }: MessageContentProps) => {
  const { text, images } = parseMessageContent(content);
  
  // Используем useEffect только один раз при монтировании
  useEffect(() => {
    if (images.length > 0) {
      // Создаем все Image объекты сразу
      const imageLoaders = images.map(url => {
        const img = new Image();
        img.src = url;
        return new Promise<string>((resolve) => {
          img.onload = () => resolve(url);
          img.onerror = () => resolve(url); // Считаем ошибку тоже завершением загрузки
        });
      });

      // Ждем загрузки всех изображений
      Promise.all(imageLoaders).then((loadedUrls) => {
        loadedUrls.forEach(url => onImageLoad(url));
      });
    }
  }, []); // Пустой массив зависимостей

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
      {text && <p className="whitespace-pre-wrap">{text}</p>}
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

// Утилиты для работы с черновиками
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

const ChatDetail = ({ 
  id, 
  onOpenSidebar,
  chats = [],
  onChatSelect,
  isChatsLoading = false,
  onCreateChat
}: ChatDetailProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [pendingImages, setPendingImages] = useState<Set<string>>(new Set());
  const [processedImages, setProcessedImages] = useState<Set<string>>(new Set());
  const [showLoader, setShowLoader] = useState(true);

  const isLoading = useMemo(() => {
    const loading = isChatLoading || ![...pendingImages].every(url => processedImages.has(url));
    console.log('Loading state:', {
      isChatLoading,
      pendingImages: [...pendingImages],
      processedImages: [...processedImages],
      isLoading: loading
    });
    return loading;
  }, [isChatLoading, pendingImages, processedImages]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    setIsChatLoading(true);
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
      console.log('Received WebSocket message:', data);

      if (data.type === 'chat_message') {
        console.log('New chat message:', data.message);
        setMessages(prev => [...prev, data.message]);
        if (data.message.user_id === userData?.user_id) {
          setTimeout(scrollToBottom, 0);
        }
      } else if (data.type === 'chat_history') {
        console.log('Received chat history, setting messages:', data.messages);
        setMessages(data.messages);
        setUserData(data.user);
        console.log('Setting isChatLoading to false');
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
  }, [id]);

  // Инициализируем newMessage из localStorage при монтировании или смене чата
  useEffect(() => {
    setNewMessage(getDraftMessage(id));
  }, [id]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'inherit';
    
    const maxHeight = isMobile ? 100 : 200;
    const computed = Math.min(textarea.scrollHeight, maxHeight);
    
    textarea.style.height = `${computed}px`;
  };

  // Сохраняем черновик при изменении сообщения
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    saveDraftMessage(id, value);
    adjustTextareaHeight();
  };

  // Очищаем черновик при отправке сообщения
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.send(JSON.stringify({
      type: 'chat_message',
      message: newMessage
    }));
    setNewMessage("");
    saveDraftMessage(id, ""); // Очищаем черновик
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

  // Функция для извлечения всех URL изображений из сообщений
  const extractImagesFromMessages = useCallback((messages: Message[]) => {
    const urls = new Set<string>();
    messages.forEach(message => {
      const { images } = parseMessageContent(message.content);
      images.forEach(url => urls.add(url));
    });
    return urls;
  }, []);

  // Обновляем эффект для обработки сообщений
  useEffect(() => {
    const imageUrls = extractImagesFromMessages(messages);
    setPendingImages(imageUrls);
  }, [messages]); // Только messages в зависимостях

  // Обработчик успешной загрузки изображения
  const onImageLoad = useCallback((imageUrl: string) => {
    setProcessedImages(prev => new Set([...prev, imageUrl]));
  }, []); // Пустой массив зависимостей

  // Обработчик ошибки загрузки изображения
  const onImageError = useCallback((imageUrl: string) => {
    console.log('Image error:', imageUrl);
    setProcessedImages(prev => new Set([...prev, imageUrl]));
  }, []);

  // Определяем, завершилась ли загрузка всех изображений
  const areAllImagesLoaded = useMemo(() => {
    return [...pendingImages].every(url => processedImages.has(url));
  }, [pendingImages, processedImages]);

  // Следим за состоянием загрузки и управляем видимостью прелоадера
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (!isLoading) {
      console.log('Hiding loader after delay...');
      // Задержка перед скрытием прелоадера
      timeout = setTimeout(() => {
        console.log('Loader hidden');
        setShowLoader(false);
        scrollToBottom();
      }, 250);
    } else {
      console.log('Showing loader');
      setShowLoader(true);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading]);

  // Сбрасываем состояние загрузки при смене чата
  useEffect(() => {
    setIsChatLoading(true);
    setShowLoader(true);
    setPendingImages(new Set());
    setProcessedImages(new Set());
  }, [id]);

  return (
    <div className="flex flex-col fixed inset-0 bg-background">
      <div className="border-b bg-background z-10">
        <div className="flex items-center gap-3 p-4">
          <h2 className="text-xl font-bold truncate">
            Чат #{id}
          </h2>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {!isMobile && (
          <div className="w-[300px] border-r">
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Чаты</h2>
                <CreateChatDialog 
                  onCreateChat={onCreateChat} 
                  trigger={
                    <Button 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <MessageSquarePlus className="h-4 w-4" />
                      Новый
                    </Button>
                  }
                />
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <ChatList 
                  chats={chats}
                  selectedChatId={id}
                  onChatSelect={onChatSelect}
                  isLoading={isChatsLoading}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          {isMobile && (
            <div className="border-b bg-background sticky top-0 z-10">
              <div className="flex items-center p-4 gap-3">
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-bold">Чаты</h2>
                        <CreateChatDialog 
                          onCreateChat={onCreateChat} 
                          trigger={
                            <Button 
                              size="sm" 
                              className="flex items-center gap-2"
                              onClick={() => setIsSidebarOpen(false)}
                            >
                              <MessageSquarePlus className="h-4 w-4" />
                              Новый
                            </Button>
                          }
                        />
                      </div>
                      <div className="flex-1 overflow-hidden p-6 pt-0">
                        <ChatList 
                          chats={chats}
                          selectedChatId={id}
                          onChatSelect={onChatSelect}
                          isLoading={isChatsLoading}
                          onClose={() => setIsSidebarOpen(false)}
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                <h2 className="text-xl font-bold truncate">
                  Чат #{id}
                </h2>
              </div>
            </div>
          )}

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
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {showLoader && (
              <div 
                className={cn(
                  "absolute inset-0",
                  "flex items-center justify-center",
                  "bg-background/80 backdrop-blur-md z-50",
                  "transition-opacity duration-200"
                )}
              >
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
      </div>
    </div>
  );
};

export default ChatDetail;
