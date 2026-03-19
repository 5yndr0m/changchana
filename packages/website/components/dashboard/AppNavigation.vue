<template>
  <nav class="_pdv-32px-md _pdv-24px">
    <!-- <sl-alert type="success" duration="3000" closable ref="successAlert">
      <sl-icon slot="icon" name="check2-circle"></sl-icon>
      <strong>Signout Successfully</strong><br />
      Redirecting you to your signin page.
    </sl-alert> -->

    <div class="mobile-navigation" :class="{ '-active': mobileNav }">
      <ul>
        <li>
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li v-if="!_loggedIn">
          <nuxt-link to="/signin" class="btn btn-outline-light">Sign in</nuxt-link>
        </li>
        <li v-if="_loggedIn && $route.path.includes('/account')">
          <button @click="signout" class="btn btn-outline-light">Signout</button>
        </li>
        <li v-if="_loggedIn && !$route.path.includes('/account')">
          <nuxt-link to="/account" class="btn btn-outline-light">My Account</nuxt-link>
        </li>
      </ul>
    </div>

    <div class="container">
      <div class="_dp-f _jtfct-spbtw _alit-ct">
        <div class="branding">
          <img src="~assets/images/cj_logo.svg" alt="" />
        </div>
        <div class="button-wrapper _dp-f-md _alit-ct _dp-n">
          <nuxt-link class="btn btn-link" to="/">Home</nuxt-link>
          <nuxt-link to="/signin" class="btn btn-outline-light" v-if="!_loggedIn">Sign in</nuxt-link>
          <button @click="signout" class="btn btn-outline-light" v-if="_loggedIn && $route.path.includes('/account')">Signout</button>
          <nuxt-link to="/account" class="btn btn-outline-light" v-if="_loggedIn && !($route.path.includes('/account'))">My Account</nuxt-link>
        </div>
        <div class="_fs-5 _dp-n-md _cl-white _cs-pt" @click="mobileNav = !mobileNav">
          <i class="fas fa-bars" v-if="!mobileNav"></i>
          <i class="fas fa-times" v-else></i>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data: () => ({
    mobileNav: false,
  }),
  computed: {
    _loggedIn () {
      return this.$store.state.auth.loggedIn
    }
  },
  methods: {
    async signout () {
      // this.__toastAlert('success', {
      //   title: 'Signout Successfully',
      //   description: 'Successfully signing you out'
      // })
      this.__showToast({
        title: 'Signout Successfully',
        description: 'Successfully signing you out',
        type: 'primary'
      })
      await this.$auth.logout()
      this.$router.push('/signin')
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

nav {
  background: #063f48;
  position: relative;

  sl-button::part(base) {
    @media screen and (max-width: $md) {
      font-size: 13px;
    }
  }

  sl-button::part(label) {
    @media screen and (max-width: $md) {
      padding: 0 10px;
    }
  }

  .branding {
    width: 95px;
    height: auto;

    @media screen and (max-width: $md) {
      margin-left: auto;
      margin-right: auto;
      width: 84px;
    }

    img {
      width: 100%;
      height: auto;
    }
  }

  .button-wrapper {
    // a {
    //   color: #fff;
    //   margin-right: 24px;
    // }

    .btn-link {
      font-weight: 700;
      color: #fff;
      text-decoration: none;
      margin-right: 8px;
    }

    @media screen and (max-width: $md) {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 20px;
    }
  }
}

.mobile-navigation {
  background: #122326;
  position: absolute;
  top: 60px;
  z-index: 999;
  width: 100%;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: 0.3s;

  &.-active {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
    transition: 0.3s;
  }

  ul {
    list-style: none;

    > li {
      padding: 16px;
      text-align: center;

      a {
        color: #fff;
      }

      &:first-of-type {
        padding-top: 32px;
      }

      &:last-of-type {
        padding-bottom: 32px;
      }
    }
  }
}
</style>
