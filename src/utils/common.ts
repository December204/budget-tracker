export const formatNumber = (number?: number, fractionDigits?: number) => {
  return (number ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits ?? 2,
    maximumFractionDigits: fractionDigits ?? 2,
  });
};

export const formatVND = (amount: number): string =>
  amount.toLocaleString('vi-VN') + ' ₫';

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};
