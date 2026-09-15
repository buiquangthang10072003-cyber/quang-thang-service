import React, { useState, useEffect, useMemo } from 'react';
import {
  Wrench,
  Users,
  Package,
  FileText,
  DollarSign,
  TrendingUp,
  MapPin,
  Camera,
  Calendar,
  ShieldCheck,
  Download,
  Upload,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  User,
  LogOut,
  ChevronRight,
  Navigation,
  Eye,
  Lock,
  Edit,
  Trash2,
  RefreshCw,
  Smartphone,
  Check,
  X,
  CreditCard,
  PieChart,
  BarChart2,
  Sliders,
  Filter,
  FileSpreadsheet
} from 'lucide-react';

const INITIAL_KTVS = [
  { id: 'ktv-1', name: 'Nguyễn Văn Tuấn', phone: '0905111222', username: 'ktvtuan', active: true, commissionRate: 15 },
  { id: 'ktv-2', name: 'Lê Minh Nam', phone: '0905333444', username: 'ktvnam', active: true, commissionRate: 12 },
  { id: 'ktv-3', name: 'Trần Hoàng Hùng', phone: '0905555666', username: 'ktvhung', active: true, commissionRate: 10 },
  { id: 'ktv-4', name: 'Phạm Đức Anh', phone: '0905777888', username: 'ktvanh', active: false, commissionRate: 12 },
];

const INITIAL_MATERIALS = [
  { id: 'mat-1', name: 'Gas R32 (Bình 10kg)', unit: 'Kg', stock: 24, importPrice: 150000, sellPrice: 250000 },
  { id: 'mat-2', name: 'Tụ quạt máy lạnh 2.5uF', unit: 'Cái', stock: 18, importPrice: 25000, sellPrice: 70000 },
  { id: 'mat-3', name: 'Tụ đề block 35uF', unit: 'Cái', stock: 12, importPrice: 65000, sellPrice: 160000 },
  { id: 'mat-4', name: 'Ống đồng phi 6/10 (Mét)', unit: 'Mét', stock: 45, importPrice: 120000, sellPrice: 180000 },
  { id: 'mat-5', name: 'Cảm biến nhiệt độ tủ lạnh', unit: 'Cái', stock: 8, importPrice: 40000, sellPrice: 120000 },
  { id: 'mat-6', name: 'Bộ xả van máy giặt LG/Toshiba', unit: 'Bộ', stock: 5, importPrice: 180000, sellPrice: 350000 },
];

const INITIAL_CUSTOMERS = [
  { id: 'cust-1', name: 'Nguyễn Văn A', phone: '0912345678', address: '123 Nguyễn Thị Minh Khai, Q1, TP.HCM' },
  { id: 'cust-2', name: 'Chị Mai - Spa Rose', phone: '0987654321', address: '45/12 Lê Văn Sỹ, Q3, TP.HCM' },
  { id: 'cust-3', name: 'Anh Hoàng (Quán Cà Phê)', phone: '0903999888', address: '88 Võ Văn Tần, Q3, TP.HCM' },
  { id: 'cust-4', name: 'Công ty ABC', phone: '0283822110', address: 'Tầng 4, Tòa nhà Bitexco, Q1, TP.HCM' },
];

