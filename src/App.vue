<style lang="less">
#app {
  margin: 10px;
  width: 670px;
  border: 1px solid #fff;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
</style>


<template>
  <div id="app">
    <i-calendar></i-calendar>
  </div>
</template>

<script>
import iCalendar from "./components/calendar";

export default {
  name: "App",
  components: {
    iCalendar
  }
};
</script>

