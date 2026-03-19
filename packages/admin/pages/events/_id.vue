<template>
  <div>
    <ContentEditPage 
      :fields="fields"
      :sidebarFields="sidebarFields" 
      :contentType="contentType.path"
      :initValue="initValue" 
      :title="title" 
      :linkBack="linkBack" 
      :customLink="customLink" 
      :readonly="readonly" 
      :disableDelete="disableDelete"
      />
  </div>
</template>

<script>
export default {
  layout: "admin",
  middleware: "auth",
  async asyncData({ store, params }) {
    const configs = store.state.configs["events"];
    const { sidebarFields, initValue, linkBack, contentType } = configs;

    return {
      sidebarFields,
      initValue,
      title: `${ params.id === "create" ? "Create" : "Edit"} Event`,
      contentType,
      linkBack,
    };
  },
  data() {
    const eventID = this.$route.params.id;
    const { fields } = this.$store.state.configs.events;
    return {
      customLink: eventID !== "create" ? [{
        label: "จัดการรูปโซน",
        path: `zones/${eventID}`,
      }] : [],
      readonly: false,
      fields,
      disableDelete: false,
    }
  },
  methods: {
    async fetchTicketData() {
      const eventID = this.$route.params.id;

      if (eventID !== "create") {
        this.loading = true;
        const { count } = await this.$axios.$get(`/events/${eventID}/transactions?objectReturn[]=count`);
        this.loading = false;

        if (count > 0) {
          this.fields = this.fields.map(field => ({
            ...field,
            ...field.repeatable === true && { readonly : true }
          }));
          this.customLink.push({
            label: "Ticket",
            path: `transactions/${eventID}`,
          });
          this.disableDelete = true;
        }
      }
    },
  },
  async mounted() {
    this.fetchTicketData();
  }
};
</script>
