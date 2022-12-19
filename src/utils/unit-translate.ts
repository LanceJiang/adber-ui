// @ts-ignore
import { Decimal } from 'decimal.js'
export { Decimal }
interface IntUnitTranslate {
  conversionOfNumber: (arr: number[], voe: number) => number[]
  computedLBSOrKgForWeightArr: (arr: number[], voe?: number) => number
  computedOzOrGForWeightArr: (arr: number[], voe?: number) => number
  computedWeightArrForLBSOrKg: (num: number, voe?: number) => number[]
  computedWeightArrForGOrOz: (num: number, voe?: number) => number[]
  /* 把weight 装换为 数组；
   * num: number 重量
   * unit: 'LBS'|'OZS'|'KGS'|'GS' 重量
   * lbs => [lbs,oz] | oz => [lbs,oz] | kg => [kg,g] | g => [kg,g];
   */
  translateWeightArrOfWeight: (num: number, unit: string) => number[]
}

// function conversionOfOz(oz: Decimal, unit = 16) {
//   return oz.div(unit).toNumber(); // todo 确定可以不用 unit-translate.ts 后 进行删除
// }

// add加法 sub减法  mul乘法 div除法
export const UnitTranslate: IntUnitTranslate = {
  conversionOfNumber(arr: number[], voe = 16) {
    let [num1, num2] = arr
    if (num1 % 1 !== 0) {
      // num1 = num1向下取整； 借位 = 余数 * voe; num2 += 借位；
      const borrowArr = `${num1}`.split('.')
      num1 = +borrowArr[0]
      num2 = new Decimal(+`0.${borrowArr[1]}`).mul(voe).add(num2).toNumber()
    }

    if (num2 >= voe) {
      const num11 = new Decimal(num1)
      // const _num2 = new Decimal(num2);
      const num1OfPlus = Math.floor(num2 / voe)
      const num2OfRem = num2 % voe
      return [num11.plus(num1OfPlus).toNumber(), num2OfRem]
    }
    return [num1, num2]
  },
  // [16,8] 转换为 g/oz
  computedOzOrGForWeightArr(arr: number[], voe = 16) {
    const [num1, num2] = arr
    const coe = new Decimal(num1).mul(voe) // 16 * 16 = 256
    return coe.add(num2).toNumber() // 256 + 8 = 264
  },
  // [16,8] 转换为 kg/lb
  computedLBSOrKgForWeightArr(arr: number[], voe = 16) {
    const coe = new Decimal(1).div(voe) // 1/16
    const [num1, num2] = arr
    return coe.mul(num2).add(num1).toNumber() // 1/16 * 8 + 16 = 16.5
  },
  //  16.32
  computedWeightArrForLBSOrKg(num: number, coe = 16): number[] {
    const strNum = `${num}`
    const arrNum: (number | string)[] = strNum.split('.') // [16,32]
    const numOne = arrNum[0] // 16
    let numTwo = arrNum[1] || 0 // 32
    if (numTwo) {
      numTwo = new Decimal(+`0.${numTwo}`).mul(coe).toNumber().toFixed(3) // 0.32*16 = 5.12
    } else {
      numTwo = 0
    }
    return [+numOne, +numTwo] // [16,5.12]
  },
  // 16.32
  computedWeightArrForGOrOz(num: number, coe = 16): number[] {
    const strNum = `${num}`
    const arrNum: (number | string)[] = strNum.split('.') // [16,32]
    const decimalNum = arrNum[1] ? +`0.${arrNum[1]}` : 0 // 0.32
    const weightNum = +arrNum[0] // 16
    let [numOne, numTwo] = [0, 0]
    numOne = Math.floor(weightNum / coe) // 1
    numTwo = new Decimal(weightNum % coe).add(decimalNum).toNumber() // 0.32

    return [numOne, numTwo] // [1,0.32]
  },
  translateWeightArrOfWeight(num: number, unit: string): number[] {
    let returnArr: number[] = [0, 0]
    switch (unit) {
      case 'LBS':
      case 'lbs':
      case 'lb':
        returnArr = this.computedWeightArrForLBSOrKg(num, 16)
        break
      case 'OZS':
      case 'ozs':
      case 'oz':
        returnArr = this.computedWeightArrForGOrOz(num, 16)
        break
      case 'KGS':
      case 'kgs':
      case 'kg':
        returnArr = this.computedWeightArrForLBSOrKg(num, 1000)
        break
      case 'GS':
      case 'gs':
      case 'g':
        returnArr = this.computedWeightArrForGOrOz(num, 1000)
        break
      default:
        break
    }
    return returnArr
  },
}

// 尺寸
export enum DimensionsCode {
  CM = 'cm',
  In = 'in',
}

// 重量
export enum WeightCode {
  G = 'g',
  Oz = 'oz',
}

// 重量单位切换
export const weightUnits = [
  {
    label: 'lb/oz',
    value: 0,
    param: 'oz',
    code: ['lb', 'oz'],
    step: 16,
    length: 3,
  },
  {
    label: 'kg/g',
    value: 1,
    param: 'g',
    code: ['kg', 'g'],
    step: 1000,
    length: 3,
  },
]

// 重量单位名称数组
// eslint-disable-next-line
// @ts-ignore
export const weightUnitCodes = weightUnits.reduce((res: { [key: string]: string[] }, v) => {
  res[v.param] = v.code
  return res
}, {})

// 尺寸单位切换
export const sizeUnits: {
  label: string
  param: 'in' | 'cm'
  value: number
  code: 'in' | 'cm'
}[] = [
  {
    label: 'in',
    value: 0,
    param: 'in',
    code: 'in',
  },
  {
    label: 'cm',
    value: 1,
    param: 'cm',
    code: 'cm',
  },
]
