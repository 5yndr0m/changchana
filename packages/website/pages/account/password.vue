<template>
  <div>
    <AccountSettings>
      <template v-slot:desktop>
        <TextHeading title="Password" class="_mgbt-32px" />
        <form @submit.prevent="update">
          <div class="_mgbt-24px">
            <label for="currentPassword">Current Password</label>
            <PasswordInput v-model="formData.current_password" />
            <!-- <input
              name="currentPassword"
              type="password"
              v-model="formData.current_password"
              class="form-control"
            /> -->
          </div>

          <div class="_mgbt-24px">
            <label for="newPassword">New Password</label>
            <PasswordInput v-model="formData.new_password" />
            <!-- <input
              name="newPassword"
              type="password"
              v-model="formData.new_password"
              class="form-control"
            /> -->
          </div>

          <div class="_mgbt-24px">
            <label for="confirmPassword">Confirm Password</label>
            <PasswordInput v-model="confirmPassword" />
            <!-- <input
              name="confirmPassword"
              type="password"
              v-model="confirmPassword"
              class="form-control"
            /> -->
          </div>

          <div
            class="alert alert-warning _dp-f _alit-ct _mgv-24px"
            role="alert"
            v-if="confirmPassword !== formData.new_password"
          >
            <div class="icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div>
              <strong>Password not match</strong><br />
              <span>Please check new password and confirm password field.</span>
            </div>
          </div>

          <button type="submit" class="btn btn-primary _w-100pct">
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              v-if="loading"
            ></span>
            <span>Save</span>
          </button>
        </form>
      </template>

      <template v-slot:mobile>
        <TextHeading title="Password" class="_mgbt-32px" />
        <form @submit.prevent="update">
          <div class="_mgbt-24px">
            <label for="currentPassword">Current Password</label>
            <PasswordInput v-model="formData.current_password" />
            <!-- <input
              name="currentPassword"
              type="password"
              v-model="formData.current_password"
              class="form-control"
            /> -->
          </div>

          <div class="_mgbt-24px">
            <label for="newPassword">New Password</label>
            <PasswordInput v-model="formData.new_password" />
            <!-- <input
              name="newPassword"
              type="password"
              v-model="formData.new_password"
              class="form-control"
            /> -->
          </div>

          <div class="_mgbt-24px">
            <label for="confirmPassword">Confirm Password</label>
            <PasswordInput v-model="confirmPassword" />
            <!-- <input
              name="confirmPassword"
              type="password"
              v-model="confirmPassword"
              class="form-control"
            /> -->
          </div>

          <div
            class="alert alert-warning _dp-f _alit-ct _mgv-24px"
            role="alert"
            v-if="confirmPassword !== formData.new_password"
          >
            <div class="icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div>
              <strong>Password not match</strong><br />
              <span>Please check new password and confirm password field.</span>
            </div>
          </div>

          <button type="submit" class="btn btn-primary _w-100pct">
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              v-if="loading"
            ></span>
            <span>Save</span>
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
    let { email } = store.state.auth.user;

    return {
      formData: {
        current_password: "",
        new_password: "",
      },
      confirmPassword: "",
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
        let data = {
          ...this.formData,
          user: this.$store.state.auth.user.id,
        };
        let token = this.$auth.strategy.token.get();

        let response = await this.$axios.$post("/api/change-password", data, {
          headers: {
            Authorization: `${token}`,
          },
        });
        // console.log(response)

        this.formData = {
          current_password: "",
          new_password: "",
        };

        this.confirmPassword = "";
        this.$swal(
          "Information Updated",
          "Successfully updating your new information",
          "success"
        );
        this.loading = false;
      } catch (err) {
        let message = "Fail to update your new information";
        if (err.response && err.response.data && err.response.data.message) {
          message = err.response.data.message;
        }
        this.$swal("Update Failed", message, "error");
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
