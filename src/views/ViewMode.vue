<template>
  <div class="viewer">
    Viewing {{ $route.params.table }} / {{ JSON.stringify(asset) }}
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import nanoid from "nanoid";
import { db } from "../services/firebase";
export default Vue.extend({
  data() {
    return {
      asset: {}
    }
  },
  created() {
    const nanoid = require('nanoid');
    this.id = nanoid();

    // watch viewer
    this.unsubscribeViewer = db.doc(`view/${this.$route.params.table}`).onSnapshot(snapshot => {
      if (!snapshot.exists) this.viewer = null;
      this.asset = snapshot.data() || null;
    });
  },
  beforeDestroy() {
    this.unsubscribeViewer();
  }
});
</script>
<style scoped>
</style>
