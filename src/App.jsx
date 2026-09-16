import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForQuangThangService",
  authDomain: "quang-thang-service.firebaseapp.com",
  projectId: "quang-thang-service",
  storageBucket: "quang-thang-service.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [role, setRole] = useState('admin'); // 'admin' hoặc 'tech'
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  // Lấy danh sách đơn hàng thời gian thực từ Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(docs);
    }, (err) => console.error(err));
    return () => unsub();
  }, []);

  // Admin tạo đơn mới
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!customerName || !phone) return alert('Vui lòng nhập tên và SĐT');
    await addDoc(collection(db, 'orders'), {
      customerName,
      phone,
      address,
      note,
      status: 'Mới',
      createdAt: serverTimestamp(),
      location: null,
      photo: null
    });
    setCustomerName(''); setPhone(''); setAddress(''); setNote('');
    alert('Đã tạo đơn thành công!');
  };

  // Thợ nhận việc và gửi vị trí GPS
  const handleAcceptOrder = (orderId) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        await updateDoc(doc(db, 'orders', orderId), {
          status: 'Đang xử lý',
          location: { lat: latitude, lng: longitude }
        });
        alert('Đã nhận việc và cập nhật GPS!');
      }, () => alert('Vui lòng bật GPS trên điện thoại!'));
    }
  };

  // Thợ chụp ảnh và nộp nghiệm thu (chuyển sang base64)
  const handleUploadPhoto = (orderId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await updateDoc(doc(db, 'orders', orderId), {
          status: 'Hoàn thành',
          photo: reader.result
        });
        alert('Đã nộp ảnh nghiệm thu thành công!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#1d4ed8' }}>QUANG THẮNG SERVICE</h1>
      
      {/* Nút chuyển đổi giao diện Admin / Thợ */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => setRole('admin')} 
          style={{ flex: 1, padding: '10px', background: role === 'admin' ? '#1d4ed8' : '#e5e7eb', color: role === 'admin' ? '#fff' : '#000', border: 'none', borderRadius: '6px' }}>
          Giao diện Admin
        </button>
        <button 
          onClick={() => setRole('tech')} 
          style={{ flex: 1, padding: '10px', background: role === 'tech' ? '#1d4ed8' : '#e5e7eb', color: role === 'tech' ? '#fff' : '#000', border: 'none', borderRadius: '6px' }}>
          Giao diện Thợ
        </button>
      </div>

      {/* Giao diện Admin: Tạo đơn */}
      {role === 'admin' && (
        <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Tạo đơn sửa chữa mới</h3>
          <input placeholder="Tên khách hàng" value={customerName} onChange={e => setCustomerName(e.target.value)} style={{ padding: '8px' }} />
          <input placeholder="Số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} style={{ padding: '8px' }} />
          <input placeholder="Địa chỉ" value={address} onChange={e => setAddress(e.target.value)} style={{ padding: '8px' }} />
          <textarea placeholder="Ghi chú hỏng hóc" value={note} onChange={e => setNote(e.target.value)} style={{ padding: '8px' }} />
          <button type="submit" style={{ padding: '10px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px' }}>Tạo đơn hàng</button>
        </form>
      )}

      {/* Danh sách đơn hàng */}
      <h3>Danh sách công việc</h3>
      {orders.length === 0 ? <p>Chưa có đơn hàng nào.</p> : orders.map(item => (
        <div key={item.id} style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '8px', marginBottom: '10px' }}>
          <p><strong>Khách hàng:</strong> {item.customerName} - {item.phone}</p>
          <p><strong>Địa chỉ:</strong> {item.address}</p>
          <p><strong>Trạng thái:</strong> <span style={{ color: item.status === 'Hoàn thành' ? 'green' : 'orange' }}>{item.status}</span></p>
          
          {/* Thao tác dành cho Thợ */}
          {role === 'tech' && item.status === 'Mới' && (
            <button onClick={() => handleAcceptOrder(item.id)} style={{ padding: '8px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px' }}>
              Nhận việc & Bật GPS
            </button>
          )}

          {role === 'tech' && item.status === 'Đang xử lý' && (
            <div>
              <p style={{ fontSize: '13px', color: '#666' }}>Tải ảnh nghiệm thu:</p>
              <input type="file" accept="image/*" capture="environment" onChange={(e) => handleUploadPhoto(item.id, e)} />
            </div>
          )}

          {item.photo && <img src={item.photo} alt="Nghiem thu" style={{ width: '100%', marginTop: '10px', borderRadius: '6px' }} />}
        </div>
      ))}
    </div>
  );
}
