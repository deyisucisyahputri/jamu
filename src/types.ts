export interface JamuProduct {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  price: number;
  image: string;
  category: 'Segar' | 'Kesehatan' | 'Energi';
}

export interface CartItem extends JamuProduct {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
