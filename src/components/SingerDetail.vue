<template>
  <!-- 增加个转场动画 -->
  <transition name="slide">
    <music-list :id="id"></music-list>
  </transition>
</template> 
<script>
import musicList from "@/components/musicList.vue";
export default {
  data() {
    return {
      id: ""
    };
  },
  components: {
    "music-list": musicList
  },
  created() {
    this.id = this.$route.params.id;
    console.log(44);
    
    // console.log(this.$route.params.id);
  }
};
</script>
<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate(100%, 0);
}
</style>