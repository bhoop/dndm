<template>
  <div class="encounter">
    <div class="encounter__params">
      <!-- todo: Viewer parameters -->
    </div>
    <div class="encounter__chars">
      <div class="encounter__row legend">
        <div class="legend__title">Characters</div>
        <div class="legend__col">Init.</div>
        <div class="legend__col">Health</div>
        <div class="legend__col">Dmg</div>
      </div>
      <div
        class="encounter__row char"
        :class="[char.active && 'char--active', char.status==='hidden' && 'char--hidden']"
        v-for="char in asset.characters" :key="char.uid"
        >
        <VueIcon :icon="char.active && 'play_arrow' || ''" class="char__icon" @click="setActiveChar(char)"/>
        <CharacterPicture class="char__pic" :src="char.picture"/>
        <VueInput class="flat char__label" placeholder="Label" :value="char.label" @change="updateCharacter('label', char, $event.target.value)"/>
        <VueInput class="flat char__name" placeholder="Name" :value="char.name" @change="updateCharacter('name', char, $event.target.value)"/>
        <VueInput class="flat char__init" placeholder="10" :value="char.initiative" @change="updateCharacter('initiative', char, $event.target.value)"/>
        <VueInput class="flat char__health" :value="char.health" @change="updateCharacter('health', char, $event.target.value)"/>
        <VueInput class="flat char__dmg" :value="char.damage" @change="updateCharacter('damage', char, $event.target.value)"/>
        <VueGroup :value="char.status" @update="updateCharacter('status', char, $event)" class="char__status">
          <VueGroupButton value="hidden" class="icon-button" icon-left="block"/>
          <VueGroupButton value="unknown" class="icon-button" icon-left="help"/>
          <VueGroupButton value="visible" class="icon-button" icon-left="mood"/>
        </VueGroup>
        <VueButton class="icon-button flat char__del" icon-left="delete" @click="removeCharacter(char)"/>
      </div>
      <div class="encounter__row encounter__row--new">
        <VueDropdown label="Add Character" button-class="primary">
          <template v-for="group in availableNewCharacters">
            <div class="encounter-new-heading">{{ group.title }}</div>
            <VueDropdownButton class="primary" v-for="item in group.items" :key="item.id" @click="addCharacter(item)">{{ item.label }}</VueDropdownButton>
          </template>
        </VueDropdown>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import CharacterPicture from "./CharacterPicture.vue";
import nanoid from 'nanoid';

export default Vue.extend({
  props: ['asset'],
  computed: {
    availableNewCharacters() {
      let map = { pc:[], npc:[], mob:[] };
      this.$store.state.assets.forEach(a => {
        if (["pc","npc"].includes(a.type) && this.asset.characters.some(r => r.asset === a.id)) return;
        if (a.type in map) map[a.type].push({...a, asset:a.id});
      });
      let result = [];
      if (map.pc.length) result.push({title:"Players", items:map.pc});
      if (map.npc.length) result.push({title:"NPCs", items:map.npc});
      if (map.mob.length) result.push({title:"Monsters", items:map.mob});
      return result;
    }
  },
  methods: {
    setActiveChar(char) {
      let characters = this.asset.characters.map(r => {
        if (r.uid === char.uid && !r.active) return {...r, active:true, status:'visible'};
        if (r.active) return {...r, active:false};
        return r;
      });
      this.$emit('input', {characters});
    },
    addCharacter(char) {
      let characters = [...this.asset.characters, {
        ...char,
        uid: nanoid(),
        health: 0,
        damage: 0,
        initiative: -1,
        status: "hidden",
        active: false
      }];
      this.$emit('input', {characters});
    },
    updateCharacter(field, char, ev) {
      let characters = this.asset.characters.map(r => {
        if (r.uid !== char.uid) return r;
        return r.uid === char.uid ? {...r, [field]:ev} : r;
      });
      characters.sort((a,b) => b.initiative - a.initiative);
      this.$emit('input', {characters });
    },
    removeCharacter(char) {
      this.$emit('input', {characters:this.asset.characters.filter(r => r.uid !== char.uid)});
    }
  },
  components: {
    CharacterPicture
  }
});
</script>
<style scoped>
.encounter {
  background-image: url("../assets/images/environment-cavern.jpg");
  background-size: cover;
}
.encounter__row {
  background: #222;
  border-bottom: 1px solid #111;
}
.encounter__row--new {
  padding: 10px;
}

.encounter__params {
  outline: 10px solid rgba(0, 0, 0, 0.5);
  margin: 50px 50px 10px 50px;
  background: #111;
  padding: 15px;
}

.encounter__chars {
  outline: 10px solid rgba(0, 0, 0, 0.5);
  margin: 20px 50px;
}

.char {
  height: 50px;
  display: flex;
  align-items: center;
}
.char--active {
  background: #004576;
}
.char--hidden > * {
  opacity: 0.3;
}
.char:not(.char--active):hover {
  background: #333;
}

.char__icon {
  width: 40px;
  height: 100%;
  padding: 8px;
}
.char__pic {
  width: 40px;
  height: 40px;
  border: 1px solid #000;
  border-radius: 2px;
}
.char__label {
  min-width: 0;
  width: 100px;
}
.char__name {
  flex: 1 1 0%;
}
.char__init,
.char__health,
.char__dmg,
.legend__col {
  width: 50px;
  min-width: 0;
}
.char__status {
  width: 100px;
}
.char__del {
  margin: 0 10px;
}
</style>
<style>
.char__name input {
  font-weight: 600;
}
.char__health input {
  color: #56CD96 !important;
  font-weight: 700;
}
.char__dmg input {
  color: #E83030 !important;
  font-weight: 700;
}

.legend {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  padding:5px 160px 5px 0;
}
.legend__title {
  margin-right: auto;
  font-size: 16px;
  padding-left: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
}
.legend__col {
  letter-spacing: 1px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
}

.encounter-new-heading {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 5px 14px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.5);
}
</style>