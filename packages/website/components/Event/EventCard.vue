<template>
  <div class="event-card">
    <span class="badge bg-primary event-badge" >{{type}}</span>
    <div class="image _mgbt-24px" :style="{ backgroundImage: `url('${image}')` }"></div>
    <div class="content">
      <h4 class="_fw-900 _fs-6 _mgbt-8px" v-html="title"></h4>
      <p class="_mgbt-8px">{{branch_name}}</p>
      <p class="_fw-900 _mgbt-16px"><i class="fas fa-calendar-day"></i> {{round_date}}</p>
      <div class="_dp-f _jtfct-st _fs-6">
        <div v-if="!isLogIn" class="btn"
          :class="{ 'btn-primary': isBuyNow, 'btn-outline-light': !isBuyNow }"
          @click="showDialogLogIn"
        >
          <span v-if="isCommingSoon">Coming Soon</span>
          <span v-else>{{isBuyNow ? 'Buy Now' : 'Walk In'}}</span>
        </div>
        <nuxt-link v-else :to="link" class="btn"
          :class="{ 'btn-primary': isBuyNow, 'btn-outline-light': !isBuyNow }">
          <span v-if="isCommingSoon">Coming Soon</span>
          <span v-else>{{isBuyNow ? 'Buy Now' : 'Walk In'}}</span>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isCommingSoon() {
      return this.status == 'comming_soon'
    },
    isBuyNow() {
      return this.status == 'publish' && this.selling_type == 'ticket'
    },
    isLogIn() {
      return this.$store.state.auth.loggedIn
    },
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    selling_type: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: ''
    },
    branch_name: {
      type: String,
      required: true,
    },
    round_date: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '/'
    },
    showDialogLogIn: {
      type: Function,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.event-card {
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
  .event-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 1.1em;
    padding: 0.2em 0.3em;
    font-weight: normal;
    text-transform: uppercase;
  }
}
</style>
