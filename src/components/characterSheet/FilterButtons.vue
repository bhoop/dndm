<template>
  <div class="fb">
    <div
      class="b"
      v-for="o in options"
      :key="o.value"
      @click="pick(o)"
      :class="o.value === value ? 'b--on': ''"
    >{{ o.label }}</div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: ["value", "options"],
  methods: {
    pick(option: string) {
      this.$emit("input", option.value === this.value ? "" : option.value);
    }
  }
});
</script>

<style scoped>
.fb {
  display: flex;
  justify-content: center;
  padding: 5px 0;
}
.b {
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 700;
  margin: 0 5px;
  color: rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
  padding: 4px 6px 2px 6px;
  border-radius: 2px;
}
.b--on {
  background: #c53131;
  color: #fff;
}
</style>