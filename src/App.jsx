import React, { useState, useEffect } from 'react';
import { 
  Wrench, Users, ShoppingBag, MapPin, Camera, Package, 
  Calendar, Shield, Search, Plus, Trash2, Lock, Unlock, 
  LogOut, Phone, Edit, CheckCircle, AlertCircle, RefreshCw
} from 'lucide-react';

// Dữ liệu mẫu ban đầu
const INITIAL_KTVS = [
  { id: 'ktv1', name: 'Nguyễn Văn Tuấn', username: 'ktv1', pass: '123', status: 'active', commission: 20 },
  { id: 'ktv2', name: 'Lê Minh Nam', username: 'ktv2', pass: '123', status: 'active', commission: 25 },
];

const INITIAL_MATERIALS = [
  { id: 'mat1', name: 'Capacitor (Tụ điện) 35uF', quantity: 15, importPrice: 45000 },
  { id: 'mat2', name: 'Gas R32 (Bình 10kg)', quantity: 4, importPrice: 850000 },
];

const INITIAL_CUSTOMERS = [
  { id: 'c1', name: 'Nguyễn Văn A', phone: '0912345678', address: '123 Nguyễn Thị Minh Khai, Q1', repairs: ['Đơn QT-2026-001 (Vệ sinh & Bơm gas)'] },
  { id: 'c2', name: 'Chị Mai', phone: '0987654321', address: '45/12 Lê Văn Sỹ, Q3', repairs: ['Đơn QT-2026-002 (Thay tụ tủ lạnh)'] }
];

const INITIAL_WARRANTIES = [
  { id: 'w1', orderCode: 'QT-2026-001', customerName: 'Nguyễn Văn A', phone: '0912345678', device: 'Máy lạnh Daikin', repairDate: '2026-03-01', expiryDate: '2026-09-01', replacementPart: 'Tụ khởi động 35uF', note: 'Bảo hành chập cháy do linh kiện', status: 'Còn hạn' }
];

