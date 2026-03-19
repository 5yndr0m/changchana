<template>
  <footer>
    <div class="container">
      <div class="row _alit-fe" v-if="_footer">
        <div class="col-md-6 _mgbt-0px-md _mgbt-16px">
          <div class="branding _mgbt-12px">
            <img src="~assets/images/cj_logo.svg" alt="" />
          </div>
          <p class="_tal-l-md _tal-ct">
            Groovejaroen Co., Ltd.<br />
            <span v-html="_footer.address"></span>
          </p>
        </div>
        <div class="col-md-6">
          <div class="social _dp-f _jtfct-fe-md _jtfct-ct _alit-ct">
            <a
              :href="val.url ? val.url : '#'"
              v-for="(val, i) in _footer.socials"
              :key="`social-${i}`"
            >
              <i class="fab" :class="[`fa-${val.icon}`]"></i>
            </a>
          </div>
          <ul class="_lst-n _dp-f _jtfct-fe-md _jtfct-ct _pdv-12px">
            <li>
              <nuxt-link to="/terms-and-conditions">
                Terms and Condition</nuxt-link
              >
            </li>
          </ul>
          <p class="_tal-r-md _tal-ct">
            Copyright 2021 Chongjaroen Groove. All Right Reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    _footer() {
      if (this.$store.state.settings) {
        return this.$store.state.settings.footer
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

footer {
  background: #000;
  color: #fff;
  padding: 16px 0;

  @media screen and (max-width: $md) {
    padding: 40px 0;
  }

  .branding {
    width: 95px;
    height: auto;

    @media screen and (max-width: $md) {
      margin-left: auto;
      margin-right: auto;
    }

    img {
      width: 100%;
      height: auto;
    }
  }

  p,
  li {
    font-size: 12px;
    font-weight: 600;
  }

  .social {
    a {
      color: inherit;
      margin-right: 16px;

      &:last-of-type {
        margin-right: 0;
      }
    }
    
    i {
      margin-right: 24px;

      &:last-of-type {
        margin-right: 0;
      }
    }
  }

  ul {
    li {
      color: #fff;
      margin-right: 24px;

      a {
        color: inherit;
        text-decoration: none;
      }

      &:last-of-type {
        margin-right: 0;
      }
    }
  }
}
</style>
