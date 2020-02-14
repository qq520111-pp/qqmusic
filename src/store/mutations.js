const mutations = {
    setSinger(state, singerData) {
        state.singer = singerData;
    },
    setPlayingState(state, flag) {
        state.playing = flag
    },
    setFullScreen(state, flag) {
        state.fullScreen = flag
    },
    setPlaylist(state, list) {
        state.playlist = list
    },
    setSequenceList(state, list) {
        state.sequenceList = list
    },
    setPlayMode(state, mode) {
        state.playMode = mode
    },
    setCurrentIndex(state, index) {
        state.currentIndex = index
    },
    setDisc(state,list){
        state.disc = list
    }
};
export default mutations;