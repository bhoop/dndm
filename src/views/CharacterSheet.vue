<template>
  <div class="cs">
    <div class="cs__portrait-bg" />
    <div class="cs__head">
      <div class="cs__name">Aldarian P Featherbottom III</div>
    </div>
    <div style="height:1000px" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import FilterButtons from "../components/characterSheet/FilterButtons.vue";
import NumberStat from "../components/characterSheet/NumberStat.vue";

interface Skill {
  name: string;
  proficient: boolean;
  bonus: number;
}

export default Vue.extend({
  data(): {
    skills: Skill[];
    skillsExpanded: boolean;
    actionFilter: string;
  } {
    return {
      skillsExpanded: false,
      skills: [
        { name: "Acrobatics", proficient: false, bonus: 3 },
        { name: "Animal Handling", proficient: false, bonus: 0 },
        { name: "Arcana", proficient: true, bonus: 4 },
        { name: "Athletics", proficient: true, bonus: 5 },
        { name: "Deception", proficient: false, bonus: -1 }
      ],
      actionFilter: ""
    };
  },
  computed: {
    proficientSkills(): Skill[] {
      return this.skills.filter(s => s.proficient);
    }
  },
  methods: {
    mod(bonus: number): string {
      return bonus < 0 ? `${bonus}` : `+${bonus}`;
    }
  },
  components: {
    FilterButtons,
    NumberStat
  }
});
</script>
<style>
html {
  /* overflow: hidden; */
  height: 100%;
}
body {
  overflow-y: scroll;
  /* overscroll-behavior-y: contain; */
  -webkit-overflow-scrolling: touch;
  height: 100%;
}
</style>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Spectral:400,500,600,700,800|Roboto:400,500,700|Roboto+Condensed:400,700&display=swap");

:root {
  --accent: #c53131;
}

.cs {
  line-height: 1;
  font-family: "Roboto Condensed";
  height: 100%;
}

.cs__portrait-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 200px;
  background: url(../assets/portrait-bg.jpg) center top no-repeat fixed;
  background-size: cover;
  background-attachment: fixed;
}
.cs__portrait {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center 60px;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.cs__head {
  position: fixed;
  top: 0;
  height: 50px;
  width: 100vw;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.cs__head::before {
  content: "☰";
  margin-left: -7px;
  margin-right: 7px;
  font-size: 20px;
}
.cs__name {
  font-family: "Spectral", serif;
  font-size: 20px;
  font-weight: 500;
}
.cs__spacer {
  height: 50vh;
}
.cs__race {
  font-size: 14px;
  padding: 5px 20px;
  color: rgba(255, 255, 255, 0.5);
  position: sticky;
  top: 50px;
  transform: translateY(-10px);
}
.cs__panel {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 15px;
  margin-bottom: 20px;
  position: relative;
}
.panel__title {
  flex: 0 0 100%;
  text-align: center;
  margin-bottom: 15px;
  column-span: all;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  line-height: 0;
  color: #c53131;
  opacity: 0.5;
  white-space: nowrap;
}
.panel__title::before,
.panel__title::after {
  content: " ";
  height: 3px;
  border: 1px solid currentColor;
  border-width: 1px 0;
  flex: 1 1 50%;
  opacity: 0.5;
}
.panel__title::before {
  margin-right: 10px;
}
.panel__title::after {
  margin-left: 10px;
}
.panel__filter {
  margin-bottom: 30px;
}
.panel__expando {
  position: absolute;
  left: 50%;
  top: 100%;
  width: 40px;
  transform: translate(-50%, -50%);
  height: 10px;
  overflow: hidden;
  border-radius: 5px;
  border: 10px solid rgba(255, 255, 255, 0.9);
  border-width: 0 0 5px 0;
  line-height: 0;
  /* <div
      style="height:10px; text-align: center; "
    >···</div> */
}
.panel__expando::before {
  content: "···";
  line-height: 0;
  transform: translateY(2px);
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 2px;
  text-align: center;
}
.cs__panel--stats {
  display: flex;
}
.cs__panel--attrs {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.cs__panel--skills {
  columns: 2 auto;
  column-gap: 25px;
  font-size: 14px;
}
.cs__stat + .cs__stat {
  margin-left: 20px;
}
.cs__conditions {
  flex: 1 1 0%;
}
.cs__conditions:empty {
  align-self: center;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
  font-weight: 400;
  font-size: 14px;
  text-align: center;
}
.cs__conditions:empty::before {
  content: "No Conditions";
}

.skill {
  display: flex;
  align-items: center;
  font-size: 16px;
}
.skill + .skill {
  margin-top: 10px;
}
.skill__sep {
  flex: 1 1 0%;
  height: 1px;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
  margin: 0 5px;
}
.skill__mod {
  text-align: right;
}
.skill--proficient {
  font-weight: 700;
}

.table {
  font-size: 13px;
}
.table + .table {
  margin-top: 30px;
}
.table__row {
  display: grid;
  grid-column-gap: 15px;
  grid-auto-rows: auto;
}
.table__row--heading {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  align-items: flex-end;
  letter-spacing: 0.5px;
  padding-bottom: 5px;
}
.table__row--heading > :first-child {
  font-size: 1.5em;
  color: #c53131;
}
.table__row:not(.table__row--heading) {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 10px 0;
}
.table__more {
  font-size: 10px;
  text-transform: none;
  margin-left: 3px;
  font-weight: 400;
  vertical-align: baseline;
}

.table--attacks .table__row {
  grid-template-columns: 1fr 60px 50px 80px;
}

.table--actions .table__row {
  grid-template-columns: 1fr 60px 50px 80px;
}
</style>