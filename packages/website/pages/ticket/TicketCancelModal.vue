<template>
  <Transition name="modal">
    <div v-if="isShow" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-ticket-header _mgbt-24px">
            <i class="far fa-calendar-exclamation _tal-ct"></i>
          </div>
          
          <div class="modal-ticket-body">
            <p class="label _tal-ct _mgbt-24px">TICKET ID — #{{ticket.id}}</p>
            <div v-if="!isCancelSuccess">
              <p class="title _tal-ct _mgbt-8px">Cancel this ticket?</p>
              <p class="description _tal-ct _mgbt-24px">หากยกเลิกแล้วคุณ ไม่สามารถแก้ไขภายหลังได้</p>
            </div>
            <div v-else>
              <p class="title _tal-ct _mgbt-8px">ยกเลิกรายการเรียบร้อย</p>
              <p class="description _tal-ct _mgbt-24px">เงินจะถูกโอนคืนภายใน 7 วัน</p>
            </div>
          </div>

          <div class="modal-footer _tal-ct _pdh-0px _mgv-0px _mgh-0px">
              <button v-if="!isCancelSuccess" class="btn btn-danger _w-100pct btn-confirm-cancel _mgbt-16px" @click="()=>onConfirmCancel(ticket.id)">Confirm</button>
              <p v-if="!isCancelSuccess" class="btn-modal-close _mg-0px" @click="close">Cancel</p>
              <button v-if="isCancelSuccess" class="btn btn-danger _w-100pct btn-confirm-cancel _mgbt-16px" @click="close">Close</button>
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
    isCancelSuccess: Boolean,
    ticket: Object,
    onConfirmCancel: Function,
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
  width: 375px;
  margin: 0px auto;
  padding: 32px;
  background-color: #FFFFFF;
  border-radius: 5px;
  box-shadow: 0px 10px 20px rgba(6, 63, 72, 0.1);
  transition: all 0.3s ease;

  .modal-ticket-header {
    
    i {
      display: block;
      width: 70px;
      height: 70px;
      line-height: 70px;
      font-size: 32px;
      color: #FFFFFF;
      background-color: #CB2731;
      margin: 0 auto;
      border-radius: 50%;
    }
  }
}

.modal-ticket-body {
  margin: 0;
  padding: 0;

  .label {
    color: #999999;
    font-weight: 400 !important;
    font-size: 12px !important;
    line-height: 150% !important;
  }

  .title {
    color: #171717;
    font-weight: 600 !important;
    font-size: 20px !important;
    line-height: 140% !important;
  }
  .description {
    color: #999999;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 180% !important;
  }
}

.modal-footer {
  border-top: none;
  justify-content: center;
  padding: 0;

  .btn-confirm-cancel {
    height: 47px;
    font-size: 16px;
    background: #CB2731;
    box-shadow: 0px 16px 32px rgba(203, 39, 49, 0.2), 0px 2px 4px rgba(203, 39, 49, 0.03);
  }
  .btn-modal-close {
    font-weight: 700;
    font-size: 16px;
    line-height: 180%;
    text-align: center;
    color: #999999;
    cursor: pointer;
  }
}

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