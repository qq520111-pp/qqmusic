<template>
  <div class="player">
    <transition name="bb">
      <div class="normal-player" v-show="fullScreen">
        <!-- 全屏播放器 -->
        <div class="background">
          <!-- 大的背景图 占据所有-->
          <img v-bind:src="songData.songPic" alt width="100%" height="100%" />
        </div>
        <div class="top">
          <div class="back" v-on:click="back">
            <!-- 返回按钮 -->
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="songData.songName"></h1>
          <!-- 歌曲名称 -->
          <h2 class="subtitle" v-html="singer"></h2>
          <!-- 歌手名称 -->
        </div>
        <div class="middle">
          <swiper :options="swiperOption" class="mmm">
            <swiper-slide>
              <div class="middle-l" v-if="currentLyric">
                <div class="cd-wrapper">
                  <!-- 歌曲唱片设计 -->
                  <div class="cd">
                    <img v-bind:src="songData.songPic" alt class="image" :class="cdClass" />
                  </div>
                </div>
                <div style="margin-top:50px;text-align:center;font-size:16px;">{{text}}</div>
              </div>
            </swiper-slide>
            <swiper-slide>
              <!-- 歌词模块 -->
              <div class="lyric-wrapper">
                <div v-if="currentLyric" ref="lyric-scroll" class="lyric-scroll">
                  <p
                    ref="lyricLine"
                    class="text1"
                    :class="{'current': currentLineNum ===index}"
                    v-for="(line,index) in currentLyric.lines"
                    v-bind:key="index"
                  >{{line.txt}}</p>
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div class="bottom">
          <div class="progress-wrapper" v-show="songReady">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progressbar :percent="percent" @percentChange="onProgressBarChange"></progressbar>
              <!-- 调用进度条组件 -->
            </div>
            <span class="time time-r">{{songData.playTime}}</span>
          </div>
          <div class="operators">
            <!-- 控制按钮区 -->
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
              <!-- 根据播放模式的不同, 我们设置不同的类名来改变里面的logo  点击更改播放模式-->
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prev"></i>
              <!-- 上一首 -->
            </div>
            <div class="icon i-center">
              <i @click="togglePlaying" :class="playIcon"></i>
              <!-- 播放按钮 -->
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="next"></i>
              <!-- 下一首 -->
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
              <!-- 喜欢 -->
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="mini-player" v-show="!fullScreen" @click="open">
      <!-- 迷你播放器 -->
      <div class="icon">
        <img v-bind:src="songData.songPic" :class="cdClass" width="40" height="40" />
        <!-- 小型唱片 -->
      </div>
      <div class="text">
        <h2 class="name" v-html="songData.songName"></h2>
        <p class="desc" v-html="singer"></p>
      </div>
      <div class="control">
        <i :class="miniIcon" @click.stop="togglePlaying"></i>
        <!-- 迷你播放器的播放按钮  阻止冒泡-->
      </div>
      <div class="control">
        <div class="icon-playlist"></div>
      </div>
    </div>

    <audio
      :src="songData.m4aUrl"
      ref="audio"
      @canplay="ready"
      @ended="end"
      @timeupdate="updateTime"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { playMode } from "../assets/js/config";
import Progressbar from "./progress-bar";
import Lyric from "lyric-parser";


