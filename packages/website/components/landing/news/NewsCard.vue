<template>
  <div class="news-card">
    <span class="badge bg-primary" v-if="special">Special Content</span>
    <div class="image _mgbt-24px" :style="{ backgroundImage: `url('${image}')` }"></div>
    <div class="content">
      <h4 class="_fs-6 _mgbt-8px" v-html="title"></h4>
      <p class="_mgbt-16px" v-html="excerpt"></p>
      <div class="_dp-f _jtfct-fe _fs-6">
        <nuxt-link :to="to">
          <i class="far fa-arrow-right _mgr-8px"></i>
          <span>อ่านเพิ่มเติม</span>
        </nuxt-link>
      </div>
    </div>
  </div>
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
      default: '',
    },
    image: {
      type: String,
      default: ''
    },
    to: {
      type: String,
      default: '/'
    },
    special: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.news-card {
  position: relative;
  
  .image {
    width: 100%;
    height: auto;
    padding-top: 56.25%;
    background-color: #e2e2e2;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 5px;
  }

  a {
    color: #fff;
  }

  sl-badge {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}
</style>
