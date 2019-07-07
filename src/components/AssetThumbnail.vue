<template>
<div class="asset" :class="[asset.display && 'asset--active']" :data-type="asset.type" v-on="$listeners">
  <template v-if="asset.type === 'encounter'">
    <div class="asset__pic" :style="`background-image:url(${asset.background})`"/>
  </template>
  <template v-else-if="['npc','pc','mob'].includes(asset.type)">
  <CharacterPicture class="asset__pic" :src="asset.picture"/>
  </template>
  <template v-else>
    <div class="asset__pic" :style="`background-image:url(${asset.picture})`"/>
  </template>
  <div class="asset__name">{{ asset.label }}</div>
  <template v-if="asset.display">
    <svg class="asset__broadcast" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' preserveAspectRatio='none'>
      <rect width='40' height='40'/>
    </svg>
    <VueIcon class="asset__display-icon" icon="cast_connected"/>
  </template>
</div>
</template>
<script lang="ts">
import Vue from "vue";
import CharacterPicture from "../components/CharacterPicture.vue";
export default Vue.extend({
  props: ['asset'],
  components: {
    CharacterPicture
  }
});
</script>
<style scoped>
.asset {
  width: 100px;
  height: 100px;
  border: 1px solid #333;
  border-radius: 2px;
  margin: 10px 0 0 10px;
  display: inline-block;
  position: relative;
  user-select: none;
}
.asset:not(.asset--active):hover {
  border-color: #007DB1;
  box-shadow: 0 0 3px #007DB1;
  opacity: 1;
}
.asset__pic {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
}
.asset__name {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #aaa;
  position: relative;
  text-align: center;
  position: absolute;
  left: 0;
  width: 100%;
  bottom: 0;
  max-height: 50%;
  text-overflow: ellipsis;
  background: #333333cc;
}

.asset--active {

}
.asset__broadcast {
  position: absolute;
  left: -2px;
  top: -2px;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  pointer-events: none;
}
.asset__broadcast rect {
  fill: none;
  stroke: #A44CF6;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 4px;
  animation: athumb-stroke 0.5s linear infinite;
  shape-rendering: geometricPrecision;
  stroke-dashoffset: 8px;
  stroke-width: 6px;
}
@keyframes athumb-stroke {
  to {
      stroke-dashoffset: 0;
  }
}
.asset__display-icon {
  position: absolute;
  right: 5px;
  top: 5px;
  width:30px;
  height: 26px;
}
.asset__display-icon svg {
  fill: #B96DFF;
  color: rgba(0, 0, 0, 0.5);
  background: currentColor;
  border-radius: 3px;
}


/* Encounters **/
.asset[data-type="encounter"] .asset__pic {
  background-size: cover;
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

.athumb__display-icon {
  position: absolute;
  right: 7px;
  top: 5px;
  opacity: 0.1;
  width:36px;
  height: 32px;
}
.athumb__display-icon svg {
  fill: #B96DFF;
  color: rgba(0, 0, 0, 0.5);
  background: currentColor;
  border-radius: 3px;
}
.athumb:not(.athumb--active):hover .athumb__display-icon {
  opacity: 0.5;
}
.athumb:not(.athumb--active) .athumb__display-icon:hover {
  opacity: 0.8;
}


.athumb--active .athumb__broadcast rect {
  stroke: #A44CF6;
}
.athumb--active .athumb__display-icon {
  opacity: 1;
}
.athumb--active .athumb__display-icon svg {
}

</style>