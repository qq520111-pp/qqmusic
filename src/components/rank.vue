<template>
  <div class="singer">
    <div class="rank" ref="rank">
      <ul>
        <li @click="selectItem(item)" class="item" v-for="(item,index) in data" v-bind:key="index">
          <div class="icon">
            <img width="100" height="100" :src="item.picUrl" />
            <!-- 排行榜类别的图片 -->
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songlist" v-bind:key="index">
              <span>{{index + 1}}</span>
              <span>{{song.songName}}-{{song.singerName}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="load-m" v-show="arr.length" @click="reqData" >{{text}}</div>

      <load v-show="!arr.length"></load>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Load from "./load.vue";
export default {
  data() {
    return {
      data: [],
      arr:[],
      index:0,
      text:"加载更多数据"
    };
  },
  created() {
    this.$axios
      .get("/api/rank")
      .then(data => {
        //歌手信息列表
        
      this.arr = data.data;
      this.data = data.data.slice(0, (this.index + 1) * 5);

      })
      .catch();
  },
  methods: {
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.topId}`
      });
    },
    reqData(){
      this.index += 1;
      if(this.index*5 >= this.arr.length){
        this.text = "已经达到我的极限了~~~"
        return false
      }
      var arr = this.arr.slice(this.index* 5, (this.index + 1) * 5);
      arr.forEach((item) => {
        this.data.push(item)
      });
    }
  },
  components:{
    load:Load
  },
};
</script>
<style scoped>
.rank {
  width: 100%;
  padding-bottom: 70px;
}

.toplist {
  height: 100%;
  overflow: hidden;
}

.item {
  display: flex;
  margin: 0 20px;
  padding-top: 20px;
  height: 100px;
}

.icon {
  flex: 0 0 100px;
  width: 100px;
  height: 100px;
}
.load-m {
  padding: 20px 0 10px;
  text-align: center;
}

.songlist {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
  height: 100px;
  overflow: hidden;
  background: #333;
  color: rgba(255, 205, 49, 0.5);
  font-size: 12px;
}

.song {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 26px;
}
</style>
