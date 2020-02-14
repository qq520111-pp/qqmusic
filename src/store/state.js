import { playMode } from "../assets/js/config";
const state = {
    singer:"",
    playing: false,//播放器状态
    fullScreen: false,//播放器界面, 是否全屏
    playlist: [],//播放列表
    sequenceList: [],//顺序播放列表,播放模式配合数组
    playMode: playMode.sequence,//播放模式, 默认顺序播放
    currentIndex: -1,//当前播放的歌曲, 默认不播放, 咱们就设置为-1
    disc: {}//推荐列表的歌单数据
};
export default state;