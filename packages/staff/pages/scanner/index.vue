<template>
  <div>
    <AppHeader
      :left="{
        text: 'Back',
        icon: 'chevron-left',
        callback: () => $router.push('/account'),
      }"
    />
    <AlertToast />
    <div class="container _pdt-32px">
      <TextHeading title="QR Code Scanner" />
      <p class="_tal-ct _mgt-24px _mgbt-32px">
        แสกน QR ของลูกค้าเพื่อบันทึกการเข้าใช้บริการ
      </p>
      <sl-tab-group
        @sl-tab-show="(e) => handleTabs({ type: 'show', name: e.detail.name })"
        @sl-tab-hide="(e) => handleTabs({ type: 'hide', name: e.detail.name })"
        ref="tabGroup"
      >
        <sl-tab class="tab-scanner" slot="nav" panel="form">
          <span class="_fs-5 _fw-700">Form</span>
        </sl-tab>
        <sl-tab class="tab-scanner" slot="nav" panel="camera">
          <span class="_fs-5 _fw-700">Camera</span>
        </sl-tab>

        <sl-tab-panel name="form">
          <sl-form class="form-formdata" @sl-submit="onSubmit">
            <sl-input
              name="userID"
              variant="text"
              label="User"
              ref="input"
              :value="formData.userID"
              @sl-input="(e) => (formData.userID = e.target.value)"
              @sl-focus="isFocused = true"
              @sl-blur="isFocused = false"
              required
            ></sl-input>
            <br />
            <v-sl-button
              type="primary"
              class="_dp-b _w-100pct _mgbt-12px"
              submit
            >
              Check-in
            </v-sl-button>
          </sl-form>
        </sl-tab-panel>
        <sl-tab-panel name="camera"></sl-tab-panel>
      </sl-tab-group>
      <client-only>
        <QRScanner @decode="onDecode" v-if="showQRScanner" />
      </client-only>
    </div>
  </div>
</template>

<script>
import vSlButton from "../../../admin/components/vSlButton.vue";
export default {
  components: { vSlButton },
  middleware: "auth",
  data() {
    return {
      success: false,
      error: false,
      pending: false,
      autofocus: true,
      intervalFocus: "",
      showQRScanner: false,
      isFocused: false,
      formData: {
        userID: "",
      },
    };
  },
  methods: {
    async onDecode(value) {
      if (!this.pending) {
        this.pending = true;

        const result = await this.checkIn(value);

        if (result.success) {
          const { data } = result;
          this.$store.commit("SET_BY_KEY", {
            key: "scannerData",
            value: {
              firstName: data.data.user.first_name,
              lastName: data.data.user.last_name,
              date: data.date,
              scannerType: "camera",
            },
          });
          this.$router.push(`/scanner/success`);
        } else {
          this.$router.push(`/scanner/failed`);
        }
      }
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        // if (error.name === 'NotAllowedError') {
        //   this.error = 'ERROR: you need to grant camera access permisson'
        // } else if (error.name === 'NotFoundError') {
        //   this.error = 'ERROR: no camera on this device'
        // } else if (error.name === 'NotSupportedError') {
        //   this.error = 'ERROR: secure context required (HTTPS, localhost)'
        // } else if (error.name === 'NotReadableError') {
        //   this.error = 'ERROR: is the camera already in use?'
        // } else if (error.name === 'OverconstrainedError') {
        //   this.error = 'ERROR: installed cameras are not suitable'
        // } else if (error.name === 'StreamApiNotSupportedError') {
        //   this.error = 'ERROR: Stream API is not supported in this browser'
        // }
      }
    },
    async onSubmit(e) {
      if (this.formData.userID) {
        const result = await this.checkIn(this.formData.userID);
        if (result.success) {
          const user = result.data.data.user;
          this.__showToast({
            type: "success",
            title: "Check-in Successfully",
            message: `คุณ ${user.first_name} ${user.last_name}`,
          });
        } else {
          this.__showToast({
            type: "danger",
            title: "Check-in Failed",
            message: result.error,
          });
        }
        this.formData.userID = "";
      }
    },
    async checkIn(userID) {
      try {
        const data = {
          userId: userID,
          branch: this.$store.state.auth.user.branch,
        };

        const token = this.$auth.strategy.token.get();

        const response = await this.$axios.$post("/api/create-log", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return { success: true, data: response };
      } catch (e) {
        let message = "Something Wrong!!";

        if (e.response && e.response.data) {
          message = e.response.data.message;
        }

        return { success: false, error: message };
      }
    },
    handleTabs({ type, name }) {
      if (name === "form") {
        if (type === "hide") {
          this.stopAutoFocus();
        } else {
          this.runAutoFocus();
        }
      } else if (name === "camera") {
        this.showQRScanner = type === "show" ? true : false;
      }
    },
    focusInput() {
      try {
        this.$refs.input.focus();
      } catch (error) {}
    },
    runAutoFocus() {
      this.intervalFocus = setInterval(() => {
        if (!this.isFocused) {
          this.focusInput();
        }
      }, 800);
    },
    stopAutoFocus() {
      clearInterval(this.intervalFocus);
    },
  },
  mounted() {
    const { query } = this.$route;

    setTimeout(() => {
      if (query.type && ["camera", "form"].indexOf(query.type) >= 0) {
        this.$refs.tabGroup.show(query.type);
      }

      if (this.autofocus) {
        this.focusInput();
        this.runAutoFocus();
      }
    }, 0);
  },
  beforeDestroy() {
    this.stopAutoFocus();
  },
};
</script>

<style lang="scss" scoped>
.tab-scanner {
  margin-bottom: -1px;
  flex-grow: 1 !important;
  text-align: center !important;

  &[active] {
    background-color: #1797ad;

    &::part(base) {
      color: #ffffff !important;
    }
  }
}
</style>
