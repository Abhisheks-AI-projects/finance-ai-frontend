export interface Message {
  message_id: string;
  message_type: "user" | "ai";
  content: string;
  timestamp: string;
}

export interface Thread {
  thread_id: string;
  user_id: string;
  title: string | null;
  messages: Message[];
  is_shared: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  amount: number;
  transaction_type: "income" | "expense";
  category: string;
  description: string | null;
  transaction_date: string;
  created_at: string | null;
}

export interface UserMetadata {
  user_id: string;
  email: string;
  name: string;
}
