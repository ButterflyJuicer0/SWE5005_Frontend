import Vue from 'vue'
import Router from 'vue-router'
import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'
import VueAreaLinkage from 'vue-area-linkage'
import moment from 'moment'
import '@/styles/element-variables.scss'
import '@/styles/index.scss'
import '@/styles/home.scss'
import 'vue-area-linkage/dist/index.css'

import * as echarts from 'echarts'

import '@/styles/newRJWMsystem.scss'
import '@/styles/icon/iconfont.css'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import '@/icons/components'
import '@/permission'
import { checkProcessEnv } from '@/utils/common'
import jsrsasign from 'jsrsasign'

Vue.use(ElementUI)
Vue.use(VueAreaLinkage)
Vue.use(SvgIcon, {
  'tagName': 'svg-icon',
  'defaultWidth': '1em',
  'defaultHeight': '1em'
})

Vue.config.productionTip = false
Vue.prototype.$jsrsasign = jsrsasign
Vue.prototype.moment = moment
Vue.prototype.$checkProcessEnv = checkProcessEnv
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
 return routerPush.call(this, location).catch(error=> error)
}
Vue.prototype.$echarts = echarts
new Vue({
  router,
  store,
  'render': (h) => h(App)
}).$mount('#app')

/** 签名方法 */
function rsaSign(plainText){
  let priKey= "填入上方生成的priKey";
  //这里必须使用这个标准格式所有做了一个拼接
  var priK = "-----BEGIN PRIVATE KEY-----"+priKey+"-----END PRIVATE KEY-----";
  var rsa = new jsrsasign.RSAKey();
  rsa = jsrsasign.KEYUTIL.getKey(priK);
  //后端算法与前端需要一致
  let sig = new jsrsasign.KJUR.crypto.Signature({"alg": "SHA256withRSA"});
  // 初始化
  sig.init(rsa)
  console.log("data:"+plainText);
  // 传入待加密字符串
  sig.updateString(plainText)
  // 生成密文
  let sign = jsrsasign.hextob64(sig.sign());
  console.log("sign:"+sign);
  // 对加密后内容进行URI编码
  sign = encodeURIComponent(sign);
  console.log("sign encode:"+sign);
  return sign;
}