export default {
  name: "play",
  data() {
    return {
      songData: {
        songName: "暂无歌曲",
        songPic:
          "http://bpic.588ku.com/element_origin_min_pic/01/48/13/135744150144d8d.jpg"
      },
      songReady: false,
      currentTime: 0, //默认的播放时间
      totalTime: "",
      currentLyric: null, // 定义变量, 存储当前歌曲的歌词信息
      currentLineNum: 0, //歌词所在行
      swiperOption: {
        pagination: {
          //分页器
          el: ".swiper-pagination"
        }
      },
      text: ""
    };
  },
  computed: {
    //得到基本参数, 当传入的播放列表的时候展开播放器, 并根据播放器的fullscreen参数的不同,选择全屏或是迷你播放器
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong", //获取当前歌曲数据
      "singer",
      "playing",
      "currentIndex",
      "playMode"
    ]),
    playIcon() {
      // 更改播放按钮的logo图, 每次playing的值发生变化,就返回一个新的字符串, 改变元素的类名
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      // 更改mini 播放器的播放按钮的logo图, 每次playing的值发生变化,就返回一个新的字符串, 改变元素的类名
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    cdClass() {
      // 通过控制类名 来控制cd图的旋转, 全屏播放器和迷你播放器都要转起来
      return this.playing ? "play" : "play pause";
    },
    percent() {
      return this.currentTime / this.totalTime;
    },
    iconMode() {
      return this.playMode === playMode.sequence
        ? "icon-sequence"
        : this.playMode === playMode.loop
        ? "icon-loop"
        : "icon-random";
      //判断返回值
    }
  },
  methods: {
    ...mapMutations({
      setFullScreen: "setFullScreen",
      setPlayingState: "setPlayingState",
      setCurrentIndex: "setCurrentIndex",
      setPlayMode: "setPlayMode"
    }),
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    togglePlaying() {
      if (this.currentSong._id) {
        this.setPlayingState(!this.playing); //点击一次, 变更播放状态.
      }
      if (this.currentLyric) {
        //当歌词存在的时候 ,一起切换状态
        this.currentLyric.togglePlay();
      }
    },
    prev() {
      if (!this.songReady) {
        //当歌曲没有加载好的时候, 点击直接返回, 使之无效化
        return;
      }
      let nowIndex = this.currentIndex - 1;

      if (nowIndex < 0) {
        nowIndex = this.playlist.length - 1; //播放到第一首了,就回到最后一首歌
      }
      this.setCurrentIndex(nowIndex); //设置当前索引值
      if (!this.playing) {
        this.togglePlaying();
        // 当我们的播放器处于暂停的时候, 我们点击下一首的时候,也把音乐设置为暂停的状态
        // 因为在默认的情况下我们更改了currentIndex,那么currentSong也会变
        // currentSong的变化就会触发新的请求,接着就是播放新的歌
        // 这种情况就会变成, 无论当前的播放是啥, 下一首都是播放, 但是这个没有触发playing的值,自然播放按钮的logo就不会变
      }
      this.songReady = false; //复位
    },
    next() {
      if (!this.songReady) {
        //当歌曲没有加载好的时候, 点击直接返回, 使之无效化
        return;
      }

      let nowIndex = this.currentIndex + 1;
      if (nowIndex > this.playlist.length) {
        nowIndex = 0; //播放到最后一首了,就回到第一首歌
      }
      this.setCurrentIndex(nowIndex); //设置当前索引值
      if (!this.playing) {
        this.togglePlaying();
        // 当我们的播放器处于暂停的时候, 我们点击下一首的时候,也把音乐设置为暂停的状态
        // 因为在默认的情况下我们更改了currentIndex,那么currentSong也会变
        // currentSong的变化就会触发新的请求,接着就是播放新的歌
        // 这种情况就会变成, 无论当前的播放是啥, 下一首都是播放, 但是这个没有触发playing的值,自然播放按钮的logo就不会变
      }
      this.songReady = false; //复位
    },
    ready() {
      // console.log(this.currentLyric.play);

      // this.currentLyric.play();
      this.songReady = true; //当audio元素激活了canplay之后, 自动把songready设置为true
    },
    format(time) {
      // eslint-disable-next-line no-console
      let min = Math.floor(time / 60);
      let second = Math.floor(time % 60);

      //对于只有一位数的, 前面补个0 , 看上去格式统一一下
      if (second < 10) {
        second = "0" + second;
      }
      if (min < 10) {
        min = "0" + min;
      }
      return `${min}:${second}`;
    },
    handle(num) {
      num = num.split(":");
      var ss = 0;
      ss = num[0] * 60 + num[1] * 1;
      return ss;
    },
    updateTime(ev) {
      this.currentTime = ev.target.currentTime;
    },
    onProgressBarChange(percent) {
      //子组件传递过来的数据
      // eslint-disable-next-line no-console
      this.$refs.audio.currentTime = Math.floor(this.totalTime * percent);
      if (!this.playing) {
        // 如果我们拉动进度的条的时候歌曲没有在播放, 那么就把它设置为播放
        this.togglePlaying();
      }
      if (this.currentLyric) {
        // 歌词开始实现歌曲的跳转, 单位得是毫秒
        this.currentLyric.seek(this.$refs.audio.currentTime * 1000);
      }
    },
    end() {
      if (this.playMode === playMode.sequence) {
        //顺序播放
        let nowIndex = this.currentIndex + 1;
        if (nowIndex > this.playlist.length) {
          nowIndex = 0; //播放到最后一首了,就回到第一首歌
        }
        this.setCurrentIndex(nowIndex); //设置当前索引值
      } else if (this.playMode === playMode.loop) {
        //循环播放
        this.currentTime = 0;
        this.$refs.audio.play();

        if (this.currentLyric) {
          // 歌词回到最开始的状态
          this.currentLyric.seek(0);
        }
      } else {
        //随机播放
        let randomIndex = Math.floor(Math.random() * this.playlist.length);

        this.setCurrentIndex(randomIndex); //设置当前索引值
      }
      this.$refs["lyric-scroll"].style.top = 0;
    },
    changeMode() {
      let nowMode = (this.playMode + 1) % 3; // 每点击一次, 值加一, 然后求模3
      this.setPlayMode(nowMode); // 设置播放模式的值
      let list = null; //定义一个空列表, 用来存储根据播放模式不同设置的不同的列表顺序数据
      // eslint-disable-next-line no-console
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      //设置当前的歌词行数,目的是为了在歌词模块里面实现高亮当前行的效果
      // eslint-disable-next-line no-console

      this.text = txt;

      if (lineNum > 5) {
        this.$refs["lyric-scroll"].style.top = -(lineNum - 5) * 32 + "px";
      }
    }
  },
  watch: {
    currentSong() {
      if (this.currentLyric) {
        this.currentLyric.stop();
        //暂停歌词定时器
      }

      // 当 currentSong数据更新之后, 我们就利用当前的song里面的数据,来发送进一步的请求,得到具体的歌曲数据
      // eslint-disable-next-line no-console

      let data = {
        mid: this.currentSong.songMid
      };

      this.$axios.post("/api/getSongDetailDate", { mid: data.mid }).then(da => {
        // this.songData=data.data[0];
        // eslint-disable-next-line no-console

        if (Array.isArray(da.data)) {
          //部分接口返回的是一个数组,表示有多个版本
          this.songData = da.data[0];
        } else {
          this.songData = da.data; //单独版本的话就直接设置就好
        }

        //请求歌词回来
        this.$axios.post("/api/getSongDate", { mid: data.mid }).then(data => {
          // this.songData=data.data[0];
          // eslint-disable-next-line no-console

          let lyric = data.data; //获取歌词数据

          // eslint-disable-next-line no-console
          //console.log(lyric);
          this.currentLyric = new Lyric(lyric, this.handleLyric); //获得这个lyric的解析后的数据, 并设置一个回调函数
          // eslint-disable-next-line no-console

          this.$nextTick(() => {
            this.$refs.audio.play();
            this.currentLyric.play();
          });
        });

        this.totalTime = this.handle(this.songData.playTime);
      });
    },
    playing(newPlaying) {
      let audio = this.$refs.audio;
      newPlaying ? audio.play() : audio.pause(); // 根据播放状态, 改变音乐播放情况
    }
  },
  components: {
    progressbar: Progressbar
  }
};
</script>

