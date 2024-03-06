import express from 'express';

import{
    uploadProcessedVideo,
    downloadRawVideo,
    deleteRawVideo,
    deleteProcessedVideo,
    convertVideo,
    setupDirectories
} from './storage';
import { publicDecrypt } from 'crypto';

// first, create the local directories for videos
setupDirectories();

const app = express();
app.use(express.json());

// process video file from the Cloud Storage into 360p
app.post('/process-video', async (req, res) => {

    // get the bucket and filename from the Cloud Pub/Sub message
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message);

        if (!data.name) {
            throw new Error('Invalid messsage payload received.');
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send('Bad request: missing filename.');
    }

    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;

    // download the raw video from cloud storage
    await downloadRawVideo(inputFileName);

    // process the video into 360p
    try {
        await convertVideo(inputFileName, outputFileName)
    } catch (err) {
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);
        return res.status(500).send('Processing Failed.');
    }

    // upload the pocessed video to cloud storage
    await uploadProcessedVideo(outputFileName);

    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ]);

    return res.status(200).send('Finished processing sucessfully.');


});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// For manually video upload only
// import express from 'express';
// import ffmpeg from 'fluent-ffmpeg';  //use the tool outside the command line inside the typescript

// const app = express();
// app.use(express.json());

// app.post('/process-video', (req, res) => {
//     //get the path of the input video file from the request body
//     const inputFilePath = req.body.inputFilePath;
//     const outputFilePath = req.body.outputFilePath;

//     if (!inputFilePath) {
//         res.status(400).send("Bad Request: Missing Input File Path.");
//     };

//     if (!outputFilePath) {
//         res.status(400).send("Bad Request: Missing Output File Path.");
//     };

//     ffmpeg(inputFilePath)
//         .outputOptions('-vf', 'scale=-1:360') // convert to 360p
//         .on('end', function() {
//             console.log('Procsessing finished sucessfully.');
//             res.status(200).send("Video processing sucessfully.");
//         })
//         .on("error", function(err: any) {
//             console.log('An error occurred: '+ err.message);
//             res.status(500).send(`Internal Server Error: ${err.message}`);
//         })
//         .save(outputFilePath);
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(
//         `Video processing service is listening at http://localhost:${port}`
//     );
// });