;(function (window, undefined) {
  var VERSION = '0.0.1',
      DEBUG = false,
      hasOwn = Object.prototype.hasOwnProperty,
      toStr = Object.prototype.toString,
      _slice = Array.prototype.slice,
      ATTR = /attrs/i;

  function _foreach (obj, fn) {
    var k = 0, l = obj.length;
    if (is_arr(obj)) {
      for (; k < l; k++) {
        (function (key, val) {
          fn.call(obj, key, val);
        }(k, obj[k]));
      }
    } else {
      for (k in obj) {
        if (hasOwn.call(obj, k)) {
          (function (key, val) {
            fn.call(obj, key, val);
          }(k, obj[k]));
        }
      }
    }
  }

  function is_str(obj) {
    return toStr.call(obj) === '[object String]';
  }

  function is_arr(obj) {
    return toStr.call(obj) === '[object Array]';
  }

  function x_times (c, x) {
    x = x || 0;
    var i = 0, out = ""; for(;i < x; i++) { out += c; };
    return out;
  }

  function val_str(val, depth) {
    var out = "";
    if (is_str(val)) {
      out += (DEBUG ? x_times("\t", depth) : "") + val;
    } else {
      _foreach(val, function (i, v) {
          out += v.toString(depth) + (DEBUG ? "\n" : "");
      });
    }
    return out;
  }

  function XXMLNode(tag, val, attrs) {
    this.tag = tag;
    this.attrs = this.attrString(attrs);
    this.val = val != null ? val : [];
  }

  XXMLNode.prototype = {
    addChild: function (child) {
      this.val.push(child);
    },
    children: function () {
      return this.val;
    },
    attrString: function (attrs) {
      var out = "";
      if (!attrs) return "";

      _foreach(attrs, function (key, val) {
        out += " " + key + "='" + val + "'";
      });

      return out;

    },
    toString: function (depth) {
      if (depth != null && DEBUG) {
        return this.debugString(depth);
      } else {
        var str =  "<" + this.tag + this.attrs + ">" + val_str(this.val, depth + 1) + "</" + this.tag + ">";
        return str;
      }
    }, 
    debugString: function (depth) {
      return [
        x_times("\t", depth),
        "<", this.tag, this.attrString(), ">\n",
        val_str(this.val, depth + 1),"\n",
        x_times("\t", depth),
        "</", this.tag, ">"
      ].join("");
    }
  };

  function parse (obj) {

    var attrs, nodes = [];

    if (is_str(obj)) {
      return obj;
    }

    _foreach(obj, function (tag, val) {

      if (ATTR.test(tag)) return;

      switch (true) {
        case (val == null):
          break;
        case (is_str(val)):
          nodes.push(new XXMLNode(tag, val, val.attrs));
          break;
        case  (is_arr(val)):
          _foreach(val, function (i, n) {
            if (n.text) {
              var text = n.text.toString(); delete n.text;
              nodes.push(new XXMLNode(tag, text, n));
            } else {
              nodes.push(new XXMLNode(tag, parse(n), n.attrs));
            }
          });
          break;
        default:
          if (val.text) {
            var text = val.text.toString(); delete val.text;
            nodes.push(new XXMLNode(tag, text, val));
          }  else {
            nodes.push(new XXMLNode(tag, parse(val), val.attrs));
          }
          break;
      }

    });

    return nodes;
  }

  function stringify(obj) {
    if (!obj) return;

    var nodes = parse(obj), out = "", root;

    if (nodes.length > 1) {
      root = new XXMLNode('xml', nodes);
    } else if (nodes.length === 1) {
      root = nodes[0];
    }

    return root.toString(0) + (DEBUG ? "\n" : "");
  }

  var json_parse = JSON && JSON.parse ? JSON.parse : eval;

  function json_to_xml (json) {
    try {
      var json_obj = json_parse(json),
          xml = stringify(json_obj);
          return xml;
    } catch (e) {
      console.log(e);
    }
  }

  window.XXML = window.XXML || {};

  // public API
  window.XXML.parse = parse;
  window.XXML.stringify = stringify;
  window.XXML.json_to_xml = json_to_xml;
  window.XXML.XXMLNode = XXMLNode;

}(window));
