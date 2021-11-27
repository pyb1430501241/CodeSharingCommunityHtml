<template>
  <div id="my_fans">
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <div class="img">
          <img
            :src="'http://121.199.27.93/user/image/' + item.user.imgpath"
            alt="img"
          />
          <b class="b1">{{ item.user.username }}</b>
          <span class="b2">{{ item.user.college }}</span>
          <span class="b2">{{ item.user.clazz }}</span>
          <input
            @click="like(item.user.uid)"
            type="button"
            value="关注"
            v-show="!item.islike"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Axios from "axios";
import store from "../store";
import qs from "qs";
export default {
  data() {
    return {
      list: [],
      hasNextPage: true,
    };
  },
  methods: {
    /**
     * getoneselffans获取自己的粉丝
     */
    getoneselffans() {
      let that = this;
      Axios.post("/user/fans", 
        {
          p: 1,
        },{

          headers: { Authorization: this.$store.getters.getsessionId },
        }
      )
        .then((Response) => {
          console.log(Response.data.json);
          switch (Response.data.json.code) {
            case 200:
              that.hasNextPage = Response.data.json.hasNextPage;
              that.list = [...[], ...Response.data.json.fansList];
              break;

            default:
              console.log("getoneselffans" + Response.data.json.exception);
              break;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * like处理关注请求
     */
    like(likeid) {
      let that = this;
      console.log(likeid);
      if (this.$store.getters.getsessionId == "") {
        alert("未登录！");
        return;
      } else if (likeid == this.$store.getters.getuser.uid) {
        return;
      }
      Axios.post(
        "/user/like",
        qs.stringify({
          uid: likeid,
        }),
        { headers: { Authorization: this.$store.getters.getsessionId } }
      )
        .then((Response) => {
          // console.log(Response.data.json);
          switch (Response.data.json.code) {
            case 200:
              that.$message({
                message: "关注成功",
                type: "success",
              });
              break;

            default:
              that.$message({
                message: "关注..." + Response.data.json.exception,
              });
              break;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.getoneselffans();
  },
  mounted() {
    document.title = "我的粉丝 - 代码共享社区 - CodeSharingCommunity";
  },
};
</script>

<style scoped>
#my_fans {
  height: auto;
  width: auto;
}
ul {
  list-style-type: none;
  width: 100%;
  margin: auto 0;
  padding: 0;
}
li {
  /* padding-top: 20px; */
  /* height: 100px; */
  background-color: white;
  margin: 20px 0;
  height: 30px;
}
.img {
  display: flex !important;
  /* width: 100px; */
  height: 30px;
}
.img img {
  height: 30px;
  width: 30px;
  margin: 0 10px;
  border-radius: 50%;
}
.img b {
  margin: 0;
  line-height: 30px;
  height: 30px;
  margin: 0 10px;
  text-align: left;
}
.b1 {
  margin: 0;
  line-height: 30px;
  height: 30px;
  width: 100px;
  margin: 0 10px;
  text-align: left;
}
.b2 {
  margin: 0;
  line-height: 30px;
  height: 30px;
  max-width: 200px;
  min-width: 100px;
  font-size: 13px;
  margin: 0 10px;
  text-align: left;
  overflow: hidden;
}
.img input[type="button"] {
  display: inline-block;
  border: 0;
  border-radius: 5px;
  padding: 0 10px;
  line-height: 30px;
  outline: 0;
  margin: 0 10px;
  cursor: pointer;
}
.img input[type="button"]:hover {
  color: #999aaa;
}
</style>