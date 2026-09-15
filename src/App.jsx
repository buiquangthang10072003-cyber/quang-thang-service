import React, { useState, useEffect } from 'react';
import { 
  Wrench, Users, Package, Shield, Search, Plus, Trash2, Lock, Unlock, 
  LogOut, Phone, Edit, CheckCircle, Clock, MapPin, Camera, DollarSign,
  TrendingUp, TrendingDown, AlertCircle, Calendar, FileText, ArrowRight, ChevronRight
} from 'lucide-react';

// Dữ liệu ban đầu
const INITIAL_KTVS = [
  { id: 'ktv1', name: 'Nguyễn Văn Tuấn', phone: '0901234567', username: 'ktv1', pass: '123', status: 'active', commission: 30, startDate: '2025-01-10' },
  { id: 'ktv2', name: 'Lê Minh Nam', phone: '0908765432', username: 'ktv2', pass: '123', status: 'active', commission: 35, startDate: '2025-03-15' },
];

const INITIAL_MATERIALS = [
  { id: 'mat1', name: 'Capacitor 35uF (Tụ điện)', unit: 'Cái', importPrice: 45000, sellPrice: 90000, quantity: 15, minQuantity: 5 },
  { id: 'mat2', name: 'Gas R32', unit: 'Kg', importPrice: 85000, sellPrice: 180000, quantity: 20, minQuantity: 5 },
  { id: 'mat3', name: 'Ống đồng 10/6', unit: 'Mét', importPrice: 70000, sellPrice: 130000, quantity: 50, minQuantity: 10 },
];

const INITIAL_ORDERS = [
  {
    id: 'QT-2026-001',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: 'Cát Hưng, Phù Cát',
    gps: '13.9854, 109.0432',
    deviceType: 'Máy lạnh',
    brand: 'Daikin',
    model: 'FTKC35',
    issue: 'Máy không lạnh, chớp đèn lỗi',
    serviceTask: 'Vệ sinh & Thay tụ nạp gas',
    appointmentDate: '2026-09-16 08:30',
    ktvId: 'ktv1',
    laborFee: 300000,
    materialFee: 180000,
    totalFee: 480000,
    paid: 480000,
    debt: 0,
    status: 'Hoàn thành', // Đã nhận, Đang di chuyển, Đang sửa, Hoàn thành
    usedMaterials: [{ id: 'mat1', name: 'Capacitor 35uF (Tụ điện)', qty: 1, price: 90000 }],
    images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300'],
    note: 'Khách yêu cầu hóa năng lượng',
    createdAt: '2026-09-15'
  }
];

const INITIAL_TRANSACTIONS = [
  { id: 't1', date: '2026-09-15', type: 'Thu', category: 'Khách thanh toán', amount: 480000, orderId: 'QT-2026-001', note: 'Thanh toán đơn QT-2026-001' },
  { id: 't2', date: '2026-09-14', type: 'Chi', category: 'Mua vật tư', amount: 500000, note: 'Nhập gas R32' }
];

