import translate from "../Translation/Translation";
export const MoneyLogType = {
    Unknown: 0,
    Salary: 1,
    Purchase: 2,
    ATMDeposit: 3,
    ATMWithdraw: 4,
    Transfer: 5
};
export const MoneyLogTypeNames = {
    [MoneyLogType.Unknown]: translate('moneyLog.type.unknown'),
    [MoneyLogType.Salary]: translate('moneyLog.type.salary'),
    [MoneyLogType.Purchase]: translate('moneyLog.type.purchase'),
    [MoneyLogType.ATMDeposit]: translate('moneyLog.type.atmDeposit'),
    [MoneyLogType.ATMWithdraw]: translate('moneyLog.type.atmWithdraw'),
    [MoneyLogType.Transfer]: translate('moneyLog.type.transfer')
};
export const MoneyLogTypeIcons = {
    [MoneyLogType.Unknown]: 'dollar-sign',
    [MoneyLogType.Salary]: 'dollar-sign',
    [MoneyLogType.Purchase]: 'shopping-cart',
    [MoneyLogType.ATMDeposit]: 'arrow-down',
    [MoneyLogType.ATMWithdraw]: 'arrow-up',
    [MoneyLogType.Transfer]: 'arrow-right-left'
};
export const MoneyLogTypeColors = {
    [MoneyLogType.Unknown]: '76, 175, 80',
    [MoneyLogType.Salary]: '76, 175, 80',
    [MoneyLogType.Purchase]: '255, 152, 0',
    [MoneyLogType.ATMDeposit]: '33, 150, 243',
    [MoneyLogType.ATMWithdraw]: '244, 67, 54',
    [MoneyLogType.Transfer]: '156, 39, 176'
};
export const MoneyLogTypeColorsLight = {
    [MoneyLogType.Unknown]: '139, 195, 74',
    [MoneyLogType.Salary]: '139, 195, 74',
    [MoneyLogType.Purchase]: '255, 193, 7',
    [MoneyLogType.ATMDeposit]: '100, 181, 246',
    [MoneyLogType.ATMWithdraw]: '239, 83, 80',
    [MoneyLogType.Transfer]: '180, 91, 198'
};
