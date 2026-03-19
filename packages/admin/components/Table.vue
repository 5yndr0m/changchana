<template>
  <div class="table-wrapper">
    <sl-dialog label="Delete Confirmation" ref="confirmTableDelete" class="dialog-overview">
      Please click the button below to confirm deletion of the data
      <sl-button slot="footer" type="primary" @click="confirmRemove">Remove</sl-button>
    </sl-dialog>

    <table>
      <thead>
        <th
          v-for="(val, i) in columns"
          :key="`column-${i}`"
          :class="{
            '_tal-l': val.align === 'left',
            '_tal-ct': val.align === 'center',
            '_tal-r': val.align === 'right',
          }"
          @click="!val.disabledSort ?
            $emit('changeSort', {
              key: val.key,
              direction: sort.direction === 'DESC' ? 'ASC' : 'DESC',
            }) : null
          "
        >
          <span v-html="val.label"></span>
          <template v-if="sort">
            <i
              class="fas _mgl-8px"
              v-if="sort.key === val.key"
              :class="{
                'fa-caret-down': sort.direction === 'DESC',
                'fa-caret-up': sort.direction === 'ASC',
              }"
            ></i>
          </template>
        </th>
        <slot name="head" />
        <th class="actions" v-if="actions && !$scopedSlots.actions"></th>
      </thead>
      <tbody>
        <tr v-for="(val, i) in rows" :key="`row-${i}`">
          <td
            v-for="(col, r) in columns"
            :key="`row-${i}-${r}`"
            :class="{
              '_tal-l': col.align === 'left',
              '_tal-ct': col.align === 'center',
              '_tal-r': col.align === 'right',
            }"
          >
            <template v-if="col.displayAsTag">

              <!-- Etc. -->

              <sl-tag
                v-if="
                  col.key !== 'published_at' &&
                    col.key !== 'special' &&
                    col.key !== 'visibility'
                "
                type="warning"
                size="small"
              >
                <span
                  v-html="
                    (col.capitalize
                      ? __capitalize(_.get(val, col.key))
                      : _.get(val, col.key)) || '-'
                  "
                ></span>
              </sl-tag>

              <!-- Published At -->

              <sl-tag
                v-if="col.key === 'published_at'"
                type="warning"
                size="small"
              >
                <span
                  v-html="
                    _.get(val, col.key)
                      ? $moment(_.get(val, col.key)).format('MMMM Do YYYY, h:mm:ss a')
                      : '-'
                  "
                ></span>
              </sl-tag>

              <!-- Visibility -->

              <sl-tag
                v-if="col.key === 'visibility'"
                :type="_.get(val, 'published_at') ? 'success' : 'warning'"
                size="small"
              >
                <span
                  v-html="_.get(val, 'published_at') ? 'Published' : 'Draft'"
                ></span>
              </sl-tag>

              <!-- Special -->

              <sl-tag
                v-if="col.key === 'special'"
                type="warning"
                size="small"
              >
                <span v-html="_.get(val, col.key) ? 'Yes' : 'No'"></span>
              </sl-tag>
            </template>
            <template v-else>
              <span
                v-html="
                  (col.renderValue !== undefined 
                    ? renderValue(_.get(val, col.key), col.renderValue) 
                    : col.capitalize
                    ? __capitalize(_.get(val, col.key))
                    : getValueFromConfig(val, col)) || '-'
                "
                v-if="
                  col.key !== 'published_at' &&
                    col.key !== 'special' &&
                    col.key !== 'visibility'
                "
              ></span>
              <span
                v-html="
                  _.get(val, col.key)
                    ? $moment(_.get(val, col.key)).format('MMMM Do YYYY, h:mm:ss a')
                    : '-'
                "
                v-if="col.key === 'published_at'"
              ></span>
              <span
                v-html="_.get(val, 'published_at') ? 'Published' : 'Draft'"
                v-if="col.key === 'visibility'"
              ></span>
              <span
                v-html="_.get(val, col.key) ? 'Yes' : 'No'"
                v-if="col.key === 'special'"
              >
              </span>
            </template>
          </td>
          <slot name="content" :row="val" :index="i" />
          <td class="actions" v-if="actions">
            <template v-if="!$scopedSlots.actions">
              <div class="_dp-f _alit-ct _jtfct-ct">
                <div class="_fs-7 _mgh-8px" v-if="actions.edit">
                  <nuxt-link :to="`${$route.path}/${val.id}`">
                    <i class="fas fa-pencil"></i>
                  </nuxt-link>
                </div>

                <div class="_fs-7 _mgh-8px" v-if="actions.view">
                  <nuxt-link :to="`${$route.path}/${val.id}`">
                    <i class="fas fa-eye"></i>
                  </nuxt-link>
                </div>

                <div
                  class="_fs-7 _mgh-8px _cs-pt"
                  @click="triggerRemove(val.id)"
                  v-if="actions.remove"
                >
                  <i class="fas fa-trash"></i>
                </div>
              </div>
            </template>
            <template v-else>
              <slot name="actions" :row="val" />
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    columns: Array,
    rows: Array,
    actions: {
      type: Object,
      default: () => ({
        edit: true,
        view: false,
        remove: true,
      }),
    },
    sort: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    removeModal: false,
    removeTarget: null,
  }),
  methods: {
    triggerRemove(id) {
      this.removeModal = true
      this.removeTarget = id
      this.$refs.confirmTableDelete.show()
    },
    cancelRemove() {
      this.removeModal = false
      this.removeTarget = null
    },
    confirmRemove() {
      this.$refs.confirmTableDelete.hide()
      this.removeModal = false
      this.$emit('delete', this.removeTarget)
    },
    renderValue(value, configs) {
      let result = value
      if (configs && configs.length > 0) {
        configs.forEach((config) => {
          if (config.condition === 'replaceStr') {
            if (typeof value === 'string' && value.indexOf(config.from) >= 0) {
              result = value.replace(config.from, config.to)
            }
          }
        })
      }
      return result
    },
    getValueFromConfig(value, configs) {
      if(configs.combindKey && typeof configs.key !== "string") {
        const data = configs.key.map(row => _.get(value, row));
        return data.join(configs.combindKey.combindWith || "");
      }
      return _.get(value, configs.key);
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.table-wrapper {
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: $card-shadow;
  border-radius: 4px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  // min-width: 600px;

  thead {
    th {
      padding: 16px 16px;
      border-bottom: 1px solid $card-border-color;
      cursor: pointer;
    }
  }

  tbody {
    tr {
      td {
        padding: 16px 16px;
        color: $paragraph-text-color;
        position: relative;
      }

      &:nth-of-type(odd) {
        td {
          background: #F7FAFC;
        }
      }
    }
  }

  .actions {
    width: 40px !important;
    color: $paragraph-text-color;
    min-width: initial;

    &:hover {
      .dropdown {
        opacity: 1;
        visibility: visible;
        pointer-events: all;
        transition: 0.3s;
      }
    }

    > div {
      a {
        color: inherit;
      }
    }
  }
}
</style>
