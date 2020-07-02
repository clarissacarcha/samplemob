//@ts-nocheck
require("dotenv").config();

export const ConsoleLog = (value: any) => {
  if (process.env.NODE_ENV != "development") {
    return;
  }

  const root = "toktok-server";
  const paths = __filename.split("/");
  const rootIndex = paths.indexOf(root);
  paths.splice(0, rootIndex);
  const path = paths.join("/");
  console.log(path);
};
