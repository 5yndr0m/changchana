<template>
  <div>
    <form @submit.prevent="$emit('next', formData)" v-if="data">
      <div class="_mgbt-24px">
        <label for="name">Name (ชื่อจริง)</label>
        <input
          name="name"
          type="text"
          :value="formData.first_name"
          required
          @input="(e) => (formData['first_name'] = e.target.value)"
          class="form-control"
        />
      </div>

      <div class="_mgbt-24px">
        <label for="surname">Surname (นามสกุล)</label>
        <input
          name="surname"
          type="text"
          :value="formData.last_name"
          required
          @input="(e) => (formData['last_name'] = e.target.value)"
          class="form-control"
        />
      </div>

      <div class="row _mgbt-24px-md">
        <div class="col-md-6">
          <div class="_mgbt-0px-md _mgbt-24px">
            <label for="nickname">Nickname (ชื่อเล่น)</label>
            <input
              name="nickname"
              type="text"
              :value="formData.nickname"
              required
              @input="(e) => (formData['nickname'] = e.target.value)"
              class="form-control"
            />
          </div>
        </div>
        <div class="col-md-6">
          <div class="_mgbt-0px-md _mgbt-24px">
            <label for="gender">Gender (เพศ)</label>
            <select class="form-select" :value="formData.gender" @change="(e) => (formData['gender'] = e.target.value)" required>
              <option selected disabled>Select</option>
              <option value="male">Male (ชาย)</option>
              <option value="female">Female (หญิง)</option>
              <option value="other">Other (ไม่ระบุ)</option>
            </select>
          </div>
        </div>
      </div>

      <button type="submit" class="_w-100pct btn btn-primary">Next</button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    formData: {
      first_name: '',
      last_name: '',
      nickname: '',
      gender: null,
    },
  }),
  watch: {
    formData: {
      deep: true,
      handler() {
        this.$emit('update', this.formData)
      },
    },
  },
  mounted() {
    if (this.data) {
      if (this.data.first_name) this.formData.first_name = this.data.first_name
      if (this.data.last_name) this.formData.last_name = this.data.last_name
      if (this.data.nickname) this.formData.nickname = this.data.nickname
      if (this.data.gender)
        this.formData.gender = this.data.gender
    }
  },
}
</script>
