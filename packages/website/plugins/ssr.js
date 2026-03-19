import Vue from 'vue'

import TextHeading from '~/components/TextHeading'
Vue.component('TextHeading', TextHeading)

import AppHeader from '~/components/dashboard/AppHeader'
Vue.component('AppHeader', AppHeader)

import CardLayout from '~/components/dashboard/CardLayout'
Vue.component('CardLayout', CardLayout)

import AccountSettings from '~/components/dashboard/AccountSettings'
Vue.component('AccountSettings', AccountSettings)

import vSlButton from '~/components/vSlButton'
Vue.component('v-sl-button', vSlButton)

import CallToAction from '~/components/CallToAction'
Vue.component('CallToAction', CallToAction)

import PasswordInput from '~/components/PasswordInput'
Vue.component('PasswordInput', PasswordInput)