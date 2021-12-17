export const alphanumericRegex = (input) => {
  const regex = /^(?!\s)(?![\s\S]*\s$)[a-zA-Z\s]+$/g;
  const result = regex.test(input);
  const replaceValue = input.length > 1 ? input : input.substring(0,input.length - 1)
  const finalInput = !result ? replaceValue : input;
 
  return finalInput
}
export const numericRegex = (input) => {
  return input.replace(/[^0-9]/g, "");
}

export const maxLengthRegex = (input, length) => {
  const expression = `^.{0,${length}}$`;
  const regex = new RegExp(expression, 'g');
  const isValid = regex.test(input);
  input = isValid ? input : input.replace(/.$/,"")
 
  return input
}
