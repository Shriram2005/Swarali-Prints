'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Package,
  FileText,
  ShoppingBag,
  Settings,
  Tag,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Eye,
  MessageCircle,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
  Truck,
  Phone,
  MapPin,
  RefreshCw,
  Download,
  Trash2,
  Edit2,
  Check,
  X,
  Shield,
  ChevronRight,
  BarChart3,
  AlertCircle,
  ArrowUpRight,
  Copy,
  ExternalLink,
  Calendar,
  User,
  DollarSign,
  Store,
  Layers,
  ChevronDown,
} from 'lucide-react';
import SwaraliLogo from '@/components/SwaraliLogo';
import PrintInvoice from '@/components/PrintInvoice';
import {
  Order,
  OrderStatus,
  PaymentStatus,
  QuoteRequest,
  StoreSettings,
  ProofItem,
  ProductItem,
  Coupon,
  CartItem,
} from '@/lib/types';
import {
  getAllOrders,
  saveOrder,
  deleteOrder,
  updateOrderStatus,
  updateOrderPaymentStatus,
  updateOrderTracking,
  addOrderProof,
  getAllQuoteRequests,
  saveQuoteRequest,
  updateQuoteStatus,
  deleteQuoteRequest,
  convertQuoteToOrder,
  getStoredProducts,
  saveProduct,
  deleteProduct,
  getStoredCoupons,
  saveCoupon,
  deleteCoupon,
  toggleCouponStatus,
  getStoreSettings,
  saveStoreSettings,
  resetToSampleData,
} from '@/lib/storage';
import {
  buildWhatsAppStatusNotification,
  buildWhatsAppDispatchNotification,
  buildWhatsAppProofReadyNotification,
  buildWhatsAppQuoteResponseNotification,
} from '@/lib/whatsapp';

