<template>
  <div class="recomment">
    <div class="recommend-content">
      <div>
        <swiper-l :imgs="imgs" @fs="ff"></swiper-l>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul class="fill-bottom">
          <li v-for="item in disclist" @click="ff(item.id)" v-bind:key="item.id" class="item">
            <div class="icon">
              <img width="60" height="60" v-bind:src="item.cover" />
            </div>
            <div class="text">
              <h2 class="name" v-html="item.category"></h2>
              <p class="desc" v-html="item.title"></p>
            </div>
          </li>
        </ul>
      </div>

      <div class="load-m" v-show="recommendList.length" @click="reqData" >{{text}}</div>
    </div>

    <!-- 二级路由的容器 -->
    <transition name="slide">
      <router-view></router-view>
    </transition>

    <load v-show="!recommendList.length"></load>
  </div>
</template>
<script>
import Swiper from "./swiperL.vue";
import Load from "./load.vue";
export default {
  data() {
    return {
      disclist: [],
      imgs: "",
      recommendList: [],
      index: 0,
      text:"点击加载更多"
    };
  },
  created() {
    this.$axios.get("/api/recommenddata").then(data => {
      this.recommendList = data.data;
      // 轮播图
      this.imgs = data.data[0].categoryList;
      // console.log(data.data[0].categoryList);

      //剩余的数据作为剩下的列表部分
      data.data[this.index].categoryList.forEach(item1 => {
        //获取列表里面的核心数据
        item1.category = data.data[this.index].category;
        //每个单独的数据,保存一下这个歌单的父类数据
        this.disclist.push(item1);
      });
    });
  },
  components: {
    "swiper-l": Swiper,
    load:Load
  },
  methods: {
    ff(path) {
      this.$router.push(`/recommend/${path}`);
    },
    reqData() {
      this.index += 1;
      if(this.index >= this.recommendList.length){
        this.text = "已经达到我的极限了~~~"
        return false
      }
      
      //剩余的数据作为剩下的列表部分
      this.recommendList[this.index].categoryList.forEach(item1 => {
        //获取列表里面的核心数据
        item1.category = this.recommendList[this.index].category;
        //每个单独的数据,保存一下这个歌单的父类数据
        this.disclist.push(item1);
      });
    }
  }
};
</script>

<style scoped>
.list-title {
  height: 65px;
  line-height: 65px;
  text-align: center;
  font-size: 14px;
  color: #ffcd32;
}

.item {
  display: flex;
  box-sizing: border-box;
  align-items: center;
  padding: 20px 20px 0 20px;
}
.fill-bottom > li:nth-child(1) {
  padding-top: 0;
}

.icon {
  width: 60px;
  padding-right: 20px;
}
.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  line-height: 20px;
  overflow: hidden;
  font-size: 14px;
}
.name {
  margin-bottom: 10px;
  color: #fff;
}
.desc {
  color: rgba(255, 255, 255, 0.3);
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate(100%, 0);
}
.load-m {
  padding: 30px 0 80px;
  text-align: center;
}
/* .item .icon  .text   .name            
    color:$color-text    */
</style>