const INITIAL_ORDERS = [
  {
    id: 'QT-2026-00125',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0912345678',
    customerAddress: '123 Nguyễn Thị Minh Khai, Q1, TP.HCM',
    deviceType: 'MayLanh', // MayLanh, TuLanh, MayGiat, TuMat
    deviceBrand: 'Daikin Inverter 1.5 HP',
    issue: 'Máy không lạnh, chớp đèn lỗi F3. Cần kiểm tra gas & bo mạch.',
    notes: 'Gọi trước khi đến 15 phút. Nhà riêng.',
    ktvId: 'ktv-1',
    status: 'DangLam', // DonMoi, DaNhan, DangLam, HoanThanh
    laborFee: 300000,
    materialFee: 350000,
    paidAmount: 200000,
    materialsUsed: [{ matId: 'mat-1', quantity: 1, name: 'Gas R32 (Bình 10kg)', price: 250000 }],
    warrantyMonths: 6,
    gpsLocation: { lat: 10.776889, lng: 106.695319, addressText: '123 Nguyễn Thị Minh Khai, Q1' },
    images: [
      { id: 'img-1', type: 'ThietBi', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop' },
      { id: 'img-2', type: 'TruocKhiSua', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop' }
    ],
    createdAt: '2026-03-14T08:30:00Z',
    completedAt: null
  },
  {
    id: 'QT-2026-00126',
    customerName: 'Chị Mai - Spa Rose',
    customerPhone: '0987654321',
    customerAddress: '45/12 Lê Văn Sỹ, Q3, TP.HCM',
    deviceType: 'TuLanh',
    deviceBrand: 'Samsung Side-by-Side',
    issue: 'Đăn ngắt điện không chạy, ngăn đông không đóng đá.',
    notes: 'Tiệm Spa mở cửa từ 8h sáng.',
    ktvId: 'ktv-2',
    status: 'DaNhan',
    laborFee: 250000,
    materialFee: 120000,
    paidAmount: 0,
    materialsUsed: [{ matId: 'mat-5', quantity: 1, name: 'Cảm biến nhiệt độ tủ lạnh', price: 120000 }],
    warrantyMonths: 3,
    gpsLocation: null,
    images: [],
    createdAt: '2026-03-14T09:15:00Z',
    completedAt: null
  },
  {
    id: 'QT-2026-00124',
    customerName: 'Anh Hoàng (Quán Cà Phê)',
    customerPhone: '0903999888',
    customerAddress: '88 Võ Văn Tần, Q3, TP.HCM',
    deviceType: 'TuMat',
    deviceBrand: 'Sanaky 400 Lit',
    issue: 'Vệ sinh bảo dưỡng & thay lốc làm lạnh.',
    notes: 'Đã hoàn tất thanh toán đủ.',
    ktvId: 'ktv-1',
    status: 'HoanThanh',
    laborFee: 400000,
    materialFee: 650000,
    paidAmount: 1050000,
    materialsUsed: [],
    warrantyMonths: 12,
    gpsLocation: { lat: 10.775210, lng: 106.689120, addressText: '88 Võ Văn Tần, Q3' },
    images: [
      { id: 'img-3', type: 'SauKhiSua', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop' }
    ],
    createdAt: '2026-03-13T14:00:00Z',
    completedAt: '2026-03-13T17:30:00Z'
  },
  {
    id: 'QT-2026-00127',
    customerName: 'Công ty ABC',
    customerPhone: '0283822110',
    customerAddress: 'Tầng 4, Tòa nhà Bitexco, Q1, TP.HCM',
    deviceType: 'MayGiat',
    deviceBrand: 'LG Inverter 9kg',
    issue: 'Máy giặt vắt kêu to, rung lắc mạnh và rò nước.',
    notes: 'Báo giá trước khi thay linh kiện.',
    ktvId: 'ktv-3',
    status: 'DonMoi',
    laborFee: 200000,
    materialFee: 350000,
    paidAmount: 0,
    materialsUsed: [],
    warrantyMonths: 6,
    gpsLocation: null,
    images: [],
    createdAt: '2026-03-15T07:45:00Z',
    completedAt: null
  }
];

const INITIAL_EXPENSES = [
  { id: 'exp-1', title: 'Tiền xăng xe hỗ trợ KTV tháng 3', amount: 1500000, category: 'Chi kĩ thuật', date: '2026-03-01' },
  { id: 'exp-2', title: 'Mua thêm trang thiết bị đồng phục', amount: 850000, category: 'Vật tư / Dụng cụ', date: '2026-03-05' },
  { id: 'exp-3', title: 'Chi phí quảng cáo Zalo / Facebook', amount: 2000000, category: 'Marketing', date: '2026-03-10' }
];

const INITIAL_APPOINTMENTS = [
  { id: 'apt-1', customerName: 'Trần Văn C', phone: '0933111999', address: '220 Trần Hưng Đạo, Q1', time: '2026-03-16T09:00', deviceType: 'MayLanh', issue: 'Bảo trì dàn nóng máy lạnh trung tâm', ktvId: 'ktv-1', status: 'ChuaDuyet' },
  { id: 'apt-2', customerName: 'Phạm Thị D', phone: '0977222888', address: '12 Lý Thường Kiệt, Q10', time: '2026-03-16T14:30', deviceType: 'MayGiat', issue: 'Sửa lỗi không xả nước máy giặt', ktvId: 'ktv-2', status: 'DaDuyet' }
];

/* DEVICE CONFIG WITH HELPER ICONS & COLORS */
const DEVICE_CONFIG = {
  MayLanh: { label: 'Máy lạnh', icon: '❄️', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' },
  TuLanh: { label: 'Tủ lạnh', icon: '🧊', badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  MayGiat: { label: 'Máy giặt', icon: '🧺', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200' },
  TuMat: { label: 'Tủ mát', icon: '🥤', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
};

const STATUS_CONFIG = {
  DonMoi: { label: 'Đơn mới', color: 'bg-amber-500 text-white', step: 1 },
  DaNhan: { label: 'Đã nhận', color: 'bg-blue-500 text-white', step: 2 },
  DangLam: { label: 'Đang làm', color: 'bg-indigo-600 text-white', step: 3 },
  HoanThanh: { label: 'Hoàn thành', color: 'bg-emerald-600 text-white', step: 4 }
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return { role: 'admin', id: 'admin', name: 'Admin Quang Thắng' };
  });

  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [ktvs, setKtvs] = useState(INITIAL_KTVS);
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  // Active Tab State
  const [activeTab, setActiveTab] = useState('orders'); // orders, dashboard, ktv, revenue, materials, customers, warranty, appointments, backup

  // Toast Notification System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isKtvModalOpen, setIsKtvModalOpen] = useState(false);
  const [editingKtv, setEditingKtv] = useState(null);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isPayDebtModalOpen, setIsPayDebtModalOpen] = useState(false);
  const [selectedDebtOrder, setSelectedDebtOrder] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deviceFilter, setDeviceFilter] = useState('ALL');

  const isAdmin = currentUser.role === 'admin';
  const currentKtvId = currentUser.role === 'ktv' ? currentUser.id : null;

  // STRICT RULE: If logged in as KTV, only return assigned orders
  const visibleOrders = useMemo(() => {
    let list = orders;
    if (!isAdmin && currentKtvId) {
      list = list.filter(o => o.ktvId === currentKtvId);
    }
    if (statusFilter !== 'ALL') {
      list = list.filter(o => o.status === statusFilter);
    }
    if (deviceFilter !== 'ALL') {
      list = list.filter(o => o.deviceType === deviceFilter);
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        o =>
          o.id.toLowerCase().includes(term) ||
          o.customerName.toLowerCase().includes(term) ||
          o.customerPhone.includes(term) ||
          o.deviceBrand.toLowerCase().includes(term)
      );
    }
    return list;
  }, [orders, isAdmin, currentKtvId, statusFilter, deviceFilter, searchTerm]);

  // Total Calculations (STRICTLY ADMIN ONLY COMPUTATION)
  const financialMetrics = useMemo(() => {
    let totalLabor = 0;
    let totalMaterialRev = 0;
    let totalRevenue = 0;
    let totalPaid = 0;
    let totalDebt = 0;

    orders.forEach(o => {
      const labor = Number(o.laborFee || 0);
      const mat = Number(o.materialFee || 0);
      const paid = Number(o.paidAmount || 0);
      const orderTotal = labor + mat;

      totalLabor += labor;
      totalMaterialRev += mat;
      totalRevenue += orderTotal;
      totalPaid += paid;
      totalDebt += Math.max(0, orderTotal - paid);
    });

    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    // Estimated Gross Profit
    const estProfit = totalRevenue - totalExpense - totalMaterialRev * 0.6; // Assuming 60% mat cost base

    return {
      totalLabor,
      totalMaterialRev,
      totalRevenue,
      totalPaid,
      totalDebt,
      totalExpense,
      estProfit,
      totalOrdersCount: orders.length,
      completedCount: orders.filter(o => o.status === 'HoanThanh').length
    };
  }, [orders, expenses]);

  const handleRoleSwitch = (role, ktvUser = null) => {
    if (role === 'admin') {
      setCurrentUser({ role: 'admin', id: 'admin', name: 'Admin Quang Thắng' });
      setActiveTab('orders');
      showToast('Đã chuyển sang quyền Admin toàn năng');
    } else if (ktvUser) {
      setCurrentUser({ role: 'ktv', id: ktvUser.id, name: ktvUser.name });
      setActiveTab('orders');
      showToast(`Đăng nhập thành công KTV: ${ktvUser.name}`);
    }
  };

  const handleCreateOrUpdateOrder = (formData) => {
    if (editingOrder) {
      setOrders(prev => prev.map(o => o.id === editingOrder.id ? { ...o, ...formData } : o));
      showToast(`Cập nhật đơn hàng ${editingOrder.id} thành công!`);
    } else {
      const newId = `QT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const newOrder = {
        ...formData,
        id: newId,
        createdAt: new Date().toISOString(),
        completedAt: formData.status === 'HoanThanh' ? new Date().toISOString() : null
      };
      setOrders(prev => [newOrder, ...prev]);

      // Sync Customer list if new
      if (!customers.some(c => c.phone === formData.customerPhone)) {
        setCustomers(prev => [
          ...prev,
          {
            id: `cust-${Date.now()}`,
            name: formData.customerName,
            phone: formData.customerPhone,
            address: formData.customerAddress
          }
        ]);
      }

      showToast(`Tạo đơn hàng mới ${newId} thành công!`);
    }
    setIsOrderModalOpen(false);
    setEditingOrder(null);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const isCompleted = newStatus === 'HoanThanh';
          return {
            ...o,
            status: newStatus,
            completedAt: isCompleted ? new Date().toISOString() : o.completedAt
          };
        }
        return o;
      })
    );
    showToast(`Đã chuyển trạng thái đơn sang "${STATUS_CONFIG[newStatus].label}"`);
  };

  const handleSaveGPS = (orderId) => {
    if (!navigator.geolocation) {
      showToast('Trình duyệt không hỗ trợ định vị GPS', 'error');
      return;
    }
    showToast('Đang lấy vị trí GPS hiện tại...', 'info');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setOrders(prev =>
          prev.map(o => {
            if (o.id === orderId) {
              return {
                ...o,
                gpsLocation: {
                  lat: latitude,
                  lng: longitude,
                  addressText: `Tọa độ: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                }
              };
            }
            return o;
          })
        );
        showToast('Đã lưu vị trí GPS khách hàng thành công!');
      },
      (error) => {
        // Fallback simulated GPS location if blocked/mock
        const mockLat = 10.776 + (Math.random() - 0.5) * 0.01;
        const mockLng = 106.695 + (Math.random() - 0.5) * 0.01;
        setOrders(prev =>
          prev.map(o => {
            if (o.id === orderId) {
              return {
                ...o,
                gpsLocation: {
                  lat: mockLat,
                  lng: mockLng,
                  addressText: `Định vị mô phỏng: ${mockLat.toFixed(5)}, ${mockLng.toFixed(5)}`
                }
              };
            }
            return o;
          })
        );
        showToast('Đã lưu tọa độ vị trí khách hàng!', 'info');
      }
    );
  };

  const handleAddImageToOrder = (orderId, imageType) => {
    // Generate a placeholder high quality image based on stage
    const sampleImgs = [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&auto=format&fit=crop'
    ];
    const newImg = {
      id: `img-${Date.now()}`,
      type: imageType,
      url: sampleImgs[Math.floor(Math.random() * sampleImgs.length)]
    };

    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          return { ...o, images: [...(o.images || []), newImg] };
        }
        return o;
      })
    );
    showToast('Đã thêm ảnh vào đơn hàng!');
  };

  const handleExportCSV = () => {
    const headers = ['Ma_Don', 'Khach_Hang', 'SĐT', 'Thiet_Bi', 'Nhan_Vien', 'Trang_Thai', 'Tien_Cong', 'Tien_Vat_Tu', 'Da_Thu'];
    const rows = orders.map(o => [
      o.id,
      `"${o.customerName}"`,
      o.customerPhone,
      `"${o.deviceBrand}"`,
      ktvs.find(k => k.id === o.ktvId)?.name || 'Chưa giao',
      STATUS_CONFIG[o.status].label,
      o.laborFee,
      o.materialFee,
      o.paidAmount
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `QUANG_THANG_SERVICE_DON_HANG_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file dữ liệu CSV thành công!');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* PWA / MOBILE BANNER PROMPT */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white text-xs sm:text-sm py-2 px-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span><b>Quang Thắng Service App:</b> Thợ chỉ cần mở Chrome ➔ "Thêm vào màn hình chính" để dùng như App PWA.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden md:inline bg-blue-600/50 px-2 py-0.5 rounded text-[11px] border border-blue-400/30">Hệ thống Online đồng bộ Realtime</span>
        </div>
      </div>

      {/* TOP NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">QUANG THẮNG SERVICE</h1>
              <p className="text-[11px] text-slate-500 font-medium">Hệ Thống Quản Lý Đặt Lịch & Điện Lạnh</p>
            </div>
          </div>

          {/* User Profile & Role Switcher */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-semibold text-slate-800">{currentUser.name}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {isAdmin ? 'Quản Trị Viên (Admin)' : 'Kỹ Thuật Viên (KTV)'}
              </span>
            </div>

            {/* Quick Switch Role Dropdown for Demo */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 transition">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Đổi Tài Khoản</span>
              </button>
              <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 hidden group-hover:block z-50">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chọn Vai Trò Đăng Nhập</div>
                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition ${isAdmin ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
                >
                  <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-purple-600" /> Admin (Quang Thắng)</span>
                  {isAdmin && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                <div className="px-3 py-1 text-[10px] text-slate-400">Đăng Nhập Với Tư Cách KTV:</div>
                {ktvs.map(k => (
                  <button
                    key={k.id}
                    onClick={() => handleRoleSwitch('ktv', k)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-100 transition ${!isAdmin && currentKtvId === k.id ? 'font-bold text-emerald-600 bg-emerald-50' : 'text-slate-700'}`}
                  >
                    <span className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-slate-400" /> {k.name}</span>
                    {!isAdmin && currentKtvId === k.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title="Đổi Mật Khẩu"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <nav className="bg-white border-b border-slate-200 shadow-2xs overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 sm:gap-2">
          {/* Main Orders Tab (Visible to All) */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isAdmin ? 'Quản Lý Đơn Hàng' : 'Đơn Hàng Của Tôi'}</span>
            <span className="ml-1 bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {visibleOrders.length}
            </span>
          </button>

          {/* ADMIN ONLY TABS - Strictly Hidden from KTVs */}
          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <PieChart className="w-4 h-4" />
                <span>Dashboard & Thống Kê</span>
              </button>

              <button
                onClick={() => setActiveTab('revenue')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'revenue'
                    ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Doanh Thu & Công Nợ</span>
              </button>

              <button
                onClick={() => setActiveTab('ktv')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'ktv'
                    ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Quản Lý KTV</span>
              </button>

              <button
                onClick={() => setActiveTab('materials')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'materials'
                    ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Kho Vật Tư</span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'customers'
                    ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Khách Hàng</span>
              </button>

              <button
                onClick={() => setActiveTab('warranty')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'warranty'
                    ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Bảo Hành</span>
              </button>

              <button
                onClick={() => setActiveTab('appointments')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'appointments'
                    ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Lịch Hẹn</span>
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'backup'
                    ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Báo Cáo & Sao Lưu</span>
              </button>
            </>
          )}
        </div>
      </nav>

      {/* TOAST NOTIFICATION FLOATING */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-bounce">
          <AlertCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-medium">{toast.message}</span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ==================== TAB 1: ORDER MANAGEMENT ==================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Top Toolbar & Actions */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1 w-full md:w-auto relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm theo mã đơn, tên khách, số điện thoại, thiết bị..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-hidden"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 outline-hidden"
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="DonMoi">Đơn mới</option>
                    <option value="DaNhan">Đã nhận</option>
                    <option value="DangLam">Đang làm</option>
                    <option value="HoanThanh">Hoàn thành</option>
                  </select>

                  {/* Device Filter */}
                  <select
                    value={deviceFilter}
                    onChange={(e) => setDeviceFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 outline-hidden"
                  >
                    <option value="ALL">Tất cả thiết bị</option>
                    <option value="MayLanh">❄️ Máy lạnh</option>
                    <option value="TuLanh">🧊 Tủ lạnh</option>
                    <option value="MayGiat">🧺 Máy giặt</option>
                    <option value="TuMat">🥤 Tủ mát</option>
                  </select>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setEditingOrder(null);
                        setIsOrderModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tạo Đơn Mới</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Orders Grid / Cards */}
            {visibleOrders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-700">Không tìm thấy đơn hàng phù hợp</h3>
                <p className="text-xs text-slate-500 mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {visibleOrders.map((order) => {
                  const assignedKtv = ktvs.find(k => k.id === order.ktvId);
                  const totalCost = Number(order.laborFee || 0) + Number(order.materialFee || 0);
                  const debt = totalCost - Number(order.paidAmount || 0);

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                    >
                      {/* Card Header */}
                      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-blue-700">{order.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DEVICE_CONFIG[order.deviceType].badgeClass}`}>
                              {DEVICE_CONFIG[order.deviceType].icon} {DEVICE_CONFIG[order.deviceType].label}
                            </span>
                          </div>
                          <h4 className="text-xs font-semibold text-slate-900 mt-1">{order.deviceBrand}</h4>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${STATUS_CONFIG[order.status].color}`}>
                          {STATUS_CONFIG[order.status].label}
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 space-y-3 text-xs text-slate-600 flex-1">
                        <div className="flex items-start gap-2">
                          <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-800">{order.customerName}</span>
                            <a href={`tel:${order.customerPhone}`} className="text-blue-600 hover:underline font-mono ml-2 font-medium">
                              ({order.customerPhone})
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <span className="text-slate-600">{order.customerAddress}</span>
                        </div>

                        <div className="bg-amber-50 border border-amber-200/60 p-2.5 rounded-lg text-amber-900">
                          <p className="font-medium"><b>Nội dung hư hỏng:</b> {order.issue}</p>
                          {order.notes && <p className="text-[11px] text-amber-800 mt-0.5"><b>Ghi chú:</b> {order.notes}</p>}
                        </div>

                        {/* KTV Assigned Info */}
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                          <span className="text-slate-500">Phụ trách:</span>
                          <span className="font-semibold text-slate-800">
                            {assignedKtv ? assignedKtv.name : <span className="text-red-500 font-normal">Chưa phân công</span>}
                          </span>
                        </div>

                        {/* FINANCIAL DETAILS - VISIBLE ONLY TO ADMIN */}
                        {isAdmin && (
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 grid grid-cols-3 gap-2 text-center text-[11px]">
                            <div>
                              <p className="text-slate-400">Tiền công/Vật tư</p>
                              <p className="font-bold text-slate-800">{(totalCost / 1000).toLocaleString()}kđ</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Đã thu</p>
                              <p className="font-bold text-emerald-600">{(order.paidAmount / 1000).toLocaleString()}kđ</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Còn nợ</p>
                              <p className={`font-bold ${debt > 0 ? 'text-red-600' : 'text-slate-600'}`}>
                                {(debt / 1000).toLocaleString()}kđ
                              </p>
                            </div>
                          </div>
                        )}

                        {/* GPS Location & Maps Action */}
                        <div className="flex items-center justify-between bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                          <span className="text-[11px] text-blue-900 flex items-center gap-1 font-medium">
                            <Navigation className="w-3.5 h-3.5 text-blue-600" />
                            {order.gpsLocation ? order.gpsLocation.addressText : 'Chưa lưu vị trí GPS'}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleSaveGPS(order.id)}
                              className="px-2 py-1 bg-white border border-blue-200 text-blue-700 rounded text-[11px] font-medium hover:bg-blue-50 transition"
                              title="Lấy vị trí GPS hiện tại"
                            >
                              📍 Định vị
                            </button>
                            {order.gpsLocation && (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${order.gpsLocation.lat},${order.gpsLocation.lng}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-1 bg-blue-600 text-white rounded text-[11px] font-medium hover:bg-blue-700 transition"
                              >
                                Mở Maps
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Image Thumbnails Attached */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[11px] font-semibold text-slate-500">Hình ảnh chụp ({order.images?.length || 0}):</span>
                            <div className="flex gap-1">
                              {['ThietBi', 'TruocKhiSua', 'SauKhiSua'].map(type => (
                                <button
                                  key={type}
                                  onClick={() => handleAddImageToOrder(order.id, type)}
                                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded"
                                >
                                  + {type === 'ThietBi' ? 'Máy' : type === 'TruocKhiSua' ? 'Trước' : 'Sau'}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 overflow-x-auto py-1">
                            {order.images?.map(img => (
                              <div key={img.id} className="relative w-12 h-12 rounded border overflow-hidden shrink-0 group">
                                <img src={img.url} alt="Hồ sơ đơn" className="w-full h-full object-cover" />
                                <span className="absolute bottom-0 left-0 right-0 bg-slate-900/80 text-white text-[8px] text-center truncate px-0.5">
                                  {img.type}
                                </span>
                              </div>
                            ))}
                            {(!order.images || order.images.length === 0) && (
                              <span className="text-[11px] text-slate-400 italic">Chưa có hình ảnh nào</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Actions Footer */}
                      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                        {/* Status Progression Buttons for KTV & Admin */}
                        <div className="flex items-center gap-1 overflow-x-auto">
                          {order.status === 'DonMoi' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'DaNhan')}
                              className="bg-blue-600 text-white px-2.5 py-1 rounded text-xs font-medium hover:bg-blue-700 transition"
                            >
                              Nhận Đơn
                            </button>
                          )}
                          {order.status === 'DaNhan' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'DangLam')}
                              className="bg-indigo-600 text-white px-2.5 py-1 rounded text-xs font-medium hover:bg-indigo-700 transition"
                            >
                              Bắt Đầu Làm
                            </button>
                          )}
                          {order.status === 'DangLam' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'HoanThanh')}
                              className="bg-emerald-600 text-white px-2.5 py-1 rounded text-xs font-medium hover:bg-emerald-700 transition"
                            >
                              Hoàn Thành
                            </button>
                          )}
                          {order.status === 'HoanThanh' && (
                            <span className="text-emerald-700 font-medium text-xs flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Đã Hoàn Thành
                            </span>
                          )}
                        </div>

                        {/* Admin Edit Action */}
                        {isAdmin && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingOrder(order);
                                setIsOrderModalOpen(true);
                              }}
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Chỉnh sửa đơn"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setOrders(prev => prev.filter(o => o.id !== order.id));
                                showToast('Đã xóa đơn hàng');
                              }}
                              className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition"
                              title="Xóa đơn"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: DASHBOARD (ADMIN ONLY) ==================== */}
        {activeTab === 'dashboard' && isAdmin && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Tổng Doanh Thu</span>
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><DollarSign className="w-5 h-5" /></div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {financialMetrics.totalRevenue.toLocaleString()} VNĐ
                </h3>
                <p className="text-xs text-slate-400 mt-1">Từ {financialMetrics.totalOrdersCount} đơn hàng</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Lợi Nhuận Ước Tính</span>
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><TrendingUp className="w-5 h-5" /></div>
                </div>
                <h3 className="text-xl font-bold text-emerald-600 mt-2">
                  {financialMetrics.estProfit.toLocaleString()} VNĐ
                </h3>
                <p className="text-xs text-slate-400 mt-1">Trừ chi phí & vật tư nhập</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Công Nợ Khách Hàng</span>
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><AlertCircle className="w-5 h-5" /></div>
                </div>
                <h3 className="text-xl font-bold text-amber-600 mt-2">
                  {financialMetrics.totalDebt.toLocaleString()} VNĐ
                </h3>
                <p className="text-xs text-slate-400 mt-1">Chưa thu hồi xong</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Đơn Hoàn Thành</span>
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><CheckCircle2 className="w-5 h-5" /></div>
                </div>
                <h3 className="text-xl font-bold text-purple-700 mt-2">
                  {financialMetrics.completedCount} / {financialMetrics.totalOrdersCount}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Tỷ lệ: {Math.round((financialMetrics.completedCount / (financialMetrics.totalOrdersCount || 1)) * 100)}%</p>
              </div>
            </div>

            {/* Visual Breakdown Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Type Breakdown */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-blue-600" /> Cơ Cấu Thiết Bị Phục Vụ
                </h3>
                <div className="space-y-3">
                  {Object.keys(DEVICE_CONFIG).map(key => {
                    const count = orders.filter(o => o.deviceType === key).length;
                    const percent = Math.round((count / (orders.length || 1)) * 100);
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">{DEVICE_CONFIG[key].icon} {DEVICE_CONFIG[key].label}</span>
                          <span className="text-slate-500">{count} đơn ({percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-indigo-600" /> Trạng Thái Tiến Độ Công Việc
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(STATUS_CONFIG).map(sKey => {
                    const count = orders.filter(o => o.status === sKey).length;
                    return (
                      <div key={sKey} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_CONFIG[sKey].color}`}>
                          {STATUS_CONFIG[sKey].label}
                        </span>
                        <p className="text-2xl font-bold text-slate-800 mt-2">{count}</p>
                        <p className="text-[11px] text-slate-400">đơn hàng</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: REVENUE & DEBT (ADMIN ONLY) ==================== */}
        {activeTab === 'revenue' && isAdmin && (
          <div className="space-y-6">
            {/* Top Financial Overview */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Báo Cáo Tài Chính & Thu Chi</h2>
                <p className="text-xs text-slate-500">Quản lý tổng tiền thu từ khách, chi phí vật tư và công nợ</p>
              </div>
              <button
                onClick={() => setIsExpenseModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Phỏng Chi Nhập</span>
              </button>
            </div>

            {/* Customer Debts List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-bold text-slate-800">Danh Sách Khách Hàng Còn Nợ Tiền</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {orders.filter(o => (Number(o.laborFee || 0) + Number(o.materialFee || 0) - Number(o.paidAmount || 0)) > 0).map(order => {
                  const totalCost = Number(order.laborFee || 0) + Number(order.materialFee || 0);
                  const debt = totalCost - Number(order.paidAmount || 0);

                  return (
                    <div key={order.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-50 transition">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-blue-700">{order.id}</span>
                          <span className="font-semibold text-slate-800 text-sm">{order.customerName}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">SĐT: {order.customerPhone} | Thiết bị: {order.deviceBrand}</p>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Còn nợ lại:</p>
                          <p className="text-sm font-bold text-red-600">{debt.toLocaleString()} VNĐ</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedDebtOrder(order);
                            setIsPayDebtModalOpen(true);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                        >
                          Thu Tiền Nợ
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Expense Log */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-bold text-slate-800">Sổ Lịch Sử Khoản Chi Hoạt Động</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {expenses.map(exp => (
                  <div key={exp.id} className="p-4 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">{exp.title}</p>
                      <p className="text-slate-400 mt-0.5">{exp.date} | Danh mục: {exp.category}</p>
                    </div>
                    <span className="font-bold text-red-600 text-sm">-{exp.amount.toLocaleString()} VNĐ</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: KTV MANAGEMENT (ADMIN ONLY) ==================== */}
        {activeTab === 'ktv' && isAdmin && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-slate-900">Quản Lý Đội Ngũ Kỹ Thuật Viên</h2>
                <p className="text-xs text-slate-500">Quản lý tài khoản, trạng thái làm việc và tỷ lệ hoa hồng</p>
              </div>
              <button
                onClick={() => {
                  setEditingKtv(null);
                  setIsKtvModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm KTV Mới</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ktvs.map(ktv => {
                const assignedCount = orders.filter(o => o.ktvId === ktv.id && o.status !== 'HoanThanh').length;
                const completedCount = orders.filter(o => o.ktvId === ktv.id && o.status === 'HoanThanh').length;

                return (
                  <div key={ktv.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-bold">
                          {ktv.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{ktv.name}</h4>
                          <p className="text-xs text-slate-500">Username: <span className="font-mono text-slate-700">{ktv.username}</span> | SĐT: {ktv.phone}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ktv.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {ktv.active ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center text-xs">
                      <div>
                        <p className="text-slate-400">Đơn đang làm</p>
                        <p className="font-bold text-blue-600">{assignedCount}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Đơn đã xong</p>
                        <p className="font-bold text-emerald-600">{completedCount}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Hoa hồng (% Admin)</p>
                        <p className="font-bold text-purple-600">{ktv.commissionRate}%</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleRoleSwitch('ktv', ktv)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Xem Giao Diện KTV
                      </button>
                      <button
                        onClick={() => {
                          setEditingKtv(ktv);
                          setIsKtvModalOpen(true);
                        }}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium hover:bg-blue-100 transition"
                      >
                        Chỉnh sửa
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 5: MATERIALS (ADMIN ONLY) ==================== */}
        {activeTab === 'materials' && isAdmin && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-slate-900">Quản Lý Kho Vật Tư & Linh Kiện</h2>
                <p className="text-xs text-slate-500">Theo dõi tồn kho gas, linh kiện tủ lạnh, máy giặt, ống đồng</p>
              </div>
              <button
                onClick={() => {
                  setEditingMaterial(null);
                  setIsMaterialModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Vật Tư</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="p-3">Tên Vật Tư / Linh Kiện</th>
                    <th className="p-3">Số Lượng Tồn</th>
                    <th className="p-3">Giá Nhập</th>
                    <th className="p-3">Giá Bán</th>
                    <th className="p-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {materials.map(mat => (
                    <tr key={mat.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-800">{mat.name}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold ${mat.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-800'}`}>
                          {mat.stock} {mat.unit}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{mat.importPrice.toLocaleString()} VNĐ</td>
                      <td className="p-3 text-emerald-700 font-semibold">{mat.sellPrice.toLocaleString()} VNĐ</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setEditingMaterial(mat);
                            setIsMaterialModalOpen(true);
                          }}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Sửa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 6: CUSTOMERS (ADMIN ONLY) ==================== */}
        {activeTab === 'customers' && isAdmin && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <h2 className="text-base font-bold text-slate-900">Danh Sách Khách Hàng & Lịch Sử</h2>
              <p className="text-xs text-slate-500">Tra cứu nhanh số điện thoại để xem lại toàn bộ lịch sử sửa chữa</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customers.map(cust => {
                const pastOrders = orders.filter(o => o.customerPhone === cust.phone);

                return (
                  <div key={cust.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{cust.name}</h4>
                        <p className="text-xs text-blue-600 font-mono font-medium">SĐT: {cust.phone}</p>
                        <p className="text-xs text-slate-500 mt-1">{cust.address}</p>
                      </div>
                      <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {pastOrders.length} lần sửa
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-2 space-y-1">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase">Lịch sử thiết bị từng sửa:</p>
                      {pastOrders.map(p => (
                        <div key={p.id} className="text-xs bg-slate-50 p-2 rounded border border-slate-100 flex justify-between">
                          <span>{p.deviceBrand} ({STATUS_CONFIG[p.status].label})</span>
                          <span className="font-mono text-slate-500">{p.id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 7: WARRANTY ==================== */}
        {activeTab === 'warranty' && isAdmin && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <h2 className="text-base font-bold text-slate-900">Theo Dõi Sổ Bảo Hành</h2>
              <p className="text-xs text-slate-500">Danh sách các đơn hàng đã sửa và thời hạn bảo hành cam kết</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="p-3">Mã Đơn</th>
                    <th className="p-3">Khách Hàng</th>
                    <th className="p-3">Thiết Bị</th>
                    <th className="p-3">Thời Hạn BH</th>
                    <th className="p-3 text-right">Trạng Thái BH</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-blue-700">{o.id}</td>
                      <td className="p-3 font-medium text-slate-800">{o.customerName} ({o.customerPhone})</td>
                      <td className="p-3 text-slate-600">{o.deviceBrand}</td>
                      <td className="p-3 font-bold text-slate-800">{o.warrantyMonths || 6} Tháng</td>
                      <td className="p-3 text-right">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Còn Hiệu Lực
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 8: APPOINTMENTS ==================== */}
        {activeTab === 'appointments' && isAdmin && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-slate-900">Quản Lý Lịch Hẹn Khách Hàng</h2>
                <p className="text-xs text-slate-500">Lịch hẹn khách gọi đặt trước theo ngày giờ</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map(apt => (
                <div key={apt.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{apt.customerName}</h4>
                      <p className="text-xs text-slate-500">SĐT: {apt.phone} | Địa chỉ: {apt.address}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      {new Date(apt.time).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded"><b>Nội dung:</b> {apt.issue}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 9: BACKUP & REPORTS ==================== */}
        {activeTab === 'backup' && isAdmin && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">Sao Lưu & Dữ Liệu Hệ Thống</h2>
              <p className="text-xs text-slate-500">Xuất file báo cáo dạng CSV Excel hoặc tải bản Sao lưu JSON dự phòng toàn bộ dữ liệu</p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={handleExportCSV}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-sm"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Xuất File CSV (Excel)
                </button>

                <button
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ orders, ktvs, materials, customers, expenses }));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `QUANG_THANG_FULL_BACKUP_${new Date().toISOString().slice(0, 10)}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                    showToast('Đã tải file Backup dữ liệu JSON!');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" /> Tải Bản Sao Lưu JSON
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==================== MODALS SECTION ==================== */}

      {/* CREATE / EDIT ORDER MODAL */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingOrder ? `Chỉnh Sửa Đơn ${editingOrder.id}` : 'Tạo Đơn Hàng Mới'}
              </h3>
              <button onClick={() => setIsOrderModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleCreateOrUpdateOrder({
                  customerName: formData.get('customerName'),
                  customerPhone: formData.get('customerPhone'),
                  customerAddress: formData.get('customerAddress'),
                  deviceType: formData.get('deviceType'),
                  deviceBrand: formData.get('deviceBrand'),
                  issue: formData.get('issue'),
                  notes: formData.get('notes'),
                  ktvId: formData.get('ktvId'),
                  status: formData.get('status') || 'DonMoi',
                  laborFee: Number(formData.get('laborFee') || 0),
                  materialFee: Number(formData.get('materialFee') || 0),
                  paidAmount: Number(formData.get('paidAmount') || 0),
                  warrantyMonths: Number(formData.get('warrantyMonths') || 6)
                });
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tên Khách Hàng</label>
                  <input required name="customerName" defaultValue={editingOrder?.customerName} className="w-full p-2 border border-slate-300 rounded-lg" placeholder="Nguyễn Văn A" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số Điện Thoại</label>
                  <input required name="customerPhone" defaultValue={editingOrder?.customerPhone} className="w-full p-2 border border-slate-300 rounded-lg" placeholder="0912345678" />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Địa Chỉ Chi Tiết</label>
                <input required name="customerAddress" defaultValue={editingOrder?.customerAddress} className="w-full p-2 border border-slate-300 rounded-lg" placeholder="123 Đường XYZ, Quận..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Loại Thiết Bị</label>
                  <select name="deviceType" defaultValue={editingOrder?.deviceType || 'MayLanh'} className="w-full p-2 border border-slate-300 rounded-lg">
                    <option value="MayLanh">❄️ Máy lạnh</option>
                    <option value="TuLanh">🧊 Tủ lạnh</option>
                    <option value="MayGiat">🧺 Máy giặt</option>
                    <option value="TuMat">🥤 Tủ mát</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hãng & Model Thiết Bị</label>
                  <input required name="deviceBrand" defaultValue={editingOrder?.deviceBrand} className="w-full p-2 border border-slate-300 rounded-lg" placeholder="Daikin 1.5HP / Toshiba..." />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nội Dung Hư Hỏng / Yêu Cầu Sửa</label>
                <textarea required name="issue" defaultValue={editingOrder?.issue} rows={2} className="w-full p-2 border border-slate-300 rounded-lg" placeholder="Không lạnh, xì gas, báo lỗi..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Giao Cho KTV Phụ Trách</label>
                  <select name="ktvId" defaultValue={editingOrder?.ktvId || ''} className="w-full p-2 border border-slate-300 rounded-lg">
                    <option value="">-- Chọn KTV --</option>
                    {ktvs.map(k => (
                      <option key={k.id} value={k.id}>{k.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Trạng Thái Đơn</label>
                  <select name="status" defaultValue={editingOrder?.status || 'DonMoi'} className="w-full p-2 border border-slate-300 rounded-lg">
                    <option value="DonMoi">Đơn mới</option>
                    <option value="DaNhan">Đã nhận</option>
                    <option value="DangLam">Đang làm</option>
                    <option value="HoanThanh">Hoàn thành</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tiền Công (VNĐ)</label>
                  <input type="number" name="laborFee" defaultValue={editingOrder?.laborFee || 0} className="w-full p-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tiền Vật Tư (VNĐ)</label>
                  <input type="number" name="materialFee" defaultValue={editingOrder?.materialFee || 0} className="w-full p-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Đã Thu (VNĐ)</label>
                  <input type="number" name="paidAmount" defaultValue={editingOrder?.paidAmount || 0} className="w-full p-2 border border-slate-300 rounded-lg" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsOrderModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg font-medium">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Lưu Đơn Hàng</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COLLECT DEBT MODAL */}
      {isPayDebtModalOpen && selectedDebtOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Thu Tiền Nợ Của Khách Hàng</h3>
            <p className="text-xs text-slate-600">Đơn hàng: <b>{selectedDebtOrder.id}</b> - Khách: <b>{selectedDebtOrder.customerName}</b></p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const addPay = Number(new FormData(e.target).get('additionalPayment'));
                setOrders(prev =>
                  prev.map(o => {
                    if (o.id === selectedDebtOrder.id) {
                      return { ...o, paidAmount: (o.paidAmount || 0) + addPay };
                    }
                    return o;
                  })
                );
                showToast('Đã cập nhật số tiền thu nợ thành công!');
                setIsPayDebtModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nhập Số Tiền Thu Thêm (VNĐ)</label>
                <input type="number" name="additionalPayment" required defaultValue={100000} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-bold text-emerald-600" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsPayDebtModalOpen(false)} className="px-4 py-2 border rounded-lg">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold">Xác Nhận Thu Tiền</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Đổi Mật Khẩu Tải Khoản</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast('Đổi mật khẩu thành công!');
                setIsPasswordModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mật khẩu hiện tại</label>
                <input type="password" required className="w-full p-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mật khẩu mới</label>
                <input type="password" required className="w-full p-2 border border-slate-300 rounded-lg" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-3 py-1.5 border rounded">Hủy</button>
                <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded font-bold">Cập Nhật</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4 text-center text-xs text-slate-500">
        <p>© 2026 <b>QUANG THẮNG SERVICE</b> - Tối ưu vận hành Sửa Chữa Máy Lạnh, Tủ Lạnh, Máy Giặt, Tủ Mát.</p>
      </footer>
    </div>
  );
}