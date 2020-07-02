import IORedis from "ioredis";
const redis = new IORedis();

redis.on("error", function (err) {
  console.log("REDIS ERROR: " + err);
});

// Used to store 6 digit verification code for registration
export const REDIS_LOGIN_REGISTER = () => {
  redis.select(1);
  return redis;
};

// Used to store 6 digit verification code for password reset
export const REDIS_FORGOT_PASSWORD = () => {
  redis.select(2);
  return redis;
};

export const TEST = async () => {
  try {
    await REDIS_LOGIN_REGISTER().set("key", "REGISTER", "EX", "120");
    let keyValue = await REDIS_LOGIN_REGISTER().get("key");
    console.log("REDIS:", keyValue);
    await REDIS_LOGIN_REGISTER().del("key");
    keyValue = await REDIS_LOGIN_REGISTER().get("key");
    console.log("REDIS:", keyValue);
  } catch (error) {
    console.log(error);
  }
};
