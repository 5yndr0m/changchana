<template>
  <transition name="spinner">
    <div class="spinner" v-if="loading">
      <i class="far fa-sync-alt"></i>
    </div>
  </transition>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      // setTimeout(() => this.loading = false, 1500)
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.spinner {
  width: 64px;
  height: 54px;
  background: #fff;
  border: 1px solid #e2e2e2;
  border-top-left-radius: 48px;
  border-bottom-left-radius: 48px;
  position: fixed;
  top: 100px;
  right: 0;
  color: #999;
  font-size: 26px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  z-index: 99999;

  i {
    position: absolute;
    // top: 50%;
    // left: 50%;
    left: 16px;
    top: 12px;
    // transform: translate(-50%, -50%);
    animation: infinite-spinning 1s infinite;
  }
}

@keyframes infinite-spinning {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
