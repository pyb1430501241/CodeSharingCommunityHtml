<template>
  <div id="my_data">
    <dl>
      <dt>
        <b>UID:</b>
      </dt>
      <dd v-show="true">
        <span>{{ user.id }}</span>
      </dd>
    </dl>
    <dl>
      <dt>
        <b>帐号:</b>
      </dt>
      <dd v-show="true">
        <span>{{ user.uid }}</span>
      </dd>
    </dl>
    <dl>
      <dt>
        <b>昵称:</b>
      </dt>
      <dd v-show="status">
        <span>{{ user.username }}</span>
      </dd>
      <dd>
        <input
          v-show="!status"
          v-model="user.username"
          type="text"
          name="data_username"
          id="data_username"
          placeholder="昵称"
        />
      </dd>
    </dl>
    <dl v-show="true">
      <dt>
        <b>邮箱:</b>
      </dt>
      <dd>
        <span>{{ user.email }}</span>
      </dd>
    </dl>
    <dl>
      <dd>
        <input
          v-show="status"
          @click="change()"
          type="button"
          value="修改信息"
        />
        <input
          v-show="!status"
          @click="changeinfor()"
          type="submit"
          value="确认"
        />
      </dd>
      <dd>
        <input v-show="!status" @click="change()" type="button" value="取消" />
      </dd>
    </dl>
    <div class="imgup">
      <b>更换头像</b>
      <el-upload
        class="avatar-uploader"
        action="/user/changeavatar"
        name="img"
        :headers="{ Authorization: this.$store.getters.getsessionId }"
        :show-file-list="false"
        accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
        :on-success="handleAvatarSuccess"
        :on-error="handleAvatarError"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png等文件，且不超过2MB
        </div>
      </el-upload>
    </div>
  </div>
</template>
<script>
import Axios from "axios";
import store from "../store";
import qs from "qs";
export default {
  data() {
    return {
      user: {
        imgpath: require("../assets/user.svg"),
      },
      webid: this.$store.getters.getuser.uid,
      status: true,
      id: 181360226,
      imageUrl: "",
      // header: { Authorization: this.$store.getters.getsessionId },
      // email: "",
      // username: "",
      // clazz: "",
      // college: "",
      // identity: "",
    };
  },
  methods: {
    /**
     * 修改头像
     */
    handleAvatarError(err, file, fileList) {
      this.$message({
        showClose: true,
        message: "更改头像失败..." + err.data.json.exception,
        type: "error",
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.$message({
        showClose: true,
        message: "更改头像成功，尝试刷新页面",
        type: "success",
      });
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/png" ||
        "image/jpg" ||
        "image/gif" ||
        "image/svg" ||
        "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    /**
     * changeinfor修改用户信息
     * POST 请求头: Authorization
     */
    changeinfor() {
      let that = this;
      Axios.post(
        "/user/changeinfor",
        qs.stringify({
          uid: this.user.uid,
          username: this.user.username,
          college: this.user.college,
          clazz: this.user.clazz,
        }),
        {
          headers: { Authorization: this.$store.getters.getsessionId },
        }
      )
        .then((Response) => {
          console.log(Response.data.json);
          switch (Response.data.json.code) {
            case 200:
              that.user = { ...that.user, ...Response.data.json.user };
              that.status = true;
              alert("修改..." + Response.data.json.msg);
              break;

            default:
              alert("修改..." + Response.data.json.exception);
              break;
          }
        })
        .catch((error) => {
          console.log(error);
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
          //sessionId不为空,有登录
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
      Axios.get("/nav", {
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
            // that.imgsrc =
            //   "http://121.199.27.93/user/image/" + Response.data.json.user.imgpath;

            val = true;
          } else {
            // that.imgsrc =
            //   require("../assets/user.svg");
            that.username = "username";
            // console.log(
            //   Response.data.json.code + "..." + Response.data.json.exception
            // );
            this.$store.commit("setsessionId", "");

            // document.cookie = "user='',path=/";
            // document.cookie = "sessionId='',path=/";
            val = false;
            // this.$router.push({ path: "/HelloWorld/Rogon" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      return val;
    },
    change() {
      this.status = !this.status;
      console.log(this.status);
    },
    changesubmit() {
      alert("确认更改");
    },
  },
  created() {
    this.loggingCheck();
  },
  mounted() {
    // console.log(this.$store.getters.getuser);

    document.title = "我的信息 - 代码共享社区 - CodeSharingCommunity";
  },
};
</script>
<style scoped>
#my_data {
  height: auto;
  width: auto;
}
dl {
  display: block;
  width: 80%;
  padding: 0 10%;
  float: left;
  text-align: left;
  height: 36px;
  /* background-color: lightgoldenrodyellow; */
}
dt,
dd {
  display: inline-block;
  height: 36px;
  margin-left: 18px;
  float: left;
}
dt b {
  font-size: 20px;
  line-height: 36px;
}
dd span {
  line-height: 36px;
  height: 36px;
  font-size: 14px;
}
dd input {
  border-radius: 5px;
}
dd input[type="text"] {
  display: inline-block;
  height: 32px;
  width: 160px;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  outline: none;
  border-bottom-style: solid;
  border-bottom-color: #409eff;
  padding: 1px 2px;
  font-weight: 600;
  padding-left: 5px;
}
dd input[type="button"] {
  background-color: #409eff;
  display: inline-block;
  width: 80px;
  line-height: 30px;
  outline: none;
  cursor: pointer;
  border: none;
}
dd input[type="submit"] {
  background-color: #409eff;
  display: inline-block;
  width: 80px;
  line-height: 30px;
  outline: none;
  cursor: pointer;
  border: none;
}
dd input[type="file"] {
  display: block;
  width: 80px;
  height: 36px;
  outline: none;
  cursor: pointer;
  border: none;
}
.imgup {
  float: left;
  display: block;
  height: 130px;
  width: 80%;
  padding: 0 10%;
  margin-left: 18px;
  text-align: left;
}
.imgup b {
  display: block;
  text-align: left;
  width: 100px;
  line-height: 30px;
}
.avatar-uploader .el-upload {
  display: block;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  /* position: relative; */
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 98px;
  height: 98px;
  border: 1px dashed #d9d9d9;
  line-height: 98px;
  text-align: center;
  border-radius: 6px;
}
.avatar-uploader-icon:hover {
  border-color: #409eff;
}
.avatar {
  width: 98px;
  height: 98px;
  display: block;
}
</style>