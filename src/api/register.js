import request from '@/utils/request'

export function findByUserName(username) {
    return request({
        url: `/user/findByUserName`,
        method: 'get',
        params: { username }
    })
}

export function findByEmail(email) {
  return request({
    url: `/user/findByEmail`,
    method: 'get',
    params: { email }
  })
}
