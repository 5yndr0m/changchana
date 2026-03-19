<template>
  <div class="collapse" :class="{ '-active': _active }">
    <div class="collapse-header">
      <div class="_dp-f _f-1">
        <div class="_dp-f _alit-ct _cs-pt" @click="toggleCollapse(!_active)">
          <div class="collapse-arrow">
            <i class="fas fa-chevron-right"></i>
          </div>
          <h4
            class="_fs-6 _mgl-12px"
            v-html="title.length < 20 ? title : title.slice(0, 20) + '...'"
          ></h4>
        </div>
      </div>
      <div class="_dp-f _alit-ct">
        <div v-if="!readonly"
          @click="removeCollapse()"
          class="collapse-icon"
          :class="{ '_mgr-12px': !readonly && drag }"
        >
          <i class="fas fa-trash _fs-7"></i>
        </div>
        <div class="collapse-icon -drag _opct-70" v-if="!readonly &&  drag">
          <i class="fas fa-grip-vertical"></i>
        </div>
      </div>
    </div>
    <div class="collapse-body" ref="collapseBody">
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    drag: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: null,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    showCollapse: false,
  }),
  computed: {
    _active() {
      if (this.active !== null) {
        return this.active
      } else {
        return this.showCollapse
      }
    },
  },
  watch: {
    _active(newVal) {
      let target = this.$refs.collapseBody
      if (!newVal) target.style.overflow = 'hidden'
    }
  },
  methods: {
    toggleCollapse(status) {
      let target = this.$refs.collapseBody
      if (target) {
        // console.log('target', target)

        if (this.active !== null) {
          this.$emit('toggle', status)
        } else {
          this.showCollapse = status
        }

        if (status) {
          // target.style.height = `${target.scrollHeight}px`
          setTimeout(() => (target.style.overflow = 'visible'), 400)
        } else {
          // target.style.height = '0px'
          target.style.overflow = 'hidden'
        }
      }
    },
    removeCollapse() {
      this.$emit('remove')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.collapse {
  // border: 1px solid $card-border-color;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: $card-shadow;

  > .collapse-header {
    padding: 6px 12px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // cursor: pointer;
    // border-top-left-radius: 6px;
    // border-top-right-radius: 6px;

    .collapse-arrow {
      font-size: 15px;
      line-height: 15px;
      transition: 0.3s;
    }

    .collapse-icon {
      font-size: 15px;
      line-height: 15px;
      transition: 0.3s;

      &.-drag {
        font-size: 10px;
      }
    }

    .collapse-drag-icon {
      font-size: 10px;
      line-height: 10px;
    }
  }

  > .collapse-body {
    background: #fff;
    max-height: 0;
    transition: max-height 0.35s;
    box-sizing: border-box;
    overflow: hidden;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;

    > div {
      // border-top: 1px solid #bcc3ce;
      border-top: 1px solid #e2e2e2;
      padding: 12px;
    }
  }

  &.-active {
    overflow: visible;

    > .collapse-header {
      .collapse-arrow {
        transform: rotate(90deg);
        transition: 0.3s;
      }
    }
    > .collapse-body {
      max-height: 250rem;
      transition: max-height 0.35s;
    }
  }
}
</style>
