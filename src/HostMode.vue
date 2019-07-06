<template>
  <div class="viewer">
    <div class="viewer__head">
      <VueIcon icon="arrow_back" />
      <div class="viewer__tablename">{{ $store.state.tableName}}</div>
    </div>
    <button @click="$store.commit('mode', 'default')">home</button>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { db } from "./services/firebase";
export default Vue.extend({
  created() {},
  beforeDestroy() {}
});
</script>
<style scoped>
.viewer__head {
  display: flex;
  align-items: center;
}
</style>
