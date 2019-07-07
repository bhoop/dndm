<template>
  <div class="host">
    <div class="host__assets">
      <template v-for="group in assetGroups">
        <div class="host__heading" v-if="group.title">
          {{ group.title }}
          <VueButton class="info icon-button flat round add-asset-button" :loading="pendingCreate===group.type" icon-left="add" @click="createAsset(group.type)"/>
        </div>
        <AssetThumbnail
          v-for="r in group.items"
          :key="r.id"
          :asset="r"
          class="host__thumb"
          :data-type="r.type"
          @click="editAsset(r)"
          @dblclick="displayAsset(r)"
          />
      </template>
      <HostModeDetail class="host__details" v-if="openAsset" :asset="openAsset"
        @input="updateAsset(openAsset.id, $event)"
        @delete="deleteAsset(openAsset.id)"
        />
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
import nanoid from "nanoid";
import { db } from "../services/firebase";
import AssetThumbnail from "../components/AssetThumbnail.vue";
import HostModeDetail from "../components/HostModeDetail.vue";

export default Vue.extend({
  data() {
    return {
      pendingCreate:""
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
      let items = [...this.$store.state.assets];
      items.sort((a, b) => (a.label || "").localeCompare(b.label, undefined, {numeric:true, sensitivity:'base'}));
      items.forEach(a => map[a.type].push(a));
      return [
        {items:map.pc},
        {title:"Encounters", type:'encounter', items:map.encounter},
        {title:"NPCs", type:'npc', items:map.npc},
        {title:"Monsters", type:'mob', items:map.mob},
        {title:"Environments", type:'env', items:map.env}
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
      if (data.display) {
        const existing = this.$store.state.assets.find(r => r.display);
        if (existing && existing.id !== id) db.doc(`assets/${existing.id}`).update({display:false});
      }
      db.doc(`assets/${id}`).update(data);
    },
    deleteAsset(id) {
      if (this.$route.params.asset === id) this.$router.replace(`/host/${this.$route.params.table}`);
      db.doc(`assets/${id}`).delete();
    },
    async createAsset(type) {
      this.pendingCreate = type;
      let data = { type, display:false, table:this.$route.params.table };
      switch (type) {
        case 'encounter':
          data.label = 'New Encounter';
          data.title = 'Encounter';
          data.background = this.$store.state.assets.find(r => r.type==='env').picture;
          data.characters = this.$store.state.assets.filter(r => r.type==='pc').map(r => ({
            uid: nanoid(),
            active: false,
            asset: r.id,
            damage: 0,
            health: r.health,
            initiative: -1,
            label: r.label,
            name: r.name,
            picture: r.picture,
            status: "visible",
          }));
          data.showCharacters = true;
          data.showCharacterNames = 'none';
          data.showHealthBars = true;
          break;
      }

      const ref = await db.collection("assets").add(data);
      this.editAsset(ref);
      this.pendingCreate = "";
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
  border-top: 1px solid #000;
  margin-top: 30px;
}

.add-asset-button {
  margin-left: 10px;
}
.host__thumb[data-type="encounter"] {
  width: 210px;
}
</style>
