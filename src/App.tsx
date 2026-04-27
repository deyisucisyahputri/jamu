import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Leaf, Sparkles, MessageSquare, Menu, X, Plus, Minus, Send, Phone, MapPin } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { JAMU_PRODUCTS } from './constants';
import { CartItem, ChatMessage } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = ({ cartCount, onCartClick, activeTab, setActiveTab }: any) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-jamu-background/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="bg-jamu-sage p-1.5 rounded-lg">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif font-bold text-xl text-jamu-earth tracking-tight">Jamu Nusantara</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setActiveTab('home')}
            className={cn("text-sm font-medium transition-colors hover:text-jamu-sage", activeTab === 'home' ? "text-jamu-sage" : "text-stone-600")}
          >
            Beranda
          </button>
          <button 
            onClick={() => setActiveTab('shop')}
            className={cn("text-sm font-medium transition-colors hover:text-jamu-sage", activeTab === 'shop' ? "text-jamu-sage" : "text-stone-600")}
          >
            Toko
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={cn("text-sm font-medium flex items-center gap-2 transition-colors hover:text-jamu-sage", activeTab === 'ai' ? "text-jamu-sage" : "text-stone-600")}
          >
            <Sparkles className="w-4 h-4" />
            Pakar AI
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onCartClick}
            className="relative p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-stone-700" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-jamu-turmeric text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-jamu-background">
                {cartCount}
              </span>
            )}
          </button>
          <button className="md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

const ProductCard = ({ product, onAddToCart }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all"
    >
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider rounded-md text-jamu-earth">
            {product.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif font-bold text-lg text-jamu-earth">{product.name}</h3>
          <span className="font-bold text-jamu-sage">Rp{product.price.toLocaleString('id-ID')}</span>
        </div>
        <p className="text-sm text-stone-500 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-4">
          {product.benefits.slice(0, 2).map((benefit: string, i: number) => (
             <span key={i} className="text-[10px] bg-jamu-cream/30 text-jamu-earth px-2 py-0.5 rounded-full border border-jamu-cream">
               {benefit}
             </span>
          ))}
        </div>
        <button 
          onClick={() => onAddToCart(product)}
          className="w-full py-2 bg-jamu-sage hover:bg-jamu-sage/90 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah ke Keranjang
        </button>
      </div>
    </motion.div>
  );
};

