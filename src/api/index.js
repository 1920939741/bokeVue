import ajax from './ajax'
import request from '@/utils/request'
// 定义BASE_URL
// const BASE_URL = 'http://local:8081'
const BASE_URL = '/api'


export const pswLogin = (data) => ajax(BASE_URL+'/login',data, 'POST')

/**
 * 登录接口
 * @param data
 */
export function login(data) {
  return request({
    url: `/login`,
    method: 'post',
    data
  })
}

/**
 * 分页查询
 * @param currentPage
 */
export function blogs(currentPage) {
  return request({
    url: `/blogs`,
    method: 'get',
    params:{currentPage},
    headers: {
      "authorization": localStorage.getItem("token")
    }
  })
}
