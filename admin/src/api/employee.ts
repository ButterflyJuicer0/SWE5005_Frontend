import request from '@/utils/request'
import axios from 'axios';
/**
 *
 * 员工管理
 *
 **/
// 登录、
export const login = (username:string,password:string) =>
  axios.post(
    'https://www.nusiss.icu:8080/common/login', // 请确保URL的格式正确，包括协议（例如http://）
    {
      username:username,
      password:password,
      type: 'adminLogin' // 将type参数添加到请求数据中n
    }
  ).then(res => {
    return res
  });
  // 退出
 export const userLogout = (params: any) =>
 request({
   'url': `/employee/logout`, // 授课老师接口
   'method': 'post',
   params
 })

export const getEmployeeList = (params: any) => {
  return request({
    url: '/employee/page',
    method: 'get',
    params
  })
}

// 修改---启用禁用接口
export const enableOrDisableEmployee = (params: any) => {
  return request({
    url: `/employee/status/${params.status}`,
    method: 'post',
    params: { id:params.id }
  })
}

// 新增---添加员工
export const addEmployee = (params: any) => {
  return request({
    url: '/employee',
    method: 'post',
    data: { ...params }
  })
}

// 修改---添加员工
export const editEmployee = (params: any) => {
  return request({
    url: '/employee',
    method: 'put',
    data: { ...params }
  })
}

// 修改页面反查详情接口
export const queryEmployeeById = (id: string | (string | null)[]) => {
  return request({
    url: `/employee/${id}`,
    method: 'get'
  })
}
