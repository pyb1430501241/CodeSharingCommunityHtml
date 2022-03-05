<template>
  <div id="app">
      <!-- <Header @go="go" /> -->
      <!-- 调用组件 -->
      <!-- <Content /> -->
      <!-- <Rogin /> -->
      <!-- <Rogon /> -->
      <!-- <ChangePassword /> -->
      <!-- <BlogEditor /> -->
      <!-- <BlogArticle /> -->
      <!-- <keep-alive>
        <component :is="componentId"></component>
      </keep-alive>-->
      <router-view></router-view>
    <!-- <Footer /> -->
  </div>
</template>

<script>
//局部引用组件
import Content from "./components/Content.vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer";
import Rogin from "./components/Rogin";
import Rogon from "./components/Rogon";
import ChangePassword from "./components/ChangePassword";
import BlogEditor from "./components/BlogEditor";
import BlogArticle from "./components/BlogArticle";
import Search from "./components/Search.vue"
import axios from "axios";

export default {
  name: "App",
  // 注册组件
  components: {
    Content,
    Header, 
    Search,
    Footer,
    Rogin,
    Rogon,
    ChangePassword,
    BlogEditor,
    BlogArticle,
  
  },
  data() {
    return {
      componentId: "Rogon"
    };
  },
  methods: {
    // go(string) {
    //   this.componentId = string;
    //   console.log(this.componentId);
    // }
  }
  // mounted() {
  //     console.log(this.HOST);
  //     let url = this.HOST + "/getWebindex";
  //     this.$axios.post(url).then(result => {
  //       console.log(result);
  //     });
  // };
  // created() {
  //   fetch("/api/pdsu_scs/blob/getWebindex", {
  //     method: "post"
  //     // body: ""
  //   })
  //     .then(result => {
  //       // console.log(result);
  //       return result.json();
  //     })
  //     .then(data => {
  //       console.log(data);
  //       console.log(data.json.userList);
  //     });
  // }
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
