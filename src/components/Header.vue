<template>
	<div class="m-header">
		<div class="icon"></div>
		<h1 class="text">猪猪音乐</h1>
	</div>
</template>
<script>
</script>
<style scoped lang="stylus">
  @import "../assets/stylus/variable"
  @import "../assets/stylus/mixin"

  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 30px
      height: 32px
      margin-right: 9px
      background-image: url("../assets/images/logo.png")
      background-size: 30px 32px
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
</style>