<template>
  <div class="flex-column-page-wrap pageWrap">
    Home
    <div class="common_title">AdPopover 使用</div>
    <div class="content">
      <el-button plain disabled> addddddddd </el-button>
      <el-button plain> addddddddd </el-button>
      <AdPopover trigger="click" :popperClass="`ad-popover--list ${'popperClass'}`" placement="right">
        <div class="labelWrap" style="width: 250px" slot="reference">
          可售：666
        </div>
        <div class="more-item_title">
          <span class="label">类目</span>
          <span class="value" style='color: #BDC3C9;'>数量</span>
        </div>
        <el-main style='padding: 0;' class="ad-popover--list_content" @hook:created='$log("创建完成 触发(可能有接口请求) 。。。1111")'>
          <div class="more-item">
            <span class="label"> 可售 </span>
            <span class="value"> 666 </span>
          </div>
          <div
            class="more-item"
            v-for='num of Array.from({length: 10}).map((_, i) => i)'
            :key='num'
          >
            <span class="label"> 待调仓{{num}} </span>
            <span class="value"> 1{{num}} </span>
          </div>
        </el-main>
      </AdPopover>

      <AdPopover :first-load='true' trigger="click" :popperClass="`ad-popover--list ${'popperClass'}`" placement="right">
        <div class="labelWrap" style="width: 250px" slot="reference">
          可售：666
        </div>
        <el-main style='padding: 0;' @hook:created='$log("创建完成 触发(可能有接口请求) 。。。22222")' class="ad-popover--list_content">
          <div class="more-item">
            <span class="label"> 可售 </span>
            <span class="value"> 666 </span>
          </div>
          <div
            class="more-item"
            v-for='num of Array.from({length: 10}).map((_, i) => i)'
            :key='num'
          >
            <span class="label"> 待调仓{{num}} </span>
            <span class="value"> 1{{num}} </span>
          </div>
        </el-main>
        <!--    <div @click.stop class="ad-popover--list_content">
          <slot />
        </div>-->
      </AdPopover>
      <!--   模拟 button 类型 下拉弹窗选择 todo...   -->
      <AdPopover :first-load='false' trigger="click" :popperClass="`ad-popover--select ${'popperClass'}`" placement="top">
        <el-button slot="reference" class="ad-popover-box__btn">
          <span>
            <i class="el-icon-arrow-down ad-popover-box__btn__prefix" slot="prefix" />
            <span class="ad-popover-box__btn__label">{{ 'item.label' }}</span>
            <i class="el-icon-arrow-down ad-popover-box__btn__suffix" slot="suffix" />
          </span>
        </el-button>

        <div class="ad-popover--select_content">
          <div class="more-item">
            <span class="label"> 可售 </span>
            <span class="value"> 666 </span>
          </div>
          <div
            class="more-item"
            v-for='num of Array.from({length: 10}).map((_, i) => i)'
            :key='num'
          >
            <span class="label"> 待调仓{{num}} </span>
            <span class="value"> 1{{num}} </span>
          </div>
        </div>

        <div class="ad-popover--select_footer">
          <!--            @click="handleReset"-->
          <el-tooltip
            placement="top"
            :content="$t('adb.btn.reset')"
          >
            <el-button size='small'>
              <ad-icon icon-class="ad-clear" />
            </el-button>
          </el-tooltip>

          <!--            v-if="notSimple"-->
          <!--            :disabled="isDisabled"-->
          <!--            @click="handleCommit"-->
          <el-tooltip
            placement="top"
            :content="$t('adb.btn.confirm')"
          >
            <el-button size='small' type="primary">
              <ad-icon icon-class="ad-confirm" />
            </el-button>
          </el-tooltip>
        </div>

        <!--    <div slot="reference" class="labelWrap">
          <slot name="ddd" />
          <i
            v-if="showDownIcon"
            :class="['el-icon-arrow-down', isVisible ? 'link' : '']"
            style="margin-left: 4px"
            type="down"
          />
        </div>-->
        <!--    <slot />-->
        <!--    <div @click.stop class="ad-popover--select_content">
          <slot />
        </div>-->
      </AdPopover>
      <div>-------分割--------</div>
      <!-- button-group 类型 下拉弹窗选择 todo... AdSearchGroup -->
      <el-button-group>
