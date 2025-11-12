import SharedConfig from "./SharedConfig";

export function formatMoney(amount: number): string {
    return SharedConfig.MoneyCurrencySymbol + (amount * SharedConfig.MoneyMultiplier).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}