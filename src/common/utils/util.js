
/**
 * 获取查询字符串，并转换为key=>value对象
 * @return {Object} 查询字符串的对象
 */
export function getQuery () {
  let pathName = decodeURI(location.search);
  const obj = {};
  if (!pathName) {
    return obj;
  }
  // 查询字符串
  pathName = pathName.substring(1);
  // 转换为对象
  const searArr = pathName.split('&');
  searArr.forEach(item => {
    const arr = item.split('=');
    obj[arr[0]] = arr[1];
  });
  return obj;
}

/**
 * 获取某个查询字符串的值
 * @param {string} key 查询字符串的key
 * @return {string} key对应的查询字符串的value
 */
export function getQueryOfKey (key) {
  if (key == null) {
    return null;
  }

  return getQuery()[key];
}

/**
 * 检测数据类型
 *
 * @param {*} param 检验的数据
 * @return {string} 数据类型 Object => Object Array => Array string => String
 *                           number => Number null => Null undefined => Undefined...
 */
export function getType (param) {
  return Object.prototype.toString.call(param).slice(8, -1);
}

/**
 * 格式化时间
 * @param time
 * @returns {*}
 */
const timePad = (time = 0) => time < 10 ? '0' + time : time;
export function timeToDate (now) {
  var year = now.getFullYear();
  var month = timePad(now.getMonth() + 1);
  var date = timePad(now.getDate());
  var hour = timePad(now.getHours());
  var minute = timePad(now.getMinutes());
  var second = timePad(now.getSeconds());
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
}

/**
 * 深度clone
 * @param {(Object|Array)} origin 需要clone的数据源
 * @return {(Object|Array)} clone的数据
 */
export function deepClone (origin) {
  if (getType(origin) === 'Array' || getType(origin) === 'Object') {
    const json = JSON.stringify(origin);
    return JSON.parse(json);
  }
  return origin;
}

/**
 * 判断是否是Dom
 * @param  {Element}  obj
 * @return {Boolean}
 */
export function isDom (obj) {
  return typeof HTMLElement === 'object'
    ? obj instanceof HTMLElement
    : obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
}

/**
 * 判断是否是NodeList
 * @param  {NodeList}  nodeList
 * @return {Boolean}
 */
export function isNodeList (nodeList) {
  return nodeList.length > 1 && Array.prototype.every.call(nodeList, node => {
    return isDom(node);
  })
}

/**
 * 兼容代码获取当前元素滚动于顶部距离
 * @param  {Element}   el 传入元素
 * @return {Number}    滚动于顶部距离
 */
export function getElementTop (el) {
  let _actualTop = el.offsetTop;
  let _current = el.offsetParent;
  while (_current !== null) {
    _actualTop += _current.offsetTop;
    _current = _current.offsetParent;
  }
  return _actualTop;
}

/**
 * 兼容代码获取当前元素滚动于左侧距离
 * @param  {Element}   el 传入元素
 * @return {Number}    滚动于屏幕左侧距离
 */
export function getElementLeft (el) {
  let _actualLeft = el.offsetLeft;
  let _current = el.offsetParent;
  while (_current !== null) {
    _actualLeft += _current.offsetLeft;
    _current = _current.offsetParent;
  }
  return _actualLeft;
}

/**
 * Cookie操作封装
 *  @function get                     获取cookie
 *    @params {String}                  key 要获取的key
 *  @function set                     设置cookie
 *    @params {String}                  key 要设置的key
 *    @params {[String, Number Object]} val 要设置的val
 *  @function remove                  删除cookie
 *    @params {String}                  key 要删除的key
 *  @function clear                   完全清除cookie
 */
export const Cookie = {
  get (key) {
    const _cookie = '' + document.cookie;
    let ind = _cookie.indexOf(key);
    if (ind === -1 || key === '') return '';
    let ind1 = _cookie.indexOf('; ', ind);
    if (ind1 === -1) ind1 = _cookie.length;
    // 读取Cookie值
    return unescape(_cookie.substring(ind + key.length + 1, ind1))
  },
  set (key, value) {
    const _now = new Date();
    // Cookie过期时间
    let _expire = new Date();
    // 如果未设置nDays参数或者nDays为0，取默认值1
    // if(nDays == null || nDays == 0) nDays = 1;
    // 计算Cookie过期时间【 3600000 * 24  为一天】
    _expire.setTime(_now.getTime() + 3600000 * 24 * 30); // 一个月
    document.cookie = `${key}=${escape(value)}; path=/; expires=${_expire.toGMTString()}`
  },
  remove (key) {
    // const myDate = new Date()
    // myDate.setTime(-1000) // 设置时间
    // document.cookie = `${key}=; expires=${myDate.toGMTString()}`
    this.set(key, '')
  },
  removes (keys) {
    const _cookies = isArray(keys) ? keys : [keys];
    for (let i = 0; i < _cookies.length; i++) {
      this.set(_cookies[i], '')
    }
  },
  clear () {
    const _now = new Date();
    _now.setTime(-1000); // 设置时间
    let _cookie = document.cookie;
    let _cookieArray = _cookie.split('; ');
    for (let i = 0; i < _cookieArray.length; i++) {
      const _key = _cookieArray[i].split('=');
      document.cookie = `${_key[0]}=; expires=${_now.toGMTString()}`
    }
  }
};

