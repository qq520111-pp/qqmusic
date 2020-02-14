const express = require("express");
const request = require("request")
const bodyParser = require("body-parser");
const { JSDOM } = require("jsdom");
const { recommendTable } = require("../mong/recommendDate");//推荐页面的表
const { singerTable } = require("../mong/singer");//歌手信息的表
const { songTable } = require("../mong/songTable");//歌曲信息
const { recommendSongDate } = require("../mong/recommendSongDate");//推荐页面的歌曲信息
const { rankTable } = require("../mong/rankTable");//排名
const { rankSongT } = require("../mong/rankSongT");//排名的歌曲
const { singerDetailTable } = require("../mong/singerDetailTables");
const { searchTables } = require("../mong/search");

let app = express();

//使用中间件 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//解决跨越问题
app.all("*", function (req, res, next) {
    //解决跨域请求问题
    res.header({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'content-type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json;charset=utf-8'
        
    })

    if (req.method === "OPTIONS") {
        res.status(200).send("OK")
        //eslint-disable-next-lineno-console   
        console.log("hasoption")
    } else {
        next()
    }
})

//推荐信息
app.get("/api/recommenddata", function (req, res) {
    // recommendTable.deleteMany().then()
    recommendTable
        .find({}, {
            __v: false,
            _id: false
        })
        .then((data) => {
            // eslint-disable-next-line no-console
            // console.log("查询成功");
            if (Number(data) === 0) {
                // 第一次没有数据的时候去请求
                //需要更新的时候用
                request({
                    method: "GET",
                    url: "https://u.y.qq.com/cgi-bin/musicu.fcg",
                    qs: {
                        "cgiKey": "GetHomePage",
                        "_": "1580748929240",
                        "data": `{"comm":{"g_tk":5381,"uin":"","format":"json","inCharset":"utf-8","outCharset":"utf-8","notice":0,"platform":"h5","needNewCode":1},"MusicHallHomePage":{"module":"music.musicHall.MusicHallPlatform","method":"MobileWebHome","param":{"ShelfId":[101,102,161]}},"hotkey":{"module":"tencent_musicsoso_hotkey.HotkeyService","method":"GetHotkeyForQQMusicMobile","param":{"remoteplace":"txt.miniapp.wxada7aab80ba27074","searchid":"1559616839293"}}}`
                    }
                }, (err, req, body) => {
                    // await recommendTable.deleteMany({});
                    var arr1 = [];

                    let data = JSON.parse(body).MusicHallHomePage.data.v_shelf;
                    data.forEach((item) => {
                        let category = item.title_template;
                        let categoryList = item.v_niche[0].v_card;
                        let arr = [];
                        categoryList.forEach((list) => {
                            // console.log("详细id:" + list.id);
                            // console.log("歌单名词:" + list.title);
                            // console.log("歌单封面地址:" + list.cover);
                            if (list.time) {
                                arr.push({
                                    id: list.time,
                                    title: list.title,
                                    cover: list.cover
                                })
                            } else {
                                arr.push({
                                    id: list.id,
                                    title: list.title,
                                    cover: list.cover
                                })
                            }
                        });

                        arr1.push({
                            category: category,
                            categoryList: arr
                        })

                        recommendTable.create({
                            category: category,
                            categoryList: arr
                        }).then(() => {
                            // eslint-disable-next-line no-console
                            console.log("连接成功");
                        }).catch(() => {
                            // eslint-disable-next-line no-console
                            console.log("连接失败");
                        })
                    })
                    res.send(arr1)
                })

            } else { // eslint-disable-next-line no-console 
                console.log("此时数据库中有数据");
                res.send(JSON.stringify(data))
            }
        })
        .catch(() => {
            // eslint-disable-next-line no-console
            console.log("查询失败");
        });

});