<style scoped>
.bb-enter-active,
.bb-leave-active {
  transition: all 0.3s;
}

.bb-enter,
.bb-leave-to {
  opacity: 0.4;
  transform: translate(0%, 100%);
}
.normal-player {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
  background: #222;
}

.background {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.6;
  filter: blur(20px);
}

.top {
  position: relative;
  margin-bottom: 25px;
}

.back {
  position: absolute;
  top: 0;
  left: 6px;
  z-index: 5000;
}

.icon-back {
  display: block;
  padding: 9px;
  font-size: 22px;
  color: #ffcd32;
  transform: rotate(-90deg);
}

.title {
  width: 70%;
  margin: 0 auto;
  line-height: 40px;
  text-align: center;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 18px;
  color: #fff;
}

.subtitle {
  line-height: 20px;
  text-align: center;
  font-size: 14px;
  color: #fff;
}

.middle {
  position: fixed;
  width: 100%;
  top: 80px;
  bottom: 170px;
  white-space: nowrap;
  font-size: 0;
}

.middle-l {
  display: inline-block;
  vertical-align: top;
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 80%;
}

.cd-wrapper {
  position: absolute;
  left: 10%;
  top: 0;
  width: 80%;
  height: 100%;
}

.cd {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 10px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.play {
  animation: rotate 20s linear infinite;
}

.pause {
  animation-play-state: paused;
}

.image {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.playing-lyric-wrapper {
  width: 80%;
  margin: 30px auto 0 auto;
  overflow: hidden;
  text-align: center;
}
.mmm {
  height: 100%;
}

.swiper-pagination-zidingyi {
  width: 16px;
}

.playing-lyric {
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  color: #fff;
}

.middle-r {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.lyric-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  text-align: center;
}
.lyric-scroll {
  box-sizing: border-box;
  width: 100%;
  position: absolute;
  top: 0;
  transition: top 0.5s;
}

.text1 {
  line-height: 32px;
  color: #ddd;
  font-size: 16px;
  letter-spacing: 4px;
  transition: all 0.5;
}

.current {
  color: #fff;
  font-size: 22px;
}

.bottom {
  position: absolute;
  bottom: 34px;
  width: 100%;
}

.dot-wrapper {
  text-align: center;
  font-size: 0;
}

.dot {
  display: inline-block;
  vertical-align: middle;
  margin: 0 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
}

.active {
  width: 20px;
  border-radius: 5px;
  background: #fff;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  width: 80%;
  margin: 0px auto;
  padding: 10px 0;
}

.time {
  color: #fff;
  font-size: 12px;
  flex: 0 0 30px;
  line-height: 30px;
  width: 30px;
}

.time-l {
  text-align: left;
  margin-right: 10px;
}

.time-r {
  text-align: right;
  margin-left: 10px;
}

.progress-bar-wrapper {
  flex: 1;
}
.operators {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon {
  flex: 1;
  color: #ffcd32;
}

.disable {
  color: #ffcd32;
}

i {
  font-size: 30px;
}

.i-left {
  text-align: right;
}

.i-center {
  padding: 0 20px;
  text-align: center;
}

i {
  font-size: 40px;
}

.i-right {
  text-align: left;
}

.icon-favorite {
  color: #d93f30;
}

.normal-enter-active,
.normal-leave-active {
  transition: all 0.4s;
}

/* .top,
.bottom {
  transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
} */

.normal-enter,
.normal-leave-to {
  opacity: 0;
}
/* .top {
  transform: translate3d(0, -100px, 0);
} */

/* .bottom {
  transform: translate3d(0, 100px, 0);
} */

.mini-player {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: #333;
  padding: 0 20px;
}
.mini-enter-active,
.mini-leave-active {
  transition: all 0.4s;
}

.mini-enter,
.mini-leave-to {
  opacity: 0;
}

.icon {
  width: 40px;
}

img {
  border-radius: 50%;
}

.play {
  animation: rotate 10s linear infinite;
}

.pause {
  animation-play-state: paused;
}

.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  line-height: 20px;
  overflow: hidden;
}

.name {
  margin-bottom: 2px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
  color: #fff;
}

.desc {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 12px;
  color: #fff;
}

.control {
  flex: 0 0 30px;
  width: 30px;
  padding: 0 10px;
}

.icon-play-mini,
.icon-pause-mini,
.icon-playlist {
  font-size: 30px;
  color: #ffcd32;
}

.icon-mini {
  font-size: 32px;
  position: absolute;
  left: 0;
  top: 0;
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>