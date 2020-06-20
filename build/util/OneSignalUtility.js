"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const OneSignal = require("onesignal-node");
const client = new OneSignal.Client(process.env.ONESIGNAL_APP_ID, process.env.ONESIGNAL_REST_API_KEY);
class default_1 {
}
exports.default = default_1;
default_1.pushToUserId = ({ userId, title, body, data }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield client.createNotification(Object.assign({ headings: {
                en: title,
            }, contents: {
                en: body,
            }, filters: [
                { field: "tag", key: "userId", relation: "=", value: userId },
            ] }, (data ? { data } : null)));
        //response.body.id
        console.log("OneSignal: " + response.body.id);
    }
    catch (error) {
        console.log(error);
    }
});
default_1.pushToSegments = ({ segments, title, body }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield client.createNotification({
            headings: {
                en: title,
            },
            contents: {
                en: body,
            },
            included_segments: segments,
        });
    }
    catch (error) {
        console.log(error);
    }
});
default_1.pushToPlayerIds = ({ playerIds, title, body }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield client.createNotification({
            headings: {
                en: title,
            },
            contents: {
                en: body,
            },
            include_player_ids: playerIds,
        });
    }
    catch (error) {
        console.log(error);
    }
});
