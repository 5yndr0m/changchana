<template>
  <nav>
    <div class="left">
      <template v-if="left">
        <div @click="() => left.callback()">
          <div class="icon">
            <i class="fas" :class="[`fa-${left.icon}`]"></i>
          </div>
          <span v-html="left.text"></span>
        </div>
      </template>
    </div>

    <div class="branding">
      <img src="~assets/images/logo.svg" alt="" />
    </div>

    <div class="right">
      <template v-if="right">
        <div @click="() => right.callback()">
          <span v-html="right.text"></span>
          <div class="icon">
            <i class="fas" :class="[`fa-${right.icon}`]"></i>
          </div>
        </div>
      </template>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    // leftFunc: Function,
    // leftIcon: String,
    // leftText: String,
    // rightFunc: Function,
    // rightIcon: String,
    // rightText: String,
    left: Object,
    right: Object
  },
  mounted() {
    console.log('AppHeader LeftFunc', this.leftFunc)
  }
}
</script>

<style lang="scss" scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #063f48;
  padding-top: 16px;
  padding-bottom: 16px;
  position: relative;
  z-index: 10;
  box-shadow: 0px 10px 20px rgba(6, 63, 72, 0.1);
  padding-left: 15px;
  padding-right: 15px;

  .left {
    flex: 1;

    > div {
      display: flex;
      width: 100%;
      justify-content: flex-start;
      align-items: center;
      color: #fff;

      .icon {
        margin-right: 8px;
      }
    }
  }

  .branding {
    flex: 0 0 82px;
    height: auto;

    img {
      width: 100%;
      height: auto;
    }
  }

  .right {
    flex: 1;

    > div {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .icon {
        margin-left: 8px;
      }
    }
  }
}
</style>
