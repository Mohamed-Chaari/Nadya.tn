export function formatPrice(amount: number): string {
  const isWhole = Number.isInteger(amount);
  const formatted = amount.toLocaleString("fr-FR", {
    minimumFractionDigits: isWhole ? 0 : 3,
    maximumFractionDigits: 3,
  });
  return `${formatted} DT`;
}
