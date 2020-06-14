"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlUtility = void 0;
class MysqlUtility {
    static bindValues(query, values) {
        let i = 0;
        return query.replace(/\?/g, function () {
            return values[i++];
        });
    }
    static mergeLines(stringlines) {
        let query = "";
        stringlines.forEach((element) => {
            query = query + " " + element + " ";
        });
        return query;
    }
}
exports.MysqlUtility = MysqlUtility;
