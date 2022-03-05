<template>
  <div class="header">
    <!-- <h1>{{title}}</h1> -->
    <ul>
      <li>
        <img src="../assets/logo.png" alt="logo" />
      </li>
      <li>
        <a @click="changego('/HelloWorld/Content')">
          <b>首页</b>
        </a>
      </li>
      <li>
        <input
          v-model="keyword"
          type="search"
          name="search"
          placeholder="搜索"
          @keyup.enter="search"
        />
      </li>

      <li>
        <a @click="changego('/HelloWorld/Rogon')">
          <b>登录</b>
        </a>
      </li>
      <li>
        <a @click="changego('/HelloWorld/Rogin')">
          <b>注册</b>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: "Vue Components Demo",
      keyword: "",
    };
  },
  methods: {
    changego(event) {
      this.$router.push({ path: event });
      // this.$emit("onGoto", event);
    },
    search() {
      this.$router.push({path : "/#/HelloWorld/search/" + this.keyword});
    },
  },
};
</script>
<style scoped>
.header {
  background: #222;
  padding: 10px;
  height: 30px;
  margin-top: 0;
  margin: 0 auto 0 auto;
}
ul {
  width: 640px;
  margin: 0 auto;
  height: 30px;
  padding: 0;
}
li {
  display: inline-block;
  line-height: 30px;
  /* min-width: 200px; */
  padding: 0 30px;
  float: left;
  color: white;
}
input {
  /* display: block; */
  width: 180px;
  height: 30px;
  border-radius: 10px;
  border: white solid 0px;
  padding: 0 10px;
  outline: 0;
}
img {
  height: 30px;
  border-radius: 50%;
}
a {
  text-decoration: none;
  color: white;
  cursor: pointer;
}
h1 {
  color: #222;
  text-align: center;
}
</style>
