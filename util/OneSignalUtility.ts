const OneSignal = require("onesignal-node");

const client = new OneSignal.Client(
  process.env.ONESIGNAL_APP_ID,
  process.env.ONESIGNAL_REST_API_KEY
);

export default class {
  static pushToUserId = async ({ userId, title, body, data }) => {
    try {
      const response = await client.createNotification({
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

  static pushToSegments = async ({ segments, title, body }) => {
    try {
      const response = await client.createNotification({
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

  static pushToPlayerIds = async ({ playerIds, title, body }) => {
    try {
      const response = await client.createNotification({
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
