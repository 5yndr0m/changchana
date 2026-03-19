<template>
  <div>
    <AlertToast />
    <MobileNav class="_dp-n-md" />
    <div class="layout">
      <DesktopNav class="_dp-f-md _dp-n" />
      <main>
        <div class="content">
          <nuxt />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import DesktopNav from '~/components/DesktopNav'
import MobileNav from '~/components/MobileNav'

export default {
  middleware: 'auth',
  components: {
    DesktopNav,
    MobileNav,
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  // background-color: #f4f8f9;
  background-color: #F7FAFC;
  box-sizing: border-box;

  @media screen and (max-width: $md) {
    padding-top: 53px;
  }

  main {
    flex: 1;
    box-sizing: border-box;
    padding: 32px 41px;
    overflow-y: scroll;
    position: relative;
    padding-bottom: 72px !important;

    @media screen and (max-width: $md) {
      padding: 20px 14px;
    }

    .content {
      max-width: 1300px;
      margin-left: auto;
      margin-right: auto;

      @media screen and (max-width: $md) {
        max-width: 100%;
      }
    }
  }
}
</style>
