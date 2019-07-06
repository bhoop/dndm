<template>
  <div class="dmode">
    <VueGroup v-model="mode">
      <VueGroupButton class="big" value="host" icon-left="cast">Host</VueGroupButton>
      <VueGroupButton class="big" value="viewer" icon-left="airplay">Viewer</VueGroupButton>
    </VueGroup>
    <form class="dmode__form" @submit.prevent="join">
      <VueFormField>
        <VueInput v-model="txtHost" placeholder="Table name" required />
      </VueFormField>
      <VueButton class="primary dmode__btn">Join</VueButton>
    </form>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      mode: "host",
      txtHost: ""
    };
  },
  methods: {
    join() {
      this.$store.dispatch("joinTable", {
        mode: this.mode,
        table: this.txtHost
      });
    }
  }
});
</script>
<style scoped>
.dmode {
  align-self: center;
  justify-self: center;
  width: 300px;
  height: 300px;
  margin: 0 auto;
}
.dmode__form {
  padding: 20px;
}
.dmode__btn {
  margin-top: 20px;
  width: 100%;
}
</style>