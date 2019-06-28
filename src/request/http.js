import axios from 'axios'
import {
	Message
} from 'element-ui'; //element库的消息提示，移动端不能自适应

if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = 'http://39.106.189.84:8484/';
} else if (process.env.NODE_ENV == 'testing') {
  axios.defaults.baseURL = 'http://39.106.189.84:8484/';
} else if (process.env.NODE_ENV == 'production') {
  axios.defaults.baseURL = 'http://47.104.146.231:8484/';
}
// 设置全局tokenKey请求头
axios.defaults.headers.token_bs = localStorage.getItem('tokenKey');
axios.defaults.headers.token = localStorage.getItem('tokenKey');

//创建axios实例
var service = axios.create({
	timeout: 5000,
	headers: {
		'content-type': 'application/json; charset=utf-8',
		// "token": '14a1347f412b319b0fef270489f'
	}
})
export default {
  //get请求
  get(url, param) {
    return new Promise((cback, reject) => {
      // 设置全局tokenKey请求头
      axios.defaults.headers.token_bs = localStorage.getItem('tokenKey');
      axios.defaults.headers.token = localStorage.getItem('tokenKey');
      
      //创建axios实例
      var service = axios.create({
        timeout: 5000,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          // "token": '14a1347f412b319b0fef270489f'
        }
      })
      service({
        method: 'get',
        url,
        params: param,
      }).then(res => {
        //返回promise对象 
        var res_code = res.status.toString();
        if (res_code.charAt(0) == 2) {
          cback(res); //cback在promise执行器内部
        } else {
          console.log(res, '异常1')
        }
      }).catch(err => {
        if (!err.response) {
          console.log('请求错误')
          // alert('请求错误') // 微信alert不需要美化
          //Message是element库的组件，移动端暂不需要
          Message({
            showClose: true,
            message: '请求错误',
            type: 'error'
          });
        } else {
          reject(err.response);
          console.log(err.response, '异常2')
        }
      })

    })
  },
  // post请求
  post(url, param) {
    return new Promise((cback, reject) => {
      // 设置全局tokenKey请求头
      axios.defaults.headers.token_bs = localStorage.getItem('tokenKey');
      axios.defaults.headers.token = localStorage.getItem('tokenKey');

      //创建axios实例
      var service = axios.create({
        timeout: 5000,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          // "token": '14a1347f412b319b0fef270489f'
        }
      })
      service({
        method: 'post',
        url,
        params: param,
      }).then(res => {
        //返回promise对象 
        var res_code = res.status.toString();
        if (res_code.charAt(0) == 2) {
          cback(res); //cback在promise执行器内部
        } else {
          console.log(res, '异常1')
        }
      }).catch(err => {
        if (!err.response) {
          console.log('请求错误')
          // alert('请求错误') // 微信alert不需要美化
          //Message是element库的组件，移动端暂不需要
          Message({
            showClose: true,
            message: '请求错误',
            type: 'error'
          });
        } else {
          reject(err.response);
          console.log(err.response, '异常2')
        }
      })

		})
	},
}