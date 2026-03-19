<template>
  <div v-if="columns">
    <template>
      <Header title="ATK Approvement" />
      <div class="user-filters _mgbt-24px _pdh-0px-md _pdh-4px">
        <div class="-left" v-if="optionsData.branches">
          <div class="branches">
            <SelectInput
              label="Branch"
              :options="optionsData.branches"
              :value="searchForm.branch"
              @input="(value) => (searchForm.branch = value)"
            />
          </div>
          <div class="phone">
            <TextInput
              label="Phone"
              :clearable="true"
              :value="searchForm.phone"
              @input="(value) => (searchForm.phone = value)"
            />
          </div>
          <div class="email">
            <TextInput
              label="Email"
              :clearable="true"
              :value="searchForm.email"
              @input="(value) => (searchForm.email = value)"
            />
          </div>
          <div class="search-button _mgt-24px">
            <v-sl-button type="primary" @click="submitSearch()">
              Search
            </v-sl-button>
          </div>
        </div>
      </div>
      <template v-if="rows && rows.length">
        <Table
          :columns="columns"
          :rows="rows"
          @changeSort="(newSort) => (sort = newSort)"
          :actions="{
            edit: false,
            view: false,
            remove: false,
          }"
          class="_dp-b-md _dp-n"
          :sort="sort"
        >
          <template #head>
            <th>ATK Status</th>
            <th></th>
          </template>
          <template #content="{ row }">
            <td class="_tal-ct">
              <sl-tag
                v-if="!!row.atkStatus"
                class="_mgr-8px"
                size="small"
                :type="ATKStatusTag(row.atkStatus)"
                ><span
                  class="_fs-5-md"
                  v-html="row.atkStatus ? __capitalize(row.atkStatus) : ''"
                ></span
              ></sl-tag>
              <span v-else>-</span>
            </td>
            <td>
              <template v-if="!row.atkStatus || row.atkStatus === 'expired'">
                <div class="_dp-f _jtfct-fe _alit-ct">
                  <v-sl-button
                    class="_mgh-2px"
                    size="small"
                    type="success"
                    @click="handleATKAction(row, 'approved')"
                  >
                    <i class="far fa-check"></i>
                    <span>Approve</span>
                  </v-sl-button>
                  <v-sl-button
                    class="_mgh-2px"
                    size="small"
                    type="danger"
                    @click="handleATKAction(row, 'rejected')"
                  >
                    <i class="far fa-times"></i>
                    <span>Reject</span>
                  </v-sl-button>
                </div>
              </template>
            </td>
          </template>
        </Table>
        <div class="_dp-n-md">
          <sl-card
            class="booking-card _mgbt-24px"
            v-for="(row, r) in rows"
            :key="`mobile-row-${r}`"
          >
            <div class="_bdbtw-1px _bdcl-gray-200 _pdbt-16px _mgbt-12px">
              <div class="_dp-f _jtfct-spbtw _alit-ct">
                <div class="_dp-f _alit-ct">
                  <h4 class="_fs-6 _mgr-12px">#{{ row.id }}</h4>
                </div>
                <div class="_dp-f _alit-ct"></div>
              </div>
            </div>
            <div>
              <div class="row">
                <div class="col-5 _mgbt-8px">
                  <label for="">First Name</label>
                  <p v-html="row.first_name"></p>
                </div>
                <div class="col-7">
                  <label for="">Last Name</label>
                  <p v-html="row.last_name"></p>
                </div>
                <div class="col-5 _mgbt-8px">
                  <label for="">Phone</label>
                  <p v-html="row.phone"></p>
                </div>
                <div class="col-7">
                  <label for="">Email</label>
                  <p v-html="row.email"></p>
                </div>
                <div class="col-5">
                  <label for="">ATK Status</label>
                  <p>
                    <sl-tag
                      v-if="!!row.atkStatus"
                      class="_mgr-8px"
                      size="small"
                      :type="ATKStatusTag(row.atkStatus)"
                      ><span
                        v-html="
                          row.atkStatus ? __capitalize(row.atkStatus) : ''
                        "
                      ></span
                    ></sl-tag>
                    <span v-else>-</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="_bdtw-1px _bdcl-gray-200 _pdt-16px _mgt-16px">
              <template v-if="!row.atkStatus || row.atkStatus === 'expired'">
                <div class="_dp-f _jtfct-fe _alit-ct">
                  <v-sl-button
                    class="_mgh-2px"
                    type="success"
                    @click="handleATKAction(row, 'approved')"
                  >
                    <i class="far fa-check"></i>
                    <span>Approve</span>
                  </v-sl-button>
                  <v-sl-button
                    class="_mgh-2px"
                    type="danger"
                    @click="handleATKAction(row, 'rejected')"
                  >
                    <i class="far fa-times"></i>
                    <span>Reject</span>
                  </v-sl-button>
                </div>
              </template>
            </div>
          </sl-card>
        </div>
      </template>
      <EmptyState label="ผู้ใช้" v-else />
      <Pagination
        :count="count"
        :activePage="page"
        @changePage="changePage"
        v-if="rows && rows.length"
      />
    </template>
  </div>
</template>

<script>
import SelectInput from "~/components/form/SelectInput";
import TextInput from "~/components/form/TextInput";

