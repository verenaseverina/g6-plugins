// import { wrapBehavior, each, deepMix } from '../node_modules/@antv/util/lib/index.js';

var toString = {}.toString;
var is_type_1 = function (value, type) { return toString.call(value) === '[object ' + type + ']'; };
var is_array_1 = function (value) {
  return Array.isArray ?
      Array.isArray(value) :
      is_type_1(value, 'Array');
};
var is_object_1 = function (value) {
  /**
   * isObject({}) => true
   * isObject([1, 2, 3]) => true
   * isObject(Function) => true
   * isObject(null) => false
   */
  var type = typeof value;
  return value !== null && type === 'object' || type === 'function';
};
var is_plain_object_1 = function (value) {
  /**
   * isObjectLike(new Foo) => false
   * isObjectLike([1, 2, 3]) => false
   * isObjectLike({ x: 0, y: 0 }) => true
   * isObjectLike(Object.create(null)) => true
   */
  if (!is_object_like_1(value) || !is_type_1(value, 'Object')) {
      return false;
  }
  if (Object.getPrototypeOf(value) === null) {
      return true;
  }
  var proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
};
var is_object_like_1 = function (value) {
  /**
   * isObjectLike({}) => true
   * isObjectLike([1, 2, 3]) => true
   * isObjectLike(Function) => false
   * isObjectLike(null) => false
   */
  return typeof value === 'object' && value !== null;
};

var MAX_MIX_LEVEL = 5;
function _deepMix(dist, src, level, maxLevel) {
    level = level || 0;
    maxLevel = maxLevel || MAX_MIX_LEVEL;
    for (var key in src) {
        if (src.hasOwnProperty(key)) {
            var value = src[key];
            if (value !== null && is_plain_object_1(value)) {
                if (!is_plain_object_1(dist[key])) {
                    dist[key] = {};
                }
                if (level < maxLevel) {
                    _deepMix(dist[key], value, level + 1, maxLevel);
                }
                else {
                    dist[key] = src[key];
                }
            }
            else if (is_array_1(value)) {
                dist[key] = [];
                dist[key] = dist[key].concat(value);
            }
            else if (value !== undefined) {
                dist[key] = value;
            }
        }
    }
}
// todo 重写
var deepMix = function (rst) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < args.length; i += 1) {
        _deepMix(rst, args[i]);
    }
    return rst;
}

function each(elements, func) {
  if (!elements) {
      return;
  }
  var rst;
  if (is_array_1(elements)) {
      for (var i = 0, len = elements.length; i < len; i++) {
          rst = func(elements[i], i);
          if (rst === false) {
              break;
          }
      }
  }
  else if (is_object_1(elements)) {
      for (var k in elements) {
          if (elements.hasOwnProperty(k)) {
              rst = func(elements[k], k);
              if (rst === false) {
                  break;
              }
          }
      }
  }
}

function wrapBehavior(obj, action) {
  if (obj['_wrap_' + action]) {
      return obj['_wrap_' + action];
  }
  var method = function (e) {
      obj[action](e);
  };
  obj['_wrap_' + action] = method;
  return method;
}

export var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var PluginBase = function () {
  /**
   * 插件基类的构造函数
   * @param cfgs 插件的配置项
   */
  function PluginBase(cfgs) {
    this._cfgs = deepMix(this.getDefaultCfgs(), cfgs);
    this._events = {};
    this.destroyed = false;
  }
  /**
   * 获取默认的插件配置
   */


  PluginBase.prototype.getDefaultCfgs = function () {
    return {};
  };
  /**
   * 初始化插件
   * @param graph IGraph 实例
   */


  PluginBase.prototype.initPlugin = function (graph) {
    var self = this;
    self.set('graph', graph);
    var events = self.getEvents();
    var bindEvents = {};
    each(events, function (v, k) {
      var event = wrapBehavior(self, v);
      bindEvents[k] = event;
      graph.on(k, event);
    });
    this._events = bindEvents;
    this.init();
  };
  /**
   * 获取插件中的事件和事件处理方法，供子类实现
   */


  PluginBase.prototype.getEvents = function () {
    return {};
  };
  /**
   * 获取配置项中的某个值
   * @param key 键值
   */


  PluginBase.prototype.get = function (key) {
    var _a;

    return (_a = this._cfgs) === null || _a === void 0 ? void 0 : _a[key];
  };
  /**
   * 将指定的值存储到 cfgs 中
   * @param key 键值
   * @param val 设置的值
   */


  PluginBase.prototype.set = function (key, val) {
    this._cfgs[key] = val;
  };
  /**
   * 销毁方法，供子类复写
   */


  PluginBase.prototype.destroy = function () {};
  /**
   * 销毁插件
   */


  PluginBase.prototype.destroyPlugin = function () {
    this.destroy();
    var graph = this.get('graph');
    var events = this._events;
    each(events, function (v, k) {
      graph.off(k, v);
    });
    this._events = null;
    this._cfgs = null;
    this.destroyed = true;
  };

  return PluginBase;
}();


export default PluginBase;