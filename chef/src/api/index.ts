import request from '@/utils/request'

// 订单管理
  export const getOrderData = () =>
  request({
    'url': `/workspace/overviewOrders`,
    'method': 'get'
  })
// 菜品总览
export const getOverviewDishes = () =>
request({
  'url': `/workspace/overviewDishes`,
  'method': 'get'
})
// 套餐总览
export const getSetMealStatistics = () =>
request({
  'url': `/workspace/overviewSetmeals`,
  'method': 'get'
})
