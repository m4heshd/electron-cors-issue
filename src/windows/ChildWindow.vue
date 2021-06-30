<template>
  <div>
    <h1>Parent assigned this: {{ text }}</h1>
  </div>
</template>

<script>
import {ref} from "vue";

export default {
  name: "ChildWindow",
  setup() {
    const text = ref(window.customProperty);

    setTimeout(() => {
      text.value = window.customProperty;
    }, 3000);

    return {text};
  }
};
</script>

<style scoped>
div {
  text-align: center;
}
</style>
