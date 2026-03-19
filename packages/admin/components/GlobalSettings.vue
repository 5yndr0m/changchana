<template>
  <div class="global-settings _mgbt-32px" v-if="$route.path !== '/media'">
    <div class="lang-switcher" v-if="_locales">
      <label for="">
        <i class="far fa-globe _mgr-4px"></i>
        <span>Locale</span>
      </label>
      <sl-select
        :value="_currentLocale"
        @sl-change="e => $emit('changeLocale', e.target.value)"
      >
        <sl-menu-item
          :value="val.value"
          v-for="(val, i) in _locales"
          :key="`locale-${i}`"
          v-html="val.label"
        ></sl-menu-item>
      </sl-select>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    _locales() {
      return this.$store.state.locales
    },
    _currentLocale() {
      return this.$store.state.currentLocale
    },
  },
}
</script>

<style lang="scss" scoped>
.global-settings {
  .lang-switcher {
    width: 100%;
    max-width: 200px;
  }
}
</style>