<template>
  <div id="useragreement">
    <div class="content">
      <h1>我们的价值观</h1>
      <p>
        十八大提出，倡导富强、民主、文明、和谐，倡导自由
        、平等、公正、法治，倡导爱国、敬业、诚信、友善，积极培育和践行社会主义核心价值观。富强、民主、文明、和谐是国家层面的价值目标，自由、平等、公正、法治是社会层面的价值取向，爱国、敬业、诚信、友善是公民个人层面的价值准则，这24个字是社会主义核心价值观的基本内容。
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      href: "/#/HelloWorld",
    };
  },
  mounted() {
    if (this.$store.getters.getsessionId != "") {
      this.href = "/#/LoggingStatus";
    }
    document.title = "用户协议 - 代码共享社区 - CodeSharingCommunity";
  },
};
</script>

<style scoped>
#useragreement {
  /* overflow: scroll; */
  min-height: calc(100vh - 112px);
}
.content {
  background-color: #f5f6f7;
  width: 60%;
  min-height: calc(100vh - 112px);
  margin: 0 10%;
  padding: 0 10%;
  margin: auto;
}
h1 {
  margin: 0;
  padding: 20px;
  font-size: 25px;
  font-weight: 500;
}
p {
  line-height: 45px;
  color: gray;
}
</style>