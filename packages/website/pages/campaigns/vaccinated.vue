<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <h4 class="_fs-7 _ttf-upc _ltspc-2px" v-html="pageData.hero.label"></h4>
        <h1 class="_fs-1-md _fs-3 _mgv-12px" v-html="pageData.hero.title"></h1>
        <p class="_mgbt-24px" v-html="pageData.hero.description"></p>
        <button class="btn btn-primary" v-scroll-to="{ el: '#campaign-signup', duration: 1200 }">เข้าร่วมกิจกรรม</button>
      </div>

      <div class="container-right _pdl-0px">
        <div class="cover-image">
          <div class="dots">
            <img src="~assets/images/dots.png" alt="" />
          </div>
          <div
            class="image"
            :style="{
              backgroundImage: `url('${
                pageData.hero.cover_image ? pageData.hero.cover_image.url : ''
              }')`
            }"
          ></div>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="content-affix _mgt-48px _mgbt-64px">
      <div class="container">
        <ul class="mobile-menu _dp-n-md _mgv-32px">
          <li
            v-for="(val, i) in pageData.contents"
            :key="`content-mobile-menu-${i}`"
            v-scroll-to="`#content-${i}`"
          >
            <span v-html="val.title"></span>
            <i class="fas fa-arrow-right"></i>
          </li>
        </ul>

        <div class="row">
          <div class="col-md-4 _dp-b-md _dp-n">
            <affix
              class="sidebar-menu"
              relative-element-selector="#main-content"
            >
              <scrollactive>
                <a
                  :href="`#content-${i}`"
                  v-for="(val, i) in pageData.contents"
                  :key="`content-menu-${i}`"
                  v-html="val.title"
                  class="scrollactive-item"
                ></a>
              </scrollactive>
            </affix>
          </div>
          <div class="col-md-8" id="main-content">
            <div
              class="wysiwyg _mgbt-48px"
              v-for="(val, i) in pageData.contents"
              :id="`content-${i}`"
              :key="`content-${i}`"
              v-html="val.content"
            ></div>

            <!-- Content Footer -->
            <div class="content-footer">
              <div class="meta">
                <p>
                  Published on
                  <span
                    v-html="
                      $moment(pageData.published_at).format('DD MMMM YYYY')
                    "
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

            <!-- Campaign Signup -->
            <div class="campaign-signup _mgt-32px" id="campaign-signup">
              <div class="_tal-ct" v-if="!_loggedIn">
                <TextHeading
                  title="โปรดเข้าสู่ระบบเพื่อ เข้าร่วมแคมเปญ"
                  class="_mgbt-24px"
                  small
                />
                <nuxt-link to="/signin?redirect=campaigns/vaccinated" class="btn btn-primary">ลงชื่อเข้าใช้</nuxt-link>
              </div>

              <template v-else>
                <div v-if="!_vaccinated && !submitted">
                  <TextHeading
                    title="กรุณาอัพโหลดไฟล์สำหรับกิจกรรม"
                    class="_mgbt-24px"
                    small
                  />
                  <form class="_tal-ct" @submit.prevent="submitCampaign()">
                    <FileUpload
                      @input="files => (formData.files = files)"
                      class="_mgbt-24px"
                    />
                    <div class="form-group form-check _dp-f _jtfct-ct">
                      <input type="checkbox" class="form-check-input" id="consentCheck" @input="e => handleCheck(e)">
                      <label class="form-check-label _mgl-16px" for="consentCheck">เมื่อคลิกที่ส่งรายละเอียดแล้ว เท่ากับว่าคุณยอมรับ<br>ในข้อกำหนดและเงื่อนไขในการใช้งาน ของ บจก.กรู๊ฟเจริญ</label>
                    </div>
                    <button
                      submit
                      class="btn btn-primary _mgt-24px"
                      :disabled="!formData.files || !acceptPolicy"
                      >
                      <span class="spinner-border spinner-border-sm" role="status" v-if="loading"></span>
                      <span v-else>ส่งรายละเอียด</span>  
                    </button>
                  </form>
                </div>

                <div v-else class="_tal-ct">
                  <TextHeading
                    title="ขอบคุณที่เข้าร่วมกิจกรรม"
                    class="_mgbt-24px"
                    small
                  />
                  <p>คุณได้เข้าร่วมกิจกรรมเป็นที่เรียบร้อยแล้ว</p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import FileUpload from '~/components/landing/campaigns/FileUpload'

