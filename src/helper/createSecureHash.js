import SHA256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';

export const createSecureHash = (data, secret) => {

    // console.log(SHA256(JSON.stringify({ name: 'Alvir', secret: '123' })).toString(Base64));

    const withSecret = JSON.stringify({
        ...data,
        secret
    });

    const withoutSecret = JSON.stringify({
        ...data
    });


    const prefixUtf8 = Utf8.parse(withoutSecret);
    const prefix = Base64.stringify(prefixUtf8);

    const suffix = SHA256(withSecret).toString(Base64);

    // const prefix = Buffer.from(withoutSecret).toString('base64')
    // const suffix = crypto.createHash('sha256').update(withSecret).digest('base64');

    const secureHash = `${prefix}.${suffix}`;

    console.log(secureHash);

    return secureHash
}