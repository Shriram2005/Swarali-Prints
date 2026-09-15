'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Star, Filter, ArrowRight, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { INITIAL_PRODUCTS } from '@/lib/data';
import { addToCart } from '@/lib/storage';
import { JsonLd } from '@/components/JsonLd';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'visiting-cards', label: 'Visiting Cards' },
    { id: 'flex-printing', label: 'Flex & Banners' },
    { id: 'sticker-label', label: 'Stickers & Labels' },
    { id: 'poster-printing', label: 'Posters & Frames' },
    { id: 'flyer-pamphlet', label: 'Flyers & Pamphlets' },
  ];

  const filtered = INITIAL_PRODUCTS.filter((prod) => {
    const matchesCat = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (product: typeof INITIAL_PRODUCTS[0]) => {
    addToCart({
      id: `prod-${product.id}-${Date.now()}`,
      type: 'standard_product',
      productId: product.id,
      title: product.name,
      image: product.images[0],
      quantity: 1,
      unitPrice: product.salePrice || product.basePrice,
      totalPrice: product.salePrice || product.basePrice,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Print Products Shop | Swarali Prints Nashik',
    itemListElement: INITIAL_PRODUCTS.map((prod, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: prod.name,
        image: prod.images[0],
        description: prod.shortDescription,
        offers: {
          '@type': 'Offer',
          price: prod.salePrice || prod.basePrice,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <JsonLd data={schema} />
      <Navbar />

      <main className="flex-grow py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header & Breadcrumb */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-pink-600">Home</Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold">Shop Products</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Ready-to-Order Print Products
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
              Standard package printing with quick delivery and store pickup in Cidco, Nashik. Need custom dimensions? Use our{' '}
              <Link href="/custom-printing" className="text-pink-600 font-bold hover:underline">
                Custom Printing Studio
              </Link>.
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-pink-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Products Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <p className="text-slate-500 text-sm">No products found matching your search.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-pink-600 text-white font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all flex flex-col group"
                >
                  <div className="relative h-60 bg-slate-100 overflow-hidden">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {prod.salePrice && (
                      <div className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow">
                        Save ₹{prod.basePrice - prod.salePrice}
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg shadow">
                      ⭐ {prod.rating} ({prod.reviewCount})
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                        <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {prod.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400">Price</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-slate-900">
                            ₹{prod.salePrice || prod.basePrice}
                          </span>
                          {prod.salePrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{prod.basePrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(prod)}
                          className={`p-2.5 rounded-xl transition-all ${
                            addedId === prod.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-pink-50 hover:bg-pink-600 text-pink-600 hover:text-white'
                          }`}
                          title="Add to Cart"
                        >
                          {addedId === prod.id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <ShoppingBag className="w-4 h-4" />
                          )}
                        </button>

                        <Link
                          href={`/products/${prod.slug}`}
                          className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                        >
                          Configure &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
