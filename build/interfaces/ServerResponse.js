"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerResponse = void 0;
class ServerResponse {
    constructor(statustype, data) {
        this.statusType = statustype;
        this.dataResponse = data;
    }
    sendResponse() {
        let response = {
            statustype: this.statusType,
            data: this.dataResponse
        };
        return response;
    }
}
exports.ServerResponse = ServerResponse;
