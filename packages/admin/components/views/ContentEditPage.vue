<template>
  <div>
    <template v-if="formData">
      <Loading :loading="loading" />

      <!-- <GlobalSettings @changeLocale="changeLocale" /> -->

      <ContentEdit
        :create="newContent"
        :fields="fields"
        :sidebarFields="sidebarFields"
        :value="formData"
        :title="title"
        @update="(data) => (formData = { ...formData, ...data })"
        @save="save"
        @create="create"
        @delete="remove"
        :readonly="readonly"
        :disableDelete="disableDelete"
        :singleton="singleton"
        @copyLocale="copyLocale"
        @changeLocale="changeLocale"
        :noLocalization="noLocalization"
        :linkBack="linkBack"
        :customLink="customLink"
      />
    </template>
    <template v-else>
      <Loading :loading="true" :float="false" />
    </template>
  </div>
</template>

<script>
export default {
  layout: "admin",
  props: {
    title: {
      type: String,
      default: null,
    },
    fields: {
      type: Array,
      default: null,
    },
    sidebarFields: {
      type: Array,
      default: null,
    },
    initValue: {
      type: Object,
      default: null,
    },
    contentType: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    readonly: {
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
    noLocalization: {
      type: Boolean,
      default: false,
    },
    linkBack: {
      type: String,
      default: null,
    },
    customLink: {
      type: Array,
      default: [],
    }
  },
  computed: {
    _title() {
      if (this.title) {
        return this.title;
      } else {
        if (this.formData) {
          if (this.formData.name) {
            return this.formData.name;
          } else if (this.formData.title) {
            return this.formData.title;
          } else if (this.formData.id) {
            return `${this.formData.id}`;
          } else {
            return "";
          }
        }
      }
    },
    // For internalization
    _currentLocale() {
      return this.$store.state.currentLocale;
    },
  },
  data: () => ({
    loading: false,
    formData: null,
    newContent: false,
    relationData: {},
    // For internalization
    translations: null,
  }),
  methods: {
    async save() {
      this.loading = true;

      if (!this.singleton) {
        let data = {
          ...this.formData,
          published_at:
            this.formData.visibility === "null"
              ? null
              : this.formData.published_at
              ? this.formData.published_at
              : this.$moment().toISOString(),
        };

        try {
          await this.__saveContentType(
            this.contentType,
            this.$route.params.id,
            data
          );

          this.__showToast({
            type: "success",
            title: "Save Successfully",
          });

          setTimeout(() => {
            this.loading = false;
            this.$router.push(`/${this.contentType}`);
          }, 2000);
        } catch (err) {
          let message = "There is something wrong.";
          this.loading = false;

          if (err.response) {
            const {
              response: { data: errorData },
            } = err;
            if (errorData.data && errorData.data.errors) {
              const { errors } = errorData.data;
              if (typeof errors === "object" && !Array.isArray(errors)) {
                message = errors[Object.keys(errors)[0]];
              }
            } else if (errorData.message) {
              message = errorData.message;
            }
          }

          this.__showToast({
            type: "danger",
            title: message,
          });
        }
      } else {
        try {
          await this.$axios.$put(
            `/${this.contentType}${
              this._currentLocale && !this.noLocalization
                ? `?_locale=${this._currentLocale}`
                : ""
            }`,
            this.formData
          );

          this.__showToast({
            type: "success",
            title: "Save Successfully",
          });

          setTimeout(() => {
            this.loading = false;
          }, 2000);
        } catch (err) {
          let message = "There is something wrong.";
          this.loading = false;

          if (err.response) {
            const {
              response: { data: errorData },
            } = err;
            if (errorData.data && errorData.data.errors) {
              const { errors } = errorData.data;
              if (typeof errors === "object" && !Array.isArray(errors)) {
                message = errors[Object.keys(errors)[0]];
              }
            } else if (errorData.message) {
              message = errorData.message;
            }
          }

          this.__showToast({
            type: "danger",
            title: message,
          });
          // if (!this.$route.params.id) this.$router.push('/dashboard')
          console.log(err);
        }
      }
    },
    async create() {
      this.loading = true;

      let data = {
        ...this.formData,
        published_at:
          this.formData.visibility === "null"
            ? null
            : this.$moment().toISOString(),
      };

      try {
        await this.__createContentType(this.contentType, data);

        this.__showToast({
          type: "success",
          title: "Create Successfully",
        });

        setTimeout(() => {
          this.$router.push(`/${this.contentType}`);
          this.loading = false;
        }, 2000);
      } catch (err) {
        this.loading = false;
        this.__showToast({
          type: "danger",
          title: "There is something wrong.",
        });
        console.log(err);
      }
    },
    async remove() {
      this.loading = true;

      try {
        await this.__deleteContentType(this.contentType, this.$route.params.id);

        this.__showToast({
          type: "success",
          title: "Remove Successfully",
        });

        setTimeout(() => {
          this.$router.push(`/${this.contentType}`);
          this.loading = false;
        }, 2000);
      } catch (err) {
        this.loading = false;

        this.__showToast({
          type: "danger",
          title: "There is something wrong.",
        });

        console.log(err);
      }
    },
    /////////////////////////////////////////
    // Internalization 🌏
    /////////////////////////////////////////
    async copyLocale(target) {
      // target is the target locale that we would like to copy
      this.loading = true;

      // find if the target locale is available for this entry
      let translation = this.translations
        ? this.translations.filter((val) => val.locale === target)
        : [];

      // If there is a translation then continue function
      if (translation.length > 0) {
        // Check if this entry is a singleton or not
        // If it is a singleton then query with slug
        // If not then query with id
        let targetData = await this.$axios.$get(
          this.singleton
            ? `/${this.contentType}?_publicationState=preview&_locale=${target}`
            : `/${this.contentType}/${translation[0].id}?_publicationState=preview`
        );

        let filterKeywords = [
          "locale",
          "localizations",
          "created_by",
          "updated_by",
          "published_at",
          "id",
          "_id",
          "updated_at",
          "created_at",
          // Add more field to clean when clone localization here
          // ADD CUSTOM HERE
        ];

        let preservedKeywords = ["image", "img", "images"];

        // Clean some properties from targetData based on filterKeywords and preservedKeywords
        let filteredTargetData = this.__dataCleanup(
          targetData,
          filterKeywords,
          preservedKeywords
        );

        // Spare old data (In order to preserve locale, localization and visibility value)
        let oldData = JSON.parse(JSON.stringify(this.formData));

        // Combine new data and old data together (In order to preserve locale, localization and visibility value)
        let newData = {
          ...oldData,
          ...filteredTargetData,
        };

        // Reset formData (Fixing the bug which input not react to null value)
        this.formData = null;

        setTimeout(() => {
          // Set new data and stop loading process
          this.formData = newData;
          this.loading = false;
        }, 1500);
      } else {
        // If not then just stop loading
        this.loading = false;
      }
    },
    async changeLocale(newLocale) {
      this.loading = true;

      // Change global locale
      this.__changeLocale(newLocale);

      // Find if there is a translation available for this entry
      let translation = this.translations
        ? this.translations.filter((val) => val.locale === newLocale)
        : [];

      // Check if the entry is not a singleton
      if (!this.singleton) {
        if (translation.length > 0) {
          setTimeout(
            () =>
              this.$router.push(`/${this.contentType}/${translation[0].id}`),
            1500
          );
        } else {
          let { id: originalId } = this.formData;

          let response = await this.$axios.$post(
            `/${this.contentType}/${originalId}/localizations`,
            {
              ...this.initValue,
              locale: newLocale,
              published_at: null,
            }
          );

          this.$router.push(`/${this.contentType}/${response.id}`);
        }
      } else {
        // If the entry is a singleton then query with slug (not with id)
        let data = await this.$axios.$get(
          `/${this.contentType}?_locale=${newLocale}`
        );

        // Reset formData (Fixing the bug which input not react to null value)
        this.formData = null;

        setTimeout(() => {
          // Set new data
          this.formData = data;

          // Store new translations data (for user to switch to other language)
          let translations = this.formData.localizations;
          this.translations = translations;

          // Stop loading
          this.loading = false;
        }, 1500);
      }
    },
  },
  async mounted() {
    ////////////////////////////////////////////////////////
    // Singleton only use save and mounted function
    // Normal content type will use save, mounted, remove, create (every functions)
    ////////////////////////////////////////////////////////

    // Check if the entry is singleton or not
    if (!this.singleton) {
      if (!this.$route.params.id) {
        this.$router.push("/dashboard");
      }
      if (this.$route.params.id !== "create") {
        let data = await this.$axios.$get(
          `/${this.contentType}/${this.$route.params.id}?_publicationState=preview`
        );

        // Internationalize 🌏
        if (this._currentLocale && !this.noLocalization) {
          // If there is no content for the target locale for this entry
          // then return to the content listing page
          if (this._currentLocale !== data.locale) {
            this.$router.push(`/${this.contentType}`);
            return;
          }
        }

        this.formData = {
          ...data,
          visibility: data.published_at ? "published" : "null",
        };
      } else {
        this.formData = {
          ...this.initValue,
          visibility: "published",
        };
        this.newContent = true;
      }
    } else {
      // Not a singleton case
      try {
        let data = await this.$axios.$get(
          `/${this.contentType}${
            this._currentLocale && !this.noLocalization
              ? `?_locale=${this._currentLocale}`
              : ""
          }`
        );
        this.formData = data;
      } catch (err) {
        return this.$nuxt.error({ statusCode: err.response && err.response.status, message: err.message });
      }
    }

    // If there is _currentLocale detected (which means internationalize is enabled) then fetch all translation id
    if (this._currentLocale && !this.noLocalization) {
      let translations = this.formData.localizations;
      this.translations = translations;
    }
  },
};
</script>
