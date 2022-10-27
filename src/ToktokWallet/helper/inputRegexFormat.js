export const alphanumericRegex = input => {
  return input.replace(/[^A-Za-z0-9 ]/g, '');
};
export const numericRegex = input => {
  return input.replace(/[^0-9]/g, '');
};

export const maxLengthRegex = (input, length) => {
  const expression = `^.{0,${length}}$`;
  const regex = new RegExp(expression, 'g');
  const isValid = regex.test(input);
  input = isValid ? input : input.replace(/.$/, '');

  return input;
};