//推荐对应歌信息
app.post("/api/recommendsongdata", function (req, res) {
    // recommendSongDate.deleteMany().then();//删除全部数据
    recommendSongDate.find({
        mid: req.body.id
    })
        .then((data) => {
            // eslint-disable-next-line no-console 
            if (Number(data) === 0) {
                // eslint-disable-next-line no-console 
                console.log("此时数据库中无数据--请求了数据");
                request(
                    {
                        method: "GET",
                        url: "https://y.qq.com/n/m/detail/taoge/index.html",
                        headers: {
                            "user-agent": `Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.25 Mobile Safari/537.36`
                        }
                        , qs: {
                            ADTAG: "myqq",
                            from: "myqq",
                            channel: "10007100",
                            id: req.body.id
                        }
                    },
                    function (error, response, body) {

                        let dom = new JSDOM(body, { runScripts: "dangerously" });
                        let songlist = dom.window.songList;
                        let taogeInfo = dom.window.taogeInfo;
                        //查询是否已存在数据

                        //具体的歌曲信息 
                        var list = [];//预存 歌曲信息列表 
                        songlist.forEach((item) => {
                            list.push({
                                songName: item.songname,
                                songMid: item.songmid,
                                songAlbum: item.singername
                            })
                        })
                        recommendSongDate.create({
                            mid: req.body.id,
                            img: taogeInfo.logo,
                            title: taogeInfo.dissname,
                            list: list
                        }).then(() => {
                            console.log("创建成功");

                            res.send({
                                mid: req.body.id,
                                img: taogeInfo.logo,
                                title: taogeInfo.dissname,
                                list
                            })
                        })


                    }
                );

            } else { // eslint-disable-next-line no-console 
                console.log("此时数据库中有数据");
                res.send(data);
            }
        })


});

//排名的歌信息
app.post("/api/ranksongdata", function (req, res) {
    // recommendSongDate.deleteMany().then();//删除全部数据
    rankSongT.find({
        mid: req.body.id
    })
        .then((data) => {
            // eslint-disable-next-line no-console 
            if (Number(data) === 0) {
                // eslint-disable-next-line no-console 
                console.log("此时数据库中无数据--请求了数据");
                request(
                    {
                        method: "GET",
                        url: "https://i.y.qq.com/n2/m/share/details/toplist.html",
                        qs: {
                            ADTAG: "myqq",
                            from: "myqq",
                            channel: "10007100",
                            id: req.body.id
                        }
                    },
                    function (error, response, body) {

                        //查询是否已存在数据
                        let dom = new JSDOM(body, { runScripts: "dangerously" });
                        let data = dom.window.firstPageData;

                        let finailData = {};
                        finailData.headPicUrl = data.toplistData.headPicUrl;//歌单封面
                        finailData.titleDetail = data.toplistData.titleDetail;// 歌单,名称
                        finailData.songlist = [];
                        data.songInfoList.forEach((item) => {
                            finailData.songlist.push({
                                songAlbum: item.album.name,
                                songMid: item.mid,
                                songName: item.title,
                                singerName: item.singername
                            })
                        })
                        console.log(finailData.songlist);


                        rankSongT.create({
                            mid: req.body.id,
                            songlist: finailData.songlist,
                            headPicUrl: finailData.headPicUrl,
                            titleDetail: finailData.titleDetail
                        }).then(d => {
                            console.log("cjl");
                        })

                        res.send(finailData);
                    })

            } else { // eslint-disable-next-line no-console 
                console.log("此时数据库中有数据");
                res.send(data);
            }
        })


});

