<template>
  <div id="notfound">
    <div class="content">
      <div>
        <img src="../assets/cry.svg" alt />
      </div>
      <h1>404 NOT_FOUND_ERROR</h1>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    document.title =
      "404 NOT_FOUND_ERROR - 代码共享社区 - CodeSharingCommunity";
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
/* p {
  line-height: 45px;
  color: gray;
} */
</style>