/**
 * Copyright (c) 2015-2019 kaochong, All rights reserved.
 * @fileoverview 平滑滚动
 * @author qiuxiaoguang | qiuxiaoguang@kaochong.com
 * @version 1.0 | 2019-05-15 | qiuxiaoguang    // 初始版本。
 * @description 平滑滚动方法封装
 */

import {
  isDom,
  isNodeList,
  getElementTop,
  getElementLeft
} from '../utils/util';

const RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60) }
const clearRAF = window.cancelAnimationFrame || window.webKitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame || window.oCancelAnimationFrame || function (timeoutName) { window.clearTimeout(timeoutName) }

function _smoothDown (options, callback) {
  let { step, total, distance, scrollObj } = options
  if (distance < total) {
    distance += step
    if (scrollObj === 'body') {
      document.documentElement.scrollTop = distance
      document.body.scrollTop = distance
    } else {
      scrollObj.scrollTop = distance
    }
    const _raf = RAF(() => {
      _raf && clearRAF(_raf)
      callback
        ? _smoothDown({ step, total, distance, scrollObj }, callback)
        : _smoothDown({ step, total, distance, scrollObj })
    })
  } else {
    if (scrollObj === 'body') {
      document.documentElement.scrollTop = total
      document.body.scrollTop = total
    } else {
      scrollObj.scrollTop = total
    }
    callback && callback()
  }
}

function _smoothUp (options, callback) {
  let { step, total, distance, scrollObj } = options
  if (distance > total) {
    distance -= step
    if (scrollObj === 'body') {
      document.documentElement.scrollTop = distance
      document.body.scrollTop = distance
    } else {
      scrollObj.scrollTop = distance
    }
    const _raf = RAF(() => {
      _raf && clearRAF(_raf)
      callback
        ? _smoothUp({ step, total, distance, scrollObj }, callback)
        : _smoothUp({ step, total, distance, scrollObj })
    })
  } else {
    if (scrollObj === 'body') {
      document.documentElement.scrollTop = total
      document.body.scrollTop = total
    } else {
      scrollObj.scrollTop = total
    }
    callback && callback()
  }
}

function _smoothLeft (options, callback) {
  let { step, total, distance, scrollObj } = options
  if (distance > total) {
    distance -= step
    if (scrollObj === 'body') {
      document.documentElement.scrollLeft = distance
      document.body.scrollLeft = distance
    } else {
      scrollObj.scrollLeft = distance
    }
    const _raf = RAF(() => {
      _raf && clearRAF(_raf)
      callback
        ? _smoothLeft({ step, total, distance, scrollObj }, callback)
        : _smoothLeft({ step, total, distance, scrollObj })
    })
  } else {
    if (scrollObj === 'body') {
      document.documentElement.scrollLeft = total
      document.body.scrollLeft = total
    } else {
      scrollObj.scrollLeft = total
    }
    callback && callback()
  }
}

function _smoothRight (options, callback) {
  let { step, total, distance, scrollObj } = options
  if (distance < total) {
    distance += step
    if (scrollObj === 'body') {
      document.documentElement.scrollLeft = distance
      document.body.scrollLeft = distance
    } else {
      scrollObj.scrollLeft = distance
    }
    const _raf = RAF(() => {
      _raf && clearRAF(_raf)
      callback
        ? _smoothRight({ step, total, distance, scrollObj }, callback)
        : _smoothRight({ step, total, distance, scrollObj })
    })
  } else {
    if (scrollObj === 'body') {
      document.documentElement.scrollLeft = total
      document.body.scrollLeft = total
    } else {
      scrollObj.scrollLeft = total
    }
    callback && callback()
  }
}

/**
 * 平滑滚动至指定元素
 * @param  {[Element, NodeList]} anchorElement           滚动至指定元素或NodeList
 * @param  {Number}              [index=0]               滚动至对应NodeList索引
 * @param  {Number}              [offset=0]              滚动偏差
 * @param  {Object}              hooks                   滚动前后钩子函数
 * @hooks  {Function}            before                  滚动前钩子函数
 * @hooks  {Function}            after                   滚动后钩子函数
 * @param  {String}              [direction=vertical]    滚动方向
 * @param  {[Object, String]}    [scrollObj=body]        滚动主体，默认为全屏
 */