export default {
	head() {
		return {
			...(this.pageData.hero ? { title: this.pageData.hero.title } : {})
		}
	},
  async asyncData({ $axios }) {
    let response = await $axios.$get(`/vaccinated-page`)

    return {
      pageData: response
    }
  },
  layout: 'main',
  components: {
    FileUpload
  },
  computed: {
    _loggedIn() {
      return this.$store.state.auth.loggedIn
    },
    _vaccinated() {
      if (this._loggedIn) {
        return this.$store.state.auth.user.vaccinated
      }
    }
  },
  data: () => ({
    formData: {
      files: null
    },
    submitted: false,
    acceptPolicy: false,
    loading: false
  }),
  methods: {
    handleCheck(e) {
      this.acceptPolicy = e.target.checked
    },
    async submitCampaign(e) {
      // console.log(this.formData.files)
      this.loading = true
      let files = this.formData.files
      if (files) {
        if (files.length > 0) {
          let formData = new FormData()
          files.forEach(val => formData.append('files', val))

          let token = this.$auth.strategy.token.get()
          // console.log(token)

          try {
            let uploadResponse = await this.$axios.$post('/upload', formData, {
              headers: {
                Authorization: token,
              }
            })

            // console.log(uploadResponse)

            let userId = this.$store.state.auth.user.id

            let response = await this.$axios.$post('/vaccinateds', {
              files: uploadResponse.map(val => val.id),
              user: userId,
              confirm: false
            }, {
              headers: {
                Authorization: token,
              }
            })

            // console.log(response)

            this.submitted = true

            // this.__toastAlert('success', {
            //   title: 'Submitted Successfully',
            //   description: 'We will verify your request as soon as possible.'
            // })
            this.__showToast({
              title: 'Submitted Successfully',
              description: 'We will verify your request as soon as possible',
              type: 'primary'
            })
          } catch (err) {
            console.log(err)
            this.loading = false

            // this.__toastAlert('error', {
            //   title: 'There is something wrong',
            //   description: 'Please try again soon.'
            // })
            this.__showToast({
              title: 'There is something wrong',
              description: 'Please try again soon',
              type: 'danger'
            })
          }
        } else {
          // console.log('No!')
          // this.__toastAlert('error', {
          //   title: 'There is something wrong',
          //   description: 'Please try again soon.'
          // })
          this.__showToast({
            title: 'There is something wrong',
            description: 'Please try again soon',
            type: 'danger'
          })
        }
      } else {
        // console.log('No!')
        // this.__toastAlert('error', {
        //   title: 'There is something wrong',
        //   description: 'Please try again soon.'
        // })
        this.__showToast({
          title: 'There is something wrong',
          description: 'Please try again soon',
          type: 'danger'
        })
      }
      // try {
      //   let response = await this.$axios.$post('/upload')
      //   console.log(response)
      // } catch (err) {
      //   console.log(err)
      // }
    }
  },
  async mounted() {
    setTimeout(() => {
      if (a2a) a2a.init_all()
    }, 0)

    if (this._loggedIn) {
      let userId = this.$store.state.auth.user.id
      let token = this.$auth.strategy.token.get()

      if (userId) {
        let submitted = await this.$axios.$get(
          `/api/check-vaccinated/${userId}`, {
            headers: {
              Authorization: token
            }
          }
        )
        let { entry } = submitted
        if (entry) {
          this.submitted = true
        }
      }
    }
    // console.log(submitted)
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.hero {
  padding-top: 164px;
  background-color: #001811;
  background-image: url('~assets/images/campaign_hero_bg.jpg');
  background-size: cover;
  background-position: top left;
  background-repeat: no-repeat;

  @media screen and (max-width: $md) {
    padding-top: 112px;
  }

  h4 {
    color: #fff200;
  }

  p {
    max-width: 590px;
  }

  .cover-image {
    position: relative;
    margin-top: 90px;

    @media screen and (max-width: $md) {
      margin-top: 48px;
    }

    .image {
      width: 100%;
      height: auto;
      padding-top: 33.33%;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      background-color: #e2e2e2;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
      z-index: 10;
    }

    .dots {
      width: 180px;
      height: auto;
      position: absolute;
      top: -90px;
      right: -90px;

      @media screen and (max-width: $md) {
        display: none;
      }

      img {
        width: 100%;
        height: auto;
      }
    }
  }
}

.campaign-signup {
  background: #063f48;
  border-radius: 5px;
  padding: 32px;
  overflow: hidden;
}

sl-checkbox::part(label) {
  color: #fff !important;

  @media screen and (max-width: $md) {
  }
}

.form-check-label {
  font-weight: 600;
  text-align: left;
  line-height: 1.5;
}
</style>
