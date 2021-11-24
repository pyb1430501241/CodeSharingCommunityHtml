<template>
  <div id="rogin">
    <div id="mycontent">
      <h1 style="font-size: 3em">PDSU·S607·CSC</h1>
      <h1>CodeSharingCommunity</h1>
    </div>
    <div id="InList">
      <div>
        <ul>
          <li>
            <b>学号：</b>
            <input
              type="text"
              name="user"
              id="uid"
              placeholder="学号/工号"
              v-model="user.uid"
            />
          </li>
          <li>
            <b>密码：</b>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="密码"
              v-model="user.password"
            />
          </li>
          <!-- <li>
          <b>确认密码：</b>
          <input type="password" name="repassword" id="repassword" placeholder="确认密码" />
          </li>-->

          <li>
            <b>昵称：</b>
            <input
              type="name"
              name="name"
              id="name"
              placeholder="昵称"
              v-model="user.name"
            />
          </li>
          <!-- <li>
            <b>年龄：</b>
            <input type="text" name="age" id="age" placeholder="年龄" v-model="user.age" />
          </li>-->
          <li>
            <b>邮箱：</b>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="邮箱"
              v-model="email"
            />
          </li>
          <li>
            <b>邮箱验证码：</b>
            <div style="width: 224px; margin: auto; height: 35px">
              <input
                class="in_email"
                type="text"
                name="code"
                id="code"
                placeholder="邮箱验证码"
                v-model="code"
              />
              <input
                class="enter_email"
                id="enter_email"
                type="button"
                value="获取验证码"
                @click="getcodeforapply()"
              />
            </div>
          </li>
          <!-- <li>
            <b>性别：</b>
            <input type="radio" name="sex" id="man" checked="checked" />
            <strong>男</strong>
            <input type="radio" name="sex" id="women" />
            <strong>女</strong>
          </li>-->

          <li>
            <input
              type="checkbox"
              name="check"
              id="check"
              placeholder="同意用户协议"
            />
            <strong>
              同意我们的
              <a @click="changego('/HelloWorld/UserAgreement')">用户协议</a>
            </strong>
          </li>
          <li>
            <button type="submit" @click="inpush()">
              <strong>注册提交</strong>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import qs from "qs";
export default {
  name: "Rogin",
  data() {
    return {
      user: {
        id: "",
        uid: "",
        password: "",
        name: "",
        time: "",
        accountStatus: "",
        imgPath: "",
      },
      key: "",
      email: "",
      code: "",
      index_time: 0,
      user_serve_url: "./#",
    };
  },
  methods: {
    //获取邮箱验证码 name email
    getcodeforapply() {
      let that = this;
      if (this.index_time) return;
      axios
        .post("/applyCode", 
          {
            email: this.email,
            name: this.user.name,
          }
        )
        .then((Response) => {
          // console.log(Response.data.json);
          this.key = Response.data.data;
          document.cookie = "key=" + this.key;
          if (Response.data.json.code == 200) {
            this.$message({
              showClose: true,
              message: "已发送验证码到邮箱",
              type: "success",
            });

            that.index_time = 60;
            var intime = setInterval(function () {
              document.getElementById("enter_email").value =
                that.index_time + "s";
              that.index_time--;
              if (that.index_time == 0) {
                clearInterval(intime);
                document.getElementById("enter_email").value = "获取验证码";
              }
            }, 1000);
          } else {
            this.$message({
              showClose: true,
              message: Response.data.json.exception,
            });
          }
          // console.log(this.user.token);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /**
     * 注册提交，检查请求验证
     */
    inpush() {
      console.log(this.user);
      // this.$router.push({ path: "/HelloWorld/Rogon" });
      if (document.getElementById("check").checked == false) {
        alert("选择是否同意用户协议");
        return;
      }
      axios
        .post(
          "/applyAccount",
          {
            uid: this.user.uid,
            password: this.user.password,
            username: this.user.name,
            email: this.email,
            key: this.key,
            code: this.code,
          }
        )
        .then((Request) => {
          console.log(Request);
          // alert(Request.data.json.code + "  " + Request.data.json.exception);
          if (Request.data.code == 200) {
            this.$message({
              showClose: true,
              message: "注册成功",
              type: "success",
            });
            this.$router.push({ path: "/HelloWorld/Rogon" });
          } else {
            this.$message({
              showClose: true,
              message: Request.data.json.exception,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //父组件动态引用组件，本Rogon改为UserAgreement组件
    changego(event) {
      this.$router.push({ path: event });
      // this.$emit("go", event);
    },
    //注册成功，路由跳转
    // goto(event) {
    //   this.$emit("goto", event);
    // }
  },
  mounted() {
    document.title = "注册 - 代码共享社区 - CodeSharingCommunity";
  },
};
</script>
<style scoped>
#rogin {
  display: flex;
  /* overflow: scroll; */
  min-height: calc(100vh - 112px);
  /* background-color: saddlebrown; */
  background-image: url("../assets/img-dc.jpg");
  background-size: cover;
  backface-visibility: visible;
  background-repeat: no-repeat;
}
#mycontent {
  width: 500px;
  /* height: 400px; */
  /* background-color: cornflowerblue; */
  color: white;
  margin: auto;
  font-family: "newfont";
}
#InList {
  width: 350px;
  margin: auto;
}
ul {
  width: 350px;
  height: 532px;
  list-style: none;
  padding: 0;
}
li {
  width: 100%;
  float: left;
  margin: 10px 0;
  /* line-height: 39px; */
  min-height: 30px;
}
.in_email {
  float: left;
  width: 120px;
  border: 0;
  outline: 0;
  display: inline-block;
  border-radius: 5px 0 0 5px;
}
.enter_email {
  float: left;
  border-radius: 0px 5px 5px 0px;
  width: 80px;
  cursor: pointer;
  height: 35px;
  display: inline-block;
  outline: 0;
  border: 0;
}
li > b {
  display: none;
}
strong {
  color: white;
}
input {
  height: 35px;
  padding: 0 10px;
  width: 200px;

  border-radius: 5px;
  outline: 0;
  opacity: 0.9;
  border: 0;
}
input:focus {
  border-color: darkslategray;
  /* box-shadow: 0; */
}
input[type="checkbox"] {
  height: 12.8px;
  width: 12.8px;
}
input[type="radio"] {
  height: 12.8px;
  width: 12.8px;
  /* width: 10%; */
  outline: 0;
}
a {
  text-decoration: none;
  color: beige;
  cursor: pointer;
}
button {
  background-color: transparent;
  padding: auto 0;
  border: 0;
  font-size: 20px;
  color: black;
  cursor: pointer;
  outline: 0;
}
button strong:hover {
  color: black;
}
</style>