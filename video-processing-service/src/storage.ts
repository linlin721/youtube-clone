// include all Google cloud service file interactions
// include all the local file interactions
import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

const storage = new Storage();

const rawVideoBucketName = "dw-yt-raw-videos";
const processedVideoBucketName = "dw-yt-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

/**
 * Creates the local directories for raw and processed videos.
 */
export function setupDirectories() {
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}

/**
 * @param rawVideoName - the name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName = the name of the file to convert to {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video has benn converted.
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
            .outputOptions("-vf", "scale=-1:360")
            .on("end", function () {
                console.log("Processing finished sucessfully.");
                resolve();
            })
            .on("error", function (err: any) {
                console.log("An error occured: " + err.message);
                reject(err);
            })
            .save(`${localProcessedVideoPath}/${processedVideoName}`);

    });
}

/**
 * @param fileName - the name of the file neeeded to download from the {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({
            destination: `${localRawVideoPath}/${fileName}`,
        });

    console.log(
        `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
    );
}

/**
 * @param fileName - the name of the file is needed to upload from the {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    // upload video to the bucket
    await storage.bucket(processedVideoBucketName)
        .upload(
            `${localProcessedVideoPath}/${fileName}`,
            {destination: fileName,}
        );
    console.log(
        `${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`
    );

    // make the video to be publicly readable
    await bucket.file(fileName).makePublic();
}

/**
 * @param fileName - the name of the file to be deleted from the {@link localRawVideoPath} folder.
 * @returns a promise that resolves when the file is deleted.
 */
export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * @param fileName - the name of the file to be deleted from the {@link localProcessedVideoPath} folder.
 * @returns a promise that resolves when the file is deleted.
 */
export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * @param filePath - the path of the file is needed to delete.
 * @returns a promise that resolves when the file is deleted.
 */
function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Failed to delete the file at ${filePath}`, err);
                    reject(err);
                }
                else {
                    console.log(`File at ${filePath} is deleted.`);
                    resolve();
                }
            });
        } 
        else {
            console.log(`File not found at ${filePath}, skip.`);
            resolve();
        }
    });
}

/**
 * Ensure a directory exists, creating it if necessary.
 * @param {string} dirPath - The directory path to check.
 */
function ensureDirectoryExistence(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        // recursive:true enables creating nested directories
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created at ${dirPath}`);
    }
}