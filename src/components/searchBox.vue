<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <!-- 搜索图标 -->
    <input
      ref="query"
      @focus="show"
      @blur="show"
      v-model.lazy="query"
      class="box"
      :placeholder="placeholder"
    />
    <!-- 搜索框 -->
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
    <!-- 取消按钮 -->
  </div>
</template>
<script >
export default {
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    },
    tog: {
      type: Boolean
    }
  },
  data() {
    return {
      query: "",
      date: "",
      arr: []
    };
  },
  methods: {
    clear() {
      this.query = "";
    },
    show() {
      this.$emit("togC", !this.tog);
      if (this.query) {
        this.$axios.post("/api/search").then(data => {
          this.$emit("ff", data.data);
        });
      }
    },
    hide() {}
  },
  watch: {
    query(value) {
      if (value) {
        this.$axios
          .post("/api/createSearchHistory", {
            data: this.query
          })
          .then(data => {
            alert(data.data);
          });
      }
    }
  },
  created() {
    this.$axios.post("/api/search").then(data => {
      this.$emit("ff", data.data);
    });
  }
};
</script>

<style scoped >
.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: #333;
  border-radius: 6px;
}
.icon-search {
  font-size: 24px;
  color: #222;
}
.box {
  flex: 1;
  margin: 0 5px;
  line-height: 38px;
  background: #333;
  color: #fff;
  font-size: 14px;
  outline: none;
}
.box::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.icon-dismiss {
  font-size: 16px;
  color: #222;
}
</style>
