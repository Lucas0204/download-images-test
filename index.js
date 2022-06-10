const express = require('express');
const archiver = require('archiver');
const stream = require('stream');
const app = express();

async function* genTest() {
    const keys = [];

    for (let key of keys) {
        const image = await s3.getObject({
            Bucket: '',
            Key: key
        }).promise();
    
        yield {
            key,
            buffer: image.Body
        };
    }

    return;
}

app.use(require('express-status-monitor')());

app.get('/download', async (req, res) => {
    console.time();
    res.set("Content-Type", "application/octet-stream");
    res.set("Content-Disposition", "attachment;filename=images.zip");

    const generator = genTest();
    let archive = archiver('zip');

    archive.pipe(res);

    let image;

    do {
        image = await generator.next();

        if (image.done) break;

        // console.log(image.value.key);

        const imageStream = new stream.PassThrough();
        imageStream.end(image.value.buffer);

        archive.append(imageStream, { name: image.value.key });
    } while (!image.done);

    archive.finalize();
    console.timeEnd();
});

async function genTest2() {
    const keys = [];

    let images = [];

    for (let key of keys) {
        const image = await s3.getObject({
            Bucket: '',
            Key: key
        }).promise();
    
        images.push({
            key,
            buffer: image.Body
        });
    }

    return images;
}

// app.get('/download', async (req, res) => {
//     console.time();
//     res.set("Content-Type", "application/octet-stream");
//     res.set("Content-Disposition", "attachment;filename=images.zip");

//     const images = await genTest2();
//     let archive = archiver('zip');

//     archive.pipe(res);
//     // archive.on('data', (data) => console.log(data));

//     let image;

//     for (image of images) {
//         const imageStream = new stream.PassThrough();
//         imageStream.end(image.buffer);

//         archive.append(imageStream, { name: image.key });
//     }

//     archive.finalize();
//     console.timeEnd();
// });

app.listen(3000, () => console.log(`running...`));