export default function App() {
  // Quản lý State với LocalStorage
  const [ktvs, setKtvs] = useState(() => JSON.parse(localStorage.getItem('QT_KTVS')) || INITIAL_KTVS);
  const [materials, setMaterials] = useState(() => JSON.parse(localStorage.getItem('QT_MATERIALS')) || INITIAL_MATERIALS);
  const [customers, setCustomers] = useState(() => JSON.parse(localStorage.getItem('QT_CUSTOMERS')) || INITIAL_CUSTOMERS);
  const [warranties, setWarranties] = useState(() => JSON.parse(localStorage.getItem('QT_WARRANTIES')) || INITIAL_WARRANTIES);

  const [currentUser, setCurrentUser] = useState(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('ktvs');

  // Search States
  const [customerSearch, setCustomerSearch] = useState('');
  const [warrantySearch, setWarrantySearch] = useState('');

  // Form States
  const [showKtvModal, setShowKtvModal] = useState(false);
  const [editingKtv, setEditingKtv] = useState(null);
  const [ktvForm, setKtvForm] = useState({ name: '', username: '', pass: '', commission: 20 });

  const [showMatModal, setShowMatModal] = useState(false);
  const [matForm, setMatForm] = useState({ name: '', quantity: 0, importPrice: 0 });

  const [showWarrantyModal, setShowWarrantyModal] = useState(false);
  const [warrantyForm, setWarrantyForm] = useState({ orderCode: '', customerName: '', phone: '', device: '', repairDate: '', expiryDate: '', replacementPart: '', note: '' });

  // Sync LocalStorage
  useEffect(() => localStorage.setItem('QT_KTVS', JSON.stringify(ktvs)), [ktvs]);
  useEffect(() => localStorage.setItem('QT_MATERIALS', JSON.stringify(materials)), [materials]);
  useEffect(() => localStorage.setItem('QT_CUSTOMERS', JSON.stringify(customers)), [customers]);
  useEffect(() => localStorage.setItem('QT_WARRANTIES', JSON.stringify(warranties)), [warranties]);

  // Login Handler
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    if (loginUsername === 'admin' && loginPassword === '123') {
      setCurrentUser({ role: 'admin', name: 'Quản trị viên' });
      setActiveTab('ktvs');
      return;
    }
    const found = ktvs.find(k => k.username === loginUsername && k.pass === loginPassword);
    if (found) {
      if (found.status === 'locked') {
        setLoginError('Tài khoản của bạn đã bị khóa!');
        return;
      }
      setCurrentUser({ role: 'ktv', ...found });
      setActiveTab('orders');
      return;
    }
    setLoginError('Tài khoản hoặc mật khẩu không đúng!');
  };

  // KTV Handlers
  const handleSaveKtv = (e) => {
    e.preventDefault();
    if (editingKtv) {
      setKtvs(ktvs.map(k => k.id === editingKtv.id ? { ...k, ...ktvForm, commission: Number(ktvForm.commission) } : k));
    } else {
      if (ktvs.some(k => k.username === ktvForm.username)) {
        alert('Tên đăng nhập đã tồn tại!');
        return;
      }
      setKtvs([...ktvs, { id: 'ktv_' + Date.now(), ...ktvForm, commission: Number(ktvForm.commission), status: 'active' }]);
    }
    setShowKtvModal(false);
    setEditingKtv(null);
    setKtvForm({ name: '', username: '', pass: '', commission: 20 });
  };

  const handleDeleteKtv = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa KTV này?')) setKtvs(ktvs.filter(k => k.id !== id));
  };

  const handleToggleLockKtv = (id) => {
    setKtvs(ktvs.map(k => k.id === id ? { ...k, status: k.status === 'active' ? 'locked' : 'active' } : k));
  };

  // Material Handlers
  const handleSaveMaterial = (e) => {
    e.preventDefault();
    setMaterials([...materials, { id: 'mat_' + Date.now(), name: matForm.name, quantity: Number(matForm.quantity), importPrice: Number(matForm.importPrice) }]);
    setShowMatModal(false);
    setMatForm({ name: '', quantity: 0, importPrice: 0 });
  };

  const handleDeleteMaterial = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa vật tư này?')) setMaterials(materials.filter(m => m.id !== id));
  };

  const handleUpdateQty = (id, delta) => {
    setMaterials(materials.map(m => m.id === id ? { ...m, quantity: Math.max(0, m.quantity + delta) } : m));
  };

  // Warranty Handlers
  const handleSaveWarranty = (e) => {
    e.preventDefault();
    setWarranties([...warranties, { id: 'w_' + Date.now(), ...warrantyForm, status: 'Còn hạn' }]);
    setShowWarrantyModal(false);
    setWarrantyForm({ orderCode: '', customerName: '', phone: '', device: '', repairDate: '', expiryDate: '', replacementPart: '', note: '' });
  };

  const handleDeleteWarranty = (id) => {
    if (window.confirm('Xóa thông tin bảo hành này?')) setWarranties(warranties.filter(w => w.id !== id));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full text-white mb-3 shadow-lg">
              <Wrench size={36} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">QUANG THẮNG SERVICE</h1>
            <p className="text-sm text-slate-500">Hệ Thống Quản Lý Dịch Vụ Sửa Chữa</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{loginError}</div>}
            <div>
              <label className="block text-sm font-medium mb-1">Tài khoản</label>
              <input type="text" required className="w-full p-2.5 border rounded-lg" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} placeholder="admin hoặc ktv1..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mật khẩu</label>
              <input type="password" required className="w-full p-2.5 border rounded-lg" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Mặc định: 123" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold shadow hover:bg-blue-700">Đăng Nhập</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white px-4 py-3 shadow flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench size={24} />
          <span className="font-bold text-lg">Quang Thắng Service</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-blue-700 px-3 py-1 rounded-full">{currentUser.role === 'admin' ? '🔑 Admin' : `👨‍🔧 ${currentUser.name}`}</span>
          <button onClick={() => setCurrentUser(null)} className="hover:text-red-200"><LogOut size={20} /></button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b px-4 py-2 flex gap-2 overflow-x-auto">
        {currentUser.role === 'admin' && (
          <>
            <button onClick={() => setActiveTab('ktvs')} className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 ${activeTab === 'ktvs' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Users size={16} /> Quản lý KTV
            </button>
            <button onClick={() => setActiveTab('materials')} className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 ${activeTab === 'materials' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Package size={16} /> Kho vật tư
            </button>
            <button onClick={() => setActiveTab('customers')} className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 ${activeTab === 'customers' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Search size={16} /> Khách hàng
            </button>
            <button onClick={() => setActiveTab('warranties')} className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 ${activeTab === 'warranties' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Shield size={16} /> Bảo hành
            </button>
          </>
        )}
      </div>

      {/* Main Container */}
      <div className="flex-1 p-4 max-w-6xl w-full mx-auto space-y-4">
        
        {/* TAB 1: QUẢN LÝ KTV */}
        {activeTab === 'ktvs' && currentUser.role === 'admin' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Danh sách Kỹ Thuật Viên</h2>
              <button onClick={() => { setEditingKtv(null); setKtvForm({ name: '', username: '', pass: '', commission: 20 }); setShowKtvModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 shadow">
                <Plus size={18} /> Thêm KTV
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ktvs.map(k => (
                <div key={k.id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-base">{k.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${k.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {k.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Tài khoản: <span className="font-mono text-slate-700 font-bold">{k.username}</span> | Mật khẩu: <span className="font-mono text-slate-700 font-bold">{k.pass}</span></p>
                    <p className="text-xs font-semibold text-blue-600">Hoa hồng: {k.commission}%</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditingKtv(k); setKtvForm({ name: k.name, username: k.username, pass: k.pass, commission: k.commission }); setShowKtvModal(true); }} className="p-2 border rounded-lg text-blue-600 hover:bg-blue-50" title="Chỉnh sửa % hoa hồng & thông tin">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleToggleLockKtv(k.id)} className={`p-2 border rounded-lg ${k.status === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`} title={k.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}>
                      {k.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
                    </button>
                    <button onClick={() => handleDeleteKtv(k.id)} className="p-2 border rounded-lg text-red-600 hover:bg-red-50" title="Xóa KTV">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: KHO VẬT TƯ */}
        {activeTab === 'materials' && currentUser.role === 'admin' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Quản Lý Kho Vật Tư</h2>
              <button onClick={() => setShowMatModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 shadow">
                <Plus size={18} /> Thêm vật tư
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                  <tr>
                    <th className="p-3">Tên vật tư</th>
                    <th className="p-3 text-center">Số lượng tồn</th>
                    <th className="p-3">Giá nhập</th>
                    <th className="p-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {materials.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-800">{m.name}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleUpdateQty(m.id, -1)} className="w-6 h-6 border rounded bg-slate-100 font-bold flex items-center justify-center hover:bg-slate-200">-</button>
                          <span className="font-bold text-slate-800 min-w-[20px]">{m.quantity}</span>
                          <button onClick={() => handleUpdateQty(m.id, 1)} className="w-6 h-6 border rounded bg-slate-100 font-bold flex items-center justify-center hover:bg-slate-200">+</button>
                        </div>
                      </td>
                      <td className="p-3 text-blue-600 font-semibold">{m.importPrice.toLocaleString()} đ</td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleDeleteMaterial(m.id)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: KHÁCH HÀNG */}
        {activeTab === 'customers' && currentUser.role === 'admin' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Danh Sách Khách Hàng</h2>
            
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Tìm kiếm theo Tên hoặc Số điện thoại khách hàng..." 
                value={customerSearch}
                onChange={e => setCustomerSearch(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customers
                .filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch))
                .map(c => (
                  <div key={c.id} className="bg-white p-4 rounded-xl shadow-sm border space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800 text-base">{c.name}</h3>
                      <span className="text-blue-600 font-bold text-sm flex items-center gap-1"><Phone size={14} /> {c.phone}</span>
                    </div>
                    <p className="text-xs text-slate-500">{c.address}</p>
                    <div className="border-t pt-2">
                      <p className="text-xs font-bold text-slate-700 mb-1">Lịch sử sửa chữa:</p>
                      {c.repairs.map((r, idx) => (
                        <p key={idx} className="text-xs text-slate-600 bg-slate-50 p-1.5 rounded mb-1">• {r}</p>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: BẢO HÀNH */}
        {activeTab === 'warranties' && currentUser.role === 'admin' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Quản Lý Bảo Hành</h2>
              <button onClick={() => setShowWarrantyModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 shadow">
                <Plus size={18} /> Thêm Bảo Hành
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Tìm kiếm theo Số điện thoại khách hàng..." 
                value={warrantySearch}
                onChange={e => setWarrantySearch(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                  <tr>
                    <th className="p-3">Mã đơn</th>
                    <th className="p-3">Khách hàng</th>
                    <th className="p-3">SĐT Khách</th>
                    <th className="p-3">Thiết bị</th>
                    <th className="p-3">Linh kiện thay thế</th>
                    <th className="p-3">Thời hạn</th>
                    <th className="p-3">Ghi chú</th>
                    <th className="p-3 text-right">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {warranties
                    .filter(w => w.phone.includes(warrantySearch))
                    .map(w => (
                      <tr key={w.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-800">{w.orderCode}</td>
                        <td className="p-3 font-semibold text-slate-800">{w.customerName}</td>
                        <td className="p-3 text-blue-600 font-bold">{w.phone}</td>
                        <td className="p-3">{w.device}</td>
                        <td className="p-3 text-amber-700 font-semibold">{w.replacementPart}</td>
                        <td className="p-3">{w.repairDate} ➔ <span className="text-red-600 font-bold">{w.expiryDate}</span></td>
                        <td className="p-3 text-slate-500">{w.note}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => handleDeleteWarranty(w.id)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODAL KTV */}
      {showKtvModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold">{editingKtv ? 'Chỉnh Sửa KTV' : 'Thêm KTV Mới'}</h3>
            <form onSubmit={handleSaveKtv} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Tên KTV</label>
                <input type="text" required className="w-full p-2 border rounded-lg text-sm" value={ktvForm.name} onChange={e => setKtvForm({...ktvForm, name: e.target.value})} placeholder="Nguyễn Văn B" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Tài khoản đăng nhập</label>
                <input type="text" required disabled={!!editingKtv} className="w-full p-2 border rounded-lg text-sm" value={ktvForm.username} onChange={e => setKtvForm({...ktvForm, username: e.target.value})} placeholder="ktv2" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Mật khẩu</label>
                <input type="text" required className="w-full p-2 border rounded-lg text-sm" value={ktvForm.pass} onChange={e => setKtvForm({...ktvForm, pass: e.target.value})} placeholder="123456" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Tỷ lệ % Hoa hồng</label>
                <input type="number" required className="w-full p-2 border rounded-lg text-sm" value={ktvForm.commission} onChange={e => setKtvForm({...ktvForm, commission: e.target.value})} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowKtvModal(false)} className="px-4 py-2 border rounded-lg text-sm">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Lưu KTV</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VẬT TƯ */}
      {showMatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold">Thêm Vật Tư Mới</h3>
            <form onSubmit={handleSaveMaterial} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Tên vật tư</label>
                <input type="text" required className="w-full p-2 border rounded-lg text-sm" value={matForm.name} onChange={e => setMatForm({...matForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Số lượng nhập ban đầu</label>
                <input type="number" required className="w-full p-2 border rounded-lg text-sm" value={matForm.quantity} onChange={e => setMatForm({...matForm, quantity: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Giá nhập (VNĐ)</label>
                <input type="number" required className="w-full p-2 border rounded-lg text-sm" value={matForm.importPrice} onChange={e => setMatForm({...matForm, importPrice: e.target.value})} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowMatModal(false)} className="px-4 py-2 border rounded-lg text-sm">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Thêm Vật Tư</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BẢO HÀNH */}
      {showWarrantyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold">Tạo Hồ Sơ Bảo Hành</h3>
            <form onSubmit={handleSaveWarranty} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input type="text" required placeholder="Mã đơn (VD: QT-2026-001)" className="p-2 border rounded-lg text-xs" value={warrantyForm.orderCode} onChange={e => setWarrantyForm({...warrantyForm, orderCode: e.target.value})} />
                <input type="text" required placeholder="Tên khách hàng" className="p-2 border rounded-lg text-xs" value={warrantyForm.customerName} onChange={e => setWarrantyForm({...warrantyForm, customerName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" required placeholder="SĐT Khách hàng" className="p-2 border rounded-lg text-xs" value={warrantyForm.phone} onChange={e => setWarrantyForm({...warrantyForm, phone: e.target.value})} />
                <input type="text" required placeholder="Tên thiết bị" className="p-2 border rounded-lg text-xs" value={warrantyForm.device} onChange={e => setWarrantyForm({...warrantyForm, device: e.target.value})} />
              </div>
              <input type="text" required placeholder="Linh kiện thay thế" className="w-full p-2 border rounded-lg text-xs" value={warrantyForm.replacementPart} onChange={e => setWarrantyForm({...warrantyForm, replacementPart: e.target.value})} />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500">Ngày sửa</label>
                  <input type="date" required className="w-full p-2 border rounded-lg text-xs" value={warrantyForm.repairDate} onChange={e => setWarrantyForm({...warrantyForm, repairDate: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">Hạn bảo hành</label>
                  <input type="date" required className="w-full p-2 border rounded-lg text-xs" value={warrantyForm.expiryDate} onChange={e => setWarrantyForm({...warrantyForm, expiryDate: e.target.value})} />
                </div>
              </div>
              <textarea placeholder="Ghi chú bảo hành..." className="w-full p-2 border rounded-lg text-xs" value={warrantyForm.note} onChange={e => setWarrantyForm({...warrantyForm, note: e.target.value})} />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowWarrantyModal(false)} className="px-4 py-2 border rounded-lg text-sm">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Lưu Bảo Hành</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
