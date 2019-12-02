import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/pages/home/home'
import SearchAddressPage from '@/pages/searchinfo/address'
import SearchBlockPage from '@/pages/searchinfo/block'
import SearchTransactionsPage from '@/pages/searchinfo/transactions'
import SearchTxhashPage from '@/pages/searchinfo/txhash'
import ErrPage from '@/pages/errPage/errPage'


Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'HomePage',
			component: HomePage
		},
		{
			path: '/block/:param',
			name: 'SearchBlockPage',
			component: SearchBlockPage
		},
		{
			path: '/transactions/:param',
			name: 'SearchTransactionsPage',
			component: SearchTransactionsPage,
			beforeEnter: (to, from, next) => {
				console.log(to, from)
				next();
			}
		},
		{
			path: '/txhash/:param',
			name: 'SearchTxhashPage',
			component: SearchTxhashPage,
			beforeEnter: (to, from, next) => {
				let tx = to.params.param;
				if (tx.startsWith('0x')) {
					tx = 'poc' + tx.replace('0x', '');
					next('/txhash/' + tx);
				} else {
					next();
				}
			}
		},
		{
			path: '/address/:param',
			name: 'SearchAddressPage',
			component: SearchAddressPage,
			beforeEnter: (to, from, next) => {
				let address = to.params.param;
				if (address.startsWith('0x')) {
					address = 'poc' + address.replace('0x', '');
					next(`/address/${address}`);
				} else {
					next();
				}
			}
		},
		{
			path: '/errPage',
			name: 'errPage',
			component: ErrPage
		}
	],
})