export default function AdminPage() {
  // Navigation & Active View
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'proofs' | 'quotes' | 'products' | 'coupons' | 'settings'
  >('overview');

  // Core Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(getStoreSettings());

  // Global Time & Notification
  const [currentTime, setCurrentTime] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filters for Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>('all');
  const [orderSortBy, setOrderSortBy] = useState<'newest' | 'oldest' | 'highest_amount'>('newest');

  // Modals & Drawers States
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [activeOrderDrawer, setActiveOrderDrawer] = useState<Order | null>(null);
  const [proofModalOrder, setProofModalOrder] = useState<Order | null>(null);
  const [proofUrlInput, setProofUrlInput] = useState('');
  const [proofNoteInput, setProofNoteInput] = useState('');

  // Counter Walk-in Order Modal State
  const [showCounterOrderModal, setShowCounterOrderModal] = useState(false);
  const [counterCustomerName, setCounterCustomerName] = useState('');
  const [counterCustomerPhone, setCounterCustomerPhone] = useState('');
  const [counterServiceType, setCounterServiceType] = useState('document-printing');
  const [counterSpecs, setCounterSpecs] = useState('');
  const [counterQuantity, setCounterQuantity] = useState(1);
  const [counterAmount, setCounterAmount] = useState(100);
  const [counterPaymentMethod, setCounterPaymentMethod] = useState<'cash_on_pickup' | 'upi_qr' | 'card_online'>('cash_on_pickup');
  const [counterPaymentStatus, setCounterPaymentStatus] = useState<PaymentStatus>('paid');

  // Quote Action Modal State
  const [selectedQuoteForResponse, setSelectedQuoteForResponse] = useState<QuoteRequest | null>(null);
  const [quotePriceInput, setQuotePriceInput] = useState<number>(0);
  const [quoteNotesInput, setQuoteNotesInput] = useState<string>('');
  const [quoteStatusInput, setQuoteStatusInput] = useState<QuoteRequest['status']>('quoted');

  // Product Add/Edit Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<ProductItem>>({
    name: '',
    category: 'visiting-cards',
    basePrice: 199,
    salePrice: 199,
    stockStatus: 'in_stock',
    turnaroundTime: '24 Hours',
    shortDescription: '',
    images: ['/images/product-matte-visiting-cards.jpg'],
  });

  // Coupon Add Modal State
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 200,
    expiresAt: '2026-12-31',
    active: true,
    description: '',
  });

  // Tracking Update Form inside Drawer
  const [trackingCarrierInput, setTrackingCarrierInput] = useState('');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [trackingUrlInput, setTrackingUrlInput] = useState('');
  const [estimatedDeliveryInput, setEstimatedDeliveryInput] = useState('');
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [statusNoteInput, setStatusNoteInput] = useState('');

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Live Refresh Data
  const refreshData = () => {
    setOrders(getAllOrders());
    setQuotes(getAllQuoteRequests());
    setProducts(getStoredProducts());
    setCoupons(getStoredCoupons());
    setSettings(getStoreSettings());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    }, 1000);

    const onOrders = () => setOrders(getAllOrders());
    const onQuotes = () => setQuotes(getAllQuoteRequests());
    const onProducts = () => setProducts(getStoredProducts());
    const onCoupons = () => setCoupons(getStoredCoupons());

    window.addEventListener('orders_updated', onOrders);
    window.addEventListener('quotes_updated', onQuotes);
    window.addEventListener('products_updated', onProducts);
    window.addEventListener('coupons_updated', onCoupons);

    return () => {
      clearInterval(interval);
      window.removeEventListener('orders_updated', onOrders);
      window.removeEventListener('quotes_updated', onQuotes);
      window.removeEventListener('products_updated', onProducts);
      window.removeEventListener('coupons_updated', onCoupons);
    };
  }, []);

  // Sync drawer inputs when active order changes
  useEffect(() => {
    if (activeOrderDrawer) {
      setTrackingCarrierInput(activeOrderDrawer.trackingCarrier || 'Store Pickup Counter');
      setTrackingNumberInput(activeOrderDrawer.trackingNumber || '');
      setTrackingUrlInput(activeOrderDrawer.trackingUrl || '');
      setEstimatedDeliveryInput(activeOrderDrawer.estimatedDelivery || '');
      setAdminNoteInput(activeOrderDrawer.adminNotes || '');
      setStatusNoteInput('');
    }
  }, [activeOrderDrawer]);

  // All 11 Valid Operational Statuses
  const allStatuses: { key: OrderStatus; label: string; badgeClass: string }[] = [
    { key: 'order_placed', label: 'Order Placed', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' },
    { key: 'payment_confirmed', label: 'Payment Confirmed', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { key: 'file_verification', label: 'File Verification', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200' },
    { key: 'proof_design', label: 'Proof Design', badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { key: 'customer_approval', label: 'Customer Approval', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' },
    { key: 'printing', label: 'Printing Press', badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
    { key: 'quality_check', label: 'Quality Check', badgeClass: 'bg-teal-100 text-teal-800 border-teal-200' },
    { key: 'ready', label: 'Ready for Pickup', badgeClass: 'bg-lime-100 text-lime-800 border-lime-200' },
    { key: 'out_for_delivery', label: 'Out for Delivery', badgeClass: 'bg-sky-100 text-sky-800 border-sky-200' },
    { key: 'completed', label: 'Delivered / Completed', badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    { key: 'cancelled', label: 'Cancelled / Refunded', badgeClass: 'bg-rose-100 text-rose-800 border-rose-200' },
  ];

  // Executive KPI Calculations
  const metrics = useMemo(() => {
    const totalOrdersCount = orders.length;
    const grossRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const paidRevenue = orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const pendingPaymentOrders = orders.filter((o) => o.paymentStatus !== 'paid');
    const inProductionCount = orders.filter((o) =>
      ['file_verification', 'proof_design', 'printing', 'quality_check'].includes(o.status)
    ).length;
    const proofPendingCount = orders.filter((o) => {
      if (o.status === 'customer_approval') return true;
      if (o.proofs && o.proofs.length > 0) {
        const latest = o.proofs[o.proofs.length - 1];
        return latest.status === 'pending' || latest.status === 'changes_requested';
      }
      return false;
    }).length;
    const readyOrDispatchedCount = orders.filter((o) =>
      ['ready', 'out_for_delivery'].includes(o.status)
    ).length;
    const openQuotesCount = quotes.filter((q) => q.status === 'new' || q.status === 'pending').length;

    return {
      totalOrdersCount,
      grossRevenue,
      paidRevenue,
      pendingPaymentOrdersCount: pendingPaymentOrders.length,
      inProductionCount,
      proofPendingCount,
      readyOrDispatchedCount,
      openQuotesCount,
    };
  }, [orders, quotes]);

  // Filtered & Sorted Orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
        const matchesPayment = paymentFilter === 'all' || o.paymentStatus === paymentFilter;
        const matchesFulfillment = fulfillmentFilter === 'all' || o.fulfillmentMethod === fulfillmentFilter;
        const q = orderSearch.toLowerCase().trim();
        const matchesSearch =
          !q ||
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          (o.customerEmail && o.customerEmail.toLowerCase().includes(q)) ||
          o.items.some((i) => i.title.toLowerCase().includes(q));
        return matchesStatus && matchesPayment && matchesFulfillment && matchesSearch;
      })
      .sort((a, b) => {
        if (orderSortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (orderSortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (orderSortBy === 'highest_amount') {
          return b.totalAmount - a.totalAmount;
        }
        return 0;
      });
  }, [orders, statusFilter, paymentFilter, fulfillmentFilter, orderSearch, orderSortBy]);

  // Order Handlers
  const handleQuickStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus, `Status updated to ${newStatus.replace(/_/g, ' ')} by Admin Console`);
    refreshData();
    if (activeOrderDrawer && activeOrderDrawer.id === orderId) {
      setActiveOrderDrawer(getAllOrders().find((o) => o.id === orderId) || null);
    }
    showToast(`Order ${orderId} status updated to ${newStatus.replace(/_/g, ' ')}`);
  };

  const handleUpdateStatusWithNote = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus, statusNoteInput.trim() || `Status updated to ${newStatus.replace(/_/g, ' ')}`);
    setStatusNoteInput('');
    refreshData();
    if (activeOrderDrawer && activeOrderDrawer.id === orderId) {
      setActiveOrderDrawer(getAllOrders().find((o) => o.id === orderId) || null);
    }
    showToast(`Order ${orderId} updated with activity log entry`);
  };

  const handleUpdatePaymentStatus = (orderId: string, paymentStatus: PaymentStatus, ref?: string) => {
    updateOrderPaymentStatus(orderId, paymentStatus, ref);
    refreshData();
    if (activeOrderDrawer && activeOrderDrawer.id === orderId) {
      setActiveOrderDrawer(getAllOrders().find((o) => o.id === orderId) || null);
    }
    showToast(`Order ${orderId} payment marked as ${paymentStatus.toUpperCase()}`);
  };

  const handleSaveTrackingAndDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrderDrawer) return;

    updateOrderTracking(activeOrderDrawer.id, {
      trackingCarrier: trackingCarrierInput.trim(),
      trackingNumber: trackingNumberInput.trim(),
      trackingUrl: trackingUrlInput.trim(),
      estimatedDelivery: estimatedDeliveryInput.trim(),
      adminNotes: adminNoteInput.trim(),
    });

    refreshData();
    setActiveOrderDrawer(getAllOrders().find((o) => o.id === activeOrderDrawer.id) || null);
    showToast(`Tracking & dispatch info saved for ${activeOrderDrawer.id}`);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm(`Are you sure you want to permanently delete order ${orderId}? This cannot be undone.`)) {
      deleteOrder(orderId);
      if (activeOrderDrawer?.id === orderId) setActiveOrderDrawer(null);
      refreshData();
      showToast(`Order ${orderId} removed from database`);
    }
  };

  // Proof Upload Handler
  const handleUploadProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofModalOrder || !proofUrlInput.trim()) return;

    addOrderProof(
      proofModalOrder.id,
      proofUrlInput.trim(),
      proofNoteInput.trim() || 'Sample digital layout prepared for your approval. Please verify text, phone numbers, and dimensions.'
    );

    setProofModalOrder(null);
    setProofUrlInput('');
    setProofNoteInput('');
    refreshData();
    if (activeOrderDrawer && activeOrderDrawer.id === proofModalOrder.id) {
      setActiveOrderDrawer(getAllOrders().find((o) => o.id === proofModalOrder.id) || null);
    }
    showToast(`Proof revision published for order ${proofModalOrder.id}`);
  };

  // Walk-in Counter Order Creation
  const handleCreateCounterOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterCustomerName.trim() || !counterCustomerPhone.trim()) {
      alert('Please enter customer name and phone number');
      return;
    }

    const orderId = `SP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerName: counterCustomerName.trim(),
      customerPhone: counterCustomerPhone.trim(),
      customerEmail: `${counterCustomerPhone.replace(/[^0-9]/g, '')}@counter.swaraliprints.local`,
      fulfillmentMethod: 'store_pickup',
      fulfillmentCost: 0,
      items: [
        {
          id: `walkin-${Date.now()}`,
          type: 'custom_printing',
          title: `Counter Print Job: ${counterServiceType.replace(/_/g, ' ').toUpperCase()}`,
          image: '/images/product-outdoor-flex-banner.jpg',
          quantity: counterQuantity,
          unitPrice: Math.round(counterAmount / counterQuantity),
          totalPrice: counterAmount,
          instructions: counterSpecs.trim() || 'Direct walk-in customer counter job at Trimurti Chowk.',
        },
      ],
      subtotal: counterAmount,
      discount: 0,
      totalAmount: counterAmount,
      paymentMethod: counterPaymentMethod,
      paymentStatus: counterPaymentStatus,
      status: 'printing',
      statusHistory: [
        {
          status: 'order_placed',
          timestamp: new Date().toISOString(),
          note: 'Walk-in order created at shop counter',
        },
        {
          status: 'printing',
          timestamp: new Date().toISOString(),
          note: 'Sent directly to printing counter queue',
        },
      ],
      history: [
        {
          status: 'order_placed',
          timestamp: new Date().toISOString(),
          note: 'Walk-in order created at shop counter',
        },
      ],
      proofs: [],
      adminNotes: 'Walk-in counter order handled directly by staff.',
    };

    saveOrder(newOrder);
    setShowCounterOrderModal(false);
    setCounterCustomerName('');
    setCounterCustomerPhone('');
    setCounterSpecs('');
    setCounterAmount(100);
    refreshData();
    showToast(`Counter order ${orderId} created successfully!`);
    setSelectedOrderForInvoice(newOrder);
  };

  // Bulk Quote Handler
  const handleSaveQuoteResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuoteForResponse) return;

    updateQuoteStatus(
      selectedQuoteForResponse.id,
      quoteStatusInput,
      quotePriceInput > 0 ? quotePriceInput : undefined,
      quoteNotesInput.trim()
    );

    setSelectedQuoteForResponse(null);
    refreshData();
    showToast(`Quote #${selectedQuoteForResponse.id} status updated to ${quoteStatusInput.toUpperCase()}`);
  };

  const handleConvertQuoteToOrder = (quoteId: string) => {
    if (confirm(`Convert bulk inquiry #${quoteId} into an active production Order?`)) {
      const created = convertQuoteToOrder(quoteId);
      refreshData();
      if (created) {
        showToast(`Inquiry #${quoteId} converted to active Order ${created.id}!`);
        setSelectedOrderForInvoice(created);
      }
    }
  };

  // Product CRUD Handlers
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name?.trim()) return;

    const prodId = editingProductId || `prod-${Date.now()}`;
    const slug = productForm.slug || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const fullProduct: ProductItem = {
      id: prodId,
      slug,
      name: productForm.name.trim(),
      category: (productForm.category as any) || 'visiting-cards',
      shortDescription: productForm.shortDescription || 'High quality printing from Swarali Prints.',
      description: productForm.description || productForm.shortDescription || 'Commercial grade print production.',
      images: productForm.images && productForm.images.length > 0 ? productForm.images : ['/images/product-matte-visiting-cards.jpg'],
      basePrice: Number(productForm.basePrice) || 100,
      salePrice: productForm.salePrice ? Number(productForm.salePrice) : undefined,
      stockStatus: (productForm.stockStatus as any) || 'in_stock',
      featured: Boolean(productForm.featured),
      rating: 4.9,
      reviewCount: 38,
      turnaroundTime: productForm.turnaroundTime || '24 Hours',
      minQuantity: productForm.minQuantity || 1,
      specifications: [
        { label: 'Print Mode', value: 'High Definition CMYK' },
        { label: 'Origin', value: 'Trimurti Chowk Cidco Nashik' },
      ],
      seo: {
        metaTitle: `${productForm.name} | Swarali Prints Nashik`,
        metaDescription: `Order ${productForm.name} in Cidco, Nashik at lowest wholesale rates.`,
        keywords: [productForm.name.toLowerCase(), 'printing nashik', 'cidco'],
      },
    };

    saveProduct(fullProduct);
    setShowProductModal(false);
    setEditingProductId(null);
    refreshData();
    showToast(`Product "${fullProduct.name}" saved to catalog`);
  };

  // Coupon CRUD Handlers
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code?.trim()) return;

    const newCoupon: Coupon = {
      code: couponForm.code.trim().toUpperCase(),
      discountType: couponForm.discountType || 'percentage',
      discountValue: Number(couponForm.discountValue) || 10,
      minOrderValue: Number(couponForm.minOrderValue) || 200,
      expiresAt: couponForm.expiresAt || '2026-12-31',
      active: couponForm.active ?? true,
      description: couponForm.description?.trim() || `${couponForm.discountValue}% OFF on printing`,
    };

    saveCoupon(newCoupon);
    setShowCouponModal(false);
    refreshData();
    showToast(`Coupon ${newCoupon.code} created & activated`);
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoreSettings(settings);
    showToast('Store settings & NAP successfully updated!');
  };

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Phone',
      'Total Amount (INR)',
      'Payment Status',
      'Payment Method',
      'Order Status',
      'Fulfillment',
      'Tracking Carrier',
      'AWB Consignment No',
      'Items Count',
    ];

    const rows = orders.map((o) => [
      `"${o.id}"`,
      `"${new Date(o.createdAt).toLocaleDateString('en-IN')}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerPhone}"`,
      o.totalAmount,
      `"${o.paymentStatus}"`,
      `"${o.paymentMethod}"`,
      `"${o.status}"`,
      `"${o.fulfillmentMethod}"`,
      `"${o.trackingCarrier || ''}"`,
      `"${o.trackingNumber || ''}"`,
      o.items.length,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `swarali_prints_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported orders CSV report');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-100 font-sans antialiased">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white border border-slate-700/80 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white text-xs ml-2">
            ✕
          </button>
        </div>
      )}

      {/* ─── CORPORATE FIXED SIDEBAR (LEFT) ─── */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between shrink-0 hidden lg:flex select-none">
        <div>
          {/* Corporate Brand Header */}
          <div className="p-6 border-b border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-600 flex items-center justify-center font-black text-white text-sm shadow-md">
                SP
              </div>
              <div>
                <div className="font-extrabold text-sm tracking-tight text-white uppercase flex items-center gap-1.5">
                  <span>SWARALI PRINTS</span>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
                  Enterprise Operations
                </span>
              </div>
            </div>

            {/* Shop Live Counter Indicator */}
            <div className="pt-2">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Shop Counter Live</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Cidco</span>
              </div>
            </div>
          </div>

          {/* Sidebar Nav Items */}
          <nav className="p-4 space-y-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>Executive Overview</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'overview' ? 'text-white' : 'text-slate-600'}`} />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'orders'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>Orders & Production</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('proofs')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'proofs'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4" />
                <span>Proof Approvals</span>
              </div>
              {metrics.proofPendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                  {metrics.proofPendingCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('quotes')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'quotes'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Bulk RFQ Inquiries</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'quotes' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {quotes.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'products'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" />
                <span>Product Catalog</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'products' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {products.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'coupons'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4" />
                <span>Promo Coupons</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'coupons' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {coupons.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>Store Settings & NAP</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'settings' ? 'text-white' : 'text-slate-600'}`} />
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Info & Live Store Link */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                OP
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">Counter Operator</div>
                <div className="text-[10px] text-slate-400">Trimurti Chowk Shop</div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-800 transition"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Live Store</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </Link>

            <button
              type="button"
              onClick={() => {
                if (confirm('Reset store database to default sample catalog and demo orders?')) {
                  resetToSampleData();
                  refreshData();
                  showToast('Database reset to sample state');
                }
              }}
              title="Reset Sample Data"
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT VIEWPORT (RIGHT) ─── */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-100 text-slate-900 overflow-y-auto">
        {/* Top Corporate Application Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
          <div className="px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
            {/* Mobile Nav Tabs Hamburger or Category selector */}
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800"
                >
                  <option value="overview">Executive Overview</option>
                  <option value="orders">Orders ({orders.length})</option>
                  <option value="proofs">Proofs ({metrics.proofPendingCount})</option>
                  <option value="quotes">RFQs ({quotes.length})</option>
                  <option value="products">Products ({products.length})</option>
                  <option value="coupons">Coupons ({coupons.length})</option>
                  <option value="settings">Store Settings</option>
                </select>
              </div>

              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight capitalize">
                  {activeTab === 'overview' && 'Executive Operations Dashboard'}
                  {activeTab === 'orders' && 'Printing Jobs & Fulfillment Pipeline'}
                  {activeTab === 'proofs' && 'Digital Proofing & Approval Queue'}
                  {activeTab === 'quotes' && 'Bulk RFQs & B2B Inquiry Quotes'}
                  {activeTab === 'products' && 'Commercial Product Catalog Management'}
                  {activeTab === 'coupons' && 'Promotional Vouchers & Discounts'}
                  {activeTab === 'settings' && 'Store Profile & NAP Configuration'}
                </h1>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Swarali Prints Cidco • Real-Time Order Management System
                </p>
              </div>
            </div>

            {/* Quick Actions & Live Clock */}
            <div className="flex items-center gap-2 sm:gap-3">
              {currentTime && (
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-mono font-semibold">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{currentTime}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowCounterOrderModal(true)}
                className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">+ Walk-in Order</span>
                <span className="sm:hidden">+ Order</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                title="Export Orders CSV"
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
              >
                <Download className="w-4 h-4 text-slate-600" />
              </button>

              <button
                type="button"
                onClick={refreshData}
                title="Refresh All Data"
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
              >
                <RefreshCw className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </header>

        {/* ─── TAB 1: EXECUTIVE OVERVIEW ─── */}
        {activeTab === 'overview' && (
          <main className="p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
            {/* Top 5 KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Gross Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  ₹{metrics.grossRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>₹{metrics.paidRevenue.toLocaleString()} collected</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Total Orders</span>
                  <Package className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {metrics.totalOrdersCount}
                </div>
                <div className="text-[11px] text-slate-500">
                  <span>{orders.filter((o) => o.status === 'completed').length} completed</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>In Production</span>
                  <Layers className="w-4 h-4 text-cyan-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono text-cyan-700">
                  {metrics.inProductionCount}
                </div>
                <div className="text-[11px] text-cyan-700">
                  <span>Printing & QC queue</span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('proofs')}
                className="bg-white p-5 rounded-3xl border border-amber-200 hover:border-amber-400 cursor-pointer shadow-xs space-y-2 transition"
              >
                <div className="flex items-center justify-between text-amber-700 text-xs font-bold uppercase tracking-wider">
                  <span>Proof Approvals</span>
                  <Eye className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-amber-600 font-mono">
                  {metrics.proofPendingCount}
                </div>
                <div className="text-[11px] text-amber-700 font-medium">
                  {metrics.proofPendingCount > 0 ? 'Requires action →' : 'All proofs approved'}
                </div>
              </div>

              <div
                onClick={() => setActiveTab('quotes')}
                className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-indigo-400 cursor-pointer shadow-xs space-y-2 transition"
              >
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Open RFQ Quotes</span>
                  <FileText className="w-4 h-4 text-pink-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {metrics.openQuotesCount}
                </div>
                <div className="text-[11px] text-pink-700 font-medium">
                  <span>Bulk customer leads →</span>
                </div>
              </div>
            </div>

            {/* Urgent Attention Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Recent Orders Needing Action (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Active Printing Pipeline</h2>
                      <p className="text-xs text-slate-500">Real-time status across commercial print jobs</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <span>View All ({orders.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    {orders.slice(0, 5).map((ord) => {
                      const statusDef = allStatuses.find((s) => s.key === ord.status);
                      return (
                        <div key={ord.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                onClick={() => setActiveOrderDrawer(ord)}
                                className="font-mono font-bold text-indigo-600 hover:underline cursor-pointer"
                              >
                                {ord.id}
                              </span>
                              <span className="font-bold text-slate-900">{ord.customerName}</span>
                              <span className="text-slate-400 font-mono text-[11px]">{ord.customerPhone}</span>
                            </div>

                            <div className="text-slate-500 text-[11px]">
                              {ord.items.map((i) => i.title).join(' • ')}
                            </div>

                            <div className="flex items-center gap-2 pt-0.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusDef?.badgeClass}`}>
                                {ord.status.replace(/_/g, ' ')}
                              </span>
                              <span className="text-slate-400 font-mono text-[10px]">
                                {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-mono font-bold text-slate-900 text-sm">
                                ₹{ord.totalAmount.toLocaleString()}
                              </div>
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                  ord.paymentStatus === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {ord.paymentStatus}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setActiveOrderDrawer(ord)}
                              className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs"
                            >
                              Manage
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Attention Needed & Quick Tools (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Proofs Awaiting Attention */}
                <div className="bg-white rounded-3xl border border-amber-200 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Proofing Actions Required</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      {metrics.proofPendingCount} Pending
                    </span>
                  </div>

                  {metrics.proofPendingCount === 0 ? (
                    <p className="text-xs text-slate-500 py-2">
                      All active orders have approved proofs or no design proofs pending.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {orders
                        .filter(
                          (o) =>
                            o.status === 'customer_approval' ||
                            (o.proofs && o.proofs.some((p) => p.status === 'changes_requested'))
                        )
                        .slice(0, 3)
                        .map((ord) => {
                          const latestProof = ord.proofs && ord.proofs.length > 0 ? ord.proofs[ord.proofs.length - 1] : null;
                          return (
                            <div key={ord.id} className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-indigo-700">{ord.id}</span>
                                <span className="font-semibold text-slate-800">{ord.customerName}</span>
                              </div>
                              {latestProof?.customerComments && (
                                <p className="text-[11px] text-rose-700 font-medium italic">
                                  Customer remark: "{latestProof.customerComments}"
                                </p>
                              )}
                              <div className="pt-1 flex items-center justify-between">
                                <span className="text-[10px] text-amber-800 font-semibold">
                                  v{latestProof?.version || 1} • {latestProof?.status?.replace(/_/g, ' ') || 'Pending'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setActiveOrderDrawer(ord)}
                                  className="text-[11px] font-bold text-indigo-600 hover:underline"
                                >
                                  Upload Revision &rarr;
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* Quick Shop Counter Actions */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs text-xs">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Quick Counter Utilities
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCounterOrderModal(true)}
                      className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 text-indigo-900 font-bold flex flex-col items-center gap-1.5 transition text-center"
                    >
                      <Plus className="w-4 h-4 text-indigo-600" />
                      <span>New Counter Job</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 text-emerald-900 font-bold flex flex-col items-center gap-1.5 transition text-center"
                    >
                      <Download className="w-4 h-4 text-emerald-600" />
                      <span>Export All CSV</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ─── TAB 2: ORDERS & PRODUCTION PIPELINE ─── */}
        {activeTab === 'orders' && (
          <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-96">
                  <input
                    type="text"
                    placeholder="Search by order ID, customer, phone, item..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  {orderSearch && (
                    <button
                      onClick={() => setOrderSearch('')}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="all">All Statuses ({orders.length})</option>
                    {allStatuses.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label} ({orders.filter((o) => o.status === s.key).length})
                      </option>
                    ))}
                  </select>

                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="all">All Payments</option>
                    <option value="paid">Paid ({orders.filter((o) => o.paymentStatus === 'paid').length})</option>
                    <option value="pending">Pending ({orders.filter((o) => o.paymentStatus === 'pending').length})</option>
                    <option value="pay_on_pickup">Pay on Pickup</option>
                  </select>

                  <select
                    value={fulfillmentFilter}
                    onChange={(e) => setFulfillmentFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="all">All Fulfillment</option>
                    <option value="store_pickup">Store Pickup</option>
                    <option value="local_delivery_cidco">Cidco Delivery</option>
                    <option value="courier_nashik">Nashik Courier</option>
                  </select>

                  <select
                    value={orderSortBy}
                    onChange={(e) => setOrderSortBy(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest_amount">Highest Amount</option>
                  </select>
                </div>
              </div>

              {/* Status Quick Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-full font-bold transition ${
                    statusFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('customer_approval')}
                  className={`px-3 py-1 rounded-full font-bold transition ${
                    statusFilter === 'customer_approval'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  Proof Approval ({orders.filter((o) => o.status === 'customer_approval').length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('printing')}
                  className={`px-3 py-1 rounded-full font-bold transition ${
                    statusFilter === 'printing'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200'
                  }`}
                >
                  In Printing ({orders.filter((o) => o.status === 'printing').length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('ready')}
                  className={`px-3 py-1 rounded-full font-bold transition ${
                    statusFilter === 'ready'
                      ? 'bg-lime-600 text-white'
                      : 'bg-lime-50 text-lime-800 hover:bg-lime-100 border border-lime-200'
                  }`}
                >
                  Ready for Pickup ({orders.filter((o) => o.status === 'ready').length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('out_for_delivery')}
                  className={`px-3 py-1 rounded-full font-bold transition ${
                    statusFilter === 'out_for_delivery'
                      ? 'bg-sky-600 text-white'
                      : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
                  }`}
                >
                  Dispatched ({orders.filter((o) => o.status === 'out_for_delivery').length})
                </button>
              </div>
            </div>

            {/* Orders Corporate Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items & Specifications</th>
                      <th className="p-4">Amount & Payment</th>
                      <th className="p-4">Digital Proof</th>
                      <th className="p-4">10-Stage Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-slate-500">
                          <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <div className="font-bold text-slate-700">No orders found</div>
                          <p className="text-xs text-slate-400">Try adjusting your search query or filter tags.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const statusDef = allStatuses.find((s) => s.key === ord.status);
                        const hasProof = ord.proofs && ord.proofs.length > 0;
                        const latestProof = hasProof ? ord.proofs![ord.proofs!.length - 1] : null;

                        return (
                          <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                            {/* Order ID & Date */}
                            <td className="p-4 align-top whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setActiveOrderDrawer(ord)}
                                className="font-mono font-bold text-indigo-600 hover:underline block text-left"
                              >
                                {ord.id}
                              </button>
                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(ord.createdAt).toLocaleTimeString('en-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </td>

                            {/* Customer Profile */}
                            <td className="p-4 align-top">
                              <div className="font-bold text-slate-900">{ord.customerName}</div>
                              <div className="text-slate-500 font-mono text-[11px] flex items-center gap-1.5 mt-0.5">
                                <span>{ord.customerPhone}</span>
                                <a
                                  href={`tel:${ord.customerPhone}`}
                                  title="Call customer"
                                  className="text-slate-400 hover:text-slate-700"
                                >
                                  <Phone className="w-3 h-3" />
                                </a>
                              </div>
                              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 text-[10px] capitalize text-slate-600">
                                {ord.fulfillmentMethod.replace(/_/g, ' ')}
                              </span>
                            </td>

                            {/* Items & Specs */}
                            <td className="p-4 align-top max-w-xs">
                              <div className="space-y-1">
                                {ord.items.map((item) => (
                                  <div key={item.id} className="text-[11px]">
                                    <strong className="text-slate-800">{item.title}</strong>
                                    <span className="text-slate-400"> (x{item.quantity})</span>
                                    {item.customConfig && (
                                      <div className="text-[10px] text-slate-500 mt-0.5">
                                        {item.customConfig.serviceType === 'flex-printing' && (
                                          <span>{item.customConfig.widthFt}x{item.customConfig.heightFt}ft {item.customConfig.material}</span>
                                        )}
                                        {item.customConfig.serviceType === 'document-printing' && (
                                          <span>{item.customConfig.pageCount} pgs • {item.customConfig.binding}</span>
                                        )}
                                        {item.customConfig.uploadedFiles && item.customConfig.uploadedFiles.length > 0 && (
                                          <span className="text-indigo-600 font-semibold block">
                                            📎 {item.customConfig.uploadedFiles[0].name}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </td>

                            {/* Financials & Payment */}
                            <td className="p-4 align-top whitespace-nowrap">
                              <div className="font-mono font-black text-slate-900 text-sm">
                                ₹{ord.totalAmount.toLocaleString()}
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdatePaymentStatus(
                                    ord.id,
                                    ord.paymentStatus === 'paid' ? 'pending' : 'paid'
                                  )
                                }
                                title="Click to toggle payment status"
                                className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded mt-1 transition ${
                                  ord.paymentStatus === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                }`}
                              >
                                {ord.paymentStatus} ✎
                              </button>
                              <div className="text-[10px] text-slate-400 capitalize mt-0.5">
                                {ord.paymentMethod.replace(/_/g, ' ')}
                              </div>
                            </td>

                            {/* Digital Proof Cell */}
                            <td className="p-4 align-top">
                              {latestProof ? (
                                <div className="space-y-1">
                                  <span
                                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      latestProof.status === 'approved'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : latestProof.status === 'changes_requested'
                                        ? 'bg-rose-100 text-rose-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    v{latestProof.version}: {latestProof.status.replace(/_/g, ' ')}
                                  </span>

                                  {latestProof.customerComments && (
                                    <p className="text-[10px] text-rose-700 font-medium italic line-clamp-2 max-w-[160px]">
                                      "{latestProof.customerComments}"
                                    </p>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setProofModalOrder(ord);
                                      setProofUrlInput(latestProof.imageUrl);
                                    }}
                                    className="text-[11px] text-indigo-600 hover:underline block font-bold"
                                  >
                                    Upload New Revision
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProofModalOrder(ord);
                                    setProofUrlInput('https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&auto=format&fit=crop');
                                  }}
                                  className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-[10px] transition"
                                >
                                  + Upload Proof
                                </button>
                              )}
                            </td>

                            {/* 10-Stage Dropdown */}
                            <td className="p-4 align-top">
                              <select
                                value={ord.status}
                                onChange={(e) => handleQuickStatusChange(ord.id, e.target.value as OrderStatus)}
                                className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-[11px] font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              >
                                {allStatuses.map((st) => (
                                  <option key={st.key} value={st.key}>
                                    {st.label}
                                  </option>
                                ))}
                              </select>

                              {ord.trackingNumber && (
                                <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                                  <Truck className="w-3 h-3 text-indigo-600" />
                                  <span>{ord.trackingCarrier}: {ord.trackingNumber}</span>
                                </div>
                              )}
                            </td>

                            {/* Actions Buttons */}
                            <td className="p-4 align-top text-right space-x-1.5 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setActiveOrderDrawer(ord)}
                                title="Manage Order Details"
                                className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedOrderForInvoice(ord)}
                                title="Print GST Invoice"
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>

                              <a
                                href={buildWhatsAppStatusNotification(
                                  ord.customerPhone,
                                  ord.id,
                                  ord.status,
                                  ord.customerName
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Send WhatsApp Status Alert"
                                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 inline-block transition"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>

                              <button
                                type="button"
                                onClick={() => handleDeleteOrder(ord.id)}
                                title="Delete Order"
                                className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* ─── TAB 3: PROOF APPROVAL STUDIO ─── */}
        {activeTab === 'proofs' && (
          <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Digital Proofing Studio</h2>
                  <p className="text-xs text-slate-500">
                    Review customer feedback, prepare sample drafts, and publish proofs for customer confirmation.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs">
                  {orders.filter((o) => o.proofs && o.proofs.length > 0).length} Orders with Proofs
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {orders
                  .filter((o) => o.proofs && o.proofs.length > 0)
                  .map((ord) => {
                    const latest = ord.proofs![ord.proofs!.length - 1];
                    return (
                      <div
                        key={ord.id}
                        className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-indigo-300 transition space-y-3 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-indigo-600 text-xs">{ord.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              latest.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : latest.status === 'changes_requested'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            v{latest.version}: {latest.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                          <img
                            src={latest.imageUrl}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <a
                            href={latest.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[10px] font-bold backdrop-blur"
                          >
                            Preview Full ↗
                          </a>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="font-bold text-slate-900">{ord.customerName}</div>
                          <div className="text-slate-500 font-mono text-[11px]">{ord.customerPhone}</div>
                          {latest.customerComments && (
                            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-medium">
                              <strong>Client requested:</strong> "{latest.customerComments}"
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setProofModalOrder(ord);
                              setProofUrlInput(latest.imageUrl);
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition text-center"
                          >
                            Upload Revision
                          </button>

                          <a
                            href={buildWhatsAppProofReadyNotification(
                              ord.customerPhone,
                              ord.id,
                              ord.customerName,
                              latest.version
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                            title="Send Proof Alert on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </main>
        )}

        {/* ─── TAB 4: BULK RFQ QUOTES ─── */}
        {activeTab === 'quotes' && (
          <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Commercial & Bulk RFQ Inquiries</h2>
                  <p className="text-xs text-slate-500">Inquiries submitted by organizations, schools, and local shops.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                  {quotes.length} Inquiries Received
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {quotes.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">No quotation requests recorded yet.</div>
                ) : (
                  quotes.map((q) => (
                    <div key={q.id} className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition">
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-600">{q.id}</span>
                          <span className="font-bold text-slate-900">{q.name || q.customerName}</span>
                          {q.company && <span className="text-slate-500">({q.company})</span>}
                          <span className="text-slate-500 font-mono">📱 {q.phone}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              q.status === 'converted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : q.status === 'quoted'
                                ? 'bg-blue-100 text-blue-800'
                                : q.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {q.status}
                          </span>
                        </div>

                        <div className="text-slate-700 font-semibold">
                          Service: <span className="text-slate-900">{q.serviceType || q.serviceNeeded}</span> • Qty: {q.quantity || q.approxQuantity}
                          {q.deadline && ` • Deadline: ${q.deadline}`}
                        </div>

                        {q.sizeSpecs && (
                          <div className="text-slate-600 text-[11px]">
                            <strong>Specs:</strong> {q.sizeSpecs}
                          </div>
                        )}

                        {q.description && (
                          <p className="text-slate-500 text-[11px] italic">
                            "{q.description}"
                          </p>
                        )}

                        {q.quotedPrice && (
                          <div className="text-emerald-700 font-bold font-mono text-xs">
                            Official Quote Provided: ₹{q.quotedPrice.toLocaleString()} {q.notes ? `(${q.notes})` : ''}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedQuoteForResponse(q);
                            setQuotePriceInput(q.quotedPrice || 0);
                            setQuoteNotesInput(q.notes || '');
                            setQuoteStatusInput(q.status);
                          }}
                          className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition"
                        >
                          Quote / Respond
                        </button>

                        <button
                          type="button"
                          onClick={() => handleConvertQuoteToOrder(q.id)}
                          className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition"
                        >
                          + Convert to Order
                        </button>

                        <a
                          href={buildWhatsAppQuoteResponseNotification(
                            q.phone,
                            q.id,
                            q.name || q.customerName,
                            q.serviceType || q.serviceNeeded,
                            q.quotedPrice || 500,
                            q.notes || 'Ready for production.'
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Quote</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete inquiry #${q.id}?`)) {
                              deleteQuoteRequest(q.id);
                              refreshData();
                              showToast(`Quote #${q.id} removed`);
                            }
                          }}
                          className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        )}

        {/* ─── TAB 5: PRODUCT CATALOG ─── */}
        {activeTab === 'products' && (
          <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Commercial Catalog Products</h2>
                  <p className="text-xs text-slate-500">Manage shop items, inventory stock status, and retail prices.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProductId(null);
                    setProductForm({
                      name: '',
                      category: 'visiting-cards',
                      basePrice: 250,
                      salePrice: 250,
                      stockStatus: 'in_stock',
                      turnaroundTime: '24 Hours',
                      shortDescription: '',
                      images: ['/images/product-matte-visiting-cards.jpg'],
                    });
                    setShowProductModal(true);
                  }}
                  className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-3xl border border-slate-200 bg-white hover:border-indigo-300 transition flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shrink-0"
                      />
                      <div className="space-y-1 min-w-0">
                        <div className="font-bold text-slate-900 text-sm truncate">{prod.name}</div>
                        <div className="text-[11px] text-slate-400 capitalize">{prod.category}</div>
                        <div className="font-mono font-bold text-indigo-700 text-xs">
                          ₹{prod.salePrice || prod.basePrice}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          const nextStatus: any =
                            prod.stockStatus === 'in_stock'
                              ? 'out_of_stock'
                              : prod.stockStatus === 'out_of_stock'
                              ? 'made_to_order'
                              : 'in_stock';
                          saveProduct({ ...prod, stockStatus: nextStatus });
                          refreshData();
                          showToast(`Updated stock status to ${nextStatus}`);
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                          prod.stockStatus === 'in_stock'
                            ? 'bg-emerald-100 text-emerald-800'
                            : prod.stockStatus === 'made_to_order'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {prod.stockStatus.replace(/_/g, ' ')} ✎
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProductId(prod.id);
                            setProductForm(prod);
                            setShowProductModal(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete product "${prod.name}"?`)) {
                              deleteProduct(prod.id);
                              refreshData();
                              showToast(`Deleted product ${prod.name}`);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* ─── TAB 6: PROMO COUPONS ─── */}
        {activeTab === 'coupons' && (
          <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Promotional Vouchers & Coupons</h2>
                  <p className="text-xs text-slate-500">Configure customer discount codes for website checkouts.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCouponForm({
                      code: '',
                      discountType: 'percentage',
                      discountValue: 10,
                      minOrderValue: 200,
                      expiresAt: '2026-12-31',
                      active: true,
                      description: '',
                    });
                    setShowCouponModal(true);
                  }}
                  className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Promo Code</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {coupons.map((cpn) => (
                  <div
                    key={cpn.code}
                    className="p-5 rounded-3xl border border-slate-200 bg-white hover:border-indigo-300 transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-indigo-700 text-base">{cpn.code}</span>
                      <button
                        type="button"
                        onClick={() => {
                          toggleCouponStatus(cpn.code);
                          refreshData();
                          showToast(`Toggled coupon ${cpn.code}`);
                        }}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          cpn.active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {cpn.active ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-slate-800">{cpn.description}</div>
                      <div className="text-slate-500 text-[11px]">
                        Value: {cpn.discountValue}
                        {cpn.discountType === 'percentage' ? '%' : ' INR'} OFF (Min. Order: ₹{cpn.minOrderValue})
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        Valid until: {cpn.expiresAt}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete coupon "${cpn.code}"?`)) {
                            deleteCoupon(cpn.code);
                            refreshData();
                            showToast(`Coupon ${cpn.code} deleted`);
                          }
                        }}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                      >
                        Delete Coupon
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* ─── TAB 7: STORE SETTINGS & NAP ─── */}
        {activeTab === 'settings' && (
          <main className="p-4 sm:p-8 space-y-6 max-w-4xl w-full mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900">
                  Store Profile, UPI & Hyperlocal NAP
                </h2>
                <p className="text-xs text-slate-500">
                  Settings reflected across the website headers, invoices, WhatsApp links, and search engines.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Business English Name</label>
                    <input
                      type="text"
                      value={settings.businessName}
                      onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Business Marathi Name</label>
                    <input
                      type="text"
                      value={settings.businessNameMarathi}
                      onChange={(e) => setSettings({ ...settings, businessNameMarathi: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Shop Counter Phone 1</label>
                    <input
                      type="text"
                      value={settings.phone1}
                      onChange={(e) => setSettings({ ...settings, phone1: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">WhatsApp Alert Number</label>
                    <input
                      type="text"
                      value={settings.whatsapp || ''}
                      onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Address Line 1</label>
                    <input
                      type="text"
                      value={settings.addressLine1}
                      onChange={(e) => setSettings({ ...settings, addressLine1: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Address Line 2 (Chowk / Locality)</label>
                    <input
                      type="text"
                      value={settings.addressLine2}
                      onChange={(e) => setSettings({ ...settings, addressLine2: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">GSTIN Tax Registration</label>
                    <input
                      type="text"
                      value={settings.gstNumber}
                      onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono uppercase"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">UPI Payment VPA ID</label>
                    <input
                      type="text"
                      value={settings.upiId}
                      onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition"
                  >
                    Save Store NAP Profile
                  </button>
                </div>
              </form>
            </div>
          </main>
        )}

        {/* ─── CORPORATE ORDER DETAIL DRAWER / MODAL ─── */}
        {activeOrderDrawer && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end">
            <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
              {/* Drawer Top Header */}
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-20">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-indigo-400">
                      {activeOrderDrawer.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                      {activeOrderDrawer.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Placed on {new Date(activeOrderDrawer.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveOrderDrawer(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Body Content */}
              <div className="p-6 space-y-6 text-xs text-slate-800 flex-grow">
                {/* Customer Contact Bar */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">
                        {activeOrderDrawer.customerName}
                      </div>
                      <div className="text-slate-500 font-mono text-xs">{activeOrderDrawer.customerPhone}</div>
                      {activeOrderDrawer.customerEmail && (
                        <div className="text-slate-400 text-[11px]">{activeOrderDrawer.customerEmail}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${activeOrderDrawer.customerPhone}`}
                        className="py-1.5 px-3 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                      <a
                        href={`https://wa.me/${activeOrderDrawer.customerPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    </div>
                  </div>

                  {activeOrderDrawer.deliveryAddress && (
                    <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
                      <strong>Delivery Address:</strong> {activeOrderDrawer.deliveryAddress.street},{' '}
                      {activeOrderDrawer.deliveryAddress.area}, {activeOrderDrawer.deliveryAddress.city} -{' '}
                      {activeOrderDrawer.deliveryAddress.pincode}
                    </div>
                  )}
                </div>

                {/* Ordered Items Breakdown */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Ordered Items ({activeOrderDrawer.items.length})
                  </h3>
                  <div className="space-y-2">
                    {activeOrderDrawer.items.map((it) => (
                      <div key={it.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-slate-900 text-xs">{it.title}</strong>
                            <div className="text-slate-400 text-[11px]">Qty: {it.quantity} × ₹{it.unitPrice}</div>
                          </div>
                          <div className="font-mono font-bold text-slate-900">₹{it.totalPrice}</div>
                        </div>

                        {it.customConfig && (
                          <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1">
                            {it.customConfig.serviceType === 'flex-printing' && (
                              <p>Size: {it.customConfig.widthFt}ft x {it.customConfig.heightFt}ft ({it.customConfig.material})</p>
                            )}
                            {it.customConfig.serviceType === 'document-printing' && (
                              <p>{it.customConfig.pageCount} Pages • {it.customConfig.colorMode} • {it.customConfig.binding}</p>
                            )}
                            {it.customConfig.finishing && it.customConfig.finishing.length > 0 && (
                              <p>Finishing: {it.customConfig.finishing.join(', ')}</p>
                            )}
                            {it.customConfig.uploadedFiles && it.customConfig.uploadedFiles.length > 0 && (
                              <div className="text-indigo-600 font-semibold pt-1 flex items-center justify-between">
                                <span>Attached: {it.customConfig.uploadedFiles[0].name}</span>
                                {it.customConfig.uploadedFiles[0].preview && (
                                  <a
                                    href={it.customConfig.uploadedFiles[0].preview}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                  >
                                    View File ↗
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {it.instructions && (
                          <p className="text-[11px] text-pink-700 italic">
                            Special Instructions: "{it.instructions}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Stage Updater + Timeline Note */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
                  <h3 className="font-bold text-indigo-900 uppercase tracking-wider text-[11px]">
                    Update Operational Status
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={activeOrderDrawer.status}
                      onChange={(e) =>
                        handleQuickStatusChange(activeOrderDrawer.id, e.target.value as OrderStatus)
                      }
                      className="px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white text-slate-800"
                    >
                      {allStatuses.map((st) => (
                        <option key={st.key} value={st.key}>
                          {st.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatusWithNote(activeOrderDrawer.id, activeOrderDrawer.status)
                      }
                      className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                    >
                      Log Status Note
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Optional activity note (e.g. Sent to Konica Minolta press 2)..."
                    value={statusNoteInput}
                    onChange={(e) => setStatusNoteInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                {/* Dispatch & Courier Tracking Editor */}
                <form onSubmit={handleSaveTrackingAndDispatch} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      Shipping & Consignment Tracking
                    </h3>
                    {activeOrderDrawer.trackingNumber && (
                      <a
                        href={buildWhatsAppDispatchNotification(
                          activeOrderDrawer.customerPhone,
                          activeOrderDrawer.id,
                          activeOrderDrawer.trackingCarrier || 'Courier',
                          activeOrderDrawer.trackingNumber,
                          activeOrderDrawer.customerName,
                          activeOrderDrawer.trackingUrl
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:underline font-bold text-[11px] flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" /> WhatsApp Dispatch Alert
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Carrier / Mode:</label>
                      <input
                        type="text"
                        placeholder="e.g. DTDC, Maruti, Store Counter"
                        value={trackingCarrierInput}
                        onChange={(e) => setTrackingCarrierInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Consignment / AWB No.:</label>
                      <input
                        type="text"
                        placeholder="e.g. D12345678"
                        value={trackingNumberInput}
                        onChange={(e) => setTrackingNumberInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Tracking Web URL:</label>
                      <input
                        type="url"
                        placeholder="https://track.dtdc.com/..."
                        value={trackingUrlInput}
                        onChange={(e) => setTrackingUrlInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600">Estimated Delivery:</label>
                      <input
                        type="text"
                        placeholder="e.g. Today by 6:00 PM"
                        value={estimatedDeliveryInput}
                        onChange={(e) => setEstimatedDeliveryInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition"
                  >
                    Save Dispatch & Tracking Details
                  </button>
                </form>

                {/* Digital Proof History */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      Digital Proof Studio
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setProofModalOrder(activeOrderDrawer);
                        setProofUrlInput(
                          activeOrderDrawer.proofs && activeOrderDrawer.proofs.length > 0
                            ? activeOrderDrawer.proofs[activeOrderDrawer.proofs.length - 1].imageUrl
                            : 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&auto=format&fit=crop'
                        );
                      }}
                      className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-[11px]"
                    >
                      + Upload New Proof
                    </button>
                  </div>

                  {activeOrderDrawer.proofs && activeOrderDrawer.proofs.length > 0 ? (
                    <div className="space-y-2">
                      {activeOrderDrawer.proofs.map((prf) => (
                        <div key={prf.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-900">Revision v{prf.version}</span>
                            <span className="text-slate-400 font-mono text-[10px] block">
                              {new Date(prf.uploadedAt).toLocaleString('en-IN')}
                            </span>
                            {prf.customerComments && (
                              <p className="text-[10px] text-rose-700 font-semibold italic">
                                Feedback: "{prf.customerComments}"
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              prf.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : prf.status === 'changes_requested'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {prf.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs py-1">No proofs uploaded yet for this job.</p>
                  )}
                </div>
              </div>

              {/* Drawer Bottom Bar Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 sticky bottom-0">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForInvoice(activeOrderDrawer)}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Tax Invoice</span>
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/orders/${activeOrderDrawer.id}`}
                    target="_blank"
                    className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-bold text-xs flex items-center gap-1"
                  >
                    <span>Customer View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDeleteOrder(activeOrderDrawer.id)}
                    className="py-2.5 px-3 rounded-xl hover:bg-rose-100 text-rose-700 font-bold text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: WALK-IN / COUNTER ORDER ─── */}
        {showCounterOrderModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Create Counter / Walk-in Job</h3>
                  <p className="text-xs text-slate-500">Record in-store job at Trimurti Chowk counter.</p>
                </div>
                <button
                  onClick={() => setShowCounterOrderModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCounterOrder} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Customer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patil"
                      value={counterCustomerName}
                      onChange={(e) => setCounterCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9822012345"
                      value={counterCustomerPhone}
                      onChange={(e) => setCounterCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Printing Category</label>
                    <select
                      value={counterServiceType}
                      onChange={(e) => setCounterServiceType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="document-printing">Document Xerox & Laser Print</option>
                      <option value="flex-printing">Flex & Banner Printing</option>
                      <option value="visiting-cards">Visiting Cards</option>
                      <option value="sticker-label">Vinyl Stickers & Labels</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Total Price (INR) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={counterAmount}
                      onChange={(e) => setCounterAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Job Specifications & Notes</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. 40 pages B&W Spiral Binding, urgent pickup in 30 mins."
                      value={counterSpecs}
                      onChange={(e) => setCounterSpecs(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Payment Mode</label>
                    <select
                      value={counterPaymentMethod}
                      onChange={(e) => setCounterPaymentMethod(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="cash_on_pickup">Cash on Counter</option>
                      <option value="upi_qr">UPI QR Code</option>
                      <option value="card_online">Card Swipe</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Payment Status</label>
                    <select
                      value={counterPaymentStatus}
                      onChange={(e) => setCounterPaymentStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="paid">Paid (Collected)</option>
                      <option value="pending">Pending (Pay on Pickup)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCounterOrderModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow"
                  >
                    Record Job & Open Receipt
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: QUOTE RESPOND / CONVERT ─── */}
        {selectedQuoteForResponse && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900">
                  Quote for #{selectedQuoteForResponse.id}
                </h3>
                <button
                  onClick={() => setSelectedQuoteForResponse(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveQuoteResponse} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Official Quoted Price (INR)</label>
                  <input
                    type="number"
                    value={quotePriceInput}
                    onChange={(e) => setQuotePriceInput(Number(e.target.value))}
                    placeholder="e.g. 4500"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Status</label>
                  <select
                    value={quoteStatusInput}
                    onChange={(e) => setQuoteStatusInput(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="quoted">Quoted</option>
                    <option value="converted">Converted to Order</option>
                    <option value="rejected">Rejected / Closed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Notes & Terms for Customer</label>
                  <textarea
                    rows={3}
                    value={quoteNotesInput}
                    onChange={(e) => setQuoteNotesInput(e.target.value)}
                    placeholder="e.g. Price includes Star Flex and delivery near Trimurti Chowk. Turnaround: 24h."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedQuoteForResponse(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
                  >
                    Save Quotation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: ADD / EDIT PRODUCT ─── */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900">
                  {editingProductId ? 'Edit Product' : 'Add Catalog Product'}
                </h3>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name || ''}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Category</label>
                    <select
                      value={productForm.category || 'visiting-cards'}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="visiting-cards">Visiting Cards</option>
                      <option value="flex-printing">Flex & Banners</option>
                      <option value="sticker-label">Stickers & Labels</option>
                      <option value="document-printing">Document Printing</option>
                      <option value="poster-printing">Posters & Frames</option>
                      <option value="flyer-pamphlet">Flyers & Pamphlets</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Base Price (INR) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.basePrice || 100}
                      onChange={(e) => setProductForm({ ...productForm, basePrice: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Sale Price (Optional)</label>
                    <input
                      type="number"
                      value={productForm.salePrice || ''}
                      onChange={(e) => setProductForm({ ...productForm, salePrice: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Stock Availability</label>
                    <select
                      value={productForm.stockStatus || 'in_stock'}
                      onChange={(e) => setProductForm({ ...productForm, stockStatus: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="made_to_order">Made to Order</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Image Asset URL</label>
                    <input
                      type="text"
                      value={productForm.images?.[0] || ''}
                      onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Short Description</label>
                    <textarea
                      rows={2}
                      value={productForm.shortDescription || ''}
                      onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: CREATE PROMO COUPON ─── */}
        {showCouponModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900">Create Promo Voucher</h3>
                <button
                  onClick={() => setShowCouponModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CIDCO20"
                    value={couponForm.code || ''}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Type</label>
                    <select
                      value={couponForm.discountType}
                      onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed INR (₹)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Value *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={couponForm.discountValue || 10}
                      onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Min Order Value (INR)</label>
                  <input
                    type="number"
                    value={couponForm.minOrderValue || 200}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. 10% discount on first Cidco order"
                    value={couponForm.description || ''}
                    onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCouponModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow"
                  >
                    Create Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: UPLOAD DIGITAL PROOF ─── */}
        {proofModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="font-bold text-base text-slate-900">
                  Publish Proof for Order <span className="font-mono text-indigo-600">{proofModalOrder.id}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setProofModalOrder(null)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUploadProof} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Digital Proof Image URL:</label>
                  <input
                    type="url"
                    required
                    value={proofUrlInput}
                    onChange={(e) => setProofUrlInput(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                {/* Preset Mockup Samples */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Or select sample mockup:</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      { label: 'Hoarding Banner', url: '/images/portfolio-hoarding-banner.jpg' },
                      { label: 'Velvet Card', url: '/images/portfolio-luxury-visiting-cards.jpg' },
                      { label: 'Thesis Book', url: '/images/portfolio-thesis-hardbound.jpg' },
                    ].map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => setProofUrlInput(s.url)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Note for Customer:</label>
                  <textarea
                    rows={3}
                    value={proofNoteInput}
                    onChange={(e) => setProofNoteInput(e.target.value)}
                    placeholder="e.g. Please examine the spelling, phone number, and margins before approving for printing."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setProofModalOrder(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow"
                  >
                    Publish Proof to Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: PRINT INVOICE ─── */}
        {selectedOrderForInvoice && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <PrintInvoice
                order={selectedOrderForInvoice}
                onClose={() => setSelectedOrderForInvoice(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
