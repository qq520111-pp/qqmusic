<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle">
      <div class="play-wrapper" v-show="songs.length">
        <!-- 设置随机播放选项的按钮, 该按钮在songlist数据传输进来之后再显示出来 -->
        <div class="play" ref="playBtn">
          <!-- 添加一个引用, 当蒙版移动到顶部的时候, 我们就对这个按钮做一些操作 -->
          <i class="icon-play"></i>
          <span class="text" @click="random">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
      <!-- 模糊层, 加点滤镜效果 -->
    </div>

    <!-- 对应歌手的歌曲 -->
    <song-list :songs="songs" :singername="title" @select="selectItem"></song-list>
  </div>
</template>
<script>
import songList from "@/components/songList.vue";
import { mapMutations } from "vuex";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      data: null,
      title: "我是title",
      bgStyle: "",
      songs: []
    };
  },
  created() {
    this.$axios
      .post(`/api/ranksongdata`, { id: this.$route.params.id })
      .then(data => {
        // eslint-disable-next-line no-console
        console.log(data.data);
        if (Array.isArray(data.data)) {
          this.data = data.data[0];
        } else {
          this.data = data.data;
        }

        this.songs = this.data.songlist;
        this.title = this.data.titleDetail;
        this.bgStyle = `background-image:url(${this.data.headPicUrl})`;
        // // console.log(this.data);
        // //保存请求回来的歌手的八十条歌信息数组
        this.setSinger(this.title);
      });
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    selectItem(item, index, singer) {
      //设置playlist,playing,fullscreen, playMode, currentIndex等值
      //这种复杂的值设置,我们可以专门设置一个actions来处理
      // eslint-disable-next-line no-console
      
      this.setSinger(singer);

      this.selectPlay({
        list: this.songs, //传入当前数据的歌曲列表
        index: index //当前歌曲索引
      });
    },
    random() {
      var num = Math.floor(Math.random() * this.songs.length);
      var item = this.songs[num];

      this.selectItem(item, num);
    },
    ...mapActions(["selectPlay"]),
    ...mapMutations({
      setSinger: "setSinger"
    })
  },
  components: {
    "song-list": songList
  }
};
</script>
<style scoped>
.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #222;
  overflow: auto;
}

.back {
  position: absolute;
  top: 0;
  left: 6px;
  z-index: 50;
}
.icon-back {
  display: block;
  padding: 10px;
  font-size: 22px;
  color: #ffcd32;
}
.title {
  position: absolute;
  top: 0;
  left: 10%;
  z-index: 40;
  width: 80%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  line-height: 40px;
  font-size: 18px;
  color: #fff;
}
.bg-image {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 70%;
  transform-origin: top;
  background-size: cover;
}
.filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(7, 17, 27, 0.4);
}
.play-wrapper {
  position: absolute;
  bottom: 20px;
  z-index: 50;
  width: 100%;
}
.play {
  box-sizing: border-box;
  width: 135px;
  padding: 7px 0;
  margin: 0 auto;
  text-align: center;
  border: 1px solid #ffcd32;
  color: #ffcd32;
  border-radius: 100px;
  font-size: 0;
}
.icon-play {
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
  font-size: 16px;
}
.text {
  display: inline-block;
  vertical-align: middle;
  font-size: 12px;
}
</style>