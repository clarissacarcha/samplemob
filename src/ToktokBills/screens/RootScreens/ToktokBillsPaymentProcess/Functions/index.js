const processErrorMessage = (fieldValue, fieldName, fieldWidth, fieldType, minWidth) => {
  // 0 = min | 1 = exact | 2 = max

  if (fieldValue.length < minWidth) {
    return `${fieldName} must be minimum of ${minWidth} characters`;
  }
  switch (fieldType) {
    case 0:
      return fieldValue.length < fieldWidth ? `${fieldName} must be minimum of ${fieldWidth} characters` : '';
    case 1:
      return fieldValue.length < fieldWidth ? `${fieldName} must be ${fieldWidth} characters in length` : '';
    case 2:
      return fieldValue.length > fieldWidth ? `${fieldName} length must be ${fieldWidth} characters or less` : '';

    default:
      return '';
  }
};

export const checkFirstField = (
  firstField,
  firstFieldName,
  firstFieldWidth,
  firstFieldWidthType,
  firstFieldMinWidth,
  setFirstFieldError,
) => {
  const errorMessage = processErrorMessage(
    firstField,
    firstFieldName,
    firstFieldWidth,
    firstFieldWidthType,
    firstFieldMinWidth,
  );
  firstField ? setFirstFieldError(errorMessage) : setFirstFieldError('This is a required field');
  return firstField ? !errorMessage : false;
};

export const checkSecondField = (
  secondField,
  secondFieldName,
  secondFieldWidth,
  secondFieldWidthType,
  secondFieldMinWidth,
  setSecondFieldError,
) => {
  const errorMessage = processErrorMessage(
    secondField,
    secondFieldName,
    secondFieldWidth,
    secondFieldWidthType,
    secondFieldMinWidth,
  );
  secondField ? setSecondFieldError(errorMessage) : setSecondFieldError('This is a required field');
  return secondField ? !errorMessage : false;
};
