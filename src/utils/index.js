import xeUtils from 'xe-utils'
/* // Decimal, UnitTranslate, weightUnits, weightUnitCodes...
export * from './unit-translate.js' // 避免传递链过长 建议单独引用 */

export {
  xeUtils,
  // unitTranslate
}
/**
 * 针对本地开发 console.log 添加颜色打印
 */
/*
export const $log = (function() {
  const isDEV = process.env.NODE_ENV !== 'production' // 开发环境
  if (!isDEV) {
    // eslint-disable-next-line
    // @ts-ignore
    return (content = 'content', title = 'title', background = '#007bfc') => {}
  }
  return (content = 'content', title = 'title', background = '#007bfc') => {
    content = typeof content === 'object' ? JSON.stringify(content) : content
    console.log.apply(null, [`%c ${title}： %c ${content} `, 'padding: 1px; border-radius: 10px; color: #fff; background: #9159B2;', `padding: 1px; border-radius: 10px; color: #fff; background: ${background};`])
  }
})()*/
export const $log = (content = 'content', title = 'title', background = '#007bfc') => {
  content = typeof content === 'object' ? JSON.stringify(content) : content
  console.log.apply(null, [`%c ${title}： %c ${content} `, 'padding: 1px; border-radius: 10px; color: #fff; background: #9159B2;', `padding: 1px; border-radius: 10px; color: #fff; background: ${background};`])
}

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟毫秒数
 * @param immediate true/false (是/否)即执行
 */
export function debounce(func, wait, immediate) {
  let timeout

  return function () {
    /* eslint-disable */
    // @ts-ignore
    const context = this
    const args = arguments
    /* eslint-enable */
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(function() {
        func.apply(context, args)
      }, wait)
    }
  }
}

/**
 * 深层数据的集合进行有机合并
 * @param objs[] 需要合并的 对象集合 （后面的覆盖前面的参数）
 * @returns {{}}
 */
export const objDeepMerge = (...objs) => {
  const res = {}
  const combine = (opt) => {
    for (const prop in opt) {
      // eslint-disable-next-line
      if (opt.hasOwnProperty(prop)) {
        if (Object.prototype.toString.call(opt[prop]) === '[object Object]') {
          res[prop] = objDeepMerge(res[prop], opt[prop])
        } else {
          res[prop] = opt[prop]
        }
      }
    }
  }
  objs.map(opts => {
    combine(opts)
  })
  return res
}

/**
 * 异步操作避免重复触发加锁
 * @param syncFn
 * @returns {(function(...[*]): Promise<void>)|*}
 */
export function asyncHandlerLockWrap(syncFn) {
  let is_lock = false
  /* eslint-disable */
  // @ts-ignore
  return async function (...args) {
    // @ts-ignore
    const context = this
    if (!is_lock) {
      is_lock = true
      // @ts-ignore
      Promise.resolve().then(syncFn.bind(context, ...args)).finally(() => {
        is_lock = false
      })
    }
  }
  /* eslint-enable */
}

/**
 * 提取深层数据的值 (防止中间项 不存在导致的报错)
 * @param obj 【检测对象】
 * @param keyArr 【需要获取该对象内部数据key数组】
 * @returns {*}
 */
export function getDeepValue (obj, keyArr) {
  return keyArr.reduce((acc, key) => acc && acc[key], obj)
}

/**
 * 转化成需要展示的时间格式
 * @param date: string | Date | number
 * @param format: string 格式化 默认：MM/dd/yyyy
 *        format 输出日期格式(年份(yy|yyyy)、月份(M|MM自动补0)、天(d|dd自动补0)、12小时制(h|hh自动补0)、24小时制(H|HH自动补0)、分钟(m|mm自动补0)、秒(s|ss自动补0)、毫秒(S|SSS自动补0)、D当年的第几天、a/A上午下午、e/E星期几、w当年的第几周、W当月的第几周、q当年第几个季度、Z时区)
 * @returns {string}
 */
// export function formatDateString (date, format = 'MM/dd/yyyy HH:mm:ss') {
export function formatDateString (date, format = 'MM/dd/yyyy') {
  if (!date) return '-'
  return xeUtils.toDateString(date, format)
}

/**
 * 转化成带逗号的number格式
 * @param num
 * @param minimumFractionDigits 保留小数位
 * @returns {string}
 */
export function formatNumber (num, minimumFractionDigits = 0) {
  // return xeUtils.commafy(+num, { digits: minimumFractionDigits }) || '-'
  return (+num || 0).toLocaleString('zh', { minimumFractionDigits })
}

/**
 * 百分比 保留两位小数  eg: 99.567% -> 99.57%
 * @param rate 百分比数字/字符串
 * @param hasPercent 是否添加%
 * @returns {string}
 */
export function formatRate(rate, hasPercent = true) {
  rate = rate ? rate.toString().replace('%', '') : '0'
  return parseFloat(rate).toFixed(2) + (hasPercent ? '%' : '')
}
