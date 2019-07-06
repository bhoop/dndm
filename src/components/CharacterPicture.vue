<template>
<div class="cp">
  <svg :viewBox="`0 0 ${src.face.r*2} ${src.face.r*2}`" class="cp__img">
    <image :xlink:href="src.url" :width="src.width" :height="src.height" :x="`${src.face.r - src.face.x}`" :y="`${src.face.r - src.face.y}`"/>
  </svg>
</div>
</template>
<script lang="ts">
import Vue from "vue";
interface PictureFaceConfig {
  x: number;
  y: number;
  r: number;
}
interface PictureConfig {
  url: string;
  width: number;
  height: number;
  face: PictureFaceConfig;
}
export default Vue.extend({
  props: {
    src: {
      type: Object as () => PictureConfig
    }
  },
  computed: {
  }
});
</script>
<style scoped>
.cp {
  position: relative;
  overflow: hidden;
}
.cp__img {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>