//排名歌曲
app.get("/api/rank", function (req, res) {
    // recommendTable.deleteMany().then()
    rankTable.find({
    }).then((data) => {
        if (Number(data) === 0) {
            //需要更新的时候用c
            request(
                {
                    url: "https://u.y.qq.com/cgi-bin/musicu.fcg",
                    qs: {
                        _: 1579230465513,
                        data: `{"comm":{"g_tk":5381,"uin":"","format":"json","inCharset":"utf-8","outCharset":"utf-8","notice":0,"platform":"h5","needNewCode":1,"ct":23,"cv":0},"topList":{"module":"musicToplist.ToplistInfoServer","method":"GetAll","param":{}}}`
                    }
                },
                function (err, response, body) {
                    let data = JSON.parse(body);
                    // eslint-disable-next-line no-console
                    console.log(data.topList.data.group);
                    let finalData = [];
                    data.topList.data.group.forEach((item) => {
                        item.toplist.forEach((list) => {
                            let listData = {};
                            listData.picUrl = list.headPicUrl;
                            listData.intro = list.intro;
                            listData.title = list.title;
                            listData.topId = list.topId;
                            listData.songlist = [];
                            list.song.forEach((songItem) => {
                                listData.songlist.push({
                                    songName: songItem.title,
                                    albumMid: songItem.albumMid,
                                    singerName: songItem.singerName,
                                    singerMid: songItem.singerMid
                                })
                            });
                            finalData.push(listData);
                        })
                    });

                    rankTable.create(
                        finalData
                    )
                    res.send(finalData)
                }
            );
        } else { // eslint-disable-next-line no-console 
            console.log("此时数据库中有数据");
            res.send(data)
        }
    })

});

//歌手信息
app.get("/api/getSingerData", function (req, res, err) {
    // singerTable.deleteMany().then()
    singerTable.find({}, { _id: false, __v: false })
        .then((data) => {
            if (Number(data) === 0) {
                var arr1 = []
                request({
                    method: "GET",
                    url: "https://u.y.qq.com/cgi-bin/musicu.fcg",
                    qs: {
                        _: "getUCGI13777262007254665",
                        g_tk: 5381,
                        loginUin: 0,
                        hostUin: 0,
                        format: "json",
                        inCharset: "utf8",
                        outCharset: "utf-8",
                        notice: 0,
                        platform: "yqq.json",
                        needNewCode: 0,
                        data: '{"comm":{"ct":24,"cv":0},"singerList": {"module":"Music.SingerListServer","method":"get_singer_list","param": {"area":-100,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}'
                    }
                }, function (err, res1, body) {
                    let singerList = JSON.parse(body).singerList.data.singerlist;
                    // eslint-disable-next-line no-console 
                    console.log(singerList)
                    singerList.forEach((item) => {
                        singerTable.create({
                            "singer_id": item.singer_id,
                            // 歌手的id
                            "singer_mid": item.singer_mid,
                            //方便后期获取歌手的详细信息 
                            "singer_name": item.singer_name,
                            "singer_pic": item.singer_pic,
                        })

                        arr1.push({
                            "singer_id": item.singer_id,
                            // 歌手的id
                            "singer_mid": item.singer_mid,
                            //方便后期获取歌手的详细信息 
                            "singer_name": item.singer_name,
                            "singer_pic": item.singer_pic,
                        })
                    })
                    console.log(arr1);
                    res.send(arr1);
                    
                })
            } else { // eslint-disable-next-line no-console 
                console.log("此时数据库中有数据");
                res.send(JSON.stringify(data))
            }
        })
})

