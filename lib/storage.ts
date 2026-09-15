'use client';

import {
  ServiceItem,
  ProductItem,
  Order,
  CartItem,
  PortfolioItem,
  CustomerReview,
  StoreSettings,
  Coupon,
  QuoteRequest,
  OrderStatus,
  ProofItem,
} from './types';
import {
  INITIAL_SERVICES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_PORTFOLIO,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_COUPONS,
  INITIAL_QUOTES,
} from './data';

const STORAGE_KEYS = {
  SERVICES: 'swarali_services_v1',
  PRODUCTS: 'swarali_products_v1',
  ORDERS: 'swarali_orders_v1',
  PORTFOLIO: 'swarali_portfolio_v1',
  REVIEWS: 'swarali_reviews_v1',
  SETTINGS: 'swarali_settings_v1',
  COUPONS: 'swarali_coupons_v1',
  QUOTES: 'swarali_quotes_v1',
  CART: 'swarali_cart_v1',
  ACTIVE_COUPON: 'swarali_applied_coupon_v1',
  USER_PROFILE: 'swarali_user_profile_v1',
};

function safeGet<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// ---------------- PRODUCTS ----------------
export function getStoredProducts(): ProductItem[] {
  return safeGet<ProductItem[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export function saveProduct(product: ProductItem): void {
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    products[index] = product;
  } else {
    products.unshift(product);
  }
  safeSet(STORAGE_KEYS.PRODUCTS, products);
}

export function deleteProduct(productId: string): void {
  const products = getStoredProducts().filter((p) => p.id !== productId);
  safeSet(STORAGE_KEYS.PRODUCTS, products);
}

// ---------------- SERVICES ----------------
export function getStoredServices(): ServiceItem[] {
  return safeGet<ServiceItem[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
}

export function saveService(service: ServiceItem): void {
  const services = getStoredServices();
  const index = services.findIndex((s) => s.id === service.id);
  if (index >= 0) {
    services[index] = service;
  } else {
    services.unshift(service);
  }
  safeSet(STORAGE_KEYS.SERVICES, services);
}

// ---------------- ORDERS ----------------
export function getStoredOrders(): Order[] {
  return safeGet<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
}

export function getOrderById(orderId: string): Order | undefined {
  const orders = getStoredOrders();
  return orders.find((o) => o.id.toLowerCase() === orderId.trim().toLowerCase());
}

export function saveOrder(order: Order): void {
  const orders = getStoredOrders();
  const index = orders.findIndex((o) => o.id === order.id);
  if (index >= 0) {
    orders[index] = order;
  } else {
    orders.unshift(order);
  }
  safeSet(STORAGE_KEYS.ORDERS, orders);
}

export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  note?: string
): Order | null {
  const orders = getStoredOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;

  order.status = newStatus;
  order.statusHistory.push({
    status: newStatus,
    timestamp: new Date().toISOString(),
    note: note || `Status updated to ${newStatus.replace(/_/g, ' ')}`,
  });

  safeSet(STORAGE_KEYS.ORDERS, orders);
  return order;
}

export function uploadProofToOrder(
  orderId: string,
  imageUrl: string,
  notes?: string
): Order | null {
  const orders = getStoredOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;

  const newProof: ProofItem = {
    id: `proof-${Date.now()}`,
    uploadedAt: new Date().toISOString(),
    imageUrl,
    version: order.proofs.length + 1,
    notes,
    status: 'pending',
  };

  order.proofs.unshift(newProof);
  order.status = 'customer_approval';
  order.statusHistory.push({
    status: 'customer_approval',
    timestamp: new Date().toISOString(),
    note: `Sample/Proof version ${newProof.version} uploaded for customer review`,
  });

  safeSet(STORAGE_KEYS.ORDERS, orders);
  return order;
}

export function approveProof(orderId: string, proofId: string): Order | null {
  const orders = getStoredOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;

  const proof = order.proofs.find((p) => p.id === proofId);
  if (proof) {
    proof.status = 'approved';
    proof.resolvedAt = new Date().toISOString();
  }

  order.status = 'printing';
  order.statusHistory.push({
    status: 'printing',
    timestamp: new Date().toISOString(),
    note: 'Customer approved proof. Sent to printing queue.',
  });

  safeSet(STORAGE_KEYS.ORDERS, orders);
  return order;
}

export function requestProofChanges(
  orderId: string,
  proofId: string,
  customerComments: string
): Order | null {
  const orders = getStoredOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;

  const proof = order.proofs.find((p) => p.id === proofId);
  if (proof) {
    proof.status = 'changes_requested';
    proof.customerComments = customerComments;
    proof.resolvedAt = new Date().toISOString();
  }

  order.status = 'proof_design';
  order.statusHistory.push({
    status: 'proof_design',
    timestamp: new Date().toISOString(),
    note: `Customer requested changes: "${customerComments}"`,
  });

  safeSet(STORAGE_KEYS.ORDERS, orders);
  return order;
}

// ---------------- CART ----------------
export function getCart(): CartItem[] {
  return safeGet<CartItem[]>(STORAGE_KEYS.CART, []);
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  const existingIndex = cart.findIndex((i) => i.id === item.id);
  if (existingIndex >= 0 && item.type === 'standard_product') {
    cart[existingIndex].quantity += item.quantity;
    cart[existingIndex].totalPrice = cart[existingIndex].quantity * cart[existingIndex].unitPrice;
  } else {
    cart.push(item);
  }
  safeSet(STORAGE_KEYS.CART, cart);
  window.dispatchEvent(new Event('cart_updated'));
}

export function updateCartQuantity(itemId: string, delta: number): void {
  const cart = getCart();
  const item = cart.find((i) => i.id === itemId);
  if (!item) return;

  const newQty = item.quantity + delta;
  if (newQty <= 0) {
    removeFromCart(itemId);
    return;
  }
  item.quantity = newQty;
  item.totalPrice = Math.round(item.unitPrice * newQty);
  safeSet(STORAGE_KEYS.CART, cart);
  window.dispatchEvent(new Event('cart_updated'));
}

export function removeFromCart(itemId: string): void {
  const cart = getCart().filter((i) => i.id !== itemId);
  safeSet(STORAGE_KEYS.CART, cart);
  window.dispatchEvent(new Event('cart_updated'));
}

export function clearCart(): void {
  safeSet(STORAGE_KEYS.CART, []);
  safeSet(STORAGE_KEYS.ACTIVE_COUPON, null);
  window.dispatchEvent(new Event('cart_updated'));
}

// ---------------- COUPONS ----------------
export function getStoredCoupons(): Coupon[] {
  return safeGet<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
}

export function getActiveCoupon(): Coupon | null {
  return safeGet<Coupon | null>(STORAGE_KEYS.ACTIVE_COUPON, null);
}

export function applyCoupon(code: string, cartTotal: number): { success: boolean; message: string; discount: number; coupon?: Coupon } {
  const coupons = getStoredCoupons();
  const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);

  if (!coupon) {
    return { success: false, message: 'Invalid or expired coupon code', discount: 0 };
  }

  if (cartTotal < coupon.minOrderValue) {
    return {
      success: false,
      message: `Minimum order amount of ₹${coupon.minOrderValue} required for this coupon`,
      discount: 0,
    };
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((cartTotal * coupon.discountValue) / 100);
  } else {
    discount = coupon.discountValue;
  }

  safeSet(STORAGE_KEYS.ACTIVE_COUPON, coupon);
  return {
    success: true,
    message: `Coupon "${coupon.code}" applied! You saved ₹${discount}`,
    discount,
    coupon,
  };
}

