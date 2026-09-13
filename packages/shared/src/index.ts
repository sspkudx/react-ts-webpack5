/**
 * 将任意输入安全转换为数字
 * @param inputValue - 待转换的值（字符串、数字、数组等均可，遵循 Number() 转换规则）
 * @returns 转换后的数字；无法转换时（结果为 NaN）兜底返回 0
 * @example
 * safeNum('123') // 123
 * safeNum('abc') // 0
 * safeNum(null)  // 0
 */
function safeNum(inputValue: unknown): number {
    let res = Number(inputValue);
    if (Number.isNaN(res)) {
        res = 0;
    }
    return res;
}

/**
 * 判断值是否为有效数字
 * @description 排除 NaN：NaN 属于 number 类型但不是有效数字
 * @param value - 待判断的值
 * @returns 是有效数字返回 true，否则返回 false
 */
function isNumber(value: unknown): value is number {
    return typeof value === 'number' && !Number.isNaN(value);
}

/**
 * 判断值是否为字符串
 * @param value - 待判断的值
 * @returns 是字符串返回 true，否则返回 false
 */
function isString(value: unknown): value is string {
    return typeof value === 'string';
}

/**
 * 判断值是否为纯对象（plain object）
 * @description 排除 null、数组与非 object 类型，且原型为 Object 的对象才返回 true
 * @param value - 待判断的值
 * @returns 是纯对象返回 true，否则返回 false
 */
function isObject(value: unknown): value is Record<string, unknown> {
    return (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.prototype.toString.call(value) === '[object Object]'
    );
}

/**
 * 判断值是否为空
 * @description null/undefined、空字符串（含全空白）、空数组、空对象均视为空；
 * 数字、布尔值、Map/Set 等非上述类型一律视为非空
 * @param value - 待判断的值
 * @returns 为空返回 true，否则返回 false
 */
function isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) {
        return true;
    }

    if (typeof value === 'string') {
        return value.trim() === '';
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    if (isObject(value)) {
        return Object.keys(value).length === 0;
    }

    return false;
}

/**
 * 格式化数字为固定小数位字符串
 * @description 非有效数字直接返回 '0'；decimals 负数按 0 处理、小数向下取整。
 * 注意浮点精度问题：如 formatNumber(1.005, 2) 结果为 '1.00' 而非 '1.01'
 * @param num - 待格式化的数字
 * @param decimals - 小数位数，默认 2
 * @returns 格式化后的字符串
 * @example
 * formatNumber(123.456, 2) // '123.46'
 * formatNumber('abc', 2)   // '0'
 */
function formatNumber(num: number, decimals = 2): string {
    if (!isNumber(num)) {
        return '0';
    }

    // 确保 decimals 是非负整数
    const validDecimals = Math.max(0, Math.floor(decimals));
    const factor = Math.pow(10, validDecimals);
    const rounded = Math.round(num * factor) / factor;
    return rounded.toFixed(validDecimals);
}

export { safeNum, isNumber, isString, isObject, isEmpty, formatNumber };
