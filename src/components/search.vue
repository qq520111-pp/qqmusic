<template>
  <div class="seach">
    <div class="search-box-wrapper">
      <searchBox @ff="ff" @togC="togC" :tog="tog"></searchBox>

      <transition name="anima">
        <ul class="line" v-show="tog">
          <li v-for="(item,index) in arr" :key="index">{{item.data}}</li>
          <li class="seach-history">
            <span>搜索历史</span>
            <span @click="deleteHis">删除搜索历史</span>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
import searchBox from "./searchBox";
export default {
  data() {
    return {
      arr: [],
      tog: false
    };
  },
  components: {
    searchBox
  },
  methods: {
    ff(data) {
      this.arr = data;
    },
    deleteHis() {
      var c = confirm("确认删除吗");
      if (c) {
        this.$axios
          .post("/api/deleteSearchHistory", {
            data: this.query
          })
          .then(data => {
            alert(data.data);
          });
      } else {
      }
    },
    togC(boo) {
      this.tog = boo;
    }
  }
};
</script>
<style scoped>
.seach {
  color: #ffffff;
}
.search-box-wrapper {
  margin: 20px;
}
.shortcut-wrapper {
  position: fixed;
  top: 178px;
  bottom: 0;
  width: 100%;
}
.line {
  line-height: 30px;
}
.seach-history {
  display: flex;
  line-height: 30px;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.5);
}
.shortcut {
  height: 100%;
  overflow: hidden;
}
.hot-key {
  margin: 0 20px 20px 20px;
}
.title {
  margin-bottom: 20px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}
.item {
  display: inline-block;
  padding: 5px 10px;
  margin: 0 20px 10px 0;
  border-radius: 6px;
  background: #333;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.3);
}
.search-history {
  position: relative;
  margin: 0 20px;
}
.title {
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}
.text {
  flex: 1;
}
.clear {
  position: relative;
}
.clear::before {
  content: "";
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
}
.icon-clear {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}
.search-result {
  position: fixed;
  width: 100%;
  top: 178px;
  bottom: 0;
}

.anima-enter-active,
.anima-leave-active {
  transition: opacity 0.5s;
}

.anima-enter,
.anima-leave-to{
  opacity: 0.4;
}
</style>
