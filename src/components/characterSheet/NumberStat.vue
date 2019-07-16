<template>
  <div class="ns" v-on="$listeners">
    <div class="ns__title">{{ title }}</div>
    <div class="ns__value" :data-prefix="prefix" :data-suffix="suffix">{{ value }}</div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: ["title", "value", "prefix", "suffix"]
});
</script>
<style scoped>
.ns {
  display: inline-flex;
  flex-direction: column;
  text-transform: uppercase;
  align-items: center;
}
.ns__title {
  font-size: 14px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
  margin-bottom: 2px;
}
.ns__value {
  font-family: "Roboto", sans-serif;
  font-size: 26px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
  position: relative;
}
.ns__value::before,
.ns__value::after {
  position: absolute;
  top: 0;
  height: 100%;
  text-transform: none;
  color: rgba(0, 0, 0, 0.3);
  font-size: 15px;
  line-height: 26px;
}
.ns__value::before {
  right: calc(100% + 2px);
  content: attr(data-prefix);
}
.ns__value::after {
  left: calc(100% + 2px);
  content: attr(data-suffix);
}
</style>