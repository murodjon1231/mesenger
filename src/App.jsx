import React, { useState } from 'react';
import { X, Car, Shield, Clock, Phone, User, Package, Settings, Hash } from 'lucide-react';

const HyundaiKiaLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    products: [''],
    carBrand: '',
    vinCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', products: [''], carBrand: '', vinCode: '' });
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProductChange = (index, value) => {
    const newProducts = [...formData.products];
    newProducts[index] = value;
    setFormData({
      ...formData,
      products: newProducts
    });
  };

  const handleProductKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newProducts = [...formData.products];
      newProducts.push('');
      setFormData({
        ...formData,
        products: newProducts
      });
    }
  };

  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      const newProducts = formData.products.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        products: newProducts
      });
    }
  };

  const sendToTelegram = async (data) => {
    const token = '7629464977:AAHKV0p_iqymDXQf9UgqM7EPCXoH4zOwPl0';
    const chatId = 'YOUR_CHAT_ID_HERE';
    
    const productsList = data.products.filter(p => p.trim() !== '').map((product, index) => `${index + 1}. ${product}`).join('\n');
    
    const message = `
🚗 Yangi so'rov!
👤 Ism: ${data.name}
📞 Telefon: ${data.phone}
📦 Mahsulotlar:
${productsList}
🚙 Mashina markasi: ${data.carBrand}
🔢 VIN kod: ${data.vinCode}
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
    if (!formData.name || !formData.phone || formData.products.every(p => p.trim() === '') || !formData.carBrand) {
      alert('Iltimos barcha majburiy maydonlarni to\'ldiring');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
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
                  AUTO PARTS
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>
          
          <div className="bg-slate-800 rounded-3xl p-10 max-w-lg w-full relative z-10 shadow-2xl animate-scale-in border border-slate-700">
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
                  Mahsulotlar * <span className="text-sm text-slate-400 ml-2">(Enter bosib qo'shish mumkin)</span>
                </label>
                <div className="space-y-3">
                  {formData.products.map((product, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="bg-slate-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={product}
                        onChange={(e) => handleProductChange(index, e.target.value)}
                        onKeyPress={(e) => handleProductKeyPress(e, index)}
                        className="flex-1 px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        placeholder={`Mahsulot ${index + 1}`}
                      />
                      {formData.products.length > 1 && (
                        <button
                          onClick={() => removeProduct(index)}
                          className="text-red-400 hover:text-red-300 p-2 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
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
                className={`w-full py-5 rounded-xl font-bold text-white text-lg transition-all duration-300 ${
                  isSubmitting
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