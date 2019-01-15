
  <template>
    <div id="app" style="width:200px;height:50px;">
      <div v-occupy="{ data: content, config }"></div>
    </div>
  </template>

<script>
export default {
  name: 'Occupy',
  data () {
    return {
      content: '',
      config: {
        width: '200px',
        height: '18px',
        background: '#ddd'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
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
</style>
