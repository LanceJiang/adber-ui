import { formatDateString, formatNumber, formatRate } from './index'

/**
 * 默认公用渲染cell formatter 申明：
 * 命名方式：cellFormatter_{todo}
 *
 * 由于vxe-table 和 el(ad)-table(adber 自定义Formatter)的渲染申明有差异 在使用不同的 table类型需要做以区别
 * vxe_yourFormatter VxeTable(ad-vxe-table)专用
 * yourFormatter 没有标记的是  Table(ad-table) 专用
 */

// // 金额美化渲染 eg: todo
// export const vxe_cellFormatter_price = ({row, column, cellValue, index}) => {}
// // vxe_xxx vxeTable专用
// export const cellFormatter_price = (row, column, cellValue, index) => {}
