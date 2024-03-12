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
      type: 'chefLogin' // 将type参数添加到请求数据中
    }
  ).then(res => {
    return res
  });
  // 退出
 export const userLogout = (params: any) =>
 request({
   'url': `/employee/logout`,
   'method': 'post',
   params
 })
