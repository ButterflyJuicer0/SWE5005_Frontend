import request from '@/utils/request'
/**
 *
 * 菜品管理
 *
 **/
// 查询列表接口
export const getDishPage = (params: any) => {
  return request({
    url: `/dish/page`,
    method: 'get',
    params
  })
}

// 删除接口
export const deleteDish = (id: string) => {
  return request({
    url: '/dish/remove',
    method: 'delete',
    params: { id }
  })
}

// 修改接口
export const editDish = (params: any) => {
  return request({
    url: '/dish/modify',
    method: 'put',
    data: { ...params }
  })
}

// 新增接口
export const addDish = (params: any) => {
  return request({
    url: '/dish/add',
    method: 'post',
    data: { ...params }
  })
}

// 查询详情
export const queryDishById = (id: string | (string | null)[]) => {
  return request({
    url: `/dish/${id}`,
    method: 'get'
  })
}

// 获取菜品分类列表
export const getCategoryList = (params: any) => {
  return request({
    url: '/category/list',
    method: 'get',
    params
  })
}

// 起售停售---批量起售停售接口
export const dishStatusByStatus = (params: any) => {
  return request({
    url: `/dish/status/${params.status}`,
    method: 'post',
    params: { id: params.id }
  })
}

//菜品分类数据查询
export const dishCategoryList = (params: any) => {
  return request({
    url: `/category/list`,
    method: 'get',
    params: { ...params }
  })
}
