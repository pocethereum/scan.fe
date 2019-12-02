// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store/'
import axios from 'axios'
import { Pagination, MessageBox, Message } from 'element-ui';
import filter from './filter/filter.js'
import './components/Toast/toast.css';
import Toast from './components/Toast/index';


Vue.use(Toast);
Vue.use(Pagination)
Vue.use(Vuex)
Vue.config.productionTip = false
Vue.prototype.$ajax = axios
require('./assets/style/common.less')
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;


/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>',
	store
})