const scrollToEle = (anchorElement, index = 0, offset = 0, hooks = undefined, direction = 'vertical', scrollObj = 'body') => {
  if (!isNodeList(anchorElement) && !isDom(anchorElement)) {
    console.error(new Error('[Params error] The "anchorElement" must be element or nodeList.'))
    return false
  }
  let total = 0
  if (direction === 'vertical') {
    if (anchorElement.length) {
      if (scrollObj === 'body') {
        total = getElementTop(anchorElement[index]) + parseFloat(offset)
      } else {
        total = anchorElement[index].scrollTop + parseFloat(offset)
      }
    } else {
      if (scrollObj === 'body') {
        total = getElementTop(anchorElement) + parseFloat(offset)
      } else {
        total = anchorElement.scrollTop + parseFloat(offset)
      }
    }
  } else if (direction === 'horizontal') {
    if (anchorElement.length) {
      if (scrollObj === 'body') {
        total = getElementLeft(anchorElement[index]) + parseFloat(offset)
      } else {
        total = anchorElement[index].scrollLeft + parseFloat(offset)
      }
    } else {
      if (scrollObj === 'body') {
        total = getElementLeft(anchorElement) + parseFloat(offset)
      } else {
        total = anchorElement.scrollLeft + parseFloat(offset)
      }
    }
  } else {
    console.error(new Error('[Params Error] The "direction" must be "vertical" or "horizontal".'))
    return false
  }
  scrollTo(total, {
    direction,
    hooks,
    scrollObj
  })
}

/**
 * 平滑滚动至指定位置
 * @param   {Number}   [position=0] 滚动至指定位置
 * @param   {Object}   options      参数
 * @options {String}   direction    滚动方向，默认为垂直方向
 * @options {Element}  scrollEle    滚动主体元素，默认为body
 * @options {Object}   hooks        滚动钩子函数
 * @hooks   {Function} before       滚动开始前钩子函数
 * @hooks   {Function} after        滚动结束后钩子函数
 */
const scrollTo = (position = 0, options) => {
  const direction = options.direction || 'vertical'
  const hooks = options.hooks || undefined
  const scrollEle = options.scrollObj || 'body'
  const total = position
  let distance = 0
  if (direction === 'vertical') {
    if (scrollEle === 'body') {
      distance = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    } else {
      distance = scrollEle.scrollTop
    }
    hooks && hooks.before && hooks.before()
    if (total > distance) {
      const step = total / 16
      hooks && hooks.after
        ? _smoothDown({ step, total, distance, scrollObj: scrollEle }, hooks.after)
        : _smoothDown({ step, total, distance, scrollObj: scrollEle })
    } else {
      const newTotal = distance - total
      const step = newTotal / 16
      hooks && hooks.after
        ? _smoothUp({ step, total, distance, scrollObj: scrollEle }, hooks.after)
        : _smoothUp({ step, total, distance, scrollObj: scrollEle })
    }
  } else if (direction === 'horizontal') {
    if (scrollEle === 'body') {
      distance = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft
    } else {
      distance = scrollEle.scrollLeft
    }
    hooks && hooks.before && hooks.before()
    if (total > distance) {
      const step = total / 16
      hooks && hooks.after
        ? _smoothRight()({ step, total, distance, scrollObj: scrollEle }, hooks.after)
        : _smoothRight({ step, total, distance, scrollObj: scrollEle })
    } else {
      const newTotal = distance - total
      const step = newTotal / 16
      hooks && hooks.after
        ? _smoothLeft({ step, total, distance, scrollObj: scrollEle }, hooks.after)
        : _smoothLeft({ step, total, distance, scrollObj: scrollEle })
    }
  } else {
    console.error(new Error('[Params Error] The "arugments[1].direction" must be "vertical" or "horizontal".'))
    return false
  }
};

export default {
  scrollTo,
  scrollToEle
}
