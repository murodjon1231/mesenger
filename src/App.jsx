import React, { useState, useEffect, useRef } from 'react';
import { X, Car, Shield, Clock, Phone, User, Package, Settings, Hash, CheckCircle, AlertCircle, Plus, MessageCircle, Send, Star, Heart, Share2, Download, Globe, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

// === CONFIGURATION ===
const TELEGRAM_TOKEN = '7629464977:AAHKV0p_iqymDXQf9UgqM7EPCXoH4zOwPl0';
const ADMIN_INFO = {
  '6226950895': 'Ewaranon (Best Elecs)tric Automotive Part',
  '47075514': 'Ronnie (@Ron_i)',
  '987654321': 'Ronix (Ronix Network)',
  '449040831': 'RED ONE AUTO (@redoneauto)',
  '685140010': 'Murod (Ronas Owner)'
};
const ADMIN_IDS = Object.keys(ADMIN_INFO);

// === TELEGRAM SENDER ===
async function sendTelegramMessage({ message, ids = ADMIN_IDS }) {
  const results = await Promise.all(ids.map(async (chatId) => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
      });
      if (response.ok) return { chatId, ok: true };
      const err = await response.json();
      return { chatId, ok: false, error: err.description };
    } catch (e) {
      return { chatId, ok: false, error: e.message };
    }
  }));
  return {
    success: results.filter(r => r.ok).length,
    total: ids.length,
    errors: results.filter(r => !r.ok)
  };
}

// Helper to generate unique order ID (date + random)
function generateOrderId() {
  const now = new Date();
  return (
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    '-' +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0') +
    '-' +
    Math.floor(Math.random() * 100000)
  );
}

