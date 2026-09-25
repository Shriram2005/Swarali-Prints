'use client';

import React, { use, useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MapPin,
  ArrowRight,
  MessageCircle,
  Truck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { INITIAL_PRODUCTS } from '@/lib/data';
import { addToCart } from '@/lib/storage';
import { JsonLd } from '@/components/JsonLd';
import { buildWhatsAppChatLink } from '@/lib/whatsapp';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Variant selections state
  const initialVariants: Record<string, string> = {};
  if (product.variants) {
    product.variants.forEach((v) => {
      initialVariants[v.name] = v.options[0]?.label || '';
    });
  }
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(initialVariants);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Compute live price with selected variants
  const calculatedPrice = useMemo(() => {
    let price = product.salePrice || product.basePrice;
    if (product.variants) {
      product.variants.forEach((v) => {
        const chosenLabel = selectedVariants[v.name];
        const option = v.options.find((o) => o.label === chosenLabel);
        if (option?.priceDelta) {
          price += option.priceDelta;
        }
      });
    }
    return price;
  }, [product, selectedVariants]);

  const handleAddToCart = () => {
    addToCart({
      id: `prod-${product.id}-${Date.now()}`,
      type: 'standard_product',
      productId: product.id,
      title: `${product.name} (${Object.values(selectedVariants).join(', ')})`,
      image: product.images[0],
      quantity,
      unitPrice: calculatedPrice,
      totalPrice: calculatedPrice * quantity,
      selectedVariants,
    });
    setAdded(true);
    setTimeout(() => {
      router.push('/cart');
    }, 400);
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Swarali Prints',
    },
    offers: {
      '@type': 'Offer',
      price: calculatedPrice,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'LocalBusiness',
        name: 'Swarali Prints',
        address: 'Trimurti Chowk, Cidco, Nashik 422008',
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <JsonLd data={schema} />
      <Navbar />

      <main className="flex-grow py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-pink-600">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-pink-600">Products</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate">{product.name}</span>
          </div>

          {/* Product Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Gallery Left (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-white">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-80 sm:h-96 object-cover"
                />
                {product.salePrice && (
                  <div className="absolute top-4 left-4 bg-pink-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow">
                    Special Offer
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImageIndex(i)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImageIndex === i ? 'border-pink-600 shadow-sm' : 'border-slate-200'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="bg-slate-100 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <MapPin className="w-4 h-4 text-pink-600" />
                  <span>Free Pickup in Cidco, Nashik</span>
                </div>
                <p>
                  Collect your ready order directly from Shop No. 1, Opp. New Sadguru Hotel, Trimurti Chowk. Same-day / 24-hour turnaround available.
                </p>
              </div>
            </div>

            {/* Config & Buy Right (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-md">
                    {product.category.replace('-', ' ')}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  {product.name}
                </h1>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price Banner */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Total Price:</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black text-slate-900">
                      ₹{(calculatedPrice * quantity).toLocaleString()}
                    </span>
                    {product.salePrice && (
                      <span className="text-sm text-slate-400 line-through">
                        ₹{(product.basePrice * quantity).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-lime-700 bg-lime-100 px-2.5 py-1 rounded-full">
                    GST & Trimurti Chowk Pickup Included
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Turnaround: {product.turnaroundTime}
                  </div>
                </div>
              </div>

              {/* Variant Selectors */}
              {product.variants && (
                <div className="space-y-4">
                  {product.variants.map((variant) => (
                    <div key={variant.name} className="space-y-2">
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {variant.name}:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {variant.options.map((opt) => {
                          const isSelected = selectedVariants[variant.name] === opt.label;
                          return (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() =>
                                setSelectedVariants((prev) => ({
                                  ...prev,
                                  [variant.name]: opt.label,
                                }))
                              }
                              className={`p-3 rounded-xl border text-xs text-left transition-all ${
                                isSelected
                                  ? 'border-pink-600 bg-pink-50/70 text-pink-800 font-bold shadow-xs'
                                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                              }`}
                            >
                              <div>{opt.label}</div>
                              {opt.priceDelta ? (
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  +₹{opt.priceDelta}
                                </div>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Picker & Add to Cart */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg font-bold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-sm text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{added ? 'Added to Cart!' : 'Add to Cart & Checkout'}</span>
                </button>

                <a
                  href={buildWhatsAppChatLink(
                    `Hello Swarali Prints, I want to order ${product.name} (Qty: ${quantity}). Please let me know the details.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-emerald-600 bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>

              {/* Product Specifications */}
              <div className="pt-6 border-t border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Product Technical Specifications:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-400 block">{spec.label}</span>
                      <span className="font-bold text-slate-800 mt-0.5 block">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
