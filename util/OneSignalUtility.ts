const OneSignal = require("onesignal-node");

// const client = new OneSignal.Client(
//   process.env.CONSUMER_ONESIGNAL_APP_ID,
//   process.env.CONSUMER_ONESIGNAL_REST_API_KEY
// );

const client = {
  C: new OneSignal.Client(
    process.env.CONSUMER_ONESIGNAL_APP_ID,
    process.env.CONSUMER_ONESIGNAL_REST_API_KEY
  ),
  D: new OneSignal.Client(
    process.env.DRIVER_ONESIGNAL_APP_ID,
    process.env.DRIVER_ONESIGNAL_REST_API_KEY
  ),
};

export default class {
  static pushToUserId = async ({ userId, title, body, data }, appFlavor) => {
    try {
      const response = await client[appFlavor].createNotification({
        headings: {
          en: title,
        },
        contents: {
          en: body,
        },
        filters: [
          { field: "tag", key: "userId", relation: "=", value: userId },
        ],
        ...(data ? { data } : null),
      });
      //response.body.id
      console.log("OneSignal: " + response.body.id);
    } catch (error) {
      console.log(error);
    }
  };

  static broadcast = async ({ appFlavor, title, body, data }) => {
    try {
      const response = await client[appFlavor].createNotification({
        headings: {
          en: title,
        },
        contents: {
          en: body,
        },
        ...(data ? { data } : null),
        included_segments: ["Subscribed Users"],
      });
      console.log("OneSignal: " + response.body.id);
    } catch (error) {
      console.log(error);
    }
  };

  static pushToSegments = async ({ segments, title, body }, APP_FLAVOR) => {
    try {
      const response = await client[APP_FLAVOR].createNotification({
        headings: {
          en: title,
        },
        contents: {
          en: body,
        },
        included_segments: segments,
        // included_segments: ["Subscribed Users"],
      });
    } catch (error) {
      console.log(error);
    }
  };

  static pushToPlayerIds = async ({ playerIds, title, body }, APP_FLAVOR) => {
    try {
      const response = await client[APP_FLAVOR].createNotification({
        headings: {
          en: title,
        },
        contents: {
          en: body,
        },
        include_player_ids: playerIds,
        // include_player_ids: ["a832200e-7523-4048-b43f-8b4a9be84d17"],
      });
    } catch (error) {
      console.log(error);
    }
  };
}