<!--        ad-search-group_btn-->
        <AdPopover :first-load='false' trigger="click" :popperClass="`ad-popover--select ${'popperClass'}`" placement="bottom">
          <el-button slot="reference" class="ad-popover-box__btn">
          <span>
            <i class="el-icon-arrow-down ad-popover-box__btn__prefix" slot="prefix" />
            <span class="ad-popover-box__btn__label">{{ 'item.label  1' }}</span>
            <i class="el-icon-arrow-down ad-popover-box__btn__suffix" slot="suffix" />
          </span>
          </el-button>

          <div class="ad-popover--select_content">
            <div class="more-item">
              <span class="label"> 可售 </span>
              <span class="value"> 666 </span>
            </div>
            <div
              class="more-item"
              v-for='num of Array.from({length: 10}).map((_, i) => i)'
              :key='num'
            >
              <span class="label"> 待调仓{{num}} </span>
              <span class="value"> 1{{num}} </span>
            </div>
          </div>

          <div class="ad-popover--select_footer">
            <!--            @click="handleReset"-->
            <el-tooltip
              placement="top"
              :content="$t('adb.btn.reset')"
            >
              <el-button size='small'>
                <ad-icon icon-class="ad-clear" />
              </el-button>
            </el-tooltip>

            <!--            v-if="notSimple"-->
            <!--            :disabled="isDisabled"-->
            <!--            @click="handleCommit"-->
            <el-tooltip
              placement="top"
              :content="$t('adb.btn.confirm')"
            >
              <el-button size='small' type="primary">
                <ad-icon icon-class="ad-confirm" />
              </el-button>
            </el-tooltip>
          </div>

          <!--    <div slot="reference" class="labelWrap">
            <slot name="ddd" />
            <i
              v-if="showDownIcon"
              :class="['el-icon-arrow-down', isVisible ? 'link' : '']"
              style="margin-left: 4px"
              type="down"
            />
          </div>-->
          <!--    <slot />-->
          <!--    <div @click.stop class="ad-popover--select_content">
            <slot />
          </div>-->
        </AdPopover>
        <AdPopover :first-load='false' trigger="click" :popperClass="`ad-popover--select ${'popperClass'}`" placement="top">
          <el-button slot="reference" class="ad-popover-box__btn">
          <span>
            <i class="el-icon-arrow-down ad-popover-box__btn__prefix" slot="prefix" />
            <span class="ad-popover-box__btn__label">{{ 'item.label  2' }}</span>
            <i class="el-icon-arrow-down ad-popover-box__btn__suffix" slot="suffix" />
          </span>
          </el-button>

          <div class="ad-popover--select_content">
            <div class="more-item">
              <span class="label"> 可售 </span>
              <span class="value"> 666 </span>
            </div>
            <div
              class="more-item"
              v-for='num of Array.from({length: 10}).map((_, i) => i)'
              :key='num'
            >
              <span class="label"> 待调仓{{num}} </span>
              <span class="value"> 1{{num}} </span>
            </div>
          </div>

          <div class="ad-popover--select_footer">
            <!--            @click="handleReset"-->
            <el-tooltip
              placement="top"
              :content="$t('adb.btn.reset')"
            >
              <el-button size='small'>
                <ad-icon icon-class="ad-clear" />
              </el-button>
            </el-tooltip>

            <!--            v-if="notSimple"-->
            <!--            :disabled="isDisabled"-->
            <!--            @click="handleCommit"-->
            <el-tooltip
              placement="top"
              :content="$t('adb.btn.confirm')"
            >
              <el-button size='small' type="primary">
                <ad-icon icon-class="ad-confirm" />
              </el-button>
            </el-tooltip>
          </div>
        </AdPopover>
        <AdPopover :first-load='false' trigger="click" :popperClass="`ad-popover--select ${'popperClass'}`" placement="top">
          <el-button slot="reference" class="ad-popover-box__btn">
          <span>
            <i class="el-icon-arrow-down ad-popover-box__btn__prefix" slot="prefix" />
            <span class="ad-popover-box__btn__label">{{ 'item.label  3' }}</span>
            <i class="el-icon-arrow-down ad-popover-box__btn__suffix" slot="suffix" />
          </span>
          </el-button>

          <div class="ad-popover--select_content">
            <div class="more-item">
              <span class="label"> 可售 </span>
              <span class="value"> 666 </span>
            </div>
            <div
              class="more-item"
              v-for='num of Array.from({length: 10}).map((_, i) => i)'
              :key='num'
            >
              <span class="label"> 待调仓{{num}} </span>
              <span class="value"> 1{{num}} </span>
            </div>
          </div>

          <div class="ad-popover--select_footer">
            <el-tooltip
              placement="top"
              :content="$t('adb.btn.reset')"
            >
              <el-button size='small'>
                <ad-icon icon-class="ad-clear" />
              </el-button>
            </el-tooltip>
            <el-tooltip
              placement="top"
              :content="$t('adb.btn.confirm')"
            >
              <el-button size='small' type="primary">
                <ad-icon icon-class="ad-confirm" />
              </el-button>
            </el-tooltip>
          </div>
        </AdPopover>
        <!-- hidden v-if="!isShowAll" @click="visibleFilters = true"
          :class="!isAllFilters ? 'border-left_none' : ''" -->
        <span class="ad-popover-box">
          <span class="el-popover__reference-wrapper">
