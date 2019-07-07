<template>
  <div class="modal">
    <div class="modal__win">
      <div class="modal__head">
        {{ asset.label }}
        <VueIcon icon="close" class="modal__close" @click="close"/>
      </div>
      <EncounterHost class="modal__body" v-if="asset.type === 'encounter'" :asset="asset"
      @input="$emit('input', $event)"
      @delete="$emit('delete')"
      />
      <div class="modal__body" v-else>
        {{ JSON.stringify(asset) }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import EncounterHost from "../components/EncounterHost";
export default Vue.extend({
  props: ['asset'],
  methods: {
    close() {
      this.$router.replace(`/host/${this.$route.params.table}`)
    }
  },
  components: {
    EncounterHost
  }
});
</script>
<style scoped>
.modal {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  padding: 30px;
}
.modal__win {
  width: 100%;
  height: 100%;
  border: 1px solid #555;
  padding: 2px;
  display: flex;
  flex-direction: column;
}
.modal__head {
  background: #444;
  padding: 5px;
  display: flex;
  align-items: center;
}
.modal__close {
  margin-left: auto;
  width: 30px;
  height: 30px;
}
.modal__body {
  flex: 1 1 0%;
}
</style>
