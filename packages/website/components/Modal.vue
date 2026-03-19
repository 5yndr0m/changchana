<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal-content">
        <div
          class="modal"
          role="dialog"
          aria-labelledby="modalTitle"
          aria-describedby="modalDescription"
        >
          <header class="modal-header" id="modalTitle">
            <slot name="header">{{ title }}</slot>
            <button
              type="button"
              class="btn-close"
              @click="close"
              aria-label="Close modal"
            >
              <i class="fa fa-times-circle"></i>
            </button>
          </header>

          <section class="modal-body" id="modalDescription">
            <slot name="body">
              <div v-html="message"></div>
            </slot>
          </section>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Modal title",
    },
    message: {
      type: String,
      default: "Modal content",
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5em;

  @media (max-width: 768px) {
    padding: 0em;
  }
}
.modal-content {
  background: #ffffff;
  width: 100%;
  height: 100%;
}
.modal {
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: contents;
  flex-direction: column;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  justify-content: space-between;
  font-size: 1.3em;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  flex-direction: column;
}

.modal-body {
  position: relative;
  padding: 24px;
  max-height: calc(100% - 60px);
  overflow-y: auto;
}

.btn-close {
  position: absolute;
  top: 5px;
  right: 5px;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  background: transparent;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>