<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>
      <button @click="openWindow">Open new window</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup() {
    function openWindow() {
      const newWnd = window.open(`file://${__appPath}/renderer/child.html`);

      setTimeout(() => {
        newWnd.customProperty = 'SUCCESS';
      }, 1000);
    }

    return {
      openWindow
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

button {
  box-sizing: border-box;
  padding: 10px;
}
</style>
