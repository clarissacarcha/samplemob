export const roundToDecimal = (num,decimalplace)=> {   
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?!=\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }

    let dec =  +(Math.round(num + `e+${decimalplace}`)  + `e-${decimalplace}`);
    return numberWithCommas(dec)

}

export const MoneyCommaFormat = (num,decimalplace)=> {
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?!=\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }

    let dec =  +(Math.round(num + `e+${decimalplace}`)  + `e-${decimalplace}`);
    return numberWithCommas(dec)
}


export const MaskLeftZero = (value = "" , length = 12) => {
    let maskZero = ""
    const maskZeroLength = length - value.toString().length
    
    for(let x = 0 ; x < maskZeroLength ; x++){
        maskZero = maskZero + "0"
    }

    return `${maskZero}${value}`
}
