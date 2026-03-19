<template>
  <button @click="onClick" class="btn btn-payment" id="checkout-button">
    {{ this.label }}
  </button>
</template>

<script>

export default {
  props: {
    eventID: String,
    tables: Array, // { zoneID: string; roundID: string; tableIndex: string; }
    price: String,
    points: String,
    onCheckout: Function,
    onClosed: Function,
    label: {
      type: String,
      default: "ชำระเงิน",
    },
  },
  data: () => {
    return {
      messages: {
        paymentPoint: "และตัดคะแนน",
      },
      modalContext: {
        success: {
          confirmButtonText: "คำสั่งซื้อทั้งหมด",
          cancelButtonText: "กลับสู้หน้าหลัก",
          description: (trxnID, eventName, tableName) => `
          <h2 class="result-title">สั่งซื้อสำเร็จ</h2>
          <div class="swal2-icon swal2-success custom-class-icon" style="display: flex;">
            <span class="swal2-success-line-tip"></span>
            <span class="swal2-success-line-long"></span>
            <div class="swal2-success-ring"></div>
          </div>
          <p class="helper-text _mgt-24px _fs-7">TICKET ID - #${trxnID}</p>
          <h3 class="_mgt-24px">${eventName}</h3>
          <p class="helper-text">${tableName}</p>

          `,
        },
        error: {
          confirmButtonText: "ทำรายการใหม่",
          cancelButtonText: "ปิด",
          description: (message, code, createAt) => `
            <h2 class="result-title">สั่งซื้อไม่สำเร็จ</h2>
            <div class="swal2-icon swal2-error swal2-icon-show custom-class-icon" style="display: flex;">
              <span class="swal2-x-mark">
                <span class="swal2-x-mark-line-left"></span>
                <span class="swal2-x-mark-line-right"></span>
              </span>
            </div>
            <h3 class="_mgt-64px">${message}</h3>
            <p class="helper-text _mgt-8px">กรุณาทำรายการใหม่อีกครั้ง</p>
            <p class="helper-text _fs-8">(${code})</p>
          `,
        },
      }
    };
  },
  methods: {
    onClick(e) {
      if (this.onCheckout) {
        this.onCheckout(this.checkout)
      } else {
        this.checkout({
          eventID: this.eventID,
          tables: this.tables,
          price: this.price,
          points: this.points,
        });
      }
    },
    handlePaymentResult({ success, data, error }) {
      const stateModal = success && data ? "success" : "error";
      const paymentMethod = data && data.paymentMethod;
      let html = "";

      if (stateModal === "success") {
        html = this.modalContext[stateModal].description(
          data.id,
          data.eventName,
          data.description,
        );
      } else {
        let code = "unk";
        let message = "ระบบไม่สามารถเรียกเก็บเงินจากบัตรเครดิตของท่านได้";

        if (paymentMethod === "promptpay") {
          message = "ระบบไม่สามารถเรียกเก็บเงินของท่านได้";
        }

        if (error) {
          const { data: errorData } = error;

          if (errorData && errorData.code) {
            code = errorData.code || "unkcode";

            switch (code) {
              case "event_not_found":
              case "no_reserved_tables":
              case "tables_invalid":
              case "round_invalid":
                message = "ข้อมูลบางอย่างไม่ถูกต้อง กรุณาทำรายการใหม่อีกครั้ง";
                break;
              case "redeem_point_failed":
                message = "ตัด points ไม่สำเร็จ กรุณาตรวจสอบ points ของคุณ";
                break;
              case "reserve_table_failed":
                message = "โต๊ะที่คุณเลือกถูกจองไปแล้ว";
                break;
              case "expired":
                message = "รายการชำระเงินหมดอายุแล้ว กรุณาทำรายการใหม่อีกครั้ง";
                break;
            }
          }
        }

        html = this.modalContext[stateModal].description(message, code);
      }

      this.swalCustom({
        html,
        confirmButtonText: this.modalContext[stateModal].confirmButtonText,
        cancelButtonText: this.modalContext[stateModal].cancelButtonText,
      }).then((result) => {
        if (this.onClosed) {
          this.onClosed(success, result.isConfirmed)
        }
      });
    },
    checkout({ eventID, tables, price, points }) {
      const seoData = this.$store.state.settings.seo;
      const frameLabel = seoData.title || "";

      const amount = price * 100;
      let frameDescription = `${price} THB`;

      if (points && points > 0) {
        frameDescription += ` ${this.messages.paymentPoint} ${points}`;
      }

      OmiseCard.open({
        frameLabel,
        frameDescription,
        amount,
        onCreateTokenSuccess: async (nonce) => {
          this.$nuxt.$loading.start({
            screen: true,
            message: "ระบบกำลังดำเนินการชำระเงิน",
          });
          const payloads = {
            omiseToken: null,
            omiseSource: null,
            eventID,
            tables,
          };
          if (nonce.startsWith("tokn_")) {
            payloads.omiseToken = nonce;
          } else {
            payloads.omiseSource = nonce;
          }

          const result = await this.createTransaction(payloads);
          this.$nuxt.$loading.finish();
          
          if (result && result.success && result.data) {
            const transaction = result.data;
            if (transaction.paymentMethod === "promptpay") {
              return this.openPromptPay({
                reqTransID: transaction.reqTransID,
                eventName: transaction.eventName,
                description: transaction.description,
                qrcodeUrl: transaction.qrcodeUrl,
              });
            } else if (transaction.authorizeUrl && (
              (
                transaction.paymentMethod === "card"
                && transaction.status === "pending"
              )
              || transaction.paymentMethod.indexOf("internet_banking") >= 0
              || transaction.paymentMethod.indexOf("mobile_banking") >= 0
            )) {
             window.location.href = transaction.authorizeUrl;
             return;
            }
          }

          return this.handlePaymentResult(result);
        },
      });
    },
    openPromptPay({ reqTransID, eventName, description, qrcodeUrl }) {
      let pullingTimer;
      this.swalCustom({
        html: `
          <img src="${qrcodeUrl}" />
          <p>กรุณาแสกน QR Code เพื่อชำระเงิน</p>
          <p>หลังจากชำระเงินแล้วกรุณารอสักครู่</p>
        `,
        showCancelButton: false,
        showCloseButton: false,
        showConfirmButton: false,
        confirmButtonText: "ตรวจสอบสถานะ",
        didOpen: () => {
          const pullingSec = 10000;
          const expiredSec = 300000;

          this.$swal.showLoading();
          pullingTimer = setInterval(async () => {
            const result = await this.checkPaymentStatus(reqTransID);

            if (result.success && result.data.status !== "pending") {
              clearInterval(pullingTimer);
              this.$swal.hideLoading();
              this.$swal.close();
              const isSuccess = result.data.status === "successful";

              this.handlePaymentResult({
                success: isSuccess,
                data: {
                  id: result.data.id,
                  eventName,
                  description,
                  paymentMethod: "promptpay",
                },
                ...!isSuccess && {
                  error: {
                    data: {
                      code: result.data.paymentFailureCode || result.data.status,
                    },
                  }
                }
              });
            }
          }, pullingSec);

          setTimeout(() => {
            clearInterval(pullingTimer);
            this.$swal.hideLoading();
            const elemActions = this.$swal.getActions();
            const elemConfirmBtn = this.$swal.getConfirmButton();
            elemActions.style.display = "inline-block";
            elemConfirmBtn.style.display = "inline-block";

          }, expiredSec);
        },
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          const result = await this.checkPaymentStatus(reqTransID);

          if (result.success && result.data.status !== "pending") {
            this.$swal.close();
            const isSuccess = result.data.status === "successful";

            this.handlePaymentResult({
              success: isSuccess,
              data: {
                id: result.data.id,
                eventName,
                description: result.data.description,
                paymentMethod: "promptpay",
              },
              ...!isSuccess && {
                error: {
                  data: { code: result.data.paymentFailureCode  || result.data.status },
                }
              }
            });
          }

          return false;
        },
        willClose: () => {
          clearInterval(pullingTimer);
        },
      });
    },
    async createTransaction(payloads) {
      try {
        const accessToken = this.$auth.strategy.token.get();
        const body = {
          omiseToken: payloads.omiseToken,
          omiseSource: payloads.omiseSource,
          eventID: payloads.eventID,
          tables: payloads.tables,
        };

        const response = await this.$axios.$post(
          "/event-transactions",
          body,
          {
            headers: {
              Authorization: `${accessToken}`,
            },
          }
        );

        return { success: true, data: response.data };
      } catch (e) {
        return { success: false, error: e.response && e.response.data };
      }
    },
    async checkPaymentStatus(requestTransactionID) {
      try {
        const accessToken = this.$auth.strategy.token.get();
        const response = await this.$axios.$get(
          `/event-transactions/request/${requestTransactionID}/status`,
          {
            headers: {
              Authorization: `${accessToken}`,
            },
          }
        );

        return { success: true, data: response };
      } catch (e) {
        return { success: false, error: e.response && e.response.data };
      }
    },
    swalCustom(options) {
      return this.$swal({
        confirmButtonColor: "#3ca4b6",
        cancelButtonColor: "transparent",
        showCancelButton: true,
        showCloseButton: false,
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        width: "25em",
        padding: "2.15em 0 1.25em",
        ...options,
        customClass: {
          container: "chongjaroen-alert",
          popup: "payment-result",
          icon: "custom-class-icon",
          confirmButton: "btn-primary",
          ...options && options.customClass,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-payment {
  color: #ffffff;
  font-size: 16px;
  background: #1797ad;
  box-shadow: 0px 16px 32px rgba(17, 234, 241, 0.2),
    0px 2px 4px rgba(255, 255, 255, 0.03);
  border-radius: 5px;
  padding: 9px 39px;
  border: none;
  font-weight: 700;
}

</style>
  