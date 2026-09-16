import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { Camera, MapPin, CheckCircle, Clock, PlusCircle, Wrench } from 'lucide-react';

// Cấu hình Firebase dự án Quang Thắng Service
const firebaseConfig = {
  apiKey: "AIzaSyB-a52iiQgRZkncVgdvjnPPyEg25FoB58E",
  authDomain: "quang-thang-service.firebaseapp.com",
  projectId: "quang-thang-service",
  storageBucket: "quang-thang-service.firebasestorage.app",
  messagingSenderId: "1047547693083",
  appId: "1:1047547693083:web:4c9e7f53d4eb27eeff90be"
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

  // Lắng nghe dữ liệu thời gian thực từ Firestore
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
    if (!customerName || !phone) return alert('Vui lòng nhập tên và SĐT khách hàng');

    await addDoc(collection(db, 'orders'), {
      customerName,
      phone,
      address,
      note,
      status: 'pending', // pending -> processing -> completed
      createdAt: serverTimestamp(),
      location: null,
      image: null
    });

    setCustomerName('');
    setPhone('');
    setAddress('');
    setNote('');
    alert('Đã tạo đơn thành công!');
  };

  // Thợ nhận việc & định vị vị trí
  const handleStartWork = async (orderId) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        await updateDoc(doc(db, 'orders', orderId), {
          status: 'processing',
          location: { lat: latitude, lng: longitude }
        });
        alert('Đã nhận đơn và cập nhật vị trí!');
      });
    } else {
      await updateDoc(doc(db, 'orders', orderId), { status: 'processing' });
    }
  };

  // Thợ hoàn thành công việc & tải ảnh lên
  const handleCompleteWork = async (orderId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'completed',
        image: reader.result
      });
      alert('Đã hoàn thành đơn hàng!');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '15px', fontFamily: 'sans-serif' }}>
      <header style={{ textTransform: 'uppercase', textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #0284c7', paddingBottom: '10px' }}>
        <h2 style={{ color: '#0284c7', margin: 0 }}>QUANG THẮNG SERVICE</h2>
        <div style={{ marginTop: '10px' }}>
          <button 
            style={{ padding: '8px 16px', marginRight: '10px', background: role === 'admin' ? '#0284c7' : '#ccc', color: '#fff', border: 'none', borderRadius: '4px' }}
            onClick={() => setRole('admin')}
          >
            Giao diện Admin
          </button>
          <button 
            style={{ padding: '8px 16px', background: role === 'tech' ? '#16a34a' : '#ccc', color: '#fff', border: 'none', borderRadius: '4px' }}
            onClick={() => setRole('tech')}
          >
            Giao diện Thợ
          </button>
        </div>
      </header>

      {role === 'admin' && (
        <section style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3><PlusCircle size={18} /> Tạo đơn dịch vụ mới</h3>
          <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Tên khách hàng *" value={customerName} onChange={e => setCustomerName(e.target.value)} required style={{ padding: '8px' }} />
            <input type="tel" placeholder="Số điện thoại *" value={phone} onChange={e => setPhone(e.target.value)} required style={{ padding: '8px' }} />
            <input type="text" placeholder="Địa chỉ" value={address} onChange={e => setAddress(e.target.value)} style={{ padding: '8px' }} />
            <textarea placeholder="Ghi chú công việc" value={note} onChange={e => setNote(e.target.value)} style={{ padding: '8px' }} />
            <button type="submit" style={{ padding: '10px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
              TẠO ĐƠN
            </button>
          </form>
        </section>
      )}

      <section>
        <h3><Wrench size={18} /> Danh sách đơn hàng ({orders.length})</h3>
        {orders.map(item => (
          <div key={item.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '10px', background: '#fff' }}>
            <p style={{ margin: '5px 0' }}><strong>Khách hàng:</strong> {item.customerName} - {item.phone}</p>
            <p style={{ margin: '5px 0' }}><strong>Địa chỉ:</strong> {item.address}</p>
            <p style={{ margin: '5px 0' }}><strong>Ghi chú:</strong> {item.note}</p>
            <p style={{ margin: '5px 0' }}>
              <strong>Trạng thái: </strong> 
              {item.status === 'pending' && <span style={{ color: '#d97706' }}><Clock size={14} /> Chờ thợ nhận</span>}
              {item.status === 'processing' && <span style={{ color: '#2563eb' }}><Wrench size={14} /> Đang xử lý</span>}
              {item.status === 'completed' && <span style={{ color: '#16a34a' }}><CheckCircle size={14} /> Hoàn thành</span>}
            </p>

            {item.location && (
              <p style={{ margin: '5px 0' }}>
                <MapPin size={14} /> <a href={`https://maps.google.com/?q=${item.location.lat},${item.location.lng}`} target="_blank" rel="noreferrer">Xem vị trí thợ trên bản đồ</a>
              </p>
            )}

            {item.image && (
              <div style={{ marginTop: '10px' }}>
                <p style={{ margin: '5px 0' }}><strong>Ảnh nghiệm thu:</strong></p>
                <img src={item.image} alt="Nghiệm thu" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }} />
              </div>
            )}

            {role === 'tech' && item.status === 'pending' && (
              <button 
                onClick={() => handleStartWork(item.id)}
                style={{ width: '100%', marginTop: '10px', padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px' }}
              >
                Nhận việc & Bật vị trí GPS
              </button>
            )}

            {role === 'tech' && item.status === 'processing' && (
              <label style={{ display: 'block', textAlign: 'center', marginTop: '10px', padding: '10px', background: '#16a34a', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>
                <Camera size={16} /> Chụp ảnh hoàn thành
                <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => handleCompleteWork(item.id, e)} />
              </label>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
