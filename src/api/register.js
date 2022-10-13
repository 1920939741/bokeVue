import request from '@/utils/request'

export function findByUserName(username) {
    return request({
        url: `/user/findByUserName`,
        method: 'get',
        params: { username }
    })
}
