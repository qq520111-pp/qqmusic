const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.connect(
    "mongodb://127.0.0.1:27017/music",
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { // eslint-disable-next-line no-console 
        console.log("连接成功")
    }).catch(() => { // eslint-disable-next-line no-console 
        console.log("连接失败")
    });
let recommendSDate = new Schema(
    {
        mid:{type: String, required: true},
        img: {type: String, required: true},
        title: {type: String, required: true},
        list: [{
            songName: { type: String, required: true },
            songMid: { type: String, required: true },
            songAlbum: { type: String, required: true }
        }]
    });
let recommendSongDate = mongoose.model("recommendSongDate", recommendSDate);
module.exports = { recommendSongDate }