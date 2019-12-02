import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import axios from '@/assets/js/axios'
Vue.use(Vuex)

let projectName = 'poc';

const state = {
	total: 0,
	Urls: `http://scan.${projectName}.com/api`,
	tableData: [],
	projectName: projectName.toUpperCase(),
	Api: {
		getBlocks: {
			url: "/block/get_blocks"
		},
		getHeight: {
			url: "/block/get_by_height"
		},
		getBlockNumber: {
			url: "/block/get_block_number"
		},
		getBlockHash: {
			url: "/block/get_by_hash"
		},

		getByTransactions: {
			url: "/transaction/get_transactions"
		},
		getByAddress: {
			url: "/transaction/get_by_addr"
		},
		getByAddressPending: {
			url: "/transaction/get_addr_pending"
		},
		getByHeight: {
			url: "/transaction/get_by_height"
		},
		getByHash: {
			url: "/transaction/get_by_hash"
		},
		getByHashPending: {
			url: "/transaction/get_hash_pending"
		},
		getRate: {
			url: `/${projectName}/get_exchange_rate`
		},
		getBalance: {
			url: `/${projectName}/get_balance`
		},

	}
}

export default new Vuex.Store({
	state,
	actions,
	mutations
})
