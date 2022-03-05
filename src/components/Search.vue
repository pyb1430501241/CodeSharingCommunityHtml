<template>
  <div class="header">
    <!-- <h1>{{title}}</h1> -->
    <ul>
      <li>用户
          <a v-for="(usernum) in list.users" :key="usernum" :href="href+'/Author/'+usernum.uid">
              <img :src="'http://localhost/user/image/'+usernum.imgPath" alt="">
              <span>{{usernum.username}}</span>
          </a>
      </li>
      <li>博客
          <a v-for="(blobnum) in list.blobs" :key="blobnum" :href="href+'/BlogArticle/'+blobnum.id">
              <span>{{blobnum.title}}</span>
          </a>
      </li>
      <li>文件
          <a v-for="(filenum) in list.files" :key="filenum" :href="href+'/BlogArticle/'+filenum.id" >
              <div>
                  {{filenum.title}}
                  <span>{{filenum.description}}</span>
              </div>
          </a>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      title: "Vue Components Demo",
      keyword:"",
      list:"",
      author: {
        imgpath: require("../assets/user.svg"),
      },
       href: "/#/HelloWorld",
    };
  },
  methods: {
    changego(event) {
      this.$router.push({ path: event });
      // this.$emit("onGoto", event);
    },
    changeword(event){
      axios
        .get("/search/list", {
          params:{
            text : event
          }
        })
        .then(res=>{
            this.list=res.data.data
        })
    }
  },
  created() {
    this.changeword(this.$route.params.keyword)
  },
  mounted(){
      if (this.$store.getters.getsessionId != "") {
        this.href = "/#/LoggingStatus";
      }
  },
  beforeRouteUpdate (to, from, next) {
    this.changeword(to.params.keyword)
    next();
  }
};
</script>
<style scoped>