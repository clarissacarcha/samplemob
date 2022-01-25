export const formatAmount = (value,setAmount)=> {
    const num = value.replace(/[^0-9.]/g, '')
    const checkFormat = /^(\d*[.]?[0-9]{0,2})$/.test(num);
    if(!checkFormat) return       
    let decimalValueArray = num.split(".")
    if(decimalValueArray[0].length > 6) return
    if(num[0] == ".") return setAmount("0.")
    setAmount(num)
}