<template>
  <div :class="{ active: active }"
    class="ticket-menu _dp-f _fdrt-r _alit-ct _pdl-32px _pdv-24px _pdr-4px _mgbt-16px">
    <i class="fas _mgr-16px" :class="[`fa-${fa_icon}`]"></i>
    <div class="">
      <h3 class="name_en">{{ name_en }}</h3>
      <p class="_fs-6 name_th">{{ name_th }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
    fa_icon: {
      type: String,
      default: 'list'
    },
    name_th: {
      type: String,
      required: true,
    },
    name_en: {
      type: String,
      required: true,
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.ticket-menu {

  margin: 0 9px;
  background-color: #FFFFFF;
  border-radius: 5px;
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.03)) drop-shadow(0px 16px 32px rgba(0, 0, 0, 0.05));

  i {
    width: 48px;
    height: 48px;
    line-height: 48px;
    color: #1797AD;
    background: #1797AD19;
    text-align: center;
    border-radius: 50%;
  }

  .name_en {
    color: #000;
  }

  .name_th {
    color: #BDBDBD;
  }

  &:hover {
    background-color: #dce8ea;
    cursor: pointer;
  }

  &.active {
    color: #FFFFFF;
    background-color: #1797AD;

    i {
      color: #FFFFFF;
      background: #FFFFFF19;
    }

    .name_en,
    .name_th {
      color: #FFF;
    }
  }
}
</style>