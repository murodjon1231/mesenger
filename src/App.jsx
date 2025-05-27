import React, { useState } from 'react';
import { X, Car, Shield, Clock, Phone, User, Package, Settings } from 'lucide-react';

const HyundaiKiaLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    product: '',
    carBrand: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', product: '', carBrand: '' });
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const sendToTelegram = async (data) => {
    const token = '7629464977:AAHKV0p_iqymDXQf9UgqM7EPCXoH4zOwPl0';
    const chatId = '6226950895'; // Bu yerga o'zingizning chat ID ni qo'ying
    
    const message = `
🚗 Yangi so'rov!
👤 Ism: ${data.name}
📞 Telefon: ${data.phone}
📦 Mahsulot: ${data.product}
🚙 Mashina markasi: ${data.carBrand}
📝 So'rov turi: ${modalType === 'price' ? 'Narx so\'rash' : 'Sotib olish'}
📅 Vaqt: ${new Date().toLocaleString('uz-UZ')}
    `;

    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Telegram ga yuborishda xatolik:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.product || !formData.carBrand) {
      alert('Iltimos barcha maydonlarni to\'ldiring');
      return;
    }
    
    setIsSubmitting(true);

    const success = await sendToTelegram(formData);
    
    if (success) {
      alert('So\'rov muvaffaqiyatli yuborildi!');
      closeModal();
    } else {
      alert('Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-blue-300 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-indigo-300 rounded-full animate-ping delay-700"></div>
          <div className="absolute bottom-40 right-40 w-8 h-8 bg-white rounded-full animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                HYUNDAI
              </span>
              <span className="text-white mx-4">&</span>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                KIA
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 animate-fade-in-up delay-300">
              Sifatli avtoehtiyot qismlari - Ishonchli xizmat
            </p>

            {/* Brand Logos */}
            <div className="flex justify-center items-center gap-8 mb-12 animate-fade-in-up delay-500">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300">
                <Car className="w-16 h-16 text-red-400 mx-auto mb-2" />
                <p className="text-white font-semibold text-lg">HYUNDAI</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300">
                <Settings className="w-16 h-16 text-blue-400 mx-auto mb-2" />
                <p className="text-white font-semibold text-lg">KIA</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-700">
              <button
                onClick={() => openModal('price')}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300 hover:from-orange-600 hover:to-red-700"
              >
                💰 Narxni bilish
              </button>
              <button
                onClick={() => openModal('buy')}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 hover:from-blue-600 hover:to-cyan-700"
              >
                🛒 Sotib olish
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            Bizning <span className="text-blue-600">Afzalliklarimiz</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Kafolat</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Barcha mahsulotlarimizga 12 oylik kafolat beramiz. Sifat va ishonch bizning ustuvorimiz.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Tez Yetkazib Berish</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Buyurtmangizni 24 soat ichida tayyor qilib, tez va xavfsiz yetkazib beramiz.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Keng Assortiment</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Hyundai va Kia uchun 5000+ dan ortiq avtoehtiyot qismlari doimo mavjud.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
          
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative z-10 shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {modalType === 'price' ? '💰 Narx So\'rash' : '🛒 Sotib Olish'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center text-gray-700 font-medium mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Ism Familya
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                  placeholder="Ismingizni kiriting"
                />
              </div>

              <div>
                <label className="flex items-center text-gray-700 font-medium mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Telefon Raqam
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                  placeholder="+998 90 123 45 67"
                />
              </div>

              <div>
                <label className="flex items-center text-gray-700 font-medium mb-2">
                  <Package className="w-4 h-4 mr-2" />
                  Mahsulot Nomi
                </label>
                <input
                  type="text"
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                  placeholder="Masalan: Tormoz kalotkasi"
                />
              </div>

              <div>
                <label className="flex items-center text-gray-700 font-medium mb-2">
                  <Car className="w-4 h-4 mr-2" />
                  Mashina Markasi
                </label>
                <select
                  name="carBrand"
                  value={formData.carBrand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : modalType === 'price'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-lg hover:shadow-xl'
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
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
        
        .delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </div>
  );
};

export default HyundaiKiaLanding;