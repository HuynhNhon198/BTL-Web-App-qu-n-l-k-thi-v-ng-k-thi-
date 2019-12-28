const admin = require('firebase-admin');
const bucket = admin.storage().bucket();

const BitlyClient = require('bitly').BitlyClient;
const bitly = new BitlyClient('9f21d9288935a8658d9adc3e64f44abb4105844a');

const userModel = require('../models/user');
exports.get_all_students = (req, res) => {
    userModel.get_all_students().then(data => {
        res.status(200).json(data);
    }).catch(err => res.status(500).json({
        message: err
    }));
}

exports.add_students = async (req, res) => {
    // console.log(req.body);
    // res.status(200).json({
    //     data: req.body
    // });
    userModel.import_students(req.body.data).then((result) => {
        console.log(result);
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    })
}

exports.get_all = () => {
    userModel.list_user()
}

exports.get_email = (req, res) => {
    console.log(req.query.username);
    userModel.get_email(req.query.username).then((result) => {
        console.log(result);
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    })
}

exports.test_upload = async (req, res) => {
    console.log(req.file.buffer);
    const directory = 'pics';
    const fileName = 'abc.jpg'
    const fullPath = `${directory}/${fileName}`;

    const bucketFile = bucket.file(fullPath);

    await bucketFile.save(req.file.buffer, {
        contentType: req.file.mimetype,
        gzip: true
    });

    const [url] = await bucketFile.getSignedUrl({
        action: "read",
        expires: "01-01-2050"
    });
    console.log(url);
    const shortURL = await bitly.shorten(url)
        
    const data = await bucketFile.getMetadata();

    res.status(200).json({
        imageUrl: shortURL,
        metadata: data
    })


}