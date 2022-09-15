export const numberFormat = (value, decimallNum = 2) => {
  if (isNaN(value)) {
    return 'isNaN';
  }
  return parseFloat(value)
    .toFixed(decimallNum)
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

export const numFormatter = num => {
  if (Math.abs(num) >= 10000 && num < 1000000) {
    return Math.sign(num) * (Math.abs(num) / 1000).toFixed(5) + 'K';
  } else if (num >= 1000000) {
    return Math.sign(num) * (Math.abs(num) / 10000).toFixed(5) + 'M';
  } else {
    return (Math.sign(num) * Math.abs(num)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};
