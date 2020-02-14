
export const selectPlay = function (
    {commit},
    {list, index}
) {
    //处理异步的方法
    commit("setPlaylist",list);
    commit("setCurrentIndex",index);
    commit("setSequenceList",list);
    commit("setFullScreen",true);
    commit("setPlayingState",true);
}