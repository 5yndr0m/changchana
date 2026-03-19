<template>
  <div class="alert-toast" id="alertToast"></div>
</template>

<script>
export default {
  computed: {
    _toastData() {
      return this.$store.state.toastData;
    },
  },
  watch: {
    _toastData(newVal) {
      let { type, title, message } = newVal;
      let alertToast = document.getElementById("alertToast");

      let icon =
        type === "success"
          ? "check"
          : type === "danger"
          ? "exclamation-triangle"
          : "info-square";

      const alert = Object.assign(document.createElement("sl-alert"), {
        type: type,
        closable: true,
        duration: 3000,
        innerHTML: `
                <div class="_pdl-16px" slot="icon"><i class="fas fa-${icon}"></i></div>
                <strong>${title}</strong><br>
                ${message ? `<span>${message}</span>` : ``}
              `,
      });

      alertToast.append(alert);
      return alert.toast();
    },
  },
  mounted() {},
};
</script>