// === MAIN COMPONENT ===
const HyundaiKiaLanding = () => {
  // --- STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', products: [''], carBrand: '', vinCode: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Salom! Ronas xizmatiga xush kelibsiz! Qanday yordam bera olaman?", sender: 'bot', time: new Date() },
    { id: 2, text: "Avtoehtiyot qismlari haqida ma'lumot kerakmi?", sender: 'bot', time: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isOnline] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTyping, setIsTyping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inputPlaceholder, setInputPlaceholder] = useState('Savolingizni yozing...');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageModal, setImageModal] = useState(null);
  const [chatTheme, setChatTheme] = useState('dark');
  const [userInfo, setUserInfo] = useState({ name: '', surname: '', phone: '' });
  const [userInfoModal, setUserInfoModal] = useState(false);
  const chatEndRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [lastUserQuestion, setLastUserQuestion] = useState('');

  // --- EFFECTS ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isChatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
    }
  }, [chatMessages, isChatOpen]);

  // Show scroll-to-bottom button if not at bottom
  useEffect(() => {
    if (!isChatOpen || !chatBoxRef.current) return;
    const onScroll = () => {
      const el = chatBoxRef.current;
      setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
    };
    
    chatBoxRef.current.addEventListener('scroll', onScroll);
    return () => chatBoxRef.current && chatBoxRef.current.removeEventListener('scroll', onScroll);
  }, [isChatOpen]);

  // Notification badge for new messages
  useEffect(() => {
    if (!isChatOpen && chatMessages.length > 0 && chatMessages[chatMessages.length - 1].sender === 'bot') {
      setUnreadCount((c) => c + 1);
    }
  }, [chatMessages, isChatOpen]);

  // Animated placeholder
  useEffect(() => {
    const phrases = [
      'Savolingizni yozing...',
      'Masalan: Ish vaqti',
      'Masalan: Buyurtma berish',
      'Masalan: Manzil',
      'Masalan: Kafolat',
    ];
    let i = 0;
    const interval = setInterval(() => {
      setInputPlaceholder(phrases[i % phrases.length]);
      i++;
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Show user info modal when chat is opened for the first time
  useEffect(() => {
    if (isChatOpen && (!userInfo.name || !userInfo.surname || !userInfo.phone)) {
      setUserInfoModal(true);
    }
  }, [isChatOpen]);

  // --- NOTIFICATION ---
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  // --- FORM HANDLERS ---
  const openModal = (type) => { setModalType(type); setIsModalOpen(true); };
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', products: [''], carBrand: '', vinCode: '' });
    setIsSubmitting(false);
  };
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleProductChange = (index, value) => {
    const newProducts = [...formData.products];
    newProducts[index] = value;
    setFormData({ ...formData, products: newProducts });
  };
  const handleProductKeyPress = (e, index) => {
    if (e.key === 'Enter') { e.preventDefault(); addProduct(); }
    if (e.key === 'Delete' && formData.products.length > 1) { e.preventDefault(); removeProduct(index); }
  };
  const addProduct = () => setFormData({ ...formData, products: [...formData.products, ''] });
  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      setFormData({ ...formData, products: formData.products.filter((_, i) => i !== index) });
    }
  };

  // --- TELEGRAM ORDER SENDER ---
  const handleSubmit = async () => {
    if (!formData.name.trim()) return showNotification('error', 'Iltimos ismingizni kiriting');
    if (!formData.phone.trim()) return showNotification('error', 'Iltimos telefon raqamingizni kiriting');
    if (formData.products.every(p => p.trim() === '')) return showNotification('error', 'Iltimos kamida bitta mahsulot kiriting');
    if (!formData.carBrand) return showNotification('error', 'Iltimos mashina markasini tanlang');
    setIsSubmitting(true);
    const orderId = generateOrderId();
    const products = formData.products.filter(p => p.trim() !== '');
    const productsList = products.map((product, i) => `   ${i + 1}. ${product}`).join('\n');
    const requestType = modalType === 'price' ? '💰 Narx so\'rovi' : '🛒 Sotib olish';
    const currentTimeStr = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    const message = `🚗 <b>RONAS - YANGI BUYURTMA</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🆔 <b>Buyurtma ID:</b> <code>${orderId}</code>\n👤 <b>Ism:</b> <code>${formData.name}</code>\n📞 <b>Telefon:</b> <code>${formData.phone}</code>\n🛒 <b>Buyurtma turi:</b> ${requestType}\n\n📦 <b>Mahsulotlar (${products.length} ta):</b>\n${productsList}\n\n🚙 <b>Mashina:</b> ${formData.carBrand}\n🔢 <b>VIN:</b> <code>${formData.vinCode || 'Ko\'rsatilmagan'}</code>\n\n🕒 <b>Sana/Vaqt:</b> <code>${currentTimeStr}</code>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🔔 <i>Yangi buyurtma! Operator javobini kuting.</i>`;
    const result = await sendTelegramMessage({ message });
    if (result.success > 0) {
      showNotification('success', `So'rov muvaffaqiyatli yuborildi! (${result.success}/${result.total} adminlarga yetkazildi)`);
      closeModal();
        } else {
      showNotification('error', 'Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
      console.error('Telegram errors:', result.errors);
    }
    setIsSubmitting(false);
  };

  // --- CHAT SENDER ---
  const sendChatToTelegram = async (text, userPhone = '', userFullName = '') => {
    const now = new Date();
    const message = `💬 <b>RONAS CHAT - YANGI SO'ROV</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n👤 <b>Foydalanuvchi:</b> <code>${userFullName || 'Noma\'lum'}</code>\n📞 <b>Telefon:</b> <code>${userPhone || '-'}</code>\n📝 <b>Xabar:</b>\n<code>${text}</code>\n\n🕒 <b>Sana/Vaqt:</b> <code>${now.toLocaleString('uz-UZ', {timeZone: 'Asia/Tashkent'})}</code>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🔔 <i>Yangi chat so'rovi! Operator javobini kuting.</i>`;
    return await sendTelegramMessage({ message });
  };

  // --- SMART, CONTEXTUAL BOT REPLIES ---
  const getBotReply = (userText, prevQuestion) => {
    const lower = userText.toLowerCase();
    // Contextual follow-up
    if (prevQuestion && lower.includes('ha') && prevQuestion.includes('buyurtma')) {
      return "Ajoyib! Buyurtma uchun mahsulot nomini va telefon raqamingizni yozing yoki 'zakaz berish' deb yozing.";
    }
    if (prevQuestion && lower.includes('ha') && prevQuestion.includes('kafolat')) {
      return "Barcha mahsulotlarimizga 12-24 oylik kafolat beriladi. Yana savolingiz bormi?";
    }
    // Main answers
    if (lower.includes('salom') || lower.includes('assalomu alaykum')) {
      return `Salom, ${userInfo.name || ''}! Ronas Support xizmatida savollaringiz bo'lsa, bemalol yozing.`;
    }
    if (lower.includes('ish vaqti')) {
      return "Biz har kuni 09:00-19:00 (Yakshanba 09:00-17:00) ishlaymiz. Yordam bera olishim mumkinmi?";
    }
    if (lower.includes('manzil')) {
      return "Bizning manzil: S.Yusupov, Little Ring Road, Toshkent. Yana savolingiz bormi?";
    }
    if (lower.includes('telefon') || lower.includes('raqam')) {
      return "+998 90 324 94 97 orqali bog'lanishingiz mumkin.";
    }
    if (lower.includes('kafolat')) {
      return "Barcha mahsulotlarimizga 12-24 oylik kafolat beriladi. Kafolat haqida yana savol bormi?";
    }
    if (lower.includes('narx')) {
      return "Narxlar mahsulotga qarab farq qiladi. Qaysi mahsulot kerakligini yozing, aniq narxini aytaman.";
    }
    if (lower.includes('qanday') && lower.includes('buyurtma')) {
      return "Buyurtma uchun mahsulot nomini va telefon raqamingizni yozing yoki 'zakaz berish' deb yozing. Yordam bera olishim mumkinmi?";
    }
    if (lower.includes('rahmat')) {
      return "Sizga yordam bera olganimdan xursandman! Yana savolingiz bo'lsa, yozing.";
    }
    if (lower.includes('ha')) {
      return "Savolingizni aniqroq yozing yoki mahsulot nomini kiriting.";
    }
    // Default
    return "Savolingiz uchun rahmat! Tez orada javob beramiz yoki operatorimiz bog'lanadi.";
  };

  // --- SEND MESSAGE (context-aware) ---
  const sendMessage = async (msg) => {
    const userText = (typeof msg === 'string' ? msg : newMessage.trim());
    if (!userText) return;
    setChatMessages(prev => [...prev, { id: Date.now(), text: userText, sender: 'user', time: new Date() }]);
    setNewMessage('');
    setLastUserQuestion(userText);
    const lower = userText.toLowerCase();
    const zakazWords = ['zakaz', 'zakaz berish', 'buyurtma', 'buyurtma berish', 'заказ', 'заказ бериш'];
    setIsTyping(true);
    if (zakazWords.some(w => lower.includes(w))) {
      const result = await sendChatToTelegram(userText, userInfo.phone, userInfo.name + ' ' + userInfo.surname);
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now(),
          text: result.success > 0
            ? `So'rovingiz qabul qilindi! (${result.success}/${result.total} adminlarga yuborildi: ${Object.entries(ADMIN_INFO).filter(([id]) => result.errors.every(e => e.chatId !== id)).map(([,name]) => name).join(', ')})`
            : `Xatolik: So'rov yuborilmadi. Iltimos, qayta urinib ko'ring.`,
          sender: 'bot',
          time: new Date()
        }]);
        setIsTyping(false);
      }, 1200);
      if (result.errors.length > 0) {
        showNotification('error', `Ba'zi adminlarga yuborilmadi: ${result.errors.map(e => ADMIN_INFO[e.chatId] || e.chatId).join(', ')}`);
      }
      return;
    }
    // Contextual, grammatically correct bot reply
    const botReply = getBotReply(userText, lastUserQuestion);
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        text: botReply,
        sender: 'bot',
        time: new Date()
      }]);
      setIsTyping(false);
    }, 1200);
  };

  // --- PRODUCT ACTIONS ---
  const toggleFavorite = (productName) => {
    setFavorites(prev => prev.includes(productName)
      ? prev.filter(name => name !== productName)
      : [...prev, productName]
    );
  };
  const shareProduct = (productName) => {
    if (navigator.share) {
      navigator.share({
        title: `Ronas - ${productName}`,
        text: `${productName} haqida ma'lumot olish uchun Ronas bilan bog'laning!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${productName} - ${window.location.href}`);
      showNotification('success', 'Havola nusxalandi!');
    }
  };

  // --- KEYBOARD HANDLER ---
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // --- IMAGE HANDLERS ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match(/^image\/(jpeg|png|gif)$/)) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview({ url: ev.target.result, name: file.name });
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      if (file) alert('Faqat jpg, png yoki gif rasm yuklash mumkin!');
    }
  };
  const sendImage = () => {
    if (imagePreview) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        text: '',
        sender: 'user',
        time: new Date(),
        image: imagePreview.url,
        imageName: imagePreview.name
      }]);
      setImagePreview(null);
    }
  };

  // --- USER INFO HANDLER ---
  const handleUserInfoChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    if (!userInfo.name.trim() || !userInfo.surname.trim() || !userInfo.phone.trim()) return;
    setUserInfoModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl border backdrop-blur-sm animate-fade-in-up ${notification.type === 'success'
          ? 'bg-emerald-900/90 border-emerald-500 text-emerald-100'
          : 'bg-red-900/90 border-red-500 text-red-100'
          }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dark Animated Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-400 rounded-full animate-pulse blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-violet-400 rounded-full animate-bounce delay-300 blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-20 h-20 bg-orange-400 rounded-full animate-ping delay-700 blur-xl"></div>
          <div className="absolute bottom-40 right-40 w-16 h-16 bg-cyan-400 rounded-full animate-pulse delay-1000 blur-xl"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="inline-block p-4 bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl border border-slate-600 shadow-2xl">
                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 mb-2 animate-fade-in-up">
                  RONAS
                </h1>
                <div className="flex justify-center items-center gap-6 mt-4">
                  <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                    HYUNDAI
                  </span>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                    KIA
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 animate-fade-in-up delay-300 max-w-3xl mx-auto leading-relaxed">
              Professional avtoehtiyot qismlari - Zamonaviy yechimlar, ishonchli xizmat
            </p>

            {/* Brand Cards */}
            <div className="flex justify-center items-center gap-8 mb-16 animate-fade-in-up delay-500">
              <div className="group bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/50 transform hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-emerald-500/20">
                <Car className="w-20 h-20 text-red-400 mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300" />
                <h3 className="text-white font-bold text-xl mb-2">HYUNDAI</h3>
                <p className="text-slate-400 text-sm">Original qismlar</p>
              </div>
              <div className="w-px h-20 bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>
              <div className="group bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/50 transform hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/20">
                <Settings className="w-20 h-20 text-blue-400 mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300" />
                <h3 className="text-white font-bold text-xl mb-2">KIA</h3>
                <p className="text-slate-400 text-sm">Sifatli ehtiyot qismlar</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center animate-fade-in-up delay-700">
              <button
                onClick={() => openModal('price')}
                className="group relative bg-gradient-to-r from-orange-600 to-red-700 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-orange-500/30 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-3">
                  💰 Narx So'rash
                </span>
              </button>
              <button
                onClick={() => openModal('buy')}
                className="group relative bg-gradient-to-r from-emerald-600 to-cyan-700 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-emerald-500/30 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-3">
                  🛒 Sotib Olish
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-12 border-2 border-slate-400 rounded-full flex justify-center">
            <div className="w-1 h-4 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-24 bg-gradient-to-r from-slate-900 to-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center text-white mb-20">
            Bizning <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Afzalliklarimiz</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            <div className="group bg-slate-800/50 backdrop-blur-lg rounded-3xl p-10 border border-slate-700/50 hover:border-emerald-500/50 transform hover:-translate-y-4 transition-all duration-500 shadow-2xl hover:shadow-emerald-500/20">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:rotate-12 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Kafolat</h3>
              <p className="text-slate-300 text-center leading-relaxed text-lg">
                Barcha mahsulotlarimizga 12 oylik kafolat beramiz. Sifat va ishonch bizning ustuvorimiz.
              </p>
            </div>

            <div className="group bg-slate-800/50 backdrop-blur-lg rounded-3xl p-10 border border-slate-700/50 hover:border-orange-500/50 transform hover:-translate-y-4 transition-all duration-500 shadow-2xl hover:shadow-orange-500/20">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:rotate-12 transition-transform duration-300">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Tez Yetkazib Berish</h3>
              <p className="text-slate-300 text-center leading-relaxed text-lg">
                Buyurtmangizni 24 soat ichida tayyor qilib, tez va xavfsiz yetkazib beramiz.
              </p>
            </div>

            <div className="group bg-slate-800/50 backdrop-blur-lg rounded-3xl p-10 border border-slate-700/50 hover:border-violet-500/50 transform hover:-translate-y-4 transition-all duration-500 shadow-2xl hover:shadow-violet-500/20">
              <div className="bg-gradient-to-r from-violet-500 to-purple-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:rotate-12 transition-transform duration-300">
                <Package className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Keng Assortiment</h3>
              <p className="text-slate-300 text-center leading-relaxed text-lg">
                Hyundai va Kia uchun 5000+ dan ortiq avtoehtiyot qismlari doimo mavjud.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-slate-900">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center text-white mb-20">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Mashhur</span> Mahsulotlar
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              { name: 'Tormoz Kolodkasi', price: '120,000 - 250,000', img: '/img.png', color: 'from-red-500 to-pink-500', rating: 4.8, reviews: 156 },
              { name: 'Motor Yog\'i', price: '80,000 - 150,000', img: '/img1.png', color: 'from-blue-500 to-cyan-500', rating: 4.9, reviews: 203 },
              { name: 'Filtr To\'plami', price: '45,000 - 85,000', img: '/img2.png', color: 'from-green-500 to-emerald-500', rating: 4.7, reviews: 89 },
              { name: 'Moy Filtri', price: '25,000 - 65,000', img: '/img3.png', color: 'from-yellow-500 to-orange-500', rating: 4.6, reviews: 134 }
            ].map((product, index) => (
              <div key={index} className="group bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 hover:border-orange-500/50 transform hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-orange-500/20">
                <div className="relative">
                <div className={`bg-gradient-to-r ${product.color} w-22 h-22 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <img src={product.img} alt={product.name} className="p-2" />
                </div>
                  
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(product.name)}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
                      favorites.includes(product.name) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-slate-700/80 text-slate-300 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(product.name) ? 'fill-current' : ''}`} />
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => shareProduct(product.name)}
                    className="absolute top-2 left-2 p-2 rounded-full bg-slate-700/80 text-slate-300 hover:bg-blue-500 hover:text-white transition-all duration-300"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 text-center">{product.name}</h3>
                
                {/* Rating */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />
                    ))}
                  </div>
                  <span className="text-slate-400 text-sm">({product.reviews})</span>
                </div>

                <p className="text-orange-400 font-semibold text-center mb-4">{product.price} so'm</p>
                
                <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      products: [product.name]
                    }));
                    openModal('price');
                  }}
                    className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 text-white py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                >
                  Narxini Bilish
                </button>
                  <button
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        products: [product.name]
                      }));
                      openModal('buy');
                    }}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-2 rounded-lg font-medium hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300"
                  >
                    Sotib Olish
                </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Working Hours & Contact */}
      <section className="py-24 bg-gradient-to-r from-slate-800 to-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            <div className="bg-slate-900/50 backdrop-blur-lg rounded-3xl p-10 border border-slate-700/50">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Ish Vaqti</span>
              </h3>
              <div className="space-y-4">
                {[
                  { day: 'Dushanba', time: '09:00 - 19:00', active: true },
                  { day: 'Seshanba', time: '09:00 - 19:00', active: true },
                  { day: 'Chorshanba', time: '09:00 - 19:00', active: true },
                  { day: 'Payshanba', time: '09:00 - 19:00', active: true },
                  { day: 'Juma', time: '09:00 - 19:00', active: true },
                  { day: 'Shanba', time: '09:00 - 19:00', active: true },
                  { day: 'Yakshanba', time: '09:00 - 17:00', active: true }
                ].map((schedule, index) => (
                  <div key={index} className={`flex justify-between items-center p-4 rounded-xl ${schedule.active ? 'bg-emerald-900/30 border border-emerald-500/30' : 'bg-red-900/30 border border-red-500/30'
                    }`}>
                    <span className="text-white font-medium">{schedule.day}</span>
                    <span className={`font-semibold ${schedule.active ? 'text-emerald-400' : 'text-red-400'}`}>
                      {schedule.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-lg rounded-3xl p-10 border border-slate-700/50">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Aloqa</span>
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Telefon</p>
                    <p className="text-white font-semibold text-lg">+998 90 324 94 97</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">@</span>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Telegram</p>
                    <p className="text-white font-semibold text-lg">@Hyundai_kiamobis</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-500 to-violet-500 w-12 h-12 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">📍</span>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Manzil</p>
                      <p className="text-white font-semibold">S.Yusupov, Little Ring Road, 100123, Tashkent, Узбекистан</p>
                    </div>
                  </div>
                  <div className="rounded-xl overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6017.304405795764!2d69.19800286460733!3d41.28181411370707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8a287b54c777%3A0xc6393f18622d896d!2sAvtomarket%20HYUNDAI%20KIA%20Toshkent.!5e0!3m2!1sru!2s!4v1748411748160!5m2!1sru!2s"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-slate-900">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center text-white mb-20">
            Ko'p <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">So'raladigan</span> Savollar
          </h2>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "Mahsulotlar original emasmi?",
                answer: "Ha, biz faqat original va sertifikatlangan ehtiyot qismlar bilan ishlaymiz. Barcha mahsulotlar rasmiy distributorlardan olinadi."
              },
              {
                question: "Yetkazib berish qancha vaqt oladi?",
                answer: "Odatda 1 kun ichida yetkazib beramiz. Maxsus buyurtmalar uchun 8-12 kun vaqt ketishi mumkin."
              },
              {
                question: "To'lov usullari qanday?",
                answer: "Naqd pul, plastik karta va bank o'girimi orqali to'lov qabul qilamiz. Yetkazib berganda ham to'lash mumkin."
              },
              {
                question: "Kafolat muddati qancha?",
                answer: "Barcha mahsulotlarimizga 1 oylik kafolat beramiz. Kafolat muddatida bepul almashtirish xizmati mavjud."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50 hover:border-violet-500/50 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="bg-gradient-to-r from-violet-500 to-purple-500 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mr-4">
                    {index + 1}
                  </span>
                  {faq.question}
                </h3>
                <p className="text-slate-300 leading-relaxed pl-12">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Features Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center text-white mb-20">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Yangi</span> Xususiyatlar
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Live Chat */}
            <div className="group bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/50 hover:border-emerald-500/50 transform hover:-translate-y-2 transition-all duration-500 shadow-2xl hover:shadow-emerald-500/20">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Jonli Chat</h3>
              <p className="text-slate-300 text-center leading-relaxed">
                Mutaxassislarimiz bilan bevosita bog'laning va darhol javob oling. 24/7 qo'llab-quvvatlash.
              </p>
            </div>

            {/* Smart Search */}
            <div className="group bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/50 hover:border-blue-500/50 transform hover:-translate-y-2 transition-all duration-500 shadow-2xl hover:shadow-blue-500/20">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Aqlli Qidiruv</h3>
              <p className="text-slate-300 text-center leading-relaxed">
                VIN kod orqali avtomatik mahsulot topish. Mashinangizga mos ehtiyot qismlarni tezda toping.
              </p>
            </div>

            {/* Mobile App */}
            <div className="group bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/50 hover:border-purple-500/50 transform hover:-translate-y-2 transition-all duration-500 shadow-2xl hover:shadow-purple-500/20">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Mobil Ilova</h3>
              <p className="text-slate-300 text-center leading-relaxed">
                Android va iOS uchun maxsus ilova. Har joyda Ronas xizmatlaridan foydalaning.
              </p>
            </div>

            {/* Price Comparison */}
            <div className="group bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/50 hover:border-orange-500/50 transform hover:-translate-y-2 transition-all duration-500 shadow-2xl hover:shadow-orange-500/20">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Narx Taqqoslash</h3>
              <p className="text-slate-300 text-center leading-relaxed">
                Turli brendlar va narxlarni taqqoslab, eng yaxshi taklifni tanlang.
              </p>
            </div>

            {/* Fast Delivery */}
            <div className="group bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/50 hover:border-green-500/50 transform hover:-translate-y-2 transition-all duration-500 shadow-2xl hover:shadow-green-500/20">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Tez Yetkazib Berish</h3>
              <p className="text-slate-300 text-center leading-relaxed">
                Toshkent bo'ylab 2 soat ichida, viloyatlarga 24 soat ichida yetkazib berish.
              </p>
            </div>

            {/* Warranty */}
            <div className="group bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/50 hover:border-yellow-500/50 transform hover:-translate-y-2 transition-all duration-500 shadow-2xl hover:shadow-yellow-500/20">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Kengaytirilgan Kafolat</h3>
              <p className="text-slate-300 text-center leading-relaxed">
                24 oylik kafolat va bepul almashtirish xizmati. Ishonchli va xavfsiz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>

          <div className="bg-slate-800 rounded-3xl p-10 max-w-lg w-full relative z-10 shadow-2xl animate-scale-in border border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold text-white">
                {modalType === 'price' ? '💰 Narx So\'rash' : '🛒 Sotib Olish'}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center text-slate-300 font-medium mb-3">
                  <User className="w-5 h-5 mr-3 text-emerald-400" />
                  Ism Familya *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                  placeholder="Ismingizni kiriting"
                />
              </div>

              <div>
                <label className="flex items-center text-slate-300 font-medium mb-3">
                  <Phone className="w-5 h-5 mr-3 text-cyan-400" />
                  Telefon Raqam *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  required
                  placeholder="+998 90 123 45 67"
                />
              </div>

              <div>
                <label className="flex items-center text-slate-300 font-medium mb-3">
                  <Package className="w-5 h-5 mr-3 text-orange-400" />
                  Mahsulotlar *
                  <span className="text-sm text-slate-400 ml-2 hidden md:inline">(Enter - qo'shish, Delete - o'chirish)</span>
                </label>
                <div className="space-y-3">
                  {formData.products.map((product, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="bg-slate-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={product}
                        onChange={(e) => handleProductChange(index, e.target.value)}
                        onKeyDown={(e) => handleProductKeyPress(e, index)}
                        className="flex-1 px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        placeholder={`Mahsulot ${index + 1}`}
                      />
                      {formData.products.length > 1 && (
                        <button
                          onClick={() => removeProduct(index)}
                          className="text-red-400 hover:text-red-300 p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add Product Button */}
                  <button
                    onClick={addProduct}
                    className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-slate-300 hover:border-slate-500 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Mahsulot qo'shish</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center text-slate-300 font-medium mb-3">
                  <Car className="w-5 h-5 mr-3 text-violet-400" />
                  Mashina Markasi *
                </label>
                <select
                  name="carBrand"
                  value={formData.carBrand}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                  required
                >
                  <option value="">Markani tanlang</option>
                  <option value="Hyundai Accent">Hyundai Accent</option>
                  <option value="Hyundai Elantra">Hyundai Elantra</option>
                  <option value="Hyundai Sonata">Hyundai Sonata</option>
                  <option value="Hyundai Tucson">Hyundai Tucson</option>
                  <option value="Hyundai Santa Fe">Hyundai Santa Fe</option>
                  <option value="Kia Rio">Kia Rio</option>
                  <option value="Kia Cerato">Kia Cerato</option>
                  <option value="Kia Optima">Kia Optima</option>
                  <option value="Kia Sportage">Kia Sportage</option>
                  <option value="Kia Sorento">Kia Sorento</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-slate-300 font-medium mb-3">
                  <Hash className="w-5 h-5 mr-3 text-yellow-400" />
                  VIN Kod <span className="text-sm text-slate-400">(ixtiyoriy)</span>
                </label>
                <input
                  type="text"
                  name="vinCode"
                  value={formData.vinCode}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  placeholder="VIN kod kiriting (17 ta belgi)"
                  maxLength="17"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-5 rounded-xl font-bold text-white text-lg transition-all duration-300 ${isSubmitting
                  ? 'bg-slate-600 cursor-not-allowed'
                  : modalType === 'price'
                    ? 'bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 shadow-lg hover:shadow-orange-500/30 transform hover:scale-105'
                    : 'bg-gradient-to-r from-emerald-600 to-cyan-700 hover:from-emerald-500 hover:to-cyan-600 shadow-lg hover:shadow-emerald-500/30 transform hover:scale-105'
                  }`}
              >
                {isSubmitting ? 'Yuborilmoqda...' : 'So\'rov Yuborish'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(.4,2,.6,1) both; }
      `}</style>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        {/* Chat Toggle Button */}
        <button
          onClick={() => { setIsChatOpen(!isChatOpen); setIsMinimized(false); setUnreadCount(0); }}
          className="relative bg-gradient-to-r from-emerald-600 to-cyan-600 text-white p-4 rounded-full shadow-2xl hover:shadow-emerald-500/30 transform hover:scale-110 transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 animate-bounce shadow-lg">{unreadCount}</span>
          )}
        </button>
        {/* User Info Modal */}
        {userInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in-up">
            <form onSubmit={handleUserInfoSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-xs flex flex-col gap-5 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-center text-emerald-600 dark:text-emerald-400 mb-2">Ronas Support</h2>
              <input name="name" value={userInfo.name} onChange={handleUserInfoChange} placeholder="Ism" className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-400 outline-none" required />
              <input name="surname" value={userInfo.surname} onChange={handleUserInfoChange} placeholder="Familya" className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-400 outline-none" required />
              <input name="phone" value={userInfo.phone} onChange={handleUserInfoChange} placeholder="Telefon (+998 90 123 45 67)" className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-400 outline-none" required />
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all">Chatni boshlash</button>
            </form>
          </div>
        )}
        {/* Chat Window */}
        {isChatOpen && !isMinimized && !userInfoModal && (
          <div className={`absolute bottom-16 right-0 ${isFullscreen ? 'inset-0 w-screen h-screen max-w-none min-w-0 rounded-none' : 'w-[95vw] max-w-xl min-w-[400px] h-[90vh]'} ${chatTheme === 'light' ? 'bg-white' : 'bg-slate-800 bg-opacity-80'} rounded-3xl shadow-xl border-2 border-slate-200 dark:border-emerald-400 bg-clip-padding flex flex-col transition-all duration-300`}>
            {/* Chat Header */}
            <div className={`flex items-center justify-between rounded-t-2xl px-6 py-4 ${chatTheme === 'light' ? 'bg-gradient-to-r from-white to-slate-100 border-b border-slate-200' : 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white'}`}>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div>
                  <h3 className={`font-bold text-lg ${chatTheme === 'light' ? 'text-emerald-600' : 'text-white'}`}>Ronas Support</h3>
                  <p className="text-sm opacity-90 flex items-center gap-2">
                    {isOnline ? <span className="text-green-500">Online</span> : <span className="text-red-400">Offline</span>}
                    {isTyping && <span className="italic animate-pulse text-xs ml-2">Operator yozmoqda...</span>}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={() => setChatTheme(t => t === 'light' ? 'dark' : 'light')} className={`rounded-xl p-2 ${chatTheme === 'light' ? 'bg-slate-200 hover:bg-slate-300' : 'bg-slate-700 hover:bg-slate-600'} transition-all`} title="Light/Dark">
                  {chatTheme === 'light' ? (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07-1.41-1.41M6.34 6.34 4.93 4.93m12.02 0-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>
                  ) : (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
                  )}
                </button>
                <button onClick={() => setIsMinimized(true)} className="hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-xl" title="Minimize"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 18h16" /></svg></button>
                <button onClick={() => setIsFullscreen(f => !f)} className="hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-xl" title="Fullscreen"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/></svg></button>
                <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-xl" title="Yopish"><X className="w-5 h-5" /></button>
              </div>
            </div>
            {/* Chat Messages */}
            <div ref={chatBoxRef} className={`flex-1 overflow-y-auto p-6 space-y-4 ${chatTheme === 'light' ? 'bg-slate-50' : 'bg-slate-900/40'} relative`}>
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                >
                  <div className="flex items-end gap-2">
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg">R</div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl shadow-md transition-all duration-200 ${
                        message.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-slate-700 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold">
                          {message.sender === 'user' ? 'Siz' : 'Ronas Support'}
                        </span>
                        <span className="text-xs opacity-60">
                          {message.time.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {message.image && (
                        <img
                          src={message.image}
                          alt={message.imageName || 'Rasm'}
                          className="rounded-xl mb-2 max-w-[220px] max-h-[180px] cursor-pointer border-2 border-slate-600 hover:scale-105 transition-all"
                          onClick={() => setImageModal(message.image)}
                        />
                      )}
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">S</div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
              {showScrollBtn && (
                <button
                  className="absolute right-4 bottom-4 bg-emerald-600 text-white p-2 rounded-full shadow-lg hover:bg-emerald-500 transition-all animate-fade-in-up"
                  onClick={() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                  title="Pastga tushish"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14m7-7-7 7-7-7" /></svg>
                </button>
              )}
            </div>
            {/* Image preview before sending */}
            {imagePreview && (
              <div className="flex items-center gap-3 p-4 bg-slate-900/80 border-t border-b border-slate-700 animate-fade-in-up">
                <img src={imagePreview.url} alt="Preview" className="w-20 h-20 object-cover rounded-xl border-2 border-emerald-500 shadow-lg" />
                <div className="flex flex-col gap-2">
                  <span className="text-slate-200 text-xs">{imagePreview.name}</span>
                  <div className="flex gap-2">
                    <button onClick={sendImage} className="bg-emerald-600 text-white px-4 py-1 rounded-lg font-bold hover:bg-emerald-700 transition-all">Yuborish</button>
                    <button onClick={() => setImagePreview(null)} className="bg-slate-700 text-slate-300 px-3 py-1 rounded-lg hover:bg-red-600 hover:text-white transition-all">Bekor qilish</button>
                  </div>
                </div>
              </div>
            )}
            {/* Chat Input + Quick Replies */}
            <div className={`p-4 border-t ${chatTheme === 'light' ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-900/60'}`}>
              <div className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={inputPlaceholder}
                  className={`flex-1 px-3 py-2 rounded-xl border ${chatTheme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-800 placeholder-slate-400' : 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'} focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all`}
                  disabled={isTyping}
                />
                {/* File upload */}
                <label className={`p-2 rounded-xl cursor-pointer transition-all ${chatTheme === 'light' ? 'bg-slate-200 hover:bg-emerald-100 text-emerald-600' : 'bg-slate-700 text-slate-400 hover:bg-emerald-700'}`}>
                  <input type="file" accept="image/jpeg,image/png,image/gif" className="hidden" onChange={handleFileChange} disabled={isTyping} />
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.44 11.05 6.87 4.39a2.25 2.25 0 0 0-3.06 2.7l2.1 7.36a2.25 2.25 0 0 0 1.5 1.5l7.36 2.1a2.25 2.25 0 0 0 2.7-3.06l-6.66-14.57z" /></svg>
                </label>
                <button onClick={() => sendMessage()} className={`p-2 rounded-xl font-bold transition-colors disabled:opacity-60 ${chatTheme === 'light' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`} disabled={isTyping || !newMessage.trim()}><Send className="w-4 h-4" /></button>
              </div>
              {/* Quick Replies */}
              <div className="flex flex-wrap gap-2">
                {['Ish vaqti', 'Manzil', 'Buyurtma berish', 'Kafolat', 'Telefon'].map((txt) => (
                  <button
                    key={txt}
                    onClick={() => sendMessage(txt)}
                    className="px-3 py-1 bg-slate-700 text-slate-200 rounded-lg text-xs hover:bg-emerald-600 hover:text-white transition-all"
                    disabled={isTyping}
                  >
                    {txt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Minimized chat icon */}
        {isMinimized && !isChatOpen && (
          <button
            className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white p-3 rounded-full shadow-2xl border-2 border-white z-50 animate-fade-in-up"
            onClick={() => { setIsChatOpen(true); setIsMinimized(false); setUnreadCount(0); }}
            title="Chatni ochish"
          >
            <MessageCircle className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 animate-bounce shadow-lg">{unreadCount}</span>
            )}
          </button>
        )}
        {/* Image modal (lightbox) */}
        {imageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in-up" onClick={() => setImageModal(null)}>
            <img src={imageModal} alt="Rasm" className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl border-4 border-emerald-500 animate-fade-in-up" />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-gray-900 border-t border-slate-800">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">RONAS</h3>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Professional avtoehtiyot qismlari va xizmatlar. Hyundai va Kia uchun original va sifatli ehtiyot qismlari.
                Bizning maqsad - mijozlarimizning ishonchini qozonish va ularga eng yaxshi xizmat ko'rsatish.
              </p>
              <div className="flex gap-4">
                <a href="#" className="bg-slate-800 p-3 rounded-xl hover:bg-emerald-600 transition-colors">
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="bg-slate-800 p-3 rounded-xl hover:bg-emerald-600 transition-colors">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="bg-slate-800 p-3 rounded-xl hover:bg-emerald-600 transition-colors">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="bg-slate-800 p-3 rounded-xl hover:bg-emerald-600 transition-colors">
                  <Youtube className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold text-white mb-6">Tezkor Havolalar</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">Bosh Sahifa</a></li>
                <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">Mahsulotlar</a></li>
                <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">Xizmatlar</a></li>
                <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">Haqida</a></li>
                <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">Aloqa</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-bold text-white mb-6">Aloqa Ma'lumotlari</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-600 p-2 rounded-lg">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Telefon</p>
                    <p className="text-white font-semibold text-lg">+998 90 324 94 97</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-600 p-2 rounded-lg">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Email</p>
                    <p className="text-white font-semibold text-lg">info@ronas.uz</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-600 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Manzil</p>
                    <p className="text-white font-semibold text-sm">S.Yusupov, Tashkent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-slate-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm">
                © 2024 Ronas. Barcha huquqlar himoyalangan.
              </p>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <span className="text-slate-400 text-sm">
                  {currentTime.toLocaleTimeString('uz-UZ', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit' 
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HyundaiKiaLanding;