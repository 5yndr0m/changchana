<template>
  <nav class="_pdv-32px-md _pdv-16px">
    <div class="mobile-navigation" :class="{ '-active': mobileNav }">
      <ul>
        <li
          v-for="(val, i) in navLinks"
          :key="`nav-mobile-links-${i}`"
          @click="mobileNav = false"
        >
          <nuxt-link
            :to="val.path"
            v-if="!val.button && !val.outline"
            v-html="val.label"
          ></nuxt-link>
        </li>
        <template v-if="!_loggedIn">
          <li @click="mobileNav = false">
            <nuxt-link class="btn btn-primary" to="/signup">สมัครสมาชิก</nuxt-link>
          </li>
          <li @click="mobileNav = false">
            <nuxt-link class="btn btn-outline-light" to="/signin">ลงชื่อเข้าใช้</nuxt-link>
          </li>
        </template>
        <template v-else>
          <li
            v-if="$route.path.includes('/account')"
            @click="mobileNav = false"
          >
            <button class="btn btn-outline-light" @click="signout">ออกจากระบบ</button>
          </li>
          <li
            v-if="!$route.path.includes('/account')"
          >
            <div class="dropdown account-selector" >
              <div class="dropdown-toggle btn btn-outline-light" type="button" id="dropdownFilterAccountMenu" data-bs-toggle="dropdown" aria-expanded="false">
                My Account
              </div>
              <ul class="dropdown-menu" aria-labelledby="dropdownFilterAccountMenu">
                <li class="dropdown-item" @click="mobileNav = false"><nuxt-link to="/account" >Profile</nuxt-link></li>
                <li class="dropdown-item" @click="mobileNav = false"><nuxt-link to="/ticket" >Ticket</nuxt-link></li>
              </ul>
            </div>
          </li>
        </template>
      </ul>
    </div>

    <div class="container">
      <div class="_dp-f _jtfct-spbtw _alit-ct">
        <div class="branding">
          <nuxt-link to="/">
            <img src="~assets/images/cj_logo.svg" alt="" />
          </nuxt-link>
        </div>
        <div class="button-wrapper _dp-f-md _alit-ct _dp-n">
          <div v-for="(val, i) in navLinks" :key="`nav-links-${i}`">
            <nuxt-link
              :to="val.path"
              v-if="!val.button && !val.outline"
              v-html="val.label"
            ></nuxt-link>
          </div>
          <template v-if="!_loggedIn">
            <nuxt-link
              to="/signup"
              v-if="!_loggedIn"
              class="_mgr-12px btn btn-primary"
              >สมัครสมาชิก</nuxt-link
            >
            <nuxt-link to="/signin" class="btn btn-outline-light" v-if="!_loggedIn"
              >ลงชื่อเข้าใช้</nuxt-link
            >
          </template>
          <template v-else>
            <button
              @click="signout"
              class="btn btn-outline-light"
              v-if="$route.path.includes('/account')"
              >ออกจากระบบ</button
            >
            <div  v-if="!$route.path.includes('/account')" class="dropdown account-selector" >
              <div class="dropdown-toggle btn btn-outline-light" type="button" id="dropdownFilterAccountMenu" data-bs-toggle="dropdown" aria-expanded="false">
                My Account
              </div>
              <ul class="dropdown-menu" aria-labelledby="dropdownFilterAccountMenu">
                <li class="dropdown-item"><nuxt-link to="/account">Profile</nuxt-link></li>
                <li class="dropdown-item"><nuxt-link to="/ticket">Ticket</nuxt-link></li>
              </ul>
            </div>
          </template>
        </div>
        <div
          class="_fs-5 _dp-n-md _cl-white _cs-pt"
          @click="mobileNav = !mobileNav"
        >
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
    navLinks: [
      {
        label: 'หน้าแรก',
        path: '/'
      },
      {
        label: 'คอนเสิร์ต',
        path: '/event'
      },
      {
        label: 'เกี่ยวกับเรา',
        path: '/about'
      },
      {
        label: 'ข่าวสาร & โปรโมชั่น',
        path: '/news'
      },
      {
        label: 'ติดต่อเรา',
        path: '/contact'
      }
    ]
  }),
  computed: {
    _loggedIn() {
      return this.$store.state.auth.loggedIn
    }
  },
  methods: {
    async signout() {
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

nav {
  background: transparent;
  position: absolute;
  width: 100%;
  height: 105px;
  top: 0;
  left: 0;
  z-index: 15;

  @media screen and (max-width: $md) {
    height: 60px;
    background: #063f48;
  }

  sl-button::part(base) {
    @media screen and (max-width: $md) {
      // font-size: 13px;
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

    a {
      display: block;
    }

    @media screen and (max-width: $md) {
      margin-left: auto;
      margin-right: auto;
      width: 68px;
    }

    img {
      width: 100%;
      height: auto;
    }
  }

  .button-wrapper {
    a {
      margin-right: 24px;
      transition: 0.3s;

      &:not(.btn) {
        color: #fff;
        opacity: 0.5;
      }

      // &.btn {
      //   opacity: 1;
      //   color: inherit !important;
      // }

      &.nuxt-link-exact-active,
      &:hover {
        opacity: 1;
        transition: 0.3s;
      }
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

.account-selector {
  a {
    color: #000 !important;
    user-select: none;
    opacity: 1 !important;
  }
}
</style>
