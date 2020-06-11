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
exports.default = ({ file, folder, thumbnailFolder }) => __awaiter(void 0, void 0, void 0, function* () {
    let folderPath = "";
    if (folder) {
        folderPath = folder;
    }
    //deconstruct from awaiting the file
    const { createReadStream, filename, mimetype } = yield file;
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
    const result = yield s3.upload(params).promise();
    if (thumbnailFolder) {
        request({ url: result.Location, encoding: null }, (err, res, bodyBuffer) => __awaiter(void 0, void 0, void 0, function* () {
            const resized = sharp(bodyBuffer).resize(50, 50);
            const params2 = {
                Bucket: process.env.AWS_BUCKET,
                Key: `${thumbnailFolder}${finalFilename}`,
                Body: resized,
                ContentType: mimetype,
            };
            const res2 = yield s3.upload(params2).promise();
        }));
    }
    console.log("S3 UPLOAD: " + JSON.stringify(result, null, 2));
    return {
        path: result.Location,
        filename: finalFilename,
    };
});