const AIConsultation = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Halo! Saya Pakar Jamu AI. Apa keluhan kesehatan Anda hari ini? Saya bisa merekomendasikan jamu yang tepat berdasarkan kearifan lokal Nusantara. 😊' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Anda adalah ahli jamu tradisional Indonesia yang bijak dan ramah. 
      Gunakan data produk berikut jika relevan: ${JSON.stringify(JAMU_PRODUCTS)}.
      
      User bertanya atau mengeluh: "${userMessage}"
      
      Berikan saran kesehatan tradisional, jelaskan manfaat jamu yang relevan, dan berikan rekomendasi spesifik dari daftar produk kami. 
      Gunakan format Markdown yang rapi. Jangan terlalu panjang.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Maaf, ramuan AI saya sedang terganggu. Coba lagi nanti ya." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100 h-[70vh] flex flex-col">
      <div className="bg-jamu-earth p-4 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-serif font-bold text-lg">Pakar Jamu AI</h2>
          <p className="text-[10px] text-white/70">Konsultasi Tradisional Digital</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] p-4 rounded-2xl text-sm",
              msg.role === 'user' ? "bg-jamu-sage text-white rounded-tr-none" : "bg-stone-100 text-stone-800 rounded-tl-none markdown-body"
            )}>
              {msg.role === 'user' ? msg.content : <ReactMarkdown>{msg.content}</ReactMarkdown>}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-stone-100 p-4 rounded-2xl rounded-tl-none animate-pulse flex gap-2 italic text-stone-500">
              Pakar sedang meramu jawaban...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-stone-100 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Keluhan Anda (misal: Badan pegal, kurang nafsu makan)..."
          className="flex-1 px-4 py-3 bg-stone-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-jamu-sage/20 text-sm"
        />
        <button 
          onClick={sendMessage}
          className="bg-jamu-earth text-white p-3 rounded-xl hover:bg-jamu-earth/90 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const CartDrawer = ({ isOpen, onClose, cartItems, updateQuantity, totalPrice }: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-jamu-background z-[70] shadow-2xl p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif font-bold text-2xl text-jamu-earth">Keranjang Anda</h2>
              <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 text-stone-400">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Keranjang masih kosong</p>
                </div>
              ) : (
                cartItems.map((item: CartItem) => (
                  <div key={item.id} className="flex gap-4 bg-white p-3 rounded-2xl border border-stone-100">
                    <img src={item.image} className="w-20 h-20 rounded-xl object-cover" alt={item.name} referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <h4 className="font-bold text-jamu-earth">{item.name}</h4>
                      <p className="text-sm font-bold text-jamu-sage mb-2">Rp{item.price.toLocaleString('id-ID')}</p>
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 border border-stone-200 rounded-md hover:bg-stone-50">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 border border-stone-200 rounded-md hover:bg-stone-50">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-6 border-t border-stone-200 mt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-stone-500">Total Pembayaran</span>
                <span className="font-serif font-bold text-2xl text-jamu-earth">Rp{totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <button 
                disabled={cartItems.length === 0}
                className="w-full py-4 bg-jamu-earth text-white font-bold rounded-2xl hover:bg-jamu-earth/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout Sekarang
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'ai'>('home');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const filteredProducts = activeCategory === 'Semua' 
    ? JAMU_PRODUCTS 
    : JAMU_PRODUCTS.filter(p => p.category === activeCategory);

  const addToCart = (product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen pt-16">
      <Navbar 
        cartCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main>
        {activeTab === 'home' && (
          <>
            {/* Hero */}
            <section className="relative py-20 px-4 overflow-hidden">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-1 text-center md:text-left"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-jamu-sage/10 text-jamu-sage rounded-full text-xs font-bold mb-6">
                    <Sparkles className="w-3 h-3" />
                    <span>#1 Tradisi Herbal Digital</span>
                  </div>
                  <h1 className="font-serif text-5xl md:text-7xl font-bold text-jamu-earth leading-[1.1] mb-6">
                    Sehat Alami dengan <span className="text-jamu-sage italic">Jamu Nusantara</span>.
                  </h1>
                  <p className="text-stone-600 text-lg mb-10 max-w-xl leading-relaxed">
                    Membawa kearifan lokal ke genggaman Anda. Temukan ramuan tradisional terpilih yang disesuaikan dengan kebutuhan kesehatan modern.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                    <button 
                      onClick={() => setActiveTab('shop')}
                      className="px-8 py-4 bg-jamu-earth text-white rounded-2xl font-bold shadow-lg shadow-jamu-earth/20 hover:scale-105 transition-transform"
                    >
                      Mulai Belanja
                    </button>
                    <button 
                      onClick={() => setActiveTab('ai')}
                      className="px-8 py-4 bg-white text-jamu-earth border border-jamu-earth/20 rounded-2xl font-bold hover:bg-stone-50 transition-colors flex items-center gap-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Konsultasi AI
                    </button>
                  </div>
                </motion.div>
                
                <motion.div 
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="flex-1 relative"
                >
                  <div className="w-full aspect-[4/5] bg-jamu-cream/30 rounded-[40px] overflow-hidden rotate-2 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1621506821199-a996b7df6804?q=80&w=1000&auto=format&fit=crop" 
                      className="w-full h-full object-cover -rotate-2"
                      alt="Jamu Ingredients"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl shadow-black/5 border border-stone-100 max-w-[200px]">
                    <div className="flex items-center gap-2 mb-2 text-jamu-sage font-bold">
                       <Leaf className="w-4 h-4" />
                       <span className="text-xs">100% Organik</span>
                    </div>
                    <p className="text-[10px] text-stone-500 leading-tight">Bahan rempah pilihan langsung dari petani Nusantara.</p>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-stone-50">
              <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: Leaf, title: 'Warisan Alam', desc: 'Resep turun temurun yang dijaga keasliannya dan menggunakan bahan 100% rimpang asli.' },
                  { icon: Sparkles, title: 'Teknologi AI', desc: 'Bantuan asisten cerdas untuk menentukan ramuan yang paling cocok dengan metabolisme tubuh Anda.' },
                  { icon: ShoppingCart, title: 'Mudah & Cepat', desc: 'Pesan jamu favorit Anda dan kami antar dalam kondisi paling segar langsung ke rumah.' }
                ].map((item, i) => (
                  <div key={i} className="p-8 bg-white rounded-3xl border border-stone-100">
                    <div className="w-12 h-12 bg-jamu-cream/30 rounded-xl flex items-center justify-center mb-6">
                      <item.icon className="w-6 h-6 text-jamu-earth" />
                    </div>
                    <h3 className="font-serif font-bold text-xl mb-3 text-jamu-earth">{item.title}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="font-serif text-4xl font-bold text-jamu-earth mb-4">Ramuan Favorit</h2>
                  <p className="text-stone-500 max-w-md mx-auto">Pilihan terbaik pelanggan untuk menjaga kesehatan dan kesegaran harian.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {JAMU_PRODUCTS.slice(0, 3).map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
                <div className="text-center mt-12">
                   <button 
                    onClick={() => setActiveTab('shop')}
                    className="text-jamu-sage font-bold hover:underline flex items-center gap-2 mx-auto"
                   >
                     Lihat Semua Produk
                     <Plus className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'shop' && (
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                  <h2 className="font-serif text-4xl font-bold text-jamu-earth mb-2">Toko Jamu Nusantara</h2>
                  <p className="text-stone-500">Pilih ramuan sehatmu hari ini.</p>
                </div>
                <div className="flex gap-2">
                   {['Semua', 'Segar', 'Kesehatan', 'Energi'].map(cat => (
                     <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                       "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                       cat === activeCategory ? "bg-jamu-sage text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                     )}>
                       {cat}
                     </button>
                   ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'ai' && (
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-4xl font-bold text-jamu-earth mb-4">Konsultasi Pakar AI</h2>
                <p className="text-stone-500 max-w-xl mx-auto">Tanyakan keluhan kesehatan Anda, dan asisten AI kami akan menyarankan ramuan tradisional yang paling tepat.</p>
              </div>
              <AIConsultation />
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-jamu-earth text-white/90 py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-white p-1.5 rounded-lg">
                <Leaf className="w-5 h-5 text-jamu-earth" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight">Jamu Nusantara</span>
            </div>
            <p className="text-white/60 text-sm max-w-sm leading-relaxed">
              Melestarikan warisan leluhur melalui ramuan herbal terbaik yang diolah secara higienis dan modern untuk kesehatan generasi masa kini.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Tautan Cepat</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('home')}>Beranda</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('shop')}>Toko Online</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('ai')}>Pakar AI</li>
              <li className="hover:text-white cursor-pointer">Tentang Kami</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Jl. Rempah Sari No. 45, Yogyakarta
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +62 812-3456-7890
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 border-t border-white/10 mt-12 text-center text-xs text-white/40">
          &copy; 2026 Jamu Nusantara. Semua hak dilindungi. Crafted with ❤️ in Indonesia.
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
        updateQuantity={updateQuantity}
        totalPrice={totalPrice}
      />
    </div>
  );
}
