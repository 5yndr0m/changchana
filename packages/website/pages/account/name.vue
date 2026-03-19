<template>
  <div>
    <AccountSettings>
      <template v-slot:desktop>
        <TextHeading title="Name" class="_mgbt-32px" />
        <form @submit.prevent="update">
          <div class="_mgbt-24px">
            <label for="name">Name</label>
            <input
              name="name"
              type="text"
              class="form-control"
              v-model="formData.first_name"
            />
          </div>

          <div class="_mgbt-24px">
            <label for="name">Surname</label>
            <input
              name="surname"
              type="text"
              class="form-control"
              v-model="formData.last_name"
            />
          </div>

          <div class="_mgbt-24px">
            <label for="name">Nickname</label>
            <input
              name="nickname"
              type="text"
              class="form-control"
              v-model="formData.nickname"
            />
          </div>

          <button class="_w-100pct btn btn-primary" type="submit">
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              v-if="loading"
            ></span>
            <span v-else>Save</span>
          </button>
        </form>
      </template>

      <template v-slot:mobile>
        <TextHeading title="Name" class="_mgbt-32px" />
        <form @submit.prevent="update">
          <div class="_mgbt-24px">
            <label for="name">Name</label>
            <input
              name="name"
              type="text"
              class="form-control"
              v-model="formData.first_name"
            />
          </div>

          <div class="_mgbt-24px">
            <label for="name">Surname</label>
            <input
              name="surname"
              type="text"
              class="form-control"
              v-model="formData.last_name"
            />
          </div>

          <div class="_mgbt-24px">
            <label for="name">Nickname</label>
            <input
              name="nickname"
              type="text"
              class="form-control"
              v-model="formData.nickname"
            />
          </div>

          <button class="_w-100pct btn btn-primary" type="submit">
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              v-if="loading"
            ></span>
            <span v-else>Save</span>
          </button>
        </form>
      </template>
    </AccountSettings>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: "Account Settings",
    };
  },
  async asyncData({ store }) {
    let { first_name, last_name, nickname } = store.state.auth.user;

    return {
      formData: {
        first_name: first_name ? first_name : "",
        last_name: last_name ? last_name : "",
        nickname: nickname ? nickname : "",
      },
    };
  },
  middleware: "auth",
  layout: "w_nav",
  data: () => ({
    loading: false,
  }),
  methods: {
    async update() {
      this.loading = true;
      try {
        let data = this.formData;
        let response = await this.__updateUser(data);
        this.$swal(
          "Information Updated",
          "Successfully updating your new information",
          "success"
        );
        this.loading = false;
      } catch (err) {
        this.$swal(
          "Update Failed",
          "Fail to update your new information",
          "error"
        );
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
