<template>
  <div class="file-upload">
    <p>กรุณาวางไฟล์ที่ต้องการไว้ในกล่องนี้ หรือ <strong>คลิกที่นี่</strong> เพื่ออัพโหลดไฟล์สำหรับกิจกรรม<br>(jpg,jpeg,png,pdf ขนาดไม่เกิน 500MB)</p>
    <input type="file" multiple @change="handleFile">
    <div class="file-list" v-if="files">
      <div v-for="(val, i) in files" :key="`file-${i}`">
        <span v-html="val.name.length > 20 ? val.name.slice(0, 20) + '...' : val.name"></span>
        <div class="remove-icon" @click="removeFile(i)">
          <i class="fas fa-times-circle"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    files: []
  }),
  methods: {
    handleFile(e) {
      // console.log(e.target.files)
      let oldFiles = this.files
      let newFiles = Array.from(oldFiles).concat(Array.from(e.target.files))
      this.files = newFiles
      this.$emit('input', newFiles)
    },
    removeFile(i) {
      let oldFiles = this.files
      oldFiles.splice(i, 1)
      this.$emit('input', oldFiles)
    }
  }
}
</script>

<style lang="scss" scoped>
.file-upload {
  text-align: center;
  position: relative;
  padding: 16px;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, .4);

  p {
    color: #B0C1C4;

    strong {
      color: #fff;
    }
  }

  input {
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
    top: 0; left: 0;
  }

  .file-list {
    display: flex;
    align-items: center;
    margin-top: 16px;
    flex-wrap: wrap;
    position: relative;
    z-index: 15;

    > div {
      display: flex;
      align-items: center;
      color: #B0C1C4;
      background: rgba(0, 0, 0, 0.3);
      padding: 4px 8px;
      border-radius: 4px;
      margin-right: 16px;
      margin-top: 4px;
      margin-bottom: 4px;

      &:last-of-type {
        margin-right: 0;
      }

      .remove-icon {
        margin-left: 8px;
        font-size: 11px;
      }
    }
  }
}
</style>