<template>
  <div id="ChangePassword">
    <div id="change">
      <div>
        <h3>
          <span v-bind:class="{showspan:condition3}">①确认账号 »» »»&nbsp;</span>
          <span v-bind:class="{showspan:condition2}">»» »» ②找回密码</span>
        </h3>
        <div id="confirm" v-show="condition1">
          <b>确认账号:</b>
          <div id="auth">
            <input type="text" name="AuthCode" id="userid" v-model="newobj.uid" />
            <b @click="isexist()">确认</b>
          </div>
        </div>
        <div id="modify" v-show="condition2">
          <b>新密码:</b>
          <input v-model="newobj.newpassword" type="password" name="newpassword" id="NewPassword" />
          <b>确认密码:</b>
          <input
            v-model="newobj.renewpassword"
            type="password"
            name="renewpassword"
            id="ReNewPassword"
          />
          <b>邮箱{{ newobj.email }}验证码:</b>
          <div id="auth">
            <input v-model="newobj.emailCode" type="text" name="AuthCode" id="AuthCode" />
            <b @click="getcodeforretrieve()">获取验证码</b>
          </div>
          <button type="submit" @click="retrieve()">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      newobj: {
        uid: "",
        email: "",
        token: "",
        emailCode: "",
        newpassword: "",
        renewpassword: "",
      },
      condition1: true,
      condition3: true,
      condition2: false,
    };
  },
  methods: {
    //验证确认用户名
    isexist() {
      let that = this;
      Axios.get("/user/isexist", {
        params: {
          uid: this.newobj.uid,
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then((Response) => {
          // console.log(Response.data.json);
          if (Response.data.json.code == 200) {
            //newobj中的email,uid,token接受，condition1，condition2更改状态
            that.newobj.email = Response.data.json.email.email;
            that.newobj.uid = Response.data.json.uid;
            that.newobj.token = Response.data.json.token;
            that.condition1 = false;
            that.condition2 = true;
            that.$message({
              showClose: true,
              message:
                Response.data.json.uid +
                "......" +
                Response.data.json.email.email,
              type: "success",
            });
          } else {
            console.log(
              Response.data.json.code +
                "...用户名验证" +
                Response.data.json.exception
            );
            that.$message({
              showClose: true,
              message:
                Response.data.json.code +
                "...用户名验证" +
                Response.data.json.exception,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 获取邮箱验证码
     */
    getcodeforretrieve() {
      let that = this;
      console.log("that.newobj.email = " + that.newobj.email);
      Axios.get("/user/getcodeforretrieve", {
        params: {
          token: that.newobj.token,
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then((Response) => {
          // console.log(Response.data.json);
          if (Response.data.json.code == 200) {
            that.newobj.token = Response.data.json.token;
            that.$message({
              showClose: true,
              message: "邮箱验证码已发送",
              type: "success",
            });
            // console.log("that.newobj.token = " + that.newobj.token);
          } else {
            console.log(
              Response.data.json.code +
                "...邮箱验证" +
                Response.data.json.exception
            );
            that.$message({
              showClose: true,
              message:
                Response.data.json.code +
                "...邮箱验证..." +
                Response.data.json.exception,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 找回密码，retrieve
     */
    retrieve() {
      let that = this;
      if (this.newobj.newpassword != this.newobj.renewpassword) {
        alert("重新确认输入的密码");
        return;
      }
      Axios.post(
        "/user/retrieve",
        qs.stringify({
          uid: that.newobj.uid,
          token: that.newobj.token,
          code: that.newobj.emailCode,
          password: that.newobj.newpassword,
        })
      )
        .then((Response) => {
          // console.log(Response.data.json);
          if (Response.data.json.code == 200) {
            that.$message({
              showClose: true,
              message: "找回密码" + Response.data.json.msg + "返回登录",
              type: "success",
            });
            this.$router.push({ path: "/HelloWorld/Rogon" });
          } else {
            console.log(
              Response.data.json.code +
                "...找回密码" +
                Response.data.json.exception
            );
            that.$message({
              showClose: true,
              message:
                Response.data.json.code +
                "...找回密码..." +
                Response.data.json.exception,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 路由跳转
     */
    change() {
      this.$router.push({ path: "/HelloWorld/Rogon" });
    },
  },
  mounted() {
    document.title = "找回密码 - 代码共享社区 - CodeSharingCommunity";
  },
};
</script>
<style scoped>
#ChangePassword {
  min-height: calc(100vh - 112px);
}
#change {
  display: block;
  width: 302px;
  height: 300px;
  padding-top: 50px;
  margin: auto;
}
h3 {
  font-size: 14px;
  line-height: 30px;
}
.showspan {
  color: dodgerblue;
}
#auth {
  width: 300px;
  height: 35px;
  margin: 10px auto;
  display: inline-block;
  /* border: slategray solid 2px; */
  /* border: cadetblue 0px 2px solid; */
  box-shadow: 0px 0px 5px 0px darkslategray;
  font-size: 16px;
}
#auth:hover {
  box-shadow: 0px 0px 8px 0px darkslategray;
}
#auth > input {
  display: block;
  float: left;
  border: 0;
  margin: 0;
  width: 200px;
  padding: 0px 10px;
  height: 35px;
  line-height: 30px;
  outline: none;
  font-size: 15px;
}
#auth > b {
  float: left;
  height: 35px;
  line-height: 35px;
  width: 80px;
  font-size: 12px;
  box-shadow: inset 0px 0px 4px 0px darkslategray;
  cursor: pointer;
}

b {
  font-size: 14px;
}
input[type="password"] {
  display: inline-block;
  width: 280px;
  height: 35px;
  margin: 10px auto;
  padding: 0px 10px;

  border: cadetblue 1px solid;
  box-shadow: 0px 0px 5px 0px darkslategray;
  outline: 0;
}
input[type="password"]:hover {
  box-shadow: 0px 0px 8px 0px darkslategray;
}
button {
  width: 302px;
  height: 35px;
  background-color: cadetblue;
  cursor: pointer;
  border: 0;
  font-size: 16px;
}
button:hover {
  box-shadow: 0px 0px 3px 0px darkslategray;
}
</style>