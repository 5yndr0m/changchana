<template>
  <div v-if="!loading">
    <section class="hero">
      <div class="container-right">
        <div class="row _alit-ct _jtfct-spbtw _fdrt-r-md _fdrt-clrv">
          <div class="col-md-7 _pst-rlt">
            <div
              class="image"
              :style="{
                backgroundImage: `url('${
                  pageData.coverImageUrl || ''
                }')`,
              }"
            ></div>

            <div class="decoration">
              <img src="~assets/images/news/hero_dec.svg" alt="" />
            </div>
          </div>
          <div class="col-md-4 _mgbt-0px-md _mgbt-24px">
            <h4 class="section-hero-label _mgbt-24px">
              <span class="hero-label">concert</span>
            </h4>
            <h1 class="_fs-2-md _fs-3 _mgbt-24px" v-html="pageData.title"></h1>
            <p class="_mgbt-24px _tal-l-md _tal-ct">
              <i class="far fa-calendar-day"></i>
              {{ textRoundDate() }}
              <br />
              <i class="fas fa-map-marker-alt"></i>
              <span class="hero-location">{{ pageData.branchName }}</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="content _mgbt-64px-md _mgbt-48px">
      <div class="container">
        <div class="row">
          <div v-if="pageData.sellingType === 'ticket'" class="col-md-6 _tal-ct custom-sticky-top">
            <img class="stage-image" :src="pageData.stageImageUrl" />
          </div>
          <div :class="`col-md-6 order-lg-first ${pageData.sellingType === 'walk_in' && 'offset-md-3'}`">
            <div v-if="pageData.sellingType === 'ticket'" class="zone-detail-list">
              <div class="zone-detail"
                v-for="(zone, index) in pageData.zones"
                :key="index"
                :style="{
                  background: zone.bg_color || 'none',
                  color: zone.text_color || '#ffffff',
                }"
              >
                <div class="zone-icon">
                  <span
                    class="avatar-zone _fw-600"
                    :style="{
                      color: zone.bg_color || '#ffffff',
                      background: zone.text_color || '#ffffff',
                    }"
                  >
                    {{ zone.name }}
                  </span>
                </div>
                <div class="zone-desc">
                  <p :style="{ color: zone.text_color || '#ffffff' }">
                    <i :style="{ color: zone.text_color || '#ffffff' }" class="far fa-money-bill"></i> <span class="_fw-600 ">{{ zone.price }} บาท</span><span class="_fw-600 " v-if="zone.points"> + {{zone.points}} Point</span>
                  </p>
                  <p :style="{ color: zone.text_color || '#ffffff' }" v-html="zone.description"></p>
                </div>
              </div>
            </div>
            <div v-if="pageData.sellingType === 'ticket'" class="concert-round">
              <TopicSelector
                :options="pageData.rounds.map((r) => ({ label: $moment(r.date).format('dddd, D MMM YYYY'), value: r.id }))"
                @onChange="onChangeRound"
              />
              <div class="concert-round-body">
                <div class="loading-table text-center" v-show="loadingTable">
                  <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>

                <div v-if="pageData.status === 'publish' && !isRoundAvailable(selectedRound)">คอนเสิร์ตรอบนี้ถูกจัดไปแล้ว กรุณาเลือกรอบถัดไป</div>
                <div v-else-if="pageData.status === 'publish'" class="wrap-round-list">
                  <div v-for="(round) in pageData.rounds" :key="round.id">
                    <div
                      :id="`round-${round.id}`"
                      v-if="Number(selectedRound) === Number(round.id)" 
                    >
                      <div class="zone-table" v-for="(zone, index) in pageData.zones" :key="index">
                        <div class="_fs-5 _fw-600 _mgbt-16px">Zone {{zone.name}} - {{zone.price}} บาท</div>
                        <div class="table-item row row-cols-3">
                          <div class="col" v-for="(tableNumber, index) in zone.number_of_table" :key="index">
                            <div class="form-check _mgbt-16px">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                v-model="order.tables"
                                @change="onChangeTable"
                                :disabled="isTableReserved(round.id, zone.id, index)"
                                :name="zone.id"
                                :value="valueTableCheckbox(round.id, zone.id, index)"
                                :id="`table-${zone.name}${index}`"
                              >
                              <label class="form-check-label" :for="`table-${zone.name}${index}`">
                                {{ zone.name }}{{ tableNumber }}<a class="preview-table" v-if="getTableImageURL(zone.table_images[index])" @click="(e) => previewTableImage(e, getTableImageURL(zone.table_images[index]))" href="#previewTable"><i class="far fa-image"></i></a>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="payment _dp-f _jtfct-spbtw">
                        <div class="reserve-summary">
                          <p>ราคาสุทธิ: {{ order.total }} บาท</p>
                          <p>คงเหลือ {{ userTablesLeft }} สิทธิ์สำหรับคุณ</p>
                        </div>
                        <div>
                          <PaymentButton
                            v-if="isOmiseLoaded"
                            :onCheckout="onCheckout"
                            :onClosed="onPaymentCompleted"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="pageData.status === 'comming_soon'">Coming Soon</div>
                <div v-else-if="pageData.status === 'walk_in'">บัตรขายหมดแล้วกรุณา Walk in แทน</div>
                <div v-else-if="pageData.status === 'sold_out'">บัตรขายหมดแล้ว</div>
                <div v-else>ขออภัยเกิดข้อผิดพลาด (unknow status)</div>
              </div>
            </div>
            <div class="concert-description" >
              <h4 class="_fs-4-md _fs-5 _mgbt-16px _tal-l-md _tal-ct">
                รายละเอียดกิจกรรม
              </h4>
              <div class="_mgbt-24px _tal-l-md _tal-ct" v-html="pageData.content"></div>
              <div class="content-footer">
                <div class="meta">
                  <p>
                    Published on
                    <span
                      v-html="$moment(pageData.published_at).format('DD MMMM YYYY')"
                    ></span>
                  </p>
                </div>
                <div class="share">
                  <p>Share to</p>
                  <div class="a2a_kit a2a_kit_size_32 a2a_default_style socials">
                    <a class="a2a_button_facebook">
                      <i class="fab fa-facebook"></i>
                    </a>
                    <a class="a2a_button_twitter">
                      <i class="fab fa-twitter"></i>
                    </a>
                    <a class="a2a_button_line">
                      <i class="fab fa-line"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import qs from "qs";
