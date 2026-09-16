import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';

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

// Danh sách thợ cố định (có thể mở rộng)
const TECHNICIANS = [
  { id: 'tech_01', name: 'Nguyễn Văn Thắng (Thợ chính)' },
  { id: 'tech_02', name: 'Trần Văn Quang (Thợ phụ)' }
];

export default function App() {
  const [role, setRole] = useState('admin'); // 'admin' hoặc 'tech_01', 'tech_02'
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); // 'list' hoặc 'create'

  // Form Admin Tạo Đơn Mới
  const [newOrder, setNewOrder] = useState({
    customerName: '', phone: '', address: '', deviceType: 'Máy lạnh',
    issueNote: '', assignedTechId: '', initialImage: ''
  });

  // State hỗ trợ Thợ Khảo Sát & Báo Giá
  const [surveyData, setSurveyData] = useState({ brand: '', model: '', capacity: '', errorMsg: '', gasStatus: '', techNote: '' });
  const [items, setItems] = useState([{ name: 'Vệ sinh / Nhân công', qty: 1, price: 150000 }]);
  const [cancelReason, setCancelReason] = useState('Giá cao');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Lắng nghe dữ liệu thời gian thực từ Firestore
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(docs);
    });
    return () => unsubscribe();
  }, []);

  // 1. ADMIN TẠO ĐƠN VỚI MÃ DL00000X TỰ ĐỘNG
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newOrder.customerName || !newOrder.phone) return alert('Vui lòng nhập Tên và SĐT khách!');
    
    const codeNumber = String(orders.length + 1).padStart(6, '0');
    const orderCode = `DL${codeNumber}`;

    try {
      await addDoc(collection(db, 'orders'), {
        code: orderCode,
        ...newOrder,
        status: 'new', // new -> assigned -> processing -> surveying -> repairing -> completed / cancelled
        createdAt: new Date().toISOString(),
        images: newOrder.initialImage ? [newOrder.initialImage] : [],
        survey: null,
        quote: null,
        history: [{ status: 'new', time: new Date().toLocaleTimeString('vi-VN'), note: 'Admin khởi tạo đơn hàng' }]
      });
      alert(`Đã tạo thành công đơn hàng ${orderCode}!`);
      setNewOrder({ customerName: '', phone: '', address: '', deviceType: 'Máy lạnh', issueNote: '', assignedTechId: '', initialImage: '' });
      setActiveTab('list');
    } catch (err) {
      alert('Lỗi tạo đơn: ' + err.message);
    }
  };

  // 2. ADMIN GIAO ĐƠN CHỌN THỢ
  const handleAssignTech = async (orderId, techId) => {
    const techObj = TECHNICIANS.find(t => t.id === techId);
    await updateDoc(doc(db, 'orders', orderId), {
      assignedTechId: techId,
      assignedTechName: techObj?.name || '',
      status: 'assigned'
    });
    alert('Đã giao đơn thành công!');
  };

  // 3. THỢ NHẬN ĐƠN & BẮT ĐẦU XỬ LÝ
  const handleUpdateStatus = async (orderId, newStatus, logNote) => {
    const target = orders.find(o => o.id === orderId);
    const updatedHistory = [...(target.history || []), { status: newStatus, time: new Date().toLocaleTimeString('vi-VN'), note: logNote }];
    
    await updateDoc(doc(db, 'orders', orderId), {
      status: newStatus,
      history: updatedHistory
    });
  };

  // 4 & 5. THỢ LƯU BẢNG KHẢO SÁT & HÌNH ẢNH
  const handleSaveSurvey = async (orderId) => {
    await updateDoc(doc(db, 'orders', orderId), {
      survey: surveyData,
      status: 'surveying'
    });
    alert('Đã lưu thông tin khảo sát kỹ thuật!');
  };

  // 6. TÍNH BÁO GIÁ VẬT TƯ
  const handleAddItem = () => setItems([...items, { name: '', qty: 1, price: 0 }]);
  const calculateTotal = () => items.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const handleSaveQuote = async (orderId) => {
    await updateDoc(doc(db, 'orders', orderId), {
      quote: { items, total: calculateTotal() },
      status: 'quoted'
    });
    alert('Đã chốt bảng báo giá!');
  };

  // 7. KHÁCH ĐỒNG Ý HOẶC TỪ CHỐI
  const handleCustomerDecision = async (orderId, agreed) => {
    if (agreed) {
      await handleUpdateStatus(orderId, 'repairing', 'Khách đồng ý sửa chữa');
    } else {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'cancelled',
        cancelReason: cancelReason
      });
      alert('Đã lưu lý do khách không sửa!');
    }
  };

  // 8 & 9. THỢ CHỤP ẢNH TẢI NGHỆM THU HOÀN THÀNH
  const handleUploadImage = (e, orderId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const target = orders.find(o => o.id === orderId);
        const updatedImages = [...(target.images || []), reader.result];
        await updateDoc(doc(db, 'orders', orderId), {
          images: updatedImages,
          status: 'completed',
          completedAt: new Date().toLocaleDateString('vi-VN')
        });
        alert('Đã nghiệm thu và hoàn thành đơn hàng!');
      };
      reader.readAsDataURL(file);
    }
  };

  // LỌC ĐƠN THEO PHÂN QUYỀN
  const visibleOrders = role === 'admin' 
    ? orders 
    : orders.filter(o => o.assignedTechId === role);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-12">
      {/* HEADER */}
      <header className="bg-blue-700 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-md mx-auto p-4 flex justify-between items-center">
          <div>
            <h1 className="font-extrabold text-lg tracking-wide flex items-center">
              <span className="mr-1.5 text-xl">❄️</span> QUANG THẮNG SERVICE
            </h1>
            <p className="text-xs text-blue-200">Hệ Thống Quản Lý Điện Lạnh Doanh Nghiệp</p>
          </div>
          <select 
            value={role} 
            onChange={e => setRole(e.target.value)}
            className="bg-blue-800 text-xs font-semibold px-2 py-1.5 rounded-lg border border-blue-500 focus:outline-none"
          >
            <option value="admin">👤 Admin (Điều hành)</option>
            {TECHNICIANS.map(t => (
              <option key={t.id} value={t.id}>👷 {t.name}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* NAV TAB CHO ADMIN */}
        {role === 'admin' && (
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg ${activeTab === 'list' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
            >
              📋 Danh Sách Đơn ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg ${activeTab === 'create' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
            >
              ➕ Tạo Đơn Mới (1. Tiếp Nhận)
            </button>
          </div>
        )}

        {/* 1. ADMIN TẠO ĐƠN MỚI */}
        {role === 'admin' && activeTab === 'create' && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
            <h2 className="font-bold text-slate-800 text-sm border-b pb-2">1. TIẾP NHẬN ĐƠN KHÁCH HÀNG</h2>
            <form onSubmit={handleCreateOrder} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Loại Thiết Bị</label>
                <select
                  value={newOrder.deviceType}
                  onChange={e => setNewOrder({ ...newOrder, deviceType: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-lg text-xs bg-slate-50"
                >
                  <option value="Máy lạnh">Máy lạnh</option>
                  <option value="Tủ lạnh">Tủ lạnh</option>
                  <option value="Máy giặt">Máy giặt</option>
                  <option value="Tủ mát">Tủ mát / Tủ đông</option>
                </select>
              </div>
              <input
                type="text" placeholder="Tên khách hàng *"
                className="w-full p-2.5 border rounded-lg text-xs"
                value={newOrder.customerName}
                onChange={e => setNewOrder({ ...newOrder, customerName: e.target.value })}
              />
              <input
                type="text" placeholder="Số điện thoại *"
                className="w-full p-2.5 border rounded-lg text-xs"
                value={newOrder.phone}
                onChange={e => setNewOrder({ ...newOrder, phone: e.target.value })}
              />
              <input
                type="text" placeholder="Địa chỉ chi tiết *"
                className="w-full p-2.5 border rounded-lg text-xs"
                value={newOrder.address}
                onChange={e => setNewOrder({ ...newOrder, address: e.target.value })}
              />
              <textarea
                placeholder="Nội dung khách báo (VD: Máy không lạnh, kêu to...)"
                className="w-full p-2.5 border rounded-lg text-xs h-16"
                value={newOrder.issueNote}
                onChange={e => setNewOrder({ ...newOrder, issueNote: e.target.value })}
              />
              <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-xs font-bold shadow">
                Tạo Đơn & Lưu Hệ Thống
              </button>
            </form>
          </div>
        )}

        {/* DANH SÁCH ĐƠN HÀNG (QUY TRÌNH THỰC THI) */}
        {(role !== 'admin' || activeTab === 'list') && (
          <div className="space-y-3">
            {visibleOrders.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 font-medium">Chưa có đơn hàng nào trong hệ thống.</p>
              </div>
            ) : visibleOrders.map(order => (
              <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
                {/* HEAD CARD */}
                <div className="flex justify-between items-start border-b pb-2">
                  <div>
                    <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{order.code}</span>
                    <h3 className="font-bold text-slate-800 text-sm mt-1">{order.customerName}</h3>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded-md ${
                    order.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    order.status === 'repairing' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status === 'new' && 'Đơn mới'}
                    {order.status === 'assigned' && 'Đã giao thợ'}
                    {order.status === 'processing' && 'Đang tới khách'}
                    {order.status === 'surveying' && 'Đã khảo sát'}
                    {order.status === 'quoted' && 'Đã báo giá'}
                    {order.status === 'repairing' && 'Đang sửa chữa'}
                    {order.status === 'completed' && 'Hoàn thành'}
                    {order.status === 'cancelled' && 'Không sửa'}
                  </span>
                </div>

                {/* CHI TIẾT KHÁCH HÀNG */}
                <div className="text-xs space-y-1 text-slate-600">
                  <p>📱 <b>SĐT:</b> <a href={`tel:${order.phone}`} className="text-blue-600 font-bold">{order.phone}</a></p>
                  <p>📍 <b>Địa chỉ:</b> {order.address}</p>
                  <p>🛠 <b>Thiết bị:</b> <span className="font-semibold text-slate-800">{order.deviceType}</span></p>
                  {order.issueNote && <p className="bg-slate-50 p-2 rounded text-slate-500">📝 <b>Sự cố:</b> {order.issueNote}</p>}
                </div>

                {/* 2. ADMIN GIAO ĐƠN THỢ */}
                {role === 'admin' && (
                  <div className="bg-slate-50 p-2.5 rounded-lg border text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700">2. Phân Công Thợ:</span>
                      <span className="text-slate-500">{order.assignedTechName || 'Chưa phân công'}</span>
                    </div>
                    <select
                      onChange={(e) => handleAssignTech(order.id, e.target.value)}
                      value={order.assignedTechId || ''}
                      className="w-full p-1.5 border rounded bg-white text-xs"
                    >
                      <option value="">-- Chọn thợ xử lý --</option>
                      {TECHNICIANS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                )}

                {/* 3. THỢ NHẬN ĐƠN & BẮT ĐẦU */}
                {role !== 'admin' && order.status === 'assigned' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'processing', 'Thợ đã bấm nhận đơn')}
                    className="w-full bg-blue-600 text-white text-xs font-bold py-2.5 rounded-lg shadow"
                  >
                    👉 [NHẬN ĐƠN & TỚI ĐIỂM HẸN]
                  </button>
                )}

                {role !== 'admin' && order.status === 'processing' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'at_site', 'Thợ đã có mặt tại điểm sửa')}
                    className="w-full bg-amber-600 text-white text-xs font-bold py-2.5 rounded-lg shadow"
                  >
                    📍 [ĐÃ TỚI NƠI - BẮT ĐẦU KHẢO SÁT]
                  </button>
                )}

                {/* 4 & 5. KHẢO SÁT THIẾT BỊ & HÌNH ẢNH */}
                {role !== 'admin' && (order.status === 'at_site' || order.status === 'surveying') && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 space-y-2 text-xs">
                    <p className="font-bold text-blue-900">4 & 5. Khảo Sát Thiết Bị & Hiện Trạng</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Hãng (VD: Panasonic)" className="p-1.5 border rounded bg-white" onChange={e => setSurveyData({ ...surveyData, brand: e.target.value })} />
                      <input type="text" placeholder="Model" className="p-1.5 border rounded bg-white" onChange={e => setSurveyData({ ...surveyData, model: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Công suất (HP/W)" className="p-1.5 border rounded bg-white" onChange={e => setSurveyData({ ...surveyData, capacity: e.target.value })} />
                      <input type="text" placeholder="Tình trạng Gas" className="p-1.5 border rounded bg-white" onChange={e => setSurveyData({ ...surveyData, gasStatus: e.target.value })} />
                    </div>
                    <input type="text" placeholder="Mã lỗi / Tình trạng bo mạch" className="w-full p-1.5 border rounded bg-white" onChange={e => setSurveyData({ ...surveyData, errorMsg: e.target.value })} />
                    
                    <button onClick={() => handleSaveSurvey(order.id)} className="w-full bg-blue-700 text-white font-bold py-2 rounded">
                      💾 Lưu Bản Khảo Sát
                    </button>
                  </div>
                )}

                {/* 6. BÁO GIÁ VẬT TƯ / DỊCH VỤ */}
                {(order.status === 'surveying' || order.status === 'quoted') && (
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 space-y-2 text-xs">
                    <p className="font-bold text-amber-900">6. Bảng Báo Giá Chi Tiết</p>
                    {items.map((it, idx) => (
                      <div key={idx} className="flex space-x-1">
                        <input type="text" placeholder="Hạng mục" value={it.name} className="flex-1 p-1 border rounded bg-white" onChange={e => {
                          const copy = [...items]; copy[idx].name = e.target.value; setItems(copy);
                        }} />
                        <input type="number" placeholder="SL" value={it.qty} className="w-12 p-1 border rounded bg-white text-center" onChange={e => {
                          const copy = [...items]; copy[idx].qty = Number(e.target.value); setItems(copy);
                        }} />
                        <input type="number" placeholder="Đơn giá" value={it.price} className="w-20 p-1 border rounded bg-white" onChange={e => {
                          const copy = [...items]; copy[idx].price = Number(e.target.value); setItems(copy);
                        }} />
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-1 font-bold text-slate-800">
                      <button onClick={handleAddItem} className="text-blue-600 text-[11px]">+ Thêm hạng mục</button>
                      <span>Tổng: {calculateTotal().toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    {role !== 'admin' && (
                      <button onClick={() => handleSaveQuote(order.id)} className="w-full bg-amber-600 text-white font-bold py-2 rounded mt-2">
                        📄 Gửi Báo Giá Cho Khách
                      </button>
                    )}
                  </div>
                )}

                {/* 7. XÁC NHẬN KHÁCH ĐỒNG Ý / KHÔNG ĐỒNG Ý */}
                {order.status === 'quoted' && (
                  <div className="bg-slate-50 p-3 rounded-lg border space-y-2 text-xs">
                    <p className="font-bold text-slate-800">7. Khách Hàng Đồng Ý Sửa?</p>
                    <div className="flex space-x-2">
                      <button onClick={() => handleCustomerDecision(order.id, true)} className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded">
                        ✔ Đồng Ý Sửa
                      </button>
                      <button onClick={() => setSelectedOrderId(order.id)} className="flex-1 bg-red-600 text-white font-bold py-2 rounded">
                        ✖ Khách Từ Chối
                      </button>
                    </div>

                    {selectedOrderId === order.id && (
                      <div className="pt-2 space-y-2 border-t mt-2">
                        <select value={cancelReason} onChange={e => setCancelReason(e.target.value)} className="w-full p-1.5 border rounded bg-white">
                          <option value="Giá cao">Lý do: Giá cao</option>
                          <option value="Không muốn sửa nữa">Lý do: Không muốn sửa nữa</option>
                          <option value="Hẹn lại sau">Lý do: Hẹn lại sau</option>
                          <option value="Cần thay thiết bị mới">Lý do: Cần thay thiết bị mới</option>
                        </select>
                        <button onClick={() => handleCustomerDecision(order.id, false)} className="w-full bg-red-800 text-white font-bold py-1.5 rounded">
                          Xác Nhận Hủy Đơn
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 8 & 9. THỢ SỬA XONG & CHỤP ẢNH NGHỆM THU */}
                {order.status === 'repairing' && (
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 space-y-2 text-xs">
                    <p className="font-bold text-emerald-900">8 & 9. Hoàn Thành & Nghiệm Thu</p>
                    <label className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg shadow flex items-center justify-center space-x-1 cursor-pointer">
                      <span>📷</span> <span>CHỤP ẢNH NGHỆM THU & HOÀN THÀNH</span>
                      <input
                        type="file" accept="image/*" capture="environment" className="hidden"
                        onChange={(e) => handleUploadImage(e, order.id)}
                      />
                    </label>
                  </div>
                )}

                {/* HÌNH ẢNH ĐÃ NỘP */}
                {order.images && order.images.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs font-bold text-slate-700 mb-1.5">Hình Ảnh Đơn Hàng ({order.images.length})</p>
                    <div className="grid grid-cols-2 gap-2">
                      {order.images.map((img, idx) => (
                        <img key={idx} src={img} alt="Nghiem thu" className="w-full h-24 object-cover rounded-lg border" />
                      ))}
                    </div>
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
