<template>
  <div class="host">
    <div class="host__assets">
      <template v-for="group in assetGroups">
        <div class="host__heading" v-if="group.title">
          {{ group.title }}
          <VueButton class="info icon-button flat round add-asset-button" icon-left="add"/>
        </div>
        <AssetThumbnail
          v-for="r in group.items"
          :key="r.id"
          :asset="r"
          @click="editAsset(r)"
          @dblclick="displayAsset(r)"
          />
      </template>
      <HostModeDetail class="host__details" v-if="openAsset" :asset="openAsset" @input="updateAsset(openAsset.id, $event)"/>
    </div>
    <!-- <div class="host__head">
      <VueIcon icon="arrow_back" />
      <div class="host__tablename">{{ $route.params.table }}</div>
    </div>
    <div class=""
    <button @click="$router.replace('/')">home</button> -->
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { db } from "../services/firebase";
import AssetThumbnail from "../components/AssetThumbnail.vue";
import HostModeDetail from "../components/HostModeDetail.vue";
export default Vue.extend({
  data() {
    return {
      viewers: []
    }
  },
  computed: {
    activeAsset() {
      return this.$store.state.assets.find(r => r.display);
    },
    openAsset() {
      return this.$store.state.assets.find(r => r.id === this.$route.params.asset);
    },
    assetGroups() {
      let map = { pc:[], encounter:[], npc:[], mob:[], env:[] };
      this.$store.state.assets.forEach(a => map[a.type].push(a));
      return [
        {items:map.pc},
        {title:"Encounters", items:map.encounter},
        {title:"NPCs", items:map.npc},
        {title:"Monsters", items:map.mob},
        {title:"Environments", items:map.env}
      ];
    }
  },
  methods: {
    displayAsset(which) {
      clearTimeout(this.openTimer);
      let old = this.activeAsset;
      if (old && old.id === which.id) return db.doc(`assets/${which.id}`).update({display:false});
      db.doc(`assets/${which.id}`).update({display:true});
      if (old) db.doc(`assets/${this.activeAsset.id}`).update({display:false});
    },
    editAsset(which) {
      clearTimeout(this.openTimer);
      this.openTimer = setTimeout(() => {
        this.$router.replace(`/host/${this.$route.params.table}/asset/${which.id}`)
      }, 300);
    },
    updateAsset(id, data) {
      db.doc(`assets/${id}`).update(data);
    }
  },
  created() {
    // watch assets
    this.unsubscribeAssets = db.collection("assets")
    .onSnapshot(querySnapshot => {
        var assets = [];
        querySnapshot.forEach(function(doc) {
            assets.push({id:doc.id, ...doc.data()});
        });
        this.$store.commit('assets', assets);
    });
  },
  beforeDestroy() {
    this.unsubscribeAssets();
  },
  components: {
    AssetThumbnail,
    HostModeDetail
  }
});
</script>
<style scoped>
.host {
  width: 100%;
  display: flex;
}
.host__viewers {
  background: #ffffff11;
  margin-left: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  width: 180px;
}
.host__assets {
  flex: 1 1 auto;
  position: relative;
}
.host__heading {
  flex: 0 0 100%;
  height: auto;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.add-asset-button {
  margin-left: 10px;
}

</style>
