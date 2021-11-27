<template>
  <div id="blog_editor">
    <div id="editor">
      <div id="bar">
        <input
          type="text"
          v-model="title"
          name="blogtitle"
          id="blogtitle"
          placeholder="标题"
        />
        <select name="select" id="select" :value="contype">
          <!-- <option value="1">原创</option>
          <option value="2">转载</option> -->
          <option
            v-for="(item, index) in contypeList"
            :key="index"
            :value="item.id"
          >
            {{ item.type }}
          </option>
        </select>
        <button type="submit" @click="dialogVisible = true">提交发布</button>
      </div>
      <!--  -->
      <el-dialog title="选择文章标签" :visible.sync="dialogVisible" width="30%">
        <el-checkbox-group v-model="checkedLabels" :max="3">
          <el-checkbox
            class="checklabel"
            v-for="litem in labelList"
            :label="litem.id"
            :key="litem.id"
            @change="change()"
            border
            size="mini"
            >{{ litem.label }}</el-checkbox
          >
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel(), (dialogVisible = false)"
            >取 消</el-button
          >
          <el-button type="primary" @click="submit(), (dialogVisible = false)"
            >发布文章</el-button
          >
        </span>
      </el-dialog>
      <!--  -->
      <mavon-editor
        class="mavon"
        codeStyle="atom-one-light"
        v-model="webDataString"
        @imgAdd="$imgAdd"
        @imgDel="$imgDel"
        :ishljs="true"
        :boxShadow="false"
        ref="md"
      />
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
      dialogVisible: false,
      checkedLabels: [],
      // key = 0时提交新作，key = 1时提交修改
      //新作投稿
      webDataString: "",
      htmlcontent: "",
      contype: 1,
      title: "",
      contypeList: [],
      // 标签集合，最多三个
      labelList: [],
      //修改用
      web: {},
      webList: [],
      author: {},
      commentList: [],
      visit: "",
      thubms: "",
      collection: "",
      webid: this.$route.params.webid,
    };
  },
  methods: {
    change() {
      console.log(this.checkedLabels.toString());
    },
    $imgDel(pos, $file) {},
    /**
     * md上传图片
     */
    $imgAdd(pos, $file) {
      let that = this;
      // 第一步.将图片上传到服务器.
      console.log($file);
      var formdata = new FormData();
      formdata.append("img", $file);

      Axios({
        url: "/blob/blobimg",
        method: "post",
        data: formdata,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: this.$store.getters.getsessionId,
        },
      })
        .then((url) => {
          // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
          /**
           * $vm 指为mavonEditor实例，可以通过如下两种方式获取
           * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
           * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
           */
          // console.log(url.data.json);
          that.$refs.md.$img2Url(
            pos,
            "http://121.199.27.93/blob/image/" + url.data.json.img
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //提交数据
    submit() {
      // console.log("this.webid=" + this.webid);
      if (this.webid == "0") {
        this.contribution();
      } else {
        this.update();
      }
    },
    // getcontype获取标签
    getcontype() {
      var that = this;
      Axios.get("/blob/types", {
        headers: {
          authorization : this.$store.getters.getsessionId,
          "X-Requested-With": "XMLHttpRequest",
        },
      }).then((response) => {
        console.log(response.data.data);
        that.contypeList = [...[], ...response.data.data];
      });
    },
    // getlabel获取标签
    getlabel() {
      var that = this;
      Axios.get("/blob/labels", {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      }).then((response) => {
        that.labelList = [...[], ...response.data.data];
      });
    },
    // 弹出框取消事件函数
    cancel() {},
    /**
     * 投稿，contribution
     */
    contribution() {
      let that = this;
      // console.log(this.title + "///" + this.webDataString);
      let sessionid = this.$store.getters.getsessionId;
      // console.log("id=" + sessionid);
      this.contype = document.getElementById("select").value;

      Axios.post(
        "/blob/contribution",
        {
          title: that.title,
          type: that.contype,
          data: that.webDataString,
          labelIds: that.checkedLabels,
        },
        { headers: { authorization: sessionid } }
      )
        .then((Response) => {

          if (Response.data.code == 200) {
            that.$message({
              showClose: true,
              message:
                "发布成功",
              type: "success",
            });

            this.$router.push({
              path: `/LoggingStatus/BlogArticle/${Response.data.data}`,
            });
          } else {
            that.$message({
              showClose: true,
              message:
                Response.data.msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 提交修改
     */
    update() {
      let that = this;
      // console.log(this.title + "///" + this.webDataString);
      let sessionid = this.$store.getters.getsessionId;
      // console.log("id=" + sessionid);
      this.contype = document.getElementById("select").value;
      console.log(this.contype);
      Axios.post(
        "/blob/update",
        qs.stringify({
          id: that.webid,
          title: that.title,
          contype: that.contype,
          labelList: that.checkedLabels,
          webDataString: that.checkedLabels.toString(),
        }),
        { headers: { Authorization: this.$store.getters.getsessionId } }
      )
        .then((Response) => {
          // console.log(Response.data.json);
          if (Response.data.json.code == 200) {
            that.$message({
              showClose: true,
              message:
                "修改..." + Response.data.json.msg + Response.data.json.webid,
              type: "success",
            });
            this.$router.push({
              path: `/LoggingStatus/BlogArticle/${that.webid}`,
            });
          } else {
            that.$message({
              showClose: true,
              message:
                Response.data.json.code +
                "...修改..." +
                Response.data.json.exception,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 修改前获取文章信息填充
     */
    blobWebid() {
      let that = this;
      // console.log(this.webid);
      Axios.get("/blob/" + this.webid, {
        params: {},
        headers: {
          Authorization: this.$store.getters.getsessionId,
        },
      })
        .then((Response) => {
          // console.log(Response.data.json);
          if (Response.data.code == 200) {
            that.web = { ...that.web, ...Response.data.data };
            that.visit = Response.data.data.visit;
            that.thubms = Response.data.data.thubms;
            that.collection = Response.data.data.collection;
            // that.commentList = [
            //   ...that.commentList,
            //   ...Response.data.json.commentList,
            // ];
            that.title = that.web.title;
            that.webDataString = that.web.data;
            that.contype = that.web.type;
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
    // tohtml() {
    //   this.htmlcontent = this.converter.makeHtml(this.webDataString);
    //   console.log(this.value);
    // }

    //  <el-dialog>  :before-close="handleClose"
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
  mounted() {
    document.title = "编辑 - 代码共享社区 - CodeSharingCommunity";
    this.getcontype();
    this.getlabel();
    if (this.$route.params.webid != "0") {
      this.blobWebid();
    }
  },
  beforeRouteUpdate() {},
};
</script>
<style scoped>
#blog_editor {
  min-height: calc(100vh - 112px);
  /* width: 100%; */
  padding: 0 10%;
  background-color: rgb(59, 58, 58);
}
#bar {
  height: 50px;
  margin: 0;
  padding: 0;
}
.mavon {
  min-height: calc(100vh - 162px);
  z-index: 10;
}
input[type="text"] {
  /* display: block; */
  width: calc(100% - 220px);
  height: 30px;
  margin: 10px 10px 10px 0;
  float: left;
  border-radius: 5px;
  border: white solid 0px;
  padding: 0 10px;
  outline: 0;
}
select {
  width: 80px;
  height: 30px;
  margin: 10px 10px 10px 0;
  outline: 0;
  border: 0;
  border-radius: 5px;
  padding-left: 10px;
  text-align: center;
}
#bar button {
  border-radius: 5px;
  height: 30px;
  width: 80px;
  margin: 10px 10px 10px 0;
  padding: 0;
  outline: 0;
  border: 0;
  cursor: pointer;
  color: cadetblue;
}
#bar button:hover {
  background-color: cadetblue;
  color: white;
}
.checklabel {
  margin: 0;
}
</style>