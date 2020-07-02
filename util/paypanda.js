require('dotenv').config();
import hexdec from 'locutus/php/math/hexdec';
import chr from 'locutus/php/strings/chr';
import crypto from 'crypto';

const merchantSecret = '12345'
const merchantId = 'PAYGO'



// String to be used for creating signature to request to paypanda transaction entry
const generateRequestString = ({ amount, referenceNumber }) => {
    const str = `${merchantSecret}${merchantId}${referenceNumber}${Math.round(amount)}PHP`;
    const noDot = str.replace(/\./gi, '');
    const noComma = noDot.replace(/\,/gi, '');
    return noComma;
}
// String to be used for creating signature to validate paypanda postback
const generatePostbackString = ({ reference_number, paypanda_refno, paid_amount, payment_status }) => {
    const str = `${reference_number}${paypanda_refno}${payment_status}${Math.round(paid_amount)}${merchantSecret}`;

    const noDot = str.replace(/\./gi, '');
    const noDotComma = noDot.replace(/\,/gi, '');
    return noDotComma;
}

const generateSignature = (src) => {
    const hash = crypto.createHash('sha256');
    const hashed = hash.update(binarize(src), 'ascii').digest('hex');
    return Buffer.from(hashed).toString('base64');
}

const binarize = (src) => {
    let res = ''
    for (let i = 0; i < src.length; i++) {
        const sliced = src.substr(i, 2);
        const hexed = hexdec(sliced, 16);
        const phpHexed = isNaN(hexed) ? 0 : hexed;
        const chred = chr(phpHexed);
        res += chred;
    }
    return res;
}

const createSignature = (args) => {
    const signature = generateSignature(generateRequestString(args))
    return signature;
}

const verifySignature = (args) => {
    const signature = generateSignature(generatePostbackString(args));
    console.log('EXPECTED VERIFY SIGNATURE: ' + signature);
    console.log('PROVIDED VERIFY SIGNATURE: ' + args.signature);
    return signature == args.signature ? true : false;
}

export const PayPanda = {
    createSignature,
    verifySignature
}