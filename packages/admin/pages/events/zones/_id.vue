<template>
  <div>
    <Loading :loading="loading" />
    <div class="_fs-3-md _tal-l-md _tal-ct ">
      <i class="fas fa-chevron-left icon-back" @click="back"></i>
      <h3 class="_dp-il">จัดการรูปภาพโต๊ะ</h3>
    </div>
    <div class="tools-filters _pdh-0px-md _pdh-4px _mgt-12px">
      <div class="-left" v-if="optionsData.zones">
        <div class="select-zone">
          <SelectInput label="เลือกโซนที่ต้องการจัดการ" 
            :options="optionsData.zones" 
            :value="filters.zone"
            @input="(value) => handleZone(value)" 
            allowEmpty />
        </div>
      </div>
    </div>
    <ContentEdit v-if="filters.zone" 
      :fields="[fieldDataForm]" 
      :value="zone" 
      :disableDelete="true" 
      @save="onSave"
      @update="updateDataToForm" 
      />
      <EmptyState v-else label="กรุณาเลือกโซนที่นั่งเพื่อจัดการรูปภาพโต๊ะ" prefixLabel="" class="_mgt-12px"/>
  </div>
</template>

<script>
import SelectInput from "~/components/form/SelectInput";

export default {
  layout: "admin",
  middleware: "auth",
  components: {
    SelectInput
  },
  data: () => {
    return {
      contentType: "events",
      loading: false,
      event: {},
      zone: {},
      optionsData: {
        zones: [],
      },
      filters: {
        zone: null
      },
      fieldDataForm: {
        label: 'จัดการรูปโซนที่นั่ง',
        key: 'table_images',
        repeatable: true,
        getLabel: (data) => data?.id ? `โต๊ะ: ${data.index + 1}` : "New Content",
        fields: [
          {
            label: 'Table',
            key: 'index',
            type: 'select',
            options: []
          },
          {
            label: 'รูป',
            key: 'image',
            type: 'fileUpload',
          },
        ],
        initValue: {
          index: 0,
        }
      }
    }
  },
  async asyncData({ store, params }) {
    let configs = store.state.configs["events"];
    let { fields, sidebarFields, initValue, linkBack } = configs;

    return {
      fields,
      sidebarFields,
      initValue,
      title: `${params.id === "create" ? "Create" : "Edit"} Event`,
      linkBack,
    };
  },
  methods: {
    async fetchData() {
      this.loading = true;
      const event = await this.$axios.$get(`/${this.contentType}/${this.$route.params.id}?_publicationState=preview`);
      this.event = event;
      this.optionsData.zones = [
        ...event.zones.map((val, index) => ({
          label: `โซน ${val["name"]}`,
          value: val["id"],
        })),
      ];
      this.loading = false;
    },
    back() {
      this.$router.push(`/${this.contentType}/${this.$route.params.id}`);
    },
    handleZone(id) {
      this.filters.zone = id;
      this.zone = this.event.zones.find(row => row.id === id);
      this.fieldDataForm.label = `จัดการรูปโต๊ะโซนที่นั่ง: ${this.zone.name}`;

      const indexs =  this.zone.table_images.map(row => row.index);
      this.fieldDataForm.fields[0].options = [];
      for (let index = 0; index < this.zone.number_of_table; index++) {
        this.fieldDataForm.fields[0].options.push({
          label: `โต๊ะที่: ${index + 1}`,
          value: index,
          disabled: indexs.indexOf(index) >= 0,
        });
      }
    },
    updateDataToForm(data) {
      this.zone = data;
      this.event.zones.forEach((row, index) => {
        if (row.id === this.filters.zone) {
          this.event.zones[index] = data;
        }
      });
    },
    async onSave() {
      try {
        this.loading = true;
        await this.__saveContentType(
          this.contentType,
          this.$route.params.id,
          this.event
        );
        this.loading = false;
        this.__showToast({
          type: "success",
          title: "Save Successfully",
        });
      } catch (err) {
        let message = "There is something wrong.";
        this.loading = false;

        if (err.response) {
          const {
            response: { data: errorData },
          } = err;
          if (errorData.data && errorData.data.errors) {
            const { errors } = errorData.data;
            if (typeof errors === "object" && !Array.isArray(errors)) {
              message = errors[Object.keys(errors)[0]];
            }
          } else if (errorData.message) {
            message = errorData.message;
          }
        }

        this.__showToast({
          type: "danger",
          title: message,
        });
      }
    }
  },
  async mounted() {
    this.fetchData();
  },
};
</script>
<style lang="scss" scoped>
@import "~assets/styles/variables";

.icon-back {
  vertical-align: 4px;
  cursor: pointer;
}

.tools-filters {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  @media screen and (max-width: $md) {
    display: block;
  }

  .-left {
    display: flex;
    align-items: center;
    margin-left: -4px;
    margin-right: -4px;

    >div {
      margin-left: 4px;
      margin-right: 4px;

      &.select-zone {
        min-width: 200px;
      }
    }
  }
}
</style>