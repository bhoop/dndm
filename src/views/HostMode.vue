<template>
  <div class="host">
    <div class="host__assets">
      <div class="athumb athumb--player" v-for="r in assets.pc" :key="r.id">
        <CharacterPicture class="athumb__pic" :src="r.picture"/>
        <div class="athumb__name">{{ r.label }}</div>
      </div>
      <div class="host__heading">
        Encounters
        <VueButton class="info icon-button flat round add-asset-button" icon-left="add"/>
      </div>
      <div class="athumb athumb--encounter" v-for="r in assets.encounter" :key="r.id" :style="`background-image:url(${r.background})`">
        <div class="athumb__name">{{ r.label }}</div>
      </div>
      <div class="host__heading">NPCs</div>
      <div class="athumb athumb--npc" v-for="r in assets.npc" :key="r.id">
        <CharacterPicture class="athumb__pic" :src="r.picture"/>
        <div class="athumb__name">{{ r.label }}</div>
      </div>
      <div class="host__heading">Monsters</div>
      <div class="athumb athumb--mob" v-for="r in assets.mob" :key="r.id">
        <CharacterPicture class="athumb__pic" :src="r.picture"/>
        <div class="athumb__name">{{ r.label }}</div>
      </div>
      <router-view/>
    </div>
    <div class="host__viewers">
      <div class="vthumb" v-for="v in viewers" :key="v.id">
        <div class="vthumb__name">monitor</div>
        <VueIcon icon="settings" class="vthumb__settings"/>
      </div>
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
import CharacterPicture from "../components/CharacterPicture.vue";
export default Vue.extend({
  data() {
    return {
      viewers: []
    }
  },
  computed: {
    assets() {
      let map = { pc:[], encounter:[], npc:[], mob:[], env:[] };
      this.$store.state.assets.forEach(a => map[a.type].push(a));
      return map;
    }
  },
  methods: {
    openAsset(which: string) {
      this.$router.replace(`/host/${this.$route.params.table}/asset/12345`)      
    }
  },
  created() {
    // watch viewers
    this.unsubscribeViewers = db.doc(`tables/${this.$route.params.table}`).collection("viewers").onSnapshot(querySnapshot => {
      var list = [];
      querySnapshot.forEach(d => list.push({id:d.id, ...d.data()}));
      this.viewers = list;
    });
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
    this.unsubscribeViewers();
  },
  components: {
    CharacterPicture
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


.athumb {
  width: 100px;
  height: 100px;
  border: 1px solid #333;
  border-radius: 2px;
  margin: 10px 0 0 10px;
  display: inline-block;
  position: relative;
  opacity: 0.8;
}
.athumb:hover {
  border-color: #007DB1;
  box-shadow: 0 0 3px #007DB1;
  opacity: 1;
}
.athumb__pic {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.athumb--player .athumb__name {
  position: absolute;
  left: 0;
  width: 100%;
  bottom: 0;
  text-align: center;
  background: linear-gradient(0deg, rgba(0,0,0,1) 30%, rgba(255,255,255,0) 100%);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  padding-top: 30px;
  padding-bottom: 10px;
  color: #aaa;
}

.athumb--encounter {
  background-size: cover;
}

.athumb--new {
  border: 1px solid #222;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.1);
}
.athumb--new > * {
  width: 70px;
  height: 70px;
}
.athumb--new svg {
  fill: currentColor;
}

.vthumb {
  width: 150px;
  height: 150px;
  border: 1px solid #ffffff30;
  margin-bottom: 15px;
  border-radius: 2px;
  position: relative;
}
.vthumb__name {
  background: #ffffff30;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 5px;
  text-align: center;
}
.vthumb__settings {
  position: absolute;
  right: 5px;
  top: 2px;
}
.vthumb__settings svg {
  fill: rgba(255,255,255,0.25);
}
</style>
