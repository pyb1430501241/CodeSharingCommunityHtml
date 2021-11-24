<template>
  <div class="my_article">
    <ul>
      <li v-for="(aitem, aindex) in list" :key="aindex">
        <h5 @click="resolve(aitem.web.id)">{{ aitem.web.title }}</h5>
        <a @click="decollection(aitem.web.id)" class="del">取消收藏</a>
        <!-- <a @click="updatablob(aitem.web.id)" class="upd">编辑</a> -->
        <div class="otherwise">
          <span @click="author(aitem.user.uid)"
            >@{{ aitem.user.username }}</span
          >
          <!-- <span class="biao">{{ aitem.web.type }}</span> -->
          <span>阅读:{{ aitem.visit }}</span>
          <span>{{ aitem.web.subTime }}</span>
          <!-- <span>点赞:{{ item.thubms }}</span> -->
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
      // arts: [
      //   {
      //     webid: 10,
      //     tit: "题目标题。。。。长一点",
      //     type: "原创",
      //     visit: 20,
      //     thubms: 30,
      //     collection: 25,
      //   },
      // ],
      // userList: [],
      blobList: [],
      list: [],
      hasNextPage: true,
    };
  },
  methods: {
    /**
     * 删除指定文章
     * delete
     */
    decollection(webid) {
      let that = this;
      Axios.post(
        "/blob/decollection",
        qs.stringify({
          webid: webid,
        }),
        { headers: { Authorization: this.$store.getters.getsessionId } }
      ).then((Response) => {
        console.log(Response.data.json);
        switch (Response.data.json.code) {
          case 200:
            that.$message({
              message: "已取消收藏",
            });
            that.getcollection();
            break;

          default:
            that.$message({
              message:
                "取消收藏..." +
                Response.data.json.code +
                "..." +
                Response.data.json.exception,
            });
            break;
        }
      });
    },
    /**
     * 更新文章
     * updata
     */
    updatablob(webid) {
      let routeData = this.$router.resolve({
        path: "/LoggingStatus/BlogEditor/" + webid,
      });
      window.open(routeData.href, "_blank");
    },
    /**
     * 获取收藏的博客
     * Authorization
     */
    getcollection() {
      let that = this;
      Axios.get("/blob/getcollection", {
        params: {
          uid: this.$store.getters.getuser.uid,
        },
        headers: { Authorization: this.$store.getters.getsessionId },
      })
        .then((Response) => {
          console.log(Response.data.json.blobList);
          switch (Response.data.json.code) {
            case 200:
              {
                that.hasNextPage = Response.data.json.hasNextPage;
                that.list = [...[], ...Response.data.json.blobList];
                for (const key in that.list) {
                  if (that.list[key].web.contype == "1") {
                    that.list[key].web.type = "原创";
                  } else {
                    that.list[key].web.type = "转载";
                  }
                }
              }
              break;

            default:
              console.log("我的博客..." + Response.data.json.exception);
              break;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //查看文章
    goArticle(webid) {
      console.log(webid);
      this.$router.push({ path: `/LoggingStatus/BlogArticle/${webid}` });
    },
    //新标签路由跳转
    resolve(webid) {
      let routeData = this.$router.resolve({
        path: `/LoggingStatus/BlogArticle/${webid}`,
      });
      window.open(routeData.href, "_blank");
    },
    author(autid) {
      let routeData = this.$router.resolve({
        path: `/LoggingStatus/Author/${autid}`,
      });
      window.open(routeData.href, "_blank");
    },
  },
  created() {
    this.getcollection();
  },
  mounted() {
    document.title = "我的收藏 - 代码共享社区 - CodeSharingCommunity";
  },
};
</script>
<style scoped>
#my_article {
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
  margin: 0 0 -1px -1px;
  background-color: white;
  padding: 10px 10px;
  overflow: hidden;
  border-width: 1px 0;
  border-style: solid;
  border-color: rgb(225, 228, 232);
}
li h5 {
  float: left;
  margin: 0;
  text-align: left;
  padding: 0;
  line-height: 30px;
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
}
li a {
  float: right;
  display: inline-block;
  width: 50px;
  line-height: 30px;
  font-size: 12px;
  cursor: pointer;
}
.del {
  color: crimson;
}
.upd {
  color: dodgerblue;
}
li h5:hover {
  color: gray;
}
.otherwise {
  display: flex;
  justify-content: space-between;
  /* background-color: rgb(230, 230, 230); */
  height: 30px;
  width: 100%;
  padding: 0;
  border-radius: 5px;
}
/* .biao {
  background-color: rgb(231, 146, 146);
} */
.otherwise span {
  display: block;
  line-height: 30px;
  color: #9d9ea7;
  font-size: 12px;
  cursor: pointer;
}
</style>