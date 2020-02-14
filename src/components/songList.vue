<template>
  <div class="song-list">
    <ul>
      <li
        v-for="(song,index) in songs"
        class="item"
        v-bind:key="song.songMid"
        @click="selectItem(song,index,song.songAlbum)"
      >
        <div class="content">
          <h2 class="name">{{song.songName}}</h2>
          <p class="desc">{{singername}} -- {{song.songAlbum}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    songs: { type: Array },
    singername: { type: String }
  },
  methods: {
    selectItem(item, index,singer) {
      this.$emit("select", item, index,singer); //把事件和参数传递到父组件 music-list组件
    }
  }
};
</script>
<style scoped>
.song-list {
  padding: 20px 20px 0;
}
.song-list .item {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 64px;
  font-size: 14px;
}
.content {
  flex: 1;
  line-height: 20px;
  overflow: hidden;
}
.name {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: #fff;
}
.desc {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.3);
}
</style>