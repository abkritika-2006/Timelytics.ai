/**
 * Number formatting utility for Timelytics.ai
 * Formats numbers to single decimal place with specific rounding rules:
 * - If decimal >= 0.5, round up
 * - If decimal < 0.5, round down
 * Examples: 68.65788 → 68.7, 68.47789 → 68.4
 */

export const formatNumber = (value: number): string => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0.0';
  }

  // Get the integer part and decimal part
  const integerPart = Math.floor(Math.abs(value));
  const decimalPart = Math.abs(value) - integerPart;
  
  // Determine the single decimal digit
  let roundedDecimal = Math.floor(decimalPart * 10);
  
  // Check if we need to round up based on the second decimal place
  const secondDecimalPlace = Math.floor((decimalPart * 100) % 10);
  if (secondDecimalPlace >= 5) {
    roundedDecimal += 1;
    if (roundedDecimal >= 10) {
      // Handle overflow (e.g., 9.95 becomes 10.0)
      return value < 0 ? `-${integerPart + 1}.0` : `${integerPart + 1}.0`;
    }
  }
  
  const sign = value < 0 ? '-' : '';
  return `${sign}${integerPart}.${roundedDecimal}`;
};

export const formatPercentage = (value: number): string => {
  const formatted = formatNumber(value);
  return `${formatted}%`;
};

export const formatDecimal = (value: number, decimals: number = 1): string => {
  if (decimals === 1) {
    return formatNumber(value);
  }
  
  // For other decimal places, use standard rounding
  return value.toFixed(decimals);
};

// Additional formatting utilities
export const formatCurrency = (value: number, currency: string = '₹'): string => {
  const formatted = formatNumber(value);
  return `${currency}${formatted}`;
};

export const formatTime = (hours: number): string => {
  const formatted = formatNumber(hours);
  return `${formatted}h`;
};

export const formatRatio = (numerator: number, denominator: number): string => {
  if (denominator === 0) return '0.0';
  const ratio = (numerator / denominator) * 100;
  return formatPercentage(ratio);
};