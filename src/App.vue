<template>
  <div id="app">
    <m-header></m-header>
    <m-tag></m-tag>
    <router-view></router-view>
    <m-player></m-player>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Tag from "@/components/Tag.vue";
import Player from "@/components/player.vue";
export default {
  name: "App",
  components: {
    "m-header": Header,
    "m-tag": Tag,
    "m-player": Player
  }
};
</script>

<style>
.swiper-pagination-bullet-active{
  width: 16px;
}
</style>