//每个歌手对应的歌数据
app.post("/api/getSingerDetailDate", function (req, res, err) {
    let body = req.body
    console.log(body);

    //s 数据格式转化 
    singerDetailTable.find({
        singer_mid: body.mid
    })
        .then((data) => {
            // eslint-disable-next-line no-console 

            if (Number(data) === 0) {
                // eslint-disable-next-line no-console 
                console.log("此时数据库中无数据--请求了数据");
                request({
                    method: "GET",
                    url: "https://i.y.qq.com/n2/m/share/details/singer.html",
                    qs: {
                        singermid: body.mid,
                        ADTAG: "newyqq.singer",
                        source: "ydetail"
                    }
                }, function (err, response, body) {
                    // eslint-disable-next-line no-console 
                    //console.log(body)
                    //res.send(body); 
                    let dom = new JSDOM(body, { runScripts: "dangerously" });
                    let firstPageData = dom.window.firstPageData;
                    let finalData = {}
                    console.log(firstPageData);

                    //基本的歌手信息 
                    finalData.singer_name = firstPageData.singerData.singer_name;
                    //歌手 名称 
                    finalData.singer_mid = firstPageData.singerData.singer_mid;
                    //歌手 mid 
                    finalData.singer_id = firstPageData.singerData.singer_id;
                    //歌手id 
                    finalData.singerDesc = firstPageData.singerData.SingerDesc;
                    //歌手简 介
                    finalData.songTotalNumber = firstPageData.singerData.total;
                    //歌手歌曲总数 
                    finalData.fansTotalNumber = firstPageData.singerData.fans;
                    //歌手粉丝总数 
                    finalData.singer_img = firstPageData.jsonld.images[0];


                    //具体的歌曲信息 
                    finalData.songList = [];//预存 歌曲信息列表 
                    firstPageData.singerData.list.forEach((item) => {
                        finalData.songList.push({
                            songName: item.songInfo.name,
                            songMid: item.songInfo.mid,
                            songAlbum: item.songInfo.album.name
                        })
                    })
                    singerDetailTable.create(finalData)
                        .then(() => { // eslint-disable-next-line no-console 
                            console.log("数据库写入成功");
                        })
                    res.send(finalData);
                })
            } else { // eslint-disable-next-line no-console 
                console.log("此时数据库中有数据");
                res.send(data);
            }
        })
});

//单个歌曲的数据
app.post("/api/getSongDetailDate", function (req, res, err) {
    let body = req.body;
    // songTable.deleteMany().then(() => {
    //     console.log("shanchu");

    // })

    songTable.find({ songMid: body.mid })
        .then((data) => { // eslint-disable-next-line no-console 

            if (Number(data) === 0) { // eslint-disable-next-line no-console 
                console.log("此时数据库中无数据");
                request({
                    method: "GET",
                    url: "https://i.y.qq.com/v8/playsong.html",
                    qs: {
                        songmid: body.mid
                    },
                    headers: {
                        "user-agent": `Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.25 Mobile Safari/537.36`
                    }
                }, function (err, response, body) {
                    let dom = new JSDOM(body, { runScripts: "dangerously" });
                    // eslint-disable-next-line no-console

                    let songData = dom.window.songlist[0];
                    let finalData = {
                        songMid: songData.songmid,
                        m4aUrl: songData.m4aUrl,
                        songName: songData.songname,
                        playTime: songData.playTime,
                        songPic: songData.pic
                    };
                    // eslint-disable-next-line no-console
                    console.log(finalData);
                    songTable.create(finalData)
                    res.send(finalData);
                });
            } else {
                // eslint-disable-next-line no-console 
                console.log("此时数据库中有数据");
                res.send(data);
            }
        })
});

//单个歌曲的歌词数据
app.post("/api/getSongDate", function (req, res, err) {

    let body = req.body
    request({
        url: "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg",
        qs: {
            "-": "MusicJsonCallback_lrc",
            "pcachetime": 1578064451036,
            // songmid: "004YUIB22WvTWe",
            songmid: body.mid,
            g_tk: 5381,
            loginUin: 3003436226,
            hostUin: 0,
            format: "json",
            inCharset: "utf8",
            outCharset: "utf-8",
            notice: 0,
            platform: "yqq.json",
            needNewCode: 0
        },
        headers: {
            referer: "https://y.qq.com/portal/player.html"
        }
    }, function (err, response, body) {
        var data = new Buffer(JSON.parse(body).lyric, 'base64').toString();
        // console.log(data);

        res.send(data)
    })
});

//模拟查找的记录
app.post("/api/search", function (req, res, err) {
    searchTables.find({}).then(data => {
        res.send(data);
    })
})

app.post("/api/createSearchHistory", function (req, res, err) {
    var data = req.body.data;
    if (data) {
        searchTables.create(
            {
                data
            }
        ).then(() => {
            console.log("创建成功");
        })
    }
    res.send("暂无数据")
})
app.post("/api/deleteSearchHistory", function (req, res, err) {
    searchTables.deleteMany().then()
})


app.listen(3389, function(){
    console.log("3389服务器开启");

})
