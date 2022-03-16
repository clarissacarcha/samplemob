export const numberFormat = value => {
  if (isNaN(value)) {
    return 'isNaN';
  }
  return parseFloat(value)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export const numberFormatInteger = value => {
  if (isNaN(value)) {
    return 'isNaN';
  }
  return parseFloat(value)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,')
    .replace('.00', '');
};
export const currencyCode = "₱";