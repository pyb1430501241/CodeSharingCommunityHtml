<template>
  <div id="personalcenter">
    <div id="left_content">
      <div id="left_bar">
        <div class="head_name">
          <div class="head_portrait">
            <!-- <a :href="'/#/LoggingStatus/Author/'+this.$store.getters.getuser.uid"> -->
            <!-- <img class="himg" src="../assets/headportrait.jpg" alt /> -->
            <img
              class="himg"
              :src="
                'http://localhost/user/image/' +
                this.$store.getters.getuser.imgPath
              "
              alt
            />
            <!-- </a> -->
          </div>
          <div class="nickname">
            <a
              id="aname"
              :href="
                '/#/LoggingStatus/Author/' + this.$store.getters.getuser.uid
              "
              >{{ this.$store.getters.getuser.username }}</a
            >
            <span>master</span>
          </div>
        </div>
        <ul>
          <li @click="check(0)" :class="[keyed == 0 ? 'checked' : '']">
            我的资料
          </li>
          <li @click="check(1)" :class="[keyed == 1 ? 'checked' : '']">
            我的文章
          </li>
          <li @click="check(2)" :class="[keyed == 2 ? 'checked' : '']">
            我的关注
          </li>
          <li @click="check(3)" :class="[keyed == 3 ? 'checked' : '']">
            我的粉丝
          </li>
          <li @click="check(4)" :class="[keyed == 4 ? 'checked' : '']">
            我的收藏
          </li>
          <li @click="check(5)" :class="[keyed == 5 ? 'checked' : '']">
            我的资源
          </li>
        </ul>
      </div>
    </div>
    <div id="content">
      <div class="inside">
        <component :is="componentId"></component>
      </div>
    </div>
  </div>
</template>
<script>
import store from "../store";
import MyData from "./MyData";
import MyArticle from "./MyArticle";
import MyConcerned from "./MyConcerned";
import MyFans from "./MyFans";
import Mycollection from "./Mycollection";
import MyResources from "../components/MyResources";
export default {
  data() {
    return {
      componentId: "MyData",
      componentArray: [
        "MyData",
        "MyArticle",
        "MyConcerned",
        "MyFans",
        "Mycollection",
        "MyResources",
      ],
      name: "onpine",
      keyed: 0,
    };
  },
  components: {
    MyData,
    MyArticle,
    MyConcerned,
    MyFans,
    Mycollection,
    MyResources,
  },
  methods: {
    check(index) {
      this.keyed = index;
      this.componentId = this.componentArray[index];
      console.log(index);
    },
    resolve(event) {
      let routeData = this.$router.resolve({
        path: event,
      });
      window.open(routeData.href, "_blank");
    },
  },
  mounted() {
    document.title = "个人中心 - 代码共享社区 - CodeSharingCommunity";
  },
};
</script>

<style scoped>
#personalcenter {
  background: url('../assets/0072Vf1pgy1foxlna4bcfj31kw0w0h96.png');
  background-size:100% 100%;
  min-height: calc(100vh - 112px);
  background-color: brown;
  display: flex;
  overflow: hidden;
  padding: 0 15%;
  background-color: rgb(59, 58, 58);
}
#left_content {
  min-height: calc(100vh - 112px);
  background-color: #f5f6f7;
  border-right: rgb(59, 58, 58) 3px solid;
  width: 10%;
  /* width: 150px; */
  min-width: 200px;
}
#the_author {
  background-color: white;
  height: 254px;
  width: 100%;
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
.nickname span,
a {
  display: block;
  line-height: 25px;
  height: 25px;
  width: 100px;
  font-size: 13px;
  text-align: left;
  color: #999aaa;
}
#aname {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.75);
  cursor: pointer;
  text-decoration: none;
}
#left_bar ul {
  display: block;
  list-style-type: none;
  padding: 0;
}
#left_bar li {
  display: block;
  line-height: 35px;
  margin: 5px 0;
  font-weight: 550;
  cursor: pointer;
}
.checked {
  background-color: white;
  color: gray;
}
#content {
  min-height: calc(100vh - 112px);
  width: 80%;
  padding: 0 5%;
  background-color: white;
}
.inside {
  /* background-color: #f5f6f7; */

  /* margin: 0 10%; */
  min-height: calc(100vh - 152px);
  padding: 0;
}
</style>