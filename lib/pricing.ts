import { CustomJobConfig } from './types';

export interface PriceBreakdownItem {
  label: string;
  amount: number;
}

export interface PricingResult {
  baseAmount: number;
  itemizedBreakdown: PriceBreakdownItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  isEstimated: boolean;
}

/**
 * Dynamic Pricing Engine for Swarali Prints
 * Calculates accurate print costs based on specifications, dimensions, materials, and finishing
 */
export function calculateCustomPrintPrice(config: CustomJobConfig): PricingResult {
  const breakdown: PriceBreakdownItem[] = [];
  let baseAmount = 0;

  switch (config.serviceType) {
    case 'flex-printing': {
      const width = Number(config.widthFt) || 2;
      const height = Number(config.heightFt) || 2;
      const sqft = Math.max(1, width * height);
      const qty = Math.max(1, Number(config.quantity) || 1);

      // Material rate per sq ft
      let ratePerSqFt = 12; // Regular flex
      if (config.material?.includes('Star Flex')) {
        ratePerSqFt = 18;
      } else if (config.material?.includes('Blackout')) {
        ratePerSqFt = 24;
      } else if (config.material?.includes('Backlit')) {
        ratePerSqFt = 35;
      }

      const printingCost = sqft * ratePerSqFt * qty;
      baseAmount = printingCost;
      breakdown.push({
        label: `Flex Print (${width}ft × ${height}ft = ${sqft} sq.ft @ ₹${ratePerSqFt}/sq.ft × ${qty})`,
        amount: printingCost,
      });

      // Finishing charges
      if (config.finishing && config.finishing.length > 0) {
        config.finishing.forEach((finish) => {
          let finishCost = 0;
          if (finish.includes('Eyelets')) {
            finishCost = 20 * qty;
          } else if (finish.includes('Hemming')) {
            finishCost = 25 * qty;
          } else if (finish.includes('Pocket')) {
            finishCost = 40 * qty;
          } else if (finish.includes('Wooden Frame')) {
            finishCost = sqft * 15 * qty;
          }
          if (finishCost > 0) {
            breakdown.push({ label: `${finish} (x${qty})`, amount: finishCost });
          }
        });
      }
      break;
    }

    case 'document-printing': {
      const pages = Math.max(1, Number(config.pageCount) || 1);
      const copies = Math.max(1, Number(config.copies) || 1);
      const totalPages = pages * copies;

      let pageRate = config.colorMode === 'color' ? 6.0 : 1.5;
      if (config.paperType?.includes('Executive') || config.paperType?.includes('100 GSM')) {
        pageRate += 1.0;
      } else if (config.paperType?.includes('300 GSM')) {
        pageRate += 5.0;
      }

      if (config.paperSize === 'A3') {
        pageRate *= 2;
      }

      const printCost = totalPages * pageRate;
      baseAmount = printCost;
      breakdown.push({
        label: `${pages} Pages × ${copies} Copies (${config.colorMode === 'color' ? 'Full Color' : 'B&W'}, ${config.paperSize || 'A4'})`,
        amount: printCost,
      });

      // Binding
      if (config.binding && config.binding !== 'None') {
        let bindingCost = 30 * copies;
        if (config.binding.includes('Hardcover') || config.binding.includes('Book')) {
          bindingCost = 150 * copies;
        } else if (config.binding.includes('Wiro')) {
          bindingCost = 50 * copies;
        }
        breakdown.push({ label: `${config.binding} (x${copies})`, amount: bindingCost });
      }

      // Lamination
      if (config.lamination && config.lamination !== 'None') {
        const lamCost = 15 * pages * copies;
        breakdown.push({ label: `${config.lamination}`, amount: lamCost });
      }
      break;
    }

    case 'visiting-cards': {
      const qty = Number(config.cardQuantity) || 100;
      let cardBase = 250;
      if (qty === 500) cardBase = 900;
      else if (qty === 1000) cardBase = 1500;
      else if (qty === 2000) cardBase = 2700;

      if (config.sides === 'double') {
        cardBase *= 1.25;
      }

      if (config.cardStock?.includes('Velvet')) {
        cardBase += 150 * (qty / 100);
      } else if (config.cardStock?.includes('Metallic')) {
        cardBase += 250 * (qty / 100);
      }

      baseAmount = cardBase;
      breakdown.push({
        label: `Visiting Cards (${qty} pcs, ${config.sides === 'double' ? 'Double Sided' : 'Single Sided'})`,
        amount: cardBase,
      });

      if (config.cardFinish && config.cardFinish.length > 0) {
        config.cardFinish.forEach((finish) => {
          let finishCost = 80 * (qty / 100);
          if (finish.includes('Spot UV')) finishCost = 250 * (qty / 100);
          if (finish.includes('Foil')) finishCost = 350 * (qty / 100);
          breakdown.push({ label: finish, amount: finishCost });
        });
      }
      break;
    }

    case 'sticker-label': {
      const qty = Math.max(50, Number(config.quantity) || 50);
      const ratePerSticker = qty >= 500 ? 2.2 : qty >= 200 ? 3.0 : 4.0;
      const stickerCost = Math.round(qty * ratePerSticker);
      baseAmount = stickerCost;
      breakdown.push({
        label: `Die-Cut Stickers (${qty} pcs @ ₹${ratePerSticker.toFixed(1)}/pc)`,
        amount: stickerCost,
      });
      break;
    }

    default: {
      const qty = Math.max(1, Number(config.quantity) || 1);
      baseAmount = 150 * qty;
      breakdown.push({ label: `Custom Print Job (Qty: ${qty})`, amount: baseAmount });
      break;
    }
  }

  // Design Fee if requested
  if (config.designRequired) {
    breakdown.push({
      label: 'Professional Graphic Design Assistance',
      amount: 150,
    });
  }

  const subtotal = breakdown.reduce((acc, item) => acc + item.amount, 0);

  // Bulk Discount tiers
  let discount = 0;
  if (subtotal >= 2000) {
    discount = Math.round(subtotal * 0.1); // 10% for large bulk orders
  } else if (subtotal >= 1000) {
    discount = Math.round(subtotal * 0.05); // 5%
  }

  const total = Math.max(0, subtotal - discount);

  return {
    baseAmount,
    itemizedBreakdown: breakdown,
    subtotal,
    discount,
    tax: 0, // In India, print small business threshold under 20L exempt or tax inclusive
    total,
    isEstimated: true,
  };
}
