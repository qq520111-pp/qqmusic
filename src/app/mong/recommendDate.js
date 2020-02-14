const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.connect("mongodb://127.0.0.1:27017/music", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("连接成功")
}).catch(() => {
    console.log("连接失败")
});
let recommendShema = new Schema({
    category: {
        required: true,
        type: String
    },
    categoryList: [
        {
            id: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            cover: {
                type: String,
                required: true
            }
        }
    ]
})
let recommendDate = mongoose.model("recommendDate", recommendShema);
module.exports={//导出表
    recommendTable:recommendDate
}