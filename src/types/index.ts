
export interface User {
  id: number;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

export interface Message {
  id: number;
  content: string;
  timestamp: string;
  sender: 'me' | number; // 'me' or user id
  status: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: number;
  user: User;
  messages: Message[];
  unreadCount: number;
}