<!--            adb-filter.filterTitle-->
            <el-tooltip
              placement="top"
              :content="$t('adb.filter.filterLabel')"
            >
              <el-button @click="filterDrawer = true">
                <ad-icon icon-class="ad-filter"/>
              </el-button>
            </el-tooltip>
          </span>
        </span>
      </el-button-group>
      <div>-------分割-  group-------</div>

      <AdSearchGroup v-bind="formOptions" v-model="searchParams" :selectedSettingSubmit="selectedSettingSubmit"/>
      <div>-------分割--------</div>
      <AdSelect v-model="testValue" filterable multiple isPopover>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </AdSelect>
      <div>-------分割--------  isPopover  false</div>
      <AdSelect v-model="testValue2" filterable multiple :isPopover="false">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </AdSelect>
      <div>-------分割--------</div>

      <button @click="testDrawer = true">testDrawer</button>
      <AdSearchFilterDrawer :visible.sync="testDrawer">
        测试......
        <template #footer>
          1
        </template>
      </AdSearchFilterDrawer>
    </div>

    <div class="common_title">多语言 使用</div>
    <div class="content">
      <el-button @click="switchLang" size="small">
        lang: 切换
        <AdIcon iconClass="ad-frozen"/>
        <AdIcon iconClass="ad-warning"/>
        {{$i18n.locale}}
      </el-button>
      <div>local文字: {{$t('route.location')}}</div>
      <div>src/locale 文字(携带 adb前缀做区分): {{$t('adb.btn.add')}}</div>
    </div>

    <div class="common_title">AdInputNumber</div>
    <div class="content">
      {{testNumber}}
      <AdInputNumber disabled v-model="testNumber" :min="0" prefix="#" _controlsPosition="1"></AdInputNumber>
      <AdInputNumber v-model="testNumber" :min="0" prefix="#" suffix="￥" size="mini" _controlsPosition="1"></AdInputNumber>
      <AdInputNumber v-model="testNumber" :min="0" prefix="#" size="small" _controlsPosition="1"></AdInputNumber>
      <AdInputNumber v-model="testNumber" :min="0" suffix="￥" _controlsPosition="1"></AdInputNumber>
      <AdInputNumber size="mini" v-model="testNumber" :min="0" prefix="#" suffix="￥" _controlsPosition="1"></AdInputNumber>
      <AdInputNumber v-model="testNumber" :min="0" style="width: 200px;" controlsPosition="1">
        <template slot="prefix"><span class="ad-addon ad-input-number__prefix" style="background: #0f0;">prefix</span></template>
        <template slot="suffix"><span class="ad-addon ad-input-number__suffix" style="background: #f00">suffix</span></template>
      </AdInputNumber>
    </div>
    <div class="common_title">iconfont && AdIcon</div>
    <div class="content">
      <!--  单色样式类  -->
      <span class="ad-iconfont ad-Review"></span>
      <AdIcon iconClass="ad-checkbox_checked"></AdIcon>
      <span class="ad-iconfont ad-checkbox_checked"></span>
      <AdIcon iconClass="ad-checkbox"></AdIcon>
      <span class="ad-iconfont ad-checkbox"></span>
