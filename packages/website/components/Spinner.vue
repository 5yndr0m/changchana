<template>
  <div class="loading-page" v-if="loading">
    <div v-if="screen" class="d-flex justify-content-center loader">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div v-show="!!message" class="_mgl-16px">{{ message }}</div>
    </div>
    <transition v-else name="spinner">
      <div class="spinner">
        <img src="~assets/images/bars.svg" alt="">
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    screen: false,
    message: "",
  }),
  methods: {
    start (options) {
      const opt = options || {};
      if (opt.screen) {
        this.screen = true;
      }
      if (opt.message) {
        this.message = opt.message;
      }

      this.loading = true
    },
    finish () {
      setTimeout(() => this.loading = false, 700);
      this.screen = false;
      this.message = "";
      // this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.spinner {
  width: 48px;
  height: 30px;
  background: #fff;
  border: 1px solid #e2e2e2;
  position: fixed;
  top: 16px;
  right: 16px;
  color: #999;
  font-size: 26px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  z-index: 99999;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0,0,0,.07);

  img {
    position: absolute;
    width: 20px;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.loader {
  position: fixed;
  opacity: 0.6;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #1797AD;
  background: #2c2c2c;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
