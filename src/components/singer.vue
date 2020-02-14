<template>
  <div class="singer">
    <ul>
      <li
        v-for="item in data"
        @click="ff(item.singer_mid)"
        class="list-group-item"
        v-bind:key="item.singer_mid"
      >
        <img class="avatar" v-bind:src="item.singer_pic" />
        <span class="name">{{item.singer_name}}</span>
      </li>
    </ul>
    <div class="load-m" v-show="arr.length" @click="reqData">{{text}}</div>
  
    
    <load v-show="!arr.length"></load>
  </div>
</template>
<script>
import Load from "./load.vue";
export default {
  data() {
    return {
      data: [],
      index: 0,
      text: "点击加载更多",
      arr: []
    };
  },
  created() {
    this.$axios.get("/api/getSingerData").then(data => {
      //歌手信息列表
      this.arr = data.data;
      this.data = data.data.slice(0, (this.index + 1) * 10);
    });
  },
  components:{
    load:Load
  },
  methods: {
    //歌手信息
    ff(path) {
      this.$router.push({
        path: "/" + path,
        params: path
      });
    },
    reqData() {
      this.index += 1;
      if(this.index*10 >= this.arr.length){
        this.text = "已经达到我的极限了~~~"
        return false
      }
      var arr = this.arr.slice(this.index* 10, (this.index + 1) * 10);
      arr.forEach((item) => {
        this.data.push(item)
      });
    }
  }
};
</script>
<style scoped>
.list-group-item {
  display: flex;
  align-items: center;
  padding: 20px 0 0 30px;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.name {
  margin-left: 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}
.load-m {
  padding: 20px 0 80px;
  text-align: center;
}
</style>
