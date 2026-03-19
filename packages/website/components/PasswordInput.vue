<template>
  <div class="password-input">
    <input
      name="password"
      :type="showPassword ? 'text' : 'password'"
      :value="value"
      @input="e => $emit('input', e.target.value)"
      :placeholder="placeholder"
      class="form-control"
    />

    <div class="icon" @click="showPassword = !showPassword">
      <i class="fas fa-eye" v-if="!showPassword"></i>
      <i class="fas fa-eye-slash" v-else></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: String,
    value: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    showPassword: false,
  })
}
</script>

<style lang="scss" scoped>
.password-input {
  position: relative;

  .icon {
    position: absolute;
    right: 1px;
    color: #000;
    font-size: 14px;
    cursor: pointer;
    z-index: 10;
    top: 50%;
    transform: translateY(-50%);
    height: calc(100% - 2px);
    padding-left: 12px;
    padding-right: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;

    i {
      opacity: .5;
      transition: .3s;
    }

    &:hover {
      i {
        opacity: 1;
        transition: .3s;
      }
    }
  }
}

input {
  &::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #adb5bd;
    opacity: 1; /* Firefox */
  }

  &:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #adb5bd;
  }

  &::-ms-input-placeholder {
    /* Microsoft Edge */
    color: #adb5bd;
  }
}
</style>
