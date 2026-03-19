<template>
  <div class="_mgbt-0px-md _mgbt-64px">
    <!-- Header and Actions -->
    <section class="_mgbt-24px">
      <div class="_dp-f-md _jtfct-spbtw _alit-ct">
        <div class="_fs-3-md _fs-4 _tal-l-md _tal-ct ">
          <i v-if="linkBack" class="fas fa-chevron-left icon-back" @click="back"></i>
          <h1 class="_dp-il" v-html="title"></h1>
          <span v-if="customLink.length > 0" class="_mgl-8px header-custom-link">[
            <span class="wrapper-link" v-for="(link, i) in customLink" :key="`link-${i}`">
              <nuxt-link :to="`${link.path}`">{{link.label}}</nuxt-link>
            </span>
          ]</span>
        </div>
        <div class="_dp-f-md _dp-n _alit-ct _jtfct-ct" v-if="!readonly">
          <template v-if="!create">
            <v-sl-button
              type="danger"
              @click="$emit('delete')"
              v-html="__getTerm('remove')"
              v-if="!singleton && !disableDelete"
              class="_mgr-4px"
            ></v-sl-button>
            <v-sl-button
              type="primary"
              @click="$emit('save')"
              v-html="__getTerm('save')"
            ></v-sl-button>
          </template>
          <v-sl-button
            type="primary"
            v-else
            @click="$emit('create')"
            v-html="__getTerm('create')"
          ></v-sl-button>
        </div>
      </div>
    </section>
    <!-- End of Header and Actions -->

    <!-- Mobile Actions Bar -->

    <section class="mobile-actions" v-if="!readonly">
      <div class="container">
        <div class="_dp-f _alit-ct _jtfct-fe">
          <template v-if="!create">
            <v-sl-button
              type="danger"
              class="_mgr-4px"
              @click="$emit('delete')"
              v-html="__getTerm('remove')"
              v-if="!singleton && !disableDelete"
            ></v-sl-button>
            <v-sl-button
              type="primary"
              @click="$emit('save')"
              v-html="__getTerm('save')"
            ></v-sl-button>
          </template>
          <v-sl-button
            type="primary"
            v-else
            @click="$emit('create')"
            v-html="__getTerm('create')"
          ></v-sl-button>
        </div>
      </div>
    </section>

    <!-- End of Mobile Actions Bar -->

    <section>
      <div class="row main-area-row">
        <div :class="[sidebarFields ? 'col-md-8' : 'col-md-12']">
          <template v-if="fields">
            <sl-card>
              <form>
                <div class="row">
                  <div
                    v-for="(mainField, mf) in fields"
                    :key="`field-${mf}`"
                    :class="[
                      __determineSize(mainField.size),
                      mf === fields.length - 1 ? '' : '_mgbt-16px',
                    ]"
                  >
                    <!-- Normal Fields -->

                    <template v-if="!mainField.group && !mainField.dynamic">
                      <!-- Non-Repeatable -->

                      <template v-if="!mainField.repeatable">
                        <FieldGroup
                          :label="mainField.label"
                          :value="value[mainField.key]"
                          @input="value => handleInput(value, mainField.key)"
                          :type="mainField.type"
                          :contentType="mainField.contentType"
                          :labelKey="mainField.labelKey"
                          :valueKey="mainField.valueKey"
                          :disabled="readonly ? true : mainField.disabled"
                          :options="mainField.options"
                          :switchLabel="mainField.switchLabel"
                        />
                      </template>

                      <template v-else>
                        <RepeatableField
                          :label="mainField.label"
                          :value="value[mainField.key]"
                          :fieldData="mainField"
                          :readonly="readonly"
                          @input="
                            (newVal, key) =>
                              handleInput(newVal, `[${mainField.key}][${key}]`)
                          "
                          @remove="
                            newVal => handleInput(newVal, `[${mainField.key}]`)
                          "
                        />
                      </template>
                    </template>

                    <!-- Nested Fields -->

                    <template v-if="mainField.group && !mainField.dynamic">
                      <div class="field-group _pdh-16px">
                        <div class="field-group-heading">
                          <h4 v-html="mainField.label"></h4>
                        </div>
                        <div class="row">
                          <div
                            v-for="(nestedField, nf) in mainField.fields"
                            :key="`field-${mf}-nested-${nf}`"
                            :class="[
                              __determineSize(nestedField.size),
                              nf === mainField.fields.length - 1
                                ? ''
                                : '_mgbt-16px',
                            ]"
                          >
                            <!-- Non-Repeatable -->

                            <template
                              v-if="
                                nestedField.group && !nestedField.repeatable
                              "
                            >
                              <!-- <h1>GHe</h1>
                              <h2>{{ nestedField }}</h2> -->
                              <div class="field-group _pdh-16px">
                                <div class="field-group-heading">
                                  <h4 v-html="nestedField.label"></h4>
                                </div>

                                <div class="row">
                                  <div
                                    v-for="(groupNestedField,
                                    gnf) in nestedField.fields"
                                    :key="`field-${nf}-nested-${gnf}`"
                                    :class="[
                                      __determineSize(groupNestedField.size),
                                      gnf === nestedField.fields.length - 1
                                        ? ''
                                        : '_mgbt-16px',
                                    ]"
                                  >
                                    <FieldGroup
                                      :label="groupNestedField.label"
                                      :value="
                                        _.get(
                                          value,
                                          `[${mainField.key}][${nestedField.key}][${groupNestedField.key}]`
                                        )
                                      "
                                      @input="
                                        newVal =>
                                          handleInput(
                                            newVal,
                                            `[${mainField.key}][${nestedField.key}][${groupNestedField.key}]`
                                          )
                                      "
                                      :type="groupNestedField.type"
                                      :contentType="
                                        groupNestedField.contentType
                                      "
                                      :labelKey="groupNestedField.labelKey"
                                      :valueKey="groupNestedField.valueKey"
                                      :disabled="
                                        readonly
                                          ? true
                                          : groupNestedField.disabled
                                      "
                                      :options="groupNestedField.options"
                                      :switchLabel="
                                        groupNestedField.switchLabel
                                      "
                                    />
                                  </div>
                                </div>
                              </div>
                            </template>

                            <template
                              v-if="
                                !nestedField.repeatable && !nestedField.group
                              "
                            >
                              <FieldGroup
                                :label="nestedField.label"
                                :value="
                                  _.get(
                                    value,
                                    `[${mainField.key}][${nestedField.key}]`
                                  )
                                "
                                @input="
                                  newVal =>
                                    handleInput(
                                      newVal,
                                      `[${mainField.key}][${nestedField.key}]`
                                    )
                                "
                                :type="nestedField.type"
                                :contentType="nestedField.contentType"
                                :labelKey="nestedField.labelKey"
                                :valueKey="nestedField.valueKey"
                                :disabled="
                                  readonly ? true : nestedField.disabled
                                "
                                :options="nestedField.options"
                                :switchLabel="nestedField.switchLabel"
                              />
                            </template>

                            <template
                              v-if="
                                nestedField.repeatable && !nestedField.group
                              "
                            >
                              <RepeatableField
                                :label="nestedField.label"
                                :value="
                                  _.get(
                                    value,
                                    `[${mainField.key}][${nestedField.key}]`
                                  )
                                "
                                :fieldData="nestedField"
                                :readonly="readonly"
                                @input="
                                  (newVal, key) =>
                                    handleInput(
                                      newVal,
                                      `[${mainField.key}][${nestedField.key}][${key}]`
                                    )
                                "
                                @remove="
                                  newVal =>
                                    handleInput(
                                      newVal,
                                      `[${mainField.key}][${nestedField.key}]`
                                    )
                                "
                              />
                            </template>
                          </div>
                        </div>
                      </div>
                    </template>

                    <template v-if="mainField.dynamic">
                      <DynamicField
                        :label="mainField.label"
                        :value="value[mainField.key]"
                        :fieldData="mainField"
                        :readonly="readonly"
                        @input="
                          (newVal, key) =>
                            handleInput(
                              newVal,
                              `[${mainField.key}]${key ? key : ''}`
                            )
                        "
                        @add="
                          (newVal, index) =>
                            handleInput(newVal, `[${mainField.key}][${index}]`)
                        "
                        @remove="
                          newVal => handleInput(newVal, `[${mainField.key}]`)
                        "
                      />
                    </template>
                  </div>
                </div>
              </form>
            </sl-card>
          </template>
        </div>
        <div v-if="sidebarFields && sidebarFields.length" class="col-md-4 _mgbt-0px-md _mgbt-16px">
          <sl-card>
            <form>
              <div
                class="_mgbt-12px"
                v-for="(sidebarField, sf) in sidebarFields"
                :key="`sidebar-field-${sf}`"
              >
                <template v-if="sidebarField.repeatable && !sidebarField.group">
                  <RepeatableField
                    :label="sidebarField.label"
                    :value="value[sidebarField.key]"
                    :fieldData="sidebarField"
                    :readonly="readonly"
                    @input="
                      (newVal, key) =>
                        handleInput(newVal, `[${sidebarField.key}][${key}]`)
                    "
                    @remove="
                      newVal => handleInput(newVal, `[${sidebarField.key}]`)
                    "
                  />
                </template>

                <FieldGroup
                  v-else
                  :label="sidebarField.label"
                  :value="value[sidebarField.key]"
                  @input="value => handleInput(value, sidebarField.key)"
                  :type="sidebarField.type"
                  :contentType="sidebarField.contentType"
                  :labelKey="sidebarField.labelKey"
                  :valueKey="sidebarField.valueKey"
                  :disabled="readonly ? true : sidebarField.disabled"
                  :options="sidebarField.options"
                  :switchLabel="sidebarField.switchLabel"
                />
              </div>
            </form>
          </sl-card>

          <!-- Internationalize 🌏 -->

          <sl-card
            v-if="_currentLocale && !noLocalization"
            class="locale-card"
            :class="{ '_mgt-24px': sidebarFields.length }"
          >
            <label for="">
              <i class="far fa-globe"></i>
              <span>Locale</span>
            </label>
            <template v-if="_locales">
              <div class="row content-lang-switcher">
                <div
                  class="col-md-6 _mgbt-12px"
                  v-for="(val, i) in _locales"
                  :key="`copy-locale-${i}`"
                >
                  <div
                    class="lang-group"
                    :class="{ '-active': val.value === _currentLocale }"
                  >
                    <client-only>
                      <Flag
                        :code="val.flag"
                        gradient="real-linear"
                        hasDropShadow
                        size="s"
                      />
                    </client-only>
                    <h5 class="_fs-7 _mgt-8px" v-html="val.label"></h5>
                    <div
                      class="icon-wrapper"
                      :class="{ '-disabled': $route.path.includes('/create')}"
                      v-if="val.value !== _currentLocale"
                    >
                      <div
                        class="icon"
                        v-if="!_localizations.includes(val.value)"
                      >
                        <sl-tooltip content="Create">
                          <i
                            class="fas fa-plus"
                            @click="$emit('changeLocale', val.value)"
                          ></i>
                        </sl-tooltip>
                      </div>
                      <div class="icon" v-else>
                        <sl-tooltip content="Edit">
                          <i
                            class="fas fa-pencil"
                            @click="$emit('changeLocale', val.value)"
                          ></i>
                        </sl-tooltip>
                      </div>
                      <div class="icon" @click="$emit('copyLocale', val.value)" v-if="_localizations.includes(val.value)">
                        <sl-tooltip content="Sync">
                          <i class="fas fa-exchange"></i>
                        </sl-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </sl-card>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import FieldGroup from '~/components/form/FieldGroup'
