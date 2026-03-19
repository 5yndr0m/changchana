<template>
  <div class="success-content">
    <div class="icon">
      <i class="fas fa-check"></i>
    </div>

    <h3 class="_fs-5 _tal-ct _mgt-24px">Forget password success</h3>
    <a
      v-show="isIOS()"
      href="chongchana://chongjaroen.com/"
      class="btn btn-primary _w-100pct _mgt-32px"
      >Go to Application</a
    >

    <a
      v-show="isAndroid()"
      href="https://play.google.com/store/apps/details?id=com.chongjaroen.app"
      class="btn btn-primary _w-100pct _mgt-32px"
      >Go to Application</a
    >

    <div class="_tal-ct _mgt-32px _mgbt-24px">
      <span class="link-login" @click="gotoSignin()">ดำเนินการต่อผ่านเว็บไซต์</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  methods: {
    isIOS() {
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        return true;
      } else {
        return false;
      }
    },
    isAndroid() {
      if (/Android/i.test(navigator.userAgent)) {
        return true;
      } else {
        return false;
      }
    },
    async gotoSignin() {
      this.$router.push("/signin");
    },
  },
};
</script>
<style lang="scss" scoped>
.icon {
  width: 70px;
  height: 70px;
  border-radius: 100%;
  background: #76d650;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  i {
    font-size: 32px;
    color: #fff;
  }
}
.link-login {
  color: #999999;
  font-size: 15px;
  font-weight: normal;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
