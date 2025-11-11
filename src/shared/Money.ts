export const moneyCurrencySymbol = '$';
export const moneyCurrencyCode = 'USD';
export const moneyMultiplier = 1; // For future use with different currencies

export function formatMoney(amount: number): string {
    return moneyCurrencySymbol + (amount * moneyMultiplier).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}