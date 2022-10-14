import request from '@/utils/request'

/**
 * 根据用户名查询
 * @param username
 */
export function findByUserName(username) {
    return request({
        url: `/user/findByUserName`,
        method: 'get',
        params: { username }
    })
}

/**
 * 根据邮箱查询
 * @param email
 */
export function findByEmail(email) {
  return request({
    url: `/user/findByEmail`,
    method: 'get',
    params: { email }
  })
}

/**
 * 添加用户
 * @param user
 */
export function saveUser(data) {
  return request({
    url: `/user/save`,
    method: 'post',
    data
  })
}

export function sendEmailCode(email){
  return request({
      url: '/user/sendEmailCode',
      method: 'post',
      params: { email }
  })
}