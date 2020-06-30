//@ts-nocheck
import OneSignalUtility from "./OneSignalUtility";

export default class {
  static notifyConsumers = ({ title, body }) => {
    OneSignalUtility.broadcast({
      appFlavor: "C",
      title,
      body,
      data: {
        type: "ANNOUNCEMENT",
      },
    });
  };

  static notifyDrivers = ({ title, body }) => {
    OneSignalUtility.broadcast({
      appFlavor: "D",
      title,
      body,
      data: {
        type: "ANNOUNCEMENT",
      },
    });
  };
}
