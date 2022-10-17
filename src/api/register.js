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

/**
 * 发送邮箱验证码
 * @param email
 */
export function sendEmailCode(email){
  return request({
      url: '/user/sendEmailCode',
      method: 'post',
      params: { email }
  })
}

/**
 * 验证邮箱验证码
 * @param email
 */
export function verifyEmailCode(email,code) {
  return request({
    url: '/user/verifyEmailCode',
    method: 'post',
    params: { email ,code}
  })
}

/**
 * 修改密码
 * @param newPassword 新密码
 * @param confirmPassword 确认密码
 * @returns {AxiosPromise}
 */
export function updatePassword(newPassword,confirmPassword){
  return request({
    url: '/user/updatePassword',
    method: 'post',
    params:{newPassword , confirmPassword}
  })
}
