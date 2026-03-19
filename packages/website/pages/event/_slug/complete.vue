<template>
  <div class="container payment-complete chongjaroen-alert">
    <div class="row _jtfct-ct">
      <div v-if="this.paymentResult.status === 'pending'" style="height: 500px;"></div>
      <div
        v-else-if="this.paymentResult.status === 'successful'"
        class="col-sm-4 col-11 content panel-left _fdrt-cl _alit-ct _jtfct-ct _tal-ct"
      >
        <h2 class="green-underscore _pst-rlt _cl-black _mgt-32px _mgbt-32px _tal-ct">
          สั่งซื้อสำเร็จ
        </h2>
        <div class="swal2-icon swal2-success custom-class-icon" style="display: flex;">
          <span class="swal2-success-line-tip"></span>
          <span class="swal2-success-line-long"></span>
          <div class="swal2-success-ring"></div>
        </div>
        <p class="_mgt-24px _fs-6 _cl-gray-500">TICKET ID - #{{this.paymentResult.id}}</p>
        <h3 class="_mgt-24px _cl-black">{{this.pageData.title}}</h3>
        <p class="_cl-gray-500">{{this.paymentResult.description}}</p>
        <div class="d-grid gap-2 _mgt-24px">
          <button class="btn btn-primary" @click="() => this.$router.push('/ticket')">
            คำสั่งซื้อทั้งหมด
          </button>
          <button class="btn _cl-gray-500" @click="() => this.$router.push(`/event/${this.pageData.slug}`)">
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
      <div v-else class="col-sm-4 col-11 content panel-left _fdrt-cl _alit-ct _jtfct-ct _tal-ct">
        <h2 class="green-underscore _pst-rlt _cl-black _mgt-32px _mgbt-32px _tal-ct">
          สั่งซื้อไม่สำเร็จ
        </h2>
        <div class="swal2-icon swal2-error swal2-icon-show custom-class-icon" style="display: flex;">
          <span class="swal2-x-mark">
            <span class="swal2-x-mark-line-left"></span>
            <span class="swal2-x-mark-line-right"></span>
          </span>
        </div>
        <h3 class="_mgt-64px _cl-black">ระบบไม่สามารถเรียกเก็บเงินของท่านได้</h3>
        <p class="_cl-gray-500 _mgt-8px">กรุณาทำรายการใหม่อีกครั้ง</p>
        <p class="_cl-gray-500 _fs-7">({{this.paymentResult.paymentFailureCode || "unk"}})</p>
        <div class="d-grid gap-2 _mgt-24px">
          <button class="btn btn-primary" @click="() => this.$router.push(`/event/${this.pageData.slug}`)">
            ทำรายการใหม่
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'main',
  async asyncData({ $axios, app, params, query, redirect }) {
    let { slug } = params;
    if (!slug || !query.rtrxid) return redirect('/event');

    const response = await $axios.$get(
      `/events?slug=${encodeURIComponent(slug)}`
    );
    let paymentResult = null;

    try {
      const accessToken = app.$auth.strategy.token.get();
      paymentResult = await $axios.$get(
        `/event-transactions/request/${query.rtrxid}/status`,
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      );
    } catch (e) {
      console.error("transaction not found");
    }

    if (!response.length || !paymentResult) return redirect('/event');

    return {
      pageData: response[0],
      reqTransID: query.rtrxid,
      paymentResult,
    }
  },
  head() {
    return {
      title: "Payment Completed",
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.paymentResult.status === "pending") {
        this.$nuxt.$loading.start({
          screen: true,
          message: "ระบบกำลังดำเนินการชำระเงิน",
        });
        const pullingTimer = setInterval(async () => {
          const result = await this.checkPaymentStatus();

          if (result.success && result.data.status !== "pending") {
            clearInterval(pullingTimer);
            this.paymentResult = result.data;
            this.$nuxt.$loading.finish();
          }
        }, 5000);
      }
    });
  },
  methods: {
    async checkPaymentStatus() {
      try {
        const accessToken = this.$auth.strategy.token.get();
        const response = await this.$axios.$get(
          `/event-transactions/request/${this.reqTransID}/status`,
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
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.payment-complete {
  padding-top: 164px;
  padding-bottom: 84px;
  background-color: #001811;
  background-size: cover;
  background-position: bottom left;
  background-repeat: no-repeat;

  @media screen and (max-width: $md) {
    padding-top: 104px;
    padding-bottom: 24px;
  }

  .content {
    background-color: #ffffff;
    border-radius: 5px;
    padding: 32px;
  }

  .wrap-loading {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.green-underscore {
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -90%;
    transform: translate(-50%, -50%);
    display: inline-block;
    height: 1em;
    width: 36px;
    border-bottom: 4px solid #1797AD;
  }
}
</style>
