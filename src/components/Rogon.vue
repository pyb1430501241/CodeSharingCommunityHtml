<template>
  <div id="rogon">
    <div id="UpList">
      <ul>
        <!-- <li>账号</li> -->
        <li>
          <input
            type="text"
            name="uid"
            v-model="user.uid"
            placeholder="学号/工号"
            id="upuser"
          />
        </li>
        <!-- <li>密码</li> -->
        <li>
          <input
            type="password"
            name="password"
            v-model="user.password"
            placeholder="密码"
            id="password"
          />
        </li>

        <li class="sub">
          <!-- <button class="sub" :plain="false" type="submit" @click="uppush()">登录</button> -->
          <input type="submit" value="登录" :plain="false" @click="uppush()" />
        </li>
        <li style="margin: 0" class="hre">
          <div class="fdiv">
            <input type="checkbox" class="flag" name="flag" id="flag" />
            <strong class="flag">记住登录</strong>
          </div>
          <a class="fdiv" @click="changego('/HelloWorld/Rogin')">身份注册</a>
          <a class="fdiv" @click="changego('/HelloWorld/ChangePassword')"
            >忘记密码</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import store from "../store";
import qs from "qs";
export default {
  name: "Rogon",
  data() {
    return {
      user: {
        uid: "",
        password: "",
        flag: 0,
      },
      userStatus: {},
      AccessToken: "",
      // imgsrc: require("../assets/caotu.png")
      imgsrc: "",
      fromRoute: "HelloWorld",
    };
  },
  methods: {
    //退出
    exit() {
      let that = this;
      axios
        .get("/user/logout", {
          params: {},
          headers: {
            //必须加Authorization请求头
            Authorization: this.AccessToken,
          },
        })
        .then((Response) => {
          console.log("登出：" + Response.data.msg);
          // document.cookie = "Authorization=" + "; path=/;";
          that.$store.commit("setuser", "");
          that.$store.commit("setsessionId", "");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //登录提交，检查请求验证
    uppush() {
      let that = this;
      document.getElementById("flag").checked
        ? (this.user.flag = 1)
        : (this.user.flag = 0);
      console.log(this.user.flag);
      axios
        .post(
          "/login",
          {
            uid: this.user.uid,
            password: this.user.password,
            rememberMe: this.user.flag,
          }
        )
        .then((Response) => {
          if (Response.data.code == 200) {
            console.log(Response.data)
            this.userStatus = {
              ...this.userStatus,
              ...Response.data.data.currentUser,
            };
            //最终时间
            // var date = new Date();
            // var milsecond = that.getExpireTime();
            // date.setTime(date.getTime() + milsecond);
            /**
             * 记录user
             *  cookie与store
             * */
            // document.cookie =
            //   "user=" +
            //   JSON.stringify(this.userStatus) +
            //   "; path=/;expires = " +
            //   date.toGMTString();
            that.$store.commit("setuser", this.userStatus);
            /**
             * 记录sessionId
             *  cookie与store
             */
            console.log("AccessToken=" + Response.data.data.token);
            console.log(document.cookie);
            that.AccessToken = Response.data.data.token;

            // document.cookie =
            //   "Authorization=" + Response.data.json.AccessToken + "; path=/;";

            that.$store.commit("setsessionId", Response.data.data.token);
            /**
             * 成功提示与页面跳转
             */
            // alert(Response.data.json.msg);
            this.$message({
              showClose: true,
              message: "登录" + Response.data.msg,
            });

            /**
             * 未成功的测试，从LoggingStatus路径下返回时未能获取from路径
             * 当登录成功时，判断是页面回跳或是进入默认页面
             */

              if (that.fromRoute.split("/")[1] == "LoggingStatus") {
                that.$router.go(-1);
              } else {
                that.$router.push({ path: "/LoggingStatus/PersonalCenter" });
              }

          } else {
            console.log(Response.data.data);
            if (Response.data.msg == "你已登录") {
              // alert(Response.data.json.exception);
              this.$message({
                showClose: true,
                message: Response.data.json.exception,
                type: "success",
              });
              that.$router.push({ path: "/LoggingStatus/PersonalCenter" });
            } else {
              // alert(
              //   Response.data.json.code + "..." + Response.data.json.exception
              // );
              this.$message({
                showClose: true,
                message:
                  Response.data.json.code +
                  "..." +
                  Response.data.json.exception,
                type: "error",
              });
              that.getcodeforlogin();
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //测试cookie
    Tcookie() {
      //最终时间
      var date = new Date();
      console.log(date.toGMTString());
      var milsecond = this.getExpireTime();
      date.setTime(date.getTime() + milsecond);
      console.log(date.toGMTString());
      console.log(JSON.stringify(this.user));
      document.cookie =
        "user=" +
        JSON.stringify(this.user) +
        "; path=/;expires = " +
        date.toGMTString();
    },
    //延时到今日结束
    getExpireTime() {
      var date = new Date();
      var hour = 23 - date.getHours();
      var min = 59 - date.getMinutes();
      var sec = 59 - date.getSeconds();
      var ms = (3600 * hour + 60 * min + sec) * 1000;
      return ms;
    },
    //父组件动态引用组件，本登录组件(Rogon)改为ChangePassword组件
    changego(event) {
      this.$router.push({ path: event });
      // this.$emit("onGoto", event);
    },
    /**
     * 检查cookie，判断是否已登陆
     */
    firstCheck() {
      if (this.loginstatus()) {
        // this.AccessToken = one[1];
        //验证已登录后，由store中sessionId获取登录状态,将登陆状态放入store
        this.$router.push({
          path: "/LoggingStatus/PersonalCenter",
        });
      } else {
        console.log("Rogon登录为空");
      }
    },
    /**
     * 验证已登录后，由store中sessionId获取登录状态,将登陆状态放入store
     */
    loginstatus() {
      let that = this;
      let session = this.$store.getters.getsessionId;
      let val = false;
      axios
        .get("/nav", {
          params: {},
          headers: {
            authorization: session,
          },
        })
        .then((Response) => {
          if (Response.data.code === 200) {
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
  created() {
    /**
     * 检查cookie，判断是否已登陆
     */
    this.firstCheck();
  },
  watch: {
    $route: function (to, from) {
      this.fromRoute = from.path;
      console.log(this.fromRoute.split("/")[1]);
    },
  },
  mounted() {
    document.title = "登录 - 代码共享社区 - CodeSharingCommunity";
  },
};
</script>
<style scoped>
#rogon {
  display: flex;
  /* overflow: scroll; */
  min-height: calc(100vh - 112px);
  /* background-color: saddlebrown; */
  /* background-color: white; */
  background-image: url("../assets/rbk.jpg");
  background-size: cover;
  backface-visibility: visible;
  background-repeat: no-repeat;
}
#UpList {
  width: 400px;
  height: 450px;
  border-radius: 20px;
  margin: auto;
  background-color: rgba(95, 158, 160, 0.9);
  /* background-color: rgba(32, 178, 170, 0.7); */
}

ul {
  list-style: none;
  padding: 0 10%;
  margin: 50px 0;
}
li {
  display: block;
  margin: 25px 0;
  color: white;
  height: 50px;
  font-weight: 600;
  text-align: center;
}
input[type="text"],
input[type="password"] {
  width: 90%;
  height: 35px;
  border-radius: 10px;
  padding: 0 10px;
  border: 0;
  text-align: center;
  background-color: rgba(156, 73, 156, 0) !important;
  border-bottom: white 3px solid;
  outline: none;
}
input[type="text"]:focus,
input[type="password"]:focus {
  background-color: rgba(156, 73, 156, 0) !important;
  border-bottom: white 3px solid;
}
#imgCode {
  height: 35px;
  width: 30%;
  border-radius: 5px;
  cursor: pointer;
}
#code {
  width: 60%;
}
.code {
  display: inline-flex;
  justify-content: center;
  margin: 0;
  width: 100%;
}

.sub {
  align-content: center;
  width: 100px;
  margin: 25px auto;
}

a {
  text-decoration: none;
  color: white;
  font-size: 10px;
  line-height: 18px;
  cursor: pointer;
}
.fdiv {
  display: block;
  height: 18px;
  width: 30%;
  margin: 5px 0;
  text-align: center;
  overflow: hidden;
}
.flag {
  display: inline-block;
  /* float: left; */
  overflow: hidden;
  margin: 0;
  font-size: 10px;
  height: 18px;
  line-height: 18px;
}
input[type="submit"] {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  padding: 0 10px;
  border: 0;
  text-align: center;
  background-color: rgba(156, 73, 156, 0) !important;
  border: white 3px solid;
  outline: none;
  background-color: cadetblue;
  cursor: pointer;
}
input[type="submit"]:hover,
input[type="submit"]:focus {
  border: 0;
  background-color: white !important;
  /* background-color: cadetblue !important; */
}
input[type="checkbox"] {
  border: 0;
  outline: 0;
  height: 18px;
  width: 18px;
}
input::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: white;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: white;
  opacity: 1;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: white;
  opacity: 1;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: white;
}
a:hover {
  color: black;
}
.hre {
  display: flex;
  justify-content: space-between;
}
</style>