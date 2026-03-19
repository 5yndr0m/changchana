<template>
  <Transition name="modal">
    <div v-if="isShow" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-ticket-header _dp-f _fdrt-r _alit-ct _pdr-8px _mgbt-24px">
            <div class="date-box">
              <p class="day _tal-ct">{{ ticket.day }}</p>
              <p class="month _tal-ct">{{ ticket.month }}</p>
            </div>
            <div class="ticket-text _dp-f _fdrt-cl _pdl-16px _pdr-8px">
              <p class="text-type _fw-600 _pdt-8px _pdbt-4px">{{ ticket.type }}</p>
              <p class="text-title _fw-600">{{ ticket.title }}</p>
              <div class="text-footer _dp-f _fdrt-r _jtfct-spbtw _pdbt-8px">
                
                <p class="branch-name">{{ ticket.branch_name }}</p>
              </div>
            </div>
          </div>
          
          <div class="modal-ticket-body">
            <div class="_dp-f _fw-w">
              <div class="_w-50pct">
                <p class="title">Table</p>
                <p class="detail">{{ ticket.tables }}</p>
              </div>
              <div class="_w-50pct">
                <p class="title">Ticket ID</p>
                <p class="detail">{{ `#${ticket.id}` }}</p>
              </div>
              <div class="_w-50pct">
                <p class="title">Total Price</p>
                <p class="detail">{{ ticket.price }}</p>
              </div>
              <div class="_w-50pct">
                <p class="title">Point Used</p>
                <p class="detail">{{ ticket.points }}</p>
              </div>
            </div>
          </div>

          <div class="modal-footer _tal-ct">
            <button class="btn btn-primary _w-100pct btn-modal-close" @click="close">Close</button>
            <!-- <p v-if="ticket.status=='successful'" @click="onOpenCancel" class="btn-cancel-ticket _mgt-16px" >Cancel Ticket</p> -->
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
    ticket: Object,
    onOpenCancel: Function,
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
  padding: 0px;
  background-color: #FFFFFF;
  border-radius: 5px;
  box-shadow: 0px 10px 20px rgba(6, 63, 72, 0.1);
  transition: all 0.3s ease;

  .modal-ticket-header {
    background: #FFFFFF;
    border-radius: 5px;

    .date-box {
      width: 72px;
      height: 72px;
      background: #1797AD;
      border-radius: 5px 0px 5px 0px;

      .day {
        line-height: 100%;
        font-weight: 700 !important;
        font-size: 40px;
        margin-top: 10px;
        margin-bottom: 2px;
      }

      .month {
        line-height: 100%;
        font-weight: 500 !important;
        font-size: 8px;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.2em;
      }
    }

    .ticket-text {
      width: calc(100% - 72px);
      height: 72px;
      overflow: hidden;

      .text-type {
        font-size: 12px !important;
        line-height: 100%;
        color: #1797AD;
        text-transform: capitalize;
      }

      .text-title {
        font-size: 18px !important;
        line-height: 100%;
        color: #171717;

        display: block;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;

        @media screen and (max-width: 425px) {
          font-size: 14px !important;
        }
      }

      .text-footer {
        margin-top: auto;

        p {
          font-size: 10px !important;
          font-weight: 500 !important;
          line-height: 100%;
          color: #999999;

          @media screen and (max-width: 425px) {
            font-size: 8px !important;
          }
        }
        .branch-name {
          text-transform: uppercase;
        }
      }
    }
  }
}

.modal-ticket-body {
  margin: 0;
  padding: 0 1em 0 1em;

  .title {
    color: #171717;
    font-weight: 700 !important;
    font-size: 12px !important;
    line-height: 100% !important;
    margin-bottom: 9px;
  }
  .detail {
    color: #999999;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 100% !important;
    margin-bottom: 16px;
  }
}

.modal-footer {
  border-top: none;
  justify-content: center;
  padding-top: 0;
  padding-bottom: 10px;

  .btn-modal-close {
    height: 47px;
    font-size: 16px;
  }
  .btn-cancel-ticket {
    font-weight: 700;
    font-size: 16px;
    line-height: 180%;
    text-align: center;
    color: #CB2731;
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