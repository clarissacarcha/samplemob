"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
