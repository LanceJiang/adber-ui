const orderTotal = 876543
// 列表数据
export const getOrders = (input) => {
  // 模拟参数
  const { page, pageSize } = input
  return new Promise(resolve => {
    let length = pageSize
    if (page * pageSize > orderTotal) {
      length = orderTotal - (page - 1) * pageSize
    }
    setTimeout(() => {
      // 模拟数据
      const res = {
        data: Array.from({ length }).map((_, i) => {
          return { priceValue: 10000 + i, currency: 'USD or CNY', orderNo: `orderNo_${i}`, local_user: `local_user_${i}`, test_2: `test_2_${i}` }
        })
      }
      resolve(res.data)
    }, 1000 * Math.random())
  })
}
// 列表count 总数
export const getOrdersCount = (input) => {
  return new Promise(resolve => {
    setTimeout(() => {
      // 模拟数据
      const res = {
        total: orderTotal
      }
      resolve(res.total)
    }, 1000 * Math.random())
  })
}
// 当前类型列表配置获取
export const getTableConfig = (input) => {
  // 请求参数拟定
  /* const params = {
    type: '表格类型唯一值标记',
    system: '系统标记'
  } */
  return new Promise(resolve => {
    setTimeout(() => {
      // 模拟数据
      const res = {
        /* t_label: String, // 多语言关键key
        label?: String, // 若不存在t_label 可使用 label
        [valueKey]: String, // valueKey 用于 作为唯一值鉴定用 todo delete
        checked: Boolean, // 是否选中 todo delete
        disabled?: Boolean, // disabled 的不允许删除 todo delete
        fixed?: Boolean || String, // disabled 的不允许删除 (disabled -> fixed)
        children?: Option[] // 同上配置 */
        columns: [{
          prop: 'action',
          t_label: 'adb.table.action',
          fixed: 'right' // boolean string
        }, {
          prop: 'priceValue',
          label: 'slotPrice'
          // fixed: true // boolean string
        }, {
          prop: 'orderNo',
          t_label: 'outboundOrder.table.orderNo'
          // fixed: true // boolean string
        }, { // 模拟 columns被调整后 label 被更改的字段 (校验 数据是否会转换为新值)
          prop: 'local_user',
          t_label: 'outboundOrder.table.userOld'
          // fixed: true // boolean string
        }, {
          prop: 'orderNo2',
          t_label: 'outboundOrder.table.orderNo2'
          // fixed: true // boolean string
        }]
      }
      resolve(res)
    }, 1000 * Math.random())
  })
}
