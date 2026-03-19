<template>
  <div>
    <AppHeader
      class="_dp-n-md"
      :left="{
        text: 'Back',
        icon: 'chevron-left',
        callback: () => $router.push('/account'),
      }"
    />

    <!-- Desktop -->
    <div class="content" v-if="_user">
      <div class="container" :style="{ maxWidth: `921px` }">
        <div class="card _w-100pct">
          <div class="card-body">
            <div class="account-settings">
              <div class="left">
                <TextHeading title="Account Setting" />
                <ProfileImage
                  class="_mgv-32px"
                  :loading="profileImageLoading"
                  @updateProfileImage="handleProfileImage"
                />
                <div class="setting-items-wrapper">
                  <div
                    class="setting-item"
                    :class="{ '-active': $route.path === '/account/name' }"
                    @click="$router.push('/account/name')"
                  >
                    <h4>Name</h4>
                    <div class="_dp-f _alit-ct" v-if="_user.first_name && _user.last_name">
                      <p>
                        <span
                          v-html="
                            _user.first_name[0].toUpperCase() +
                            _user.first_name.slice(1)
                          "
                        ></span>
                        <span
                          v-html="`${_user.last_name[0].toUpperCase()}.`"
                        ></span>
                      </p>
                      <i class="far fa-chevron-right _mgl-12px"></i>
                    </div>
                  </div>

                  <div
                    class="setting-item"
                    :class="{ '-active': $route.path === '/account/mobile' }"
                    @click="$router.push('/account/mobile')"
                  >
                    <h4>Mobile Number</h4>
                    <div class="_dp-f _alit-ct">
                      <p v-html="_user.phone"></p>
                      <i class="far fa-chevron-right _mgl-12px"></i>
                    </div>
                  </div>

                  <div
                    class="setting-item"
                    :class="{ '-active': $route.path === '/account/email' }"
                    @click="$router.push('/account/email')"
                  >
                    <h4>Email</h4>
                    <div class="_dp-f _alit-ct">
                      <p v-html="_user.email"></p>
                      <i class="far fa-chevron-right _mgl-12px"></i>
                    </div>
                  </div>

                  <div
                    class="setting-item"
                    :class="{ '-active': $route.path === '/account/password' }"
                    @click="$router.push('/account/password')"
                  >
                    <h4>Password</h4>
                    <div class="_dp-f _alit-ct">
                      <p>เปลี่ยนรหัสผ่าน</p>
                      <i class="far fa-chevron-right _mgl-12px"></i>
                    </div>
                  </div>

                  <div class="setting-item -no-hover">
                    <h4>Birthdate</h4>
                    <div class="_dp-f _alit-ct">
                      <p
                        v-html="$moment(_user.birthdate).format('YYYY-MM-DD')"
                      ></p>
                    </div>
                  </div>
                </div>

                <a
                  v-show="isIOS"
                  href="chongchana://chongjaroen.com/"
                  class="btn btn-primary _w-100pct _mgt-32px btn-goto-app"
                  >Go to Application</a
                >

                <a
                  v-show="isAndroid"
                  href="https://play.google.com/store/apps/details?id=com.chongjaroen.app"
                  class="btn btn-primary _w-100pct _mgt-32px btn-goto-app"
                  >Go to Application</a
                >
                <button class="logout _mgt-32px _cs-pt" @click="signout">
                  <span>ออกจากระบบ</span>
                </button>
              </div>
              <div class="right">
                <slot name="desktop" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile -->
    <div class="_mgv-32px _dp-n-md _bgcl-white">
      <div class="container">
        <slot name="mobile" />
      </div>
    </div>
  </div>
</template>

<script>
import ProfileImage from "~/components/ProfileImage";

export default {
  components: {
    ProfileImage,
  },
  layout: "w_nav",
  computed: {
    _user() {
      let user = this.$store.state.auth.user;
      return user ? user : null;
    },
  },
  data: () => ({
    profileImageLoading: false,
    isIOS: false,
    isAndroid: false,
  }),
  methods: {
    async signout() {
      this.__showToast({
        title: "Signout Successfully",
        description: "Successfully signing you out",
        type: "primary",
      });
      await this.$auth.logout();
      this.$router.push("/signin");
    },
    async handleProfileImage(files) {
      this.profileImageLoading = true;
      await this.__changeProfileImage(files);
      this.profileImageLoading = false;
    },
  },
  mounted() {
    const { userAgent } = navigator;
    this.isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    this.isAndroid = /Android/i.test(userAgent);
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/styles/variables";

.content {
  width: 100%;
  height: auto;
  min-height: 90vh;
  padding-top: 100px;
  padding-bottom: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  // background-image: url('~assets/images/bg.jpg');
  background: linear-gradient(to bottom, rgba(#063f48, 1), rgba(#063f48, 0) 14%),
    url("~assets/images/bg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media screen and (max-width: $md) {
    min-height: initial;
    display: none;
  }

  > div {
    width: 100%;
    // max-width: 600px;
  }
}

sl-card::part(base) {
  overflow: hidden;
  position: relative;
  border: none;
  // padding-top: 16px;
  padding: 0;
}

sl-card::part(body) {
  padding: 0;
}

.card {
  overflow: hidden;
  position: relative;

  .card-body {
    padding: 0;
  }
}

.account-settings {
  display: flex;

  .left {
    flex: 0 0 42%;
    background: #fff;
    padding-top: 56px;
    padding-bottom: 56px;
    box-shadow: 0px 10px 20px rgba(6, 63, 72, 0.1);
    position: relative;
    z-index: 20;

    .setting-items-wrapper {
      .setting-item {
        border-top: 1px solid #e2e2e2;
        padding-top: 12px;
        padding-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 32px;
        padding-right: 32px;
        transition: 0.3s;
        cursor: pointer;

        &.-no-hover {
          cursor: default;

          &:hover {
            background: transparent;
            transition: 0.3s;
          }
        }

        &.-active {
          background: rgba(#1797ad, 0.08);
          transition: 0.3s;
        }

        &:hover {
          background: rgba(#1797ad, 0.08);
          transition: 0.3s;
        }

        p {
          color: #666;
        }

        &:last-of-type {
          border-bottom: 1px solid #e2e2e2;
        }
      }
    }

    .logout {
      display: block;
      text-align: center;
      font-weight: bold;
      font-size: 16px;
      color: #cb2731;
      background: transparent;
      border: none;
      width: 100%;
    }
  }

  .right {
    flex: 0 0 58%;
    background: #fafafa;
    padding: 56px 32px;
    box-sizing: border-box;
  }

  .btn-goto-app {
    max-width: 300px;
    margin: 0 auto;
    display: block;
  }
}
</style>
