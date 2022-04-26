export const maskLeftZero = (value = "" , length = 12) => {
    let maskZero = ""
    const maskZeroLength = length - value.toString().length
    
    for(let x = 0 ; x < maskZeroLength ; x++){
        maskZero = maskZero + "0"
    }

    return `${maskZero}${value}`
}