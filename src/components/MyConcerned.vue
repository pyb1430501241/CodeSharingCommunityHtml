<template>
  <div id="my_concerned">
    <ul>
      <li v-for="(citem, cindex) in list" :key="cindex">
        <div class="img">
          <img
            @click="resolve('/LoggingStatus/Author/' + citem.uid)"
            :src="'http://121.199.27.93/user/image/' + citem.imgpath"
            alt="img"
          />
          <b
            @click="resolve('/LoggingStatus/Author/' + citem.uid)"
            class="b1"
            >{{ citem.username }}</b
          >
          <span class="b2">{{ citem.college }}</span>
          <span class="b2">{{ citem.clazz }}</span>
          <input @click="delike(citem.uid)" type="button" value="取消关注" />
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
    };
  },
  methods: {
    /**
     * getoneselficons获取自己的关注
     */
    getoneselficons() {
      let that = this;
      Axios.get("/user/getoneselficons", {
        params: {
          p: 1,
        },
        headers: { Authorization: this.$store.getters.getsessionId },
      })
        .then((Response) => {
          // console.log(Response.data.json);
          switch (Response.data.json.code) {
            case 200:
              that.list = [...[], ...Response.data.json.userList.list];
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
    delike(likeid) {
      let that = this;
      if (this.$store.getters.getsessionId == "") {
        alert("未登录！");
        return;
      } else if (likeid == this.$store.getters.getuser.uid) {
        return;
      }
      Axios.post(
        "/user/delike",
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
                message: "已取消关注",
                type: "success",
              });
              that.getoneselficons();
              break;

            default:
              that.$message({
                message: "取消关注..." + Response.data.json.exception,
              });

              break;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //新标签路由跳转
    resolve(event) {
      let routeData = this.$router.resolve({
        path: event,
      });
      window.open(routeData.href, "_blank");
    },
  },
  created() {
    this.getoneselficons();
  },
  mounted() {
    document.title = "我的关注 - 代码共享社区 - CodeSharingCommunity";
  },
};
</script>

<style scoped>
#my_concerned {
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
  cursor: pointer;
}
.img b {
  margin: 0;
  line-height: 30px;
  height: 30px;
  margin: 0 10px;
  text-align: left;
  cursor: pointer;
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