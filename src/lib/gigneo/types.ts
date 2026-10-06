export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url?: string;
}

export interface WalletBalance {
  available: number;
  pending: number;
  currency: string;
}

export interface Order {
  id: number;
  title: string;
  amount: number;
  status: 'pending' | 'active' | 'delivered' | 'completed' | 'cancelled' | 'disputed';
  date: string;
}

export interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  date: string;
}
