// import { prefix } from '@adber/adber-ui/packages/config'
import packageJson from '../package.json'
import lodash from 'lodash/lodash.min'
// import VXETable from 'vxe-table'
import {
  // 全局对象
  VXETable,

  // 功能模块
  // Filter,
  // Menu,
  // Edit,
  // Export,
  // Keyboard,
  // Validator,

  // 可选组件
  // Icon,
  // Column,
  // Colgroup,
  // Grid,
  Toolbar,
  Pager,
  Header,
  Select as VxeSelect,
  Tooltip,
  // Checkbox,
  // CheckboxGroup,
  // Radio,
  // RadioGroup,
  // RadioButton,
  // Input,
  // Textarea,
  // Button,
  // Modal,
  // Form,
  // FormItem,
  // FormGather,
  // Optgroup,
  // Option,
  // Switch,
  // List,
  // Pulldown,

  // 表格
  Table as VXE_Table
} from 'vxe-table' // vxe-table表格插件
// import VueStorage from 'vue-ls' // todo

// import Test from './test'
import Table from './Table'
import AdVxeTable from './VxeTable'
import DraggableNest from './DraggableNest'
import FormConfig from './FormConfig'
import FormConfigDialog from './FormConfigDialog'
import Icon from './Icon'
import InputNumber from './InputNumber'
import Select from './Select'
import Dropdown from './Dropdown'
import NoData from './NoData'
import Popover from './Popover'
import CustomRender from './CustomRender'
import SearchGroup from './SearchGroup'
import SearchFilterDrawer from './SearchFilterDrawer'
// pdf 预览
// import PdfPreview from './PdfPreview'

// 以下组件放置 extra_load 配置交给 引用项目按需使用

// import BarCode from './BarCode'

import locale from '../src/locale'
import { $log, xeUtils } from '../src/utils'
const version = packageJson.version
// 存储组件列表
const components = [
  // Test,
  Table,
  AdVxeTable,
  DraggableNest,
  FormConfig,
  FormConfigDialog,
  Icon,
  InputNumber,
  Select,
  Dropdown,
  NoData,
  Popover,
  CustomRender,
  SearchGroup,
  SearchFilterDrawer
  // PdfPreview // todo 暂不做公用组件打包（pdfjsWorker.js 引入有问题 后续再说）暂时建议 src 引入 或者以该组件作为参考
  // BarCode
]

// 加载adber-svg icon
;(function () {
  const d = document
  const existIconVersion = [...d.querySelectorAll('.ad-icon_svg')].map(v => v.getAttribute('version')).includes(version)
  if (!existIconVersion) {
    /** update 最新 iconfont(.css && .js) */
    // const origin_prefix = '//at.alicdn.com/t/c/font_3588867_eb8rgczzz9'
    const origin_prefix = '//at.alicdn.com/t/c/font_3588867_y3je7tsnf7'
    const link = d.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.className = 'ad-icon_iconfont'
    link.setAttribute('version', version)
    link.setAttribute('origin', location.origin)
    link.href = `${origin_prefix}.css`
    d.getElementsByTagName('head')[0].appendChild(link)
    const s = d.createElement('script')
    s.className = 'ad-icon_svg'
    s.src = `${origin_prefix}.js`
    s.setAttribute('version', version)
    s.setAttribute('origin', location.origin)
    d.getElementsByTagName('head')[0].appendChild(s)
  }
})()
// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function (Vue, opts = {}) {
  // console.error(install, 'AdberUi install opts', opts)
  locale.use(opts.locale)
  locale.i18n(opts.i18n)
  // 遍历注册全局组件
  // components.map(component => Vue.component(`${prefix}${component.name}`, component))
  components.map(component => Vue.component(component.name, component))
  // vxeTable 配置
  const Vxei18n = opts.i18n ? opts.i18n : (key, args) => xeUtils.toFormatString(xeUtils.get(require('vxe-table/lib/locale/lang/zh-CN'), key), args)
  VXETable.setup({
    size: 'mini',
    tooltipConfig: {
      theme: 'light'
    },
    // 对组件内置的提示语进行国际化翻译
    i18n: Vxei18n
  })
  /* Vue.use(VueStorage, {
    namespace: '', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local' // storage name session, local, memory
  }) */
  // 表格功能
  // Vue.use(Filter)
  // .use(Edit)
  // .use(Menu)
  // .use(Export)
  // .use(Keyboard)
  // .use(Validator)

  // 可选组件
  // Vue.use(Icon)
  //   .use(Column)
  // .use(Colgroup)
  // .use(Grid)
  Vue.use(Toolbar)
    .use(Pager)
    .use(Header)
    .use(VxeSelect)
    .use(Tooltip)
  // .use(Checkbox)
  // .use(CheckboxGroup)
  // .use(Radio)
  // .use(RadioGroup)
  // .use(RadioButton)
  // .use(Input)
  // .use(Textarea)
  // .use(Button)
  // .use(Modal)
  // .use(Form)
  // .use(FormItem)
  // .use(FormGather)
  // .use(Select)
  // .use(Optgroup)
  // .use(Option)
  // .use(Switch)
  // .use(List)
  // .use(Pulldown)

  // 安装表格
  Vue.use(VXE_Table, {
    // translate: (key, value) => opts.i18n(key, value)
  })
  // 给 vue 实例挂载内部对象:
  // 挂载 lodash 操作
  Vue.prototype.$_ = lodash
  // 页面$log 打印
  Vue.prototype.$log = $log
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// console.warn(packageJson, 'packageJson  packageJson.version', packageJson.version)
export default {
  version,
  locale: locale.use,
  i18n: locale.i18n,
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  // 以下是具体的组件列表
  ...components
}
