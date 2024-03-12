import request from '@/utils/request'
import axios from 'axios';

// 查询列表页接口
export const getOrderDetailPage = (chefId:string) => {
  return request({
    url: `/order/orderDetail/${chefId}`,
    method: 'get',
  })
}

//完成接口
export const completeOrder = (id:string) => {
  return request({
    url: `/order/complete/${id}`,
    method: 'put' /*  */
  })
}

//获取待处理，待派送，派送中数量
export const getOrderListBy = (params: any) => {
  return request({
    url: '/order/statistics',
    method: 'get' /*  */
  })
}
