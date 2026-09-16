import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForDeployment",
  authDomain: "quangthangservice2026.firebaseapp.com",
  projectId: "quangthangservice2026",
  storageBucket: "quangthangservice2026.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [role, setRole] = useState('admin'); // 'admin' hoặc 'tech'
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({ customerName: '', phone: '', address: '', note: '' });

  // Tải danh sách đơn hàng thời gian thực từ Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(docs);
    });
    return () => unsubscribe();
  }, []);

  // Admin tạo đơn hàng mới
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone) return alert('Vui lòng nhập tên và SĐT khách!');
    try {
      await addDoc(collection(db, 'orders'), {
        ...formData,
        status: 'pending', // pending, in_progress, completed
        createdAt: serverTimestamp(),
        image: null,
        location: null
      });
      setFormData({ customerName: '', phone: '', address: '', note: '' });
      alert('Đã tạo đơn thành công!');
    } catch (err) {
      alert('Lỗi khi tạo đơn: ' + err.message);
    }
  };

  // Thợ nhận việc & cập nhật GPS
  const handleAcceptTask = (orderId) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await updateDoc(doc(db, 'orders', orderId), {
            status: 'in_progress',
            location: { latitude, longitude, time: new Date().toISOString() }
          });
          alert('Đã nhận việc và lưu vị trí GPS!');
        },
        () => alert('Không thể lấy vị trí. Vui lòng cấp quyền GPS cho trình duyệt!')
      );
    }
  };

  // Thợ chụp ảnh hoàn thành (Chuyển thành Base64 lưu trực tiếp Firestore)
  const handleUploadImage = (e, orderId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await updateDoc(doc(db, 'orders', orderId), {
          status: 'completed',
          image: reader.result,
          completedAt: new Date().toISOString()
        });
        alert('Đã nghiệm thu đơn hàng!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Thanh Header Chuyên Nghiệp */}
      <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-md mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🔧</span>
            <div>
              <h1 className="font-bold text-lg leading-tight">QUANG THẮNG SERVICE</h1>
              <p className="text-xs text-blue-100">Hệ Thống Quản Lý Dịch Vụ HVAC</p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase ${role === 'admin' ? 'bg-amber-400 text-amber-900' : 'bg-emerald-400 text-emerald-900'}`}>
            {role === 'admin' ? 'Quản trị' : 'Kỹ thuật'}
          </span>
        </div>
      </header>

      {/* Nút Chuyển Chế Độ Role */}
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 flex space-x-1 mb-4">
          <button
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'admin' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            📋 Giao Diện Admin
          </button>
          <button
            onClick={() => setRole('tech')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'tech' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            👷 Giao Diện Thợ
          </button>
        </div>

        {/* GIAO DIỆN ADMIN */}
        {role === 'admin' && (
          <div className="space-y-4">
            {/* Form Tạo Đơn Mới */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-slate-700 mb-3 text-base flex items-center">
                <span className="mr-2">➕</span> Tạo Đơn Sửa Chữa Mới
              </h2>
              <form onSubmit={handleCreateOrder} className="space-y-3">
                <input
                  type="text"
                  placeholder="Tên khách hàng *"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Số điện thoại *"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Địa chỉ phục vụ"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
                <textarea
                  placeholder="Mô tả sự cố (VD: Tủ lạnh không lạnh, Báo lỗi E4...)"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                  value={formData.note}
                  onChange={e => setFormData({ ...formData, note: e.target.value })}
                ></textarea>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm shadow transition">
                  Tạo Đơn Hàng
                </button>
              </form>
            </div>

            {/* Danh Sách Đơn Hàng */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-700 text-sm">Danh Sách Đơn Hiện Tại ({orders.length})</h3>
              {orders.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800">{item.customerName}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.status === 'completed' ? 'Hoàn thành' : item.status === 'in_progress' ? 'Đang làm' : 'Chờ nhận'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">📞 {item.phone} | 📍 {item.address}</p>
                  {item.note && <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded">📝 {item.note}</p>}
                  {item.image && (
                    <div className="pt-2">
                      <p className="text-xs font-semibold text-slate-600 mb-1">Ảnh Nghiệm Thu:</p>
                      <img src={item.image} alt="Nghiem thu" className="w-full h-32 object-cover rounded-lg border" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GIAO DIỆN THỢ */}
        {role === 'tech' && (
          <div className="space-y-3">
            <h3 className="font-bold text-slate-700 text-sm">Công Việc Dành Cho Kỹ Thuật Viên</h3>
            {orders.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800">{item.customerName}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">📞 <a href={`tel:${item.phone}`} className="text-blue-600 font-semibold">{item.phone}</a></p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    item.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.status === 'completed' ? 'Hoàn tất' : item.status === 'in_progress' ? 'Đang làm' : 'Đơn mới'}
                  </span>
                </div>
                
                <p className="text-xs text-slate-600">📍 {item.address}</p>
                {item.note && <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded">📝 {item.note}</p>}

                {/* Thao tác cho Thợ */}
                {item.status === 'pending' && (
                  <button
                    onClick={() => handleAcceptTask(item.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow flex items-center justify-center space-x-1"
                  >
                    <span>📍</span> <span>Nhận Việc & Cập Nhật GPS</span>
                  </button>
                )}

                {item.status === 'in_progress' && (
                  <label className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow flex items-center justify-center space-x-1 cursor-pointer">
                    <span>📷</span> <span>Chụp Ảnh Nghiệm Thu & Hoàn Thành</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => handleUploadImage(e, item.id)}
                    />
                  </label>
                )}

                {item.status === 'completed' && item.image && (
                  <div className="pt-1">
                    <p className="text-xs text-emerald-600 font-medium mb-1">✔ Đã nộp ảnh nghiệm thu thành công</p>
                    <img src={item.image} alt="Nghiem thu" className="w-full h-32 object-cover rounded-lg border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
