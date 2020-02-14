const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.connect("mongodb://127.0.0.1:27017/music", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    // eslint-disable-next-line no-console
    console.log("连接成功")
}).catch(() => {
    // eslint-disable-next-line no-console
    console.log("连接失败")
});
let rankShema = new Schema({
    mid: {
        type: String,
        required: true
    },
    headPicUrl: {
        type: String,
        required: true
    },
    titleDetail: {
        type: String,
        required: true
    },
    songlist: [
        {
            songAlbum: {
                type: String,
                required: true
            },
            songMid: {
                type: String,
                required: true
            },
            singerName: {
                type: String,
                required: true
            },
            songName: {
                type: String,
                required: true
            }
        }
    ]

})
let rankData = mongoose.model("rankSongT", rankShema);
module.exports = {
    rankSongT: rankData
}