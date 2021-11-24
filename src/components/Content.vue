<template>
  <div id="content">
    <div id="wenzhang_type">
      <!-- 标签栏 -->
      <!-- <h2>文章类型</h2> -->
      <ul>
        <h2 class="hli" @click="changeRecommend">↶</h2>
        <li :class="{ liactive: isActive === -1 }"><a>推荐</a></li>
        <li
          :class="{ liactive: index1 === isActive }"
          v-for="(item1, index1) in labelList"
          :key="index1"
          @click="getlid(item1.id)"
        >
          <a>{{ item1.label }}</a>
        </li>

        <button class="hli">更多标签</button>
      </ul>
      <!--  -->
    </div>
    <div id="tuijian_wenzhang">
      <h2 id="h2content">推荐文章</h2>
      <p id="palert">暂无此类型文章</p>
      <ol>
        <li v-for="(item, index2) in list" :key="index2">
          <div class="otherwise">
            <span id="auther" style="font-size: 10px; color: #9d9ea7">
              来自:
              <b style="font-size: 15px; color: #333333">{{
                item.user.username
              }}</b>
            </span>
            <span id="time">{{ item.web.subTime }}</span>
          </div>
          <div class="wname">
            <img
              :src="'http://121.199.27.93/user/image/' + item.user.imgpath"
              alt="头像"
            />
            <!-- <a @click="changego(href+item.web.id)"> -->
            <a :href="href + '/BlogArticle/' + item.web.id" target="_blank">
              <!-- <a href="href+item.web.id"> -->
              <b>{{ item.web.type }}</b>
              {{ item.web.title }}
            </a>
          </div>
          <div class="otherwise">
            <!-- <span class="biao">{{ item.type }}</span> -->
            <span>收藏:{{ item.collection }}</span>
            <span>阅读:{{ item.visit }}</span>
            <span>点赞:{{ item.thumbs }}</span>
          </div>
        </li>
        <!-- <div class="refresh">
          <input type="button" @click="refresh()" value="刷新" />
        </div> -->
        <!-- <li v-for="(item3, index3) in oldlist" :key="'old' + index3">
          <div class="otherwise">
            <span id="auther" style="font-size: 10px; color: #9d9ea7">
              来自:
              <b style="font-size: 15px; color: #333333">{{
                item3.user.username
              }}</b>
            </span>
            <span id="time">{{ item3.web.subTime }}</span>
          </div>
          <div class="wname">
            <img
              :src="'http://121.199.27.93/user/image/' + item3.user.imgpath"
              alt="头像"
            />
            <a :href="href + '/BlogArticle/' + item3.web.id" target="_blank">
              <b>{{ item3.web.type }}</b>
              {{ item3.web.title }}
            </a>
          </div>
          <div class="otherwise">
            <span>收藏:{{ item3.collection }}</span>
            <span>阅读:{{ item3.visit }}</span>
            <span>点赞:{{ item3.thumbs }}</span>
          </div>
        </li> -->
      </ol>
    </div>
    <div id="tuijian_yonghu">
      <!-- <h2>推荐用户</h2>
      <ul v-for="(user, index3) in users_list" :key="index3">
        <li>
          <a :href="user.href">{{user.name}}</a>
        </li>
      </ul> -->
    </div>
  </div>
