<template>
  <div id="author">
    <div class="content">
      <img class="img" :src="author.imgpath" alt />
      <h3>{{ author.username }}</h3>
      <div class="data">
        <ul>
          <li>
            <b>{{ author.original }}</b>
            <b>原创</b>
          </li>
          <li>
            <b>{{ author.files }}</b>
            <b>文件</b>
          </li>
          <li>
            <b>{{ author.visits }}</b>
            <b>访问</b>
          </li>
          <li>
            <b>{{ author.downloads }}</b>
            <b>下载</b>
          </li>
          <li>
            <b>{{ author.collection }}</b>
            <b>收藏</b>
          </li>
          <li>
            <b>{{ author.thumbs }}</b>
            <b>点赞</b>
          </li>
          <li>
            <b>{{ author.attention }}</b>
            <b>关注</b>
          </li>
          <li>
            <b>{{ author.fans }}</b>
            <b>粉丝</b>
          </li>
          <li>
            <b>{{ author.comment }}</b>
            <b>评论</b>
          </li>
        </ul>
      </div>
      <ol>
        <li v-for="(item, index1) in list" :key="index1">
          <div class="otherwise">
            <!-- <span id="auther">作者：item.user.username</span> -->
            <!-- <span id="time">item.web.subTime</span> -->
          </div>
          <div class="wname">
            <img :src="author.imgpath" alt="头像" />
            <!-- <a @click="changego(href+item.web.id)"> -->
            <a :href="href + '/BlogArticle/' + item.web.id" target="_blank">
              <!-- <a href="href+item.web.id"> -->
              <b>{{ item.web.type }}</b>
              {{ item.web.title }}
            </a>
          </div>
          <div class="otherwise">
            <span>阅读:{{ item.visit }}</span>
            <span class="biao">{{ item.web.subTime }}</span>
            <!-- <span>收藏: item.collection</span> -->
            <!-- <span>点赞:item.thumbs</span> -->
          </div>
        </li>
      </ol>
    </div>
    <!-- {{this.$route.params.uid}} -->
  </div>
</template>
<script>
import Axios from "axios";
import store from "../store";
export default {
  data() {
    return {
      href: "/#/HelloWorld",
      author: {
        imgpath: require("../assets/user.svg"),
      },
      blobList: {},
      list: [],
    };
  },
  methods: {
    //getauthor获取作者信息
    getauthor() {
      let that = this;
      Axios.get("/blob/getauthor", {
        params: {
          uid: this.$route.params.uid,
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then((Response) => {
          // console.log(Response.data.json);
          if (Response.data.json.code == 200) {
            that.author = { ...{}, ...Response.data.json.author };
            that.author.imgpath =
              "http://121.199.27.93/user/image/" + that.author.imgpath;
            //占坑
            that.zhankeng = "*";
            var titstr = that.author.username + " - CodeSharingCommunity";
            document.title = titstr;
            // if (
            //   this.author.uid != this.$store.getters.getuser.uid &&
            //   this.$store.getters.getsessionId != ""
            // ) {
            //   document.getElementById("thubm").style.color = "dodgerblue";
            //   document.getElementById("thubm").classList.add("thubmshow");
            //   document.getElementById("col").style.color = "dodgerblue";
            //   document.getElementById("col").classList.add("colshow");
            // }
          } else {
            console.log(
              Response.data.json.code +
                "...作者信息" +
                Response.data.json.exception
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //getblobs获取用户的博客
    getblobs() {
      let that = this;
      Axios.get("/user/getblobs", {
        params: {
          p: 1,
          uid: this.$route.params.uid,
        },
        headers: { Authorization: this.$store.getters.getsessionId },
      }).then((Response) => {
        console.log(Response.data.json);
        switch (Response.data.json.code) {
          case 200:
            that.blobList = { ...{}, ...Response.data.json.blobList };
            that.list = [...[], ...Response.data.json.blobList.list];
            for (const key in that.list) {
              if (that.list[key].web.contype == 1) {
                that.list[key].web.type = "原创";
              } else {
                that.list[key].web.type = "转载";
              }
            }
            break;

          default:
            console.log(Response.data.json.code + Response.data.json.exception);
            break;
        }
      });
    },
  },
  mounted() {
    document.title = "Author - 代码共享社区 - CodeSharingCommunity";
    if (this.$store.getters.getsessionId != "") {
      this.href = "/#/LoggingStatus";
    }
    this.getauthor();
    this.getblobs();
  },
};
</script>

<style scoped>
#author {
  display: flex;
  min-height: calc(100vh - 112px);
  /* width: 100%; */
  background-color: #eeeeee;
  /* background-color: rgb(59, 58, 58); */
  overflow: hidden;
}
.content {
  width: 60%;
  min-width: 800px;
  margin: auto;
  min-height: calc(100vh - 112px);
  /* background-color: #eeeeee; */
}
img {
  margin: 30px 0 0px 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.data {
  width: 100%;
  background-color: white;
  border-radius: 10px;
}
.data:hover {
  box-shadow: 0 0 10px 0 white;
}
h3 {
  margin: 0;
}
.data ul {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  margin: 10px 0;
  padding: 10px 0;
}
.data ul li {
  display: block;
  /* flex-grow: 1; */
  width: 50px;
  flex-shrink: 1;
  height: 80px;
  margin: 0;
}
.data ul li b {
  display: block;
  width: 100%;
  line-height: 40px;
  height: 40px;
  cursor: pointer;
}
.data ul li:hover {
  color: #9d9ea7;
}
ol {
  list-style-type: none;
  padding: 0;
  background-color: white;
  border-radius: 10px;
}
ol li {
  margin: 10px 0;
  padding: 10px 5%;
  border-radius: 10px;
  background-color: white;
  opacity: 1;
}

ol li:hover {
  /* border-left: orangered solid 5px; */
  background-color: #eeeeee;
  border-radius: 0px;
  /* box-shadow: 0 0 5px 0 white; */
  /* background-color: rgba(255, 255, 255, 0.6); */
  /* opacity: 0.7; */
}
ol div {
  /* height: 20px; */
  margin: 0;
}
.wname {
  text-align: left;
  /* margin: 10px 0; */
  padding: 10px 5%;
  height: 30px;
}
.wname a {
  /* display: block; */
  cursor: pointer;
  line-height: 30px;
  height: 30px;
  padding: 0 10px;
  font-size: 20px;
  font-weight: 600px;
  text-decoration: none;
  color: #333333;
}
.wname b {
  line-height: 20px;
  padding: 5px 5px;
  height: 30px;
  font-size: 15px;
  font-weight: 600;
  color: #333333;
  background-color: rgb(255, 181, 181);
  border-radius: 5px;
}
.wname img {
  width: 30px;
  height: 30px;
  margin: 0;
  float: left;
  border-radius: 15px;
}

.otherwise {
  display: flex;
  justify-content: space-between;
  /* background-color: rgb(230, 230, 230); */
  /* line-height: 30px; */
  width: 90%;
  padding: 0 5%;
  border-radius: 5px;
}
/* .biao {
  background-color: rgb(231, 146, 146);
} */
.otherwise span {
  display: block;
  /* line-height: 30px;
  height: 30px;
  */
  color: #9d9ea7;
  font-size: 12px;
}
</style>