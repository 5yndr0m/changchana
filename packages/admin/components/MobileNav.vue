<template>
  <nav>
    <div class="mobile-navigation" :class="{ '-active': active }">
      <div class="close" @click="active = false">
        <i class="fas fa-times"></i>
      </div>
      <div class="content">
        <ul>
          <li
            v-for="(val, i) in _navLinks"
            :key="`navLink-${i}`"
            :class="{
              '-w-sub': val.submenu && $route.path.includes(val.keyword),
            }"
            @click="active = false"
          >
            <nuxt-link class="link-w-icon" :to="val.path" v-if="!val.submenu">
              <div class="link-icon">
                <i class="fas" :class="[`fa-${val.icon}`]"></i>
              </div>
              <span v-html="val.label"></span>
            </nuxt-link>

            <div v-else>
              <h5 class="_mgt-16px _mgbt-16px" v-html="val.label"></h5>
              <ul>
                <li v-for="(sub, s) in val.submenu" :key="`submenu-${s}`">
                  <nuxt-link class="link-w-icon" :to="sub.path">
                    <div class="link-icon">
                      <i class="fas" :class="[`fa-${sub.icon}`]"></i>
                    </div>
                    <span v-html="sub.label"></span>
                  </nuxt-link>
                </li>
              </ul>
            </div>
          </li>
          <li class="_pdv-12px _pdh-16px">
            <v-sl-button type="danger" class="_w-100pct" @click="signout()">
              <i class="fas fa-door-open"></i>
              <span>ออกจากระบบ</span>
            </v-sl-button>
          </li>
        </ul>
      </div>
      <div class="clickable" @click="active = false"></div>
    </div>

    <div class="container">
      <div class="_dp-f _jtfct-spbtw _alit-ct">
        <div class="branding">
          <h1 v-html="`${_brandname} CMS`" class="_fs-5"></h1>
          <p class="_fs-7 _fw-500">Powered by Anotter.</p>
        </div>
        <div class="hamburger" @click="active = true">
          <i class="fas fa-bars"></i>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data: () => ({
    active: false,
  }),
  computed: {
    _navLinks() {
       if (
        this.$auth.user &&
        this.$auth.user.role.type === "staff_atk"
      ) {
        return this.$store.state.staffATKMenus;
      }
      return this.$store.state.navLinks;
    },
    _brandname() {
      return this.$store.state.brandname;
    },
  },
  methods: {
    async signout() {
      // this.__showToast({
      //   title: 'Signout Successfully',
      //   status: 'success',
      // })
      await this.$auth.logout();
      this.__showToast({
        type: "success",
        title: "Signout Successfully",
        message: "Redirecting you to signin",
      });
      // this.$router.push('/signin')
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/styles/variables";

nav {
  padding-top: 12px;
  padding-bottom: 12px;
  background: #fff;
  border-bottom: 1px solid $card-border-color;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  box-shadow: $card-shadow;
  height: 53px;

  .branding {
    flex: 1;

    img {
      width: 86px;
      height: auto;
    }
  }

  .hamburger {
    font-size: 17px;
    color: $paragraph-text-color;
    cursor: pointer;
  }
}

.mobile-navigation {
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;

  &.-active {
    pointer-events: all;

    .clickable {
      opacity: 1;
      visibility: visible;
      pointer-events: all;
      transition: 0.3s;
    }
    .content {
      opacity: 1;
      visibility: visible;
      pointer-events: all;
      transform: translate3d(-260px, 0, 0);
      transition: 0.6s;
      transform: translate3d(0, 0, 0);
    }

    .close {
      opacity: 1;
      visibility: visible;
      pointer-events: all;
      transition: 0.2s;
    }
  }

  .close {
    position: absolute;
    width: 34px;
    height: 34px;
    top: 12px;
    left: 270px;
    border-radius: 4px;
    background: $primary-color;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    cursor: pointer;
    border: 1px solid darken($primary-color, 10%);
    transition: 0.3s;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: 0.3s;

    &:hover {
      border-color: darken($primary-color, 20%);
      transition: 0.3s;
    }

    i {
      color: #fff;
      font-size: 16px;
    }
  }

  .clickable {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: 0.3s;
  }

  .content {
    position: relative;
    z-index: 10;
    width: 260px;
    background: #fff;
    height: 100%;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translate3d(-260px, 0, 0);
    transition: 0.6s;
    padding-top: 8px;
    overflow-y: scroll;
    padding-bottom: 128px;

    > ul {
      list-style: none;
      margin: 0;

      li {
        margin-top: 8px;
        margin-bottom: 8px;
        padding-left: 26px;
        padding-right: 26px;
        color: #7b7e9a;
        transition: opacity 0.3s;
        cursor: pointer;
        font-weight: bold;
        font-size: 1rem;

        ul {
          list-style: none;
        }

        a {
          padding: 12px 14px;
          color: $paragraph-text-color;
          position: relative;
          margin-left: -12px;
          display: flex;
          align-items: center;
          text-decoration: none;

          &.nuxt-link-active {
            background: rgba($primary-color, 0.15);
            border-radius: 5px;
            color: $primary-color;

            i {
              color: $primary-color;
            }
          }
        }

        h5 {
          color: $primary-color;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 12px;
        }

        li {
          padding-left: 0;
          padding-right: 0;
        }

        &:last-of-type {
          margin-bottom: 0;
        }

        .link-w-icon {
          color: inherit;
          text-decoration: none;
          display: flex;
          align-items: center;

          .link-icon {
            width: 24px;
            margin-left: -4px;
            text-align: center;
            margin-right: 12px;
            color: #cbd9e6;
          }
        }
      }
    }
  }
}
</style>
