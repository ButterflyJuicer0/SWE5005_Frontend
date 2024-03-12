
# 使用nginx作为服务器
FROM nginx:alpine

COPY ./dist /usr/share/nginx/html

COPY ./nusiss.icu.pem /etc/nginx/nusiss.icu.pem
COPY ./nusiss.icu.key /etc/nginx/nusiss.icu.key

# 用自定义的nginx配置文件替换默认的配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露80和443端口
EXPOSE 80 443

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