import RepeatableField from '~/components/form/RepeatableField'
import DynamicField from '~/components/form/DynamicField'

export default {
  components: {
    FieldGroup,
    RepeatableField,
    DynamicField,
  },
  props: {
    // For Header
    title: {
      type: String,
      default: null,
    },
    linkBack: {
      type: String,
      default: null,
    },
    create: {
      type: Boolean,
      default: false,
    },
    disableDelete: {
      type: Boolean,
      default: false,
    },
    singleton: {
      type: Boolean,
      default: false,
    },
    sidebarFields: {
      type: Array,
      default: null,
    },
    // For Field Display
    fields: {
      type: Array,
      default: null,
    },
    value: {
      type: Object,
      default: {},
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    noLocalization: {
      type: Boolean,
      default: false,
    },
    customLink: {
      type: Array,
      default: [],
    }
  },
  computed: {
    _fields() {
      return this.fields.filter(val => !val.group)
    },
    _groupFields() {
      return this.fields.filter(val => val.group)
    },
    // Internationalize 🌏
    _currentLocale() {
      return this.$store.state.currentLocale
    },
    _locales() {
      if (this._currentLocale && !this.noLocalization) {
        return this.$store.state.locales
        // let localizations = this.value.localizations.map(val => val.locale)

        // return this.$store.state.locales.filter(val =>
        //   localizations.includes(val.value)
        // )
      }
    },
    _localizations() {
      if (this._currentLocale && !this.noLocalization) {
        return this.value.localizations ? this.value.localizations.map(val => val.locale) : []
      }
    },
  },
  methods: {
    handleInput(value, key) {
      // console.log(value, key)
      let obj = JSON.parse(JSON.stringify(this.value))
      this._.set(obj, key, value)
      this.$emit('update', obj)
      return
    },
    back() {
      this.$router.push(`${this.linkBack}`);
    }
  },
  mounted() {
    // console.log(this.fields)
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.main-area-row {
  @media screen and (max-width: $md) {
    display: flex;
    flex-direction: column-reverse;
  }

  .main-card::part(body) {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
}

.mobile-actions {
  display: none;
  position: fixed;
  width: 100%;
  height: auto;
  padding-top: 10px;
  padding-bottom: 10px;
  box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  bottom: 0;
  left: 0;
  z-index: 90;

  @media screen and (max-width: $md) {
    display: block;
  }
}

.locale-card {
  &::part(body) {
    padding-bottom: 12px !important;
  }

  .content-lang-switcher {
    margin-left: -4px !important;
    margin-right: -4px !important;

    .col-md-6 {
      padding-left: 4px !important;
      padding-right: 4px !important;
    }

    .lang-group {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: 100%;
      background-color: #fafafa;
      border: 1px solid #e2e2e2;
      padding: 12px 16px;
      border-radius: 5px;

      &.-active {
        background-color: Rgb(var(--sl-color-primary-500) / 10%);
        border-color: $primary-color;
      }

      .icon-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 8px;

        &.-disabled {
          opacity: .45;
        }

        .icon {
          font-size: 11px;
          margin-left: 4px;
          margin-right: 4px;
          color: $primary-color;
          cursor: pointer;
          transition: 0.3s;

          &:hover {
            transform: scale(1.1);
            transition: 0.3s;
          }
        }
      }
    }
  }
}
.icon-back {
  vertical-align: 4px;
  cursor: pointer;
}
.header-custom-link {
  vertical-align: 2px;
  font-size: 0.7em;
}
.wrapper-link:not(:last-child):after {
    content: "|";
    margin: 0 4px;
    color: #272838;
}
</style>
