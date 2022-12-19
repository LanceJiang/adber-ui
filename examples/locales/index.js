// import ElementLocale from 'element-ui/lib/locale'
// import element ui locale
import EnElementLocale from 'element-ui/lib/locale/lang/en'
import CNElementLocale from 'element-ui/lib/locale/lang/zh-CN'

// import adber-ui locale 公用国际化 引入
// 本地 模拟多语言 测试
// // 此处使用方式是 结合 按需加载 提取locale 进行修改 i18n转译 当前组件没有做 语言方法提取
// import AdbLocale from '@adber/adber-ui/src/locale' // 多语言 问题  lib  AdbLocale.i18n(fn) 修改完之后 未改变
import EnAdbLocale from '@adber/adber-ui/src/locale/lang/en'
import CNAdbLocale from '@adber/adber-ui/src/locale/lang/zh-cn'

// vxe-table 多语言注入
import EnVxeLocale from 'vxe-table/lib/locale/lang/en-US'
import CNVxeLocale from 'vxe-table/lib/locale/lang/zh-CN'
// 正式环境使用
/* // import AdbLocale from '@adber/adber-ui/lib/locale' // 多语言 问题  lib  AdbLocale.i18n(fn) 修改完之后 未改变
import EnAdbLocale from '@adber/adber-ui/lib/locale/lang/en'
import CNAdbLocale from '@adber/adber-ui/lib/locale/lang/zh-cn' */
import Vue from 'vue'
import VueI18n from 'vue-i18n'

// import defined locale
import enLocale from '@/locales/lang/en'
import zhLocale from '@/locales/lang/zh-cn'

Vue.use(VueI18n)

const messages = {
  en: {
    ...EnElementLocale,
    ...EnAdbLocale,
    ...EnVxeLocale,
    ...enLocale
  },
  zh: {
    ...CNElementLocale,
    ...CNAdbLocale,
    ...CNVxeLocale,
    ...zhLocale
  }
}

export const getLocale = () => {
  const cookieLanguage = 'zh'
  if (cookieLanguage) {
    document.documentElement.lang = cookieLanguage
    return cookieLanguage
  }
  const language = navigator.language.toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }

  return 'en'
}
// init i18n
const i18n = new VueI18n({
  locale: getLocale(),
  messages,
  silentTranslationWarn: true
})

// 为了 让 AdberUI 和 ElementUI 写法尽量相同 做统一调整
/* ElementLocale.i18n((key, value) => {
  // console.warn('ElementLocale key  value 0000', key, value)
  return i18n.t(key, value)
})
// i18n 方式2 想要生效需要 改成多语言打包提取才可
// AdbLocale.i18n((key, value) => return i18n.t(key, value)) */

export default i18n
