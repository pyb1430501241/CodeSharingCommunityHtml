<template>
  <div class="header">
    <!-- <h1>{{title}}</h1> -->
    <ul>
      <li>
        <img src="../assets/logo.png" alt="logo" />
      </li>
      <li>
        <a href="/#/LoggingStatus/Content" target="_blank">
          <b>博客</b>
        </a>
      </li>
      <li>
        <a href="/#/LoggingStatus/Content" target="_blank">
          <b>资源</b>
        </a>
      </li>
      <li>
        <input type="search" name="search" placeholder="搜索" />
        <!-- <el-button class = "search_button" icon="el-icon-search">搜索</el-button> -->
      </li>
      <li>
        <img class="uimg" :src="imgsrc" />
        <!-- <a @click="changego('Rogon')" href="./#">{{user}}</a> -->
      </li>
      <li class="userid">
        <a @click="changego('/LoggingStatus/PersonalCenter')">{{
          user.username
        }}</a>
        <ul class="down">
          <li>
            <a href="/#/LoggingStatus/PersonalCenter" target="_blank"
              >个人中心</a
            >
          </li>
          <li>
            <a href="/#/LoggingStatus/PostFile">上传资源</a>
          </li>
          <li>
            <a href="/#/LoggingStatus/BlogEditor/0" target="_blank">创作</a>
          </li>
          <li>
            <a href="/#/LoggingStatus/BlogEditor/0" target="_blank">消息</a>
          </li>
          <li>
            <a @click="exit()">退出</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
import store from "../store";
export default {
  data() {
    return {
      title: "Vue Components Demo",
      username: "username",
      imgsrc: "../assets/prompt.svg",
      user: { username: "username" },
    };
  },
  methods: {
    changego(event) {
      this.$router.push({ path: event });
    },
    //退出
    exit() {
      document.cookie =
        "Authorization=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      document.cookie =
        "rememberMe=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      // this.$router.push({ path: "/HelloWorld/Rogon" });
      var that = this;
      var accessToken = this.$store.getters.getsessionId;
      if (accessToken == "") {
        that.$store.commit("setuser", "");
        that.$store.commit("setsessionId", "");
        // console.log("accessToken=null" + accessToken);
        that.$router.push({ path: "/HelloWorld/Rogon" });
        return;
      }
      // console.log("accessToken=" + accessToken);
      axios
        .post("/logout", {
          
        },{
          headers: {
            authorization: this.$store.getters.getsessionId,
            "X-Requested-With": "XMLHttpRequest",
          },
        })
        .then((Response) => {
          that.$store.commit("setuser", "");
          that.$store.commit("setsessionId", "");
          that.$router.push({ path: "/HelloWorld/Rogon" });
        })
        .catch((error) => {
          console.log(error);
          alert(error);
          // that.$router.push({ path: "/HelloWorld/Rogon" });
        });
    },
    /**
     * 从cookie检查登录状态
     */
    loggingCheck() {
      var kie = document.cookie.split("; ");
      var key = false;
      for (var item of kie) {
        var one = item.split("=");
        //将cookie里的sessionId数据set到store里
        if (one[0] == "authorization") {
          key = true;
          //Authorization不为空,有登录
          if (one[1] != "") {
            this.$store.commit("setsessionId", one[1]);
            if (this.loginstatus()) {
              // console.log("loggingHeader已登录..." + one[0] + "..." + one[1]);
              // alert("loggingHeader已登录..." + one[0] + "..." + one[1]);
            } else {
              // console.log("loggingHeader未登录，空值");
              // alert("loggingHeader未登录，空值");
              this.$router.push({ path: "/HelloWorld/Rogon" });
            }
            //验证已登录后，由store中sessionId获取登录状态,将登陆状态放入store

            return;
          } else {
            // console.log("loggingHeader未登录，空值");
            // alert("loggingHeader未登录，空值");
            this.$router.push({ path: "/HelloWorld/Rogon" });
          }
        }
      }
      //cookie无Authorization
      if (!key) {
        // console.log("loggingHeader=无登录记录！cookie无Authorization");
        // alert("loggingHeader=无登录记录！cookie无Authorization");
        this.$router.push({ path: "/HelloWorld/Rogon" });
      }
    },
    /**
     * 验证已登录后，由store中sessionId获取登录状态,将登陆状态放入store
     */
    loginstatus() {
      let that = this;
      let session = this.$store.getters.getsessionId;
      //图片提前填充
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
            // console.log("username=" + Response.data.json.user.username);
            //将登陆状态放入store
            that.$store.commit("setuser", Response.data.data);
            // console.log(Response.data.json.user);
            that.user = { ...this.user, ...this.$store.getters.getuser };

            that.imgsrc =
              "http://localhost/user/image/" + Response.data.data.imgPath;

            val = true;
          } else {
            that.imgsrc = require("../assets/prompt.svg");
            that.username = "username";
            // console.log(
            //   Response.data.json.code + "..." + Response.data.json.exception
            // );
            this.$store.commit("setsessionId", "");
            // document.cookie = "user='',path=/";
            // document.cookie = "authorization='',path=/";
            val = false;
            this.$message({
              showClose: true,
              message: "登录失效，重新登陆",
              type: "warning",
            });
            // this.$router.push({ path: "/HelloWorld/Rogon" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      return val;
    },
  },
  mounted() {
    this.imgsrc = require("../assets/prompt.svg");
    this.username = "username";
    this.loggingCheck();
    //从store获取数据
    // this.user = { ...this.user, ...this.$store.getters.getuser };
    // console.log("mounted=" + this.user);
    // this.imgsrc = this.imgsrc + this.user.imgpath;
    // console.log("mounted=" + this.imgsrc);
  },
  beforeUpdate() {},
};
</script>
<style scoped>
.header {
  background: #222;
  padding: 10px;
  height: 30px;
  margin-top: 0;
  margin: 0 auto 0 auto;
  z-index: 100;
}


ul {
  width: 100%;
  margin: 0 auto;
  height: 30px;
  padding: 0 20%;
}
li {
  display: inline;
  line-height: 30px;
  /* min-width: 200px; */
  padding: 0 30px;
  float: left;
  text-align: center;
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
  height: 26px;
  width: 26px;
  margin: 0;
  border: cadetblue 2px solid;
  border-radius: 50%;
}
.uimg {
  border-radius: 50%;
  border: cadetblue 2px solid;
}
.userid {
  padding-left: 0;
  min-width: 80px;
}
.userid a {
  width: 100%;
}

a {
  /* width: 100%; */
  text-decoration: none;
  color: white;
  overflow: hidden;
  cursor: pointer;
}
h1 {
  color: #222;
  text-align: center;
}
.down {
  position: absolute;
  top: 40px;
  width: 80px;
  padding: 20px 0 10px 0;
  height: auto;
  background-color: #222;
  display: none;
  z-index: 1000;
}
.down li {
  width: 80px;
  line-height: 30px;
  padding: 0;
  cursor: pointer;
  font-size: 13px;
}
.down li a {
  display: block;
  text-decoration: none;
  /* width: 100%; */
  width: 80px;
  line-height: 30px;
}
.userid:hover .down {
  display: block;
  z-index: 100;
}
.down li:hover {
  background-color: #474646;
}
</style>