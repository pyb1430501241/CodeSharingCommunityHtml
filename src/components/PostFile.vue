<template>
  <div id="postFile">
    <div class="title_row">
      <h3>文件标题：</h3>
      <el-button
        type="primary"
        plain
        icon="el-icon-upload"
        @click="handlePostFile"
        >确定上传</el-button
      >
    </div>
    <el-input
      class="inputTitle"
      v-model="fileTitle"
      placeholder="请输入文件标题"
    ></el-input>
    <h3>文件描述：</h3>
    <el-input
      class="inputArea"
      type="textarea"
      :rows="3"
      placeholder="请输入文件描述"
      v-model="textarea"
    >
    </el-input>
    <h3>上传文件：</h3>
    <el-upload
      class="upload-demo file_updata"
      drag
      action=""
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileList"
      :auto-upload="false"
      :limit="1"
      :multiple="false"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击选择</em></div>
      <div class="el-upload__tip" slot="tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </el-upload>
  </div>
</template>
<script>
import Axios from "axios";
import store from "../store";
import qs from "qs";

export default {
  data() {
    return {
      fileTitle: "",
      textarea: "",
      fileList: [],
    };
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList.pop(file);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleChange(file, fileList) {
      this.fileList.push(file);
    },
    handlePostFile() {
      const file = new FormData();
      file.append("file", this.fileList[0].raw);
      file.append("title", this.fileTitle);
      file.append("description", this.textarea);
      Axios({
        url: "/file/upload",
        method: "post",
        data: file,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: this.$store.getters.getsessionId,
        },
      })
        .then((res) => {
          if (res.data.json.code === 200) {
            this.$message({
              message: "上传资源成功，fileid=" + res.data.json.fileid,
              type: "success",
            });
          } else {
            console.log(res.data.json);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style>
#postFile {
  width: 80%;
  margin: auto;
  min-height: calc(100vh - 112px);
  background-color: #fff;
}
h3 {
  text-align: left;
}
.inputTitle {
}
.inputArea {
}
.file_updata {
  width: 100%;
}
.el-upload {
  width: 100%;
}
.el-upload-dragger {
  padding: 0;
  margin: 0;
  width: 100% !important;
}
.el-upload-list__item {
  font-size: 25px !important;
}
.title_row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>