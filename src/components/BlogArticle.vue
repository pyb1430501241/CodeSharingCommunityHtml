<template>
  <div id="blog_article">
    <div id="left_content">
      <div id="the_author">
        <div class="head_name" >
          <div class="head_portrait">
            <a id="himg" :href="href + href2 + author.uid">
              <img class="himg" :src="author.imgpath" alt />
            </a>
          </div>
          <div class="nickname">
            <a id="aname" :href="href + href2 + author.uid">{{
              author.username
            }}</a>
            <span @click="like" id="like">{{ likeDisplay }}</span>
          </div>
        </div>
        <div class="dls">
          <dl>
            <a
              :href="href + '/Author/' + author.uid"
              target="_blank"
              style="text-decoration: none"
            >
              <dt>{{ author.originalNumber }}</dt>
              <dd>原创</dd>
            </a>
          </dl>
          <dl>
            <dt>{{ author.downloadNumber }}</dt>
            <dd>下载</dd>
          </dl>
          <dl>
            <dt>{{ author.visitNumber }}</dt>
            <dd>访问量</dd>
          </dl>
          <dl>
            <dt>{{ author.attentionNumber }}</dt>
            <dd>关注</dd>
          </dl>
        </div>
        <div class="dls">
          <dl>
            <dt>{{ author.thumbsNumber }}</dt>
            <dd>点赞</dd>
          </dl>
          <dl>
            <a
              :href="href + '/Author/' + author.uid"
              target="_blank"
              style="text-decoration: none"
            >
              <dt>{{ author.fansNumber }}</dt>
              <dd>粉丝</dd>
            </a>
          </dl>
          <dl>
            <dt>{{ author.collectionNumber }}</dt>
            <dd>收藏</dd>
          </dl>
          <dl>
            <dt>{{ author.commentNumber }}</dt>
            <dd>评论</dd>
          </dl>
        </div>
      </div>
      <ul id="blog_list">
        <h5>{{ author.username }}最新博客</h5>
        <li v-for="(item, index) in webList" :key="index">
          <!-- <p @click="changego('/HelloWorld/BlogArticle/'+item.id)">{{item.title}}</p> -->
          <a :href="href + '/BlogArticle/' + item.id">{{ item.title }}</a>
        </li>
      </ul>
      <div class="othershow">
        <img src="../assets/0072Vf1pgy1foxkgbgscjj31hc0u0k39.png" />
      </div>
    </div>
    <div class="article">
      <div id="article_title">
        <h1>{{ web.title }}</h1>
        <div id="otherwise">
          <span class="biao">{{ web.type }}</span>
          <div class="tcv">
            <img @click="thumbs" src="../assets/good.svg" alt>
            <span id="thubm">点赞:{{ web.thumbs }}</span>
          </div>
          <span class="visi">阅读:{{ web.visit }}</span>
          <div class="tcv">
            <img @click="blobcollection" src="../assets/favorites.svg" alt />
            <span id="col">收藏:{{ web.collection }}</span>
          </div>
          <b
            @click="
              changego('/LoggingStatus/BlogEditor/' + $route.params.webid)
            "
            id="change"
            >编辑</b
          >
        </div>
      </div>
      <mavon-editor
        class="md"
        v-model="web.data"
        codeStyle="atom-one-light"
        :subfield="false"
        :defaultOpen="'preview'"
        :toolbarsFlag="false"
        :editable="false"
        :scrollStyle="true"
        :ishljs="true"
      />
      <div class="comment">
        <input
          type="text"
          name
          id="Statement"
          v-model="Statement"
          placeholder="发表评论"
        />
        <input type="submit" id="enter" @click="comment()" value="发送" />
        <ul id="ment" v-for="(mitem, mindex) in commentList" :key="mindex">
          <li>
            <img :src="mitem.imgpath" />
            <b>{{ mitem.username }}&nbsp;</b>
            <span>{{ mitem.createtime }}</span>
            <b>：</b>
            <p>{{ mitem.content }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div id="backtop" @click="backtop()">
      <img src="../assets/backtop.png" alt />
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
      web: {},
      webList: [],
      author: {
        imgpath: require("../assets/user.svg"),
      },
      commentList: [],
      //占坑
      zhankeng: "",
      htmlcontent: "",
      webid: this.$route.params.webid,
      Statement: "",
      href: "/#/HelloWorld",
      href2: "/Author/",
      imgsrc: require("../assets/prompt.svg"),
      likeDisplay: "关注"
    };
  },
  methods: {
    /**
     * like处理关注请求
     */
    like() {
      let that = this;
      if (this.$store.getters.getsessionId == "") {
        alert("未登录！");
        return;
      } else if (this.author.uid == this.$store.getters.getuser.uid) {
        return;
      }
      Axios.post(
        "/blob/reversal", 
        {
          likeId: this.author.uid,
          type: 'like'
        },
        { headers: { Authorization: this.$store.getters.getsessionId } }
      )
        .then((Response) => {
          // console.log(Response.data.json);
          switch (Response.data.code) {
            case 200:
              if(Response.data.data.status) {
                document.getElementById("like").style.color = "dimgray";
                document.getElementById("like").classList.remove("likeshow");
                document.getElementById("like").classList.add("like_dimgray");
                that.likeDisplay = "已关注";
                that.author.fansNumber++;
              } else {
                document.getElementById("like").style.color = "dodgerblue";
                document.getElementById("like").classList.remove("like_dimgray");
                document.getElementById("like").classList.add("likeshow");
                that.likeDisplay = "关注";
                that.author.fansNumber--;
              }
              that.$message({
                message: Response.data.data.msg,
                type: "success",
              });
              break;

            default:
              that.$message({
                message: Response.data.msg,
              });
              // alert("关注..." + Response.data.json.exception);
              break;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 处理点赞
     * thumbs
     */
    thumbs() {
      let that = this;
      if (this.$store.getters.getsessionId == "") {
        alert("未登录！");
        return;
      } else if (this.author.uid == this.$store.getters.getuser.uid) {
        return;
      }
      Axios.post(
        "/blob/reversal",
        {
          webId: this.webid,
          bid: this.author.uid,
          type: 'thumbs'
        },
        { headers: { Authorization: this.$store.getters.getsessionId } }
      )
        .then((Response) => {
          // console.log(Response.data.json);
          switch (Response.data.code) {
            case 200:
              if(Response.data.data.status) {
                that.web.thumbs++;
                that.author.thumbsNumber++;
              } else {
                that.web.thumbs--;
                that.author.thumbsNumber--;
              }
              that.$message({
                message: Response.data.data.msg,
                type: "success",
              });
              break;

            default:
              that.$message({
                message: Response.data.msg,
                type: 'fail'
              });
              break;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 收藏博客
     * collection
     */
    blobcollection() {
      let that = this;
      if (this.$store.getters.getsessionId == "") {
        alert("未登录！");
        return;
      } else if (this.author.uid == this.$store.getters.getuser.uid) {
        return;
      }
      Axios.post(
        "/blob/reversal",
        {
          webId: this.webid,
          bid: this.author.uid,
          type: 'collection'
        },
        { headers: { Authorization: this.$store.getters.getsessionId } }
      )
        .then((Response) => {
          // console.log(Response.data.json);
          switch (Response.data.code) {
            case 200:
              if(Response.data.data.status) {
                that.web.collection++;
                that.author.collectionNumber++;
              } else {
                that.web.collection--;
                that.author.collectionNumber--;
              }
              that.$message({
                message: Response.data.data.msg,
                type: "success",
              });
              break;

            default:
              that.$message({
                type: 'fail',
                message: "收藏失败, " + Response.data.msg,
              });
              break;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 显示回到顶部按钮
    showbtn() {
      let that = this;
      //变量clientHeight是可视区的高度
      var clientHeight = document.documentElement.clientHeight;
      //变量scrollHeight是滚动条的总高度
      var scrollHeight = document.documentElement.scrollHeight;
      // 变量scrollTop是距离顶部的高度
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      that.scrollTop = scrollTop;
      // if (scrollHeight <= scrollTop + clientHeight) {
      //   console.log(scrollHeight);
      //   console.log(scrollTop + clientHeight);
      // }
      if (clientHeight < scrollTop) {
        // document.getElementById("backtop").fadeIn(500);
        document.getElementById("backtop").style.display = "flex";
      } else {
        // document.getElementById("backtop").fadeOut(500);
        document.getElementById("backtop").style.display = "none";
      }
    },
    //回到页面顶部
    backtop() {
      document.body.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    /**
     * 获取文章信息
     */
    blobWebid() {
      let that = this;
      // console.log(this.$route.params.webid);
      Axios.get("/blob/" + this.$route.params.webid, {
        params: {},
        headers: {
          Authorization: this.$store.getters.getsessionId,
        },
      })
        .then((Response) => {
          // console.log(Response.data.json);
          if (Response.data.code == 200) {
            that.web = { ...{}, ...Response.data.data };

            // that.commentList = [...[], ...Response.data.json.commentList];
            // that.commentList.reverse();
            // for (let index = 0; index < that.commentList.length; index++) {
            //   that.commentList[index].imgpath =
            //     "http://localhost/user/image/" + that.commentList[index].imgpath;
            // }
            //document.title = "首页";
            // var titstr = that.web.title + " - CodeSharingCommunity";
            // document.title = titstr;
            //是否原创
            if (that.web.type == 1) {
              that.web.type = "原创";
            } else {
              that.web.type = "转载";
            }
            if (Object.keys(that.$store.getters.getuser).length == 0) {
              document.getElementById("Statement").style.display = "none";
              document.getElementById("enter").style.display = "none";
            } else {
              //评论输入显示
              document.getElementById("Statement").style.display =
                "inline-block";
              document.getElementById("enter").style.display = "inline-block";
            }
            //当登录人与文章作者一致时可修改
            if (that.$store.getters.getuser.uid == that.web.uid) {
              document.getElementById("change").style.display = "block";
              document.getElementById("like").innerHTML = "master";
              // that.href2 = "/PersonalCenter";
              // that.author.uid = "";
              // document.getElementsByClassName("thubm").style.color =
              //   "dodgerblue";
            } else {
              document.getElementById("change").style.display = "none";
              // document.getElementsByClassName("thubm").style.color = "#999aaa";
            }
          } else {
            console.log(
              Response.data.json.code + "..." + Response.data.json.exception
            );
          }
          //获取作者信息
          that.getauthor();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 发布评论
     */
    comment() {
      let that = this;
      Axios.post(
        "/blob/comment",
        qs.stringify({
          webid: this.web.id,
          content: this.Statement,
        }),
        {
          headers: {
            Authorization: this.$store.getters.getsessionId,
          },
        }
      )
        .then((Response) => {
          // console.log(Response.data.json);
          if (Response.data.json.code == 200) {
            that.$message({
              message: "发布评论成功",
              type: "success",
            });
            that.commentList.reverse();
            that.commentList.push({
              content: that.Statement,
              username: Response.data.json.username,
              imgpath: "http://121.199.27.93/user/image/" + Response.data.json.imgpath,
              createtime: Response.data.json.createtime,
            });
            that.commentList.reverse();
            that.Statement = "";
          } else {
            console.log(
              "评论..." +
                Response.data.json.code +
                "..." +
                Response.data.json.exception
            );
            that.$message({
              message:
                "评论..." +
                Response.data.json.code +
                "..." +
                Response.data.json.exception,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          // alert(error);
        });
    },
    //getauthor获取作者信息
    getauthor() {
      let that = this;
      Axios.get("/user/author", {
        params: {
          uid: this.web.uid,
        },
        headers: {
          authorization: this.$store.getters.getsessionId,
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then((Response) => {
          // console.log(Response.data.json);
          if (Response.data.code == 200) {
            that.author = { ...{}, ...Response.data.data };
            that.webList = [...[], ...Response.data.data.lastBlob];
            that.author.imgpath =
              "http://localhost/user/image/" + that.author.imagePath;
            //占坑
            that.zhankeng = "*";
            var titstr =
              that.web.title +
              " - " +
              that.author.username +
              " - 代码共享社区 - CodeSharingCommunity";
            document.title = titstr;
            if (
              this.author.uid != this.$store.getters.getuser.uid &&
              this.$store.getters.getsessionId != ""
            ) {
              document.getElementById("thubm").style.color = "dodgerblue";
              document.getElementById("thubm").classList.add("thubmshow");
              document.getElementById("col").style.color = "dodgerblue";
              document.getElementById("col").classList.add("colshow");
              document.getElementById("like").style.color = "dodgerblue";
              document.getElementById("like").classList.add("likeshow");
            }
          } else {
            console.log(
              Response.data.code +
                "...作者信息" +
                Response.data.msg
            );
          }

          if(that.author.like) {
            that.likeDisplay = "已关注";
            document.getElementById("like").classList.remove("likeshow");
            document.getElementById("like").style.color = "dimgray";
            document.getElementById("like").classList.add("like_dimgray");
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
  },
  watch: {
    $route: function (to, from) {
      console.log(to.path);
      if (to.params.webid != from.params.webid) {
        this.webid = to.params.webid;
        this.blobWebid();
      } else if (to.path.split("/")[2] != from.path.split("/")[2]) {
        //BlogEditor...BlogArticle...
        this.blobWebid();
      }
    },
  },
  created() {

    this.blobWebid();
  },
  mounted() {
    if (this.$store.getters.getsessionId != "") {
      this.href = "/#/LoggingStatus";
    }
    //监视scroll滚动条
    window.addEventListener("scroll", this.showbtn, true);
  },
};
</script>

<style scoped>
#backtop {
  width: 44px;
  height: 44px;
  position: fixed;
  right: 20px;
  /* margin: 0 20% 0 calc(80% - 44px); */
  bottom: 100px;
  background-color: white;
  display: none;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  z-index: 0;
}
#backtop img {
  width: 22px;
  height: 22px;
}
@media (max-width: 1080px) {
  #backtop {
    display: none;
    /* background-color: rgb(59, 58, 58); */
    background-color: rgba(0, 0, 0, 0);
  }
  #backtop img {
    display: none;
  }
}
#ment {
  overflow: hidden;
  display: block;
  padding: 0;
  margin: 10px 0;
  width: 100%;
}
#ment li {
  overflow: hidden;
  display: block;
  text-align: left;
  line-height: 30px;
  background-color: rgb(251, 251, 251);
  padding: 5px 10px 5px 40px;

  border-radius: 10px;
}
#ment li b {
  display: inline-block;
  float: left;
  /* width: 100px; */
  line-height: 30px;
  height: 30px;
  margin: 0;
}
#ment li img + b:hover {
  cursor: pointer;
}
#ment li span {
  display: inline-block;
  float: left;
  line-height: 30px;
  height: 30px;
  font-size: 12px;
  font-weight: 500;
  padding: 0 5px;
}
#ment li p {
  display: inline-block;
  float: left;
  /* width: calc(100% - 100px); */
  text-align: left;
  word-wrap: break-word;
  word-break: break-all;
  line-height: 26px;
  margin: 2px 0;
  /* background-color: white; */
  border-radius: 5px;
  padding: 0 0px;
  font-size: 14px;
  font-weight: 600;
}
#ment li img {
  margin-left: -30px;
  float: left;
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 15px;
}
</style>>
  
<style scoped>
#blog_article {
  min-height: calc(100vh - 112px);
  padding: 0 10%;
  
  display: flex;
  background: url('../assets/cc80d4a7991b4167757a6213fce694f5b1c24c4b.png');
  background-size:100% 100%;
  background-color: rgb(43, 45, 48);
  overflow: hidden;
}
#left_content {
  min-height: calc(100vh - 112px);
  /* background-color: #f5f6f7; */
  border-right: rgb(59, 58, 58) 5px solid;
  width: 20%;
  min-width: 200px;
}
#the_author {
  background-color: white;
  height: 254px;
  width: 100%;
  border-radius: 0 0 10px 10px;
}
.head_name {
  height: 50px;
  /* width: calc(100% - 40px); */
  padding: 20px 20px;
  margin: auto;
  display: flex !important;
  width: 160px;
}
.head_portrait {
  display: inline-block;
  width: 50px;
  height: 50px;
}
.himg {
  display: block;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.nickname {
  display: inline-block;
  line-height: 50px;
  padding-left: 10px;
}
.nickname span {
  display: block;
  line-height: 25px;
  height: 25px;
  width: 100px;
  font-size: 13px;
  text-align: left;
  color: #999aaa;
}
#aname {
  display: block;
  line-height: 25px;
  height: 25px;
  width: 100px;
  text-align: left;
  text-decoration: none;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.75);
  cursor: pointer;
}
.dls {
  display: flex;
  width: 200px;
  margin: auto;
}
dl {
  display: block;
  background-color: white;
  width: 50px;
  height: 50px;
  /* cursor: pointer; */
}
dl:hover {
}
dt {
  text-align: center;
  margin: 0;
  line-height: 25px;
  color: rgba(0, 0, 0, 0.75);
}
dd {
  text-align: center;
  margin: 0;
  line-height: 25px;
  color: #999aaa;
  font-size: 14px;
}
#blog_list {
  /* position: fixed;
  top: 100px;
  left: 10%; */
  display: block;
  overflow: hidden;
  padding: 5px 0;
  background-color: white;
  margin: 5px 0;
  width: 100%;
  /* width: 20%; */
  min-width: 200px;
  border-radius: 10px 10px;
}
#blog_list h5 {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.75);
  /* margin: 0; */
}
#blog_list li {
  display: block;
  width: 100%;
  padding: 5px 0;
  line-height: 20px;
  margin: 5px 0;
  text-align: left;
}

#blog_list a {
  display: block;
  cursor: pointer;
  text-decoration: none;
  margin: 0;
  line-height: 20px;
  padding: 0px 10px;
  width: calc(100% - 20px);
  overflow: hidden;
  /* text-overflow: clip; */
  word-wrap: break-word;
  word-break: break-all;
  text-decoration: none;
  font-size: 14px;
  color: #555666;
}
#blog_list p:hover {
  color: #5893c2;
}
.article {
  min-height: calc(100vh - 112px);
  /* min-height: 100vh; */
  width: 80%;
}
#article_title {
  padding-top: 20px;
  height: 100px;
  background-color: white;
  /* border-bottom: rgb(59, 58, 58) 1px solid; */
  border-radius: 0 0 10px 10px;
}
.md {
  width: 80%;
  margin: 5px 0;
  padding: 0 10%;
  min-height: calc(100vh - 200px);
  border-radius: 10px 10px;
}
.comment {
  overflow: hidden;
  width: 80%;
  padding: 0 10%;
  background-color: white;
  min-height: 70px;
  border-radius: 10px 10px 0 0;
}
.comment input[type="text"] {
  display: inline-block;
  width: calc(80% - 20px);
  margin: 10px 0;
  padding: 0 10px;
  line-height: 30px;
  border: 0;
  background-color: rgb(239, 239, 239);
  outline: none;
  border-radius: 5px 0 0 5px;
}
.comment input[type="submit"] {
  display: inline-block;
  width: 20%;
  margin: 0;
  padding: 0;
  line-height: 30px;
  border: 0;
  outline: none;
  /* box-shadow: 0 0 5px 0 #333333; */
  background-color: rgb(230, 230, 230);
  border-radius: 0 5px 5px 0;
  cursor: pointer;
}
.comment input[type="submit"]:hover {
  background-color: rgb(195, 195, 195);
}
#article_title h1 {
  margin: auto;
  padding: 10px 0;
  line-height: 40px;
  font-size: 28px;
}
#otherwise {
  display: flex;
  justify-content: space-around;
  background-color: rgb(230, 230, 230);
  height: 30px;
  width: 80%;
  margin: 0 10% 10px 10%;
  border-radius: 5px;
}
.biao {
  background-color: rgb(245, 174, 174);
  display: block;
  line-height: 20px;
  margin: 5px;
  padding: 0 5px;
  color: #999aaa;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
}
#thubm,
#col,
.visi {
  display: inline-block;
  float: left;
  margin: 5px 0;
  line-height: 20px;
  height: 20px;
  /* margin: 5px; */
  padding: 0 5px;
  /* color: #999aaa; */
  font-size: 12px;
  border-radius: 4px;
  /* cursor: pointer; */
}
.tcv {
  overflow: hidden;
  /* width: 60px; */
  height: 30px;
}
#otherwise span {
  color: #999aaa;
}
#otherwise img {
  display: inline-block;
  float: left;
  margin: 5px 0;
  height: 20px;
  cursor: pointer;
}
.thubmshow {
  color: dodgerblue;
  font-weight: 600;
}
.colshow {
  color: dodgerblue;
  font-weight: 600;
}
.likeshow {
  color: dodgerblue;
  font-weight: 600;
  cursor: pointer;
}
.like_dimgray {
  color: dimgray;
  font-weight: 600;
  cursor: pointer;
}
#change {
  cursor: pointer;
  color: dodgerblue;
  display: none;
  line-height: 30px;
  font-size: 12px;
}


/* .thubm {
  cursor: pointer;
  color: dodgerblue;
  display: none;
  line-height: 30px;
  font-size: 12px;
} */

.othershow {
  /* margin-top: 30px; */
}
.othershow img {
  display: block;
  width: 100%;
  border-radius: 10px 10px;
}

</style>