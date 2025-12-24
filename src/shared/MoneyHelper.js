import SharedConfig from './SharedConfig';
export function formatMoney(amount) {
    const isMinus = amount < 0;
    amount = Math.abs(amount);
    return (isMinus ? '- ' : '') + SharedConfig.MoneyCurrencySymbol + (amount * SharedConfig.MoneyMultiplier).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
export function parseMoney(formattedAmount, divideByMultiplier = true) {
    const numericString = formattedAmount.replace(SharedConfig.MoneyCurrencySymbol, '').replace(/,/g, '');
    const multiplier = divideByMultiplier ? SharedConfig.MoneyMultiplier : 1;
    return parseFloat(numericString) / multiplier;
}
