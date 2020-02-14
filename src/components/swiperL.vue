<template>
  <swiper :options="swiperOption">
    <swiper-slide v-for="(item,index) in imgs" :key="index">
      <div class="banner" @click="fsss(index)">
        <img :src="item.cover" alt />
      </div>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>
<script>
export default {
  name: "Slider",
  data() {
    return {
      swiperOption: {
        pagination: {
          //分页器
          el: ".swiper-pagination"
        }
      }
    };
  },
  props: ["imgs"],
  methods: {
    fsss(index) {
      this.$emit("fs", this.imgs[index].id);
    }
  }
};
</script>
<style scoped>
.banner img {
  width: 100%;
  height: 300px;
}
</style>