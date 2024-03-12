import request from '@/utils/request';

export const setCategory = (categoryId: string) => {
  return request({
    headers:{token:this.token},
    url: '/category/add',
    method: 'post',
    params: { categoryId }
  });
};
