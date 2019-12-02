import Vue from 'vue'
import axios from 'axios'
import { Loading, MessageBox, Message } from 'element-ui'
import router from '@/router/index.js'
import qs from 'qs'
import store from '@/store/'
import Toast from '../../components/Toast/index';

Vue.use(Toast);
axios.defaults.withCredentials = true;
//接口响应拦截
axios.interceptors.response.use(
    response => {
        if (response.data.err_no === -99999 || response.data.err_no === 10000 || response.data.err_no === 10001 || response.data.err_no === 10010 || response.data.err_no === 20000) {
            router.push({
                name: "errPage"
            });
        }
        return response;
    },
    error => {
        // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
        return Promise.reject(error.response.data) // 返回接口返回的错误信息
    });


export default {
    get(url, data) {
        var data = data || {}
        return new Promise((resolve, reject) => {
            axios.get(store.state.Urls + url, {
                params: data
            }).then((res) => {
                resolve(res.data)
            }).catch((err) => {
                console.log('请求失败')
                console.log(err);
                // Message.error(err);
            })
        })
    },
    postFile(url, data, config) {
        var options = { header: { 'Content-Type': 'multipart/form-data' }}
        return new Promise((resolve, reject) => {
            axios.post(store.state.Urls + url, data, options)
                .then((res) => {
                    resolve(res.data)
                }).catch((err) => {
                        console.log('请求失败')
                        console.log(err)
                        // Message.error(err);
                    }

                )
        })
    },
    post(url, data) {
        var data = qs.stringify(data) || {}
        var options = { header: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
        return new Promise((resolve, reject) => {
            axios.post(store.state.Urls + url, data, options)
                .then((res) => {
                    resolve(res.data)
                }).catch((err) => {
                    console.log('请求失败')
                    console.log(err)
                    // Message.error(err);
                })
        })
    }

}
