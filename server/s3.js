const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("../secrets");
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("No file, something went wrong with multer");
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "onionimageboard", //<--my bucket in AWS
            ACL: "public-read",
            Key: req.session.userId + "/" + filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise(); //this is the code responsible to upload to the cloud AWS

    promise
        .then(() => {
            next();
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            console.log("NO, the IMG IS NOT in the cloud...", err);
            return res.sendStatus(500);
        });
};

module.exports.delete = (req, res, next) => {
    let params = {
        Bucket: "onionimageboard",
        Prefix: req.session.userId.toString() + "/",
    };

    let eachObj = [];

    let params2 = {
        Bucket: "onionimageboard",
        Delete: {
            Objects: eachObj,
            Quiet: false,
        },
    };

    const promise1 = s3.listObjects(params).promise();

    promise1
        .then((data) => {
            data.Contents.forEach((element) => {
                eachObj.push({
                    Key: element.Key,
                });
            });
            
        })
        .then(() => {
           
            if (params2.Delete.Objects.length) {
                
                s3.deleteObjects(params2)
                    .promise()
                    .then((data) => {
                        console.log("i am deleting", data);
                        next();
                    })
                    .catch((err) => {
                        console.log("It was impossible to delete it", err);
                        return res.sendStatus(500);
                    });
            } else {
                next();
            }
        })

        .catch((err) => {
            console.log("Sorry, you didnt do it well!!!!t", err);
            return res.sendStatus(500);
        });
};
