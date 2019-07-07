<template>
  <div class="viewer" @click="refresh" :data-type="asset && asset.type || 'empty'">
    <div v-if="asset === null">Empty</div>
    <div v-else-if="asset.type === 'env'" class="viewer__background" :style="`background-image:url(${asset.picture})`"/>
    <div v-else-if="asset.type === 'encounter'" class="viewer__background encounter" :style="`background-image:url(${asset.background})`">
      <div class="encounter__chars">
        <div
          v-for="char in characters" :key="char.uid"
          v-show="char.status !== 'hidden'"
          class="encounter__char"
          :class="char.active && 'encounter__char--active'"
          :data-type="char.type"
          >
          <div v-if="char.status === 'unknown'" class="encounter__unknown">?</div>
          <template v-else>
          <CharacterPicture class="encounter__thumb" :src="char.picture"/>
          <svg class="healthbar" viewBox="0 0 100 100" v-if="char.health">
            <path :d="char.health.back" stroke="#500" stroke-width="3" fill="none"/>
            <path :d="char.health.fore" :style='`d:path("${char.health.fore}")`' stroke="red" stroke-width="3" fill="none"/>
          </svg>
          </template>
        </div>
      </div>
    </div>
    <div v-else-if="['npc','mob','pc'].includes(asset.type)" class="portrait">
      <svg :viewBox="`0 0 ${asset.picture.width} ${asset.picture.height}`" class="portrait__img">
        <image :xlink:href="asset.picture.url" :width="asset.picture.width" :height="asset.picture.height"/>
      </svg>
    </div>
    <div v-else data-type="asset && asset.type || 'empty'">
      <h1>WHY WE HERE YO WHY WHY</h1>
      {{ JSON.stringify(asset) }}
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import nanoid from "nanoid";
import { db } from "../services/firebase";
import CharacterPicture from "../components/CharacterPicture.vue";
export default Vue.extend({
  data() {
    return {
      asset: null
    }
  },
  computed: {
    characters() {
      return this.asset.characters.map(char => {
        let health = null;
        if (char.health) {
          let b = Math.abs(-50 + 45 * Math.cos(-135 * Math.PI / 180)),
              q = (-45 - (90 - 90 * Math.min(char.damage, char.health) / char.health)) * Math.PI / 180,
              fx = Math.abs(-50 + 45 * Math.cos(q)),
              fy = Math.abs(-50 + 45 * Math.sin(q));
          health = {
            back: `M${100-b},${b} A45,45,0,0,0,${b},${b}`,
            fore: `M${100-b},${b} A45,45,0,0,0,${fx},${fy}`
          };
        }
        return {
          ...char,
          health
        }
      })
    }
  },
  methods: {
    refresh() {
      window.location.reload();
    }
  },
  created() {
    const nanoid = require('nanoid');
    this.id = nanoid();

    // watch viewer
    this.unsubscribeViewer = db.collection(`assets`).where('display','==',true).onSnapshot(snapshot => {
      if (snapshot.empty) return this.asset = null;
      console.log(snapshot);
      const r = snapshot.docs[0];
      this.asset = {id:r.id, ...r.data()};
    });
  },
  beforeDestroy() {
    this.unsubscribeViewer();
  },
  components: {
    CharacterPicture
  }
});
</script>
<style scoped>
.viewer {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
}
.viewer__background {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
}

.portrait {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
}
.portrait__img {
  height: 100%;
}

.encounter {
  display: flex;
  align-items: center;
  justify-content: center;
}
.encounter__chars {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  height: 150px;
}
.encounter__char {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin: 0 10px;
  position: relative;
  transition: all ease 0.3s;
}
.encounter__char[data-type="mob"],
.encounter__char[data-type="npc"] {
  border-color: #b00;
  background-color: #bb000030
}
.encounter__unknown {
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 90px;
  font-weight: 500;
  color: rgba(255,255,255,0.4);
}
.encounter__thumb {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.encounter__char--active {
  border-color: gold;
  box-shadow: 0 0 20px gold;
  background-color: rgba(255,215,0,0.5);
}

.healthbar {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transform: scale(1.3);
}
.healthbar path {
  transition: d 0.35s;
}
</style>
