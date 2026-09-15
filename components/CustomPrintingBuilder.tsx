'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Printer,
  Sparkles,
  FileText,
  CreditCard,
  Tag,
  Clock,
  CheckCircle,
  HelpCircle,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  Palette,
} from 'lucide-react';
import { CustomJobConfig, CartItem } from '@/lib/types';
import { calculateCustomPrintPrice } from '@/lib/pricing';
import { addToCart } from '@/lib/storage';
import { buildWhatsAppCustomPrintLink } from '@/lib/whatsapp';
import FileUploader, { UploadedFileMeta } from './FileUploader';

interface CustomPrintingBuilderProps {
  initialService?: string;
}

export const CustomPrintingBuilder: React.FC<CustomPrintingBuilderProps> = ({
  initialService = 'flex-printing',
}) => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string>(initialService);

  // Form State
  const [widthFt, setWidthFt] = useState<number>(6);
  const [heightFt, setHeightFt] = useState<number>(3);
  const [quantity, setQuantity] = useState<number>(1);
  const [material, setMaterial] = useState<string>('Regular Flex (240 GSM)');
  const [selectedFinishing, setSelectedFinishing] = useState<string[]>([
    'Brass Eyelets (All Corners & Sides)',
    'Border Hemming (Reinforced)',
  ]);

  // Document states
  const [pageCount, setPageCount] = useState<number>(25);
  const [copies, setCopies] = useState<number>(1);
  const [paperSize, setPaperSize] = useState<string>('A4');
  const [paperType, setPaperType] = useState<string>('75 GSM JK Copier Paper');
  const [colorMode, setColorMode] = useState<'color' | 'bw'>('bw');
  const [duplex, setDuplex] = useState<'single' | 'double'>('double');
  const [binding, setBinding] = useState<string>('Spiral Binding with Transparent Cover');
  const [lamination, setLamination] = useState<string>('None');

  // Visiting card states
  const [cardQuantity, setCardQuantity] = useState<number>(500);
  const [cardStock, setCardStock] = useState<string>('350 GSM Matte Lamination');
  const [cardSides, setCardSides] = useState<'single' | 'double'>('double');
  const [cardFinish, setCardFinish] = useState<string[]>(['Standard Straight Corners']);

  // Common states
  const [designRequired, setDesignRequired] = useState<boolean>(false);
  const [instructions, setInstructions] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileMeta[]>([]);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  // Active config object
  const currentConfig: CustomJobConfig = useMemo(() => {
    return {
      serviceType: selectedService,
      widthFt,
      heightFt,
      quantity,
      material,
      finishing: selectedFinishing,
      pageCount,
      copies,
      paperSize,
      paperType,
      colorMode,
      duplex,
      binding,
      lamination,
      cardQuantity,
      cardStock,
      sides: cardSides,
      cardFinish,
      designRequired,
      instructions,
      uploadedFiles,
    };
  }, [
    selectedService,
    widthFt,
    heightFt,
    quantity,
    material,
    selectedFinishing,
    pageCount,
    copies,
    paperSize,
    paperType,
    colorMode,
    duplex,
    binding,
    lamination,
    cardQuantity,
    cardStock,
    cardSides,
    cardFinish,
    designRequired,
    instructions,
    uploadedFiles,
  ]);

  // Calculate pricing dynamically
  const pricing = useMemo(() => {
    return calculateCustomPrintPrice(currentConfig);
  }, [currentConfig]);

  const toggleFinishing = (item: string) => {
    setSelectedFinishing((prev) =>
      prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item]
    );
  };

  const handleAddToCart = () => {
    const serviceNames: Record<string, string> = {
      'flex-printing': `Custom Flex Banner (${widthFt}ft x ${heightFt}ft)`,
      'document-printing': `Custom Document Print (${pageCount} pgs × ${copies} copies)`,
      'visiting-cards': `Custom Visiting Cards (${cardQuantity} pcs)`,
      'sticker-label': `Custom Die-Cut Stickers (${quantity} pcs)`,
    };

    const cartItem: CartItem = {
      id: `custom-${Date.now()}`,
      type: 'custom_printing',
      serviceId: selectedService,
      title: serviceNames[selectedService] || 'Custom Print Job',
      image:
        selectedService === 'flex-printing'
          ? 'https://picsum.photos/seed/flexbanner/800/600'
          : selectedService === 'document-printing'
          ? 'https://picsum.photos/seed/documentprint/800/600'
          : selectedService === 'visiting-cards'
          ? 'https://picsum.photos/seed/visitingcard/800/600'
          : 'https://picsum.photos/seed/stickerprint/800/600',
      quantity: 1,
      unitPrice: pricing.total,
      totalPrice: pricing.total,
      customConfig: currentConfig,
      instructions,
    };

    addToCart(cartItem);
    setAddedNotice(true);
    setTimeout(() => {
      router.push('/cart');
    }, 400);
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Dynamic Print Configurator
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Configure Your Custom Print Job
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Choose your printing category, input sizes & specs, upload your design, and get instant transparent local pricing.
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400">Store Pickup at</div>
            <div className="text-sm font-bold text-lime-400">Trimurti Chowk, Cidco</div>
          </div>
        </div>

        {/* Step 1: Service Type Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          {[
            { id: 'flex-printing', label: 'Flex & Banner', icon: Printer },
            { id: 'document-printing', label: 'Document & Thesis', icon: FileText },
            { id: 'visiting-cards', label: 'Visiting Cards', icon: CreditCard },
            { id: 'sticker-label', label: 'Vinyl Stickers', icon: Tag },
          ].map((srv) => {
            const Icon = srv.icon;
            const isSelected = selectedService === srv.id;
            return (
              <button
                key={srv.id}
                type="button"
                onClick={() => setSelectedService(srv.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 scale-102'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{srv.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Form Left, Sticky Price Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
        {/* Left Options Area (7 or 8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Dynamic Service Specific Settings */}

          {/* 1. FLEX PRINTING FORM */}
          {selectedService === 'flex-printing' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  Banner Dimensions & Material
                </h3>
                <p className="text-xs text-slate-500">
                  Enter banner size in feet. We print up to 10 feet seamless width.
                </p>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Width (in Feet)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={widthFt}
                      onChange={(e) => setWidthFt(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 font-semibold text-slate-900"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                      ft
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Height (in Feet)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={heightFt}
                      onChange={(e) => setHeightFt(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 font-semibold text-slate-900"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                      ft
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Quick Dimension Presets */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Common Sizes:</span>
                {[
                  { w: 4, h: 3, label: '4x3 ft (Small Event)' },
                  { w: 6, h: 3, label: '6x3 ft (Shop Front)' },
                  { w: 8, h: 4, label: '8x4 ft (Standard Board)' },
                  { w: 10, h: 5, label: '10x5 ft (Large Stage)' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setWidthFt(preset.w);
                      setHeightFt(preset.h);
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                      widthFt === preset.w && heightFt === preset.h
                        ? 'border-pink-600 bg-pink-50 text-pink-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Material Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Flex Material Quality
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      name: 'Regular Flex (240 GSM)',
                      desc: 'Economical, ideal for temporary 1-3 month events',
                      rate: '₹12/sq.ft',
                    },
                    {
                      name: 'Star Flex (340 GSM Heavy)',
                      desc: 'Heavyweight, tear-resistant, vibrant Japanese inks',
                      rate: '₹18/sq.ft',
                      badge: 'Most Popular',
                    },
                    {
                      name: 'Blackout Flex (Block light)',
                      desc: '100% opaque back, prevents sunlight glare from behind',
                      rate: '₹24/sq.ft',
                    },
                    {
                      name: 'Backlit Glow Flex',
                      desc: 'Translucent for lightbox and illuminated shop signs',
                      rate: '₹35/sq.ft',
                    },
                  ].map((mat) => (
                    <div
                      key={mat.name}
                      onClick={() => setMaterial(mat.name)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        material === mat.name
                          ? 'border-pink-600 bg-pink-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-sm text-slate-900">{mat.name}</div>
                        <span className="text-xs font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                          {mat.rate}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{mat.desc}</p>
                      {mat.badge && (
                        <span className="inline-block mt-2 text-[10px] uppercase font-bold text-pink-600 bg-pink-100 px-1.5 py-0.5 rounded">
                          {mat.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Finishing Options */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Finishing & Border Preparation
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Brass Eyelets (All Corners & Sides)',
                    'Border Hemming (Reinforced)',
                    'Pocket for Pipes (Top & Bottom)',
                    'Wooden Frame Mount',
                  ].map((finish) => {
                    const isChecked = selectedFinishing.includes(finish);
                    return (
                      <button
                        type="button"
                        key={finish}
                        onClick={() => toggleFinishing(finish)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                          isChecked
                            ? 'border-blue-700 bg-blue-50/60 text-blue-900 font-semibold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                            isChecked
                              ? 'border-blue-700 bg-blue-700 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <CheckCircle className="w-3 h-3" />}
                        </span>
                        <span>{finish}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. DOCUMENT PRINTING FORM */}
          {selectedService === 'document-printing' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  Document, Thesis & Xerox Options
                </h3>
                <p className="text-xs text-slate-500">
                  Upload PDF and customize page count, paper quality, binding, and color mode.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Number of Pages
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={2000}
                    value={pageCount}
                    onChange={(e) => setPageCount(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Number of Copies
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={copies}
                    onChange={(e) => setCopies(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Color Mode
                  </label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setColorMode('bw')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        colorMode === 'bw' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      B&W (₹1.5)
                    </button>
                    <button
                      type="button"
                      onClick={() => setColorMode('color')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        colorMode === 'color' ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Color (₹6)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Print Sides
                  </label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setDuplex('single')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        duplex === 'single' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Single Sided
                    </button>
                    <button
                      type="button"
                      onClick={() => setDuplex('double')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        duplex === 'double' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Double Sided
                    </button>
                  </div>
                </div>
              </div>

              {/* Paper Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Paper Size & Type
                  </label>
                  <select
                    value={paperType}
                    onChange={(e) => setPaperType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="75 GSM JK Copier Paper">75 GSM JK Copier Paper (Standard)</option>
                    <option value="85 GSM Premium Bond">85 GSM Premium Bond Paper (+₹0.5)</option>
                    <option value="100 GSM Executive Paper">100 GSM Executive Paper (+₹1.0)</option>
                    <option value="300 GSM Gloss Paper">300 GSM Gloss Card Cover (+₹5.0)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Binding Style
                  </label>
                  <select
                    value={binding}
                    onChange={(e) => setBinding(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="None">None (Loose Sheets / Corner Staple)</option>
                    <option value="Spiral Binding with Transparent Cover">
                      Spiral Binding + Poly Cover (₹30)
                    </option>
                    <option value="Wiro Metal Binding">Wiro Twin-Loop Metal Ring (₹50)</option>
                    <option value="Hardcover Book Golden Thesis">
                      Hardcover Gold Lettering Thesis (₹150)
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 3. VISITING CARDS FORM */}
          {selectedService === 'visiting-cards' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  Visiting Card Specifications
                </h3>
                <p className="text-xs text-slate-500">
                  Printed on heavy 350 GSM or 400 GSM cardstock with high resolution offset quality.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Quantity (Cards)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[100, 500, 1000, 2000].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setCardQuantity(qty)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        cardQuantity === qty
                          ? 'border-pink-600 bg-pink-50/50 text-pink-700 font-extrabold shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-base">{qty}</div>
                      <div className="text-[10px] text-slate-400">Cards</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Card Stock & Feel
                  </label>
                  <select
                    value={cardStock}
                    onChange={(e) => setCardStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                  >
                    <option value="350 GSM Matte Lamination">350 GSM Matte Laminated (Standard)</option>
                    <option value="350 GSM Gloss Finish">350 GSM Gloss Finish</option>
                    <option value="400 GSM Velvet Touch (Soft)">
                      400 GSM Velvet Touch (+₹150)
                    </option>
                    <option value="Metallic Gold / Silver Card">
                      Metallic Shimmer Card (+₹250)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Print Sides
                  </label>
                  <select
                    value={cardSides}
                    onChange={(e) => setCardSides(e.target.value as 'single' | 'double')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                  >
                    <option value="single">Single Sided Print</option>
                    <option value="double">Double Sided Print</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 4. STICKERS & LABELS FORM */}
          {selectedService === 'sticker-label' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  Vinyl Stickers & Labels
                </h3>
                <p className="text-xs text-slate-500">
                  Custom contour cut stickers. Waterproof, scratch-proof, bottle and packaging safe.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Sticker Quantity
                  </label>
                  <input
                    type="number"
                    min={50}
                    step={25}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(50, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Minimum 50 pieces.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Vinyl Material
                  </label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                  >
                    <option value="White Gloss Vinyl (Waterproof)">
                      White Gloss Vinyl (100% Waterproof)
                    </option>
                    <option value="Matte Finish Vinyl">Matte Laminated Vinyl</option>
                    <option value="Clear Transparent Vinyl">Clear Transparent Vinyl</option>
                    <option value="Gold / Silver Mirror Vinyl">Metallic Foil Mirror Sticker</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* FILE UPLOAD SECTION (Mandatory UX requirement) */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Upload Your Print Files</h3>
                <p className="text-xs text-slate-500">
                  Upload your vector or high-resolution PDF, JPG, PNG, WEBP, or Word document.
                </p>
              </div>
            </div>

            <FileUploader onFilesChanged={(files) => setUploadedFiles(files)} />

            {/* Design Help Option */}
            <div
              onClick={() => setDesignRequired(!designRequired)}
              className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                designRequired
                  ? 'border-pink-600 bg-pink-50/50'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center flex-shrink-0 ${
                  designRequired
                    ? 'border-pink-600 bg-pink-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {designRequired && <CheckCircle className="w-3.5 h-3.5" />}
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-pink-600" />
                  <span>I need Swarali Prints designers to create/fix my layout (+₹150)</span>
                </div>
                <p className="text-slate-500 mt-0.5">
                  Don't have a final ready design? Our experienced graphic designers in Cidco will arrange your text, photos, logos, and send a proof for approval.
                </p>
              </div>
            </div>
          </div>

          {/* CUSTOM INSTRUCTIONS TEXTAREA (Requirement #7) */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <label className="block text-sm font-bold text-slate-900">
              Additional Printing Instructions
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Please keep 1 inch margin on all sides for wooden framing. Color tone should match the sample file. Please call before printing."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-slate-800 placeholder:text-slate-400"
            />
            <p className="text-[11px] text-slate-400">
              Mention specific margin requirements, paper shade preferences, or pickup time requests.
            </p>
          </div>
        </div>

        {/* Right Sticky Calculation Box (4 or 5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-24 bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600">
                Live Price Calculation
              </span>
              <h4 className="text-xl font-extrabold text-slate-900 mt-1">
                Estimated Order Total
              </h4>
              <p className="text-xs text-slate-500">
                Transparent Nashik local rates. Proof review included before printing.
              </p>
            </div>

            {/* Itemized Breakdown List */}
            <div className="space-y-2.5 text-xs text-slate-700">
              {pricing.itemizedBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-600 pr-2">{item.label}</span>
                  <span className="font-bold text-slate-900 whitespace-nowrap">
                    ₹{item.amount.toLocaleString()}
                  </span>
                </div>
              ))}

              {pricing.discount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-semibold py-1">
                  <span>Bulk Order Discount Applied</span>
                  <span>-₹{pricing.discount}</span>
                </div>
              )}
            </div>

            {/* Final Total Amount */}
            <div className="pt-2 border-t-2 border-slate-300">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Estimated Total</span>
                  <div className="text-3xl font-black text-slate-900">
                    ₹{pricing.total.toLocaleString()}
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-lime-700 bg-lime-100 px-2.5 py-1 rounded-full">
                  Tax Included
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                * Turnaround: 2-4 hours for Flex, 24 hours for visiting cards & stickers.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{addedNotice ? 'Added to Cart!' : 'Add to Cart & Checkout'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={buildWhatsAppCustomPrintLink(currentConfig, pricing.total)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Specs on WhatsApp</span>
              </a>
            </div>

            {/* Store Pickup & Security Badge */}
            <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Free pickup at Trimurti Chowk store</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Digital proof sent before printing starts</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Pay via UPI QR or Cash upon collection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPrintingBuilder;