export default function App() {
  // State Storage
  const [ktvs, setKtvs] = useState(() => JSON.parse(localStorage.getItem('QT_KTVS')) || INITIAL_KTVS);
  const [materials, setMaterials] = useState(() => JSON.parse(localStorage.getItem('QT_MATERIALS')) || INITIAL_MATERIALS);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('QT_ORDERS')) || INITIAL_ORDERS);
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem('QT_TRANSACTIONS')) || INITIAL_TRANSACTIONS);

  // Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Navigation & Search
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchPhone, setSearchPhone] = useState('');

  // Modals
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showKtvModal, setShowKtvModal] = useState(false);
  const [showMatModal, setShowMatModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);

  // Form States
  const [editingKtv, setEditingKtv] = useState(null);
  const [ktvForm, setKtvForm] = useState({ name: '', phone: '', username: '', pass: '', commission: 30, startDate: '' });
  
  const [orderForm, setOrderForm] = useState({
    customerName: '', phone: '', address: '', gps: '', deviceType: 'Máy lạnh',
    brand: '', model: '', issue: '', serviceTask: '', appointmentDate: '',
    ktvId: '', laborFee: 0, materialFee: 0, paid: 0, note: ''
  });

  const [matForm, setMatForm] = useState({ name: '', unit: 'Cái', importPrice: 0, sellPrice: 0, quantity: 0, minQuantity: 5 });
  const [txForm, setTxForm] = useState({ type: 'Thu', category: 'Khách thanh toán', amount: 0, note: '' });

  // Dynamic KTV Selected Order for work execution
  const [selectedOrderForKtv, setSelectedOrderForKtv] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [matQty, setMatQty] = useState(1);

  // Synchronize LocalStorage
  useEffect(() => localStorage.setItem('QT_KTVS', JSON.stringify(ktvs)), [ktvs]);
  useEffect(() => localStorage.setItem('QT_MATERIALS', JSON.stringify(materials)), [materials]);
  useEffect(() => localStorage.setItem('QT_ORDERS', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('QT_TRANSACTIONS', JSON.stringify(transactions)), [transactions]);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    if (loginUsername === 'admin' && loginPassword === '123') {
      setCurrentUser({ role: 'admin', name: 'Quản trị viên' });
      setActiveTab('dashboard');
      return;
    }
    const found = ktvs.find(k => k.username === loginUsername && k.pass === loginPassword);
    if (found) {
      if (found.status === 'locked') {
        setLoginError('Tài khoản của bạn đã bị khóa bởi Admin!');
        return;
      }
      setCurrentUser({ role: 'ktv', ...found });
      setActiveTab('ktv_orders');
      return;
    }
    setLoginError('Tài khoản hoặc mật khẩu không chính xác!');
  };

  // Create Order (Admin)
  const handleCreateOrder = (e) => {
    e.preventDefault();
    const labor = Number(orderForm.laborFee);
    const mat = Number(orderForm.materialFee);
    const total = labor + mat;
    const paidVal = Number(orderForm.paid);

    const newOrder = {
      id: 'QT-2026-' + String(orders.length + 1).padStart(3, '0'),
      ...orderForm,
      laborFee: labor,
      materialFee: mat,
      totalFee: total,
      paid: paidVal,
      debt: total - paidVal,
      status: 'Mới tạo',
      usedMaterials: [],
      images: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setOrders([newOrder, ...orders]);
    setShowOrderModal(false);
    setOrderForm({
      customerName: '', phone: '', address: '', gps: '', deviceType: 'Máy lạnh',
      brand: '', model: '', issue: '', serviceTask: '', appointmentDate: '',
      ktvId: '', laborFee: 0, materialFee: 0, paid: 0, note: ''
    });
  };

  // KTV Actions
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrderForKtv && selectedOrderForKtv.id === orderId) {
      setSelectedOrderForKtv(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleAddMaterialToOrder = (orderId) => {
    if (!selectedMaterial) return;
    const mat = materials.find(m => m.id === selectedMaterial);
    if (!mat || mat.quantity < matQty) {
      alert('Vật tư không đủ số lượng trong kho!');
      return;
    }

    // Update Materials Stock
    setMaterials(materials.map(m => m.id === mat.id ? { ...m, quantity: m.quantity - Number(matQty) } : m));

    // Update Order
    const addedItem = { id: mat.id, name: mat.name, qty: Number(matQty), price: mat.sellPrice };
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        const updatedUsed = [...o.usedMaterials, addedItem];
        const newMatFee = updatedUsed.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const newTotal = o.laborFee + newMatFee;
        return {
          ...o,
          usedMaterials: updatedUsed,
          materialFee: newMatFee,
          totalFee: newTotal,
          debt: newTotal - o.paid
        };
      }
      return o;
    }));

    if (selectedOrderForKtv && selectedOrderForKtv.id === orderId) {
      const updatedUsed = [...selectedOrderForKtv.usedMaterials, addedItem];
      const newMatFee = updatedUsed.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const newTotal = selectedOrderForKtv.laborFee + newMatFee;
      setSelectedOrderForKtv({
        ...selectedOrderForKtv,
        usedMaterials: updatedUsed,
        materialFee: newMatFee,
        totalFee: newTotal,
        debt: newTotal - selectedOrderForKtv.paid
      });
    }

    setSelectedMaterial('');
    setMatQty(1);
  };

  const handleCaptureGps = (orderId) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
        setOrders(orders.map(o => o.id === orderId ? { ...o, gps: coords } : o));
        if (selectedOrderForKtv) setSelectedOrderForKtv(prev => ({ ...prev, gps: coords }));
        alert(`Đã lưu vị trí GPS thành công: ${coords}`);
      }, () => alert('Không thể lấy vị trí. Vui lòng bật GPS trên thiết bị!'));
    }
  };

  const handleAddImage = (orderId) => {
    const dummyImages = [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300'
    ];
    const randomImg = dummyImages[Math.floor(Math.random() * dummyImages.length)];
    setOrders(orders.map(o => o.id === orderId ? { ...o, images: [...o.images, randomImg] } : o));
    if (selectedOrderForKtv) setSelectedOrderForKtv(prev => ({ ...prev, images: [...prev.images, randomImg] }));
  };

  // KTV Account Handlers
  const handleSaveKtv = (e) => {
    e.preventDefault();
    if (editingKtv) {
      setKtvs(ktvs.map(k => k.id === editingKtv.id ? { ...k, ...ktvForm, commission: Number(ktvForm.commission) } : k));
    } else {
      setKtvs([...ktvs, { id: 'ktv_' + Date.now(), ...ktvForm, commission: Number(ktvForm.commission), status: 'active' }]);
    }
    setShowKtvModal(false);
    setEditingKtv(null);
    setKtvForm({ name: '', phone: '', username: '', pass: '', commission: 30, startDate: '' });
  };

  // Calculations for Admin Dashboard
  const totalRevenue = orders.reduce((sum, o) => sum + o.paid, 0);
  const totalExpenses = transactions.filter(t => t.type === 'Chi').reduce((sum, t) => sum + t.amount, 0);
  const totalDebt = orders.reduce((sum, o) => sum + o.debt, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const activeKtvsCount = ktvs.filter(k => k.status === 'active').length;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full text-white mb-3 shadow-lg">
              <Wrench size={38} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-wide">QUANG THẮNG SERVICE</h1>
            <p className="text-xs text-slate-500 font-medium">Hệ Thống Quản Lý Điện Lạnh Chuyên Nghiệp</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold">{loginError}</div>}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tài khoản</label>
              <input type="text" required className="w-full p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} placeholder="admin hoặc ktv1..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu</label>
              <input type="password" required className="w-full p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Mật khẩu (mặc định 123)" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-700 transition">ĐĂNG NHẬP HỆ THỐNG</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Wrench size={20} />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wide block">QUANG THẮNG SERVICE</span>
            <span className="text-[10px] text-slate-400 block font-medium">ĐIỆN LẠNH PHÙ CÁT</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-3 py-1 rounded-full font-bold ${currentUser.role === 'admin' ? 'bg-amber-500 text-slate-900' : 'bg-blue-600 text-white'}`}>
            {currentUser.role === 'admin' ? '👑 ADMIN' : `👨‍🔧 THỢ: ${currentUser.name}`}
          </span>
          <button onClick={() => { setCurrentUser(null); setSelectedOrderForKtv(null); }} className="hover:text-red-400 text-slate-400">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Admin Navigation Bar */}
      {currentUser.role === 'admin' && (
        <div className="bg-white border-b px-4 py-2 flex gap-1 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'orders', label: 'Đơn Hàng', icon: FileText },
            { id: 'ktvs', label: 'Quản Lý Thợ', icon: Users },
            { id: 'materials', label: 'Kho Vật Tư', icon: Package },
            { id: 'customers', label: 'Khách Hàng', icon: Search },
            { id: 'finance', label: 'Thu - Chi', icon: DollarSign },
            { id: 'warranties', label: 'Bảo Hành', icon: Shield },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-4 max-w-7xl w-full mx-auto space-y-4">
        
        {/* ========================================================= */}
        {/* ADMIN VIEW 1: DASHBOARD */}
        {/* ========================================================= */}
        {currentUser.role === 'admin' && activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center text-slate-500 text-xs font-bold mb-1">
                  <span>DOANH THU</span>
                  <TrendingUp className="text-green-500" size={16} />
                </div>
                <div className="text-xl font-black text-slate-800">{totalRevenue.toLocaleString()} đ</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center text-slate-500 text-xs font-bold mb-1">
                  <span>CHI PHÍ</span>
                  <TrendingDown className="text-red-500" size={16} />
                </div>
                <div className="text-xl font-black text-slate-800">{totalExpenses.toLocaleString()} đ</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center text-slate-500 text-xs font-bold mb-1">
                  <span>LỢI NHUẬN</span>
                  <DollarSign className="text-blue-500" size={16} />
                </div>
                <div className="text-xl font-black text-blue-600">{totalProfit.toLocaleString()} đ</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center text-slate-500 text-xs font-bold mb-1">
                  <span>CÔNG NỢ CẦN THU</span>
                  <AlertCircle className="text-amber-500" size={16} />
                </div>
                <div className="text-xl font-black text-amber-600">{totalDebt.toLocaleString()} đ</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border space-y-2">
                <span className="text-xs font-bold text-slate-500">TỔNG ĐƠN HÀNG</span>
                <div className="text-2xl font-black text-slate-800">{orders.length} Đơn</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border space-y-2">
                <span className="text-xs font-bold text-slate-500">ĐƠN ĐANG XỬ LÝ</span>
                <div className="text-2xl font-black text-amber-600">{orders.filter(o => o.status !== 'Hoàn thành').length} Đơn</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border space-y-2">
                <span className="text-xs font-bold text-slate-500">THỢ ĐANG HOẠT ĐỘNG</span>
                <div className="text-2xl font-black text-green-600">{activeKtvsCount} Thợ</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ADMIN VIEW 2: QUẢN LÝ ĐƠN HÀNG */}
        {/* ========================================================= */}
        {currentUser.role === 'admin' && activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Quản Lý Đơn Hàng Dịch Vụ</h2>
              <button onClick={() => setShowOrderModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow">
                <Plus size={16} /> Tạo Đơn Mới
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map(o => {
                const assignedKtv = ktvs.find(k => k.id === o.ktvId);
                return (
                  <div key={o.id} className="bg-white p-4 rounded-2xl shadow-sm border space-y-3">
                    <div className="flex justify-between items-start border-b pb-2">
                      <div>
                        <span className="font-mono font-bold text-blue-600 text-sm">{o.id}</span>
                        <h3 className="font-bold text-slate-800 text-base">{o.customerName} - {o.phone}</h3>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${o.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {o.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-600">
                      <p>📍 <strong>Địa chỉ:</strong> {o.address} {o.gps && <span className="text-blue-600 font-mono">({o.gps})</span>}</p>
                      <p>🔧 <strong>Thiết bị:</strong> {o.deviceType} {o.brand} {o.model}</p>
                      <p>⚠️ <strong>Tình trạng lỗi:</strong> {o.issue}</p>
                      <p>👨‍🔧 <strong>Thợ phụ trách:</strong> <span className="font-bold text-slate-800">{assignedKtv ? assignedKtv.name : 'Chưa gán'}</span></p>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl text-xs flex justify-between font-bold">
                      <div>Tiền công: {o.laborFee.toLocaleString()} đ</div>
                      <div>Vật tư: {o.materialFee.toLocaleString()} đ</div>
                      <div className="text-blue-600">Tổng: {o.totalFee.toLocaleString()} đ</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ADMIN VIEW 3: QUẢN LÝ THỢ & HOA HỒNG */}
        {/* ========================================================= */}
        {currentUser.role === 'admin' && activeTab === 'ktvs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Danh Sách Kỹ Thuật Viên</h2>
              <button onClick={() => { setEditingKtv(null); setKtvForm({ name: '', phone: '', username: '', pass: '', commission: 30, startDate: '' }); setShowKtvModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow">
                <Plus size={16} /> Thêm Thợ Mới
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ktvs.map(k => {
                const ktvOrders = orders.filter(o => o.ktvId === k.id && o.status === 'Hoàn thành');
                const totalLabor = ktvOrders.reduce((sum, o) => sum + o.laborFee, 0);
                const commissionEarnings = (totalLabor * k.commission) / 100;

                return (
                  <div key={k.id} className="bg-white p-4 rounded-2xl shadow-sm border space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-base">{k.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${k.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {k.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">SĐT: {k.phone} | User: {k.username}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditingKtv(k); setKtvForm(k); setShowKtvModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => setKtvs(ktvs.map(item => item.id === k.id ? { ...item, status: item.status === 'active' ? 'locked' : 'active' } : item))} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg">
                          {k.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>Tỷ lệ hoa hồng:</span>
                        <span className="text-blue-600">{k.commission}%</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>Tổng hoa hồng tạm tính:</span>
                        <span className="text-green-600">{commissionEarnings.toLocaleString()} đ</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ADMIN VIEW 4: KHO VẬT TƯ */}
        {/* ========================================================= */}
        {currentUser.role === 'admin' && activeTab === 'materials' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Kho Linh Kiện & Vật Tư</h2>
              <button onClick={() => setShowMatModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow">
                <Plus size={16} /> Thêm Vật Tư
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                  <tr>
                    <th className="p-3">Tên linh kiện / Vật tư</th>
                    <th className="p-3">Đơn vị</th>
                    <th className="p-3">Giá nhập</th>
                    <th className="p-3">Giá bán</th>
                    <th className="p-3 text-center">Tồn kho</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {materials.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-800">{m.name}</td>
                      <td className="p-3">{m.unit}</td>
                      <td className="p-3 font-mono">{m.importPrice.toLocaleString()} đ</td>
                      <td className="p-3 font-mono text-blue-600 font-bold">{m.sellPrice.toLocaleString()} đ</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full font-bold ${m.quantity <= m.minQuantity ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-800'}`}>
                          {m.quantity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* THỢ (KTV) VIEW: GIAO DIỆN CỦA THỢ */}
        {/* ========================================================= */}
        {currentUser.role === 'ktv' && (
          <div className="space-y-4">
            {!selectedOrderForKtv ? (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <FileText size={18} /> Đơn Hàng Được Giao Cho Bạn
                </h2>
                <div className="space-y-3">
                  {orders.filter(o => o.ktvId === currentUser.id).map(o => (
                    <div key={o.id} onClick={() => setSelectedOrderForKtv(o)} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 cursor-pointer transition space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-blue-600 text-xs">{o.id}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-700">{o.status}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm">{o.customerName} - {o.phone}</h3>
                      <p className="text-xs text-slate-600">📍 {o.address}</p>
                      <p className="text-xs text-slate-500">🔧 {o.deviceType} ({o.issue})</p>
                      <div className="flex justify-end text-xs font-bold text-blue-600 items-center gap-1">
                        Chi tiết đơn <ArrowRight size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 bg-white p-5 rounded-2xl shadow-sm border">
                <button onClick={() => setSelectedOrderForKtv(null)} className="text-xs font-bold text-slate-500 flex items-center gap-1 mb-2">
                  ← Quay lại danh sách
                </button>

                <div className="border-b pb-3">
                  <span className="font-mono font-bold text-blue-600 text-xs">{selectedOrderForKtv.id}</span>
                  <h2 className="text-lg font-bold text-slate-800">{selectedOrderForKtv.customerName} - {selectedOrderForKtv.phone}</h2>
                  <p className="text-xs text-slate-600 mt-1">📍 Địa chỉ: {selectedOrderForKtv.address}</p>
                </div>

                {/* Trạng thái công việc */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">CẬP NHẬT TRẠNG THÁI CÔNG VIỆC:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Đã nhận đơn', 'Đang di chuyển', 'Đang sửa', 'Hoàn thành'].map(st => (
                      <button
                        key={st}
                        onClick={() => updateOrderStatus(selectedOrderForKtv.id, st)}
                        className={`p-2.5 rounded-xl text-xs font-bold transition border ${selectedOrderForKtv.status === st ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Thao tác vị trí & hình ảnh */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button onClick={() => handleCaptureGps(selectedOrderForKtv.id)} className="p-3 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border">
                    <MapPin size={16} className="text-red-500" /> Ghim Vị Trí GPS
                  </button>
                  <button onClick={() => handleAddImage(selectedOrderForKtv.id)} className="p-3 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border">
                    <Camera size={16} className="text-blue-500" /> Chụp Ảnh Nghiệm Thu
                  </button>
                </div>

                {/* Danh sách ảnh */}
                {selectedOrderForKtv.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pt-2">
                    {selectedOrderForKtv.images.map((img, idx) => (
                      <img key={idx} src={img} alt="Nghiệm thu" className="w-20 h-20 object-cover rounded-xl border" />
                    ))}
                  </div>
                )}

                {/* Trừ kho vật tư */}
                <div className="border-t pt-3 space-y-2">
                  <label className="text-xs font-bold text-slate-700">SỬ DỤNG VẬT TƯ TRONG KHO:</label>
                  <div className="flex gap-2">
                    <select className="flex-1 p-2 border rounded-xl text-xs" value={selectedMaterial} onChange={e => setSelectedMaterial(e.target.value)}>
                      <option value="">-- Chọn vật tư --</option>
                      {materials.map(m => (
                        <option key={m.id} value={m.id}>{m.name} (Tồn: {m.quantity})</option>
                      ))}
                    </select>
                    <input type="number" min="1" className="w-16 p-2 border rounded-xl text-xs text-center" value={matQty} onChange={e => setMatQty(e.target.value)} />
                    <button onClick={() => handleAddMaterialToOrder(selectedOrderForKtv.id)} className="bg-blue-600 text-white px-3 py-2 rounded-xl text-xs font-bold">Thêm</button>
                  </div>

                  {/* Danh sách vật tư đã dùng */}
                  {selectedOrderForKtv.usedMaterials.length > 0 && (
                    <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1 border">
                      <p className="font-bold text-slate-700">Vật tư đã chọn dùng:</p>
                      {selectedOrderForKtv.usedMaterials.map((um, idx) => (
                        <div key={idx} className="flex justify-between text-slate-600">
                          <span>• {um.name} (x{um.qty})</span>
                          <span className="font-mono">{(um.price * um.qty).toLocaleString()} đ</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* MODAL TẠO ĐƠN HÀNG (ADMIN) */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-800">Tạo Đơn Hàng Sửa Chữa Mới</h3>
            <form onSubmit={handleCreateOrder} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input type="text" required placeholder="Tên khách hàng" className="p-2.5 border rounded-xl text-xs" value={orderForm.customerName} onChange={e => setOrderForm({...orderForm, customerName: e.target.value})} />
                <input type="text" required placeholder="Số điện thoại" className="p-2.5 border rounded-xl text-xs" value={orderForm.phone} onChange={e => setOrderForm({...orderForm, phone: e.target.value})} />
              </div>
              <input type="text" required placeholder="Địa chỉ nhà khách" className="w-full p-2.5 border rounded-xl text-xs" value={orderForm.address} onChange={e => setOrderForm({...orderForm, address: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-2">
                <select className="p-2.5 border rounded-xl text-xs" value={orderForm.deviceType} onChange={e => setOrderForm({...orderForm, deviceType: e.target.value})}>
                  <option value="Máy lạnh">Máy lạnh</option>
                  <option value="Máy giặt">Máy giặt</option>
                  <option value="Tủ lạnh">Tủ lạnh</option>
                  <option value="Tủ mát">Tủ mát</option>
                </select>
                <input type="text" placeholder="Hãng (Daikin, LG...)" className="p-2.5 border rounded-xl text-xs" value={orderForm.brand} onChange={e => setOrderForm({...orderForm, brand: e.target.value})} />
              </div>

              <textarea placeholder="Mô tả lỗi thiết bị..." className="w-full p-2.5 border rounded-xl text-xs" value={orderForm.issue} onChange={e => setOrderForm({...orderForm, issue: e.target.value})} />
              <input type="text" placeholder="Nội dung công việc cần làm" className="w-full p-2.5 border rounded-xl text-xs" value={orderForm.serviceTask} onChange={e => setOrderForm({...orderForm, serviceTask: e.target.value})} />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Phân công thợ</label>
                  <select className="w-full p-2.5 border rounded-xl text-xs" value={orderForm.ktvId} onChange={e => setOrderForm({...orderForm, ktvId: e.target.value})}>
                    <option value="">-- Chọn thợ --</option>
                    {ktvs.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Tiền công (VNĐ)</label>
                  <input type="number" className="w-full p-2.5 border rounded-xl text-xs" value={orderForm.laborFee} onChange={e => setOrderForm({...orderForm, laborFee: e.target.value})} />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowOrderModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Lưu Đơn Hàng</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL QUẢN LÝ THỢ (ADMIN) */}
      {showKtvModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-800">{editingKtv ? 'Chỉnh Sửa Thông Tin Thợ' : 'Thêm Thợ Mới'}</h3>
            <form onSubmit={handleSaveKtv} className="space-y-3">
              <input type="text" required placeholder="Tên thợ" className="w-full p-2.5 border rounded-xl text-xs" value={ktvForm.name} onChange={e => setKtvForm({...ktvForm, name: e.target.value})} />
              <input type="text" required placeholder="Số điện thoại" className="w-full p-2.5 border rounded-xl text-xs" value={ktvForm.phone} onChange={e => setKtvForm({...ktvForm, phone: e.target.value})} />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" required placeholder="Tên đăng nhập" className="p-2.5 border rounded-xl text-xs" value={ktvForm.username} onChange={e => setKtvForm({...ktvForm, username: e.target.value})} />
                <input type="text" required placeholder="Mật khẩu" className="p-2.5 border rounded-xl text-xs" value={ktvForm.pass} onChange={e => setKtvForm({...ktvForm, pass: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">% Hoa hồng được hưởng</label>
                <input type="number" required className="w-full p-2.5 border rounded-xl text-xs" value={ktvForm.commission} onChange={e => setKtvForm({...ktvForm, commission: e.target.value})} />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowKtvModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Lưu Thông Tin</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