</template>
<script>
import Axios from "axios";
import store from "../store";
export default {
  data() {
    return {
      isActive: -1,
      labelList: [],
      lid: 0,
      users_list: [
        { name: "Erika Selin", href: "./#" },
        { name: "Erika Selin", href: "./#" },
        { name: "Erika Selin", href: "./#" },
        { name: "Erika Selin", href: "./#" },
        { name: "Erika Selin", href: "./#" },
      ],
      list: [],
      href: "/#/HelloWorld",
      hasNextPage: true,
      isRefreshBool: true,
      pageNum: 1,
    };
  },
  methods: {
    // 点击首页推荐
    changeRecommend() {
      this.isActive = null;
      this.lid = 0;
      document.getElementById("h2content").innerHTML = "推荐";
      this.list = [...[]];
      this.pageNum = 1;
      this.refresh();
    },
    // getlabel获取标签
    getlabel() {
      var that = this;
      Axios.get("/blob/getlabel", {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      }).then((response) => {
        console.log(response.data.json.labelList);
        that.labelList = [...[], ...response.data.json.labelList.list];
      });
    },
    //getlid根据标签获取文章内容
    getlid(id) {
      this.isActive = id - 1;
      this.lid = id;
      document.getElementById("h2content").innerHTML = this.labelList[
        id - 1
      ].label;
      console.log(this.labelList[id - 1].label);
      this.list = [...[]];
      this.pageNum = 1;
      this.refresh();
    },
    /**
     * 获取首页数据，http://121.199.27.93/blob/getwebindex
     * json{"code" : "200",
     * "msg" : "success",
     * "webList" : "网页信息集合",
     * "userList", "用户信息集合",
     * "visitList", "访问量集合",
     * "thumbsList" : "点赞量集合",
     * "collectionList" : "收藏量集合"}
     */
    getwebindex() {
      let that = this;
      Axios.get("/blob/getwebindex", {
        params: {
          p: 1,
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then((Response) => {
          if (Response.data.code == 200) {
            console.log(Response.data.json.blobList);
            that.hasNextPage = Response.data.json.hasNextPage;
            that.list = [...[], ...Response.data.json.blobList];
            that.pageNum = that.pageNum + 1;
            that.oldlist = [];
            for (const iter of that.list) {
              if (iter.web.contype == 1) {
                iter.web.type = "原创";
              } else {
                iter.web.type = "转载";
              }
            }
          } else {
            console.log(
              Response.data.json.code + "..." + Response.data.json.exception
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //路由跳转
    changego(event) {
      this.$router.push({ path: event });
    },
    //新标签路由跳转
    resolve(event) {
      let routeData = this.$router.resolve({
        path: event,
      });
      window.open(routeData.href, "_blank");
    },
    //判断滚动条是否到底部，刷新新的数据
    isRefresh() {
      //变量scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      //变量windowHeight是可视区的高度
      var windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      //变量scrollHeight是滚动条的总高度
      var scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      //滚动条到底部的条件
      // console.log(scrollTop + windowHeight + "--" + scrollHeight);
      if (
        scrollTop + windowHeight >= scrollHeight - 200 &&
        this.isRefreshBool
      ) {
        // console.log("到了底部");
        this.isRefreshBool = false;
        this.refresh();
      }
    },
    //刷新推荐文章
    refresh() {
      let that = this;
      if (!this.hasNextPage) return;
      console.log("lid=" + this.lid);
      Axios.get("/blob/getwebindex", {
        params: {
          p: that.pageNum,
          lid: that.lid,
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then((Response) => {
          if (Response.data.json.code == 200) {
            let list = [...[], ...Response.data.json.blobList];
            that.hasNextPage = Response.data.json.hasNextPage;
            that.pageNum = that.pageNum + 1;

            for (const iter of list) {
              if (iter.web.contype == 1) {
                iter.web.type = "原创";
              } else {
                iter.web.type = "转载";
              }
            }
            document.getElementById("palert").style.display = "none";
            that.list = [...that.list, ...list.reverse()];
          } else if (Response.data.json.code == 202) {
            document.getElementById("palert").style.display = "block";
            console.log(
              Response.data.json.code + "..." + Response.data.json.msg
            );
          } else {
            console.log(
              Response.data.json.code + "..." + Response.data.json.exception
            );
          }
          // 允许refresh()加载数据函数触发
          that.isRefreshBool = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    document.title = "代码共享社区 - CodeSharingCommunity";
    if (this.$store.getters.getsessionId != "") {
      this.href = "/#/LoggingStatus";
    }
    this.getwebindex();
    this.getlabel();
    //监视scroll滚动条
    window.addEventListener("scroll", this.isRefresh, true);
  },
};
</script>

<style scoped>
#content {
  display: flex;
  /* overflow: scroll; */
  min-height: calc(100vh - 112px);
  /* justify-content: center; */
}
#wenzhang_type {
  position: relative;
  width: 20%;
  background-color: #eeeeee;
  margin: 0;
  padding: 0;
  box-shadow: 0 0 10px 0 #333333;
}
#tuijian_wenzhang {
  position: relative;
  width: 60%;
  background-color: #eeeeee;
  /* background-color: white; */
  margin: 0;
  padding: 0;
}
#tuijian_yonghu {
  width: 20%;
  background-color: #eeeeee;
  margin: 0;
  padding: 0;
  box-shadow: 0 0 10px 0 #333333;
}

ul li {
  line-height: 35px;
}
/* ul li a:active {
  color: steelblue;
} */
a {
  text-align: left;
  text-decoration: none;
  color: black;
}
#wenzhang_type ul {
  padding: 70px 0 70px calc(100% - 150px);
  margin: 0;
  font-weight: 600;
}
.hli {
  margin: 5px 0;
  width: 150px;
  list-style: none;
  height: 35px;
  line-height: 35px;
  font-weight: 600;
  background-color: white;
  cursor: pointer;
  border: 0;
  outline: 0;
  font-size: 15px;
  color: #2c3e50;
}
.liactive {
  background-color: cadetblue !important;
}
#wenzhang_type ul li:hover {
  background-color: cadetblue;
}
/* #wenzhang_type ul li a {
} */
#wenzhang_type ul li {
  width: 150px;
  list-style: none;
  height: 35px;
  font-size: 14px;
  font-weight: 600;
  background-color: white;
  color: #2c3e50;
  cursor: pointer;
  color: #2c3e50;
}
#tuijian_wenzhang ol {
  list-style-type: none;
  padding: 0 5% 30px 5%;
}
#palert {
  display: none;
}
#tuijian_wenzhang li {
  margin: 10px 0;
  padding: 20px 5%;
  border-radius: 10px;
  background-color: white;
}

#tuijian_wenzhang li:hover {
  /* border-left: orangered solid 5px; */
  background-color: #eeeeee;
  box-shadow: 0 0 5px 0 white;
}
#tuijian_wenzhang div {
  /* height: 20px; */
  margin: 0;
}
.wname {
  text-align: left;
  /* margin: 10px 0; */
  padding: 10px 5%;
  height: 40px;
}
.wname a {
  /* display: block; */
  cursor: pointer;
  line-height: 40px;
  height: 40px;
  padding: 0 10px;
  font-size: 20px;
  font-weight: 600px;
}
.wname b {
  line-height: 20px;
  padding: 5px 5px;
  margin: 0 10px 0 0;
  height: 40px;
  font-size: 15px;
  font-weight: 600;
  color: #333333;
  background-color: rgb(255, 181, 181);
  border-radius: 5px;
}
.wname img {
  width: 40px;
  height: 40px;
  float: left;
  border-radius: 20px;
}
.note {
  display: flex;
  justify-content: space-between;
}
.note span {
  margin: 10px;
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
#auther {
  color: #333333;
}
h2 {
  text-align: center;
  line-height: 30px;
  margin: 20px 0;
}
.refresh {
  width: 100%;
  height: 55px;
  margin: 0;
}
.refresh input[type="button"] {
  padding: 0;
  width: 80%;
  height: 45px;
  background-color: white;
  outline: none;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  margin: 0 10%;
}
.refresh input[type="button"]:hover {
  background-color: #eeeeee;
  box-shadow: 0 0 5px 0 white;
}
#tuijian_wenzhang span {
  line-height: 20px;
  font-size: 12px;
  font-weight: 500;
}
#tuijian_yonghu ul {
  list-style-type: none;
  padding: 0;
  font-weight: 600;
}
</style>

<style scoped>
@media screen and (max-width: 1200px) {
  #wenzhang_type {
    position: relative;
    width: 20%;
    background-color: #eeeeee;
    margin: 0;
    padding: 0;
    box-shadow: 0 0 10px 0 #333333;
  }
  #tuijian_wenzhang {
    position: relative;
    width: 80%;
    background-color: #eeeeee;
    margin: 0;
    padding: 0;
  }
  #tuijian_yonghu {
    width: 0%;
    background-color: #eeeeee;
    margin: 0;
    padding: 0;
    box-shadow: 0 0 10px 0 #333333;
  }
}
</style>