export function removeCoupon(): void {
  safeSet(STORAGE_KEYS.ACTIVE_COUPON, null);
}

// ---------------- REVIEWS ----------------
export function getStoredReviews(): CustomerReview[] {
  return safeGet<CustomerReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
}

export function addReview(review: Omit<CustomerReview, 'id' | 'date' | 'approved'>): CustomerReview {
  const reviews = getStoredReviews();
  const newRev: CustomerReview = {
    ...review,
    id: `rev-${Date.now()}`,
    date: 'Just now',
    approved: true, // auto-approve for demonstration or can be moderated
  };
  reviews.unshift(newRev);
  safeSet(STORAGE_KEYS.REVIEWS, reviews);
  return newRev;
}

// ---------------- SETTINGS ----------------
export function getStoredSettings(): StoreSettings {
  return safeGet<StoreSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
}

export function updateSettings(settings: StoreSettings): void {
  safeSet(STORAGE_KEYS.SETTINGS, settings);
}

// ---------------- PORTFOLIO ----------------
export function getStoredPortfolio(): PortfolioItem[] {
  return safeGet<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, INITIAL_PORTFOLIO);
}

export function savePortfolioItem(item: PortfolioItem): void {
  const list = getStoredPortfolio();
  const idx = list.findIndex((p) => p.id === item.id);
  if (idx >= 0) {
    list[idx] = item;
  } else {
    list.unshift(item);
  }
  safeSet(STORAGE_KEYS.PORTFOLIO, list);
}

export function deletePortfolioItem(id: string): void {
  const list = getStoredPortfolio().filter((p) => p.id !== id);
  safeSet(STORAGE_KEYS.PORTFOLIO, list);
}

// ---------------- QUOTES ----------------
export function getStoredQuotes(): QuoteRequest[] {
  return safeGet<QuoteRequest[]>(STORAGE_KEYS.QUOTES, INITIAL_QUOTES);
}

// ---------------- ALIASES & EXTRA HELPERS FOR UI PAGES ----------------
export const getAllOrders = getStoredOrders;
export const getAllQuoteRequests = getStoredQuotes;
export const getStoreSettings = getStoredSettings;
export const saveStoreSettings = updateSettings;
export const addOrderProof = uploadProofToOrder;

export function saveQuoteRequest(quote: QuoteRequest): void {
  const quotes = getStoredQuotes();
  const idx = quotes.findIndex((q) => q.id === quote.id);
  if (idx >= 0) {
    quotes[idx] = quote;
  } else {
    quotes.unshift(quote);
  }
  safeSet(STORAGE_KEYS.QUOTES, quotes);
}

export function updateQuoteStatus(quoteId: string, status: QuoteRequest['status']): void {
  const quotes = getStoredQuotes();
  const q = quotes.find((item) => item.id === quoteId);
  if (q) {
    q.status = status;
    safeSet(STORAGE_KEYS.QUOTES, quotes);
  }
}
