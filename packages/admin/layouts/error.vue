<template>
  <div>
    <div class="error">
      <template v-if="error.statusCode === 404">
        <div class="content">
          <h1>404</h1>
          <h2 class="_fs-5 _mgbt-32px">It looks like you lost.</h2>
          <nuxt-link to="/dashboard" class="btn btn-primary">
            <i class="fas fa-arrow-right"></i>
            <span>Go back home</span>
          </nuxt-link>
        </div>
      </template>
      <template v-else>
        <div class="content">
           <h1 v-if="error.statusCode != undefined">{{error.statusCode}}</h1>
          <h2 class="_fs-2 _mgbt-32px">There is<br />something wrong.</h2>
          <nuxt-link to="/dashboard" class="btn btn-primary">
            <i class="fas fa-arrow-right"></i>
            <span>Go back home</span>
          </nuxt-link>
        </div>
      </template>
      <!-- <NuxtLink to="/">Home page</NuxtLink> -->
      <div class="video">
        <video src="/404_video.mp4" autoplay muted loop></video>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["error"],
  layout: "error", // you can set a custom layout for the error page
};
</script>

<style lang="scss" scoped>
@import "~assets/styles/variables";

.error {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  background-color: #fff;

  .content {
    position: relative;
    z-index: 10;
    padding-bottom: 250px;

    h1 {
      font-size: 100px !important;

      @media screen and (max-width: $md) {
        font-size: 60px !important;
      }
    }
  }

  .video {
    position: absolute;
    bottom: -50px;
    left: 50%;
    transform: translateX(-50%);
    width: 450px;

    @media screen and (max-width: $md) {
      width: 350px;
      bottom: -40px;
    }

    video {
      width: 100%;
      height: auto;
    }
  }
}
</style>
