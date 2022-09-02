export const groupByName = arr => {
  const map = arr.reduce((acc, val) => {
    let char = val.name.charAt(0).toUpperCase();

    acc[char] = [].concat(acc[char] || [], {name: val.name, number: val.number});
    return acc;
  }, {});
  const res = Object.keys(map).map(el => ({
    letter: el,
    contacts: map[el],
  }));
  return res;
};

export const isObjEmpty = obj => obj === null || Object.keys(obj).length === 0;
export const isItemEmpty = item =>
  item === undefined ||
  item === '' ||
  (Array.isArray(item) && item.every(isItemEmpty)) ||
  (typeof item === 'object' && isObjEmpty(item));
