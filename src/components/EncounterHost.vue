<template>
  <div class="encounter">
    This Is The Encounter: {{ $route.params.asset }}
    <div class="encounter__params">
      These are the params
    </div>
    <div class="encounter__chars">
      <div class="encounter__row legend">
        <div class="legend__title">Characters</div>
        <div class="legend__col">Init.</div>
        <div class="legend__col">Health</div>
        <div class="legend__col">Dmg</div>
      </div>
      <div class="encounter__row char" :class="[char.active && 'char--active', char.status==='hidden' && 'char--hidden']" v-for="char in sortedCharacters" :key="char.uid">
        <VueIcon :icon="char.active && 'play_arrow' || ''" class="char__icon" @click="setActiveChar(char)"/>
        <CharacterPicture class="char__pic" :src="char.picture"/>
        <VueInput class="flat char__label" placeholder="Label" :value="char.label" @change="update('label', char, $event.target.value)"/>
        <VueInput class="flat char__name" placeholder="Name" :value="char.name" @change="update('name', char, $event.target.value)"/>
        <VueInput class="flat char__init" placeholder="10" :value="char.initiative" @change="update('initiative', char, $event.target.value)"/>
        <VueInput class="flat char__health" :value="char.health" @change="update('health', char, $event.target.value)"/>
        <VueInput class="flat char__dmg" :value="char.damage" @change="update('damage', char, $event.target.damage)"/>
        <VueGroup :value="char.status" @update="update('status', char, $event)" class="char__status">
          <VueGroupButton value="hidden" class="icon-button" icon-left="block"/>
          <VueGroupButton value="unknown" class="icon-button" icon-left="help"/>
          <VueGroupButton value="visible" class="icon-button" icon-left="mood"/>
        </VueGroup>
        <VueButton class="icon-button flat char__del" icon-left="delete" @click="remove(char)"/>
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

export default Vue.extend({
  data() {
    return {
      uid:6,
      activeCharacter: "",
      characters: [
        {uid:"1", id:"1", label:"Aldarian", name:"Aldarian P Featherbottom III", health:20, damage:0, initiative:-1, status:"hidden",
        picture: {
          url:
            "https://firebasestorage.googleapis.com/v0/b/dndm-firebase.appspot.com/o/player-aldarian.jpeg?alt=media&token=6e3e2696-ca1b-4770-8ee2-e0151663f57a",
          width: 150,
          height: 150,
          face: { x: 75, y: 75, r: 70 }
        }},
        {uid:"2", id:"2", label:"Elrose", name:"Elrose Highill", health:15, damage:0, initiative:-1, status:"hidden",
        picture: {
          url:
            "https://firebasestorage.googleapis.com/v0/b/dndm-firebase.appspot.com/o/player-elrose.png?alt=media&token=55544544-e37c-4937-9d79-74169153916a",
          width: 772,
          height: 731,
          face: { x: 420, y: 150, r: 100 }
        }},
        {uid:"3", id:"3", label:"Thandraug", name:"Thandraug Oakenheel", health:20, damage:0, initiative:-1, status:"hidden",
        picture: {
          url:
            "https://firebasestorage.googleapis.com/v0/b/dndm-firebase.appspot.com/o/player-thandraug.png?alt=media&token=7d0ac474-0aa6-4747-9ec6-0464c3400dc8",
          width: 881,
          height: 1444,
          face: { x: 310, y: 210, r: 110 }
        }},
        {uid:"4", id:"4", label:"Meadowlark", name:"Meadow Lark Berry Bramble", health:15, damage:0, initiative:-1, status:"hidden",
        picture: {
          url:
            "https://firebasestorage.googleapis.com/v0/b/dndm-firebase.appspot.com/o/player-meadowlark.png?alt=media&token=7ee67b79-b47a-4b74-8525-d92a07cf9bf6",
          width: 649,
          height: 1250,
          face: { x: 470, y: 340, r: 150 }
        }},
        {uid:"5", id:"5", label:"Ravella", name:"Ravella", health:14, damage:0, initiative:-1, status:"hidden",
        picture: {
          url:
            "https://firebasestorage.googleapis.com/v0/b/dndm-firebase.appspot.com/o/player-ravella.jpg?alt=media&token=25bf09ca-5d65-4797-9c0f-f99aec26becf",
          width: 150,
          height: 150,
          face: { x: 75, y: 75, r: 70 }
        }},
      ]
    };
  },
  computed: {
    sortedCharacters() {
      return [...this.characters]
      .sort((a,b) => b.initiative - a.initiative)
      .map(r => {
        let ratio = (100 * r.picture.face.r / r.picture.width).toFixed(2);
        r.style = `background-repeat:no-repeat; background-image:url(${r.picture.url}); background-position:${-1*r.picture.face.x + 20}px, ${-1*r.picture.face.y + 20}px;`;
        return r;
      });
    },
    availableNewCharacters() {
      let map = { pc:[], npc:[], mob:[] };
      this.$store.state.assets.forEach(a => {
        if (["pc","npc"].includes(a.type) && this.characters.some(r => r.id === a.id)) return;
        map[a.type].push(a);
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
      let existing = this.characters.find(r => r.active);
      if (existing && existing.uid === char.uid) return;
      if (existing) this.update('active', existing, false);
      if (char.status !== 'visible') this.update('status', char, 'visible');
      this.update('active', char, true);
    },
    addCharacter(char) {
      this.characters.push({
        ...char,
        uid: this.uid++,
        health: 0,
        damage: 0,
        initiative: -1,
        status: "hidden",
        active: false
      });
    },
    update(field, char, ev) {
      this.$set(this.characters.find(r => r.uid === char.uid), field, ev);
    },
    remove(char) {
      this.characters = this.characters.filter(r => r.uid !== char.uid);
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