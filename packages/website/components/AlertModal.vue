<template>
  <Transition name="modal">
    <div v-if="isShow" class="modal-mask" @click="close">
      <div class="modal-wrapper">
        <div class="modal-container">
          <button v-if="hasClose" class="btn_close" type="button" @click="close" aria-label="Close Alert">
            <i class="fas fa-times"></i>
          </button>

          <div class="modal-body">
            <slot name="body">BODY</slot>
          </div>

          <div class="modal-footer _tal-ct">
            <slot name="footer">
              <button class="btn btn-primary" @click="close">OK</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  props: {
    isShow: Boolean,
    hasClose: Boolean,
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  position: relative;
  width: 300px;
  margin: 0px auto;
  padding: 0px 30px;
  padding-top: 2px;
  background-color: #063F48;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;

  .btn_close {
    position: absolute;
    top: 6px;
    right: 10px;
    font-size: large;
    color: #FFF;
    background-color: transparent;
    border: none;
  }
}

.modal-header {
  margin-top: 0;
  justify-content: center;
  color: #FFF;
}

.modal-body {
  margin: 20px 0;
  padding: 1em;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -10%;
    transform: translate(-50%, -50%);
    display: inline-block;
    height: 1em;
    width: 36px;
    border-bottom: 4px solid #1797AD;

  }
}

.modal-footer {
  border-top: none;
  justify-content: center;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>