//@ts-nocheck
const moment = require("moment");

const Path = require("path");
const aws = require("aws-sdk");
const sharp = require("sharp");
const request = require("request");
const short = require("short-uuid");

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCES_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

export default async ({ file, folder, thumbnailFolder }) => {
  let folderPath = "";
  if (folder) {
    folderPath = folder;
  }

  //deconstruct from awaiting the file
  const { createReadStream, filename, mimetype } = await file;

  //create a name for the file
  const timestamp = moment.now();
  const generatedName = `${timestamp}${short.generate().toUpperCase()}`;
  const extension = Path.extname(filename);
  const finalFilename = `${generatedName}${extension}`;

  //initiate stream from createReadStream
  const stream = createReadStream();

  //upload original image to S3
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: `${folderPath}${finalFilename}`,
    Body: stream,
    ContentType: mimetype,
  };
  const result = await s3.upload(params).promise();
  if (thumbnailFolder) {
    request(
      { url: result.Location, encoding: null },
      async (err, res, bodyBuffer) => {
        const resized = sharp(bodyBuffer).resize(50, 50);

        const params2 = {
          Bucket: process.env.AWS_BUCKET,
          Key: `${thumbnailFolder}${finalFilename}`,
          Body: resized,
          ContentType: mimetype,
        };
        const res2 = await s3.upload(params2).promise();
      }
    );
  }

  console.log("S3 UPLOAD: " + JSON.stringify(result, null, 2));

  return {
    path: result.Location,
    filename: finalFilename,
  };
};
