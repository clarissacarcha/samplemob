export class MysqlUtility {
  static bindValues(query: any, values: any) {
    let i = 0;
    return query.replace(/\?/g, function () {
      return values[i++];
    });
  }

  static mergeLines(stringlines: any) {
    let query = "";
    stringlines.forEach((element: any) => {
      query = query + " " + element + " ";
    });
    return query;
  }
}
