
import axios from '@/assets/js/axios.js'
export default {
	//列表数据
	data(state, param) {
		axios.post(param.url, param.param).then(res => {
			if (res.err_no == 0) {
                //接口请求成功
                if(param.successCannel){
                    param.successCannel(res);
                }else{
                    if(res.trans_res){
                        state.tableData = res.trans_res;
                        state.total = Number(res.batch_count);
                    }
                }
                if(param.loading){
                    param.loading();
                }
			} else {
				//请求失败
				param.failCannel(res)
			}
			
		})
    },
    clearData(state){
        state.tableData = [];
        state.total = 0;
    },
    formData(state, param){
        axios.post(param.url, param.param).then(res => {
			if (res.err_no == 0) {
                //接口请求成功
                if(param.successCannel){
                    param.successCannel(res);
                }                
			} else {
				//请求失败
				param.failCannel(res)
			}
			
		})
    }
}
