export const maskedMobileNo = number => {
  let masked = '';
  for (let x = 0; x < number.length; x++) {
    masked += x >= 6 && x <= 9 ? '*' : number[x];
  }
  return masked;
};
