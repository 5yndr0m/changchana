<template>
  <div>
    <!-- Desktop -->
    <CardLayout
      :left="{
        text: 'Back',
        icon: 'chevron-left',
        callback: () => $router.push('/'),
      }"
    >
      <template v-slot:desktop>
        <TextHeading title="Terms & Conditions" class="_mgbt-24px" />
        <Accordion
          :title="`${i + 1}. ${val.title}`"
          v-for="(val, i) in pageData.content"
          :key="`faq-${i}`"
          :content="val.description"
          class="_mgbt-16px"
        />
      </template>

      <template v-slot:mobile>
        <TextHeading title="Terms & Conditions" class="_mgbt-24px" />
        <Accordion
          :title="`${i + 1}. ${val.title}`"
          v-for="(val, i) in pageData.content"
          :key="`faq-${i}-mobile`"
          :content="val.description"
          class="_mgbt-16px"
        />
      </template>
    </CardLayout>
  </div>
</template>

<script>
export default {
	head() {
		return {
			title: 'ข้อตกลงและเงื่อนไข'
		}
	},
  layout: 'wo_nav',
  async asyncData({ $axios }) {
    let response = await $axios.$get('/terms-and-conditions')

    return {
      pageData: response,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';
</style>
