import IORedis from 'ioredis';
const redis = new IORedis();

redis.on("error", function (err) {
    console.log("REDIS ERROR: " + err);
});

// Used to store temporary tokens on user registration
export const REDIS_REGISTRATION = () => {
    redis.select(1);
    return redis;
}

// Tokens used to create and validate one time links. Value is userId of Enterprise. 
export const ONE_TIME_LINK_TOKEN = () => {
    redis.select(2);
    return redis;
}

export const TEST = async () => {
    try {
        
        await REDIS_REGISTRATION().set('key', 'REGISTER', 'EX', '120');
        let keyValue = await REDIS_REGISTRATION().get('key');
        console.log('REDIS:', keyValue);
        await REDIS_REGISTRATION().del('key');
        keyValue = await REDIS_REGISTRATION().get('key');
        console.log('REDIS:', keyValue);        
    }
    catch (error) {
        console.log(error);
    }
}