export default {
  components: {
    SelectInput,
    TextInput,
  },
  layout: "admin",
  middleware: "auth",
  data() {
    return {
      loading: false,
      rows: null,
      count: null,
      page: 1,
      columns: [
        {
          label: "First Name",
          key: "first_name",
          align: "left",
        },
        {
          label: "Last Name",
          key: "last_name",
          align: "center",
        },
        {
          label: "Phone",
          key: "phone",
          align: "center",
        },
        {
          label: "Email",
          key: "email",
          align: "center",
        },
      ],
      optionsData: {
        branches: null,
      },
      // Filter Data
      searchForm: {
        branch: null,
        citizenID: null,
        phone: null,
        email: null,
      },
      sort: {
        key: "id",
        direction: "DESC",
      },
    };
  },
  computed: {
    _currentLocale() {
      return this.$store.state.currentLocale;
    },
  },
  watch: {
    async sort(newVal) {
      this.page = 1;
    },
  },
  methods: {
    async fetchData() {
      // Gather all query data and turn it into queryString
      const { citizenID, phone, email } = this.searchForm;
      const query = this.$qs.stringify({
        ...(citizenID ? { citizen_id: citizenID } : {}),
        ...(phone ? { phone: phone } : {}),
        ...(email ? { email: email } : {}),
      });

      const { rows, count } = await this.__fetchContentType(
        {
          path: "users",
          query,
        },
        { sort: this.sort, page: 1 },
      );

      let users = rows;
      if (rows && rows.length) {
        users = this.transformUsers(rows);
      }

      this.rows = users;
      this.count = count;
    },

    ///////////////////////////////////
    // Custom for ATK User Management
    ///////////////////////////////////
    transformUsers(users) {
      return users.map((user) => {
        const now = new Date();
        const atkExpiredDate =
          user.atk_expired_at && new Date(user.atk_expired_at);
        const atkLogs = user.atk_logs;
        let atkStatus = null;

        if (atkExpiredDate && atkExpiredDate > now) {
          atkStatus = "approved";
        } else if (atkLogs && atkLogs.length) {
          atkLogs.sort((a, b) => {
            const result = a.created_at < b.created_at ? 1 : -1;
            return a.created_at === b.created_at ? 0 : result;
          });

          if (
            atkLogs[0].status === "rejected" &&
            this.isSameDay(now, new Date(atkLogs[0].created_at))
          ) {
            atkStatus = "rejected";
          } else if (atkExpiredDate) {
            atkStatus = "expired";
          }
        }

        return { ...user, atkStatus };
      });
    },
    ATKStatusTag(status) {
      let result = "neutral";

      switch (status) {
        case "approved":
          result = "success";
          break;
        case "rejected":
          result = "danger";
          break;
        case "expired":
          result = "warning";
          break;
      }

      return result;
    },
    isSameDay(date1, date2) {
      return (
        date1.getDate() == date2.getDate() &&
        date1.getMonth() == date2.getMonth() &&
        date1.getFullYear() == date2.getFullYear()
      );
    },
    async getATKLogs(params) {
      const query = this.$qs.stringify(params);

      return this.$axios.$get(`/atk-logs/?${query}`);
    },
    async handleATKAction(user, status) {
      const { branch } = this.searchForm;
      if (!branch) {
        return this.__showToast({
          type: "danger",
          title: 'Please select "Branch"',
        });
      }
      const data = {
        userID: user.id,
        branch,
        status,
      };
      this.$swal({
        title: `คุณต้องการ ${this.__capitalize(status)} ATK?`,
        text: `บัญชี: ${user.first_name} ${user.last_name}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        reverseButtons: true,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const result = await this.__createContentType("atk-logs", data);
            if (result) {
              this.__showToast({
                type: "success",
                title: `User ATK ${status}`,
              });
              await this.submitSearch();
            }
          } catch (e) {
            this.__showToast({
              type: "danger",
              title: (e.response && e.response.error) || e.message,
            });
          }
        }
      });
    },
    async submitSearch() {
      const { branch, citizenID, phone, email } = this.searchForm;
      if (branch && (phone || citizenID || email)) {
        await this.fetchData();
      } else {
        this.__showToast({
          type: "danger",
          title:
            'Please select "Branch" and enter at least one user information',
        });
      }
    },
  },
  async mounted() {
    const branches = await this.$axios.$get(`/branches?_limit=-1`);
    this.optionsData["branches"] = [
      {
        label: "-",
        value: null,
      },
      ...branches.map((val) => ({
        label: val["name"],
        value: val["id"],
      })),
    ];
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/styles/variables";

.user-filters {
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

    @media screen and (max-width: $md) {
      display: block;
    }

    > div {
      margin-left: 4px;
      margin-right: 4px;

      &.branches {
        min-width: 240px;
      }

      &.status {
        min-width: 120px;
      }

      &.date {
        width: 130px;
      }

      @media screen and (max-width: $md) {
        margin-left: 0;
        margin-right: 0;
        width: 100%;
        margin-bottom: 12px;

        &:last-of-type {
          margin-bottom: 0;
        }

        &.branches {
          min-width: none;
        }

        &.status {
          min-width: none;
        }

        &.date {
          width: 100%;
        }
      }
    }
  }

  .-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    @media screen and (max-width: $md) {
      > div {
        flex: 1;
      }
    }
  }
}

.booking-card {
  label {
    color: #738689;
    font-size: 12px;
    font-weight: 500;
  }

  p {
    color: #323738;
  }

  a {
    color: $primary-color;
    text-decoration: none;

    span {
      font-weight: 700;
    }
  }
}
</style>
