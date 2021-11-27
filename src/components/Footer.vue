<template>
  <footer>
    <a :href="we_url" target="_blank">{{we}}</a>
    <p>{{copyright}}</p>
    <a :href="user_serve_url">{{UserServe}}</a>
  </footer>
</template>
<script>
import cookie from '../store/cookie'

export default {
  data() {
    return {
      we: "关于我们",
      we_url: "http://112.124.30.43/onpine/ltfhub",
      copyright: "Copyright-2020-CodeSharingCommunity",
      UserServe: "用户协议",
      user_serve_url: "/#/HelloWorld/UserAgreement",
    };
  },
  mounted() {
    if (cookie.getCookie('authorization') != "") {
      this.user_serve_url = "/#/LoggingStatus/UserAgreement";
    }
  },
};
</script>
<style scoped>
footer {
  display: flex;
  background: #222;
  padding: 6px;
  height: 50px;
  justify-content: center;
}
a {
  display: inline-block;
  text-decoration: none;
  height: 18px;
  margin: 16px;
  line-height: 18px;
  color: cadetblue;
  font-size: 15px;
}
a:hover {
  color: white;
}
p {
  /* color: dodgerblue; */
  display: inline;
  color: cadetblue;
  text-align: center;
  font-size: 15px;
}
</style>