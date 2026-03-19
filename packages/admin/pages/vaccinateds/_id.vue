<template>
  <div>
    <template v-if="formData">
      <Loading :loading="loading" />
      <ContentEdit
        :create="newContent"
        :fields="fields"
        :sidebarFields="sidebarFields"
        :value="formData"
        :title="editTitle"
        @update="data => (formData = { ...formData, ...data })"
        @save="save"
        @create="create"
        @delete="remove"
        :readonly="readonly"
      />
    </template>
    <template v-else>
      <Loading :loading="true" :float="false" />
    </template>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'auth',
  // props: {
  //   title: {
  //     type: String,
  //     default: null,
  //   },
  //   fields: {
  //     type: Array,
  //     default: null,
  //   },
  //   sidebarFields: {
  //     type: Array,
  //     default: null,
  //   },
  //   initValue: {
  //     type: Object,
  //     default: null,
  //   },
  //   contentType: {
  //     type: String,
  //     default: '',
  //   },
  //   title: {
  //     type: String,
  //     default: '',
  //   },
  //   readonly: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   singleton: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  async asyncData({ store, params }) {
    let type = 'vaccinateds'
    let configs = store.state.configs[type]
    let { fields, sidebarFields, initValue, readonly, editTitle } = configs

    return {
      fields,
      sidebarFields,
      initValue,
      type,
      readonly,
      editTitle,
      contentType: type,
    }
  },
  data: () => ({
    loading: false,
    formData: null,
    newContent: false,
    relationData: {},
  }),
  methods: {
    async save() {
      this.loading = true

      if (!this.singleton) {
        let data = {
          ...this.formData,
          published_at:
            this.formData.visibility === 'null'
              ? null
              : this.formData.published_at
              ? this.formData.published_at
              : this.$moment().toISOString(),
        }

        try {
          if (this.formData.confirm) {
            await this.__saveContentType(
              this.contentType,
              this.$route.params.id,
              data
            )
            
            let response = await this.$axios.$post(`/api/confirm-vaccinated`, {
              userId: this.formData.user,
              issueBy: this.$auth.user.id
            })
          } else {
            await this.__saveContentType(
              this.contentType,
              this.$route.params.id,
              data
            )
          }

          setTimeout(() => {
            this.$router.push(`/${this.contentType}`)
            this.loading = false
          }, 2000)
        } catch (err) {
          this.loading = false
          console.log(err)
        }
      } else {
        try {
          await this.$axios.$put(`/${this.contentType}`, this.formData)

          setTimeout(() => {
            this.loading = false
          }, 2000)
        } catch (err) {
          this.loading = false
          // if (!this.$route.params.id) this.$router.push('/dashboard')
          console.log(err)
        }
      }
    },
    async create() {
      this.loading = true

      let data = {
        ...this.formData,
        published_at:
          this.formData.visibility === 'null'
            ? null
            : this.$moment().toISOString(),
      }

      try {
        await this.__createContentType(this.contentType, data)

        setTimeout(() => {
          this.$router.push(`/${this.contentType}`)
          this.loading = false
        }, 2000)
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
    async remove() {
      this.loading = true

      try {
        await this.__deleteContentType(this.contentType, this.$route.params.id)

        setTimeout(() => {
          this.$router.push(`/${this.contentType}`)
          this.loading = false
        }, 2000)
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
  },
  async mounted() {
    ////////////////////////////////////////////////////////
    // Singleton only use save and mounted function
    // Normal content type will use save, mounted, remove, create (every functions)
    ////////////////////////////////////////////////////////
    if (!this.singleton) {
      if (!this.$route.params.id) this.$router.push('/dashboard')
      if (this.$route.params.id !== 'create') {
        let data = await this.$axios.$get(
          `/${this.contentType}/${this.$route.params.id}?_publicationState=preview`
        )

        this.formData = {
          ...data,
          visibility: data.published_at ? 'published' : 'null',
        }
      } else {
        this.formData = {
          ...this.initValue,
          visibility: 'published',
        }
        this.newContent = true
      }
    } else {
      try {
        let data = await this.$axios.$get(`/${this.contentType}`)
        this.formData = data
      } catch (err) {
        this.$router.push('/dashboard')
        console.log(err)
      }
    }
  },
}
</script>
