<template>
  <nuxt-link :to="to">
    <div class="featured-card">
      <div class="row">
        <div class="col-md-7">
          <div
            class="image"
            :style="{ backgroundImage: `url('${image}')` }"
          ></div>
        </div>
        <div class="col-md-5">
          <div class="content _pdr-32px">
            <span class="badge bg-primary" v-if="special">Special Content</span>
            <h4 class="_fs-4-md _fs-5 _mgt-24px _mgbt-16px" v-html="title"></h4>
            <p v-html="excerpt"></p>
          </div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    excerpt: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    special: {
      type: Boolean,
      default: false
    },
    to: {
      type: String,
      default: '/'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

a {
  font-weight: inherit;
  color: inherit;
}

.featured-card {
  border-radius: 5px;
  background: #063f48;
  overflow: hidden;
  position: relative;
  z-index: 5;

  @media screen and (max-width: $md) {
    border-radius: 0;
  }

  .image {
    width: 100%;
    height: auto;
    padding-top: 56.25%;
    background-color: #e2e2e2;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media screen and (max-width: $md) {
      padding: 24px 16px;
    }
  }
}
</style>
