export type PrintingCategory =
  | 'flex-printing'
  | 'banner-printing'
  | 'digital-printing'
  | 'document-printing'
  | 'visiting-cards'
  | 'flyer-pamphlet'
  | 'brochure'
  | 'poster-printing'
  | 'invitation-printing'
  | 'certificate'
  | 'photo-printing'
  | 'sticker-label'
  | 'letterhead'
  | 'binding-lamination'
  | 'custom-printing';

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  marathiName?: string;
  category: PrintingCategory;
  shortDescription: string;
  fullDescription: string;
  image: string;
  pricingModel: 'per_sqft' | 'per_page' | 'per_unit' | 'tiered' | 'custom_quote';
  startingPrice: number;
  unit: string;
  featured: boolean;
  active: boolean;
  turnaroundTime: string;
  minOrderQuantity: number;
  specifications: { label: string; value: string }[];
  options: {
    materials?: string[];
    sizes?: string[];
    finishing?: string[];
    colorModes?: string[];
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  category: PrintingCategory;
  shortDescription: string;
  description: string;
  images: string[];
  basePrice: number;
  salePrice?: number;
  stockStatus: 'in_stock' | 'made_to_order' | 'out_of_stock';
  featured: boolean;
  rating: number;
  reviewCount: number;
  turnaroundTime: string;
  minQuantity: number;
  variants?: {
    name: string;
    options: { label: string; priceMultiplier?: number; priceDelta?: number }[];
  }[];
  specifications: { label: string; value: string }[];
  faqs?: { question: string; answer: string }[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface CustomJobConfig {
  serviceType: string;
  // Flex specific
  widthFt?: number;
  heightFt?: number;
  material?: string;
  printQuality?: string;
  finishing?: string[];
  mounting?: string;
  // Document specific
  pageCount?: number;
  copies?: number;
  paperSize?: string;
  paperType?: string;
  colorMode?: 'color' | 'bw';
  duplex?: 'single' | 'double';
  binding?: string;
  lamination?: string;
  // Visiting card specific
  cardStock?: string;
  sides?: 'single' | 'double';
  cardQuantity?: number;
  cardFinish?: string[];
  // Common
  quantity: number;
  designRequired: boolean;
  instructions: string;
  uploadedFiles: {
    name: string;
    size: number;
    type: string;
    url?: string;
    preview?: string;
  }[];
}

export interface CartItem {
  id: string;
  type: 'standard_product' | 'custom_printing';
  productId?: string;
  serviceId?: string;
  title: string;
  image: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedVariants?: Record<string, string>;
  customConfig?: CustomJobConfig;
  instructions?: string;
}

export type OrderStatus =
  | 'order_placed'
  | 'payment_confirmed'
  | 'file_verification'
  | 'proof_design'
  | 'customer_approval'
  | 'printing'
  | 'quality_check'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'partially_paid'
  | 'failed'
  | 'refunded'
  | 'pay_on_pickup';

export type PaymentMethod =
  | 'upi_qr'
  | 'cash_on_pickup'
  | 'pay_after_quote'
  | 'card_online';

export type FulfillmentMethod =
  | 'store_pickup'
  | 'local_delivery_cidco'
  | 'courier_nashik';

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  preview?: string;
  uploadedAt?: string;
}

export interface ProofItem {
  id: string;
  uploadedAt: string;
  imageUrl: string;
  version: number;
  notes?: string;
  status: 'pending' | 'approved' | 'changes_requested';
  customerComments?: string;
  resolvedAt?: string;
}

export interface Order {
  id: string; // e.g. SP-2026-0001
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerGst?: string;
  deliveryAddress?: {
    street: string;
    area: string;
    city: string;
    pincode: string;
    landmark?: string;
  };
  fulfillmentMethod: FulfillmentMethod;
  fulfillmentCost: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentRef?: string;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  history?: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  proofs: ProofItem[];
  customerNotes?: string;
  specialInstructions?: string;
  adminNotes?: string;
  updatedAt?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  client?: string;
  description: string;
  image: string;
  tags: string[];
  featured: boolean;
  completionDate: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  area: string; // e.g., Trimurti Chowk, Cidco, Nashik
  rating: number;
  comment: string;
  serviceUsed: string;
  date: string;
  approved: boolean;
}

export interface QuoteRequest {
  id: string;
  createdAt: string;
  customerName: string;
  name?: string;
  phone: string;
  email?: string;
  serviceNeeded: string;
  serviceType?: string;
  approxQuantity: string;
  quantity?: string;
  sizeSpecs?: string;
  deadline?: string;
  company?: string;
  description: string;
  fileAttachment?: string;
  files?: any[];
  status: 'new' | 'pending' | 'contacted' | 'quoted' | 'converted' | 'rejected' | 'closed';
  quotedPrice?: number;
  estimatedBudget?: string;
  notes?: string;
}

export interface StoreSettings {
  businessName: string;
  businessNameMarathi: string;
  tagline: string;
  ownerName: string;
  phone1: string;
  phone2: string;
  whatsapp: string;
  whatsappNumber?: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  openingHours: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  upiId: string;
  gstNumber: string;
  deliveryCharges: {
    storePickup: number;
    localCidco: number;
    nashikCity: number;
    freeDeliveryThreshold: number;
  };
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  minOrderAmount?: number;
  expiresAt: string;
  active: boolean;
  description: string;
}
