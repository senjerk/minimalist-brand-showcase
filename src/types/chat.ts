
export interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  isRead: boolean;
  timestamp: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Chat {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage?: Message;
  unreadCount: number;
}
