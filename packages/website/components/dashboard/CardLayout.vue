<template>
  <div>
    <AppHeader class="_dp-n-md" :left="left" />

    <template v-if="vw">
      <!-- Desktop -->
      <div class="content" v-if="vw > 995">
        <div class="container" :style="{ maxWidth: `${maxWidth}px` }">
          <section class="hero _mgbt-64px _pdbt-16px _dp-b-md _dp-n">
            <div class="branding">
              <img src="~assets/images/logo.svg" alt="" />
            </div>
          </section>
          <template v-if="left">
            <div
              class="_dp-f _jtfct-fst _mgbt-16px _fs-6 _cl-white _tdcrt-n _alit-ct _cs-pt"
              @click="left.callback"
            >
              <i class="fas fa-chevron-left _mgr-4px"></i>
              <span class="_fw-600">Back</span>
            </div>
          </template>
          <div class="_w-100pct card">
            <div class="card-body">
              <slot name="desktop" />
            </div>
          </div>

          <slot name="desktop-footer" />
        </div>
      </div>

      <!-- Mobile -->
      <div class="_mgv-32px _dp-n-md _bgcl-white _pst-rlt" v-if="vw <= 995">
        <div class="container">
          <slot name="mobile" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    maxWidth: {
      type: String,
      default: '604',
    },
    backPath: {
      type: String,
      default: '/',
    },
    // leftFunc: Function,
    left: Object,
  },
  data: () => ({
    vw: null
  }),
  methods: {
    handleVW () {
      this.vw = window.innerWidth
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.vw = window.innerWidth
      window.addEventListener('resize', this.handleVW)
    })
  },
  destroyed() {
    window.removeEventListener('resize', this.handleVW)
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.content {
  width: 100%;
  height: auto;
  min-height: 90vh;
  padding-top: 100px;
  padding-bottom: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('~assets/images/bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media screen and (max-width: $md) {
    min-height: initial;
    display: none;
  }

  > div {
    width: 100%;
    // max-width: 600px;
  }
}

.hero {
  .branding {
    width: 130px;
    height: auto;
    display: block;
    margin-left: auto;
    margin-right: auto;

    img {
      width: 100%;
      height: auto;
    }
  }
}

sl-card::part(base) {
  // overflow: hidden;
  position: relative;
  border: none;
  padding-top: 16px;
}

.card {
  position: relative;
  padding-top: 16px !important;
}
</style>
