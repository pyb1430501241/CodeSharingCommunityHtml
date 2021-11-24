<template>
  <div id="helloworld">
    <!-- <Header @onGoto="Goto" /> -->
    <Header />
    <keep-alive>
      <router-view></router-view>
      <!-- <component @goto="Goto" @go="go" :is="componentId" :pathUrl="pathUrl"></!-->
    </keep-alive>
    <Footer />
  </div>
</template>
<script>
import Header from "../components/Header.vue";
import Rogon from "../components/Rogon.vue";
import Rogin from "../components/Rogin.vue";
import ChangePassword from "../components/ChangePassword";
import UserAgreement from "../components/UserAgreement";
import Footer from "../components/Footer.vue";
import axios from "axios";
import Content from "../components/Content";
import BlogArticle from "../components/BlogArticle";

export default {
  name: "helloworld",
  components: {
    Header,
    Rogon,
    Rogin,
    ChangePassword,
    UserAgreement,
    Footer,
  },
  data() {
    return {
      componentId: "Rogon",
    };
  },
  methods: {
    // 动态引用组件
    // go(string) {
    //   this.componentId = string;
    //   console.log(this.componentId);
    // },
    // 路由转换
    Goto(event) {
      // console.log(this.$router);
      this.$router.push({ name: event });
    },
    /**
     * 检查cookie，判断是否已登陆
     */
    firstCheck() {
      var kie = document.cookie.split("; ");
      var key = false;
      for (var item of kie) {
        var one = item.split("=");
        //将cookie里的sessionId数据set到store里
        if (one[0] == "authorization") {
          key = true;
          //sessionId不为空,有登录
          if (one[1] != "") {
            this.$store.commit("setsessionId", one[1]);
            if (this.loginstatus()) {
              this.AccessToken = one[1];
              //验证已登录后，由store中sessionId获取登录状态,将登陆状态放入store

              this.$router.push({
                path: "/LoggingStatus/Content",
              });
            } else {
              console.log("Rogon登录为空");
            }
          } else {
            console.log("sessionId为空");
          }
        }
      }
      //cookie无Authorization
      if (!key) {
        console.log("Rogon无登录记录！cookie无Authorization");
      }
    },
    /**
     * 验证已登录后，由store中sessionId获取登录状态,将登陆状态放入store
     */
    loginstatus() {
      let that = this;
      let session = this.$store.getters.getsessionId;
      let val = true;
      axios
        .get("/nav", {
          params: {},
          headers: {
            authorization: session,
          },
        })
        .then((Response) => {
          if (Response.data.code == 200) {
            console.log("登录为" + Response.data.data.username);
            //将登陆状态放入store
            that.$store.commit("setuser", Response.data.data);
            val = true;
          } else {
            console.log(
              Response.data.code + "..." + Response.data.msg
            );
            val = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      return val;
    },
  },
  mounted() {
    /**
     * 检查cookie，判断是否已登陆
     */
    this.firstCheck();
  },
};
</script>
