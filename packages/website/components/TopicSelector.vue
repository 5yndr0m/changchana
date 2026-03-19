<template>
  <div class="col-md-12 _pdl-0px _pdr-0px _pdbt-4px">
    <h1 v-if="title" class="_fs-2-md _fs-3 _mgbt-16px _tal-l-md _tal-l">{{title}}</h1>
    <div v-else class="dropdown event-selector" >
      <div class="dropdown-toggle" type="button" id="dropdownFilterEvent" data-bs-toggle="dropdown" aria-expanded="false">
        <h1 class="_fs-4 _mgbt-16px _tal-l under-line-cjr">{{options[currentValue].label}} <i class="fas fa-chevron-down"></i></h1>
      </div>
      <ul class="dropdown-menu _fs-5" aria-labelledby="dropdownFilterEvent">
        <li v-for="(option, index) in options" class="dropdown-item" @click="() => onChange(option.value, index)" :key="index">{{ option.label }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: [], // { value: string, label: string }
    },
    title: {
      type: String,
    }
  },
  data () {
    return {
      currentValue: 0, 
    };
  },
  methods: {
    onChange(value, index) {
      this.currentValue = index;
      this.$emit('onChange', value);
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.event-selector {
  & :deep(.dropdown-toggle) {
    cursor: pointer;

    &::after {
      display: none;
    }

    i {
      opacity: 0.6;
    }
  }
}

.under-line-cjr {
  &:after{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    height: 1em;
    width: 32px;
    border-bottom: 3px solid #1797AD;
    margin-top: 15px;
  }
}
</style>
