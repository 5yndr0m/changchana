<template>
  <div class="branch-card">
    <div class="logo _mgbt-24px" :style="{ backgroundImage: `url('${logo}')` }"></div>
    <h5 class="_fs-7 _ttf-upc _ltspc-2px _mgbt-24px" v-html="name"></h5>

    <ul class="contact-info">
      <li v-if="phone">
        <i class="fas fa-phone"></i>
        <span v-html="phone"></span>
      </li>
      <li v-if="line">
        <i class="fab fa-line"></i>
        <span v-html="line"></span>
      </li>
      <li v-if="map">
        <i class="fas fa-map-marker-alt"></i>
        <a :href="map" target="_blank" ref="noopener noreferrer">Get Direction</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    line: {
      type: String,
      default: ''
    },
    map: {
      type: String,
      default: ''
    },
    logo: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.branch-card {
  .logo {
    height: 72px;
    width: 100%;
    background-size: contain;
    background-position: left center;
    background-repeat: no-repeat;
  }

  .contact-info {
    list-style: none;

    li {
      margin-bottom: 8px;
      color: #fff;

      i {
        font-size: 16px;
        width: 20px;
      }

      &:last-of-type {
        margin-bottom: 0;
      }

      a {
        color: inherit;
      }
    }
  }
}
</style>
