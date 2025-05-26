<template>
  <div class="container">
    <div class="scrolling-text">{{ text }}</div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: ''
  }
})
</script>
<style scoped>
.container {
  width: 100%;
  overflow: hidden; /* 隐藏超出容器的部分 */
  white-space: nowrap; /* 保证文字在一行 */

  /* position: relative; */

  /* text-overflow: ellipsis; */
}

.scrolling-text {
  display: inline-block;
  animation: scroll 10s linear infinite; /* 10s 循环滚动 */
}

@keyframes scroll {
  0% {
    transform: translateX(100%); /* 从右侧开始 */
  }

  100% {
    transform: translateX(-100%); /* 滚动到左侧 */
  }
}
</style>
