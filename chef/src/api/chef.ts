import request from '@/utils/request'

// 修改接口
export const editChef = (params: any) => {
  return request({
    url: '/chefInfo/modify',
    method: 'put',
    data: { ...params }
  })
}

// 获取信息
export const getChefInfo = (id: string | (string | null)[]) => {
  return request({
    url: `/chefInfo/get/${id}`,
    method: 'get'
  })
}