<!--      <AdIcon iconClass="ad-checkbox"></AdIcon>-->
<!--      <span class="ad-iconfont ad-radio_checked_disable"></span>-->
      <AdIcon iconClass="ad-radio_checked"></AdIcon>
      <span class="ad-iconfont ad-radio_checked"></span>
      <AdIcon iconClass="ad-radio"></AdIcon>
      <span class="ad-iconfont ad-radio"></span>
      <!--  svg  -->
      <AdIcon iconClass="ad-frozen" @click="test"></AdIcon>
      <!--Table 操作 用： Icon按钮-->
      <el-tooltip placement="top" :content="$t('outboundOrder.btn.view')">
        <el-button class="ad-icon-button" @click="test('row')">
          <AdIcon iconClass="ad-view"></AdIcon>
        </el-button>
      </el-tooltip>
    </div>

    <div class="common_title">下拉Dropdown AdDropdown</div>
    <div class="content">
      <AdDropdown v-model="dropdownValue" :options="dropdownOptions" clearable modelValue>
<!--        <template #btn="{ selectOption, showClear }">
          <span class="ad-dropdown-link">
            {{$log(showClear, 'showClear')}}
            {{selectOption.label}}
             <i :class="['action el-icon-arrow-down']" />
          </span>
        </template>-->
      </AdDropdown>

      <AdDropdown v-model="dropdownValue" :options="dropdownOptions" @command="$log($event, 'command 测试')">
        <template #btn="test">
          <span class="ad-dropdown-link">
            {{test}}
             <i :class="['action el-icon-arrow-down']" />
          </span>
        </template>
        <template slot="options">
          <el-dropdown-item
            v-for="opt in dropdownOptions"
            :key="opt.value"
            :command="opt.value"
            :disabled="opt.disabled"
          >
            ---{{ opt.label }}---- label
          </el-dropdown-item>
        </template>
      </AdDropdown>
    </div>
    <div class="common_title">暂无数据 AdNoData</div>
    <div class="content">
      <AdNoData
        @click="$log('test....')"
        isFull
      >
<!--        message="<div style='background: #f00;'>test: lang: {$i18n.locale}</div>"-->
        <template v-slot:extraContent>no data</template>
      </AdNoData>
    </div>
    <div class="common_title">AdDraggableNest</div>
    <div class="content">
      <AdDraggableNest
        style="background: #fafafa;"
        v-model="checkedOptions"
        :move="onMove"
      />
    </div>
    <div class="common_title">iconfont && AdIcon</div>
    <div class="content">...</div>
  </div>
</template>

<script>

