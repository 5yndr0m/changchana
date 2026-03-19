<template>
  <aside :class="{ collapsed: isCollapsed }">
    <div class="content-area">
      <div class="branding">
        <img v-if="!isCollapsed" src="~assets/images/logo-white.svg" alt="" />
        <img v-else src="~assets/images/logo-white.svg" alt="" class="logo-small" />
        <button class="collapse-toggle" @click="toggleCollapse" :title="isCollapsed ? 'Expand' : 'Collapse'">
          <i class="fas" :class="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
        </button>
      </div>

      <div class="content">
        <ul>
          <li
            v-for="(val, i) in _navLinks"
            :key="`navLink-${i}`"
            :class="{
              '-w-sub': val.submenu && val.keyword && $route.path.includes(val.keyword),
            }"
          >
            <nuxt-link
              class="link-w-icon"
              :to="val.path"
              v-if="!val.submenu"
              :title="isCollapsed ? val.label : ''"
            >
              <div class="link-icon">
                <i class="fas" :class="[`fa-${val.icon}`]"></i>
              </div>
              <span v-if="!isCollapsed" v-html="val.label"></span>
            </nuxt-link>

            <div v-else>
              <h5
                v-if="!isCollapsed"
                class="_mgt-16px _mgbt-16px"
                v-html="val.label"
              ></h5>
              <div v-else class="menu-divider"></div>
              <ul>
                <li v-for="(sub, s) in val.submenu" :key="`submenu-${s}`">
                  <nuxt-link
                    class="link-w-icon"
                    :to="sub.path"
                    :title="isCollapsed ? sub.label : ''"
                  >
                    <div class="link-icon">
                      <i class="fas" :class="[`fa-${sub.icon}`]"></i>
                    </div>
                    <span v-if="!isCollapsed" v-html="sub.label"></span>
                  </nuxt-link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <div class="link-w-icon" @click="signout" :title="isCollapsed ? 'ออกจากระบบ' : ''">
        <div class="link-icon">
          <i class="fas fa-door-open"></i>
        </div>
        <span v-if="!isCollapsed">ออกจากระบบ</span>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      isCollapsed: false,
    };
  },
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
  mounted() {
    // Load collapse state from localStorage
    const savedState = localStorage.getItem('sideMenuCollapsed');
    if (savedState !== null) {
      this.isCollapsed = savedState === 'true';
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      // Save state to localStorage
      localStorage.setItem('sideMenuCollapsed', this.isCollapsed.toString());
    },
    async signout() {
      await this.$auth.logout();
      this.__showToast({
        type: "success",
        title: "Signout Successfully",
        message: "Redirecting you to signin",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/styles/variables";

$bg-color: #0a2e33;
$border-color: #061b1e;

aside {
  flex: 0 0 250px;
  background: $bg-color;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  transition: all 0.3s ease;

  &.collapsed {
    flex: 0 0 70px;

    .content ul li {
      padding-left: 12px;
      padding-right: 12px;
    }

    .link-w-icon {
      justify-content: center;
    }

    .branding {
      padding: 16px 12px !important;

      .logo-small {
        width: 40px !important;
      }
    }
  }

  .content-area {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;

    .branding {
      flex: 0 0 69px;
      padding: 16px 26px;
      border-bottom: 1px solid $border-color;
      position: relative;

      img {
        width: 100px;
        height: auto;
        margin-left: auto;
        margin-right: auto;
        display: block;
        transition: all 0.3s ease;
      }

      .logo-small {
        width: 40px;
      }

      .collapse-toggle {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: #fff;
        width: 28px;
        height: 28px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        i {
          font-size: 12px;
        }
      }
    }

    .content {
      flex: 1;
      padding: 12px 0 48px 0;
      overflow: hidden;
      overflow-y: scroll;
      position: relative;

      ul {
        list-style: none;
        margin: 0;

        li {
          margin-top: 8px;
          margin-bottom: 8px;
          padding-left: 26px;
          padding-right: 26px;
          color: #fff;
          cursor: pointer;
          font-weight: bold;
          font-size: 1rem;

          a {
            padding: 12px 14px;
            color: #fff;
            position: relative;
            margin-left: -12px;
            opacity: 0.4;
            transition: opacity 0.3s;

            &.nuxt-link-active,
            &:hover {
              opacity: 1;
              transition: opacity 0.3s;
            }
          }

          h5 {
            color: lighten($primary-color, 13%);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 12px;
          }

          .menu-divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
            margin: 16px 0;
          }

          li {
            padding-left: 0;
            padding-right: 0;
          }

          &:last-of-type {
            margin-bottom: 0;
          }
        }
      }
    }
  }

  .footer {
    flex: 0 0 54px;
    border-top: 1px solid $border-color;
    padding-top: 26px;
    padding-bottom: 26px;

    > div {
      color: #fff;
      font-weight: bold;
      justify-content: center;
      transition: 0.3s;
      cursor: pointer;

      &:hover {
        opacity: 1;
        transition: 0.3s;
      }
    }
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
      color: rgba(255, 255, 255, 0.7);
    }
  }
}
</style>