import TopicSelector from "~/components/TopicSelector";
import PaymentButton from "~/components/Payment";

export default {
  components: {
    TopicSelector,
    PaymentButton,
  },
  layout: 'main',
  middleware: function ({ redirect, store, params }) {
    if(!store.state.auth.loggedIn) {
      return redirect(`/signin?redirect=event/${params.slug}`)
    }
  },
  async asyncData({ $axios, params, redirect }) {
    const { slug } = params;

    if (!slug) return redirect('/event');

    const response = await $axios.$get(
      `/events?slug=${encodeURIComponent(slug)}`
    );

    if (!response.length) return redirect('/event');

    const [concert] = response;

    return {
      isOmiseLoaded: false,
      loading: true,
      loadingTable: false,
      pageData: {
        eventID: concert.id,
        title: concert.title,
        type: concert.type,
        content: concert.description,
        coverImageUrl: concert.cover_image && concert.cover_image.url,
        stageImageUrl: concert.stage_image && concert.stage_image.url,
        publishedAt: concert.published_at,
        branchName: concert.branch && concert.branch.name,
        zones: concert.zones,
        rounds: concert.rounds,
        limitPerUser: concert.limit_per_user,
        status: concert.status,
        sellingType: concert.selling_type,
      },
      isSellingTicket: concert.selling_type === "ticket" && concert.status === "publish",
      selectedRound: concert.rounds[0].id,
      countUserReservedTable: 0,
      userTablesLeft: concert.limit_per_user,
      reservedTables: [],
      order: {
        tables: [],
        total: 0,
      },
    };
  },
  head() {
    let seoData = this.$store.state.settings.seo
    let title = this.pageData.title ? this.pageData.title : seoData.title || ''
    let description = this.pageData.excerpt
      ? this.pageData.excerpt
      : seoData.description
    // let keywords = seoData.keywords || ''

    let image
    if (this.pageData.cover_image) {
      image = this.pageData.cover_image.url
    } else {
      if (seoData.image) {
        image = seoData.image.url
      } else {
        image = ''
      }
    }

    return {
      title: title,
      meta: [
        {
          hid: 'title',
          property: 'title',
          content: title,
        },
        {
          hid: 'description',
          property: 'description',
          content: description,
        },
        // {
        //   hid: 'keywords',
        //   property: 'keywords',
        //   content: keywords,
        // },
        // Open Graph
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: image,
        },
        // Twitter Card
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: title,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: description,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: image,
        },
        {
          hid: 'twitter:image:',
          name: 'twitter:image:alt',
          content: 'Chongjaroen',
        },
      ],
      script: [
        {
          hid: 'omise',
          async: false,
          defer: true,
          src: 'https://cdn.omise.co/omise.js',
          body: true,
          callback: () => {
            let otherPaymentMethods = process.env.omise.otherPaymentMethods ? process.env.omise.otherPaymentMethods.split(",") : null;

            if (!this.$device.isMobile && otherPaymentMethods && otherPaymentMethods.length > 0) {
              otherPaymentMethods = otherPaymentMethods.filter((method) => method.indexOf("mobile_banking") === -1);
            }

            OmiseCard.configure({
              publicKey: process.env.omise.publicKey,
              image: "https://chongjaroen.com/favicon.png",
              currency: "THB",
              hideAmount: true,
              locale: "th",
              defaultPaymentMethod: process.env.omise.defaultPaymentMethod || "credit_card",
              otherPaymentMethods,
            });
            OmiseCard.attach();
            this.isOmiseLoaded = true
          }, 
        },
      ],
    }
  },
  created() {
    this.$nextTick(function() {
      this.loading = false;
    });
  },
  mounted() {
    setTimeout(async () => {
      if (a2a) a2a.init_all();

      if (this.isSellingTicket) {
        this.loadingTable = true;
        await this.fetchReservedTable(this.pageData.eventID, this.selectedRound);
        await this.fetchCountUserReservedTable(this.pageData.eventID);
        this.loadingTable = false;
      }
    }, 0)
  },
  watch: {
    countUserReservedTable(newVal) {
      this.userTablesLeft = this.pageData.limitPerUser - newVal - this.order.tables.length;
    }
  },
  methods: {
    onChangeTable(e) {
      let total = 0; 
      const userTableQuota = this.pageData.limitPerUser - this.countUserReservedTable;

      if (e && this.order.tables.length > userTableQuota) {
       this.order.tables.pop();
        e.target.checked = false;
        return this.$swal({
          icon: "warning",
          text: "สิทธิ์ในการจองของคุณหมดแล้ว",
        });
      }

      this.order.tables.forEach((tb) => {
        const [roundID, zoneID] = tb.split("|");
        const zone = this.pageData.zones.find((z) => `${z.id}` === zoneID);

        if (zone) {
          total += zone.price;
        }
      });

      this.userTablesLeft = userTableQuota - this.order.tables.length;
      this.order.total = total;
    },
    async onChangeRound(roundID) {
      this.selectedRound = roundID;
      this.order.tables = [];
      this.onChangeTable();

      if (this.isSellingTicket && this.isRoundAvailable(roundID)) {
        this.loadingTable = true;
        await this.fetchReservedTable(this.pageData.eventID, this.selectedRound);
        this.loadingTable = false;
      }
    },
    onCheckout(checkout) {
      if (this.order.tables.length === 0) {
        return this.$swal({
          icon: "warning",
          text: "กรุณาเลือกโต๊ะที่ต้องการจอง",
        });
      }

      let redeemPoints = 0;
      const tables = this.order.tables.map((val) => {
        const table = this.valueTableCheckboxToObject(val);
        const zone = this.pageData.zones.find((z) => `${z.id}` === `${table.zoneID}`);

        if (zone && zone.points) {
          redeemPoints += zone.points;
        }

        return table;
      });

      const user = this.$store.state.auth.user;
      if (user && user.points < redeemPoints) {
        return this.$swal({
          icon: "warning",
          text: `คุณมี points ไม่พอสำหรับจองโต๊ะ ต้องการ ${redeemPoints} points สำหรับการจอง`,
        });
      }

      const order = {
        eventID: this.pageData.eventID,
        tables,
        price: this.order.total,
        points: redeemPoints,
      };

      checkout(order);
    },
    onPaymentCompleted(success, isConfirmed) {
      if (success && isConfirmed) {
        this.$router.push(`/ticket`);
      } else {
        window.location.reload();
      }
    },
    getTableImageURL(tableImage) {
      return tableImage && tableImage.image && tableImage.image.url;
    },
    previewTableImage(event, imageUrl) {
      event.preventDefault();

      if (imageUrl) {
        this.$swal({
          imageUrl: imageUrl,
          imageWidth: 500,
          confirmButtonText: "ปิด",
          customClass: {
            confirmButton: "btn-outline-light",
          },
        });
      }
    },
    textRoundDate() {
      const { rounds } = this.pageData;
      return rounds.map(r => this.$moment(r.date).format('dddd, D MMM YYYY')).join(", ");
    },
    valueTableCheckbox(roundID, zoneID, tableIndex) {
      return `${roundID}|${zoneID}|${tableIndex}`;
    },
    valueTableCheckboxToObject(value) {
      const [roundID, zoneID, tableIndex] = value.split("|");
      return { roundID, zoneID, tableIndex };
    },
    isTableReserved(roundID, zoneID, tableIndex) {
      return !!this.reservedTables.find((table) => 
        table.table_number == tableIndex
        && table.round_id == roundID
        && table.zone_id == zoneID
      );
    },
    isRoundAvailable(roundID) {
      return !!this.pageData.rounds.find((r) => `${r.id}` === `${roundID}` && r.date >= this.$moment().format("YYYY-MM-DD"));
    },
    async fetchReservedTable(eventID, roundID) {
      const filters = qs.stringify({
        round_id: roundID,
      });
      let token = this.$auth.strategy.token.get();
      const response = await this.$axios.$get(
        `/api/events/${eventID}/tables/reserved?${filters}`,
        {
          headers: { Authorization: token },
        }
      );

      if (response && response.data) {
        this.reservedTables = response.data;
      }
    },
    async fetchCountUserReservedTable(eventID) {
      let token = this.$auth.strategy.token.get();
      const response = await this.$axios.$get(
        `/api/events/${eventID}/user/table/count`,
        {
          headers: { Authorization: token },
        }
      );

      if (response && response.hasOwnProperty("count")) {
        this.countUserReservedTable = response.count;
      }
    },
  },
  beforeDestroy() {
    if (OmiseCard) {
      OmiseCard.destroy();
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.loading-table {
  position: absolute;
  padding-top: 50%;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: #021811;
  opacity: 0.9;
  z-index: 999;
}

.concert-round-body {
  position: relative;
  padding: 15px;
  margin-top: 20px;
  background-color: #122326;
  border-radius: 8px;
}

.concert-description  {
  &:deep(img) {
    width: 100%;
  }
}

.stage-image {
  width: 100%;

  @media screen and (max-width: $md) {
    max-width: 560px;
  }
}

.concert-round {
  margin-bottom: 40px;
  color: #ffffff;
}

.zone-detail-list {
  margin-bottom: 64px;
}

.zone-detail {
  display: flex;
  margin-bottom: 16px;
  color: #ffffff;
  padding: 14px;
  border-radius: 8px;

  .avatar-zone {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    line-height: 48px;
    text-align: center;
    background: #ffffff;
    display: inline-block;
    margin: 0 auto;
  }
  .zone-icon {
    margin: auto 0;
  }

  .zone-desc {
    line-height: 1.5;
    margin-left: 16px;

    i {
      color: #E0E0E0;
    }
  }
}

.zone-table {
  margin-bottom: 36px;
  .preview-table {
    margin-left: 16px;
    color: #B0C1C4;
    font-size: 15px;
  }
}

.reserve-summary {
  p {
    color: #B0C1C4;
  }
}

.custom-sticky-top {
  margin-bottom: 16px;

  @media screen and (min-width: $md) {
    position: -webkit-sticky;
    position: sticky;
    top: 5rem;
    right: 0;
    z-index: 2;
    height: calc(100vh - 7rem);
    overflow-y: auto;
  }
}

.hero-label {
  font-size: 14px !important;
}

.hero-location {
  font-weight: 600;
  font-size: 14px !important;
  line-height: 1;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.hero {
  padding-top: 164px;
  padding-bottom: 84px;
  background-color: #001811;
  background-image: url('~assets/images/campaign_hero_bg.jpg');
  background-size: cover;
  background-position: bottom left;
  background-repeat: no-repeat;

  @media screen and (max-width: $md) {
    padding-top: 104px;
    padding-bottom: 24px;
  }

  .image {
    width: 100%;
    height: auto;
    padding-top: 56.25%;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: #e2e2e2;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    z-index: 5;

    @media screen and (max-width: $md) {
      border-radius: 0;
    }
  }

  .decoration {
    position: absolute;
    width: 180px;
    height: auto;
    bottom: -40px;
    right: -50px;

    @media screen and (max-width: $md) {
      display: none;
    }

    img {
      width: 100%;
      height: auto;
    }
  }

  .container-right {
    .col-md-7 {
      @media screen and (max-width: $md) {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
}

.content {
  position: relative;

  .container {
    // max-width: 730px;
    position: relative;
    z-index: 5;
  }

  .decoration {
    position: absolute;

    @media screen and (max-width: $md) {
      display: none;
    }

    &.-middle {
      top: 50%;
      transform: translateY(-50%);
      left: -90px;
    }

    &.-bottom {
      bottom: 0;
      right: -90px;
    }
  }
}
</style>
