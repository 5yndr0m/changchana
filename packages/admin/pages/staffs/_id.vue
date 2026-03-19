<template>
  <div>
    <template v-if="formData">
      <Loading :loading="loading" />
      <ContentEdit
        :create="newContent"
        :fields="fields"
        :sidebarFields="sidebarFields"
        :value="formData"
        title="Edit Staff"
        @update="data => (formData = { ...formData, ...data })"
        @save="save"
        @create="create"
        @delete="remove"
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
  asyncData({ store }) {
    let configs = store.state.configs['staffs']
    let { fields, sidebarFields, initValue } = configs

    return {
      fields,
      sidebarFields,
      initValue,
    }
  },
  computed: {
    _title() {
      if (this.title) {
        return this.title
      } else {
        if (this.formData) {
          if (this.formData.name) {
            return this.formData.name
          } else if (this.formData.title) {
            return this.formData.title
          } else if (this.formData.id) {
            return `${this.formData.id}`
          } else {
            return ''
          }
        }
      }
    },
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
        await this.__saveContentType('users', this.$route.params.id, data)

        setTimeout(() => {
          this.$router.push(`/staffs`)
          this.loading = false
        }, 2000)
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
    async create() {
      this.loading = true

      let data = {
        ...this.formData,
        role: 3,
        username: `${Math.random().toString(36).substring(7)}${this.$moment().format('DDDDMMYY')}`,
        published_at:
          this.formData.visibility === 'null'
            ? null
            : this.$moment().toISOString(),
      }

      try {
        await this.__createContentType('users', data)

        setTimeout(() => {
          this.$router.push(`/staffs`)
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
        await this.__deleteContentType('users', this.$route.params.id)

        setTimeout(() => {
          this.$router.push(`/staffs`)
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

    if (!this.$route.params.id) this.$router.push('/dashboard')
    if (this.$route.params.id !== 'create') {
      let data = await this.$axios.$get(
        `/users/${this.$route.params.id}?_publicationState=preview`
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
  },
}
</script>
