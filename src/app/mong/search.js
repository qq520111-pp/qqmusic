var mongoose = require("mongoose");
var schema = mongoose.Schema;

mongoose.connect("mongodb://127.0.0.1:27017/music", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("链接成功");

}).catch(() => {
    console.log("失败了");
})

var search = new schema({
    data: {
        type: String
    }
})

var searchTables = mongoose.model("searchTables", search)

module.exports = { searchTables }
