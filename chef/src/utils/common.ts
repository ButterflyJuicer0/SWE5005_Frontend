export const checkProcessEnv =() => {
  return process.env.VUE_APP_DELETE_PERMISSIONS==='true'
}
export const debounce=(fn, time)=> {
  time = time || 200
  let timer = null
  return function(...args) {
    var _this = this
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function() {
      timer = null
      fn.apply(_this, args)
    }, time)
  }

};
export const throttle = (fn, time)=> {
  let timer = null
  time = time || 1000
  return function(...args) {
    if (timer) {
      return
    }
    const _this = this
    timer = setTimeout(() => {
      timer = null
    }, time)
    fn.apply(_this, args)
  }
}