export default {
  name: 'home',
  components: {
  },
  data() {
    return {
      checkedOptions: [
        {
          label: 'Normal',
          prop: 'Normal'
        },
        {
          label: `test_children`,
          prop: 'test_children',
          children: [
            {
              label: 'child0_001',
              prop: 'child0_001'
            },
            {
              label: 'child0_002',
              prop: 'child0_002'
            }
          ]
        },
        {
          label: `orderNo`,
          prop: 'orderNo'
        },
        {
          // 多语言
          t_label: `adb.table.action`,
          prop: 'action',
          fixed: 'right'
        }
      ],
      testNumber: 1,
      testDrawer: false,
      searchParams: {
        radio: undefined,
        input: 'testInput',
        adSelectMultiple: ['选项1'],
        adSelectMultipleMore: ['选项2']
      },
      formOptions: {
        // 调整是否 isMore todo... 交互
        forms: [
          {
            visible: true, // 只要不为false 就是 展示
            isMore: false, // 只要不为true 就是 默认展示
            prop: 'input', // 提交的 params 的字段
            label: 'input', // label 标签
            itemType: 'input' // form-item 类型
            // prepend: 'Http://', // 额外form-item配置
            // append: '.com' // 额外form-item配置
            // placeholder: '请输入input..............' // 额外form-item配置
          },
          {
            visible: true, // 只要不为false 就是 展示
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'inputMore', // 提交的 params 的字段
            label: 'inputMore', // label 标签
            itemType: 'input' // form-item 类型
            // prepend: 'Http://', // 额外form-item配置
            // append: '.com' // 额外form-item配置
          },
          {
            // visible: true, // 只要不为false 就是 展示
            // isMore: true, // 只要不为true 就是 默认展示
            prop: 'adSelect', // 提交的 params 的字段
            label: 'adSelect', // label 标签
            itemType: 'adSelect', // form-item 类型
            labelKey: 'label_1',
            valueKey: 'value_1',
            options: Array.from({ length: 20 }).map((_, i) => {
              return {
                value_1: '选项' + i,
                label_1: '黄金糕' + i
              }
            })
            /** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 */
            // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
            // showSearch: true,
          },
          {
            // visible: true, // 只要不为false 就是 展示
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'adSelectMore', // 提交的 params 的字段
            label: 'adSelectMore', // label 标签
            itemType: 'adSelect', // form-item 类型
            labelKey: 'label_1',
            valueKey: 'value_1',
            options: Array.from({ length: 20 }).map((_, i) => {
              return {
                value_1: '选项' + i,
                label_1: '黄金糕' + i
              }
            })
            /** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 */
            // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
            // showSearch: true,
          },
          {
            // visible: true, // 只要不为false 就是 展示
            // isMore: true, // 只要不为true 就是 默认展示
            prop: 'adSelectMultiple', // 提交的 params 的字段
            label: 'adSelectMultiple', // label 标签
            itemType: 'adSelect', // form-item 类型
            multiple: true,
            labelKey: 'label_1',
            valueKey: 'value_1',
            options: Array.from({ length: 20 }).map((_, i) => {
              return {
                value_1: '选项' + i,
                label_1: '黄金糕' + i
              }
            })
            /** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 */
            // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
            // showSearch: true,
          },
          {
            // visible: true, // 只要不为false 就是 展示
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'adSelectMultipleMore', // 提交的 params 的字段
            label: 'adSelectMultipleMore', // label 标签
            itemType: 'adSelect', // form-item 类型
            multiple: true,
            labelKey: 'label_1',
            valueKey: 'value_1',
            options: Array.from({ length: 20 }).map((_, i) => {
              return {
                value_1: '选项' + i,
                label_1: '黄金糕' + i
              }
            })
            /** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 */
            // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
            // showSearch: true,
          },
          /* { // 可用于特殊场合中 但不支持 tagList   （支持 替代  iconTip itemType 类型）
            // showLabel: true,
            prop: 'render',
            label: '自定义Render',
            itemType: 'render',
            // change(...args) {
            //   console.error(...args, 'change...')
            // },
            // render: (h, extendsParams) => {
            //   const { form, params } = extendsParams
            //   return <a-input v-model={params[form.prop]} placeholder="placeholder test... 666"/>
            // } // todo....
            render: (h, extendsParams) => {
              // const { form, params } = extendsParams
              return <div class="icon-button-box">
                <a-tooltip>
                  <template slot="title">
                    <span domPropsInnerHTML={ '说明：<br/>' +
                      '1、分时统计：根据选择的日期范围统计每个小时的数据汇总。<br/>' +
                      '2、按周分时统计：根据选择的日期范围统计星期的数据汇总。<br/>' +
                      'eg：选择日期范围为30天，30天约等于4周。下拉选项选择“星期一”，1个月共4个星期一，系统将每个星期一的数据进行汇总统计。<br/>' +
                      '3、按日分时统计：根据选择的日期范围统计每个小时的数据。<br/>' +
                      '4、按周统计：周一到周日维度的统计<br/>' +
                      '5、按月统计：1月~12月维度的统计' }></span>
                  </template>
                  <i class='iconfont icon-question'/>
                </a-tooltip>
              </div>
            }
          }, */
          /* {
            // visible: true, // 只要不为false 就是 展示
            // isMore: true, // 只要不为true 就是 默认展示
            prop: 'select', // 提交的 params 的字段
            label: 'SELECT', // label 标签
            itemType: 'select', // form-item 类型
            options: [
              { value: 0, label: '小三' },
              { value: 1, label: '小四' }
            ]
            /!** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 *!/
            // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
            // showSearch: true,
          },
          {
            // visible: true, // 只要不为false 就是 展示
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'select', // 提交的 params 的字段
            label: 'SELECT', // label 标签
            itemType: 'select', // form-item 类型
            options: [
              { value: 0, label: '小三' },
              { value: 1, label: '小四' }
            ]
            /!** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 *!/
            // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
            // showSearch: true,
          }, */
          // {
          //   prop: 'rangePicker', // 默认走bondCode 对应的  bondCodeStart, bondCodeEnd 两个字段取值 若有不同 请 使用 startKey, endKey 作定义
          //   label: 'rangePicker(对应a-range-picker)',
          //   itemType: 'rangePicker',
          //   calendarChange: (dates) => {
          //     console.log(dates, 'test onCalendarChange')
          //   }
          // },
          /* {
            // showLabel: true,
            // isMore: true, // 只要不为true 就是 默认展示
            prop: 'dateRange', // 默认走bondCode 对应的  bondCodeStart, bondCodeEnd 两个字段取值 若有不同 请 使用 startKey, endKey 作定义
            label: 'rangePicker(对应a-range-picker2)',
            itemType: 'rangePicker'
          },
          {
            prop: 'datePicker', // 默认走bondCode 对应的  bondCodeStart, bondCodeEnd 两个字段取值 若有不同 请 使用 startKey, endKey 作定义
            label: 'datePicker',
            itemType: 'datePicker',
            change(params, options, isMore) {
              // // 模拟针对 change 事件 对 其他formItem 进行调整 (success) to do...
              // that.searchParams2.rangePicker = undefined // 测试only
              // console.log(params, options, isMore, 'value, options, isMore')
            }
          },
          {
            // isMore: true, // 只要不为true 就是 默认展示
            prop: 'datePicker2', // 默认走bondCode 对应的  bondCodeStart, bondCodeEnd 两个字段取值 若有不同 请 使用 startKey, endKey 作定义
            label: 'datePicker2',
            itemType: 'datePicker'
          },

          {
            prop: 'monthPicker',
            label: 'monthPicker',
            itemType: 'monthPicker'
          },
          {
            prop: 'inputNumber',
            label: 'inputNumber',
            itemType: 'inputNumber',
            change: (val) => {
              console.log('inputNumber   change.....', val)
            }
          }, */
          // {
          //   isMore: true, // 只要不为true 就是 默认展示
          //   prop: 'inputNumber2',
          //   label: 'inputNumber2',
          //   itemType: 'inputNumber'
          // },
          {
            prop: 'radio',
            label: 'radio',
            itemType: 'radio',
            showLabel: true,
            options: [
              { value: 0, label: '未结算' },
              { value: 1, label: '已结算' },
              { value: 2, label: '全部' }
            ],
            change: (val) => {
              console.log('radio   change.....', val)
            }
          },
          {
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'radioMore',
            label: 'radioMore',
            itemType: 'radio',
            showLabel: true,
            options: [
              { value: 10, label: '1未结算' },
              { value: 11, label: '1已结算' },
              { value: 12, label: '1全部' }
            ],
            change: (val) => {
              console.log('radio   change.....', val)
            }
          }
          /* {
            // isMore: true, // 只要不为true 就是 默认展示
            // showLabel: true,
            prop: 'inputNumberRange', // 若不添加 propStart  propEnd 自动变为 `${prop}Start` `${prop}End`
            // propStart: 'inputNumberRange_start',
            // propEnd: 'inputNumberRange_end',
            label: 'inputNumberRange',
            itemType: 'inputNumberRange',
            placeholderStart: 'xxxx最小值',
            placeholderEnd: 'xxxx最大值',
            change(params, _options, isMore, propKey) {
              console.log(params, _options, isMore, propKey, 'params, _options, isMore, propKey')
            }
          } */
          // 复合类型_【下拉+rangePicker】 注：  【替代： SearchInfo timeSelect 类型】
          /* { // 复合类型 todo...
            // isMore: true, // 只要不为true 就是 默认展示 (暂无该类型)
            label: 'compact_label',
            // showLabel: true,
            itemType: 'compact',
            children: [
              {
                prop: 'compact_select&rangePicker_select',
                label: 'compact_select&rangePicker_select',
                itemType: 'select',
                options: [
                  { value: 0, label: '小三' },
                  { value: 1, label: '小四' }
                ],
                // showSearch: true,
                itemWidth: '90px'
                // placeholder: '请选择select'
              },
              {
                prop: 'compact_select&rangePicker_rangePicker',
                label: 'compact_select&rangePicker_rangePicker',
                itemType: 'rangePicker',
                calendarChange: (dates) => {
                  console.log(dates, 'test compact_select&rangePicker_ onCalendarChange')
                }
              }
            ]
          }, */
          /* // 复合类型_【下拉+input】 注：  【替代： SearchInfo textSelect 类型】
          {
            // isMore: true, // 只要不为true 就是 默认展示 (暂无该类型)
            label: 'compact_select&input',
            // showLabel: true,
            itemType: 'compact',
            children: [
              {
                prop: 'compact_select&input_select',
                label: 'compact_select&input_select',
                itemType: 'select',
                options: [
                  { value: 0, label: '小三' },
                  { value: 1, label: '小四' }
                ],
                // showSearch: true,
                allowClear: false,
                itemWidth: '90px'
              },
              {
                prop: 'compact_select&input_input', // 提交的 params 的字段
                label: 'compact_select&input_input', // label 标签
                itemType: 'input',
                itemWidth: '190px',
                placeholder: '支持模糊搜索'
              }
            ]
          }, */
        ]
      },
      options: Array.from({ length: 20 }).map((_, i) => {
        return {
          value: '选项' + i,
          label: '黄金糕' + i
        }
      }),
      testValue: undefined,
      testValue2: ['选项0', '选项1', '选项2'],
      dropdownValue: undefined,
      dropdownOptions: [
        {
          label: 'in',
          value: 0
        },
        {
          label: 'cm',
          value: 1
        }
      ]
    }
  },
  watch: {
    searchParams(params) {
      console.error(params, 'searchParams 更新...')
    }
  },
  methods: {
    selectedSettingSubmit(group, dialog) {
      // group: searchGroup 组件实例
      // dialog: 配置快捷forms 弹窗实例
      dialog.submitLoading = true
      setTimeout(() => {
        console.warn('todo...... checkedOptions 提交 commit', dialog.checkedOptions)
        dialog.submitLoading = false
        // dialog.visibleChange(false)
        this.$message.success(this.$t('adb.message.editSuccess'))
        // const forms = JSON.parse(JSON.stringify(this.formOptions.forms))
        const moreForms = this.formOptions.forms
        moreForms.forEach(v => {
          v.isMore = true
        })
        const defaultForms = dialog.checkedOptions.reduce((items, cur) => {
          const idx = moreForms.findIndex(v => v.prop === cur.prop)
          if (idx > -1) {
            // forms 内删除 确定的快捷方式
            const [item] = moreForms.splice(idx, 1)
            item.isMore = false
            // defaultForms 内添加 该item
            items.push(item)
          }
          return items
        }, [])
        // 重置 formOptions.forms
        this.formOptions.forms = defaultForms.concat(moreForms)

        // group.selectedSettingVisible = false
        group.selectedSettingVisibleChange(false)
      }, 500)
    },
    test() {
      console.error('test...')
    },
    switchLang() {
      let lang = this.$i18n.locale
      if (lang === 'en') {
        lang = 'zh'
      } else {
        lang = 'en'
      }
      this.$i18n.locale = lang
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      // fixed 表示 固定的项
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.pageWrap {
  padding: 10px 12px;
  overflow: auto;
}

</style>
