!(function () {
  "use strict";
  function e(o, i, t) {
    return (
      (i = void 0 === i ? 1 : i),
      (t = t || i + 1) - i <= 1
        ? function () {
            if (arguments.length <= i || "string" === c.type(arguments[i]))
              return o.apply(this, arguments);
            var t,
              e,
              n = arguments[i];
            for (e in n) {
              var r = Array.prototype.slice.call(arguments);
              r.splice(i, 1, e, n[e]), (t = o.apply(this, r));
            }
            return t;
          }
        : e(e(o, i + 1, t), i, t - 1)
    );
  }
  function s(e, n, t) {
    var r = a(t);
    if ("string" === r) {
      var o = Object.getOwnPropertyDescriptor(n, t);
      !o || (o.writable && o.configurable && o.enumerable && !o.get && !o.set)
        ? (e[t] = n[t])
        : (delete e[t], Object.defineProperty(e, t, o));
    } else if ("array" === r)
      t.forEach(function (t) {
        t in n && s(e, n, t);
      });
    else
      for (var i in n)
        (t &&
          (("regexp" === r && !t.test(i)) ||
            ("function" === r && !t.call(n, i)))) ||
          s(e, n, i);
    return e;
  }
  function a(t) {
    if (null === t) return "null";
    if (void 0 === t) return "undefined";
    var e = (
      Object.prototype.toString.call(t).match(/^\[object\s+(.*?)\]$/)[1] || ""
    ).toLowerCase();
    return "number" == e && isNaN(t) ? "nan" : e;
  }
  var c = (self.Bliss = s(function (t, e) {
    return (2 == arguments.length && !e) || !t
      ? null
      : "string" === c.type(t)
      ? (e || document).querySelector(t)
      : t || null;
  }, self.Bliss));
  s(c, {
    extend: s,
    overload: e,
    type: a,
    property: c.property || "_",
    listeners: new (self.WeakMap ? WeakMap : Map)(),
    original: {
      addEventListener: (self.EventTarget || Node).prototype.addEventListener,
      removeEventListener: (self.EventTarget || Node).prototype
        .removeEventListener,
    },
    sources: {},
    noop: function () {},
    $: function (t, e) {
      return t instanceof Node || t instanceof Window
        ? [t]
        : 2 != arguments.length || e
        ? Array.prototype.slice.call(
            "string" == typeof t ? (e || document).querySelectorAll(t) : t || []
          )
        : [];
    },
    defined: function () {
      for (var t = 0; t < arguments.length; t++)
        if (void 0 !== arguments[t]) return arguments[t];
    },
    create: function (t, e) {
      return t instanceof Node
        ? c.set(t, e)
        : (1 === arguments.length &&
            (e =
              "string" === c.type(t)
                ? {}
                : ((t = (e = t).tag),
                  c.extend({}, e, function (t) {
                    return "tag" !== t;
                  }))),
          c.set(document.createElement(t || "div"), e));
    },
    each: function (t, e, n) {
      for (var r in ((n = n || {}), t)) n[r] = e.call(t, r, t[r]);
      return n;
    },
    ready: function (e, t, n) {
      if (
        ("function" != typeof e || t || ((t = e), (e = void 0)),
        (e = e || document),
        t &&
          ("loading" !== e.readyState
            ? t()
            : c.once(e, "DOMContentLoaded", function () {
                t();
              })),
        !n)
      )
        return new Promise(function (t) {
          c.ready(e, t, !0);
        });
    },
    Class: function (t) {
      var e,
        n,
        r = ["constructor", "extends", "abstract", "static"].concat(
          Object.keys(c.classProps)
        ),
        o = t.hasOwnProperty("constructor") ? t.constructor : c.noop;
      2 == arguments.length
        ? ((n = arguments[0]), (t = arguments[1]))
        : (((n = function () {
            if (this.constructor.__abstract && this.constructor === n)
              throw new Error(
                "Abstract classes cannot be directly instantiated."
              );
            n.super && !e && n.super.apply(this, arguments),
              o.apply(this, arguments);
          }).super = t.extends || null),
          !n.super ||
            ((e = 0 === (n.super + "").indexOf("class ")) &&
              console.error(`You are using $.Class() to create a fake function-based class that extends a native JS class. This will not work.
You should convert your code to use native JS classes too. You can still pass a class into $.Class() to use its conveniences.`)),
          (n.prototype = c.extend(
            Object.create(n.super ? n.super.prototype : Object),
            { constructor: n }
          )),
          (n.prototype.super = n.super ? n.super.prototype : null),
          (n.__abstract = !!t.abstract));
      function i(t) {
        return this.hasOwnProperty(t) && -1 === r.indexOf(t);
      }
      if (t.static)
        for (var s in (c.extend(n, t.static, i), c.classProps))
          s in t.static && c.classProps[s](n, t.static[s]);
      for (s in (c.extend(n.prototype, t, i), c.classProps))
        s in t && c.classProps[s](n.prototype, t[s]);
      return n;
    },
    classProps: {
      lazy: e(function (t, e, n) {
        return (
          Object.defineProperty(t, e, {
            get: function () {
              var t = n.call(this);
              return (
                Object.defineProperty(this, e, {
                  value: t,
                  configurable: !0,
                  enumerable: !0,
                  writable: !0,
                }),
                t
              );
            },
            set: function (t) {
              Object.defineProperty(this, e, {
                value: t,
                configurable: !0,
                enumerable: !0,
                writable: !0,
              });
            },
            configurable: !0,
            enumerable: !0,
          }),
          t
        );
      }),
      live: e(function (t, n, r) {
        return (
          "function" === c.type(r) && (r = { set: r }),
          Object.defineProperty(t, n, {
            get: function () {
              var t = this["_" + n],
                e = r.get && r.get.call(this, t);
              return void 0 !== e ? e : t;
            },
            set: function (t) {
              var e = this["_" + n],
                e = r.set && r.set.call(this, t, e);
              this["_" + n] = void 0 !== e ? e : t;
            },
            configurable: r.configurable,
            enumerable: r.enumerable,
          }),
          t
        );
      }),
    },
    include: function () {
      var n = arguments[arguments.length - 1],
        t = 2 === arguments.length && arguments[0],
        r = document.createElement("script");
      return t
        ? Promise.resolve()
        : new Promise(function (t, e) {
            c.set(r, {
              async: !0,
              onload: function () {
                t(r), r.parentNode && r.parentNode.removeChild(r);
              },
              onerror: function () {
                e(r);
              },
              src: n,
              inside: document.head,
            });
          });
    },
    load: function t(r, e) {
      (e = e ? new URL(e, location.href) : location.href), (r = new URL(r, e));
      e = t.loading = t.loading || {};
      return (
        e[r + ""] ||
        (/\.css$/.test(r.pathname)
          ? (e[r + ""] = new Promise(function (t, e) {
              var n = c.create("link", {
                href: r,
                rel: "stylesheet",
                inside: document.head,
                onload: function () {
                  t(n);
                },
                onerror: function () {
                  e(n);
                },
              });
            }))
          : (e[r + ""] = c.include(r)))
      );
    },
    fetch: function (t, e) {
      if (!t)
        throw new TypeError("URL parameter is mandatory and cannot be " + t);
      var n,
        r = s(
          {
            url: new URL(t, location),
            data: "",
            method: "GET",
            headers: {},
            xhr: new XMLHttpRequest(),
          },
          e
        );
      for (n in ((r.method = r.method.toUpperCase()),
      c.hooks.run("fetch-args", r),
      "GET" === r.method && r.data && (r.url.search += r.data),
      document.body.setAttribute("data-loading", r.url),
      r.xhr.open(r.method, r.url.href, !1 !== r.async, r.user, r.password),
      e))
        if ("upload" === n)
          r.xhr.upload &&
            "object" == typeof e[n] &&
            c.extend(r.xhr.upload, e[n]);
        else if (n in r.xhr)
          try {
            r.xhr[n] = e[n];
          } catch (t) {
            self.console && console.error(t);
          }
      var o,
        t = Object.keys(r.headers).map(function (t) {
          return t.toLowerCase();
        });
      for (o in ("GET" !== r.method &&
        -1 === t.indexOf("content-type") &&
        r.xhr.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        ),
      r.headers))
        void 0 !== r.headers[o] && r.xhr.setRequestHeader(o, r.headers[o]);
      t = new Promise(function (t, e) {
        (r.xhr.onload = function () {
          document.body.removeAttribute("data-loading"),
            0 === r.xhr.status ||
            (200 <= r.xhr.status && r.xhr.status < 300) ||
            304 === r.xhr.status
              ? t(r.xhr)
              : e(
                  c.extend(Error(r.xhr.statusText), {
                    xhr: r.xhr,
                    get status() {
                      return this.xhr.status;
                    },
                  })
                );
        }),
          (r.xhr.onerror = function () {
            document.body.removeAttribute("data-loading"),
              e(c.extend(Error("Network Error"), { xhr: r.xhr }));
          }),
          (r.xhr.ontimeout = function () {
            document.body.removeAttribute("data-loading"),
              e(c.extend(Error("Network Timeout"), { xhr: r.xhr }));
          }),
          r.xhr.send("GET" === r.method ? null : r.data);
      });
      return (t.xhr = r.xhr), t;
    },
    value: function (t) {
      var e = "string" != typeof t;
      return c
        .$(arguments)
        .slice(+e)
        .reduce(
          function (t, e) {
            return t && t[e];
          },
          e ? t : self
        );
    },
  }),
    (c.Hooks = new c.Class({
      add: function (t, e, n) {
        if ("string" == typeof arguments[0])
          (Array.isArray(t) ? t : [t]).forEach(function (t) {
            (this[t] = this[t] || []), e && this[t][n ? "unshift" : "push"](e);
          }, this);
        else for (var t in arguments[0]) this.add(t, arguments[0][t], e);
      },
      run: function (t, e) {
        (this[t] = this[t] || []),
          this[t].forEach(function (t) {
            t.call(e && e.context ? e.context : e, e);
          });
      },
    })),
    (c.hooks = new c.Hooks());
  c.property;
  (c.Element = function (t) {
    (this.subject = t), (this.data = {}), (this.bliss = {});
  }),
    (c.Element.prototype = {
      set: e(function (t, e) {
        t in c.setProps
          ? c.setProps[t].call(this, e)
          : t in this
          ? (this[t] = e)
          : this.setAttribute(t, e);
      }, 0),
      transition: function (o, i) {
        return new Promise(
          function (t, e) {
            var n, r;
            "transition" in this.style && 0 !== i
              ? ((n = c.extend(
                  {},
                  this.style,
                  /^transition(Duration|Property)$/
                )),
                c.style(this, {
                  transitionDuration: (i || 400) + "ms",
                  transitionProperty: Object.keys(o).join(", "),
                }),
                c.once(this, "transitionend", function () {
                  clearTimeout(r), c.style(this, n), t(this);
                }),
                (r = setTimeout(t, i + 50, this)),
                c.style(this, o))
              : (c.style(this, o), t(this));
          }.bind(this)
        );
      },
      fire: function (t, e) {
        var n = document.createEvent("HTMLEvents");
        return n.initEvent(t, !0, !0), this.dispatchEvent(c.extend(n, e));
      },
      bind: e(function (t, n) {
        var e;
        1 < arguments.length &&
          ("function" === c.type(n) || n.handleEvent) &&
          ((e = n),
          ((n =
            "object" === c.type(arguments[2])
              ? arguments[2]
              : { capture: !!arguments[2] }).callback = e));
        var r = c.listeners.get(this) || {};
        t
          .trim()
          .split(/\s+/)
          .forEach(function (t) {
            var e;
            -1 < t.indexOf(".") && ((e = (t = t.split("."))[1]), (t = t[0])),
              (r[t] = r[t] || []),
              0 ===
                r[t].filter(function (t) {
                  return t.callback === n.callback && t.capture == n.capture;
                }).length && r[t].push(c.extend({ className: e }, n)),
              c.original.addEventListener.call(this, t, n.callback, n);
          }, this),
          c.listeners.set(this, r);
      }, 0),
      unbind: e(function (t, i) {
        var e;
        i &&
          ("function" === c.type(i) || i.handleEvent) &&
          ((e = i), (i = arguments[2])),
          ((i =
            (i = "boolean" == c.type(i) ? { capture: i } : i) || {}).callback =
            i.callback || e);
        var s = c.listeners.get(this);
        (t || "")
          .trim()
          .split(/\s+/)
          .forEach(function (t) {
            var e, n;
            if (
              (-1 < t.indexOf(".") && ((e = (t = t.split("."))[1]), (t = t[0])),
              !s)
            )
              return t && i.callback
                ? c.original.removeEventListener.call(
                    this,
                    t,
                    i.callback,
                    i.capture
                  )
                : void 0;
            for (n in s)
              if (!t || n === t)
                for (var r, o = 0; (r = s[n][o]); o++)
                  (e && e !== r.className) ||
                    (i.callback && i.callback !== r.callback) ||
                    (!!i.capture != !!r.capture &&
                      (t || i.callback || void 0 !== i.capture)) ||
                    (s[n].splice(o, 1),
                    c.original.removeEventListener.call(
                      this,
                      n,
                      r.callback,
                      r.capture
                    ),
                    o--);
          }, this);
      }, 0),
      when: function (r, o) {
        var t = this;
        return new Promise(function (n) {
          t.addEventListener(r, function t(e) {
            (o && !o.call(this, e)) || (this.removeEventListener(r, t), n(e));
          });
        });
      },
      toggleAttribute: function (t, e, n) {
        (n = arguments.length < 3 ? null !== e : n)
          ? this.setAttribute(t, e)
          : this.removeAttribute(t);
      },
    }),
    (c.setProps = {
      style: function (t) {
        for (var e in t)
          e in this.style
            ? (this.style[e] = t[e])
            : this.style.setProperty(e, t[e]);
      },
      attributes: function (t) {
        for (var e in t) this.setAttribute(e, t[e]);
      },
      properties: function (t) {
        c.extend(this, t);
      },
      events: function (t) {
        if (1 != arguments.length || !t || !t.addEventListener)
          return c.bind.apply(this, [this].concat(c.$(arguments)));
        var e,
          n = this;
        if (c.listeners) {
          var r,
            o = c.listeners.get(t);
          for (r in o)
            o[r].forEach(function (t) {
              c.bind(n, r, t.callback, t.capture);
            });
        }
        for (e in t) 0 === e.indexOf("on") && (this[e] = t[e]);
      },
      once: e(function (t, e) {
        function n() {
          return c.unbind(r, t, n), e.apply(r, arguments);
        }
        var r = this;
        c.bind(this, t, n, { once: !0 });
      }, 0),
      delegate: e(
        function (t, e, n) {
          c.bind(this, t, function (t) {
            t.target.closest(e) && n.call(this, t);
          });
        },
        0,
        2
      ),
      contents: function (t) {
        (!t && 0 !== t) ||
          (Array.isArray(t) ? t : [t]).forEach(function (t) {
            var e = c.type(t);
            /^(string|number)$/.test(e)
              ? (t = document.createTextNode(t + ""))
              : "object" === e && (t = c.create(t)),
              t instanceof Node && this.appendChild(t);
          }, this);
      },
      inside: function (t) {
        t && t.appendChild(this);
      },
      before: function (t) {
        t && t.parentNode.insertBefore(this, t);
      },
      after: function (t) {
        t && t.parentNode.insertBefore(this, t.nextSibling);
      },
      start: function (t) {
        t && t.insertBefore(this, t.firstChild);
      },
      around: function (t) {
        t && t.parentNode && c.before(this, t), this.appendChild(t);
      },
    }),
    (c.Array = function (t) {
      this.subject = t;
    }),
    (c.Array.prototype = {
      all: function (t) {
        var e = c.$(arguments).slice(1);
        return this[t].apply(this, e);
      },
    }),
    (c.add = e(function (r, n, o, t) {
      (o = c.extend({ $: !0, element: !0, array: !0 }, o)),
        "function" == c.type(n) &&
          (!o.element ||
            (r in c.Element.prototype && t) ||
            (c.Element.prototype[r] = function () {
              return (
                this.subject &&
                c.defined(n.apply(this.subject, arguments), this.subject)
              );
            }),
          !o.array ||
            (r in c.Array.prototype && t) ||
            (c.Array.prototype[r] = function () {
              var e = arguments;
              return this.subject.map(function (t) {
                return t && c.defined(n.apply(t, e), t);
              });
            }),
          o.$ &&
            ((c.sources[r] = c[r] = n),
            (o.array || o.element) &&
              (c[r] = function () {
                var t = [].slice.apply(arguments),
                  e = t.shift(),
                  n = o.array && Array.isArray(e) ? "Array" : "Element";
                return c[n].prototype[r].apply({ subject: e }, t);
              })));
    }, 0)),
    c.add(c.Array.prototype, { element: !1 }),
    c.add(c.Element.prototype),
    c.add(c.setProps),
    c.add(c.classProps, { element: !1, array: !1 });
  var n = document.createElement("_");
  c.add(
    c.extend({}, HTMLElement.prototype, function (t) {
      return "function" === c.type(n[t]);
    }),
    null,
    !0
  );
})();
var jsep = (function (e) {
  "use strict";
  const t = "Compound",
    r = "MemberExpression",
    n = "Literal";
  let o = function (e, t) {
      let r = new Error(e + " at character " + t);
      throw ((r.index = t), (r.description = e), r);
    },
    i = { "-": 1, "!": 1, "~": 1, "+": 1 },
    u = {
      "||": 1,
      "&&": 2,
      "|": 3,
      "^": 4,
      "&": 5,
      "==": 6,
      "!=": 6,
      "===": 6,
      "!==": 6,
      "<": 7,
      ">": 7,
      "<=": 7,
      ">=": 7,
      "<<": 8,
      ">>": 8,
      ">>>": 8,
      "+": 9,
      "-": 9,
      "*": 10,
      "/": 10,
      "%": 10,
    },
    a = { $: 1, _: 1 },
    l = function (e) {
      return Math.max(0, ...Object.keys(e).map((e) => e.length));
    },
    s = l(i),
    f = l(u),
    c = { true: !0, false: !1, null: null },
    p = function (e) {
      return u[e] || 0;
    },
    h = function (e, t, r) {
      return { type: "BinaryExpression", operator: e, left: t, right: r };
    },
    d = function (e) {
      return e >= 48 && e <= 57;
    },
    y = function (e) {
      return (
        (e >= 65 && e <= 90) ||
        (e >= 97 && e <= 122) ||
        (e >= 128 && !u[String.fromCharCode(e)]) ||
        a.hasOwnProperty(String.fromCharCode(e))
      );
    },
    x = function (e) {
      return y(e) || d(e);
    },
    g = function (e) {
      let a,
        l,
        g = 0,
        m = e.charAt,
        v = e.charCodeAt,
        b = function (t) {
          return m.call(e, t);
        },
        E = function (t) {
          return v.call(e, t);
        },
        C = e.length,
        O = function () {
          let e = E(g);
          for (; 32 === e || 9 === e || 10 === e || 13 === e; ) e = E(++g);
        },
        U = function () {
          let e,
            t,
            r = w();
          return (
            O(),
            63 !== E(g)
              ? r
              : (g++,
                (e = U()),
                e || o("Expected expression", g),
                O(),
                58 === E(g)
                  ? (g++,
                    (t = U()),
                    t || o("Expected expression", g),
                    {
                      type: "ConditionalExpression",
                      test: r,
                      consequent: e,
                      alternate: t,
                    })
                  : void o("Expected :", g))
          );
        },
        k = function () {
          O();
          let t = e.substr(g, f),
            r = t.length;
          for (; r > 0; ) {
            if (
              u.hasOwnProperty(t) &&
              (!y(E(g)) || (g + t.length < e.length && !x(E(g + t.length))))
            )
              return (g += r), t;
            t = t.substr(0, --r);
          }
          return !1;
        },
        w = function () {
          let e, t, r, n, i, u, a, l, s;
          if (((u = P()), (t = k()), !t)) return u;
          for (
            i = { value: t, prec: p(t) },
              a = P(),
              a || o("Expected expression after " + t, g),
              n = [u, i, a];
            (t = k()) && ((r = p(t)), 0 !== r);

          ) {
            for (
              i = { value: t, prec: r }, s = t;
              n.length > 2 && r <= n[n.length - 2].prec;

            )
              (a = n.pop()),
                (t = n.pop().value),
                (u = n.pop()),
                (e = h(t, u, a)),
                n.push(e);
            (e = P()),
              e || o("Expected expression after " + s, g),
              n.push(i, e);
          }
          for (l = n.length - 1, e = n[l]; l > 1; )
            (e = h(n[l - 1].value, n[l - 2], e)), (l -= 2);
          return e;
        },
        P = function () {
          let t, n, u, a;
          if ((O(), (t = E(g)), d(t) || 46 === t)) return S();
          if (39 === t || 34 === t) a = A();
          else if (91 === t) a = L();
          else {
            for (n = e.substr(g, s), u = n.length; u > 0; ) {
              if (
                i.hasOwnProperty(n) &&
                (!y(E(g)) || (g + n.length < e.length && !x(E(g + n.length))))
              )
                return (
                  (g += u),
                  {
                    type: "UnaryExpression",
                    operator: n,
                    argument: P(),
                    prefix: !0,
                  }
                );
              n = n.substr(0, --u);
            }
            y(t) ? (a = j()) : 40 === t && (a = B());
          }
          if (!a) return !1;
          for (O(), t = E(g); 46 === t || 91 === t || 40 === t; )
            g++,
              46 === t
                ? (O(),
                  (a = { type: r, computed: !1, object: a, property: j() }))
                : 91 === t
                ? ((a = { type: r, computed: !0, object: a, property: U() }),
                  O(),
                  (t = E(g)),
                  93 !== t && o("Unclosed [", g),
                  g++)
                : 40 === t &&
                  (a = { type: "CallExpression", arguments: M(41), callee: a }),
              O(),
              (t = E(g));
          return a;
        },
        S = function () {
          let e,
            t,
            r = "";
          for (; d(E(g)); ) r += b(g++);
          if (46 === E(g)) for (r += b(g++); d(E(g)); ) r += b(g++);
          if (((e = b(g)), "e" === e || "E" === e)) {
            for (
              r += b(g++), e = b(g), ("+" !== e && "-" !== e) || (r += b(g++));
              d(E(g));

            )
              r += b(g++);
            d(E(g - 1)) || o("Expected exponent (" + r + b(g) + ")", g);
          }
          return (
            (t = E(g)),
            y(t)
              ? o(
                  "Variable names cannot start with a number (" +
                    r +
                    b(g) +
                    ")",
                  g
                )
              : 46 === t && o("Unexpected period", g),
            { type: n, value: parseFloat(r), raw: r }
          );
        },
        A = function () {
          let e = "",
            t = b(g++),
            r = !1;
          for (; g < C; ) {
            let n = b(g++);
            if (n === t) {
              r = !0;
              break;
            }
            if ("\\" === n)
              switch (((n = b(g++)), n)) {
                case "n":
                  e += "\n";
                  break;
                case "r":
                  e += "\r";
                  break;
                case "t":
                  e += "\t";
                  break;
                case "b":
                  e += "\b";
                  break;
                case "f":
                  e += "\f";
                  break;
                case "v":
                  e += "\v";
                  break;
                default:
                  e += n;
              }
            else e += n;
          }
          return (
            r || o('Unclosed quote after "' + e + '"', g),
            { type: n, value: e, raw: t + e + t }
          );
        },
        j = function () {
          let t,
            r = E(g),
            i = g;
          for (
            y(r) ? g++ : o("Unexpected " + b(g), g);
            g < C && ((r = E(g)), x(r));

          )
            g++;
          return (
            (t = e.slice(i, g)),
            c.hasOwnProperty(t)
              ? { type: n, value: c[t], raw: t }
              : "this" === t
              ? { type: "ThisExpression" }
              : { type: "Identifier", name: t }
          );
        },
        M = function (e) {
          let r = [],
            n = !1,
            i = 0;
          for (; g < C; ) {
            O();
            let u = E(g);
            if (u === e) {
              (n = !0),
                g++,
                41 === e &&
                  i &&
                  i >= r.length &&
                  o("Unexpected token " + String.fromCharCode(e), g);
              break;
            }
            if (44 === u) {
              if ((g++, i++, i !== r.length))
                if (41 === e) o("Unexpected token ,", g);
                else if (93 === e)
                  for (let e = r.length; e < i; e++) r.push(null);
            } else {
              let e = U();
              (e && e.type !== t) || o("Expected comma", g), r.push(e);
            }
          }
          return n || o("Expected " + String.fromCharCode(e), g), r;
        },
        B = function () {
          g++;
          let e = U();
          if ((O(), 41 === E(g))) return g++, e;
          o("Unclosed (", g);
        },
        L = function () {
          return g++, { type: "ArrayExpression", elements: M(93) };
        },
        I = [];
      for (; g < C; )
        (a = E(g)),
          59 === a || 44 === a
            ? g++
            : (l = U())
            ? I.push(l)
            : g < C && o('Unexpected "' + b(g) + '"', g);
      return 1 === I.length ? I[0] : { type: t, body: I };
    };
  return (
    (g.version = "0.4.0"),
    (g.toString = function () {
      return "JavaScript Expression Parser (JSEP) v" + g.version;
    }),
    (g.addUnaryOp = function (e) {
      return (s = Math.max(e.length, s)), (i[e] = 1), this;
    }),
    (g.addBinaryOp = function (e, t) {
      return (f = Math.max(e.length, f)), (u[e] = t), this;
    }),
    (g.addIdentifierChar = function (e) {
      return (a[e] = 1), this;
    }),
    (g.addLiteral = function (e, t) {
      return (c[e] = t), this;
    }),
    (g.removeUnaryOp = function (e) {
      return delete i[e], e.length === s && (s = l(i)), this;
    }),
    (g.removeAllUnaryOps = function () {
      return (i = {}), (s = 0), this;
    }),
    (g.removeIdentifierChar = function (e) {
      return delete a[e], this;
    }),
    (g.removeBinaryOp = function (e) {
      return delete u[e], e.length === f && (f = l(u)), this;
    }),
    (g.removeAllBinaryOps = function () {
      return (u = {}), (f = 0), this;
    }),
    (g.removeLiteral = function (e) {
      return delete c[e], this;
    }),
    (g.removeAllLiterals = function () {
      return (c = {}), this;
    }),
    (e.default = g),
    Object.defineProperty(e, "__esModule", { value: !0 }),
    e
  );
})({});
//# sourceMappingURL=jsep.iife.min.js.map

/* jsep v0.3.4 (http://jsep.from.so/) */
!(function (e) {
  "use strict";
  var C = "Compound",
    U = "MemberExpression",
    w = "Literal",
    k = function (e, r) {
      var t = new Error(e + " at character " + r);
      throw ((t.index = r), (t.description = e), t);
    },
    O = { "-": !0, "!": !0, "~": !0, "+": !0 },
    S = {
      "||": 1,
      "&&": 2,
      "|": 3,
      "^": 4,
      "&": 5,
      "==": 6,
      "!=": 6,
      "===": 6,
      "!==": 6,
      "<": 7,
      ">": 7,
      "<=": 7,
      ">=": 7,
      "<<": 8,
      ">>": 8,
      ">>>": 8,
      "+": 9,
      "-": 9,
      "*": 10,
      "/": 10,
      "%": 10,
    },
    r = function (e) {
      var r,
        t = 0;
      for (var n in e) (r = n.length) > t && e.hasOwnProperty(n) && (t = r);
      return t;
    },
    j = r(O),
    A = r(S),
    P = { true: !0, false: !1, null: null },
    L = function (e) {
      return S[e] || 0;
    },
    B = function (e, r, t) {
      return {
        type:
          "||" === e || "&&" === e ? "LogicalExpression" : "BinaryExpression",
        operator: e,
        left: r,
        right: t,
      };
    },
    M = function (e) {
      return 48 <= e && e <= 57;
    },
    q = function (e) {
      return (
        36 === e ||
        95 === e ||
        (65 <= e && e <= 90) ||
        (97 <= e && e <= 122) ||
        (128 <= e && !S[String.fromCharCode(e)])
      );
    },
    J = function (e) {
      return (
        36 === e ||
        95 === e ||
        (65 <= e && e <= 90) ||
        (97 <= e && e <= 122) ||
        (48 <= e && e <= 57) ||
        (128 <= e && !S[String.fromCharCode(e)])
      );
    },
    t = function (n) {
      for (
        var e,
          r,
          p = 0,
          t = n.charAt,
          o = n.charCodeAt,
          i = function (e) {
            return t.call(n, e);
          },
          u = function (e) {
            return o.call(n, e);
          },
          s = n.length,
          f = function () {
            for (var e = u(p); 32 === e || 9 === e || 10 === e || 13 === e; )
              e = u(++p);
          },
          c = function () {
            var e,
              r,
              t = a();
            return (
              f(),
              63 !== u(p)
                ? t
                : (p++,
                  (e = c()) || k("Expected expression", p),
                  f(),
                  58 === u(p)
                    ? (p++,
                      (r = c()) || k("Expected expression", p),
                      {
                        type: "ConditionalExpression",
                        test: t,
                        consequent: e,
                        alternate: r,
                      })
                    : void k("Expected :", p))
            );
          },
          l = function () {
            f();
            for (var e = n.substr(p, A), r = e.length; 0 < r; ) {
              if (
                S.hasOwnProperty(e) &&
                (!q(u(p)) || (p + e.length < n.length && !J(u(p + e.length))))
              )
                return (p += r), e;
              e = e.substr(0, --r);
            }
            return !1;
          },
          a = function () {
            var e, r, t, n, o, i, a, u, s;
            if (((i = h()), !(r = l()))) return i;
            for (
              o = { value: r, prec: L(r) },
                (a = h()) || k("Expected expression after " + r, p),
                n = [i, o, a];
              (r = l()) && 0 !== (t = L(r));

            ) {
              for (
                o = { value: r, prec: t }, s = r;
                2 < n.length && t <= n[n.length - 2].prec;

              )
                (a = n.pop()),
                  (r = n.pop().value),
                  (i = n.pop()),
                  (e = B(r, i, a)),
                  n.push(e);
              (e = h()) || k("Expected expression after " + s, p), n.push(o, e);
            }
            for (e = n[(u = n.length - 1)]; 1 < u; )
              (e = B(n[u - 1].value, n[u - 2], e)), (u -= 2);
            return e;
          },
          h = function () {
            var e, r, t;
            if ((f(), (e = u(p)), M(e) || 46 === e)) return d();
            if (39 === e || 34 === e) return v();
            if (91 === e) return b();
            for (t = (r = n.substr(p, j)).length; 0 < t; ) {
              if (
                O.hasOwnProperty(r) &&
                (!q(u(p)) || (p + r.length < n.length && !J(u(p + r.length))))
              )
                return (
                  (p += t),
                  {
                    type: "UnaryExpression",
                    operator: r,
                    argument: h(),
                    prefix: !0,
                  }
                );
              r = r.substr(0, --t);
            }
            return !(!q(e) && 40 !== e) && g();
          },
          d = function () {
            for (var e, r, t = ""; M(u(p)); ) t += i(p++);
            if (46 === u(p)) for (t += i(p++); M(u(p)); ) t += i(p++);
            if ("e" === (e = i(p)) || "E" === e) {
              for (
                t += i(p++), ("+" !== (e = i(p)) && "-" !== e) || (t += i(p++));
                M(u(p));

              )
                t += i(p++);
              M(u(p - 1)) || k("Expected exponent (" + t + i(p) + ")", p);
            }
            return (
              (r = u(p)),
              q(r)
                ? k(
                    "Variable names cannot start with a number (" +
                      t +
                      i(p) +
                      ")",
                    p
                  )
                : 46 === r && k("Unexpected period", p),
              { type: w, value: parseFloat(t), raw: t }
            );
          },
          v = function () {
            for (var e, r = "", t = i(p++), n = !1; p < s; ) {
              if ((e = i(p++)) === t) {
                n = !0;
                break;
              }
              if ("\\" === e)
                switch ((e = i(p++))) {
                  case "n":
                    r += "\n";
                    break;
                  case "r":
                    r += "\r";
                    break;
                  case "t":
                    r += "\t";
                    break;
                  case "b":
                    r += "\b";
                    break;
                  case "f":
                    r += "\f";
                    break;
                  case "v":
                    r += "\v";
                    break;
                  default:
                    r += e;
                }
              else r += e;
            }
            return (
              n || k('Unclosed quote after "' + r + '"', p),
              { type: w, value: r, raw: t + r + t }
            );
          },
          x = function () {
            var e,
              r = u(p),
              t = p;
            for (
              q(r) ? p++ : k("Unexpected " + i(p), p);
              p < s && ((r = u(p)), J(r));

            )
              p++;
            return (
              (e = n.slice(t, p)),
              P.hasOwnProperty(e)
                ? { type: w, value: P[e], raw: e }
                : "this" === e
                ? { type: "ThisExpression" }
                : { type: "Identifier", name: e }
            );
          },
          y = function (e) {
            for (var r, t, n = [], o = !1, i = 0; p < s; ) {
              if ((f(), (r = u(p)) === e)) {
                (o = !0),
                  p++,
                  41 === e &&
                    i &&
                    i >= n.length &&
                    k("Unexpected token " + String.fromCharCode(e), p);
                break;
              }
              if (44 === r) {
                if ((p++, ++i !== n.length))
                  if (41 === e) k("Unexpected token ,", p);
                  else if (93 === e)
                    for (var a = n.length; a < i; a++) n.push(null);
              } else
                ((t = c()) && t.type !== C) || k("Expected comma", p),
                  n.push(t);
            }
            return o || k("Expected " + String.fromCharCode(e), p), n;
          },
          g = function () {
            var e, r;
            for (
              r = 40 === (e = u(p)) ? m() : x(), f(), e = u(p);
              46 === e || 91 === e || 40 === e;

            )
              p++,
                46 === e
                  ? (f(),
                    (r = { type: U, computed: !1, object: r, property: x() }))
                  : 91 === e
                  ? ((r = { type: U, computed: !0, object: r, property: c() }),
                    f(),
                    93 !== (e = u(p)) && k("Unclosed [", p),
                    p++)
                  : 40 === e &&
                    (r = {
                      type: "CallExpression",
                      arguments: y(41),
                      callee: r,
                    }),
                f(),
                (e = u(p));
            return r;
          },
          m = function () {
            p++;
            var e = c();
            if ((f(), 41 === u(p))) return p++, e;
            k("Unclosed (", p);
          },
          b = function () {
            return p++, { type: "ArrayExpression", elements: y(93) };
          },
          E = [];
        p < s;

      )
        59 === (e = u(p)) || 44 === e
          ? p++
          : (r = c())
          ? E.push(r)
          : p < s && k('Unexpected "' + i(p) + '"', p);
      return 1 === E.length ? E[0] : { type: C, body: E };
    };
  if (
    ((t.version = "0.3.4"),
    (t.toString = function () {
      return "JavaScript Expression Parser (JSEP) v" + t.version;
    }),
    (t.addUnaryOp = function (e) {
      return (j = Math.max(e.length, j)), (O[e] = !0), this;
    }),
    (t.addBinaryOp = function (e, r) {
      return (A = Math.max(e.length, A)), (S[e] = r), this;
    }),
    (t.addLiteral = function (e, r) {
      return (P[e] = r), this;
    }),
    (t.removeUnaryOp = function (e) {
      return delete O[e], e.length === j && (j = r(O)), this;
    }),
    (t.removeAllUnaryOps = function () {
      return (O = {}), (j = 0), this;
    }),
    (t.removeBinaryOp = function (e) {
      return delete S[e], e.length === A && (A = r(S)), this;
    }),
    (t.removeAllBinaryOps = function () {
      return (S = {}), (A = 0), this;
    }),
    (t.removeLiteral = function (e) {
      return delete P[e], this;
    }),
    (t.removeAllLiterals = function () {
      return (P = {}), this;
    }),
    "undefined" == typeof exports)
  ) {
    var n = e.jsep;
    (e.jsep = t).noConflict = function () {
      return e.jsep === t && (e.jsep = n), t;
    };
  } else
    "undefined" != typeof module && module.exports
      ? (exports = module.exports = t)
      : (exports.parse = t);
})(this);
//# sourceMappingURL=jsep.min.js.map
!(function () {
  if (
    self.Element &&
    (Element.prototype.matches ||
      (Element.prototype.matches =
        Element.prototype.webkitMatchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        null),
    Element.prototype.matches)
  ) {
    var p = (self.Stretchy = {
      selectors: {
        base:
          'textarea, select:not([size]), input:not([type]), input[type="' +
          "text number url email tel".split(" ").join('"], input[type="') +
          '"]',
        filter: "*",
      },
      script: document.currentScript || t("script").pop(),
      resize: function (e) {
        if (p.resizes(e)) {
          var t,
            i = getComputedStyle(e),
            n = 0;
          !e.value && e.placeholder && ((t = !0), (e.value = e.placeholder));
          var o = e.nodeName.toLowerCase();
          if ("textarea" == o)
            (e.style.height = "0"),
              "border-box" == i.boxSizing
                ? (n = e.offsetHeight)
                : "content-box" == i.boxSizing &&
                  (n = -e.clientHeight + parseFloat(i.minHeight)),
              (e.style.height = e.scrollHeight + n + "px");
          else if ("input" == o)
            if (((e.style.width = "1000px"), e.offsetWidth)) {
              (e.style.width = "0"),
                "border-box" == i.boxSizing
                  ? (n = e.offsetWidth)
                  : "padding-box" == i.boxSizing
                  ? (n = e.clientWidth)
                  : "content-box" == i.boxSizing &&
                    (n = parseFloat(i.minWidth));
              var r = Math.max(n, e.scrollWidth - e.clientWidth);
              e.style.width = r + "px";
              for (
                var l = 0;
                l < 10 && ((e.scrollLeft = 1e10), 0 != e.scrollLeft);
                l++
              )
                (r += e.scrollLeft), (e.style.width = r + "px");
            } else e.style.width = e.value.length + 1 + "ch";
          else if ("select" == o) {
            if (-1 == e.selectedIndex) return;
            var s,
              c = 0 < e.selectedIndex ? e.selectedIndex : 0,
              a = document.createElement("_");
            for (var d in ((a.textContent = e.options[c].textContent),
            e.parentNode.insertBefore(a, e.nextSibling),
            i)) {
              var h = i[d];
              /^(width|webkitLogicalWidth|length)$/.test(d) ||
                "string" != typeof h ||
                ((a.style[d] = h), /appearance$/i.test(d) && (s = d));
            }
            (a.style.width = ""),
              0 < a.offsetWidth &&
                ((e.style.width = a.offsetWidth + "px"),
                (i[s] && "none" === i[s]) ||
                  (e.style.width = "calc(" + e.style.width + " + 2em)")),
              a.parentNode.removeChild(a),
              (a = null);
          }
          t && (e.value = "");
        }
      },
      resizeAll: function (e) {
        t(e || p.selectors.base).forEach(function (e) {
          p.resize(e);
        });
      },
      active: !0,
      resizes: function (e) {
        return (
          e &&
          e.parentNode &&
          e.matches &&
          e.matches(p.selectors.base) &&
          e.matches(p.selectors.filter)
        );
      },
      init: function () {
        (p.selectors.filter =
          p.script.getAttribute("data-filter") ||
          (t("[data-stretchy-filter]").pop() || document.body).getAttribute(
            "data-stretchy-filter"
          ) ||
          p.selectors.filter),
          p.resizeAll(),
          self.MutationObserver &&
            !p.observer &&
            ((p.observer = new MutationObserver(function (e) {
              p.active &&
                e.forEach(function (e) {
                  "childList" == e.type && p.resizeAll(e.addedNodes);
                });
            })),
            p.observer.observe(document.documentElement, {
              childList: !0,
              subtree: !0,
            }));
      },
      $$: t,
    });
    "loading" !== document.readyState
      ? requestAnimationFrame(p.init)
      : document.addEventListener("DOMContentLoaded", p.init),
      window.addEventListener("load", function () {
        p.resizeAll();
      });
    var e = function (e) {
      p.active && p.resize(e.target);
    };
    document.documentElement.addEventListener("input", e),
      document.documentElement.addEventListener("change", e);
  }
  function t(e, t) {
    return e instanceof Node || e instanceof Window
      ? [e]
      : [].slice.call(
          "string" == typeof e ? (t || document).querySelectorAll(e) : e || []
        );
  }
})();
//# sourceMappingURL=stretchy.min.js.map

//# sourceMappingURL=maps/deps.js.map

("use strict");
function _defineProperty(obj, key, value) {
  return (
    key in obj
      ? Object.defineProperty(obj, key, {
          value: value,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (obj[key] = value),
    obj
  );
}
(Stretchy.selectors.filter = ".mv-editor:not([property]), .mv-autosize"),
  (async function ($, $$) {
    var _class, _temp, _document$currentScri;
    (self.$ = self.$ || $), (self.$$ = self.$$ || $$);
    let _ = (self.Mavo = $.Class(
      ((_temp = _class =
        class Mavo {
          constructor(element) {
            if (
              ((this.treeBuilt = Mavo.promise()),
              (this.dataLoaded = Mavo.promise()),
              (this.deleted = []),
              (this.element = element),
              (this.inProgress = !1),
              (this.index = Object.keys(_.all).length + 1),
              Object.defineProperty(_.all, this.index - 1, {
                value: this,
                configurable: !0,
              }),
              (this.id =
                Mavo.getAttribute(this.element, "mv-app", "id") ||
                "mavo".concat(this.index)),
              this.id in _.all)
            ) {
              for (var i = 2; this.id + i in _.all; i++);
              this.id += i;
            }
            (_.all[this.id] = this),
              this.element.setAttribute("mv-app", this.id),
              this.observe({ attribute: "lang", deep: !1 }, () => {
                var lang =
                  Mavo.getClosestAttribute(this.element, "lang") || Mavo.locale;
                this.locale = Mavo.Locale.get(lang);
              })(),
              (this.autoEdit = this.element.classList.contains("mv-autoedit")),
              (this.autoSave = this.element.hasAttribute("mv-autosave")),
              (this.autoSaveDelay =
                1e3 * (this.element.getAttribute("mv-autosave") || 0)),
              Mavo.setAttributeShy(this.element, "typeof", ""),
              Mavo.hooks.run("init-start", this),
              $$(_.selectors.primitive, this.element).forEach((element) => {
                if ($(_.selectors.property, element)) {
                  let config = Mavo.Primitive.getConfig(element);
                  ((config.attribute || config.hasChildren) &&
                    !element.hasAttribute("mv-list-item")) ||
                    element.setAttribute("mv-group", "");
                }
              }),
              (this.expressions = new Mavo.Expressions(this)),
              (_.observers = _.observers || new Mavo.Observers()),
              _.observers.observer.observe(this.element, {
                characterData: !0,
                childList: !0,
                subtree: !0,
                attributes: !0,
              }),
              Mavo.hooks.run("init-tree-before", this),
              (this.root = new Mavo.Group(this.element, this)),
              this.treeBuilt.resolve(),
              Mavo.hooks.run("init-tree-after", this),
              (this.permissions = new Mavo.Permissions());
            var backendTypes = ["source", "storage", "init", "uploads"];
            backendTypes.forEach((role) => this.updateBackend(role)),
              this.observe({ deep: !1, attribute: !0 }, ({ attribute }) => {
                if (0 === attribute.indexOf("mv-")) {
                  var _attribute$replace, _attribute$replace$sp;
                  let role =
                    null === attribute ||
                    void 0 === attribute ||
                    null ===
                      (_attribute$replace = attribute.replace(/^mv-/, "")) ||
                    void 0 === _attribute$replace ||
                    null ===
                      (_attribute$replace$sp = _attribute$replace.split("-")) ||
                    void 0 === _attribute$replace$sp
                      ? void 0
                      : _attribute$replace$sp[0];
                  backendTypes.includes(role) &&
                    (this.updateBackend(role),
                    ("source" === role ||
                      (!this.source &&
                        ("storage" === role ||
                          ("init" === role && !this.root.data)))) &&
                      this.load());
                }
              }),
              this.permissions.can("login", () => {
                let loginUrlParam;
                if (
                  (null !== Mavo.Functions.url("login") && 1 === this.index
                    ? (loginUrlParam = "login")
                    : null !== Mavo.Functions.url(this.id + "-login") &&
                      (loginUrlParam = this.id + "-login"),
                  void 0 !== loginUrlParam)
                ) {
                  const currentURL = new URL(location.href);
                  currentURL.searchParams.delete(loginUrlParam),
                    history.replaceState(null, "", currentURL),
                    this.primaryBackend.login();
                }
              }),
              $.bind(this.element, "mv-login.mavo", (evt) => {
                evt.backend != (this.source || this.storage) ||
                  "loading" === this.inProgress ||
                  this.root.data ||
                  this.unsavedChanges ||
                  this.load();
              }),
              (this.bar = new Mavo.UI.Bar(this)),
              (this.needsEdit = this.calculateNeedsEdit()),
              this.setUnsavedChanges(!1),
              this.permissions.onchange(({ action, value }) => {
                var permissions =
                  this.element.getAttribute("mv-permissions") || "";
                (permissions = permissions
                  .trim()
                  .split(/\s+/)
                  .filter((a) => a != action)),
                  value && permissions.push(action),
                  this.element.setAttribute(
                    "mv-permissions",
                    permissions.join(" ")
                  );
              }),
              this.permissions.can(["edit", "add", "delete"], () => {
                this.autoEdit && this.edit();
              }),
              this.observe({ attribute: "mv-mode" }, ({ element }) => {
                if (
                  this.permissions.edit ||
                  this.permissions.add ||
                  this.permissions.delete
                ) {
                  let nodes = _.Node.children(element);
                  nodeloop: for (let i = 0; i < nodes.length; i++) {
                    let node = nodes[i];
                    let previousMode = node.mode,
                      mode;
                    if (node.element == element)
                      (mode = node.element.getAttribute("mv-mode")),
                        (node.modes = mode);
                    else {
                      if (node.modes) continue nodeloop;
                      mode = _.getStyle(node.element.parentNode, "--mv-mode");
                    }
                    (node.mode = mode),
                      previousMode != node.mode &&
                        node["edit" == node.mode ? "edit" : "done"]();
                  }
                }
              }),
              this.primaryBackend
                ? this.permissions.can("read", () => this.load())
                : requestAnimationFrame(() => {
                    this.dataLoaded.resolve(),
                      this.expressions.update(),
                      this.element.dispatchEvent(
                        new Event("mv-load", { bubbles: !0 })
                      );
                  }),
              $.bind(this.element, "mv-load.mavo", () => {
                if (location.hash) {
                  var callback = () => {
                    var target = document.getElementById(
                      location.hash.slice(1)
                    );
                    return (
                      (target || !location.hash) &&
                        this.element.contains(target) &&
                        requestAnimationFrame(() => {
                          Mavo.scrollIntoViewIfNeeded(target);
                        }),
                      target
                    );
                  };
                  callback() ||
                    this.observe({ attribute: "id", once: !0 }, callback);
                }
                requestAnimationFrame(() => Stretchy.resizeAll());
              }),
              this.dataLoaded.then(async () => {
                await Mavo.defer(),
                  this.permissions.can(
                    "save",
                    () => {
                      if (this.autoSave) {
                        let debouncedSave = _.debounce(() => {
                          this.save();
                        }, this.autoSaveDelay);
                        $.bind(
                          this.element,
                          "mv-change.mavo:autosave",
                          (evt) => {
                            evt.node.saved && this.autoSave && debouncedSave();
                          }
                        );
                      }
                    },
                    () => {
                      $.unbind(this.element, "mv-change.mavo:autosave");
                    }
                  );
              }),
              this.element.addEventListener("keydown", (evt) => {
                var element = evt.target;
                if (
                  this.permissions.save &&
                  "S" == evt.key &&
                  evt[_.superKey] &&
                  !evt.altKey
                )
                  evt.preventDefault(), this.save();
                else if ("ArrowUp" === evt.key || "ArrowDown" === evt.key) {
                  if (
                    element.matches(
                      "textarea, input[type=range], input[type=number]"
                    )
                  )
                    return;
                  if (element.matches(".mv-editor")) {
                    var editor = !0;
                    element = element.parentNode;
                  }
                  var node = Mavo.Node.get(element);
                  if (
                    null !== node &&
                    void 0 !== node &&
                    node.closestCollection
                  ) {
                    var nextNode = node.getCousin(
                      "ArrowUp" === evt.key ? -1 : 1,
                      { wrap: !0 }
                    );
                    nextNode &&
                      (editor && nextNode.editing
                        ? (nextNode.edit(), nextNode.editor.focus())
                        : nextNode.element.focus(),
                      evt.preventDefault());
                  }
                }
              }),
              $.bind(this.element, "click submit", _.Actions.listener),
              Mavo.hooks.run("init-end", this);
          }
          get editing() {
            return this.root.editing;
          }
          observe(o = {}, callback) {
            var _$observers;
            let options = Object.assign({ element: this.element }, o);
            return null === (_$observers = _.observers) ||
              void 0 === _$observers
              ? void 0
              : _$observers.observe(options, callback);
          }
          unobserve(o, callback) {
            var _$observers2;
            let options = Object.assign({ element: this.element }, o);
            return null === (_$observers2 = _.observers) ||
              void 0 === _$observers2
              ? void 0
              : _$observers2.unobserve(options, callback);
          }
          getData(o) {
            let env = { context: this, options: o };
            return (
              (env.data = this.root.getData(o)),
              _.hooks.run("getdata-end", env),
              env.data
            );
          }
          toJSON() {
            return _.toJSON(this.getData());
          }
          message(message, options = {}) {
            return new _.UI.Message(this, message, options);
          }
          error(message, ...log) {
            this.message(message, {
              type: "error",
              dismiss: ["button", "timeout"],
            }),
              0 < log.length &&
                console.log(
                  "%c".concat(this.id, ": ").concat(message),
                  "color: red; font-weight: bold",
                  ...log
                );
          }
          render(data) {
            var env = { context: this, data };
            _.hooks.run("render-start", env),
              env.data && this.root.render(env.data),
              (this.unsavedChanges = !1),
              _.hooks.run("render-end", env);
          }
          edit() {
            var _this$bar;
            null !== (_this$bar = this.bar) &&
              void 0 !== _this$bar &&
              _this$bar.edit &&
              this.bar.edit.click(),
              this.root.edit(),
              $.bind(
                this.element,
                "mouseenter.mavo:edit mouseleave.mavo:edit",
                (evt) => {
                  if (evt.target.matches(_.selectors.multiple)) {
                    evt.target.classList.remove("mv-has-hovered-item");
                    var parent = evt.target.parentNode.closest(
                      _.selectors.multiple
                    );
                    parent &&
                      parent.classList.toggle(
                        "mv-has-hovered-item",
                        "mouseenter" == evt.type
                      );
                  }
                },
                !0
              ),
              this.setUnsavedChanges();
          }
          done() {
            this.root.done(),
              $.unbind(this.element, ".mavo:edit"),
              (this.unsavedChanges = !1);
          }
          setUnsavedChanges(value) {
            var unsavedChanges = !!value;
            return (
              value ||
                this.walk((obj) => {
                  if (obj.unsavedChanges)
                    return (
                      (unsavedChanges = !0),
                      !1 === value && (obj.unsavedChanges = !1),
                      !1
                    );
                }),
              (this.unsavedChanges = unsavedChanges)
            );
          }
          updateBackend(role) {
            let existing = this[role],
              backend,
              changed;
            let options = {};
            if (
              (1 == this.index && (backend = _.Functions.url(role)),
              backend ||
                (backend = _.Functions.url(
                  "".concat(this.id, "-").concat(role)
                )),
              !backend)
            ) {
              const attribute = "mv-" + role;
              if (
                ((backend = this.element.getAttribute(attribute) || null),
                backend)
              )
                if (((backend = backend.trim()), "none" == backend))
                  backend = null;
                else {
                  let prefix = attribute + "-";
                  let roleAttributes = Mavo.getAttributes(
                    this.element,
                    RegExp("^" + prefix)
                  );
                  options = Object.fromEntries(
                    roleAttributes.map((n) => [
                      n.replace(prefix, ""),
                      this.element.getAttribute(n),
                    ])
                  );
                }
            }
            if (backend) {
              var _existing$equals;
              (null !== existing &&
                void 0 !== existing &&
                null !== (_existing$equals = existing.equals) &&
                void 0 !== _existing$equals &&
                _existing$equals.call(existing, backend)) ||
                ((this[role] = backend =
                  _.Backend.create(
                    backend,
                    {
                      format: this.element.getAttribute("mv-format"),
                      ...options,
                      mavo: this,
                    },
                    existing
                  )),
                (changed = !0),
                $.bind(backend, "mv-login mv-logout", (evt) => {
                  $.fire(this.element, evt.type, { backend });
                }));
            } else this[role] = null;
            if (
              ((changed =
                changed || (backend ? !backend.equals(existing) : !!existing)),
              changed)
            ) {
              var _this$source, _this$sourceBackend;
              this.storage ||
                this.source ||
                !this.init ||
                ((this.source = this.init), (this.init = null));
              var permissions = this.storage
                ? this.storage.permissions
                : new Mavo.Permissions({ edit: !0, save: !1 });
              (permissions.parent =
                null === (_this$source = this.source) || void 0 === _this$source
                  ? void 0
                  : _this$source.permissions),
                (this.permissions.parent = permissions),
                (this.primaryBackend = this.storage || this.source),
                (this.sourceBackend = this.source || this.storage || this.init);
              let updateListener = (evt) => {
                evt.target === this.sourceBackend
                  ? this.push(evt.data)
                  : evt.target.removeEventListener(
                      "mv-remotedatachange",
                      updateListener
                    );
              };
              null === (_this$sourceBackend = this.sourceBackend) ||
              void 0 === _this$sourceBackend
                ? void 0
                : _this$sourceBackend.addEventListener(
                    "mv-remotedatachange",
                    updateListener
                  );
            }
            return changed;
          }
          async push(data, { conflictPolicy = "stop" } = {}) {
            if (this.unsavedChanges)
              if ("ask" === conflictPolicy) {
                if (!confirm(this._("remote-data-conflict"))) return;
              } else if ("stop" === conflictPolicy) return;
            return this.load({ data });
          }
          async load({ backend, data } = {}) {
            var _backend;
            let specificBackend = backend;
            if (
              ((backend =
                null !== (_backend = backend) && void 0 !== _backend
                  ? _backend
                  : this.sourceBackend),
              backend || data)
            ) {
              let autoSaveState = this.autoSave;
              if (((this.autoSave = !1), void 0 === data)) {
                (this.inProgress = "loading"),
                  await backend.ready,
                  (data = null);
                try {
                  data = await backend.load();
                } catch (err) {
                  if (!specificBackend && this.init && this.init !== backend) {
                    await this.init.ready;
                    try {
                      (data = await this.init.load()), (backend = this.init);
                    } catch (e) {}
                  }
                  if (err && null === data) {
                    let response =
                      err instanceof Response || err instanceof XMLHttpRequest
                        ? err
                        : err.xhr;
                    if (
                      404 !==
                      (null === response || void 0 === response
                        ? void 0
                        : response.status)
                    ) {
                      let message = this._("problem-loading");
                      response &&
                        (message += response.status
                          ? this._("http-error", err)
                          : ": " + this._("cant-connect")),
                        this.error(message, err);
                    }
                  }
                }
                this.inProgress = !1;
              }
              this.render(data),
                await Mavo.defer(),
                this.dataLoaded.resolve(),
                this.element.dispatchEvent(
                  new CustomEvent("mv-load", { detail: backend, bubbles: !0 })
                ),
                (this.autoSave = autoSaveState);
            }
          }
          async store() {
            if (!this.storage) return;
            this.inProgress = "saving";
            let saved;
            try {
              saved = await this.storage.store(this.getData());
            } catch (err) {
              if (err) {
                var message = this._("problem-saving");
                err instanceof XMLHttpRequest &&
                  (message +=
                    ": " +
                    (err.status
                      ? this._("http-error", err)
                      : this._("cant-connect"))),
                  this.error(message, err);
              }
              saved = null;
            }
            return (this.inProgress = !1), saved;
          }
          upload(file, path = "images/" + file.name) {
            return this.uploadBackend
              ? ((this.inProgress = "uploading"),
                this.uploadBackend
                  .upload(file, path)
                  .then((url) => ((this.inProgress = !1), url))
                  .catch(
                    (err) => (
                      this.error(this._("error-uploading"), err),
                      (this.inProgress = !1),
                      null
                    )
                  ))
              : Promise.reject();
          }
          async save() {
            _.hooks.run("save-start", this);
            let saved = await this.store();
            saved &&
              ($.fire(this.element, "mv-save", saved),
              (this.lastSaved = Date.now()),
              this.root.save(),
              (this.unsavedChanges = !1));
          }
          walk() {
            return this.root.walk(...arguments);
          }
          calculateNeedsEdit() {
            var needsEdit = !1;
            return (
              this.walk(
                (obj) =>
                  !needsEdit &&
                  ((needsEdit = !obj.modes && !(obj instanceof Mavo.Group)),
                  !obj.modes),
                void 0,
                { descentReturn: !0 }
              ),
              needsEdit
            );
          }
          changed(change) {
            !this.root ||
              (this.expressions.active &&
                this.expressions.updateThrottled(change));
          }
          setDeleted(...nodes) {
            var _this$deletionNotice;
            if (
              (this.deleted.forEach((node) => node.destroy()),
              (this.deleted.length = 0),
              null === (_this$deletionNotice = this.deletionNotice) ||
              void 0 === _this$deletionNotice
                ? void 0
                : _this$deletionNotice.close(),
              !!nodes.length)
            ) {
              if ((this.deleted.push(...nodes), 1 == nodes.length))
                var phrase = nodes[0].name;
              else {
                var counts = {},
                  ret = [];
                for (var name in (nodes.forEach((n) => {
                  counts[n.name] = (counts[n.name] || 0) + 1;
                }),
                counts))
                  ret.push(this._("n-items", { name, n: counts[name] }));
                var phrase = ret.join(", ");
              }
              var notice = (this.deletionNotice = this.message(
                [
                  this._("item-deleted", { name: phrase }),
                  {
                    tag: "button",
                    type: "button",
                    textContent: this._("undo"),
                    events: {
                      click: () => {
                        this.undoDelete(), this.deletionNotice.close(!0);
                      },
                    },
                  },
                ],
                { classes: "mv-deleted", dismiss: { button: !0, timeout: 2e4 } }
              ));
              notice.closed.then((undone) => {
                !undone &&
                  this.deleted.length &&
                  (this.deleted.forEach((node) => node.destroy()),
                  (this.deleted.length = 0)),
                  this.deletionNotice == notice && (this.deletionNotice = null);
              });
            }
          }
          undoDelete() {
            this.deleted.forEach((node) =>
              node.collection.add(node, node.index)
            ),
              (this.deleted.length = 0);
          }
          destroy() {
            var _this$bar2;
            Mavo.hooks.run("mavo-destroy-start", this),
              this.editing && this.done(),
              this.observer.destroy(),
              null === (_this$bar2 = this.bar) || void 0 === _this$bar2
                ? void 0
                : _this$bar2.destroy(),
              (Mavo.all[this.id] = Mavo.all[this.index - 1] = null),
              this.root.destroy(),
              Mavo.hooks.run("mavo-destroy-end", this);
          }
          static get(id) {
            if (id instanceof Element) {
              for (let name in _.all)
                if (_.all[name].element == id) return _.all[name];
              return null;
            }
            let name = "number" == typeof id ? Object.keys(_.all)[id] : id;
            return _.all[name] || null;
          }
          static init(container = document) {
            let mavos = Array.isArray(arguments[0])
              ? arguments[0]
              : $$(_.selectors.init, container);
            let ret = mavos
              .filter((element) => !_.get(element))
              .map((element) => new _(element));
            return ret;
          }
          static observe(options, callback) {
            return (
              (_.observers = _.observers || new Mavo.Observers()),
              _.observers.observe(options, callback)
            );
          }
          static unobserve(options, callback) {
            _.observers.unobserve(options, callback);
          }
          static warn(message, o = {}) {
            (_.warn.history = _.warn.history || new Set()),
              _.warn.history.has(message) || console.warn(message),
              !1 !== o.once && _.warn.history.add(message);
          }
          static thenAll(iterable) {
            return (
              $$(iterable).forEach((promise) => {
                "promise" == $.type(promise) &&
                  (promise = promise.catch((err) => err));
              }),
              Promise.all(iterable).then((resolved) =>
                iterable.length == resolved.length
                  ? resolved
                  : _.thenAll(iterable)
              )
            );
          }
          static promise(constructor) {
            let res, rej;
            let promise = new Promise((resolve, reject) => {
              "function" == typeof constructor
                ? constructor(resolve, reject)
                : constructor instanceof Promise &&
                  (constructor.then(resolve), constructor.catch(reject)),
                (res = resolve),
                (rej = reject);
            });
            return (
              (promise.resolve = (a) => (res(a), promise)),
              (promise.reject = (a) => (rej(a), promise)),
              promise
            );
          }
        }),
      _defineProperty(_class, "version", "v0.3.0"),
      _defineProperty(_class, "all", {}),
      _defineProperty(
        _class,
        "superKey",
        0 === navigator.platform.indexOf("Mac") ? "metaKey" : "ctrlKey"
      ),
      _defineProperty(
        _class,
        "base",
        ["blob:", "about:"].includes(location.protocol)
          ? (null === (_document$currentScri = document.currentScript) ||
            void 0 === _document$currentScri
              ? void 0
              : _document$currentScri.src) || "https://mavo.io"
          : location
      ),
      _defineProperty(_class, "dependencies", [
        $.ready().then(() => _.Plugins.load()),
      ]),
      _defineProperty(_class, "polyfillsNeeded", {
        blissfuljs:
          Array.from &&
          document.documentElement.closest &&
          self.URL &&
          "searchParams" in URL.prototype,
        "Intl.~locale.en": self.Intl,
        IntersectionObserver: self.IntersectionObserver,
        Symbol: self.Symbol,
        "Element.prototype.remove": Element.prototype.remove,
        "Element.prototype.before": Element.prototype.before,
        "Element.prototype.after": Element.prototype.after,
        "Element.prototype.prepend": Element.prototype.prepend,
        "Array.prototype.flat": Array.prototype.flat,
        "Array.prototype.flatMap": Array.prototype.flatMap,
      }),
      _defineProperty(_class, "polyfills", []),
      _defineProperty(
        _class,
        "defer",
        (delay) =>
          new Promise((resolve) =>
            void 0 === delay
              ? requestAnimationFrame(resolve)
              : setTimeout(resolve, delay)
          )
      ),
      _defineProperty(_class, "UI", {}),
      _defineProperty(_class, "hooks", new $.Hooks()),
      _defineProperty(_class, "properties", new Set()),
      _defineProperty(_class, "attributes", [
        "mv-app",
        "mv-storage",
        "mv-source",
        "mv-init",
        "mv-path",
        "mv-format",
        "mv-attribute",
        "mv-default",
        "mv-mode",
        "mv-edit",
        "mv-editor",
        "mv-permisssions",
        "mv-rel",
        "mv-value",
      ]),
      _temp),
      {
        live: {
          inProgress(value) {
            $.toggleAttribute(this.element, "mv-progress", value, value),
              $.toggleAttribute(this.element, "aria-busy", !!value, !!value),
              this.element.style.setProperty(
                "--mv-progress-text",
                value ? '"'.concat(this._(value), '"') : ""
              );
          },
          unsavedChanges(value) {
            this.element.classList.toggle("mv-unsaved-changes", value);
          },
          needsEdit(value) {
            this.bar && this.bar.toggle("edit", value && this.permissions.edit);
          },
          storage(value) {
            if (value !== this._storage && !value) {
              let permissions = new Mavo.Permissions({ edit: !0, save: !1 });
              (permissions.parent = this.permissions.parent),
                (this.permissions.parent = permissions);
            }
          },
          primaryBackend(value) {
            if (((value = value || null), value != this._primaryBackend))
              return value;
          },
          uploadBackend: {
            get() {
              var _this$storage;
              const backend = this.uploads;
              return null !== backend && void 0 !== backend && backend.upload
                ? (backend.permissions.login && backend.login(), this.uploads)
                : null !== (_this$storage = this.storage) &&
                  void 0 !== _this$storage &&
                  _this$storage.upload
                ? this.storage
                : void 0;
            },
          },
        },
        lazy: { locale: () => document.documentElement.lang || "en-GB" },
      }
    ));
    [
      "toNode",
      "isProxy",
      "route",
      "parent",
      "property",
      "mavo",
      "groupedBy",
      "as",
    ].forEach((symbol) => {
      $.lazy(_, symbol, () => Symbol(symbol));
    }),
      Object.defineProperty(_.all, "length", {
        get: function () {
          return Object.keys(this).length;
        },
      });
    {
      let s = (_.selectors = {
        init: "[mv-app], [data-mv-app]",
        property: "[property]",
        group: "[typeof], [mv-group]",
        list: "[mv-list]",
        multiple: "[mv-list-item]",
        formControl: "input, select, option, textarea",
        textInput:
          ["text", "email", "url", "tel", "search", "number"]
            .map((t) => "input[type=".concat(t, "]"))
            .join(", ") + ", input:not([type]), textarea",
        ui: ".mv-ui",
      });
      (s.primitive =
        s.property + ":not(".concat(s.group, ", ").concat(s.list, ")")),
        (s.childGroup = s.property + ":is(".concat(s.group, ")")),
        (s.scope = ":is("
          .concat(s.group, ", ")
          .concat(s.multiple, ", ")
          .concat(s.list, ")")),
        (s.item = s.multiple + ", " + s.group),
        (s.output = "[property=output], .mv-output");
    }
    if (
      ($.each(_.polyfillsNeeded, (id, supported) => {
        supported || _.polyfills.push(id);
      }),
      (_.ready = _.thenAll(_.dependencies)),
      (_.inited = _.promise()),
      await _.defer(),
      0 < _.polyfills.length)
    ) {
      var polyfillURL =
        "https://cdn.polyfill.io/v2/polyfill.min.js?unknown=polyfill&features=" +
        _.polyfills.map((a) => a + "|gated").join(",");
      _.dependencies.push($.include(polyfillURL));
    }
    if (
      (await $.ready(),
      Mavo.attributeStartsWith("data-mv-").forEach((attribute) => {
        let element = attribute.ownerElement;
        let name = attribute.name.replace("data-", "");
        Mavo.setAttributeShy(element, name, attribute.value);
      }),
      $$("[mv-list]:not([property])").forEach((e) =>
        e.setAttribute("property", e.getAttribute("mv-list"))
      ),
      $$("[mv-list-item]:not([property])").forEach((e) =>
        e.setAttribute("property", e.getAttribute("mv-list-item"))
      ),
      (_.containers = { TR: "TBODY", OPTION: "OPTGROUP" }),
      $$("[mv-list]").forEach((list) => {
        if (!$(":scope > [mv-list-item]", list))
          if (
            1 === list.children.length &&
            !list.children[0].matches("[property]")
          )
            list.children[0].setAttribute("mv-list-item", "");
          else {
            let itemTags = Object.entries(_.containers).filter(
              ([_, i]) => i === list.tagName
            );
            let itemTag = itemTags[0] || "div";
            $.create(itemTag, {
              className: "mv-container",
              "mv-list-item": "",
              contents: [...list.childNodes],
              inside: list,
            });
          }
      }),
      $$("[mv-list-item], [mv-multiple]").forEach((item) => {
        let wasLegacy;
        if (!item.hasAttribute("mv-list-item")) {
          let multiple = item.getAttribute("mv-multiple");
          if (
            (item.setAttribute("mv-list-item", multiple),
            !item.hasAttribute("property"))
          )
            if (multiple) item.setAttribute("property", multiple);
            else {
              let property =
                _.Node.getImplicitPropertyName(item) ||
                _.Node.generatePropertyName("collection", item);
              item.setAttribute("property", property);
            }
          (wasLegacy = !0),
            Mavo.warn(
              "@mv-multiple is deprecated. Please use @mv-list-item and @mv-list instead"
            );
        }
        item.hasAttribute("property") ||
          item.setAttribute("property", item.getAttribute("mv-list-item"));
        let parent = item.parentNode;
        let list = parent;
        let property = Mavo.Node.getProperty(item);
        if (!parent.hasAttribute("mv-list")) {
          if (
            1 !== parent.children.length ||
            parent.matches("[mv-app], [property], [mv-list-item]")
          ) {
            let listTag = _.containers[item.tagName] || "div";
            list = $.create(listTag, {
              className: "mv-container",
              around: item,
            });
          }
          list.setAttribute("mv-list", ""),
            property && list.setAttribute("property", property),
            Mavo.moveAttribute("mv-initial-items", item, list),
            Mavo.moveAttribute("mv-order", item, list),
            Mavo.moveAttribute("mv-accepts", item, list),
            Mavo.moveAttribute("mv-alias", item, list),
            wasLegacy
              ? (Mavo.moveAttribute("mv-value", item, list),
                Mavo.moveAttribute("mv-mode", item, list),
                Mavo.moveAttribute("mv-multiple-path", item, list, {
                  rename: "mv-path",
                }))
              : Mavo.warn(
                  "Please wrap @mv-list-item elements with @mv-list elements"
                );
        }
        let listProperty = list.getAttribute("property");
        let itemProperty = item.getAttribute("property");
        if (!listProperty && itemProperty)
          list.setAttribute("property", itemProperty);
        else if (listProperty !== itemProperty || !listProperty) {
          let property =
            Mavo.Node.getProperty(list) ||
            Mavo.Node.generatePropertyName("item", list);
          listProperty || list.setAttribute("property", property),
            item.setAttribute("property", property);
        }
      }),
      $$("[property='']").forEach((element) => {
        let property =
          Mavo.Node.getProperty(element) ||
          Mavo.Node.generatePropertyName("prop", element);
        element.setAttribute("property", property);
      }),
      $$(_.selectors.init).forEach(function (elem) {
        _.get(elem) || elem.setAttribute("mv-progress", "Loading");
      }),
      window.CSSPropertyRule)
    ) {
      let root = document.documentElement;
      root.classList.add("mv-supports-atproperty");
    }
    await _.ready, _.init(), _.inited.resolve();
  })(Bliss, Bliss.$),
  (function ($, $$) {
    function updateTargetWithin() {
      var element = _.getTarget();
      const cl = "mv-target-within";
      for (
        $$(".mv-target-within").forEach((el) => el.classList.remove(cl));
        null !== (_element = element) &&
        void 0 !== _element &&
        _element.classList;

      ) {
        var _element;
        element.classList.add(cl), (element = element.parentNode);
      }
    }
    var _ = $.extend(Mavo, {
      load: (
        url,
        base = (() => {
          var _document$currentScri2, _document$currentScri3;
          return null !==
            (_document$currentScri2 =
              null === (_document$currentScri3 = document.currentScript) ||
              void 0 === _document$currentScri3
                ? void 0
                : _document$currentScri3.src) &&
            void 0 !== _document$currentScri2
            ? _document$currentScri2
            : location;
        })()
      ) => $.load(url, base),
      readFile: (file, format = "DataURL") => {
        var reader = new FileReader();
        return new Promise((resolve, reject) => {
          (reader.onload = () => resolve(reader.result)),
            (reader.onerror = reader.onabort = reject),
            reader["readAs" + format](file);
        });
      },
      toJSON: (data) => {
        if (null === data) return "";
        if ("string" == typeof data) return data;
        try {
          return JSON.stringify(data, null, "\t");
        } catch (e) {
          return e;
        }
      },
      safeToJSON: function (o) {
        var cache = new WeakSet();
        return JSON.stringify(o, (key, value) => {
          if ("object" == typeof value && null !== value) {
            if (cache.has(value)) return;
            cache.add(value);
          }
          return value;
        });
      },
      isPlainObject: (o) => {
        var _proto$constructor;
        if ("object" !== $.type(o)) return !1;
        var proto = Object.getPrototypeOf(o);
        return (
          "Object" ===
          (null === (_proto$constructor = proto.constructor) ||
          void 0 === _proto$constructor
            ? void 0
            : _proto$constructor.name)
        );
      },
      primitivify: (object, primitive) => (
        object &&
          (primitive &&
            "object" == typeof primitive &&
            (Object.assign(object, primitive),
            (primitive = Mavo.value(primitive))),
          (object.valueOf =
            object.toJSON =
            object[Symbol.toPrimitive] =
              () => primitive)),
        object
      ),
      objectify: (value, properties) => {
        var primitive = Mavo.value(value);
        if ("object" != typeof value || null === value) {
          if (null === value)
            value = { [Symbol.toStringTag]: "Null", toJSON: () => null };
          else {
            var constructor = value.constructor;
            (value = new constructor(primitive)),
              (value[Symbol.toStringTag] = constructor.name);
          }
          _.primitivify(value, primitive);
        }
        return $.extend(value, properties);
      },
      value: (value) =>
        null !== value && void 0 !== value && value.valueOf
          ? value.valueOf()
          : value,
      toArray: (arr) =>
        void 0 === arr ? [] : Array.isArray(arr) ? arr : [arr],
      union: (set1, set2) =>
        set1 instanceof Set && set2
          ? (set2.forEach((x) => set1.add(x)), set1)
          : new Set([...(set1 || []), ...(set2 || [])]),
      getStyle: (element, property) => {
        if (element && element instanceof Element) {
          let value = getComputedStyle(element).getPropertyValue(property);
          return null === value || void 0 === value ? void 0 : value.trim();
        }
      },
      data: function (element, name, value) {
        if (!element) return null;
        var data = _.elementData.get(element) || {},
          ret;
        return (
          2 == arguments.length
            ? (ret = data[name])
            : void 0 === value
            ? delete data[name]
            : (ret = data[name] = value),
          _.elementData.set(element, data),
          ret
        );
      },
      elementData: new WeakMap(),
      elementPath: function (ancestor, element) {
        if (Array.isArray(element)) {
          var path = element;
          var ret = path.reduce(
            (acc, cur) => acc.children[cur >> 0] || acc,
            ancestor
          );
          var last = path[path.length - 1];
          if (last != last >> 0) {
            var offset = +(last + "").split(".")[1];
            0 > last >> 0 && ((ret = ret.firstChild), offset--);
            for (var i = 0; i < offset; i++) ret = ret.nextSibling;
          }
          return ret;
        }
        var path = [];
        for (
          var parent = element;
          parent && parent != ancestor;
          parent = parent.parentNode
        ) {
          var index = 0;
          var countNonElementSiblings =
            parent === element && 1 !== element.nodeType;
          var offset = countNonElementSiblings ? 1 : 0;
          for (
            var sibling = parent;
            (sibling =
              sibling[
                "previous".concat(
                  countNonElementSiblings ? "" : "Element",
                  "Sibling"
                )
              ]);

          )
            countNonElementSiblings
              ? (offset++,
                1 == sibling.nodeType && (countNonElementSiblings = !1))
              : index++;
          0 < offset && (index = index - 1 + "." + offset), path.unshift(index);
        }
        return parent ? path : null;
      },
      revocably: {
        add: function (element, insert) {
          var comment = _.revocably.isRemoved(element);
          return (
            null !== comment && void 0 !== comment && comment.parentNode
              ? comment.parentNode.replaceChild(element, comment)
              : element &&
                insert &&
                !element.parentNode &&
                ("function" == typeof insert
                  ? insert(element)
                  : insert.appendChild(element)),
            comment
          );
        },
        remove: function (element, commentText) {
          if (element) {
            var comment = _.data(element, "commentstub");
            return (
              comment ||
                ((commentText =
                  commentText ||
                  element.id ||
                  element.className ||
                  element.nodeName),
                (comment = _.data(
                  element,
                  "commentstub",
                  document.createComment(commentText)
                ))),
              element.parentNode &&
                element.parentNode.replaceChild(comment, element),
              comment
            );
          }
        },
        isRemoved: function (element) {
          if (!element || element.parentNode) return !1;
          var comment = _.data(element, "commentstub");
          return (
            !!(null !== comment && void 0 !== comment && comment.parentNode) &&
            comment
          );
        },
        setAttribute: function (element, attribute, value) {
          var previousValue = _.data(element, "attribute-" + attribute);
          previousValue === void 0 &&
            _.data(
              element,
              "attribute-" + attribute,
              element.getAttribute(attribute)
            ),
            element.setAttribute(attribute, value);
        },
        restoreAttribute: function (element, attribute) {
          var previousValue = _.data(element, "attribute-" + attribute);
          previousValue !== void 0 &&
            ($.toggleAttribute(element, attribute, previousValue),
            _.data(element, "attribute-" + attribute, void 0));
        },
      },
      inView: {
        is: (element) => {
          var r = element.getBoundingClientRect();
          return (
            ((0 <= r.bottom && r.bottom <= innerHeight) ||
              (0 <= r.top && r.top <= innerHeight)) &&
            ((0 <= r.right && r.right <= innerWidth) ||
              (0 <= r.left && r.left <= innerWidth))
          );
        },
        when: (
          element,
          rootMargin = ""
            .concat(innerHeight / 2, "px ")
            .concat(innerWidth / 2, "px")
        ) => {
          var observer = (_.inView.observer =
            _.inView.observer ||
            new IntersectionObserver(
              function (entries, observer) {
                entries.forEach((entry) => {
                  0 < entry.intersectionRatio &&
                    (observer.unobserve(entry.target),
                    $.fire(entry.target, "mv-inview", { entry }));
                });
              },
              { rootMargin }
            ));
          return new Promise((resolve) => {
            _.inView.is(element) && resolve(), observer.observe(element);
            var callback = (evt) => {
              element.removeEventListener("mv-inview", callback),
                evt.stopPropagation(),
                resolve();
            };
            element.addEventListener("mv-inview", callback);
          });
        },
      },
      scrollIntoViewIfNeeded: (element) => {
        element &&
          !Mavo.inView.is(element) &&
          element.scrollIntoView({ behavior: "smooth" });
      },
      setAttributeShy: function (element, attribute, value) {
        element.hasAttribute(attribute) ||
          element.setAttribute(attribute, value);
      },
      getAttribute: function (element, ...attributes) {
        for (let i = 0, attribute; (attribute = attributes[i]); i++) {
          let value = element.getAttribute(attribute);
          if (value) return value;
        }
        return null;
      },
      getClosestAttribute: function (element, attribute) {
        var _element$closest$getA, _element$closest;
        return null !==
          (_element$closest$getA =
            null ===
              (_element$closest = element.closest(
                "[".concat(attribute, "]")
              )) || void 0 === _element$closest
              ? void 0
              : _element$closest.getAttribute(attribute)) &&
          void 0 !== _element$closest$getA
          ? _element$closest$getA
          : null;
      },
      moveAttribute(name, from, to, o = {}) {
        let value = from.getAttribute(name);
        if (null !== value) {
          let newName = o.rename || name;
          to.setAttribute(newName, value), from.removeAttribute(name);
        }
      },
      getTarget: function () {
        var id = location.hash.substr(1);
        return document.getElementById(id);
      },
      XPath: function (query, context = document) {
        var doc = context.ownerDocument || context;
        var ret = [],
          node;
        if (doc.evaluate)
          for (
            var result = doc.evaluate(
              query,
              context,
              null,
              XPathResult.ANY_TYPE,
              null
            );
            (node = result.iterateNext());

          )
            ret.push(node);
        return ret;
      },
      attributeStartsWith: function (str, context = document.documentElement) {
        return _.XPath(
          './/@*[starts-with(name(), "'.concat(str, '")]'),
          context
        );
      },
      getAttributes: function (element, regex) {
        return element.getAttributeNames().filter((name) => regex.test(name));
      },
      properlyCasedAttributesCache: {},
      getProperAttributeCase(element, attribute) {
        var _$properlyCasedAttrib, _$properlyCasedAttrib2;
        const root = element.closest("svg, math, :root").tagName;
        null !==
          (_$properlyCasedAttrib2 = (_$properlyCasedAttrib =
            _.properlyCasedAttributesCache)[root]) &&
        void 0 !== _$properlyCasedAttrib2
          ? _$properlyCasedAttrib2
          : (_$properlyCasedAttrib[root] = {});
        let attr = _.properlyCasedAttributesCache[root][attribute];
        if (attr) return attr;
        const tag = element.tagName;
        let doc = new DOMParser().parseFromString(
          "<"
            .concat(root, "><")
            .concat(tag, " ")
            .concat(attribute, '=""></')
            .concat(tag, "></")
            .concat(root, ">"),
          "text/html"
        );
        return (
          (attr =
            doc.body.firstElementChild.firstElementChild.attributes[0].name),
          (_.properlyCasedAttributesCache[root][attribute] = attr),
          attr
        );
      },
      usePropertyInsteadOfAttribute: function (element, attribute) {
        return (
          !(-1 < ["href", "src"].indexOf(attribute)) &&
          !attribute.startsWith("on") &&
          "http://www.w3.org/2000/svg" != element.namespaceURI
        );
      },
      in: function (property, obj) {
        if (obj)
          return (
            ("object" == typeof obj && property in obj) ||
            void 0 !== obj[property]
          );
      },
      getCanonicalProperty: function (obj, property) {
        if (obj && (property || 0 === property)) {
          if (_.in(property, obj)) return property;
          if (property.toLowerCase) {
            var propertyL = property.toLowerCase();
            if (_.in(propertyL, obj)) return propertyL;
            var properties = Object.keys(obj);
            var i = properties.map((p) => p.toLowerCase()).indexOf(propertyL);
            if (-1 < i) return properties[i];
          }
        }
      },
      subset: function (obj, path, value) {
        if (3 == arguments.length) {
          if (path.length) {
            var last = path[path.length - 1];
            var parent = $.value(obj, ...path.slice(0, -1));
            return (
              Array.isArray(parent) && Array.isArray(value)
                ? parent.splice(last, 1, ...value)
                : parent && (parent[path[path.length - 1]] = value),
              obj
            );
          }
          return value;
        }
        return "object" == typeof obj &&
          null !== path &&
          void 0 !== path &&
          path.length
          ? path.reduce((obj, property, i) => {
              var _property$startsWith;
              let ret;
              let idQuery =
                null !== property &&
                void 0 !== property &&
                null !== (_property$startsWith = property.startsWith) &&
                void 0 !== _property$startsWith &&
                _property$startsWith.call(property, "id=")
                  ? property.substring(3)
                  : null;
              if (null !== idQuery) {
                let index = obj.findIndex(
                  (o) => Mavo.Functions.get(o, "id") == idQuery
                );
                (ret = -1 < index ? obj[index] : { id: idQuery }),
                  (path[i] = -1 < index ? index : obj.length);
              } else
                (ret = Mavo.Functions.get(obj, property)), (path[i] = property);
              return ret;
            }, obj)
          : obj;
      },
      clone: function (o) {
        return o && "object" == typeof o ? JSON.parse(_.safeToJSON(o)) : o;
      },
      shallowClone: function (o) {
        return o && "object" == typeof o
          ? Array.isArray(o)
            ? [...o]
            : $.extend({}, o)
          : o;
      },
      debounce: function (fn, delay) {
        if (!delay) return fn;
        var timer = null,
          code;
        return function () {
          var context = this,
            args = arguments;
          (code = function () {
            fn.apply(context, args), removeEventListener("beforeunload", code);
          }),
            clearTimeout(timer),
            (timer = setTimeout(code, delay)),
            addEventListener("beforeunload", code);
        };
      },
      escapeRegExp: (s) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
      observeResize: function (element, callbackOrObserver) {
        if (self.ResizeObserver) {
          var previousRect = null;
          var ro =
            callbackOrObserver instanceof ResizeObserver
              ? callbackOrObserver
              : new ResizeObserver((entries) => {
                  var contentRect = entries[entries.length - 1].contentRect;
                  (previousRect &&
                    previousRect.width == contentRect.width &&
                    previousRect.height == contentRect.height) ||
                    (callbackOrObserver(entries), (previousRect = contentRect));
                });
          return ro.observe(element), ro;
        }
      },
      Observer: class Observer {
        constructor(element, attribute, callback, o = {}) {
          callback instanceof MutationObserver && (this.observer = callback),
            (this.observer = this.observer || new MutationObserver(callback)),
            (this.callback = callback),
            this.update(element, attribute, o),
            this.run();
        }
        update(element, attribute, options) {
          var _this$observer;
          (this.element = element),
            (this.attribute = attribute),
            (this.options = $.extend({}, options)),
            (options !== void 0 &&
              (options.attributes ||
                options.childList ||
                options.characterData)) ||
              (this.attribute &&
                Object.assign(this.options, {
                  attributes: !0,
                  attributeFilter:
                    "all" == this.attribute
                      ? void 0
                      : Mavo.toArray(this.attribute),
                  attributeOldValue: !!options.oldValue,
                }),
              (!this.attribute || "all" == this.attribute) &&
                Object.assign(this.options, {
                  characterData: !0,
                  childList: !0,
                  subtree: !0,
                  characterDataOldValue: !!options.oldValue,
                })),
            null !== (_this$observer = this.observer) &&
              void 0 !== _this$observer &&
              _this$observer.running &&
              (this.stop(), this.run());
        }
        flush() {
          var _this$observer2;
          let records =
            null === (_this$observer2 = this.observer) ||
            void 0 === _this$observer2
              ? void 0
              : _this$observer2.takeRecords();
          records && this.callback(records);
        }
        stop() {
          var _this$observer3;
          return (
            null === (_this$observer3 = this.observer) ||
            void 0 === _this$observer3
              ? void 0
              : _this$observer3.disconnect(),
            (this.running = !1),
            this
          );
        }
        run() {
          return (
            this.observer &&
              (this.observer.observe(this.element, this.options),
              (this.running = !0)),
            this
          );
        }
        pause() {
          (this.runOnResume = this.running), this.stop();
        }
        resume() {
          !1 !== this.runOnResume && this.run(), delete this.runOnResume;
        }
        destroy() {
          this.stop(), (this.observer = this.element = null);
        }
      },
      rr: function (f) {
        return f(), f;
      },
      wrap: (index, length) =>
        0 > index ? length - 1 : index >= length ? 0 : index,
      options: (str, { map } = {}) => {
        var _str$trim$match;
        var ret = map ? new Map() : {};
        return (
          null === (_str$trim$match = str.trim().match(/(?:\\[,;]|[^,;])+/g)) ||
          void 0 === _str$trim$match
            ? void 0
            : _str$trim$match.forEach((option) => {
                if (option) {
                  option = option.trim().replace(/\\([,;])/g, "$1");
                  var pair = option.match(/^\s*((?:\\:|[^:])*?)\s*:\s*(.+)$/);
                  let key, value;
                  pair
                    ? ((key = pair[1].replace(/\\:/g, ":")),
                      (value = "false" !== pair[2] && pair[2]))
                    : ((key = option), (value = !0)),
                    map ? ret.set(key, value) : (ret[key] = value);
                }
              }),
          ret
        );
      },
      BucketMap: class BucketMap {
        constructor({ arrays = !1 } = {}) {
          (this.map = new Map()),
            (this[Symbol.iterator] = this.map[Symbol.iterator]),
            (this.arrays = arrays);
        }
        set(key, value) {
          if (this.arrays) {
            var values = this.map.get(key) || [];
            values.push(value);
          } else {
            var values = this.map.get(key) || new Set();
            values.add(value);
          }
          this.map.set(key, values);
        }
        delete(key, value) {
          if (2 == arguments.length) {
            var values = this.map.get(key);
            if (values)
              if (this.arrays) {
                let index = values.indexOf(value);
                -1 < index && values.splice(index, 1);
              } else values.delete(value);
          } else this.map.delete(key);
        }
        forEach(...args) {
          return this.map.forEach(...args);
        }
      },
    });
    (_.Observers = class Observers extends Map {
      constructor({ observer, callback } = {}) {
        super();
        let self = _.Observers;
        (this.callback = callback || self.callback),
          (this.observer =
            observer ||
            (self.observer =
              self.observer || new MutationObserver(this.callback)));
      }
      applyRecord(r) {
        for (let [o, callback] of this.entries())
          if (_.Observers.matchesRecord(o, r)) {
            let node = Mavo.Node.get(r.target, !0);
            callback.call(this, {
              node,
              element: r.target,
              type: r.type,
              attribute: r.attributeName,
              record: r,
            }),
              o.once && this.unobserve(o, callback);
          }
      }
      static matchesRecord(o, r) {
        var _element$matches;
        if (!1 === o.active) return !1;
        let element = r.target;
        if (
          o.selector &&
          !(
            null !== (_element$matches = element.matches) &&
            void 0 !== _element$matches &&
            _element$matches.call(element, o.selector)
          )
        )
          return !1;
        if (o.attribute) {
          var _o$attribute$includes, _o$attribute;
          if ("attributes" !== r.type) return !1;
          if (
            !0 !== o.attribute &&
            o.attribute !== r.attributeName &&
            !(
              null !==
                (_o$attribute$includes = (_o$attribute = o.attribute)
                  .includes) &&
              void 0 !== _o$attribute$includes &&
              _o$attribute$includes.call(_o$attribute, r.attributeName)
            )
          )
            return !1;
        } else if ("attributes" === r.type && !1 === o.attribute) return !1;
        return (
          !o.element ||
          (!1 === o.deep ? element === o.element : o.element.contains(element))
        );
      }
      flush() {
        let records = this.observer.takeRecords();
        records && this.callback(records);
      }
      observe(o = {}, callback) {
        return this.set(o, callback), callback;
      }
      unobserve(options, callback) {
        let matches = this.find(options, callback);
        for (let [o, c] of matches.entries()) this.delete(o);
      }
      pause(options) {
        let matches = this.find(options);
        for (let [o, c] of matches.entries())
          (o._active = !1 !== o.active && !1 !== o._active), (o.active = !1);
        return this.flush(), matches;
      }
      resume(matches) {
        matches instanceof _.Observers || (matches = this.find(matches)),
          this.flush();
        for (let [o, c] of matches.entries())
          (o.active = o.active || o._active), delete o._active;
      }
      find(options = {}, callback) {
        let keys = Object.keys(options);
        let ret = new Mavo.Observers();
        for (let [o, c] of this.entries())
          (callback && callback !== c) ||
            (keys.every((k) => o[k] === options[k]) && ret.set(o, c));
        return ret;
      }
    }),
      (_.Observers.callback = (records) => {
        if (0 !== this.size) for (let r of records) _.observers.applyRecord(r);
      }),
      ($.proxy = $.classProps.proxy =
        $.overload(function (obj, property, proxy) {
          return (
            Object.defineProperty(obj, property, {
              get: function () {
                return this[proxy][property];
              },
              set: function (value) {
                this[proxy][property] = value;
              },
              configurable: !0,
              enumerable: !0,
            }),
            obj
          );
        }));
    document.addEventListener("mv-load", updateTargetWithin),
      addEventListener("hashchange", updateTargetWithin),
      Mavo.observe({ attribute: "id" }, updateTargetWithin);
  })(Bliss, Bliss.$),
  (function ($, $$) {
    var _ = (Mavo.Locale = $.Class({
      constructor: function (lang, phrases) {
        (this.lang = lang), (this.phrases = {}), this.extend(phrases);
      },
      get fallback() {
        return _.all[this.baseLang]
          ? _.all[this.baseLang]
          : this === _.default
          ? void 0
          : _.default;
      },
      extend: function (phrases) {
        $.extend(this.phrases, phrases);
      },
      phrase: function (id, vars) {
        var key = id.toLowerCase();
        var phrase = this.phrases[key];
        if (
          (void 0 === phrase &&
            this.fallback &&
            (phrase = this.fallback.phrase(key)),
          void 0 === phrase)
        )
          phrase = key.replace(/\b-\b/g, " ");
        else if (vars) {
          var _phrase$match$map, _phrase$match;
          var keys =
            null !==
              (_phrase$match$map =
                null === (_phrase$match = phrase.match(/\{\w+(?=\})/g)) ||
                void 0 === _phrase$match
                  ? void 0
                  : _phrase$match.map((v) => v.slice(1))) &&
            void 0 !== _phrase$match$map
              ? _phrase$match$map
              : [];
          Mavo.Functions.unique(keys).forEach((name) => {
            name in vars &&
              (phrase = phrase.replace(
                RegExp("{".concat(name, "}"), "gi"),
                vars[name]
              ));
          });
        }
        return phrase;
      },
      live: {
        lang: function (lang) {
          (this.baseLang = _.getBaseLang(lang)),
            lang == this.baseLang && (this.baseLang = null);
        },
      },
      static: {
        all: {},
        register: function (lang, phrases) {
          _.all[lang]
            ? _.all[lang].extend(phrases)
            : (_.all[lang] = new _(lang, phrases));
        },
        match: function (lang = "") {
          return _.all[lang] || _.all[_.getBaseLang(lang)];
        },
        get: function (lang) {
          return _.match(lang) || _.default;
        },
        getBaseLang: function (lang) {
          return lang.split("-")[0];
        },
        lazy: { default: () => _.match(Mavo.locale) || _.all.en },
      },
    }));
    (Mavo.prototype._ = function (id, vars) {
      return this.locale && id ? this.locale.phrase(id, vars) : id;
    }),
      Mavo.ready.then(() => {
        $$("datalist.mv-phrases[lang]").forEach((datalist) => {
          var phrases = $$("option", datalist).reduce(
            (o, option) => ((o[option.value] = option.textContent.trim()), o),
            {}
          );
          Mavo.Locale.register(datalist.lang, phrases);
        });
      });
  })(Bliss, Bliss.$),
  Mavo.Locale.register("en", {
    second: "second",
    seconds: "seconds",
    minute: "minute",
    minutes: "minutes",
    hour: "hour",
    hours: "hours",
    day: "day",
    days: "days",
    week: "week",
    weeks: "weeks",
    month: "month",
    months: "months",
    year: "year",
    years: "years",
    edit: "Edit",
    editing: "Editing",
    save: "Save",
    import: "Import",
    export: "Export",
    logout: "Logout",
    login: "Login",
    loading: "Loading",
    uploading: "Uploading",
    saving: "Saving",
    dismiss: "Dismiss",
    "logged-in-as": "Logged in to {id} as ",
    "login-to": "Login to {id}",
    "error-uploading": "Error uploading file",
    "cannot-load-uploaded-file": "Cannot load uploaded file",
    filename: "Filename?",
    "problem-saving": "Problem saving data",
    "problem-loading": "Problem loading data",
    "cannot-parse": "Can\u2019t understand this file",
    "http-error": "HTTP error {status}: {statusText}",
    "cant-connect": "Can\u2019t connect to the Internet",
    "add-item": "Add {name}",
    "add-item-before": "Add new {name} before",
    "add-item-after": "Add new {name} after",
    "drag-to-reorder": "Drag to reorder {name}",
    "delete-item": "Delete this {name}",
    "item-deleted": "{name} deleted",
    "n-items": "{n} {name} items",
    undo: "Undo",
    "gh-updated-file": "Updated {name}",
    "gh-login-fork-options":
      "You have your own copy of this page, would you like to use it?",
    "gh-use-my-fork": "Yes, show me my data.",
    "remote-data-conflict":
      "There is new data but you have unsaved changes. Loading it will overwrite your changes. Load new data?",
  }),
  (function ($, $$) {
    Mavo.attributes.push("mv-plugins");
    let _ = (Mavo.Plugins = {
      loaded: {},
      async load() {
        _.plugins = new Set();
        let versions = {};
        if (
          ($$("[mv-plugins]").forEach((element) => {
            element
              .getAttribute("mv-plugins")
              .trim()
              .split(/\s+/)
              .forEach((plugin) => {
                let [id, version] = plugin.split("@");
                _.plugins.add(id), (versions[id] = version);
              });
          }),
          !!_.plugins.size)
        ) {
          let response = await fetch(_.url + "/plugins.json");
          let json = await response.json();
          let plugin = json.plugin;
          return Mavo.thenAll(
            plugin
              .filter((plugin) => _.plugins.has(plugin.id))
              .map(async (plugin) => {
                if (_.loaded[plugin.id]) return Promise.resolve();
                let filename = "mavo-".concat(plugin.id, ".js");
                let url;
                if (plugin.repo) {
                  let version = versions[plugin.id] || "latest";
                  url = "https://cdn.jsdelivr.net/gh/"
                    .concat(plugin.repo, "@")
                    .concat(version, "/")
                    .concat(filename);
                  try {
                    return await $.include(_.loaded[plugin.id], url);
                  } catch (e) {
                    url = "https://cdn.jsdelivr.net/gh/"
                      .concat(plugin.repo, "/")
                      .concat(filename);
                  }
                } else
                  url = ""
                    .concat(_.url, "/")
                    .concat(plugin.id, "/")
                    .concat(filename);
                return $.include(_.loaded[plugin.id], url);
              })
          );
        }
      },
      register: function (name, o = {}) {
        if (!_.loaded[name]) {
          for (let Class in (Mavo.hooks.add(o.hooks), o.extend)) {
            let existing = "Mavo" == Class ? Mavo : Mavo[Class];
            "function" === $.type(existing)
              ? $.Class(existing, o.extend[Class])
              : $.extend(existing, o.extend[Class]);
          }
          let ready = [];
          if ((o.ready && ready.push(o.ready), o.dependencies)) {
            let base = document.currentScript
              ? document.currentScript.src
              : location;
            let dependencies = o.dependencies.map((url) =>
              Mavo.load(url, base)
            );
            ready.push(...dependencies);
          }
          ready.length && Mavo.dependencies.push(...ready),
            (_.loaded[name] = o),
            o.init && Promise.all(ready).then(() => o.init());
        }
      },
      url: "https://plugins.mavo.io",
    });
  })(Bliss, Bliss.$),
  (function ($, $$) {
    var _Mathmax = Math.max;
    var _Mathmin = Math.min;
    Mavo.attributes.push("mv-bar");
    let _ = (Mavo.UI.Bar = class Bar {
      constructor(mavo) {
        if (
          ((this.mavo = mavo),
          (this.element = $(".mv-bar", this.mavo.element)),
          (this.template = this.mavo.element.getAttribute("mv-bar") || ""),
          Mavo.observers.pause(),
          this.element)
        )
          for (let id in ((this.custom = !0),
          (this.template += " " + (this.element.getAttribute("mv-bar") || "")),
          (this.template = this.template.trim()),
          _.controls))
            (this[id] = $(".mv-".concat(id), this.element)),
              this[id] &&
                ((this.template = this.template || "with"),
                (this.template += " ".concat(id)));
        else
          this.element = $.create({
            className: "mv-bar mv-ui",
            start:
              "HTML" === this.mavo.element.tagName
                ? document.body
                : this.mavo.element,
            innerHTML: "<button>&nbsp;</button>",
          });
        this.element.classList.contains("mv-compact") && (this.noResize = !0),
          (this.controls = _.getControls(this.template)),
          this.controls.length &&
            (this.targetHeight = this.element.offsetHeight),
          this.custom || (this.element.innerHTML = "");
        for (let id of this.controls) {
          let o = _.controls[id];
          for (let events in (this[id] && this[id].remove(),
          o.create
            ? (this[id] = o.create.call(this.mavo, this[id]))
            : !this[id] &&
              (this[id] = $.create("button", {
                type: "button",
                className: "mv-".concat(id),
                textContent: this.mavo._(id),
              })),
          this.add(id),
          o.permission
            ? this.permissions.can(
                o.permission,
                () => {
                  this.toggle(id, !o.condition || o.condition.call(this.mavo));
                },
                () => {
                  this.remove(id);
                }
              )
            : o.condition && !o.condition.call(this.mavo) && this.remove(id),
          o.events))
            $.bind(this[id], events, o.events[events].bind(this.mavo));
        }
        for (let id in _.controls) {
          let o = _.controls[id];
          o.action &&
            $.delegate(this.mavo.element, "click", ".mv-" + id, (evt) => {
              (!o.permission || this.permissions.is(o.permission)) &&
                (o.action.call(this.mavo), evt.preventDefault());
            });
        }
        this.controls.length &&
          !this.noResize &&
          (this.resize(),
          self.ResizeObserver &&
            (this.resizeObserver = Mavo.observeResize(this.element, () => {
              this.resize();
            }))),
          Mavo.observers.resume();
      }
      resize() {
        var _this$resizeObserver, _this$resizeObserver2;
        return this.targetHeight
          ? void (null === (_this$resizeObserver = this.resizeObserver) ||
            void 0 === _this$resizeObserver
              ? void 0
              : _this$resizeObserver.disconnect(),
            this.element.classList.remove("mv-compact", "mv-tiny"),
            $$("button, .mv-button", this.element).forEach((button) => {
              button.title === button.textContent && (button.title = "");
            }),
            this.element.offsetHeight > 1.6 * this.targetHeight &&
              (this.element.classList.add("mv-compact"),
              this.element.offsetHeight > 1.2 * this.targetHeight &&
                (this.element.classList.add("mv-tiny"),
                $$("button, .mv-button", this.element).forEach((button) => {
                  button.title || (button.title = button.textContent);
                }))),
            null === (_this$resizeObserver2 = this.resizeObserver) ||
            void 0 === _this$resizeObserver2
              ? void 0
              : _this$resizeObserver2.observe(this.element))
          : void (this.targetHeight = this.element.offsetHeight);
      }
      add(id) {
        let o = _.controls[id];
        o.prepare && o.prepare.call(this.mavo),
          Mavo.revocably.add(this[id], this.element),
          this.resizeObserver ||
            this.noResize ||
            requestAnimationFrame(() => this.resize());
      }
      remove(id) {
        let o = _.controls[id];
        Mavo.revocably.remove(this[id], "mv-" + id),
          o.cleanup && o.cleanup.call(this.mavo),
          this.resizeObserver ||
            this.noResize ||
            requestAnimationFrame(() => this.resize());
      }
      toggle(id, add) {
        return this[add ? "add" : "remove"](id);
      }
      get permissions() {
        return this.mavo.permissions;
      }
      destroy() {
        this.resizeObserver.disconnect(), (this.resizeObserver = null);
      }
      static getControls(template, controls = _.controls) {
        var _template;
        if (
          ((template =
            null === (_template = template) || void 0 === _template
              ? void 0
              : _template.trim()),
          "none" === template)
        )
          return [];
        let all = Object.keys(controls);
        if (!template) return all.filter((id) => !controls[id].optional);
        let relative = /^with\s|\bno-\w+\b/.test(template);
        template = template.replace(/\b^with\s+/g, "");
        let ids = template.split(/\s+/);
        (all = new Set(all)), (ids = new Set(ids));
        for (let id of ids)
          id.startsWith("no-")
            ? (ids.delete(id),
              (id = id.slice(3)),
              ids.has(id) || all.delete(id))
            : all.has(id) || ids.delete(id);
        if (!relative) return [...ids];
        for (let id of all) {
          let o = controls[id];
          o.optional && !ids.has(id) && all.delete(id);
        }
        if (((all = [...all]), 0 === ids.size)) return all;
        let indices = [...ids].map((id) => all.indexOf(id));
        let start = _Mathmin(...indices);
        let end = _Mathmax(...indices);
        let before = all.slice(0, start);
        let after = all.slice(end + 1);
        let slice = all.slice(start, end + 1).filter((id) => !ids.has(id));
        return [...before, ...slice, ...ids, ...after];
      }
    });
    _.controls = {
      status: {
        create: function (custom) {
          return custom || $.create({ className: "mv-status" });
        },
        prepare: function () {
          let backend = this.primaryBackend;
          if (null !== backend && void 0 !== backend && backend.user) {
            let user = backend.user;
            let html = [user.name || ""];
            user.avatar &&
              html.unshift(
                $.create("img", { className: "mv-avatar", src: user.avatar }),
                " "
              ),
              user.url &&
                (html = [
                  $.create("a", {
                    href: user.url,
                    target: "_blank",
                    contents: html,
                  }),
                ]),
              (this.bar.status.textContent = ""),
              $.contents(this.bar.status, [
                { tag: "span", innerHTML: this._("logged-in-as", backend) },
                " ",
                ...html,
              ]);
          }
        },
        permission: "logout",
      },
      edit: {
        action: function () {
          this.editing
            ? (this.done(), (this.bar.edit.textContent = this._("edit")))
            : (this.edit(), (this.bar.edit.textContent = this._("editing")));
        },
        permission: ["edit", "add", "delete"],
        cleanup: function () {
          if (this.editing) {
            var _this$bar3;
            this.done(),
              null !== (_this$bar3 = this.bar) &&
                void 0 !== _this$bar3 &&
                _this$bar3.edit &&
                (this.bar.edit.textContent = this._("edit"));
          }
        },
        condition: function () {
          return this.needsEdit;
        },
      },
      save: {
        action: function () {
          this.save();
        },
        events: {
          "mouseenter focus": function () {
            this.element.classList.add("mv-highlight-unsaved");
          },
          "mouseleave blur": function () {
            this.element.classList.remove("mv-highlight-unsaved");
          },
        },
        permission: "save",
        condition: function () {
          return !this.autoSave || 0 < this.autoSaveDelay;
        },
      },
      export: {
        create: function (custom) {
          let a;
          return (
            (a = custom
              ? custom.matches("a")
                ? custom
                : $.create("a", { className: "mv-button", around: custom })
              : $.create("a", {
                  className: "mv-export mv-button",
                  textContent: this._("export"),
                })),
            a.setAttribute("download", this.id + ".json"),
            a
          );
        },
        events: {
          mousedown: function () {
            this.bar.export.href =
              "data:application/json;charset=UTF-8," +
              encodeURIComponent(this.toJSON());
          },
        },
        permission: "edit",
        optional: !0,
      },
      import: {
        create: function (custom) {
          let button =
            custom ||
            $.create("span", {
              role: "button",
              tabIndex: "0",
              className: "mv-import mv-button",
              textContent: this._("import"),
              events: {
                focus: () => {
                  input.focus();
                },
              },
            });
          let input = $.create("input", {
            type: "file",
            inside: button,
            events: {
              change: (evt) => {
                let file = evt.target.files[0];
                if (file) {
                  let reader = $.extend(new FileReader(), {
                    onload: () => {
                      this.inProgress = !1;
                      try {
                        let json = JSON.parse(reader.result);
                        this.render(json);
                      } catch (e) {
                        this.error(this._("cannot-parse"));
                      }
                    },
                    onerror: () => {
                      this.error(this._("problem-loading"));
                    },
                  });
                  (this.inProgress = "uploading"), reader.readAsText(file);
                }
              },
            },
          });
          return button;
        },
        optional: !0,
      },
      login: {
        action: function () {
          this.primaryBackend.login();
        },
        permission: "login",
      },
      logout: {
        action: function () {
          this.primaryBackend.logout();
        },
        permission: "logout",
      },
    };
  })(Bliss, Bliss.$),
  (function ($) {
    Mavo.UI.Message = $.Class({
      constructor: function (mavo, message, o = {}) {
        if (
          ((this.mavo = mavo),
          (this.message = message),
          (this.closed = Mavo.promise()),
          (this.options = o),
          (this.element = $.create({
            className: "mv-ui mv-message" + (o.type ? " mv-" + o.type : ""),
            ["string" == $.type(this.message) ? "innerHTML" : "contents"]:
              this.message,
            events: {
              click: () => Mavo.scrollIntoViewIfNeeded(this.mavo.element),
            },
            [this.mavo.bar ? "after" : "start"]: (this.mavo.bar || this.mavo)
              .element,
          })),
          o.style && $.style(this.element, o.style),
          o.classes && this.element.classList.add(...o.classes.split(/\s+/)),
          "error" == o.type
            ? this.element.setAttribute("role", "alert")
            : this.element.setAttribute("aria-live", "polite"),
          (o.dismiss = o.dismiss || {}),
          "string" == typeof o.dismiss || Array.isArray(o.dismiss))
        ) {
          var dismiss = {};
          Mavo.toArray(o.dismiss).forEach((prop) => {
            dismiss[prop] = !0;
          }),
            (o.dismiss = dismiss);
        }
        if (
          (o.dismiss.button &&
            $.create("button", {
              type: "button",
              className: "mv-close mv-ui",
              textContent: "\xD7",
              events: { click: () => this.close() },
              start: this.element,
              title: this.mavo._("dismiss"),
            }),
          o.dismiss.timeout)
        ) {
          var timeout =
            "number" == typeof o.dismiss.timeout ? o.dismiss.timeout : 5e3;
          $.bind(this.element, {
            mouseenter: () => clearTimeout(this.closeTimeout),
            mouseleave: Mavo.rr(
              () =>
                (this.closeTimeout = setTimeout(() => this.close(), timeout))
            ),
          });
        }
        o.dismiss.submit &&
          this.element.addEventListener("submit", (evt) => {
            evt.preventDefault(), this.close(evt.target);
          });
      },
      async close(resolve) {
        clearTimeout(this.closeTimeout);
        var duration = this.element.style.transition
          ? 1e3 *
            parseFloat(
              window.getComputedStyle(this.element, null).transitionDuration
            )
          : 400;
        await $.transition(this.element, { opacity: 0 }, duration),
          $.remove(this.element),
          this.closed.resolve(resolve);
      },
    });
  })(Bliss, Bliss.$),
  (function ($) {
    var _ = (Mavo.Permissions = $.Class({
      constructor: function (o) {
        (this.triggers = []),
          (this.hooks = new $.Hooks()),
          (this.parentChanged = _.prototype.parentChanged.bind(this)),
          this.set(o);
      },
      set: function (o) {
        for (var action in o) this[action] = o[action];
      },
      on: function (actions) {
        return (
          Mavo.toArray(actions).forEach((action) => (this[action] = !0)), this
        );
      },
      off: function (actions) {
        return (
          (actions = Array.isArray(actions) ? actions : [actions]),
          actions.forEach((action) => (this[action] = !1)),
          this
        );
      },
      can: function (actions, callback, cannot) {
        this.observe(actions, !0, callback),
          cannot && this.cannot(actions, cannot);
      },
      cannot: function (actions, callback) {
        this.observe(actions, !1, callback);
      },
      observe: function (actions, value, callback) {
        (actions = Mavo.toArray(actions)),
          this.is(actions, value) && callback(),
          this.triggers.push({ actions, value, callback, active: !0 });
      },
      is: function (actions, able = !0) {
        var or = Mavo.toArray(actions)
          .map((action) => !!this[action])
          .reduce((prev, current) => prev || current);
        return able ? or : !or;
      },
      onchange: function (callback) {
        this.hooks.add("change", callback),
          _.actions.forEach((action) => {
            callback.call(this, { action, value: this[action] });
          });
      },
      parentChanged: function (o = {}) {
        var localValue = this["_" + o.action];
        void 0 !== localValue ||
          o.from == o.value ||
          (this.fireTriggers(o.action),
          this.hooks.run("change", $.extend({ context: this }, o)));
      },
      changed: function (action, value, from) {
        (from = !!from), (value = !!value);
        value == from ||
          ((this["_" + action] = value),
          this.fireTriggers(action),
          this.hooks.run("change", { action, value, from, context: this }));
      },
      fireTriggers: function (action) {
        this.triggers.forEach((trigger) => {
          var match = this.is(trigger.actions, trigger.value);
          trigger.active && -1 < trigger.actions.indexOf(action) && match
            ? ((trigger.active = !1), trigger.callback())
            : !match && (trigger.active = !0);
        });
      },
      or: function (permissions) {
        return (
          _.actions.forEach((action) => {
            this[action] = this[action] || permissions[action];
          }),
          this
        );
      },
      live: {
        parent: function (parent) {
          var oldParent = this._parent;
          if (oldParent != parent) {
            if (((this._parent = parent), oldParent)) {
              let index = oldParent.hooks.change.indexOf(this.parentChanged);
              -1 < index && oldParent.hooks.change.splice(index, 1);
            }
            _.actions.forEach((action) => {
              this.parentChanged({
                action,
                value: parent ? parent[action] : void 0,
                from: oldParent ? oldParent[action] : void 0,
              });
            }),
              parent && parent.onchange(this.parentChanged);
          }
        },
      },
      static: {
        actions: [],
        register: function (action, setter) {
          return Array.isArray(action)
            ? void action.forEach((action) => _.register(action, setter))
            : void ($.live(_.prototype, action, {
                get: function () {
                  var ret = this["_" + action];
                  return void 0 === ret && this.parent
                    ? this.parent[action]
                    : ret;
                },
                set: function (able, previous) {
                  setter && setter.call(this, able, previous),
                    this.changed(action, able, previous);
                },
              }),
              _.actions.push(action));
        },
      },
    }));
    _.register(["read", "save"]),
      _.register("login", function (can) {
        can && this.logout && (this.logout = !1);
      }),
      _.register("logout", function (can) {
        can && this.login && (this.login = !1);
      }),
      _.register("edit", function (can) {
        can && (this.add = this.delete = !0);
      }),
      _.register(["add", "delete"], function (can) {
        can || (this.edit = !1);
      });
  })(Bliss, Bliss.$),
  (function ($) {
    var _Mathmin2 = Math.min;
    var _class2, _temp2;
    var _ = (Mavo.Backend =
      ((_temp2 = _class2 =
        class Backend extends EventTarget {
          constructor(url, o = {}) {
            super(),
              _defineProperty(this, "ready", Promise.resolve()),
              _defineProperty(this, "oAuthParams", () => ""),
              (this.permissions = new Mavo.Permissions()),
              this.update(url, o);
          }
          update(url, o = {}) {
            var _this$constructor$key;
            if (
              ((this.source = url),
              (this.url = new URL(this.source, Mavo.base)),
              (this.options = o),
              (this.mavo = o.mavo),
              (this.format = Mavo.Formats.create(o.format, this)),
              null !== (_this$constructor$key = this.constructor.key) &&
              void 0 !== _this$constructor$key
                ? _this$constructor$key
                : o.key)
            ) {
              var _o$key;
              this.key =
                null !== (_o$key = o.key) && void 0 !== _o$key
                  ? _o$key
                  : this.constructor.key;
            }
          }
          async get(url = new URL(this.url)) {
            "data:" != url.protocol &&
              !1 !== this.constructor.useCache &&
              url.searchParams.set("timestamp", Date.now());
            try {
              let response = await fetch(url.href);
              return response.ok ? response.text() : Promise.reject(response);
            } catch (e) {
              return null;
            }
          }
          async load() {
            await this.ready;
            let response = await this.get();
            return "string" == typeof response
              ? ((response = response.replace(/^\ufeff/, "")),
                this.format.parse(response))
              : response;
          }
          async store(data, { path, format = this.format } = {}) {
            await this.ready;
            var serialized =
              "string" == typeof data ? data : await format.stringify(data);
            return await this.put(serialized, path), { data, serialized };
          }
          async login() {}
          async logout() {}
          put() {
            return Promise.reject();
          }
          isAuthenticated() {
            return !!this.accessToken;
          }
          toString() {
            return "".concat(this.id, " (").concat(this.url, ")");
          }
          equals(backend) {
            return (
              backend === this ||
              (backend &&
                this.id == backend.id &&
                this.source == backend.source)
            );
          }
          async request(call, data, method = "GET", req = {}) {
            var _response;
            if (
              ((req = Object.assign({}, req)),
              (req.method = req.method || method),
              (req.responseType = req.responseType || "json"),
              (req.headers = Object.assign(
                { "Content-Type": "application/json; charset=utf-8" },
                req.headers || {}
              )),
              this.isAuthenticated() &&
                (req.headers.Authorization =
                  req.headers.Authorization ||
                  "Bearer ".concat(this.accessToken)),
              (req.body = data),
              (call = new URL(call, this.constructor.apiDomain)),
              "GET" == req.method &&
                !1 !== this.constructor.useCache &&
                call.searchParams.set("timestamp", Date.now()),
              "object" === $.type(req.body))
            )
              if ("GET" === req.method || "HEAD" === req.method) {
                for (let p in req.body) {
                  let action = void 0 === req.body[p] ? "delete" : "set";
                  call.searchParams[action](p, req.body[p]);
                }
                delete req.body;
              } else req.body = JSON.stringify(req.body);
            let response;
            try {
              response = await fetch(call, req);
            } catch (err) {
              this.mavo.error(
                "Something went wrong while connecting to " + this.id,
                err
              );
            }
            if (
              null !== (_response = response) &&
              void 0 !== _response &&
              _response.ok
            )
              return "HEAD" === req.method || "response" === req.responseType
                ? response
                : response[req.responseType]();
            throw response;
          }
          oAuthenticate(passive) {
            return this.ready.then(() =>
              this.isAuthenticated()
                ? Promise.resolve()
                : new Promise((resolve, reject) => {
                    var id = this.id.toLowerCase();
                    if (passive)
                      (this.accessToken =
                        localStorage["mavo:".concat(id, "token")]),
                        this.accessToken && resolve(this.accessToken);
                    else {
                      var popup = {
                        width: _Mathmin2(1e3, innerWidth - 100),
                        height: _Mathmin2(800, innerHeight - 100),
                      };
                      (popup.top = (screen.height - popup.height) / 2),
                        (popup.left = (screen.width - popup.width) / 2);
                      var state = { url: location.href, backend: this.id };
                      if (
                        ((this.authPopup = open(
                          ""
                            .concat(this.constructor.oAuth, "?client_id=")
                            .concat(this.key, "&state=")
                            .concat(encodeURIComponent(JSON.stringify(state))) +
                            this.oAuthParams(),
                          "popup",
                          "width="
                            .concat(popup.width, ",height=")
                            .concat(popup.height, ",left=")
                            .concat(popup.left, ",top=")
                            .concat(popup.top)
                        )),
                        !this.authPopup)
                      ) {
                        this.mavo.error(
                          "Login popup was blocked! Please check your popup blocker settings."
                        ),
                          reject(
                            Error(
                              "Login popup was blocked! Please check your popup blocker settings."
                            )
                          );
                      }
                      addEventListener("message", (evt) => {
                        if (evt.source === this.authPopup)
                          for (var appid in (evt.data.backend == this.id &&
                            (this.accessToken = localStorage[
                              "mavo:".concat(id, "token")
                            ] =
                              evt.data.token),
                          this.accessToken ||
                            reject(Error("Authentication error")),
                          resolve(this.accessToken),
                          Mavo.all)) {
                            var storage = Mavo.all[appid].primaryBackend;
                            storage &&
                              storage.id === this.id &&
                              storage !== this &&
                              !storage.isAuthenticated() &&
                              storage.login(!0);
                          }
                      });
                    }
                  })
            );
          }
          oAuthLogout() {
            if (this.isAuthenticated()) {
              var id = this.id.toLowerCase();
              localStorage.removeItem("mavo:".concat(id, "token")),
                delete this.accessToken,
                this.permissions
                  .off(["edit", "add", "delete", "save"])
                  .on("login"),
                $.fire(this, "mv-logout");
            }
            return Promise.resolve();
          }
          static create(url, o = {}, existing) {
            let Backend;
            return (
              o.type && (Backend = Mavo.Functions.get(_, o.type)),
              url &&
                !Backend &&
                (Backend =
                  _.types.find((Backend) => Backend.test(url, o)) || _.Remote),
              Backend &&
              (null === existing || void 0 === existing
                ? void 0
                : existing.constructor) === Backend &&
              existing.constructor.prototype.hasOwnProperty("update")
                ? (existing.update(url, o), existing)
                : Backend
                ? new Backend(url, o)
                : null
            );
          }
          static register(Class) {
            return (_[Class.name] = Class), _.types.push(Class), Class;
          }
        }),
      _defineProperty(_class2, "types", []),
      _temp2));
    _.register(
      class Element extends _ {
        constructor(url, o) {
          super(url, o),
            _defineProperty(this, "id", "Element"),
            this.permissions.on(["read", "edit", "save"]);
        }
        update(url, o) {
          var _this$observer4, _$, _this$observer5;
          super.update(url, o),
            null === (_this$observer4 = this.observer) ||
            void 0 === _this$observer4
              ? void 0
              : _this$observer4.disconnect(),
            (this.element =
              null !== (_$ = $(this.source)) && void 0 !== _$
                ? _$
                : $.create("script", {
                    type: "application/json",
                    id: this.source.slice(1),
                    inside: document.body,
                  })),
            (this.observer =
              null !== (_this$observer5 = this.observer) &&
              void 0 !== _this$observer5
                ? _this$observer5
                : new MutationObserver(() => {
                    $.fire(this, "mv-remotedatachange");
                  })),
            this.observer.observe(this.element, {
              childList: !0,
              characterData: !0,
              subtree: !0,
            });
        }
        async get() {
          return this.element.textContent;
        }
        async put(serialized) {
          this.observer.disconnect();
          let ret = (this.element.textContent = serialized);
          return (
            this.observer.observe(this.element, {
              childList: !0,
              characterData: !0,
              subtree: !0,
            }),
            ret
          );
        }
        static test(url) {
          return 0 === url.indexOf("#");
        }
      }
    ),
      _.register(
        class Remote extends _ {
          constructor(url, o) {
            super(url, o),
              _defineProperty(this, "id", "Remote"),
              this.permissions.on("read");
          }
          static test() {
            return !1;
          }
        }
      ),
      _.register(
        class Local extends _ {
          constructor(url, o) {
            super(url, o),
              _defineProperty(this, "id", "Local"),
              this.permissions.on(["read", "edit", "save"]);
          }
          update(url, o) {
            super.update(url, o), (this.key = o.key || this.mavo.id);
          }
          get() {
            return Promise[this.key in localStorage ? "resolve" : "reject"](
              localStorage[this.key]
            );
          }
          put(serialized) {
            return (
              serialized
                ? (localStorage[this.key] = serialized)
                : delete localStorage[this.key],
              Promise.resolve(serialized)
            );
          }
          static test(value) {
            return "local" == value;
          }
        }
      );
  })(Bliss, Bliss.$),
  (function ($) {
    var _ = (Mavo.Formats = {});
    var base = (_.Base = $.Class({
      abstract: !0,
      constructor: function (backend) {
        this.backend = backend;
      },
      proxy: { mavo: "backend" },
      parse: function (content) {
        return this.constructor.parse(content, this);
      },
      stringify: function (data) {
        return this.constructor.stringify(data, this);
      },
      static: {
        parse: (serialized) => Promise.resolve(serialized),
        stringify: (data) => Promise.resolve(data),
        extensions: [],
        dependencies: [],
        ready: function () {
          return Promise.all(
            this.dependencies.map((d) => $.include(d.test(), d.url))
          );
        },
      },
    }));
    _.JSON = $.Class({
      extends: _.Base,
      static: {
        parse: (serialized) =>
          Promise.resolve(serialized ? JSON.parse(serialized) : null),
        stringify: (data) => Promise.resolve(Mavo.toJSON(data)),
        extensions: [".json", ".jsonld"],
      },
    });
    _.Text = $.Class({
      extends: _.Base,
      constructor: function () {
        this.property = this.mavo.root.getNames("Primitive")[0];
      },
      static: {
        extensions: [".txt"],
        parse: (serialized, me) =>
          Promise.resolve({ [me ? me.property : "content"]: serialized }),
        stringify: (data, me) =>
          Promise.resolve(data[me ? me.property : "content"]),
      },
    });
    var csv = (_.CSV = $.Class({
      extends: _.Base,
      constructor: function () {
        (this.property = this.mavo.root.getNames("Collection")[0]),
          (this.options = $.extend({}, _.CSV.defaultOptions));
      },
      static: {
        extensions: [".csv", ".tsv"],
        defaultOptions: { header: !0, dynamicTyping: !0, skipEmptyLines: !0 },
        dependencies: [
          {
            test: () => self.Papa,
            url: "https://cdnjs.cloudflare.com/ajax/libs/PapaParse/4.1.4/papaparse.min.js",
          },
        ],
        ready: base.ready,
        parse: async (serialized, me) => {
          await csv.ready();
          var data = Papa.parse(serialized, csv.defaultOptions);
          var property = me ? me.property : "content";
          if (
            (me &&
              ((me.options.delimiter = data.meta.delimiter),
              (me.options.linebreak = data.meta.linebreak)),
            data.meta.aborted)
          )
            throw data.meta.errors.pop();
          return { [property]: data.data };
        },
        stringify: async (data, me) => {
          await csv.ready();
          var property = me ? me.property : "content";
          var options = me ? me.options : csv.defaultOptions;
          return Papa.unparse(data[property], options);
        },
      },
    }));
    Object.defineProperty(_, "create", {
      value: function (format, backend) {
        if (format && "object" == typeof format) return format;
        if ("string" == typeof format)
          for (var id in ((format = format.toLowerCase()), _)) {
            var Format = _[id];
            if (id.toLowerCase() == format) return new Format(backend);
          }
        if (!format) {
          var _url$match$, _url$match;
          var url = backend.url ? backend.url.pathname : backend.source;
          var extension =
            null !==
              (_url$match$ =
                null === (_url$match = url.match(/\.\w+$/)) ||
                void 0 === _url$match
                  ? void 0
                  : _url$match[0]) && void 0 !== _url$match$
              ? _url$match$
              : ".json";
          var Format = _.JSON;
          for (var id in _)
            -1 < _[id].extensions.indexOf(extension) && (Format = _[id]);
          return new Format(backend);
        }
      },
    });
  })(Bliss, Bliss.$),
  (function ($, $$) {
    var _ = (Mavo.Node = class Node {
      constructor(element, mavo, options = {}) {
        if (!element || !mavo)
          throw new Error(
            "Mavo.Node constructor requires an element argument and a mavo object"
          );
        var env = { context: this, options };
        (this.uid = _.all.push(this) - 1),
          (this.property = null),
          (this.element = element),
          (this.isHelperVariable = this.element.matches("meta")),
          $.extend(this, env.options),
          _.elements.set(element, [
            ...(_.elements.get(this.element) || []),
            this,
          ]),
          (this.mavo = mavo),
          (this.group = this.parent = this.parentGroup = env.options.group),
          (this.template = env.options.template),
          (this.alias = this.element.getAttribute("mv-alias")),
          this.template
            ? this.template.copies.add(this)
            : (this.copies = new Set()),
          this.fromTemplate("property", "type", "storage", "path") ||
            ((this.property = _.getProperty(element)),
            (this.type = Mavo.Group.normalize(element)),
            (this.storage = this.element.getAttribute("mv-storage")),
            (this.path = this.getPath())),
          (this.modes = this.element.getAttribute("mv-mode")),
          Mavo.hooks.run("node-init-start", env),
          (this.mode = Mavo.getStyle(this.element, "--mv-mode") || "read"),
          (this.collection = env.options.collection),
          this.collection &&
            (this.group = this.parentGroup = this.collection.parentGroup);
        var template = this.template;
        if (null !== template && void 0 !== template && template.expressions) {
          this.expressions = new Set();
          for (let et of template.expressions)
            this.expressions.add(
              new Mavo.DOMExpression({
                template: et,
                item: this,
                mavo: this.mavo,
              })
            );
        }
        if (!(this instanceof Mavo.Primitive)) {
          var et = Mavo.DOMExpression.search(this.element).filter(
            (et) => "mv-value" == et.originalAttribute
          )[0];
          et &&
            ((et.mavoNode = this),
            (this.expressionText = et),
            (this.storage = this.storage || "none"),
            (this.modes = this.modes || "read"));
        }
        Mavo.hooks.run("node-init-end", env);
      }
      get editing() {
        return "edit" == this.mode;
      }
      get isRoot() {
        return !this.property;
      }
      get name() {
        return Mavo.Functions.readable(
          this.property || this.type
        ).toLowerCase();
      }
      get saved() {
        return "none" !== this.storage;
      }
      get properties() {
        let route = this.liveData.data[Mavo.route];
        return route ? Object.keys(route) : [];
      }
      postInit() {
        "edit" == this.modes && this.edit();
      }
      destroy() {
        this.template && this.template.copies.delete(this),
          this.expressions &&
            this.expressions.forEach((expression) => expression.destroy()),
          this.itembar && this.itembar.destroy(),
          delete _.all[this.uid],
          this.propagate("destroy");
      }
      getLiveData() {
        return this.liveData.proxy;
      }
      isDataNull(o = {}) {
        var env = { context: this, options: o, result: !this.saved && !o.live };
        return Mavo.hooks.run("node-isdatanull", env), env.result;
      }
      walk(callback, path = [], o = {}) {
        var walker = (obj, path) => {
          var ret = callback(obj, path);
          if (!1 !== ret)
            for (let i in obj.children) {
              let node = obj.children[i];
              if (node instanceof Mavo.Node) {
                var ret = walker.call(node, node, [...path, i]);
                if (!1 === ret && !o.descentReturn) return !1;
              }
            }
          return !1 !== ret;
        };
        return walker(this, path);
      }
      walkUp(callback) {
        for (var group = this; (group = group.parentGroup); ) {
          var ret = callback(group);
          if (ret !== void 0) return ret;
        }
      }
      edit({ force } = {}) {
        return (
          (this.mode = "edit"),
          !!(force || "edit" == this.mode) &&
            void ($.fire(this.element, "mv-edit", {
              mavo: this.mavo,
              node: this,
            }),
            Mavo.hooks.run("node-edit-end", this))
        );
      }
      done({ force } = {}) {
        return (
          (this.mode =
            Mavo.getStyle(this.element.parentNode, "--mv-mode") || "read"),
          !!(force || "read" == this.mode) &&
            void ($.unbind(this.element, ".mavo:edit"),
            $.fire(this.element, "mv-done", { mavo: this.mavo, node: this }),
            this.propagate("done"),
            Mavo.hooks.run("node-done-end", this))
        );
      }
      save() {
        (this.unsavedChanges = !1), this.propagate("save");
      }
      propagate(callback) {
        for (let i in this.children) {
          let node = this.children[i];
          node instanceof Mavo.Node &&
            ("function" == typeof callback
              ? callback.call(node, node)
              : callback in node && node[callback]());
        }
      }
      fromTemplate(...properties) {
        return (
          this.template &&
            properties.forEach(
              (property) => (this[property] = this.template[property])
            ),
          !!this.template
        );
      }
      async render(data, o = {}) {
        if (
          ((o.live = o.live || Mavo.in(Mavo.isProxy, data)),
          (o.root = o.root || this),
          delete this.pending,
          "promise" === $.type(data))
        ) {
          let pending = (this.pending = data);
          try {
            data = await pending;
          } catch (e) {
            data = e;
          }
          if (this.pending !== pending) return;
          delete this.pending;
        }
        o.live && (data = Mavo.clone(data)),
          (this.oldData = this.data),
          (this.data = data),
          o.live || (data = Mavo.subset(data, this.inPath));
        var env = { context: this, data, options: o };
        if (
          (Mavo.hooks.run("node-render-start", env),
          !this.isHelperVariable && !o.live)
        ) {
          var _this$childrenNames;
          if (!Array.isArray(this.children) && Array.isArray(env.data)) {
            if (this.isRoot) {
              var mainProperty =
                this.children.main instanceof Mavo.Collection
                  ? "main"
                  : this.getNames((p, n) => {
                      var _n$expressions, _n$expressions$;
                      return (
                        n instanceof Mavo.Collection &&
                        !(
                          null !== (_n$expressions = n.expressions) &&
                          void 0 !== _n$expressions &&
                          null !== (_n$expressions$ = _n$expressions[0]) &&
                          void 0 !== _n$expressions$ &&
                          _n$expressions$.isDynamicObject
                        )
                      );
                    })[0];
              mainProperty && (env.data = { [mainProperty]: env.data });
            }
            (this.isRoot && mainProperty) ||
              (this.inPath.push("0"), (env.data = env.data[0]));
          } else
            1 ==
              (null === (_this$childrenNames = this.childrenNames) ||
              void 0 === _this$childrenNames
                ? void 0
                : _this$childrenNames.length) &&
              this.childrenNames[0] === this.property &&
              null !== env.data &&
              Mavo.isPlainObject(env.data) &&
              (env.data = env.data[this.property]);
        }
        this === o.root && (this.expressionsEnabled = !1);
        var editing = this.editing;
        editing && this.done();
        var changed = this.dataRender(env.data, o);
        return (
          editing && this.edit(),
          this === o.root &&
            (this.save(),
            (this.expressionsEnabled = !0),
            changed &&
              requestAnimationFrame(() => this.mavo.expressions.update(this))),
          Mavo.hooks.run("node-render-end", env),
          changed
        );
      }
      dataChanged(action, o = {}) {
        var change = $.extend(
          { action, property: this.property, mavo: this.mavo, node: this },
          o
        );
        $.fire(o.element || this.element, "mv-change", change),
          this.mavo.changed(change);
      }
      toString() {
        return "#"
          .concat(this.uid, ": ")
          .concat(this.constructor.name, " (")
          .concat(this.property, ")");
      }
      getClosestCollection() {
        var closestItem = this.closestItem;
        return closestItem ? closestItem.collection : null;
      }
      getClosestItem() {
        var _this$collection, _this$parentGroup;
        return Array.isArray(
          null === (_this$collection = this.collection) ||
            void 0 === _this$collection
            ? void 0
            : _this$collection.children
        )
          ? this
          : (null === (_this$parentGroup = this.parentGroup) ||
            void 0 === _this$parentGroup
              ? void 0
              : _this$parentGroup.closestItem) || null;
      }
      getPath() {
        var _this$parent;
        var path =
          (null === (_this$parent = this.parent) || void 0 === _this$parent
            ? void 0
            : _this$parent.path) || [];
        return this.property ? [...path, this.property] : path;
      }
      pathFrom(node) {
        var path = this.path;
        var nodePath = node.path;
        for (var i = 0; i < path.length && nodePath[i] == path[i]; i++);
        return path.slice(i);
      }
      getDescendant(path) {
        return path.reduce((acc, cur) => acc.children[cur], this);
      }
      getCousin(offset, o = {}) {
        if (!this.closestCollection) return null;
        var collection = this.closestCollection;
        var distance = Math.abs(offset);
        var direction = 0 > offset ? -1 : 1;
        if (collection.length < distance + 1) return null;
        var index = this.closestItem.index + offset;
        o.wrap && (index = Mavo.wrap(index, collection.length));
        for (var i = 0; i < collection.length; i++) {
          var ind = index + i * direction;
          o.wrap && (ind = Mavo.wrap(ind, collection.length));
          var item = collection.children[ind];
          if (item) break;
        }
        if (!item || item == this.closestItem) return null;
        if (this.collection) return item;
        var relativePath = this.pathFrom(this.closestItem);
        return item.getDescendant(relativePath);
      }
      contains(node) {
        do {
          if (node === this) return !0;
          node = node.parent;
        } while (node);
        return !1;
      }
      eval(expr, o) {
        return new Mavo.Expression(expr).eval(this.getLiveData(), o);
      }
      static create(element, mavo, o = {}) {
        if (element.hasAttribute("mv-list"))
          return new Mavo.Collection(element, mavo, o);
        let isGroup = element.matches(Mavo.selectors.group);
        return new Mavo[isGroup ? "Group" : "Primitive"](element, mavo, o);
      }
      static getImplicitPropertyName(element) {
        return (
          element.getAttribute("itemprop") ||
          element.getAttribute("mv-list") ||
          element.getAttribute("mv-list-item") ||
          element.name ||
          element.id ||
          [...element.classList].filter((n) => !n.startsWith("mv-"))[0]
        );
      }
      static getProperty(element) {
        if (!element.hasAttribute("property")) return null;
        let property = element.getAttribute("property");
        return (
          !property &&
            (property = _.getImplicitPropertyName(element)) &&
            element.setAttribute("property", property),
          property
        );
      }
      static generatePropertyName(prefix, element = document.documentElement) {
        let root = element.closest(Mavo.selectors.init);
        let names = new Set(
          $$("[property]", root).map((e) => e.getAttribute("property"))
        );
        for (let i = ""; 1e3 > i; i++) {
          let name = prefix + i;
          if (!names.has(name)) return name;
        }
      }
      static get(element, prioritizePrimitive) {
        let nodes = _.elements.get(element) || [];
        return (
          (nodes = nodes.filter(
            (n) => !(n instanceof Mavo.ImplicitCollection)
          )),
          2 > nodes.length || !prioritizePrimitive
            ? nodes[0]
            : nodes[0] instanceof Mavo.Group
            ? nodes[1]
            : void 0
        );
      }
      static getClosest(element, prioritizePrimitive) {
        let node;
        do {
          var _element2;
          node = _.get(element, prioritizePrimitive);
        } while (
          !node &&
          (element =
            null === (_element2 = element) || void 0 === _element2
              ? void 0
              : _element2.parentNode)
        );
        return node;
      }
      static getClosestItem(element) {
        var item = _.getClosest(element);
        return item instanceof Mavo.Primitive && !item.collection
          ? item.parent
          : item;
      }
      static children(element) {
        var ret = Mavo.Node.get(element);
        return ret
          ? [ret]
          : ((ret = $$(Mavo.selectors.property, element)
              .map((e) => Mavo.Node.get(e))
              .filter((e) => !element.contains(e.parentGroup.element))
              .map((e) => e.collection || e)),
            Mavo.Functions.unique(ret));
      }
    });
    $.Class(_, {
      toJSON: Mavo.prototype.toJSON,
      lazy: {
        closestCollection: function () {
          return this.getClosestCollection();
        },
        closestItem: function () {
          return this.getClosestItem();
        },
        inPath: function () {
          return (this.element.getAttribute("mv-path") || "")
            .split("/")
            .filter((p) => p.length);
        },
      },
      live: {
        store: function (value) {
          $.toggleAttribute(this.element, "mv-storage", value);
        },
        unsavedChanges: function (value) {
          return (
            !value || (this.saved && this.editing) || (value = !1),
            Array.isArray(this.children) ||
              this.element.classList.toggle("mv-unsaved-changes", value),
            value
          );
        },
        mode: function (value) {
          if (this._mode != value) {
            if (
              (this.modes && value != this.modes && (value = this.modes),
              (this._mode = value),
              !Array.isArray(this.children) &&
                -1 <
                  [null, "", "read", "edit"].indexOf(
                    this.element.getAttribute("mv-mode")
                  ))
            ) {
              var set = this.modes || "edit" == value;
              let matches = Mavo.observers.pause({ attribute: "mv-mode" });
              $.toggleAttribute(this.element, "mv-mode", value, set),
                Mavo.observers.resume(matches);
            }
            return value;
          }
        },
        modes: function (value) {
          return value && "read" != value && "edit" != value
            ? null
            : void ((this._modes = value),
              value && this.mode != value && (this.mode = value));
        },
        collection: function (value) {
          this.parent = value || this.parentGroup;
        },
        index: function (value) {
          this._index !== value &&
            ((this._index = value), this.liveData.updateKey());
        },
        expressionsEnabled: {
          get: function () {
            return (
              !1 !== this._expressionsEnabled &&
              (!this.parent || this.parent.expressionsEnabled)
            );
          },
        },
      },
      static: { all: [], elements: new WeakMap() },
    }),
      Mavo.observe({ attribute: "mv-storage" }, function ({ node }) {
        node && (node.storage = node.element.getAttribute("mv-storage"));
      });
  })(Bliss, Bliss.$),
  (function ($, $$) {
    var _ = (Mavo.Group = class Group extends Mavo.Node {
      constructor(element, mavo, o) {
        super(element, mavo, o),
          (this.children = {}),
          (this.group = this),
          Mavo.hooks.run("group-init-start", this),
          Mavo.Primitive.getValueAttribute(this.element) &&
            (this.children[this.property] = new Mavo.Primitive(
              this.element,
              this.mavo,
              { group: this }
            ));
        let properties = $$(
          "[property]:not(:scope ".concat(Mavo.selectors.scope, " [property])"),
          this.element
        );
        let propertyNames = properties.map((element) =>
          Mavo.Node.getProperty(element)
        );
        for (let i = 0, element; (element = properties[i]); i++) {
          let property = Mavo.Node.getProperty(element);
          let existing = this.children[property];
          let template = this.template
            ? this.template.children[property]
            : null;
          let options = { template, group: this };
          existing
            ? existing.add(element)
            : propertyNames.lastIndexOf(property) === i
            ? (this.children[property] = Mavo.Node.create(
                element,
                this.mavo,
                options
              ))
            : (this.children[property] = new Mavo.ImplicitCollection(
                element,
                this.mavo,
                options
              ));
        }
        (this.childrenNames = Object.keys(this.children)),
          (this.vocab = Mavo.getClosestAttribute(this.element, "vocab")),
          this.postInit(),
          Mavo.hooks.run("group-init-end", this);
      }
      get isRoot() {
        return !this.property;
      }
      getNames(type = "Node") {
        var filter =
          "function" == typeof type ? type : (p, n) => n instanceof Mavo[type];
        return Object.keys(this.children).filter((p) =>
          filter(p, this.children[p])
        );
      }
      getData(o = {}) {
        var env = { context: this, options: o };
        if (this.isDataNull(o)) return null;
        for (var property in ((env.data =
          Mavo.shallowClone(Mavo.subset(this.data, this.inPath)) || {}),
        this.children)) {
          var obj = this.children[property];
          if (obj.saved) var data = obj.getData(env.options);
          obj.saved && null !== Mavo.value(data)
            ? (env.data[obj.property] = data)
            : delete env.data[obj.property];
        }
        return (
          this.childrenNames.length || this.isRoot || this.collection
            ? 1 === this.childrenNames.length && this.property in this.children
              ? (env.data = env.data[this.property])
              : env.data &&
                "object" == typeof env.data &&
                (this.type &&
                  this.type != _.DEFAULT_TYPE &&
                  (env.data["@type"] = this.type),
                this.vocab && (env.data["@context"] = this.vocab))
            : (env.data = null),
          (env.data = Mavo.subset(this.data, this.inPath, env.data)),
          Mavo.hooks.run("node-getdata-end", env),
          env.data
        );
      }
      edit(o = {}) {
        return (
          !1 !== super.edit() &&
          Promise.all(
            Object.keys(this.children).map((prop) =>
              this.children[prop].edit(o)
            )
          )
        );
      }
      dataRender(data, o = {}) {
        if (!data) return;
        let changed = !1;
        let noWriteableProperty;
        let wasPrimitive;
        if ("object" != typeof data) {
          wasPrimitive = !0;
          let property = this.property;
          if (!(this.property in this.children)) {
            let type = $.type(data);
            let score = (prop) =>
              (this.children[prop] instanceof Mavo.Primitive) +
              (this.children[prop].datatype == type);
            property = Object.keys(this.children)
              .filter((p) => !this.children[p].expressionText)
              .sort((prop1, prop2) => score(prop1) - score(prop2))
              .reverse()[0];
          }
          property || ((property = this.property), (noWriteableProperty = !0)),
            (data = { [property]: data }),
            (this.data = Mavo.subset(this.data, this.inPath, data));
        }
        let copy;
        if (
          (this.propagate((obj) => {
            let propertyData = data[obj.property];
            if (obj.alias) {
              let aliasesArr = obj.alias.split(" ");
              for (let i = 0; i < aliasesArr.length; i++) {
                let currentAlias = aliasesArr[i];
                if (void 0 !== data[currentAlias]) {
                  (obj.currentAlias = currentAlias),
                    (copy = copy || $.extend({}, data)),
                    (propertyData = data[obj.currentAlias]);
                  break;
                }
              }
            }
            changed = obj.render(propertyData, o) || changed;
          }),
          copy &&
            this.propagate((obj) => {
              obj.currentAlias &&
                ((data[obj.property] = copy[obj.currentAlias]),
                !(obj.currentAlias in this.children) &&
                  delete data[obj.currentAlias]);
            }),
          !wasPrimitive || noWriteableProperty)
        ) {
          let oldData = Mavo.subset(this.oldData, this.inPath);
          for (let property in data)
            if (!(property in this.children)) {
              let value = data[property];
              (changed =
                changed || data[property] !== this.liveData.data[property]),
                this.liveData.set(property, value),
                !1 === this.expressionsEnabled ||
                  "object" == typeof value ||
                  (oldData && oldData[property] == value) ||
                  this.dataChanged("propertychange", { property });
            }
        }
        return changed;
      }
      static normalize(element) {
        if (element.matches(Mavo.selectors.group)) {
          var type =
            Mavo.getAttribute(element, "typeof", "mv-group") || _.DEFAULT_TYPE;
          return element.setAttribute("typeof", type), type;
        }
        return null;
      }
    });
    $.Class(_, {
      lazy: {
        liveData: function () {
          return new Mavo.Data(this, {});
        },
      },
      static: { all: new WeakMap(), DEFAULT_TYPE: "Item" },
    });
  })(Bliss, Bliss.$),
  (async function ($, $$) {
    var _ = (Mavo.Primitive = class Primitive extends Mavo.Node {
      constructor(element, mavo, o) {
        if (
          (super(element, mavo, o),
          (this.liveData = new Mavo.Data(this)),
          this.fromTemplate(
            "config",
            "attribute",
            "templateValue",
            "originalEditor"
          ) ||
            ((this.config = _.getConfig(element)),
            (this.attribute = this.config.attribute),
            this.attribute &&
              !document.xmlVersion &&
              (this.attribute = this.attribute.toLowerCase())),
          (this.datatype = this.config.datatype),
          "modes" in this.config &&
            ((this.modes = this.config.modes),
            this.element.setAttribute("mv-mode", this.config.modes)),
          Mavo.hooks.run("primitive-init-start", this),
          (this.expressionText =
            this.expressionText ||
            Mavo.DOMExpression.search(this.element, this.attribute)),
          this.expressionText &&
            !this.expressionText.mavoNode &&
            ((this.expressionText.mavoNode = this),
            (this.storage = this.storage || "none"),
            (this.modes = "read"),
            this.element.setAttribute("aria-live", "polite")),
          this.config.init && this.config.init.call(this, this.element),
          this.config.initOnce &&
            !this.config.initOnce.called &&
            (this.config.initOnce.call(this, this.element),
            (this.config.initOnce.called = !0)),
          this.config.changeEvents &&
            $.bind(this.element, this.config.changeEvents, (evt) => {
              evt.target === this.element && (this.value = this.getValue());
            }),
          this.expressionText)
        )
          this.setValue(this.expressionText.value, { silent: !0 });
        else {
          if (
            (this.element.hasAttribute("aria-label")
              ? (this.label = this.element.getAttribute("aria-label"))
              : ((this.label = Mavo.Functions.readable(this.property)),
                this.pauseObserver(),
                this.element.setAttribute("aria-label", this.label),
                this.resumeObserver()),
            this.element.hasAttribute("mv-editor"))
          ) {
            this.originalEditorUpdated({ force: !0 });
            let editorValue = this.editorValue;
            this.datatype ||
              ("number" != typeof editorValue &&
                "boolean" != typeof editorValue) ||
              (this.datatype = typeof editorValue);
          } else
            this.element.hasAttribute("mv-options") && this.updateOptions();
          if (
            ((this.templateValue = this.getValue()),
            (this._default = this.element.getAttribute("mv-default")),
            null !== this.default)
          )
            "" === this.default
              ? ((this._default = this.templateValue),
                (this.defaultSource = "template"))
              : ((this.defaultExpression = Mavo.DOMExpression.search(
                  this.element,
                  "mv-default"
                )),
                this.defaultExpression &&
                  (this.defaultExpression.output = (value) =>
                    (this.default = value)),
                (this.defaultSource = "attribute"));
          else if (this.modes)
            (this._default = this.templateValue),
              (this.defaultSource = "template");
          else {
            if (((this._default = this.editorValue), this.options)) {
              var _this$_default;
              let firstOption = this.options.keys().next().value;
              this._default =
                null !== (_this$_default = this._default) &&
                void 0 !== _this$_default
                  ? _this$_default
                  : firstOption;
            }
            this.defaultSource = "editor";
          }
          this.setValue(this.initialValue, { silent: !0 });
        }
        this.postInit(), Mavo.hooks.run("primitive-init-end", this);
      }
      get initialValue() {
        let ret;
        let keepTemplateValue =
          !this.template ||
          this.template.templateValue != this.templateValue ||
          "edit" == this.modes;
        return (
          (ret =
            void 0 === this.default && keepTemplateValue
              ? this.templateValue
              : this.default),
          void 0 === ret && (ret = this.emptyValue),
          ret
        );
      }
      get editorValue() {
        let editor = this.editor || this.originalEditor;
        if (editor) {
          if (_.isFormControl(editor))
            return _.getValue(editor, { datatype: this.datatype });
          let output = $(
            Mavo.selectors.output + ", " + Mavo.selectors.formControl,
            editor
          );
          if (output) return _.getValue(output);
        }
      }
      set editorValue(value) {
        if (this.config.setEditorValue && "boolean" !== this.datatype)
          return this.config.setEditorValue.call(this, value);
        if (this.editor)
          if (_.isFormControl(this.editor)) {
            if (this.editor.matches("select")) {
              var _find;
              let text =
                null ===
                  (_find = [...this.editor.options].find((o) =>
                    Mavo.toArray(value)
                      .map((v) => v.toString())
                      .includes(o.value)
                  )) || void 0 === _find
                  ? void 0
                  : _find.textContent;
              void 0 === text
                ? $.create("option", {
                    className: "mv-volatile",
                    textContent: value,
                    inside: this.editor,
                    selected: !0,
                    disabled: !0,
                  })
                : $$(".mv-volatile", this.editor).forEach((o) => o.remove());
            }
            _.setValue(this.editor, value, { config: this.editorDefaults });
          } else {
            var output = $(
              Mavo.selectors.output + ", " + Mavo.selectors.formControl,
              this.editor
            );
            output && _.setValue(output, value);
          }
      }
      destroy() {
        var _this$originalEditorO;
        super.destroy(),
          null === (_this$originalEditorO = this.originalEditorObserver) ||
          void 0 === _this$originalEditorO
            ? void 0
            : _this$originalEditorO.destroy();
      }
      isDataNull(o) {
        return (
          super.isDataNull(o) || null === this._value || void 0 === this._value
        );
      }
      getData(o = {}) {
        var env = { context: this, options: o };
        return this.isDataNull(o)
          ? null
          : ((env.data = this.value),
            "" !== env.data ||
              (this.templateValue &&
                this.initialValue === this.templateValue) ||
              (env.data = null),
            this.inPath.length &&
              (env.data = Mavo.subset(this.data, this.inPath, env.data)),
            Mavo.hooks.run("node-getdata-end", env),
            env.data);
      }
      get pausedObserver() {
        var _this$observerPauses;
        return (
          0 <
          (null === (_this$observerPauses = this.observerPauses) ||
          void 0 === _this$observerPauses
            ? void 0
            : _this$observerPauses.length)
        );
      }
      pauseObserver() {
        Mavo.observers.flush(),
          (this.observerPauses = this.observerPauses || []),
          this.observerPauses.push(1);
      }
      resumeObserver() {
        var _this$observerPauses2, _this$observerPauses3;
        Mavo.observers.flush(),
          null === (_this$observerPauses2 = this.observerPauses) ||
          void 0 === _this$observerPauses2 ||
          null === (_this$observerPauses3 = _this$observerPauses2.pop) ||
          void 0 === _this$observerPauses3
            ? void 0
            : _this$observerPauses3.call(_this$observerPauses2);
      }
      save() {
        (this.savedValue = this.value), (this.unsavedChanges = !1);
      }
      initEdit() {
        !this.editor &&
          this.originalEditor &&
          (this.editor = this.originalEditor.cloneNode(!0)),
          this.editorUpdated(),
          (this.initEdit = null);
      }
      updateOptions() {
        let options = Mavo.options(this.element.getAttribute("mv-options"), {
          map: !0,
        });
        for (let [key, value] of options) !0 === value && options.set(key, key);
        this.options = options;
      }
      generateDefaultEditor() {
        if (this.element.hasAttribute("mv-options")) {
          this.options || this.updateOptions();
          let contents = [...this.options].map(([value, textContent]) => ({
            tag: "option",
            value,
            textContent,
          }));
          this.editor = $.create("select", {
            className: "mv-editor mv-options-select",
            contents,
          });
        } else {
          let editor = this.config.editor;
          (editor && "boolean" != this.datatype) ||
            (editor =
              Mavo.Elements.defaultConfig[this.datatype || "string"].editor),
            (this.editor = $.create(
              "function" === $.type(editor) ? editor.call(this) : editor
            ));
        }
        this.editorValue = this.value;
      }
      updateEditType() {
        var _this$element$getAttr, _this$element$getAttr2;
        let ret =
          null !==
            (_this$element$getAttr =
              null ===
                (_this$element$getAttr2 =
                  this.element.getAttribute("mv-edit-type")) ||
              void 0 === _this$element$getAttr2
                ? void 0
                : _this$element$getAttr2.trim()) &&
          void 0 !== _this$element$getAttr
            ? _this$element$getAttr
            : "auto";
        if ("auto" === ret) {
          var _this$config$editType;
          ret =
            null !== (_this$config$editType = this.config.editType) &&
            void 0 !== _this$config$editType
              ? _this$config$editType
              : "auto";
        }
        return (
          "auto" === ret && (ret = this.attribute ? "popup" : "inline"),
          (this.editType = ret)
        );
      }
      editorUpdated() {
        this.editor || this.generateDefaultEditor(),
          $.bind(this.editor, {
            "input change": () => {
              this.value = this.editorValue;
            },
            "mv-change": (evt) => {
              "output" === evt.property &&
                (evt.stopPropagation(), $.fire(this.editor, "input"));
            },
          });
        let multiline = this.editor.matches("textarea");
        multiline ||
          this.editor.addEventListener("focus", () => {
            var _this$editor$select, _this$editor;
            null ===
              (_this$editor$select = (_this$editor = this.editor).select) ||
            void 0 === _this$editor$select
              ? void 0
              : _this$editor$select.call(_this$editor);
          });
        for (let name of Mavo.getAttributes(this.element, /^mv-editor-/)) {
          let value = this.element.getAttribute(name);
          (name = name.replace(/^mv-editor-/, "")),
            this.editor.setAttribute(name, value);
        }
        "placeholder" in this.editor &&
          !this.editor.placeholder &&
          (this.editor.placeholder =
            "number" === this.editor.type
              ? this.editor.min || 0
              : "(".concat(this.label, ")")),
          this.editor.matches("select") || delete this.options;
      }
      originalEditorUpdated({ force } = {}) {
        var _this$editor2;
        let previousOriginalEditor = this.originalEditor;
        let selector = this.element.getAttribute("mv-editor");
        try {
          this.originalEditor = $(selector);
        } catch (e) {
          this.originalEditor = null;
        }
        if (force || previousOriginalEditor !== this.originalEditor) {
          if (!this.originalEditor)
            this.editor && (this.generateDefaultEditor(), this.editorUpdated());
          else if (
            (this.editor &&
              ((this.editor = this.originalEditor.cloneNode(!0)),
              this.setValue(this.value, { force: !0, silent: !0 })),
            "editor" == this.defaultSource &&
              (this.default = this.originalEditor.value),
            !this.template ||
              this.originalEditor !== this.template.originalEditor)
          ) {
            var _this$originalEditorO2;
            null === (_this$originalEditorO2 = this.originalEditorObserver) ||
            void 0 === _this$originalEditorO2
              ? void 0
              : _this$originalEditorO2.destroy(),
              (this.originalEditorObserver = new Mavo.Observer(
                this.originalEditor,
                "all",
                () => {
                  let nodes = [this];
                  if (this.copies)
                    for (let n of this.copies)
                      n.originalEditor === this.originalEditor && nodes.push(n);
                  for (let primitive of nodes)
                    primitive.originalEditorUpdated({ force: !0 }),
                      primitive.setValue(primitive.value, {
                        force: !0,
                        silent: !0,
                      });
                }
              ));
          }
          let editor =
            null !== (_this$editor2 = this.editor) && void 0 !== _this$editor2
              ? _this$editor2
              : this.originalEditor;
          if (
            null !== editor &&
            void 0 !== editor &&
            editor.matches("select:not(.mv-options-select")
          ) {
            let obj = [...editor.options]
              .filter((o) => !o.classList.contains("mv-volatile"))
              .map((o) => [o.value, o.textContent]);
            this.options = new Map(obj);
          }
        }
      }
      edit(o = {}) {
        var _this$editor3;
        let wasEditing = this.editing;
        if (!1 === super.edit(o)) return !1;
        if (!o.force && wasEditing && !this.initEdit) return !0;
        if ("object" === $.type(this._value)) return !1;
        if (
          (wasEditing ||
            (-1 === this.element.tabIndex &&
              Mavo.revocably.setAttribute(this.element, "tabindex", "0"),
            $.bind(this.element, "click.mavo:edit", (evt) => {
              "edit" !== this.mode ||
                (evt.target.closest("summary, a") && evt.preventDefault());
            })),
          this.config.edit)
        )
          this.config.edit.call(this), (this.initEdit = null);
        else {
          if (
            (this.pauseObserver(),
            this.initEdit && this.initEdit(),
            this.editor.classList.toggle(
              "mv-editor",
              "popup" !== this.editType
            ),
            "popup" === this.editType)
          ) {
            this.popup || (this.popup = new Mavo.UI.Popup(this)),
              this.popup.prepare();
            let events = ["mousedown", "focus", "dragover", "dragenter"]
              .map((e) => e + ".mavo:edit")
              .join(" ");
            $.bind(this.element, events, () => this.popup.show());
          } else
            "inline" === this.editType &&
              (this.editor.isConnected ||
                ((this.editorValue = this.value),
                this.config.hasChildren
                  ? (this.element.textContent = "")
                  : _.setText(this.element, ""),
                !this.contentExpression &&
                  (this.contentExpression = Mavo.DOMExpression.search(
                    this.element,
                    null
                  )),
                this.contentExpression && (this.contentExpression.active = !1),
                this.element.prepend(this.editor)),
              this.collection ||
                Mavo.revocably.restoreAttribute(this.element, "tabindex"));
          this.resumeObserver();
        }
        if (
          this.closestCollection &&
          "inline" === this.editType &&
          null !== (_this$editor3 = this.editor) &&
          void 0 !== _this$editor3 &&
          _this$editor3.matches(Mavo.selectors.textInput)
        ) {
          let multiline = this.editor.matches("textarea");
          multiline ||
            $.bind(this.editor, "paste.mavo:edit", (evt) => {
              if (this.closestCollection.editing && evt.clipboardData) {
                let text = evt.clipboardData.getData("text/plain");
                const CRLF = /\r?\n|\r/;
                if (CRLF.test(text)) {
                  var _closestItem;
                  evt.preventDefault();
                  let lines = text.split(CRLF);
                  this.editor.setRangeText(lines[0]),
                    $.fire(this.editor, "input");
                  let collection = this.closestCollection;
                  let index =
                    (null === (_closestItem = closestItem) ||
                    void 0 === _closestItem
                      ? void 0
                      : _closestItem.index) || 0;
                  for (let i = 1; i < lines.length; i++) {
                    this.closestItem;
                    let next = collection.add(void 0, index + i);
                    collection.editItem(next);
                    let copy = this.getCousin(i);
                    copy.render(lines[i]);
                  }
                }
              }
            }),
            $.bind(this.editor, "keydown.mavo:edit", (evt) => {
              if (this.closestCollection.editing)
                if ("Enter" == evt.key && (evt.shiftKey || !multiline)) {
                  if (this.bottomUp) return;
                  let closestItem = this.closestItem;
                  let next = this.closestCollection.add(
                    void 0,
                    (null === closestItem || void 0 === closestItem
                      ? void 0
                      : closestItem.index) + 1
                  );
                  this.closestCollection.editItem(next);
                  let copy = this.getCousin(1);
                  requestAnimationFrame(() => {
                    copy.edit(), copy.editor.focus();
                  }),
                    multiline && evt.preventDefault();
                } else if ("Backspace" == evt.key && this.empty) {
                  let sibling = this.getCousin(1) || this.getCousin(-1);
                  this.closestCollection.delete(this.closestItem),
                    sibling && (sibling.edit(), sibling.editor.focus()),
                    evt.preventDefault();
                }
            });
        }
        return !0;
      }
      done(o) {
        var _this$editor4;
        if (!1 === super.done(o)) return !1;
        if (
          ($.unbind(this.element, ".mavo:edit"),
          this.pauseObserver(),
          this.config.done)
        )
          return void this.config.done.call(this);
        if ("popup" === this.editType) {
          var _this$popup;
          null === (_this$popup = this.popup) || void 0 === _this$popup
            ? void 0
            : _this$popup.close();
        } else
          "inline" === this.editType &&
            this.editor &&
            (this.editor.remove(),
            this.contentExpression &&
              ((this.contentExpression.active = !0),
              this.contentExpression.update({ force: !0 })),
            this.setValue(this.editorValue, { silent: !0, force: !0 }));
        null !== (_this$editor4 = this.editor) &&
          void 0 !== _this$editor4 &&
          _this$editor4.matches("select") &&
          $$(".mv-volatile", this.editor).forEach((o) => {
            o.selected || o.remove();
          }),
          this.resumeObserver(),
          this.collection ||
            Mavo.revocably.restoreAttribute(this.element, "tabindex");
      }
      dataRender(data, { live, root } = {}) {
        var previousValue = this._value;
        return (
          "object" === $.type(data) &&
            (Symbol.toPrimitive in data
              ? (data = data[Symbol.toPrimitive]("default"))
              : this.editing && this.done()),
          void 0 === data
            ? !this.modes &&
              this.value === this.templateValue &&
              (this.value = this.closestCollection
                ? this.default
                : this.templateValue)
            : (this.value = data),
          this._value !== previousValue
        );
      }
      find(property, o = {}) {
        if (this.property == property && o.exclude !== this) return this;
      }
      getValue() {
        return this.editing && this.editor && this.editor !== this.element
          ? this.editorValue
          : _.getValue(this.element, {
              config: this.config,
              attribute: this.attribute,
              datatype: this.datatype,
            });
      }
      setValue(value, o = {}) {
        void 0 === value && (value = null);
        let oldDatatype = this.datatype;
        if (
          (this.datatype ||
            ("number" != typeof value && "boolean" != typeof value) ||
            (this.datatype = typeof value),
          (value = _.safeCast(value, this.datatype)),
          !o.force && value === this._value && oldDatatype == this.datatype)
        )
          return value;
        if (
          (this.pauseObserver(),
          this.editor &&
            this.editorValue != value &&
            (this.editorValue = value),
          "popup" == this.editType ||
            !this.editor ||
            (this.editor !== document.activeElement &&
              !this.element.contains(this.editor)))
        )
          if (this.config.setValue)
            this.config.setValue.call(this, this.element, value);
          else if (!o.dataOnly) {
            let presentational;
            this.options && (presentational = this.options.get(value)),
              _.setValue(this.element, value, {
                config: this.config,
                attribute: this.attribute,
                datatype: this.datatype,
                presentational,
                node: this,
              });
          }
        return (
          (this.empty = !value && 0 !== value),
          (this._value = value),
          this.liveData.update(),
          o.silent ||
            (this.saved &&
              (this.unsavedChanges = this.mavo.unsavedChanges = !0),
            this.dataChanged("propertychange", { value })),
          this.resumeObserver(),
          value
        );
      }
      dataChanged(action = "propertychange", o) {
        return super.dataChanged(action, o);
      }
      async upload(file, name = file.name) {
        if (!this.mavo.uploadBackend || !self.FileReader) return;
        var tempURL = URL.createObjectURL(file);
        this.pauseObserver(),
          this.element.setAttribute(this.attribute, tempURL),
          this.resumeObserver();
        var path = this.element.getAttribute("mv-upload-path") || "";
        var relative = path + "/" + name;
        let url = await this.mavo.upload(file, relative);
        var base = Mavo.getClosestAttribute(this.element, "mv-upload-url");
        base && (url = new URL(relative, new URL(base, location)) + ""),
          (this.value = url),
          this.element.matches("a") ||
            (this.pauseObserver(),
            this.element.setAttribute(this.attribute, tempURL),
            this.resumeObserver());
      }
      createUploadPopup(type, kind = "file", ext) {
        var env = {
          context: this,
          type,
          kind,
          ext,
          mainInput: $.create("input", {
            type: "url",
            placeholder: "http://example.com/".concat(kind, ".").concat(ext),
            className: "mv-output",
            "aria-label": "URL to ".concat(kind),
          }),
        };
        if (this.mavo.uploadBackend && self.FileReader) {
          var checkType = (file) =>
            file && (!type || 0 === file.type.indexOf(type.replace("*", "")));
          return (
            (env.events = {
              paste: (evt) => {
                var item = Array.from(evt.clipboardData.items).find(
                  (item) => "file" === item.kind
                );
                var ext =
                  null === item || void 0 === item
                    ? void 0
                    : item.type.split("/")[1];
                if (item && checkType(item)) {
                  var defaultName =
                    evt.clipboardData.getData("text") ||
                    "pasted-"
                      .concat(kind, "-")
                      .concat(Date.now(), ".")
                      .concat(ext);
                  var name = prompt(this.mavo._("filename"), defaultName);
                  "" === name && (name = defaultName),
                    null !== name &&
                      (this.upload(item.getAsFile(), name, type),
                      evt.preventDefault());
                }
              },
              "drag dragstart dragend dragover dragenter dragleave drop": (
                evt
              ) => {
                evt.preventDefault(), evt.stopPropagation();
              },
              "dragover dragenter": () => {
                env.popup.classList.add("mv-dragover"),
                  this.element.classList.add("mv-dragover");
              },
              "dragleave dragend drop": () => {
                env.popup.classList.remove("mv-dragover"),
                  this.element.classList.remove("mv-dragover");
              },
              drop: (evt) => {
                var file = evt.dataTransfer.files[0];
                file && checkType(file) && this.upload(file);
              },
            }),
            Mavo.hooks.run("primitive-createuploadpopup-beforecreate", env),
            (env.popup = $.create({
              className: "mv-upload-popup",
              contents: [
                env.mainInput,
                {
                  tag: "input",
                  type: "file",
                  "aria-label": "Upload ".concat(kind),
                  accept: type,
                  events: {
                    change: (evt) => {
                      var file = evt.target.files[0];
                      file && checkType(file) && this.upload(file);
                    },
                  },
                },
                {
                  className: "mv-tip",
                  innerHTML:
                    "<strong>Tip:</strong> You can also drag & drop or paste!",
                },
              ],
              events: env.events,
            })),
            $.bind(this.element, env.events),
            Mavo.hooks.run("primitive-createuploadpopup-beforereturn", env),
            env.popup
          );
        }
        return env.mainInput;
      }
      static getText(element) {
        var node =
          element.nodeType === Node.TEXT_NODE ? element : element.firstChild;
        return (null === node || void 0 === node ? void 0 : node.nodeType) ===
          Node.TEXT_NODE
          ? node.nodeValue
          : "";
      }
      static setText(element, text) {
        var node =
          element.nodeType === Node.TEXT_NODE ? element : element.firstChild;
        (null === node || void 0 === node ? void 0 : node.nodeType) ===
        Node.TEXT_NODE
          ? (node.nodeValue = text)
          : element.prepend(text);
      }
      static getValueAttribute(
        element,
        config = Mavo.Elements.search(element)
      ) {
        var ret = element.getAttribute("mv-attribute") || config.attribute;
        return (ret && "null" !== ret && "none" !== ret) || (ret = null), ret;
      }
      static safeCast(value, datatype) {
        var cast = _.cast(value, datatype);
        return "boolean" == datatype
          ? !!value && (!!("true" === value || 0 < value) || value)
          : "number" == datatype
          ? /^[-+]?[0-9.e]+$/i.test(value + "")
            ? cast
            : value
          : null === value || void 0 === value
          ? value
          : cast;
      }
      static cast(value, datatype) {
        return "number" === datatype
          ? +value
          : "boolean" === datatype
          ? !!value
          : "string" === datatype
          ? value + ""
          : value;
      }
      static getValue(element, { config, attribute, datatype } = {}) {
        if (
          (config || (config = _.getConfig(element, attribute)),
          (attribute = config.attribute),
          (datatype = config.datatype),
          config.getValue && attribute == config.attribute)
        )
          return config.getValue(element);
        var ret;
        return (
          (ret =
            attribute in element &&
            Mavo.usePropertyInsteadOfAttribute(element, attribute)
              ? element[attribute]
              : attribute
              ? element.getAttribute(attribute)
              : element.getAttribute("content") || _.getText(element) || null),
          _.safeCast(ret, datatype)
        );
      }
      static getConfig(element, attribute, datatype) {
        let editAs = element.getAttribute("mv-edit-as");
        if (editAs && editAs in Mavo.Elements) return Mavo.Elements[editAs];
        void 0 === attribute &&
          (attribute = element.getAttribute("mv-attribute") || void 0),
          ("null" == attribute || "none" == attribute) && (attribute = null);
        var isAttributeDefault =
          void 0 === attribute || attribute == _.getValueAttribute(element);
        !datatype &&
          isAttributeDefault &&
          (datatype = element.getAttribute("datatype") || void 0);
        var config = Mavo.Elements.search(element, attribute, datatype);
        return (
          (config = Object.assign({}, config)),
          void 0 === config.attribute && (config.attribute = attribute || null),
          void 0 === config.datatype && (config.datatype = datatype),
          config
        );
      }
      static async setValue(element, value, o = {}) {
        var _$pending$get;
        if (
          (null !== (_$pending$get = _.pending.get(element)) &&
            void 0 !== _$pending$get &&
            delete _$pending$get[o.attribute],
          "promise" === $.type(value))
        ) {
          var _$pending$get2;
          _.pending.has(element) || _.pending.set(element, {});
          let pending = value;
          _.pending.get(element)[o.attribute] = pending;
          try {
            value = await pending;
          } catch (e) {
            value = e;
          }
          if (_.pending.get(element)[o.attribute] !== pending) return;
          null !== (_$pending$get2 = _.pending.get(element)) &&
            void 0 !== _$pending$get2 &&
            delete _$pending$get2[o.attribute];
        }
        if (
          1 === element.nodeType &&
          (o.config || (o.config = _.getConfig(element, o.attribute)),
          (o.attribute =
            void 0 === o.attribute ? o.config.attribute : o.attribute),
          (o.datatype = void 0 === o.datatype ? o.config.datatype : o.datatype),
          o.config.setValue && o.attribute == o.config.attribute)
        )
          return o.config.setValue(element, value, o.attribute);
        if ((null !== value || o.datatype || (value = ""), o.attribute)) {
          if (
            o.attribute in element &&
            Mavo.usePropertyInsteadOfAttribute(element, o.attribute) &&
            element[o.attribute] !== value
          )
            try {
              element[o.attribute];
              element[o.attribute] = value;
            } catch (e) {}
          "boolean" == o.datatype
            ? value != element.hasAttribute(o.attribute) &&
              $.toggleAttribute(element, o.attribute, value, value)
            : element.getAttribute(o.attribute) != value &&
              element.setAttribute(o.attribute, value);
        } else {
          var _o$presentational;
          var presentational =
            null !== (_o$presentational = o.presentational) &&
            void 0 !== _o$presentational
              ? _o$presentational
              : _.format(value, o);
          o.node && !o.config.hasChildren
            ? _.setText(element, presentational)
            : (element.textContent = presentational),
            presentational !== value &&
              element.setAttribute &&
              element.setAttribute("content", value);
        }
      }
      static format(value, o = {}) {
        if ("number" === $.type(value) || "number" == o.datatype) {
          var _o$element;
          if (null === value) return "";
          var skipNumberFormatting =
            o.attribute ||
            (null === (_o$element = o.element) || void 0 === _o$element
              ? void 0
              : _o$element.matches("style, pre"));
          if (!skipNumberFormatting) return _.formatNumber(value);
        }
        return Array.isArray(value)
          ? value.map(_.format).join(", ")
          : "object" === $.type(value)
          ? Mavo.toJSON(value)
          : value;
      }
      static isFormControl(element) {
        return (
          element.matches(Mavo.selectors.formControl) ||
          element.matches('[mv-edit-as="formControl"]')
        );
      }
    });
    $.Class(_, {
      lazy: {
        emptyValue: function () {
          switch (this.datatype) {
            case "boolean":
              return !1;
            case "number":
              return 0;
          }
          return "";
        },
        editorDefaults: function () {
          return this.editor && _.getConfig(this.editor);
        },
        editType: function () {
          return this.updateEditType();
        },
      },
      live: {
        editor: function (value) {
          var _this$_editor;
          this._editor === value ||
            (null === (_this$_editor = this._editor) || void 0 === _this$_editor
              ? void 0
              : _this$_editor.replaceWith(value),
            (this._editor = value),
            "editor" === this.defaultSource &&
              (this.default = this.editorValue),
            this.editorUpdated());
        },
        default: function (value) {
          this.value == this._default && (this.value = value);
        },
        value: function (value) {
          return this.setValue(value);
        },
        datatype: function (value) {
          value !== this._datatype &&
            ("boolean" == value &&
              !this.attribute &&
              (this.attribute = Mavo.Elements.defaultConfig.boolean.attribute),
            $.toggleAttribute(
              this.element,
              "datatype",
              value,
              value && "string" !== value
            ));
        },
        empty: function (value) {
          let hide =
            value &&
            !this.modes &&
            (!this.attribute || !$(Mavo.selectors.property, this.element)) &&
            ("boolean" !== this.datatype ||
              this.attribute === Mavo.Elements.defaultConfig.boolean.attribute);
          this.element.classList.toggle("mv-empty", !!hide);
        },
      },
      static: {
        all: new WeakMap(),
        pending: new Map(),
        lazy: {
          formatNumber: () => {
            var numberFormat = new Intl.NumberFormat(Mavo.locale, {
              maximumFractionDigits: 2,
            });
            return function (value) {
              return value === 1 / 0 || value === -Infinity
                ? 0 > value
                  ? "-\u221E"
                  : "\u221E"
                : numberFormat.format(value);
            };
          },
        },
      },
    }),
      Mavo.observe(
        { id: "primitive" },
        function ({ node, type, attribute, record, element }) {
          if (
            !(
              node instanceof Mavo.Primitive &&
              node.config &&
              !node.pausedObserver
            )
          ) {
            var _parentNode$config;
            let parentNode = Mavo.Node.getClosest(element.parentNode, !0);
            null !== parentNode &&
              void 0 !== parentNode &&
              null !== (_parentNode$config = parentNode.config) &&
              void 0 !== _parentNode$config &&
              _parentNode$config.subtree &&
              (parentNode.value = parentNode.getValue());
          } else if ("mv-default" === attribute && !node.defaultExpression)
            node.default = element.getAttribute("mv-default");
          else if ("aria-label" === attribute)
            (node.label = element.getAttribute("aria-label")),
              Mavo.in("placeholder", node.editor) &&
                (node.editor.placeholder =
                  "number" === node.editor.type
                    ? node.editor.min || 0
                    : "(".concat(node.label, ")"));
          else if ("mv-editor" === attribute) node.originalEditorUpdated();
          else if ("mv-edit-type" === attribute) {
            let editing = node.editing;
            editing && node.done({ force: !0 }),
              node.updateEditType(),
              editing && node.edit({ force: !0 });
          } else if ("mv-options" === attribute)
            node.updateOptions(), node.editor && node.generateDefaultEditor();
          else if (attribute && 0 === attribute.indexOf("mv-editor-")) {
            var _node$editor;
            null === (_node$editor = node.editor) || void 0 === _node$editor
              ? void 0
              : _node$editor.setAttribute(
                  attribute.slice(10),
                  element.getAttribute(attribute)
                );
          } else if (!1 !== node.config.observer) {
            let update = node.config.subtree;
            if (!update && (!node.editing || "edit" === node.modes)) {
              var _node$config$observed;
              update =
                attribute === node.attribute ||
                (null ===
                  (_node$config$observed = node.config.observedAttributes) ||
                void 0 === _node$config$observed
                  ? void 0
                  : _node$config$observed.includes(attribute)) ||
                ("characterData" === type && !node.attribute);
            }
            update && (node.value = node.getValue());
          }
        }
      ),
      await $.ready();
    let inputTypes = [
      "checkbox",
      "color",
      "date",
      "datetime-local",
      "email",
      "file",
      "month",
      "number",
      "password",
      "radio",
      "range",
      "search",
      "submit",
      "tel",
      "text",
      "time",
      "url",
      "week",
      "datetime",
    ];
    let oldMvEdit = Mavo.attributeStartsWith("mv-edit-")
      .filter(
        (a) =>
          ("mv-edit-type" !== a.name || inputTypes.includes(a.value)) &&
          !["mv-edit-as"].includes(a.name)
      )
      .map((a) => a.name);
    Mavo.attributeStartsWith("mv-editor-");
    if (
      ($("[mv-edit]") && oldMvEdit.unshift("mv-edit"), 0 < oldMvEdit.length)
    ) {
      let oldMvEditUnique = [...new Set(oldMvEdit)];
      for (let name of oldMvEditUnique) {
        let newName = name.replace(/^mv-edit(-|$)/, "mv-editor$1");
        let elements = $$("[".concat(name, "]"));
        console.log(
          "You are using attribute "
            .concat(name, " on ")
            .concat(
              elements.length,
              " element(s). This syntax is deprecated and will be removed in the next version of Mavo. Please use "
            )
            .concat(newName, " instead.")
        );
        for (let element of elements)
          Mavo.setAttributeShy(element, newName, element.getAttribute(name));
      }
    }
  })(Bliss, Bliss.$),
  (function ($) {
    Mavo.UI.Popup = $.Class({
      constructor: function (primitive) {
        (this.primitive = primitive),
          (this.position = () => {
            var bounds = this.primitive.element.getBoundingClientRect();
            var x = bounds.left;
            var y = bounds.bottom;
            var pointDown = !1;
            if (
              (this.element.offsetHeight &&
                (this.height =
                  this.element.getBoundingClientRect().height || this.height),
              this.height + y + 20 > innerHeight)
            )
              if (20 < bounds.top - this.height) {
                var pointDown = !0;
                y = bounds.top - this.height - 20;
              } else y = innerHeight - this.height - 20;
            this.element.classList.toggle("mv-point-down", pointDown),
              $.style(this.element, {
                top: "".concat(y, "px"),
                left: "".concat(x, "px"),
              });
          }),
          (this.element = $.create("div", {
            className: "mv-popup",
            hidden: !0,
            contents: {
              tag: "fieldset",
              contents: [
                { tag: "legend", textContent: this.primitive.label + ":" },
                this.editor,
              ],
            },
            events: {
              keyup: (evt) => {
                (13 == evt.keyCode || 27 == evt.keyCode) &&
                  (this.element.contains(document.activeElement) &&
                    this.primitive.element.focus(),
                  evt.stopPropagation(),
                  this.hide());
              },
              transitionend: this.position,
            },
          })),
          this.editor.matches("select") &&
            (this.editor.size = Math.min(10, this.editor.children.length)),
          (this.hideCallback = (evt) => {
            this.element.contains(evt.target) ||
              this.primitive.element.contains(evt.target) ||
              this.hide();
          });
      },
      show: function () {
        $.unbind([this.primitive.element, this.element], ".mavo:showpopup"),
          (this.shown = !0),
          (this.element.style.transition = "none"),
          this.element.removeAttribute("hidden"),
          this.position(),
          this.element.setAttribute("hidden", ""),
          (this.element.style.transition = ""),
          document.body.appendChild(this.element),
          setTimeout(() => {
            this.element.removeAttribute("hidden");
          }, 100),
          $.bind(document, "focus click", this.hideCallback, !0),
          window.addEventListener("scroll", this.position, { passive: !0 });
      },
      hide: function () {
        $.unbind(document, "focus click", this.hideCallback, !0),
          window.removeEventListener("scroll", this.position, { passive: !0 }),
          this.element.setAttribute("hidden", ""),
          (this.shown = !1),
          setTimeout(() => {
            $.remove(this.element);
          }, 1e3 * parseFloat(getComputedStyle(this.element).transitionDuration) || 400);
      },
      prepare: function () {
        $.bind(this.primitive.element, {
          "click.mavo:edit": () => {
            this.show();
          },
          "keyup.mavo:edit": (evt) => {
            -1 < [13, 113].indexOf(evt.keyCode) &&
              (this.show(), this.editor.focus());
          },
        }),
          this.element.contains(this.editor) ||
            this.element.append(this.editor);
      },
      close: function () {
        this.hide(),
          $.unbind(
            this.primitive.element,
            ".mavo:edit .mavo:preedit .mavo:showpopup"
          );
      },
      proxy: { editor: "primitive" },
    });
  })(Bliss, Bliss.$),
  (function ($, $$) {
    var _Mathmax2 = Math.max;
    var _Mathmin3 = Math.min;
    var _ = (Mavo.Elements = {});
    Object.defineProperties(_, {
      register: {
        value: function (id, config) {
          if ("object" == typeof arguments[0]) {
            for (let s in arguments[0]) _.register(s, arguments[0][s]);
            return;
          }
          if (config.extend) {
            var base = _[config.extend];
            config = $.extend($.extend({}, base), config);
          }
          if (-1 < id.indexOf("@")) {
            var parts = id.split("@");
            (config.selector = config.selector || parts[0] || "*"),
              void 0 === config.attribute && (config.attribute = parts[1]);
          }
          return (
            (config.selector = config.selector || id),
            (config.id = id),
            Array.isArray(config.attribute)
              ? config.attribute.forEach((attribute) => {
                  var o = $.extend({}, config);
                  (o.attribute = attribute),
                    (_["".concat(id, "@").concat(attribute)] = o);
                })
              : (_[id] = config),
            _
          );
        },
      },
      search: {
        value: function (element, attribute, datatype) {
          var matches = _.matches(element, attribute, datatype);
          0 === matches.length &&
            datatype &&
            (matches = _.matches(element, attribute));
          var lastMatch = matches[matches.length - 1];
          if (lastMatch) return lastMatch;
          var config = $.extend({}, _.defaultConfig[datatype || "string"]);
          return (
            (config.attribute =
              void 0 === attribute ? config.attribute : attribute),
            config
          );
        },
      },
      matches: {
        value: function (element, attribute, datatype) {
          var matches = [];
          selectorloop: for (var id in _) {
            var o = _[id];
            var attributeMatches =
              (void 0 === attribute && o.default) || attribute === o.attribute;
            if (
              attributeMatches &&
              (void 0 === datatype ||
                "string" === datatype ||
                datatype === o.datatype)
            ) {
              var selector = o.selector || id;
              element.matches(selector) &&
                (!o.test || o.test(element, attribute, datatype)) &&
                matches.push(o);
            }
          }
          return matches;
        },
      },
      isSVG: { value: (e) => "http://www.w3.org/2000/svg" == e.namespaceURI },
      defaultConfig: {
        value: {
          string: { editor: { tag: "input" } },
          number: { editor: { tag: "input", type: "number" } },
          boolean: {
            attribute: "content",
            editor: { tag: "input", type: "checkbox" },
          },
        },
      },
    }),
      _.register({
        "@hidden": { datatype: "boolean" },
        "@y": { test: _.isSVG, datatype: "number" },
        "@x": { default: !0, test: _.isSVG, datatype: "number" },
        media: {
          default: !0,
          selector: "img, video, audio",
          attribute: "src",
          editor: function () {
            var kind = this.element.nodeName.toLowerCase();
            return (
              (kind = "img" == kind ? "image" : kind),
              Mavo.setAttributeShy(this.element, "mv-upload-path", kind + "s"),
              this.createUploadPopup(kind + "/*", kind, "png")
            );
          },
        },
        "a, link": { default: !0, attribute: "href" },
        "a[mv-upload-path], link[mv-upload-path]": {
          default: !0,
          attribute: "href",
          editor: function () {
            var type = this.element.getAttribute("type");
            var ext = type && !/\/\*$/.test(type) ? type.split("/")[1] : "pdf";
            return this.createUploadPopup(type, void 0, ext);
          },
        },
        "video, audio": {
          attribute: ["autoplay", "buffered", "loop"],
          datatype: "boolean",
        },
        details: { attribute: "open", datatype: "boolean" },
        "input, select, optgroup, option, button, textarea, fieldset": {
          attribute: "disabled",
          datatype: "boolean",
        },
        formControl: {
          selector: "input",
          default: !0,
          attribute: "value",
          modes: "edit",
          editType: "self",
          changeEvents: "input change",
          edit: () => {},
          done: () => {},
          init: function () {
            this._editor = this.element;
          },
        },
        select: { extend: "formControl", selector: "select", subtree: !0 },
        "select[multiple]": {
          extend: "select",
          selector: "select[multiple]",
          getValue: (element) =>
            Array.from(element.selectedOptions)
              .map((option) => option.value)
              .join(),
          setValue: (element, value) => {
            (value = Array.isArray(value) ? value : (value + "").split(/\s*,/)),
              Array.from(element.options).forEach((option) => {
                (option.selected = !1),
                  (value = value.map((v) => v + "")),
                  value.includes(option.value) && (option.selected = !0);
              });
          },
        },
        option: { attribute: null, modes: "read", default: !0 },
        textarea: {
          extend: "formControl",
          selector: "textarea",
          attribute: null,
          getValue: (element) => element.value,
          setValue: (element, value) => (element.value = value),
        },
        formNumber: {
          extend: "formControl",
          selector: "input[type=range], input[type=number]",
          datatype: "number",
          setValue: function (element, value) {
            (element.value = value), element.setAttribute("value", value);
            var attribute = value > element.value ? "max" : "min";
            isNaN(value) ||
              element.value == value ||
              Mavo.data(element, "boundObserver") ||
              (0 === Mavo.observers.find({ element, id: "oob" }).size &&
                Mavo.observe(
                  { id: "oob", element, attribute, once: !0 },
                  () => (element.value = value)
                ),
              requestAnimationFrame(() => {
                $.bind(element, "input mv-change", function handler() {
                  Mavo.unobserve({ element, id: "oob" }),
                    $.unbind(element, "input mv-change", handler);
                });
              }));
          },
          observedAttributes: ["min", "max"],
        },
        checkbox: {
          extend: "formControl",
          selector: "input[type=checkbox]",
          attribute: "checked",
          datatype: "boolean",
          changeEvents: "click",
        },
        "input[type=checkbox]": {
          attribute: "indeterminate",
          datatype: "boolean",
        },
        radio: {
          extend: "formControl",
          selector: "input[type=radio]",
          attribute: "checked",
          modes: "edit",
          getValue: (element) => {
            if (element.form) return element.form[element.name].value;
            let checked = $(
              'input[type=radio][name="'.concat(element.name, '"]:checked')
            );
            return checked && checked.value;
          },
          setValue: (element, value) => {
            if (element.form)
              return void (element.form[element.name].value = value);
            let toCheck = $(
              'input[type=radio][name="'
                .concat(element.name, '"][value="')
                .concat(value, '"]')
            );
            toCheck && (toCheck.checked = !0);
          },
          initOnce: function () {
            function radioChanged(radio) {
              radio.name;
              for (let otherRadio of $$(
                'input[type=radio][name="'.concat(radio.name, '"]')
              )) {
                let node = Mavo.Node.get(otherRadio, !0);
                node && (node.value = node.getValue());
              }
            }
            document.addEventListener("change", (evt) => {
              evt.target.matches("input[type=radio]") &&
                radioChanged(evt.target);
            }),
              Mavo.observe(
                { attribute: "value", selector: "input[type=radio]" },
                (r) => radioChanged(r.element)
              );
          },
          observedAttributes: ["value"],
        },
        counter: {
          extend: "formControl",
          selector: "button, .counter",
          attribute: "mv-clicked",
          datatype: "number",
          init: function (element) {
            "mv-clicked" === this.attribute &&
              (element.setAttribute("mv-clicked", "0"),
              element.addEventListener("click", () => {
                let clicked = +element.getAttribute("mv-clicked") || 0;
                this.value = ++clicked;
              }));
          },
        },
        meter: {
          default: !0,
          selector: "meter, progress",
          attribute: "value",
          datatype: "number",
          edit: function () {
            var _ref,
              _this$element$min,
              _ref2,
              _this$element$max,
              _ref3,
              _ref4,
              _this$element$step;
            let min =
              null !==
                (_ref =
                  null !== (_this$element$min = this.element.min) &&
                  void 0 !== _this$element$min
                    ? _this$element$min
                    : this.element.getAttribute("min")) && void 0 !== _ref
                ? _ref
                : 0;
            let max =
              null !==
                (_ref2 =
                  null !== (_this$element$max = this.element.max) &&
                  void 0 !== _this$element$max
                    ? _this$element$max
                    : this.element.getAttribute("max")) && void 0 !== _ref2
                ? _ref2
                : 1;
            (min = +min), (max = +max);
            let range = max - min;
            let step =
              null !==
                (_ref3 =
                  null !==
                    (_ref4 =
                      null !== (_this$element$step = this.element.step) &&
                      void 0 !== _this$element$step
                        ? _this$element$step
                        : this.element.getAttribute("step")) && void 0 !== _ref4
                    ? _ref4
                    : this.element.getAttribute("mv-editor-step")) &&
              void 0 !== _ref3
                ? _ref3
                : 1 < range
                ? 1
                : range / 100;
            (step = +step),
              $.bind(this.element, "mousemove.mavo:edit", (evt) => {
                var left = this.element.getBoundingClientRect().left;
                var offset = _Mathmax2(
                  0,
                  (evt.clientX - left) / this.element.offsetWidth
                );
                var newValue = min + range * offset;
                var mod = newValue % step;
                (newValue += mod > step / 2 ? step - mod : -mod),
                  (newValue = _Mathmax2(min, _Mathmin3(newValue, max))),
                  this.pauseObserver(),
                  this.element.setAttribute("value", newValue),
                  this.resumeObserver();
              }),
              $.bind(this.element, "mouseleave.mavo:edit", () => {
                this.pauseObserver(),
                  this.element.setAttribute("value", this.value),
                  this.resumeObserver();
              }),
              $.bind(this.element, "click.mavo:edit", () => {
                this.value = this.getValue();
              }),
              $.bind(this.element, "keydown.mavo:edit", (evt) => {
                if (
                  evt.target == this.element &&
                  (37 == evt.keyCode || 39 == evt.keyCode)
                ) {
                  var increment =
                    step *
                    (39 == evt.keyCode ? 1 : -1) *
                    (evt.shiftKey ? 10 : 1);
                  var newValue = this.value + increment;
                  (newValue = _Mathmax2(min, _Mathmin3(newValue, max))),
                    this.element.setAttribute("value", newValue),
                    evt.preventDefault();
                }
              });
          },
          observedAttributes: ["min", "max"],
        },
        meta: { default: !0, attribute: "content" },
        block: {
          default: !0,
          selector:
            "p, div, dt, dd, h1, h2, h3, h4, h5, h6, article, section, address, pre",
          editor: function () {
            var cs = getComputedStyle(this.element);
            var display = cs.display;
            var tag = 0 === display.indexOf("inline") ? "input" : "textarea";
            var editor = $.create(tag);
            if ("textarea" == tag) {
              var width = this.element.offsetWidth;
              width && (editor.width = width),
                (editor.style.whiteSpace =
                  { normal: "pre-wrap", nowrap: "pre" }[cs.whiteSpace] ||
                  "inherit");
            }
            return editor;
          },
          setEditorValue: function (value) {
            this.datatype && "string" != this.datatype && (value += "");
            var cs = getComputedStyle(this.element);
            return (
              (value = value || ""),
              -1 < ["normal", "nowrap"].indexOf(cs.whiteSpace) &&
                (value = value.replace(/\r?\n/g, " ")),
              -1 < ["normal", "nowrap", "pre-line"].indexOf(cs.whiteSpace) &&
                (value = value
                  .replace(/^[ \t]+|[ \t]+$/gm, "")
                  .replace(/[ \t]+/g, " ")),
              (this.editor.value = value),
              !0
            );
          },
        },
        time: {
          attribute: "datetime",
          default: !0,
          init: function () {
            if (!this.fromTemplate("dateType")) {
              var dateFormat = Mavo.DOMExpression.search(this.element, null);
              var datetime =
                this.element.getAttribute("datetime") || "YYYY-MM-DD";
              let editorType = this.element.getAttribute("mv-editor-type");
              if (editorType in this.config.dateTypes)
                this.dateType = editorType;
              else
                for (let type in this.config.dateTypes)
                  if (this.config.dateTypes[type].test(datetime)) {
                    this.dateType = type;
                    break;
                  }
              if (!dateFormat) {
                var _this$config$defaultF,
                  _this$config$defaultF2,
                  _this$config$defaultF3;
                (this.element.textContent =
                  null !==
                    (_this$config$defaultF =
                      null ===
                        (_this$config$defaultF2 = (_this$config$defaultF3 =
                          this.config.defaultFormats)[this.dateType]) ||
                      void 0 === _this$config$defaultF2
                        ? void 0
                        : _this$config$defaultF2.call(
                            _this$config$defaultF3,
                            this.property
                          )) && void 0 !== _this$config$defaultF
                    ? _this$config$defaultF
                    : ""),
                  this.mavo.expressions.extract(this.element, null),
                  (dateFormat = Mavo.DOMExpression.search(
                    this.element,
                    null
                  )) &&
                    this.mavo.treeBuilt.then(() => {
                      dateFormat.update();
                    });
              }
            }
          },
          dateTypes: {
            month: /^[Y\d]{4}-[M\d]{2}$/i,
            time: /^[H\d]{2}:[M\d]{2}/i,
            "datetime-local": /^[Y\d]{4}-[M\d]{2}-[D\d]{2} [H\d]{2}:[Mi\d]{2}/i,
            date: /^[Y\d]{4}-[M\d]{2}-[D\d]{2}$/i,
          },
          defaultFormats: {
            date: (name) => "[readable_datetime(".concat(name, ', "days")]'),
            month: (name) =>
              "[readable_datetime(".concat(name, ", 'months')] "),
            time: (name) => "[time(".concat(name, ")]"),
            time: (name) =>
              "[hour("
                .concat(name, ", '00')]:[minute(")
                .concat(name, ", '00')]"),
            "datetime-local": function (name) {
              return this.date(name) + " " + this.time(name);
            },
          },
          editor: function () {
            return { tag: "input", type: this.dateType };
          },
        },
        "circle@r": { default: !0, datatype: "number" },
        circle: { attribute: ["cx", "cy"], datatype: "number" },
        text: { default: !0, editType: "popup" },
        ".mv-toggle": {
          default: !0,
          attribute: "aria-checked",
          datatype: "boolean",
          edit: function () {
            Mavo.revocably.setAttribute(this.element, "role", "checkbox"),
              $.bind(
                this.element,
                "click.mavo:edit keyup.mavo:edit keydown.mavo:edit",
                (evt) => {
                  ("click" == evt.type ||
                    " " == evt.key ||
                    "Enter" == evt.key) &&
                    ("keydown" != evt.type && (this.value = !this.value),
                    evt.preventDefault(),
                    evt.stopPropagation());
                }
              );
          },
          done: function () {
            Mavo.revocably.restoreAttribute(this.element, "role"),
              $.unbind(this.element, ".mavo:edit");
          },
        },
      });
  })(Bliss, Bliss.$),
  (function ($, $$) {
    Mavo.attributes.push(
      "mv-list",
      "mv-list-item",
      "mv-order",
      "mv-accepts",
      "mv-initial-items"
    );
    var _ = (Mavo.Collection = class Collection extends Mavo.Node {
      constructor(element, mavo, o) {
        if (
          (super(element, mavo, o),
          (this.firstItemElement = this.templateElement =
            $(Mavo.selectors.multiple, this.element)),
          (this.children = []),
          (this.liveData = new Mavo.Data(this, [])),
          (this.marker = document.createComment("mv-marker")),
          Mavo.data(this.marker, "collection", this),
          this.templateElement.after(this.marker),
          (this.addButton = this.createAddButton()),
          this.templateElement.hasAttribute("mv-like") &&
            Mavo.warn(
              "@mv-like is deprecated and will be removed in the next version of Mavo"
            ),
          !this.fromTemplate("templateElement", "accepts", "initialItems"))
        ) {
          var _this$accepts;
          (this.accepts = this.element.getAttribute("mv-accepts")),
            (this.accepts = new Set(
              null === (_this$accepts = this.accepts) ||
              void 0 === _this$accepts
                ? void 0
                : _this$accepts.split(/\s+/)
            )),
            (this.initialItems = +(
              this.element.getAttribute("mv-initial-items") || 1
            )),
            (this.templateElement = this.templateElement.cloneNode(!0));
        }
        this.initializeData(),
          this.postInit(),
          Mavo.hooks.run("collection-init-end", this);
      }
      initializeData() {
        let item = this.add(this.firstItemElement, void 0, { silent: !0 });
        if (0 === this.initialItems)
          item
            ? this.delete(item, { silent: !0 })
            : this.firstItemElement.remove();
        else if (1 < this.initialItems)
          for (let i = 1; i < this.initialItems; i++) this.add();
      }
      createAddButton() {
        var selector = 'button[class~="mv-add-'.concat(this.property, '"]');
        var group = this.parentGroup.element;
        var button = $$(selector, group).filter(
          (button) =>
            !this.element.contains(button) && !Mavo.data(button, "collection")
        )[0];
        return (
          button
            ? (button.compareDocumentPosition(this.marker) &
                Node.DOCUMENT_POSITION_FOLLOWING &&
                Mavo.setAttributeShy(this.templateElement, "mv-order", "desc"),
              Mavo.revocably.remove(button))
            : (button = $.create("button", {
                type: "button",
                className: "mv-ui",
                textContent: this.mavo._("add-item", this),
              })),
          button.classList.add("mv-add", "mv-add-".concat(this.property)),
          Mavo.data(button, "collection", this),
          Mavo.setAttributeShy(
            button,
            "mv-action",
            "add(".concat(this.property, ")")
          ),
          button
        );
      }
      get length() {
        return this.children.length;
      }
      getData(o = {}) {
        var env = { context: this, options: o };
        return (
          (env.data = this.children
            .map((item) => item.getData(env.options))
            .filter((itemData) => null !== Mavo.value(itemData))),
          (env.data = Mavo.subset(this.data, this.inPath, env.data)),
          Mavo.hooks.run("node-getdata-end", env),
          env.data
        );
      }
      createItem(element) {
        var _this$template;
        element || (element = this.templateElement.cloneNode(!0));
        var template =
          this.itemTemplate ||
          (null === (_this$template = this.template) ||
          void 0 === _this$template
            ? void 0
            : _this$template.itemTemplate) ||
          null;
        var item = Mavo.Node.create(element, this.mavo, {
          collection: this,
          template,
          property: this.property,
          type: this.type,
        });
        return (
          this.itemTemplate || (this.itemTemplate = template || item), item
        );
      }
      add(item, index, o = {}) {
        var _this$children$index$, _this$children, _this$children$index;
        if (
          ((item =
            item instanceof Node
              ? Mavo.Node.get(item) || this.createItem(item)
              : item || this.createItem()),
          item.collection != this)
        ) {
          item.collection &&
            (item.collection.splice({ remove: item }),
            item.collection.dataChanged("delete"));
          let data = item.getData();
          let editing = item.editing;
          item.element.remove(),
            item.destroy(),
            (item = this.createItem()),
            editing && this.editItem(item),
            item.render(data);
        }
        void 0 === index && (index = this.bottomUp ? 0 : this.length);
        var rel =
          null !==
            (_this$children$index$ =
              null === (_this$children = this.children) ||
              void 0 === _this$children ||
              null === (_this$children$index = _this$children[index]) ||
              void 0 === _this$children$index
                ? void 0
                : _this$children$index.element) &&
          void 0 !== _this$children$index$
            ? _this$children$index$
            : this.marker;
        $.before(item.element, rel);
        var env = { context: this, item };
        return (
          (env.previousIndex = item.index),
          (env.changed = this.splice(
            { remove: env.item },
            { index: index, add: env.item }
          )),
          this.mavo.expressions.active &&
            !o.silent &&
            requestAnimationFrame(() => {
              env.changed.forEach((i) => {
                i.dataChanged(
                  i == env.item && void 0 === env.previousIndex ? "add" : "move"
                ),
                  (i.unsavedChanges = !0);
              }),
                (this.unsavedChanges = this.mavo.unsavedChanges = !0),
                this.mavo.expressions.update(env.item);
            }),
          Mavo.hooks.run("collection-add-end", env),
          env.item
        );
      }
      splice(...actions) {
        actions.forEach((action) => {
          void 0 === action.index &&
            action.remove &&
            isNaN(action.remove) &&
            ((action.index = this.children.indexOf(action.remove)),
            (action.remove = 1));
        }),
          actions.sort((a, b) => b.index - a.index);
        var changed = [],
          deleted = [];
        actions.forEach((action) => {
          -1 < action.index &&
            (action.remove || action.add) &&
            ((action.remove = action.remove || 0),
            (action.add = Mavo.toArray(action.add)),
            deleted.push(
              ...this.children.splice(
                action.index,
                +action.remove,
                ...action.add
              )
            ));
        }),
          (deleted = new Set(deleted));
        for (let i = 0; i < this.length; i++) {
          let item = this.children[i];
          deleted.delete(item),
            item && item.index !== i && ((item.index = i), changed.push(item));
        }
        return (
          deleted.forEach((item) => {
            var _item$expressions;
            null === (_item$expressions = item.expressions) ||
            void 0 === _item$expressions
              ? void 0
              : _item$expressions.forEach((domexpression) => {
                  item.mavo.expressions.unregister(domexpression);
                });
          }),
          this.liveData.update(),
          changed
        );
      }
      async delete(
        item,
        {
          silent,
          undoable = !silent,
          transition = !silent,
          destroy = !undoable,
        } = {}
      ) {
        return (
          item.element.classList.remove("mv-highlight"),
          this.splice({ remove: item }),
          !silent &&
            transition &&
            (await $.transition(item.element, { opacity: 0 }),
            (item.element.style.opacity = "")),
          $.remove(item.element),
          silent ||
            ((this.unsavedChanges =
              item.unsavedChanges =
              this.mavo.unsavedChanges =
                !0),
            item.collection.dataChanged("delete", { index: item.index })),
          undoable ? this.mavo.setDeleted(item) : destroy && item.destroy(),
          item
        );
      }
      move(item, offset) {
        var index = item.index + offset + (0 < offset);
        (index = Mavo.wrap(index, this.children.length + 1)),
          this.add(item, index);
      }
      editItem(item, o = {}) {
        var _item$preEdit;
        null === (_item$preEdit = item.preEdit) || void 0 === _item$preEdit
          ? void 0
          : _item$preEdit.resolve("abort");
        let immediately = o.immediately || Mavo.inView.is(item.element);
        return (
          (item.preEdit = Mavo.promise(
            immediately ? Promise.resolve() : Mavo.inView.when(item.element)
          )),
          item.preEdit.then((value) => {
            if ("abort" !== value)
              return (
                item.itembar || (item.itembar = new Mavo.UI.Itembar(item)),
                item.itembar.add(),
                item.edit(o)
              );
          })
        );
      }
      doneItem(item) {
        var _item$itembar, _item$preEdit2;
        null === (_item$itembar = item.itembar) || void 0 === _item$itembar
          ? void 0
          : _item$itembar.remove(),
          null === (_item$preEdit2 = item.preEdit) || void 0 === _item$preEdit2
            ? void 0
            : _item$preEdit2.resolve("abort");
      }
      edit(o = {}) {
        if (!1 === super.edit()) return !1;
        if (!this.addButton.parentNode) {
          if (this.bottomUp && this.children[0])
            var rel = this.children[0].element;
          (rel = rel || this.marker),
            Mavo.revocably.add(this.addButton, (e) =>
              $[this.bottomUp ? "before" : "after"](e, rel)
            );
        }
        return (
          _.dragula.then(() => {
            this.getDragula();
          }),
          Promise.all(this.children.map((item) => this.editItem(item, o)))
        );
      }
      done() {
        return (
          !1 !== super.done() &&
          void (Mavo.revocably.remove(this.addButton),
          this.propagate((item) => this.doneItem(item)))
        );
      }
      dataChanged(action, o = {}) {
        return (
          (o.element = o.element || this.marker), super.dataChanged(action, o)
        );
      }
      dataRender(data, o = {}) {
        if (void 0 !== data) {
          data =
            null === data ? [] : Mavo.toArray(data).filter((i) => null !== i);
          var changed = !1;
          for (var i = 0; i < this.children.length; i++) {
            var item = this.children[i];
            i < data.length
              ? (changed = item.render(data[i], o) || changed)
              : ((changed = !0), this.delete(item, { silent: !0 }), i--);
          }
          if (data.length > i) {
            var fragment = document.createDocumentFragment();
            for (var j = i; j < data.length; j++) {
              var item = this.createItem();
              (changed = item.render(data[j], o) || changed),
                this.children.push(item),
                (item.index = j),
                fragment.appendChild(item.element);
              var env = { context: this, item };
              Mavo.hooks.run("collection-add-end", env);
            }
            this.marker.before(fragment);
          }
          if ((this.liveData.update(), data.length > i))
            for (var j = i; j < this.children.length; j++)
              this.children[j].dataChanged("add");
          return changed;
        }
      }
      isCompatible(c) {
        return (
          c &&
          this.itemTemplate.constructor == c.itemTemplate.constructor &&
          (c === this ||
            c.template == this ||
            this.template == c ||
            (this.template && this.template == c.template) ||
            c.accepts.has(this.property))
        );
      }
      destroy() {
        var _this$dragula;
        super.destroy(),
          null === (_this$dragula = this.dragula) || void 0 === _this$dragula
            ? void 0
            : _this$dragula.destroy(),
          (this.dragula = null),
          this.propagate("destroy");
      }
      getDragula() {
        if (this.dragula) return this.dragula;
        if (this.template) {
          let containers = this.template.getDragula().containers;
          return (
            -1 === containers.indexOf(this.marker.parentNode) &&
              containers.push(this.marker.parentNode),
            (this.dragula = this.template.dragula || this.template.getDragula())
          );
        }
        return (
          (this.dragula = dragula({
            containers: [this.marker.parentNode],
            isContainer: (el) =>
              !!this.accepts.size &&
              Array.from(el.childNodes).some((child) => {
                var collection = _.get(child);
                return collection && this.accepts.has(collection.property);
              }),
            moves: (el, container, handle) =>
              handle.classList.contains("mv-drag-handle") &&
              handle.closest(Mavo.selectors.multiple) == el,
            accepts: function (el, target, source, next) {
              var _next$previousElement;
              if (el.contains(target)) return !1;
              var previous =
                null !==
                  (_next$previousElement =
                    null === next || void 0 === next
                      ? void 0
                      : next.previousElementSibling) &&
                void 0 !== _next$previousElement
                  ? _next$previousElement
                  : target.lastElementChild;
              var collection = _.get(previous) || _.get(next);
              if (!collection) return !1;
              var item = Mavo.Node.get(el);
              return null === item || void 0 === item
                ? void 0
                : item.collection.isCompatible(collection);
            },
          })),
          this.dragula.on("drop", (el) => {
            if (el.parentNode) {
              var item = Mavo.Node.get(el);
              var next = el.nextElementSibling;
              var previous = el.previousElementSibling;
              var collection = _.get(previous) || _.get(next);
              var closestItem = Mavo.Node.get(previous) || Mavo.Node.get(next);
              if (
                (closestItem &&
                  closestItem.collection != collection &&
                  (closestItem = null),
                item.collection.isCompatible(collection))
              ) {
                var index = closestItem
                  ? closestItem.index + (closestItem.element === previous)
                  : collection.length;
                collection.add(item, index);
              } else return this.dragula.cancel(!0);
            }
          }),
          _.dragulas.push(this.dragula),
          this.dragula
        );
      }
      getClosestCollection() {
        return this;
      }
      static get(element) {
        var collection = Mavo.data(element, "collection");
        if (collection) return collection;
        var item = Mavo.Node.get(element);
        return (
          (null === item || void 0 === item ? void 0 : item.collection) || null
        );
      }
      static async delete(nodes, o = {}) {
        if (
          ((nodes = nodes.filter((node) => !!node.collection)),
          0 === nodes.length)
        )
          return [];
        if (1 === nodes.length) {
          let ret = await nodes[0].collection.delete(nodes[0], o);
          return [ret];
        }
        let deleted = new Mavo.BucketMap({ arrays: !0 });
        let collections = new Set();
        let promises = nodes.map(async (node) => {
          collections.add(node.collection);
          let item = await node.collection.delete(node, {
            silent: !0,
            undoable: !1,
            destroy: !1,
          });
          return (item.unsavedChanges = !0), deleted.set(node.mavo, node), item;
        });
        let ret = await Promise.all(promises);
        return (
          !1 !== o.silent &&
            (collections.forEach((collection) => {
              (collection.unsavedChanges = collection.mavo.unsavedChanges = !0),
                collection.dataChanged("delete");
            }),
            !1 !== o.undoable &&
              deleted.forEach((nodes, mavo) => {
                mavo.setDeleted(...nodes);
              })),
          ret
        );
      }
    });
    $.Class(_, {
      lazy: {
        bottomUp: function () {
          return /^desc\b/i.test(this.element.getAttribute("mv-order"));
        },
      },
      static: {
        dragulas: [],
        lazy: {
          dragula: () =>
            $.include(
              self.dragula,
              "https://cdnjs.cloudflare.com/ajax/libs/dragula/3.7.2/dragula.min.js"
            ),
        },
      },
    });
  })(Bliss, Bliss.$),
  (function () {
    Mavo.ImplicitCollection = class ImplicitCollection extends Mavo.Node {
      constructor(element, mavo, o) {
        super(element, mavo, o),
          (this.children = []),
          (this.liveData = new Mavo.Data(this, [])),
          this.add(element),
          this.postInit(),
          Mavo.hooks.run("implicit-collection-init-end", this);
      }
      get length() {
        return this.children.length;
      }
      getData(o = {}) {
        var env = { context: this, options: o, data: [] };
        if (
          (this.children.forEach((node) => {
            node.isDataNull() || env.data.push(node.getData(o));
          }),
          this.data)
        ) {
          var rendered = Mavo.toArray(Mavo.subset(this.data, this.inPath));
          rendered.length > env.data.length &&
            (env.data = env.data.concat(rendered.slice(env.data.length)));
        }
        return (
          Array.isArray(env.data) &&
            1 >= env.data.length &&
            (env.data = 1 === env.data.length ? env.data[0] : null),
          (env.data = Mavo.subset(this.data, this.inPath, env.data)),
          Mavo.hooks.run("node-getdata-end", env),
          env.data
        );
      }
      add(element) {
        var _this$template$childr, _this$template2, _this$template2$child;
        var item = Mavo.Node.create(element, this.mavo, {
          collection: this,
          template:
            null !==
              (_this$template$childr =
                null === (_this$template2 = this.template) ||
                void 0 === _this$template2 ||
                null === (_this$template2$child = _this$template2.children) ||
                void 0 === _this$template2$child
                  ? void 0
                  : _this$template2$child[this.length]) &&
            void 0 !== _this$template$childr
              ? _this$template$childr
              : null,
          property: this.property,
          type: this.type,
        });
        return (
          (item.index = this.length),
          this.children.push(item),
          this.liveData.update(),
          item
        );
      }
      edit(o = {}) {
        return (
          !1 !== super.edit() &&
          Promise.all(this.children.map((item) => item.edit(o)))
        );
      }
      dataRender(data, o = {}) {
        if (data !== void 0) {
          data =
            null === data ? [] : Mavo.toArray(data).filter((i) => null !== i);
          var changed = data.length !== this.liveData.length;
          this.children.forEach((item, i) => {
            var _item$render, _data;
            return (changed =
              null !==
                (_item$render = item.render(
                  null === (_data = data) || void 0 === _data
                    ? void 0
                    : _data[i],
                  o
                )) && void 0 !== _item$render
                ? _item$render
                : changed);
          });
        }
        this.liveData.update();
      }
    };
  })(Bliss, Bliss.$),
  (function ($, $$) {
    var _ = (Mavo.UI.Itembar = class Itembar {
      constructor(item) {
        var _this$item$template;
        if (
          ((this.item = item),
          (this.element = $$(
            '.mv-item-bar:is(:not([mv-rel]), [mv-rel="'.concat(
              this.item.property,
              '"])'
            ),
            this.item.element
          ).filter(
            (el) =>
              el.closest(Mavo.selectors.multiple) == this.item.element &&
              !Mavo.data(el, "item")
          )[0]),
          !this.element &&
            null !== (_this$item$template = this.item.template) &&
            void 0 !== _this$item$template &&
            _this$item$template.itembar)
        )
          (this.element = this.item.template.itembar.element.cloneNode(!0)),
            (this.dragHandle =
              $(".mv-drag-handle", this.element) || this.item.element);
        else {
          (this.element =
            this.element || $.create({ className: "mv-item-bar mv-ui" })),
            (this.template =
              this.element.getAttribute("mv-item-bar") ||
              this.item.element.getAttribute("mv-item-bar") ||
              this.collection.element.getAttribute("mv-item-bar") ||
              "");
          let controls = Object.assign({}, _.controls);
          (controls.move = {
            ...controls.move,
            optional: this.item instanceof Mavo.Primitive,
          }),
            (this.controls = Mavo.UI.Bar.getControls(this.template, controls)),
            $.set(this.element, {
              "mv-rel": this.item.property,
              contents: this.controls.map((id) => {
                let meta = _.controls[id];
                let existing = $(".mv-".concat(id), this.element);
                return $.create(meta.create.call(this, existing));
              }),
            }),
            (this.dragHandle =
              $(".mv-drag-handle", this.element) || this.item.element);
        }
        this.element.setAttribute("hidden", ""),
          $.bind([this.item.element, this.element], "focusin mouseover", this),
          $.bind(this.element, {
            mouseenter: () => {
              this.item.element.classList.add("mv-highlight");
            },
            mouseleave: () => {
              this.item.element.classList.remove("mv-highlight");
            },
          }),
          this.dragHandle.addEventListener("keydown", (evt) => {
            evt.target === this.dragHandle &&
              this.item.editing &&
              37 <= evt.keyCode &&
              40 >= evt.keyCode &&
              (this.collection.move(this.item, 38 >= evt.keyCode ? -1 : 1),
              evt.stopPropagation(),
              evt.preventDefault(),
              evt.target.focus());
          }),
          this.dragHandle !== this.item.element &&
            this.dragHandle.addEventListener("click", (evt) =>
              evt.target.focus()
            ),
          Mavo.data(this.element, "item", this.item);
      }
      get collection() {
        return this.item.collection;
      }
      get mavo() {
        return this.item.mavo;
      }
      destroy() {
        this.hide();
      }
      show(sticky) {
        _.visible.forEach((instance) => {
          instance != this &&
            (!this.sticky || instance.sticky) &&
            (clearTimeout(instance.hideTimeout),
            instance.hide(sticky, _.DELAY));
        }),
          _.visible.add(this),
          (this.element.hasAttribute("hidden") || (sticky && !this.sticky)) &&
            (this.element.removeAttribute("hidden"),
            (this.sticky = this.sticky || sticky),
            $.bind(
              [this.item.element, this.element],
              "focusout mouseleave",
              this
            ));
      }
      hide(sticky, timeout = 0) {
        (!this.sticky || sticky) &&
          (timeout
            ? (this.hideTimeout = setTimeout(() => this.hide(sticky), timeout))
            : (this.element.setAttribute("hidden", ""),
              $.unbind(
                [this.item.element, this.element],
                "focusout mouseleave",
                this
              ),
              (this.sticky = !1),
              _.visible.delete(this)));
      }
      handleEvent(evt) {
        var sticky = -1 === evt.type.indexOf("mouse");
        this.isWithinItem(evt.target) &&
          (clearTimeout(this.hideTimeout),
          -1 < ["mouseleave", "focusout", "blur"].indexOf(evt.type)
            ? !this.isWithinItem(evt.relatedTarget) &&
              this.hide(sticky, _.DELAY)
            : (this.show(sticky), evt.stopPropagation()));
      }
      isWithinItem(element) {
        if (!element) return !1;
        var itemBar = element.closest(".mv-item-bar");
        return itemBar
          ? itemBar === this.element
          : element.closest(Mavo.selectors.item) === this.item.element;
      }
      add() {
        if (!this.element.parentNode && !Mavo.revocably.add(this.element)) {
          var tag = this.item.element.nodeName.toLowerCase();
          if (tag in _.container)
            var rel = $(_.container[tag], this.item.element);
          (rel || this.item.element).appendChild(this.element);
        }
        this.dragHandle == this.item.element &&
          this.item.element.classList.add("mv-drag-handle");
      }
      remove() {
        Mavo.revocably.remove(this.element),
          this.dragHandle == this.item.element &&
            this.item.element.classList.remove("mv-drag-handle");
      }
    });
    $.Class(_, {
      live: {
        sticky: function (v) {
          this.element.classList.toggle("mv-sticky", v);
        },
      },
      static: {
        DELAY: 100,
        visible: new Set(),
        container: { details: "summary" },
        controls: {
          delete: {
            create(existing) {
              let button =
                existing ||
                $.create("button", {
                  type: "button",
                  title: this.mavo._("delete-item", this.item),
                  className: "mv-delete",
                });
              return (
                Mavo.setAttributeShy(button, "mv-action", "delete($item)"),
                button
              );
            },
          },
          add: {
            create(existing) {
              let bottomUp = this.collection.bottomUp;
              let args = "$item".concat(bottomUp ? ", $index + 1" : "");
              let button =
                existing ||
                $.create("button", {
                  type: "button",
                  title: this.mavo._(
                    "add-item-".concat(bottomUp ? "after" : "before"),
                    this.item
                  ),
                  className: "mv-add",
                });
              return (
                Mavo.setAttributeShy(
                  button,
                  "mv-action",
                  "if($cmd, add($item, "
                    .concat(args, "), add(")
                    .concat(args, "))")
                ),
                button
              );
            },
          },
          move: {
            create(existing) {
              let button =
                existing ||
                $.create("button", {
                  type: "button",
                  title: this.mavo._("drag-to-reorder", this.item),
                  className: "mv-move",
                });
              return button.classList.add("mv-drag-handle"), button;
            },
          },
        },
      },
    });
  })(Bliss, Bliss.$),
  (function () {
    var _ = (Mavo.Expression = class Expression {
      constructor(expression, options = {}) {
        (this.options = options), (this.expression = expression);
      }
      eval(data = Mavo.Data.stub) {
        if (
          (Mavo.hooks.run("expression-eval-beforeeval", this),
          this.function instanceof Error)
        )
          return this.function;
        try {
          return this.function(data);
        } catch (error) {
          return (
            this.error(
              "Something went wrong with the expression ".concat(
                this.expression
              ),
              error.message,
              "Data was: ".concat(JSON.stringify(data))
            ),
            Mavo.hooks.run("expression-eval-error", { context: this, error }),
            error
          );
        }
      }
      error(title, ...message) {
        (message = message.join("\n")),
          console.info(
            "%cOops! \uD83D\uDE33 ".concat(title, ":"),
            "color: #c04; font-weight: bold;",
            message
          );
      }
      toString() {
        return this.expression;
      }
      changedBy(evt) {
        return _.changedBy(this.identifiers, evt);
      }
    });
    Bliss.Class(_, {
      live: {
        expression: function (value) {
          try {
            this.function = Mavo.Script.compile(value, this.options);
          } catch (error) {
            return (
              this.error(
                "There is something wrong with the expression ".concat(value),
                error.message,
                "Not an expression? See https://mavo.io/docs/expressions/#disabling-expressions for information on how to disable expressions."
              ),
              Mavo.hooks.run("expression-compile-error", {
                context: this,
                error,
              }),
              (this.function = error),
              value
            );
          }
          if (
            ((this.ast = this.options.ast), delete this.options.ast, this.ast)
          ) {
            let identifiers = new Set();
            Mavo.Script.walk(this.ast, (n, property) => {
              "Identifier" === n.type && "callee" !== property
                ? identifiers.add(n.name)
                : "MemberExpression" === n.type &&
                  (n.object.name && identifiers.add(n.object.name),
                  identifiers.add(n.property.name));
            }),
              (this.identifiers = [...identifiers]);
          }
        },
      },
    }),
      (_.Syntax = class Syntax {
        constructor(start, end) {
          (this.start = start),
            (this.end = end),
            (this.regex = RegExp(
              ""
                .concat(Mavo.escapeRegExp(start), "([\\S\\s]*?)")
                .concat(Mavo.escapeRegExp(end)),
              "gi"
            ));
        }
        test(str) {
          return (this.regex.lastIndex = 0), this.regex.test(str);
        }
        tokenize(str) {
          var ret = [],
            lastIndex = 0,
            match;
          for (
            this.regex.lastIndex = 0;
            null !== (match = this.regex.exec(str));

          )
            match.index > lastIndex &&
              ret.push(str.substring(lastIndex, match.index)),
              (lastIndex = this.regex.lastIndex),
              /\S/.test(match[1])
                ? ret.push(new Mavo.Expression(match[1]))
                : ret.push(match[0]);
          return (
            lastIndex < str.length && ret.push(str.substring(lastIndex)), ret
          );
        }
        static create(element) {
          if (element) {
            var syntax = element.getAttribute("mv-expressions");
            if (syntax)
              return (
                (syntax = syntax.trim()),
                /\s/.test(syntax)
                  ? new _.Syntax(...syntax.split(/\s+/))
                  : _.Syntax.ESCAPE
              );
          }
        }
      }),
      (_.Syntax.ESCAPE = -1),
      (_.Syntax.default = new _.Syntax("[", "]"));
  })(),
  (function ($) {
    const originalGetAttribute = Element.prototype.getAttribute;
    var _ = (Mavo.DOMExpression = $.Class({
      async constructor(o = {}) {
        var _o$template;
        (this.mavo = o.mavo),
          (this.template =
            (null === (_o$template = o.template) || void 0 === _o$template
              ? void 0
              : _o$template.template) || o.template);
        for (let prop of [
          "item",
          "path",
          "syntax",
          "fallback",
          "attribute",
          "originalAttribute",
          "expression",
          "parsed",
          "identifiers",
        ])
          this[prop] =
            void 0 === o[prop] && this.template ? this.template[prop] : o[prop];
        if (
          ((this.node = o.node),
          this.node ||
            (this.node = Mavo.elementPath(this.item.element, this.path)),
          (this.element = this.node),
          (this.attribute = this.attribute || null),
          Mavo.hooks.run("domexpression-init-start", this),
          /^mv-(value$|attr-)/.test(this.attribute))
        ) {
          var _this$fallback;
          (this.originalAttribute = this.attribute),
            "mv-value" == this.attribute
              ? (this.attribute = Mavo.Primitive.getValueAttribute(
                  this.element
                ))
              : ((this.attribute = this.attribute.replace("mv-attr-", "")),
                [
                  "http://www.w3.org/2000/svg",
                  "http://www.w3.org/1998/Math/MathML",
                ].includes(this.element.namespaceURI) &&
                  (this.attribute = Mavo.getProperAttributeCase(
                    this.element,
                    this.attribute
                  ))),
            null !== (_this$fallback = this.fallback) &&
            void 0 !== _this$fallback
              ? _this$fallback
              : (this.fallback = Mavo.Primitive.getValue(this.element, {
                  attribute: this.attribute,
                }));
          let expression = this.element.getAttribute(this.originalAttribute);
          this.element.removeAttribute(this.originalAttribute),
            (this.parsed = [new Mavo.Expression(expression)]),
            (this.expression = expression);
        }
        if (
          (3 === this.node.nodeType &&
            this.element === this.node &&
            ((this.element = this.node.parentNode),
            (!this.node.parentNode.children.length || this.attribute) &&
              (this.element.normalize(),
              (!this.node.parentNode || this.attribute) &&
                (this.node = this.element))),
          "string" != typeof this.expression)
        ) {
          if (this.attribute) {
            let value = originalGetAttribute.call(this.node, this.attribute);
            this.expression = (value || "").trim();
          } else {
            var _this$node, _this$node$firstChild;
            if (
              (this.node.normalize(),
              1 === this.node.childNodes.length &&
                3 ===
                  (null === (_this$node = this.node) ||
                  void 0 === _this$node ||
                  null === (_this$node$firstChild = _this$node.firstChild) ||
                  void 0 === _this$node$firstChild
                    ? void 0
                    : _this$node$firstChild.nodeType))
            ) {
              var whitespace =
                this.node.firstChild.textContent.match(/^\s*|\s*$/g);
              whitespace[1] &&
                (this.node.firstChild.splitText(
                  this.node.firstChild.textContent.length - whitespace[1].length
                ),
                this.node.after(this.node.lastChild)),
                whitespace[0] &&
                  (this.node.firstChild.splitText(whitespace[0].length),
                  this.node.parentNode.insertBefore(
                    this.node.firstChild,
                    this.node
                  ));
            }
            this.expression = this.node.textContent;
          }
          this.parsed = this.template
            ? this.template.parsed
            : this.syntax.tokenize(this.expression);
        }
        (this.oldValue = this.value =
          this.parsed.map((x) => (x instanceof Mavo.Expression ? "" : x))),
          (this.identifiers =
            this.identifiers ||
            this.parsed.flatMap((x) => x.identifiers || [])),
          _.special.add(this),
          Mavo.hooks.run("domexpression-init-end", this),
          _.elements.set(this.element, [
            ...(_.elements.get(this.element) || []),
            this,
          ]),
          await this.mavo.treeBuilt,
          this.template ||
            this.item ||
            (this.item = Mavo.Node.getClosestItem(this.element)),
          "mv-value" == this.originalAttribute &&
            this.mavoNode &&
            this.mavoNode == this.item.collection &&
            this.item.expressions.delete(this),
          this.mavo.expressions.register(this),
          Mavo.hooks.run("domexpression-init-treebuilt", this);
      },
      destroy: function () {
        _.special.delete(this), this.mavo.expressions.unregister(this);
      },
      get isDynamicObject() {
        return (
          "mv-value" == this.originalAttribute &&
          this.mavoNode &&
          !(this.mavoNode instanceof Mavo.Primitive)
        );
      },
      changedBy: function (evt) {
        return this.isDynamicObject
          ? !evt || !this.mavoNode.contains(evt.node)
          : Mavo.Expression.changedBy(this.identifiers, evt);
      },
      update: function (o) {
        if (!1 !== this.active) {
          var env = { context: this };
          var parentEnv = env;
          if (this.item) {
            var scope = this.isDynamicObject ? this.item.parent : this.item;
            var data = (this.data = scope.getLiveData());
          } else var data = void 0 === this.data ? Mavo.Data.stub : this.data;
          Mavo.hooks.run("domexpression-update-start", env),
            (this.oldValue = this.value);
          var changed = !1;
          (env.value = this.value =
            this.parsed.map((expr, i) => {
              if (expr instanceof Mavo.Expression) {
                let oldValue = Mavo.value(this.oldValue[i]);
                var env = { context: this, expr, parentEnv, oldValue };
                Mavo.hooks.run("domexpression-update-beforeeval", env),
                  (env.value = Mavo.value(env.expr.eval(data))),
                  Mavo.hooks.run("domexpression-update-aftereval", env),
                  env.value instanceof Error &&
                    (env.value =
                      void 0 === this.fallback
                        ? this.syntax.start +
                          env.expr.expression +
                          this.syntax.end
                        : this.fallback),
                  (void 0 === env.value || null === env.value) &&
                    (env.value = "");
                let value = Mavo.value(env.value);
                return (
                  (this.evaluated &&
                    "object" != typeof value &&
                    value === oldValue) ||
                    (changed = !0),
                  (this.evaluated = !0),
                  env.value
                );
              }
              return expr;
            })),
            (changed || (null !== o && void 0 !== o && o.force)) &&
              ((env.value =
                1 === env.value.length
                  ? env.value[0]
                  : env.value
                      .map((v) =>
                        Mavo.Primitive.format(v, {
                          attribute: this.attribute,
                          element: this.element,
                        })
                      )
                      .join("")),
              this.output(env.value),
              Mavo.hooks.run("domexpression-update-end", env));
        }
      },
      output: function (value) {
        this.mavoNode
          ? (Mavo.in(Mavo.isProxy, value) && (value = Mavo.clone(value)),
            this.mavoNode.render(value, { live: !0 }))
          : (this.node.nodeType === Node.TEXT_NODE &&
              !this.node.parentNode &&
              (this.node = this.element),
            Mavo.Primitive.setValue(this.node, value, {
              attribute: this.attribute,
            }));
      },
      live: {
        item: function (item) {
          item &&
            this._item != item &&
            (this._item && this._item.expressions.delete(this),
            (item.expressions = item.expressions || new Set()),
            item.expressions.add(this));
        },
      },
      static: {
        elements: new WeakMap(),
        search: function (element, attribute) {
          if (null === element) return element;
          attribute &&
            !element.ownerDocument.xmlVersion &&
            (attribute = attribute.toLowerCase());
          var all = _.elements.get(element) || [];
          return 1 < arguments.length
            ? all.length
              ? all.filter((et) => et.attribute === attribute)[0] || null
              : null
            : all;
        },
        special: {
          add: function (domexpression, name) {
            if (name) {
              var o = this.vars[name];
              var hasName = -1 < domexpression.identifiers.indexOf(name);
              var hasUnprefixedName =
                name.startsWith("$") &&
                -1 < domexpression.identifiers.indexOf(name.substr(1));
              o &&
                (hasName || hasUnprefixedName) &&
                ((o.all = o.all || new Set()),
                o.all.add(domexpression),
                1 === o.all.size ? o.observe() : !o.all.size && o.unobserve());
            } else for (var name in this.vars) this.add(domexpression, name);
          },
          delete: function (domexpression, name) {
            if (name) {
              var o = this.vars[name];
              (o.all = o.all || new Set()),
                o.all.delete(domexpression),
                o.all.size || o.unobserve();
            } else for (var name in this.vars) this.delete(domexpression, name);
          },
          update: function () {
            var _this$update;
            null === (_this$update = this.update) || void 0 === _this$update
              ? void 0
              : _this$update.call(this, ...arguments),
              this.all.forEach((domexpression) => domexpression.update());
          },
          event: function (name, { type, update, target = document } = {}) {
            (this.vars[name] = {
              observe: function () {
                (this.callback = this.callback || _.special.update.bind(this)),
                  $.bind(target, type, this.callback);
              },
              unobserve: function () {
                $.unbind(target, type, this.callback);
              },
            }),
              update &&
                (this.vars[name].update = function (evt) {
                  Mavo.Functions[name] = update(evt);
                });
          },
          vars: {
            $now: {
              observe: function () {
                var callback = () => {
                  _.special.update.call(this),
                    (this.timer = requestAnimationFrame(callback));
                };
                this.timer = requestAnimationFrame(callback);
              },
              unobserve: function () {
                cancelAnimationFrame(this.timer);
              },
            },
          },
        },
      },
    }));
    _.special.event("$mouse", {
      type: "mousemove",
      update: function (evt) {
        return { x: evt.clientX, y: evt.clientY };
      },
    }),
      _.special.event("$hash", { type: "hashchange", target: window });
  })(Bliss, Bliss.$),
  (function ($, $$) {
    Mavo.attributes.push("mv-expressions");
    var _ = (Mavo.Expressions = $.Class({
      async constructor(mavo) {
        (this.mavo = mavo),
          (this.active = !0),
          (this.expressions = new Set()),
          (this.identifiers = {});
        var syntax =
          Mavo.Expression.Syntax.create(
            this.mavo.element.closest("[mv-expressions]")
          ) || Mavo.Expression.Syntax.default;
        this.traverse(this.mavo.element, void 0, syntax),
          (this.scheduled = {}),
          await this.mavo.treeBuilt,
          (this.expressions = new Set()),
          this.update();
      },
      register: function (domexpression) {
        var ids = this.identifiers;
        (domexpression.registeredApp =
          domexpression.registeredApp || new Set()),
          domexpression.identifiers.forEach((id) => {
            ids[id] instanceof Set || (ids[id] = new Set()),
              ids[id].add(domexpression),
              Mavo.all[id] instanceof Mavo &&
                Mavo.all[id] !== this.mavo &&
                !domexpression.registeredApp.has(id) &&
                (domexpression.registeredApp.add(id),
                Mavo.all[id].expressions.register(domexpression));
          });
      },
      unregister: function (domexpression) {
        var ids = this.identifiers;
        domexpression.identifiers.forEach((id) => {
          ids[id] && ids[id].delete(domexpression),
            id in Mavo.all &&
              "undefined" != typeof domexpresssion &&
              Mavo.all[id].expressions.unregister(domexpresssion);
        });
      },
      updateThrottled: function (evt) {
        if (this.active) {
          var scheduled = (this.scheduled[evt.action] =
            this.scheduled[evt.action] || new Set());
          evt.node.template
            ? !scheduled.has(evt.node.template) &&
              (setTimeout(() => {
                scheduled.delete(evt.node.template), this.update(evt);
              }, _.THROTTLE),
              scheduled.add(evt.node.template))
            : requestAnimationFrame(() => this.update(evt));
        }
      },
      update: function (evt) {
        if (this.active) {
          var root, rootObject;
          if (evt instanceof Mavo.Node) rootObject = evt;
          else if (evt instanceof Element)
            (root = evt.closest(Mavo.selectors.item)),
              (rootObject = Mavo.Node.get(root));
          else {
            if (evt) {
              var cache = { updated: new Set() };
              if (
                (this.updateByIdThrottled(evt.property, evt, cache),
                "propertychange" == evt.action)
              ) {
                var _evt$node;
                null !== (_evt$node = evt.node) &&
                  void 0 !== _evt$node &&
                  _evt$node.path &&
                  this.updateByIdThrottled(evt.node.path, evt, cache);
              } else {
                this.updateById(Object.keys(Mavo.Data.special), evt, cache);
                var collection = evt.node.collection || evt.node;
                this.updateById(collection.properties, evt, cache);
              }
              return;
            }
            rootObject = this.mavo.root;
          }
          rootObject.walk((obj) => {
            var _obj$expressions;
            return (
              !!obj.expressionsEnabled &&
              void (null === (_obj$expressions = obj.expressions) ||
              void 0 === _obj$expressions
                ? void 0
                : _obj$expressions.forEach((et) => {
                    (evt && et.mavoNode === evt) || et.update();
                  }))
            );
          });
        }
      },
      updateByIdThrottled: function (property, evt, cache) {
        if (property)
          if (property.forEach)
            property.forEach((property) =>
              this.updateByIdThrottled(property, evt, cache)
            );
          else {
            var scheduled = (this.scheduledIds =
              this.scheduledIds || new Set());
            scheduled.has(property) ||
              (setTimeout(() => {
                scheduled.delete(property),
                  this.updateById(property, evt, cache);
              }, _.THROTTLE),
              scheduled.add(property));
          }
      },
      updateById: function (property, evt, cache) {
        if (property.forEach)
          return void property.forEach((p) => this.updateById(p, evt, cache));
        var exprs = this.identifiers[property];
        exprs &&
          exprs.forEach((expr) => {
            ("mv-value" == expr.originalAttribute &&
              expr.mavoNode &&
              !(expr.mavoNode instanceof Mavo.Primitive) &&
              expr.mavoNode.contains(evt.node)) ||
              (!cache.updated.has(expr) && expr.update());
          });
      },
      extract: function (
        node,
        attribute,
        path,
        syntax = Mavo.Expression.Syntax.default
      ) {
        let attributeName =
          null === attribute || void 0 === attribute ? void 0 : attribute.name;
        (_.directives.some((d) => {
          var _d$test;
          return (
            (null === (_d$test = d.test) || void 0 === _d$test
              ? void 0
              : _d$test.call(d, attributeName)) || d === attributeName
          );
        }) ||
          (syntax !== Mavo.Expression.Syntax.ESCAPE &&
            syntax.test(attribute ? attribute.value : node.textContent))) &&
          (path === void 0 &&
            (path = Mavo.elementPath(node.closest(Mavo.selectors.scope), node)),
          this.expressions.add(
            new Mavo.DOMExpression({
              node,
              syntax,
              path,
              attribute: attributeName,
              mavo: this.mavo,
            })
          ));
      },
      traverse: function (node, path = [], syntax) {
        if (8 !== node.nodeType)
          if (3 === node.nodeType) this.extract(node, null, path, syntax);
          else {
            var _node$getAttribute$tr, _node$getAttribute;
            node.normalize(),
              (syntax = Mavo.Expression.Syntax.create(node) || syntax),
              node.matches(Mavo.selectors.scope) && (path = []);
            let ignoredAttributes = new Set([
              ..._.skip,
              ...(null !==
                (_node$getAttribute$tr =
                  null ===
                    (_node$getAttribute = node.getAttribute(
                      "mv-expressions-ignore"
                    )) || void 0 === _node$getAttribute
                    ? void 0
                    : _node$getAttribute.trim().split(/\s*,\s*/)) &&
              void 0 !== _node$getAttribute$tr
                ? _node$getAttribute$tr
                : []),
            ]);
            let specifiedAttributes = new Set(node.getAttributeNames());
            for (let name of specifiedAttributes)
              if (ignoredAttributes.has(name)) specifiedAttributes.delete(name);
              else if (name.startsWith("mv-attr-")) {
                let plainName = name.replace("mv-attr-", "");
                specifiedAttributes.delete(plainName);
              }
            for (let name of specifiedAttributes)
              this.extract(node, node.attributes[name], path, syntax);
            var index = -1,
              offset = 0;
            node.matches("script:not([mv-expressions])") ||
              $$(node.childNodes).forEach((child) => {
                if (
                  (1 == child.nodeType ? ((offset = 0), index++) : offset++,
                  1 == child.nodeType || 3 == child.nodeType)
                ) {
                  var segment =
                    0 < offset ? "".concat(index, ".").concat(offset) : index;
                  this.traverse(child, [...(path || []), segment], syntax);
                }
              });
          }
      },
      static: {
        directives: ["mv-value", /^mv\-attr\-/],
        skip: ["mv-expressions", "mv-action"],
        THROTTLE: 50,
        directive: function (name, o) {
          _.directives.push(name),
            Mavo.attributes.push(name),
            Mavo.Plugins.register(name, o);
        },
      },
    }));
  })(Bliss, Bliss.$),
  (function ($, $$) {
    Mavo.Expressions.directive("mv-if", {
      extend: {
        Primitive: {
          live: {
            hidden: function (value) {
              this._hidden !== value &&
                ((this._hidden = value),
                this.liveData.update(),
                this.dataChanged());
            },
          },
        },
        DOMExpression: {
          lazy: {
            childProperties: function () {
              var properties = $$(Mavo.selectors.property, this.element)
                .filter((el) => el.closest("[mv-if]") == this.element)
                .map((el) => Mavo.Node.get(el));
              return (
                this.element.addEventListener("mv-change", (evt) => {
                  requestAnimationFrame(() => {
                    this.element.parentNode ||
                      this.item.element.dispatchEvent(evt);
                  });
                }),
                properties
              );
            },
          },
        },
      },
      hooks: {
        "domexpression-init-start": function () {
          "mv-if" != this.attribute ||
            (!Mavo.Node.prototype.fromTemplate.call(
              this,
              "parsed",
              "expression"
            ) &&
              ((this.expression = this.element.getAttribute("mv-if")),
              (this.parsed = [new Mavo.Expression(this.expression)]),
              (this.expression =
                this.syntax.start + this.expression + this.syntax.end)),
            (this.parentIf =
              this.element.parentNode &&
              Mavo.DOMExpression.search(
                this.element.parentNode.closest("[mv-if]"),
                "mv-if"
              )),
            this.parentIf &&
              (this.parentIf.childIfs = (
                this.parentIf.childIfs || new Set()
              ).add(this)));
        },
        "domexpression-update-end": async function () {
          if ("mv-if" === this.attribute) {
            var value = this.value[0];
            var oldValue = this.oldValue[0];
            if ((await this.item.mavo.treeBuilt, this.parentIf)) {
              var parentValue = this.parentIf.value[0];
              this.value[0] = value = value && parentValue;
            }
            if (
              (!1 !== parentValue &&
                (value
                  ? Mavo.revocably.add(this.element)
                  : this.element.parentNode &&
                    Mavo.revocably.remove(this.element, "mv-if")),
              value !== oldValue)
            ) {
              var _this$childProperties, _this$childIfs;
              null === (_this$childProperties = this.childProperties) ||
              void 0 === _this$childProperties
                ? void 0
                : _this$childProperties.forEach(
                    (property) => (property.hidden = !value)
                  ),
                null === (_this$childIfs = this.childIfs) ||
                void 0 === _this$childIfs
                  ? void 0
                  : _this$childIfs.forEach((childIf) => childIf.update());
            }
          }
        },
        "node-isdatanull": function (env) {
          env.result = env.result || (this.hidden && env.options.live);
        },
      },
    });
  })(Bliss, Bliss.$),
  (function ($, val) {
    var _Mathround = Math.round;
    var _Mathfloor = Math.floor;
    var _Mathabs = Math.abs;
    var _Mathmin4 = Math.min;
    function str(str = "") {
      return (str = val(str)), str || 0 === str ? str + "" : "";
    }
    function empty(v) {
      return (v = Mavo.value(v)), null === v || !1 === v || "" === v;
    }
    function not(v) {
      return !val(v);
    }
    let $u = {
      numbers(array, args) {
        return (
          (array = Array.isArray(array) ? array : args ? $$(args) : [array]),
          array
            .filter(
              (number) =>
                !isNaN(number) && "" !== val(number) && null !== val(number)
            )
            .map((n) => +n)
        );
      },
      postProcess(callback) {
        var multiValued = callback.multiValued;
        var newCallback;
        if (
          (!0 === multiValued ||
          2 ===
            (null === multiValued || void 0 === multiValued
              ? void 0
              : multiValued.length)
            ? (newCallback = (...args) => {
                var idxA = multiValued[0] || 0;
                var idxB = multiValued[1] || 1;
                return Mavo.Script.binaryOperation(args[idxA], args[idxB], {
                  scalar: (a, b) => (
                    idxA in args && (args[idxA] = a),
                    idxB in args && (args[idxB] = b),
                    callback(...args)
                  ),
                  ...callback,
                });
              })
            : callback.isAggregate &&
              (newCallback = function (array) {
                if (Mavo.in(Mavo.groupedBy, array))
                  return array.map((e) => newCallback(e.$items));
                var ret = callback.call(this, ...arguments);
                return void 0 === ret ? array : ret;
              }),
          newCallback &&
            ($.extend(newCallback, callback),
            (newCallback.original = callback)),
          callback.alias)
        )
          for (let alias of Mavo.toArray(callback.alias))
            Mavo.Functions[alias] = newCallback || callback;
        return newCallback;
      },
      deprecatedFunction(name, oldName, fn) {
        return function (...args) {
          var _fn;
          return (
            null !== (_fn = fn) && void 0 !== _fn
              ? _fn
              : (fn = Mavo.Functions[name]),
            Mavo.warn(
              ""
                .concat(
                  oldName,
                  "() is deprecated and will be removed in the next version of Mavo. Please use "
                )
                .concat(name, "() instead.")
            ),
            fn(...args)
          );
        };
      },
    };
    let _ = (Mavo.Functions = {
      operators: { "=": "eq" },
      get: function (obj, property, ...properties) {
        if (1 >= arguments.length) return obj;
        let ret;
        property = val(property);
        let canonicalProperty = Mavo.getCanonicalProperty(obj, property);
        if (canonicalProperty !== void 0) ret = obj[canonicalProperty];
        else if (Array.isArray(obj) && property && isNaN(property))
          ret = obj.map((e) => _.get(e, property));
        else return null;
        return 0 < properties.length ? _.get(ret, ...properties) : ret;
      },
      map: function (array, property) {
        if (Array.isArray(array)) return array.map((e) => _.get(e, property));
        return array ? _.get(array, property) : void 0;
      },
      url: (id, ...options) => {
        if (id === void 0) return location.href;
        options = Object.assign({}, ...options);
        let { url = location, type, case_sensitive, multiple } = options;
        if (id) {
          if (
            ((url = new URL(url, "https://mavo.io")), "query" === type || !type)
          ) {
            let params = url.searchParams;
            let ret = url.searchParams.getAll(id);
            if (0 === ret.length && !case_sensitive) {
              let keys = [...params.keys()].filter(
                (key) => key.toLowerCase() === id.toLowerCase()
              );
              ret = keys.flatMap((key) => params.getAll(key));
            }
            if (0 < ret.length) return multiple ? ret : ret[0];
          }
          if ("path" === type || !type) {
            let path = url.pathname.split("/");
            let index = case_sensitive
              ? path.indexOf(id)
              : path.findIndex(
                  (part) => part.toLowerCase() === id.toLowerCase()
                );
            if (-1 < index) {
              var _path;
              let ret =
                null !== (_path = path[index + 1]) && void 0 !== _path
                  ? _path
                  : "";
              return (
                ret && (ret = decodeURIComponent(ret)),
                multiple ? Mavo.toArray(ret) : ret
              );
            }
          }
        }
        return multiple ? [] : null;
      },
      first: (n, arr) => {
        if ((void 0 === arr && ((arr = n), (n = void 0)), void 0 === arr))
          return null;
        if (!Array.isArray(arr)) return void 0 === n ? arr : [arr];
        if (0 > n) return _.last(_Mathabs(n), arr);
        var ret = [];
        var numReturn = void 0 === n ? 1 : _Mathfloor(n);
        for (var i = 0; i < arr.length && ret.length < numReturn; i++) {
          let rawValue = Mavo.value(arr[i]);
          null !== rawValue && "" !== rawValue && ret.push(arr[i]);
        }
        return void 0 === n ? (void 0 === ret[0] ? null : ret[0]) : ret;
      },
      last: (n, arr) => {
        if ((void 0 === arr && ((arr = n), (n = void 0)), void 0 === arr))
          return null;
        if (!Array.isArray(arr)) return void 0 === n ? arr : [arr];
        if (0 > n) return _.first(_Mathabs(n), arr);
        var ret = [];
        var numReturn = void 0 === n ? 1 : _Mathfloor(n);
        for (var i = arr.length - 1; 0 <= i && ret.length < numReturn; i--) {
          let rawValue = Mavo.value(arr[i]);
          null !== rawValue && "" !== rawValue && ret.push(arr[i]);
        }
        return void 0 === n ? (void 0 === ret[0] ? null : ret[0]) : ret;
      },
      condense: (arr) => _.first(arr.length, arr),
      unique: function (arr) {
        return Array.isArray(arr) ? [...new Set(arr.map(val))] : arr;
      },
      intersects: function (arr1, arr2) {
        if (arr1 && arr2) {
          var set2 = new Set(Mavo.toArray(arr2).map(val));
          return (
            (arr1 = Mavo.toArray(arr1).map(val)),
            !arr1.every((el) => !set2.has(el))
          );
        }
      },
      intersection: function (arr1, arr2) {
        if (!arr1 || !arr2) return null;
        (arr1 = Mavo.toArray(arr1)), (arr2 = Mavo.toArray(arr2));
        let set2 = new Set(arr2.map(val));
        return arr1.filter((x) => set2.has(Mavo.value(x)));
      },
      sum: $.extend(
        function (array) {
          return $u
            .numbers(array, arguments)
            .reduce((prev, current) => +prev + (+current || 0), 0);
        },
        { isAggregate: !0 }
      ),
      average: $.extend(
        function (array) {
          return (
            (array = $u.numbers(array, arguments)),
            array.length && _.sum(array) / array.length
          );
        },
        { isAggregate: !0, alias: "avg" }
      ),
      median: $.extend(
        function (array) {
          var _Mathceil = Math.ceil;
          array = $u.numbers(array, arguments).sort((a, b) => a - b);
          var mi = (array.length - 1) / 2;
          return (
            ([m1, m2] = [array[_Mathfloor(mi)], array[_Mathceil(mi)]]),
            (m1 + m2) / 2 || 0
          );
        },
        { isAggregate: !0 }
      ),
      min: $.extend(
        function (array) {
          return _Mathmin4(...$u.numbers(array, arguments));
        },
        { isAggregate: !0 }
      ),
      max: $.extend(
        function (array) {
          return Math.max(...$u.numbers(array, arguments));
        },
        { isAggregate: !0 }
      ),
      atan2: $.extend((dividend, divisor) => Math.atan2(dividend, divisor), {
        multiValued: !0,
        rightUnary: (b) => b,
        default: 1,
      }),
      pow: $.extend((base, exponent) => Math.pow(base, exponent), {
        multiValued: !0,
        default: 1,
      }),
      imul: $.extend((a, b) => Math.imul(a, b), {
        multiValued: !0,
        default: 1,
      }),
      count: $.extend(
        function (array) {
          return Mavo.toArray(array).filter((a) => !empty(a)).length;
        },
        { isAggregate: !0 }
      ),
      reverse: function (array) {
        return Mavo.toArray(array).slice().reverse();
      },
      round: $.extend(
        (num, decimals) =>
          not(num) || not(decimals) || !isFinite(num)
            ? _Mathround(num)
            : +(+num).toLocaleString("en-US", {
                useGrouping: !1,
                maximumFractionDigits: decimals,
              }),
        { multiValued: !0, rightUnary: (b) => b, default: 0 }
      ),
      ordinal: $.extend(
        (num) => {
          if (empty(num)) return "";
          if (10 > num || 20 < num)
            var ord = ["th", "st", "nd", "rd", "th"][num % 10];
          return ord || "th";
        },
        { multiValued: !0, alias: "th" }
      ),
      pluralize: $.extend(
        function (num, ...args) {
          if (empty(num)) return "";
          if (0 === args.length) return num;
          let o = args.reduce(
            (o, arg) => (
              (arg = Mavo.value(arg)),
              "object" !== $.type(arg) &&
                (o.one
                  ? (arg = Object.fromEntries(
                      ["zero", "two", "few", "many", "other"].map((k) => [
                        k,
                        arg,
                      ])
                    ))
                  : (arg = { one: arg })),
              Object.assign(o, arg)
            ),
            {}
          );
          let lang = o.lang || Mavo.locale;
          let pl = new Intl.PluralRules(lang, { type: o.type || "cardinal" });
          let type = pl.select(num);
          let label =
            o[type] || o.other || o.two || o.zero || o.few || o.many || o.one;
          return o.text_only
            ? label
            : "ordinal" === o.type
            ? "".concat(num).concat(label)
            : "".concat(num, " ").concat(label);
        },
        { multiValued: !0, needsContext: !0 }
      ),
      digits: $.extend(
        (digits, decimals, num) => {
          if (
            (void 0 === num && ((num = decimals), (decimals = void 0)),
            isNaN(num))
          )
            return null;
          var parts = (num + "").split(".");
          return (
            (parts[0] = parts[0].slice(-digits)),
            void 0 !== decimals &&
              parts[1] &&
              (parts[1] = parts[1].slice(0, decimals)),
            (num = +parts.join(".")),
            num.toLocaleString("en", {
              useGrouping: !1,
              minimumIntegerDigits: digits,
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals || 20,
            })
          );
        },
        { multiValued: !0 }
      ),
      iff: function (condition, iftrue = condition, iffalse = null) {
        return Array.isArray(condition)
          ? condition.map((c, i) => {
              var ret = val(c) ? iftrue : iffalse;
              return Array.isArray(ret)
                ? ret[_Mathmin4(i, ret.length - 1)]
                : ret;
            })
          : val(condition)
          ? iftrue
          : iffalse;
      },
      group: (...objects) => Object.assign({}, ...objects),
      list: (...items) => items.flat(),
      random: $.extend(
        (min = 0, max = 100, step = 1) => {
          1 == arguments.length && ((max = min), (min = 0));
          var rand = Math.random();
          var range = (max - min) / step;
          return _Mathfloor(rand * (range + 1)) * step + min;
        },
        { multiValued: !0 }
      ),
      range: (a, b, step) => {
        step === void 0 &&
          (b === void 0 && ([a, b] = [0 <= a ? 1 : -1, a]),
          (step = a <= b ? 1 : -1));
        let steps = _Mathfloor((b - a) / step + 1);
        if (0 >= steps || !isFinite(steps)) return [a];
        let ret = [];
        for (let i = 0, n = a; i++ < steps; n += step) ret.push(n);
        return ret;
      },
      shuffle: (list) => {
        if (Array.isArray(list)) {
          var ret = list.slice();
          for (var i = ret.length - 1; 0 < i; i--) {
            var j = _Mathfloor(Math.random() * (i + 1));
            [ret[i], ret[j]] = [ret[j], ret[i]];
          }
          return ret;
        }
        return list;
      },
      sort(list, by = list, ...options) {
        var _options$order;
        options = Object.assign({}, ...options);
        let collatorOptions = Object.assign({ numeric: !0 }, options);
        let collator = new Intl.Collator(
          options.lang || Mavo.locale,
          collatorOptions
        );
        Array.isArray(by) || (by = _.get(list, by));
        let desc =
          null === (_options$order = options.order) || void 0 === _options$order
            ? void 0
            : _options$order.startsWith("desc");
        let arr = list.map((a, i) => [a, by[i]]);
        return (
          (arr = arr.sort((a, b) => {
            let bya = a[1];
            let byb = b[1];
            return collator.compare(bya, byb) * (desc ? -1 : 1);
          })),
          arr.map((a) => a[0])
        );
      },
      replace: $.extend(
        (haystack, needle, replacement = "", iterations = 1) => {
          if (!Mavo.value(haystack)) return haystack;
          if (Array.isArray(haystack))
            return haystack.map((item) => _.replace(item, needle, replacement));
          var needleRegex = RegExp(Mavo.escapeRegExp(needle), "g");
          var ret = haystack,
            prev;
          for (var counter = 0; ret != prev && counter++ < iterations; )
            (prev = ret), (ret = ret.replace(needleRegex, replacement));
          return ret;
        },
        { multiValued: !0 }
      ),
      len: $.extend((text) => str(text).length, { multiValued: !0 }),
      contains: $.extend(
        (haystack, needle) => {
          let ret;
          let haystackType = $.type(haystack);
          if ("object" === $.type(needle))
            return (
              0 <= JSON.stringify(haystack).indexOf(JSON.stringify(needle))
            );
          if ("object" === haystackType || "array" === haystackType) {
            for (let property in haystack)
              if (
                ((ret = _.contains(haystack[property], needle)),
                Array.isArray(ret) && (ret = Mavo.Functions.or(ret)),
                ret)
              )
                return !0;
          } else return 0 <= _.search(haystack, needle);
          return ret;
        },
        { multiValued: !0 }
      ),
      search: $.extend(
        (haystack, needle) => (
          (haystack = str(haystack)),
          (needle = str(needle)),
          haystack && needle
            ? haystack.toLowerCase().indexOf(needle.toLowerCase())
            : -1
        ),
        { multiValued: !0 }
      ),
      starts: $.extend(
        (haystack, needle) => 0 === _.search(str(haystack), str(needle)),
        { multiValued: !0 }
      ),
      ends: $.extend(
        (haystack, needle) => {
          [haystack, needle] = [str(haystack), str(needle)];
          var i = _.search(haystack, needle);
          return -1 < i && i === haystack.length - needle.length;
        },
        { multiValued: !0 }
      ),
      join: function (array, glue) {
        return Mavo.toArray(array)
          .filter((a) => !empty(a))
          .join(str(glue));
      },
      idify: $.extend(
        (readable) =>
          str(readable)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .toLowerCase(),
        { multiValued: !0 }
      ),
      readable: $.extend(
        (identifier) =>
          str(identifier)
            .replace(
              /([a-z])([A-Z])(?=[a-z])/g,
              ($0, $1, $2) => $1 + " " + $2.toLowerCase()
            )
            .replace(/([a-z0-9])[_\/-](?=[a-z0-9])/g, "$1 ")
            .replace(/^[a-z]/, ($0) => $0.toUpperCase()),
        { multiValued: !0 }
      ),
      uppercase: $.extend((text) => str(text).toUpperCase(), {
        multiValued: !0,
      }),
      lowercase: $.extend((text) => str(text).toLowerCase(), {
        multiValued: !0,
      }),
      from: $.extend((haystack, needle) => _.between(haystack, needle), {
        multiValued: !0,
      }),
      from_last: $.extend(
        (haystack, needle) => _.between(haystack, needle, "", !0),
        { multiValued: !0 }
      ),
      fromlast: $u.deprecatedFunction("from_last", "fromlast"),
      to: $.extend((haystack, needle) => _.between(haystack, "", needle), {
        multiValued: !0,
      }),
      to_first: $.extend(
        (haystack, needle) => _.between(haystack, "", needle, !0),
        { multiValued: !0 }
      ),
      tofirst: $u.deprecatedFunction("to_first", "tofirst"),
      between: $.extend(
        (haystack, from, to, tight) => {
          [haystack, from, to] = [str(haystack), str(from), str(to)];
          let fromIndex = from
            ? haystack[tight ? "lastIndexOf" : "indexOf"](from)
            : 0;
          let toIndex = to
            ? haystack[tight ? "indexOf" : "lastIndexOf"](to)
            : haystack.length;
          return -1 === fromIndex || -1 === toIndex
            ? ""
            : tight && toIndex <= fromIndex
            ? haystack.slice(toIndex + to.length, fromIndex)
            : haystack.slice(fromIndex + from.length, toIndex);
        },
        { multiValued: !0 }
      ),
      phrase: $.extend(
        function (id, vars, lang) {
          var _this$Mavo$mavo$local, _this$Mavo$mavo;
          2 === arguments.length &&
            "string" === $.type(vars) &&
            ([lang, vars] = [vars]);
          let locale = lang
            ? Mavo.Locale.get(lang)
            : null !==
                (_this$Mavo$mavo$local =
                  null === this ||
                  void 0 === this ||
                  null === (_this$Mavo$mavo = this[Mavo.mavo]) ||
                  void 0 === _this$Mavo$mavo
                    ? void 0
                    : _this$Mavo$mavo.locale) &&
              void 0 !== _this$Mavo$mavo$local
            ? _this$Mavo$mavo$local
            : Mavo.Locale.default;
          return locale.phrase(id, vars);
        },
        { needsContext: !0 }
      ),
      filename: $.extend(
        (url) => {
          var _URL$pathname$match;
          return null ===
            (_URL$pathname$match = new URL(str(url), Mavo.base).pathname.match(
              /[^/]+?$/
            )) || void 0 === _URL$pathname$match
            ? void 0
            : _URL$pathname$match[0];
        },
        { multiValued: !0 }
      ),
      json: (data) => Mavo.safeToJSON(data),
      split: $.extend(
        (text, separator = /\s+/) =>
          text ? ((text = str(text)), text.split(separator)) : [],
        { multiValued: !0 }
      ),
      log: (...args) => (console.log(...args.map(val)), args[0]),
      $mouse: { x: 0, y: 0 },
      get $hash() {
        return location.hash.slice(1);
      },
      get $alt() {
        return !!_.$evt && _.$evt.altKey;
      },
      get $ctrl() {
        return !!_.$evt && _.$evt.ctrlKey;
      },
      get $shift() {
        return !!_.$evt && _.$evt.shiftKey;
      },
      get $cmd() {
        return !!_.$evt && _.$evt[Mavo.superKey];
      },
      util: $u,
    });
    Mavo.ready.then(() => {
      Object.getOwnPropertyNames(Mavo.Functions).forEach((property) => {
        var newCallback = $u.postProcess(Mavo.Functions[property]);
        newCallback && (Mavo.Functions[property] = newCallback);
      }),
        Object.getOwnPropertyNames(Math).forEach((property) => {
          1 !== Math[property].length ||
            Mavo.Functions.hasOwnProperty(property) ||
            (Mavo.Functions[property] = (operand) =>
              Mavo.Script.unaryOperation(operand, (operand) =>
                Math[property](operand)
              ));
        });
    });
  })(Bliss, Mavo.value),
  (function ($, val, _, $u = _.util) {
    var _Mathfloor2 = Math.floor;
    var _Mathabs2 = Math.abs;
    function isPrecision(precision) {
      if (!precision) return !1;
      if ("ms" == precision) return !0;
      let singular = precision.replace(/s$/, "");
      let plural = precision.replace(/s?$/, "s");
      return singular in s || plural in s;
    }
    function parsePrecision(precision) {
      var _precision;
      precision =
        (null === (_precision = precision) || void 0 === _precision
          ? void 0
          : _precision.trim()) || "";
      let keys = Object.keys(s).reverse();
      let ret = {};
      do (p = keys.shift()), (ret[p] = !0);
      while (!RegExp(p + "?").test(precision) && 0 < keys.length);
      return "ms" == precision && (ret.ms = !0), ret;
    }
    var s = { seconds: 1, minutes: 60 };
    (s.hours = 60 * s.minutes),
      (s.days = 24 * s.hours),
      (s.weeks = 7 * s.days),
      (s.months = 30.4368 * s.days),
      (s.years = 52 * s.weeks);
    var numeric = {
      year: (d) => d.getFullYear(),
      month: (d) => d.getMonth() + 1,
      day: (d) => d.getDate(),
      weekday: (d) => d.getDay() || 7,
      hour: (d) => d.getHours(),
      minute: (d) => d.getMinutes(),
      second: (d) => d.getSeconds(),
      ms: (d) => d.getMilliseconds(),
    };
    for (let unit in ($.extend(_, {
      get $now() {
        return new Date();
      },
      $startup: new Date(),
      get $today() {
        return _.date(new Date());
      },
      year: $.extend(
        function () {
          return $u.dateComponent("year", ...arguments);
        },
        { multiValued: !0 }
      ),
      month: $.extend(
        function () {
          return $u.dateComponent("month", ...arguments);
        },
        { multiValued: !0 }
      ),
      week: () => 1e3 * s.weeks,
      day: $.extend(
        function () {
          return $u.dateComponent("day", ...arguments);
        },
        { multiValued: !0 }
      ),
      weekday: $.extend(
        function () {
          return $u.dateComponent("weekday", ...arguments);
        },
        { multiValued: !0 }
      ),
      hour: $.extend(
        function () {
          return $u.dateComponent("hour", ...arguments);
        },
        { multiValued: !0 }
      ),
      minute: $.extend(
        function () {
          return $u.dateComponent("minute", ...arguments);
        },
        { multiValued: !0 }
      ),
      second: $.extend(
        function () {
          return $u.dateComponent("second", ...arguments);
        },
        { multiValued: !0 }
      ),
      ms: $.extend(
        function () {
          return $u.dateComponent("ms", ...arguments);
        },
        { multiValued: !0 }
      ),
      datetime: $.extend(
        (date, time, precision) => {
          var _precision2;
          if (((date = $u.date(date)), !date)) return "";
          let separateTime;
          void 0 !== time &&
            (isPrecision(time)
              ? ([time, precision] = [, time])
              : (separateTime = !0)),
            null !== (_precision2 = precision) && void 0 !== _precision2
              ? _precision2
              : (precision = "minutes");
          let parts = parsePrecision(precision);
          let ret = _.date(date, precision);
          return parts.hours
            ? ((ret += separateTime
                ? Mavo.value(time)
                  ? "T".concat(_.time(time, precision))
                  : ""
                : "T".concat(_.time(date, precision))),
              ret)
            : ret;
        },
        { multiValued: !0 }
      ),
      date: $.extend(
        (date, precision = "days") => {
          if (((date = $u.date(date)), !date)) return "";
          let parts = parsePrecision(precision);
          let ret = [];
          return (
            parts.years && ret.push(_.year(date)),
            parts.months && ret.push(_.month(date, "00")),
            parts.days && ret.push(_.day(date, "00")),
            ret.join("-")
          );
        },
        { multiValued: !0 }
      ),
      time: $.extend(
        (date, precision = "minutes") => {
          if (((date = $u.date(date)), !date)) return "";
          let parts = parsePrecision(precision);
          let ret = "";
          return (
            parts.hours &&
              ((ret +=
                _.hour(date, "00") +
                ":" +
                (parts.minutes ? _.minute(date, "00") : "00")),
              parts.seconds &&
                ((ret += ":" + _.second(date, "00")),
                parts.ms && (ret += "." + _.ms(date, "000")))),
            ret
          );
        },
        { multiValued: !0 }
      ),
      readable_datetime: $.extend(
        (date, ...options) => {
          (options = options.map((o) =>
            "string" == typeof o || o instanceof String ? { precision: o } : o
          )),
            (options = Object.assign({}, ...options));
          let parts = parsePrecision(options.precision);
          let monthFormat = options.month || parts.days ? "shortname" : "long";
          let ret = [];
          return (
            parts.days && ret.push(_.day(date)),
            parts.months && ret.push(_.month(date, monthFormat)),
            parts.years && ret.push(_.year(date)),
            parts.hours && ret.push(_.time(date, options.precision)),
            ret.join(" ")
          );
        },
        { multiValued: !0 }
      ),
      localTimezone: -new Date().getTimezoneOffset(),
    }),
    (_.msTo = (what, ms) => _Mathfloor2(_Mathabs2(ms) / (1e3 * s[what])) || 0),
    s))
      _[unit] = $.extend(
        function (ms) {
          return 0 === arguments.length ? 1e3 * s[unit] : _.msTo(unit, ms);
        },
        { multiValued: !0 }
      );
    (_.duration = $.extend(
      function (ms, terms) {
        let negativeMultiplier = 0 > ms ? -1 : 1;
        if (((ms = _Mathabs2(ms)), terms && isNaN(terms))) {
          let unitSingular = "ms" == terms ? terms : terms.replace(/s?$/, "");
          let unitPlural = terms.replace(/s?$/, "s");
          if (!(unitPlural in s))
            throw new TypeError(
              "Unknown duration unit "
                .concat(terms, ". Please use one of ")
                .concat(Object.keys(s).join(", "))
            );
          let n = _Mathfloor2(ms / s[unitPlural] / 1e3);
          let unitProperPlurality =
            1 === n && "ms" !== unitPlural ? unitSingular : unitPlural;
          return (
            negativeMultiplier * n +
            " " +
            _.phrase.call(this, unitProperPlurality)
          );
        }
        (0 == ms || void 0 === terms) && (terms = 1);
        let timeLeft = ms;
        let ret = [];
        if (0 == ms) ret = ["0 ms"];
        else {
          let units = [...Object.keys(s).reverse(), "ms"];
          for (let i = 0, unit; (unit = units[i]); i++) {
            let unitMs = unit in s ? 1e3 * s[unit] : 1;
            let unitValue = _Mathfloor2(timeLeft / unitMs);
            if (((timeLeft %= unitMs), 0 < unitValue && ret.length < terms)) {
              let unitProperPlurality =
                1 === unitValue && "ms" !== unit ? unit.slice(0, -1) : unit;
              ret.push(
                negativeMultiplier * unitValue +
                  " " +
                  _.phrase.call(this, unitProperPlurality)
              );
            } else if (0 < ret.length) break;
          }
        }
        return 1 === arguments.length ? ret[0] : ret;
      },
      { needsContext: !0, multiValued: !0 }
    )),
      $.extend(_.util, {
        fixDateString: function (date) {
          date = date.trim();
          var hasDate = /^\d{4}-\d{2}(-\d{2})?/.test(date);
          var hasTime = -1 < date.indexOf(":");
          return hasDate || hasTime
            ? ((date = hasDate
                ? date.replace(/^(\d{4}-\d{2})(?!-\d{2})/, "$1-01")
                : _.$today + " " + date),
              hasTime
                ? (date = date.replace(/\-(\d{2})\s+(?=\d{2}:)/, "-$1T"))
                : (date += "T00:00:00"),
              (date = date.replace(/\s+/g, "")),
              date)
            : null;
        },
        dateComponent: function (
          component,
          date,
          format,
          locale = Mavo.locale
        ) {
          if (1 === arguments.length && component + "s" in s)
            return _[component + "s"]();
          var dateO = $u.date(date);
          if ("year" === component) {
            date = date && date.match ? date : date + "";
            var ret = dateO
              ? dateO.getFullYear() + ""
              : (date.match(/\b[1-9]\d\d\b|\d+/) || [])[0];
          }
          if (!ret && !dateO) return "";
          var ret = ret || numeric[component](dateO);
          return format
            ? /^0+$/.test(format)
              ? (ret + "").padStart(format.length, "0").slice(-format.length)
              : ((format =
                  { name: "long", shortname: "short" }[format] || format),
                (ret = dateO.toLocaleString(locale, { [component]: format })),
                (ret = ret.replace(/\u200e/g, "")),
                ret)
            : "year" === component
            ? ret
            : +ret;
        },
        date: function (date) {
          var _date$match;
          if (((date = val(date)), !date)) return null;
          var object = new Date(date);
          if (
            "string" !== $.type(date) ||
            (!isNaN(object) && object + "" == date)
          )
            return object;
          if (((date = $u.fixDateString(date)), null === date)) return null;
          var timezone =
            null === (_date$match = date.match(/[+-]\d{2}:?\d{2}|Z$/)) ||
            void 0 === _date$match
              ? void 0
              : _date$match[0];
          if (timezone) date = new Date(date);
          else {
            var fields = date.match(/\d+/g);
            date = new Date(
              fields[0],
              (fields[1] || 1) - 1,
              fields[2] || 1,
              fields[3] || 0,
              fields[4] || 0,
              fields[5] || 0,
              fields[6] || 0
            );
          }
          return isNaN(date) ? null : date;
        },
      });
  })(Bliss, Mavo.value, Mavo.Functions),
  (function ($, val, $u) {
    var _Mathmax3 = Math.max;
    var _ = (Mavo.Script = {
      $fn: self.Proxy
        ? new Proxy(
            { [Symbol.unscopables]: { undefined: !0 } },
            {
              get: (data, property) => {
                var _property$toLowerCase, _property$toLowerCase2;
                var propertyL =
                    null !==
                      (_property$toLowerCase =
                        null === property ||
                        void 0 === property ||
                        null ===
                          (_property$toLowerCase2 = property.toLowerCase) ||
                        void 0 === _property$toLowerCase2
                          ? void 0
                          : _property$toLowerCase2.call(property)) &&
                    void 0 !== _property$toLowerCase
                      ? _property$toLowerCase
                      : property,
                  ret;
                return (
                  propertyL in Mavo.Actions.Functions &&
                    (Mavo.Actions.running
                      ? (ret = Mavo.Actions.Functions[propertyL])
                      : (ret = Mavo.Actions.nope)),
                  void 0 === ret &&
                    (propertyL in Mavo.Functions
                      ? (ret = Mavo.Functions[propertyL])
                      : (ret = Math[property] || Math[propertyL])),
                  ret
                );
              },
              has: (data, property) => {
                var propertyL = property.toLowerCase();
                return (
                  propertyL in Mavo.Functions ||
                  propertyL in Mavo.Actions.Functions ||
                  property in Math ||
                  propertyL in Math
                );
              },
            }
          )
        : Mavo.Functions,
      addUnaryOperator: function (name, o) {
        return (
          o.symbol &&
            Mavo.toArray(o.symbol).forEach((symbol) => {
              (_.unarySymbols[symbol] = name), jsep.addUnaryOp(symbol);
            }),
          (operand) =>
            _.unaryOperation(operand, (operand) => o.scalar(val(operand)))
        );
      },
      unaryOperation: function (operand, scalar) {
        return Array.isArray(operand) ? operand.map(scalar) : scalar(operand);
      },
      binaryOperation: function (a, b, o = {}) {
        o.scalar = "function" == typeof o ? o : o.scalar;
        var result;
        if (!Array.isArray(b))
          result = Array.isArray(a)
            ? a.map((n) => o.scalar(n, b))
            : o.scalar(a, b);
        else if (Array.isArray(a)) {
          result = [];
          var max = _Mathmax3(a.length, b.length);
          var leftUnary = o.leftUnary || o.unary;
          var rightUnary = o.rightUnary || o.unary;
          var leftDefault =
            void 0 === o.leftDefault ? o.default : o.leftDefault;
          var rightDefault =
            void 0 === o.rightDefault ? o.default : o.rightDefault;
          for (let i = 0; i < max; i++)
            result[i] =
              o.comparison && (void 0 === a[i] || void 0 === b[i])
                ? o.default
                : void 0 === a[i]
                ? rightUnary
                  ? rightUnary(b[i])
                  : o.scalar(leftDefault, b[i])
                : void 0 === b[i]
                ? leftUnary
                  ? leftUnary(a[i])
                  : o.scalar(a[i], rightDefault)
                : o.scalar(a[i], b[i]);
        } else result = b.map((n) => o.scalar(a, n));
        return result;
      },
      addBinaryOperator: function (name, o) {
        return (
          o.symbol &&
            Mavo.toArray(o.symbol).forEach((symbol) => {
              (_.symbols[symbol] = name),
                o.precedence && jsep.addBinaryOp(symbol, o.precedence);
            }),
          (o.default = void 0 === o.default ? 0 : o.default),
          o.code ||
            function (...operands) {
              1 === operands.length &&
                Array.isArray(operands[0]) &&
                (operands = [...operands[0]]),
                o.raw || (operands = operands.map(val));
              var prev = !!o.comparison || operands[0],
                result;
              for (let i = 1; i < operands.length; i++) {
                let a = o.comparison ? operands[i - 1] : prev;
                let b = operands[i];
                Array.isArray(b) &&
                  "number" == typeof o.default &&
                  (b = $u.numbers(b));
                var result = _.binaryOperation(a, b, o);
                prev = o.comparison
                  ? _.binaryOperation(prev, result, _.operators.and)
                  : result;
              }
              return prev;
            }
        );
      },
      symbols: {},
      unarySymbols: {},
      getOperatorName: (op, unary) =>
        _[unary ? "unarySymbols" : "symbols"][op] || op,
      isComparisonOperator: (op) => {
        if (op) {
          let operatorDefinition = _.operators[_.symbols[op]];
          return operatorDefinition && operatorDefinition.comparison;
        }
      },
      isStatic: (node) => {
        if ("Identifier" === node.type) return !1;
        for (let property of _.childProperties)
          if (
            node[property] &&
            "callee" !== property &&
            !_.isStatic(node[property])
          )
            return !1;
        return !0;
      },
      operators: {
        not: { symbol: "!", scalar: (a) => !val(a) },
        multiply: { scalar: (a, b) => a * b, default: 1, symbol: "*" },
        divide: {
          scalar: (a, b) => a / b,
          rightUnary: (b) => b,
          default: 1,
          symbol: "/",
        },
        addition: {
          scalar: (a, b) => {
            if (isNaN(a) || isNaN(b)) {
              var dateA = $u.date(a),
                dateB = $u.date(b);
              if (dateA || dateB) return +dateA + +dateB;
            }
            return +a + +b;
          },
          symbol: "+",
        },
        plus: { scalar: (a) => +a, symbol: "+" },
        subtract: {
          scalar: (a, b) => {
            if (isNaN(a) || isNaN(b)) {
              var dateA = $u.date(a),
                dateB = $u.date(b);
              if (dateA && dateB) return dateA - dateB;
            }
            return a - b;
          },
          symbol: "-",
        },
        minus: { scalar: (a) => -a, symbol: "-" },
        mod: {
          scalar: (a, b) => {
            var ret = a % b;
            return (ret += 0 > ret ? b : 0), ret;
          },
          symbol: "mod",
          precedence: 10,
        },
        lte: {
          comparison: !0,
          scalar: (a, b) => (([a, b] = _.getNumericalOperands(a, b)), a <= b),
          default: !1,
          symbol: "<=",
        },
        lt: {
          comparison: !0,
          scalar: (a, b) => (([a, b] = _.getNumericalOperands(a, b)), a < b),
          default: !1,
          symbol: "<",
        },
        gte: {
          comparison: !0,
          scalar: (a, b) => (([a, b] = _.getNumericalOperands(a, b)), a >= b),
          default: !1,
          symbol: ">=",
        },
        gt: {
          comparison: !0,
          scalar: (a, b) => (([a, b] = _.getNumericalOperands(a, b)), a > b),
          default: !1,
          symbol: ">",
        },
        eq: {
          comparison: !0,
          scalar: (a, b) => a == b || Mavo.safeToJSON(a) === Mavo.safeToJSON(b),
          symbol: ["=", "=="],
          default: !1,
          precedence: 7,
        },
        neq: {
          comparison: !0,
          scalar: (a, b) => a != b && Mavo.safeToJSON(a) !== Mavo.safeToJSON(b),
          symbol: ["!="],
          default: !0,
          precedence: 7,
        },
        and: {
          scalar: (a, b) => a && b,
          default: !1,
          symbol: ["&&", "and"],
          precedence: 2,
        },
        or: {
          scalar: (a, b) => a || b,
          default: !1,
          symbol: ["||", "or"],
          precedence: 2,
        },
        concatenate: {
          symbol: "&",
          default: "",
          scalar: (a, b) => {
            var _Mavo$value, _Mavo$value2;
            return (
              (a =
                null !== (_Mavo$value = Mavo.value(a)) && void 0 !== _Mavo$value
                  ? _Mavo$value
                  : ""),
              (b =
                null !== (_Mavo$value2 = Mavo.value(b)) &&
                void 0 !== _Mavo$value2
                  ? _Mavo$value2
                  : ""),
              "" + a + b
            );
          },
          precedence: 10,
        },
        keyvalue: {
          symbol: ":",
          code: (...operands) => {
            var i = operands.length - 1;
            for (var value = operands[i]; i--; )
              value = { [operands[i]]: value };
            return value;
          },
          transformation: (node) => {
            "Identifier" == node.left.type &&
              (node.left = {
                type: "Literal",
                value: node.left.name,
                raw: JSON.stringify(node.left.name),
              });
          },
          precedence: 4,
        },
        filter: {
          symbol: "where",
          code: (a, ...filters) => {
            for (let b of filters)
              Array.isArray(a)
                ? Array.isArray(b)
                  ? (a = a.map((v, i) => (val(b[i]) ? v : null)))
                  : ((b = val(b)),
                    (a =
                      "boolean" == typeof b
                        ? b
                          ? a
                          : a.map(() => null)
                        : a.map((v) => (v == b ? v : null))))
                : (a = val(b) ? a : null);
            return a;
          },
          precedence: 1,
          postFlattenTransformation: (node) => {
            var object = node.arguments[0];
            for (let i = 1; i < node.arguments.length; i++)
              _.isStatic(node.arguments[i]) ||
                (node.arguments[i] = Object.assign(_.parse("scope()"), {
                  arguments: [object, node.arguments[i]],
                }));
          },
        },
        range: {
          symbol: "..",
          scalar: (a, b) => Mavo.Functions.range(a, b),
          precedence: 2,
          export: !1,
        },
        has: {
          symbol: "in",
          code: function (needle, ...haystacks) {
            var ret;
            return (
              haystacks.map((b) => {
                if (Array.isArray(b))
                  var op = (a) => {
                    var fn =
                      "object" === $.type(val(a)) ? Mavo.safeToJSON : val;
                    return -1 < b.map(fn).indexOf(fn(a));
                  };
                else if ("object" === $.type(b))
                  var op = (a) => Mavo.in(val(a), b);
                else var op = (a) => Mavo.Functions.eq(a, b);
                var result = Mavo.Script.unaryOperation(needle, op);
                ret = void 0 === ret ? result : Mavo.Functions.and(result, ret);
              }),
              ret
            );
          },
          precedence: 3,
        },
        group_by: {
          symbol: "by",
          code: (array, key) => {
            var _key$, _key$$Mavo$toNode;
            (array = Mavo.toArray(array)), (key = Mavo.toArray(key));
            var property =
              key[Mavo.as] ||
              (null === (_key$ = key[0]) ||
              void 0 === _key$ ||
              null === (_key$$Mavo$toNode = _key$[Mavo.toNode]) ||
              void 0 === _key$$Mavo$toNode
                ? void 0
                : _key$$Mavo$toNode.property);
            var groups = new Mavo.BucketMap({ arrays: !0 });
            var ret = [];
            return (
              (ret[Mavo.groupedBy] = !0),
              array.forEach((item, i) => {
                let k = i < key.length ? Mavo.value(key[i]) : null;
                groups.set(k, item);
              }),
              Mavo.in(Mavo.route, array) &&
                (ret[Mavo.route] = Object.assign({}, array[Mavo.route])),
              groups.forEach((items, value) => {
                var obj = {
                  $value: value,
                  [property || "$value"]: value,
                  $items: items,
                };
                Mavo.in(Mavo.route, array) &&
                  ((items[Mavo.route] = obj[Mavo.route] =
                    Object.assign({}, array[Mavo.route])),
                  (obj[Mavo.route] = $.each(
                    items[Mavo.route],
                    () => new Set(["$items"])
                  ))),
                  ret.push(obj);
              }),
              Mavo.Data.proxify(ret)
            );
          },
          precedence: 2,
        },
        groupby: {
          code: $u.deprecatedFunction("group_by", "groupby"),
          precedence: 2,
        },
        as: {
          symbol: "as",
          code: (property, name) => {
            if (
              void 0 !== property &&
              "array" === $.type(property) &&
              void 0 !== name
            ) {
              var _name$Mavo$toNode, _name$, _name$$Mavo$toNode;
              var ret = property.slice();
              if (
                !Array.isArray(name) &&
                void 0 !==
                  (null === name ||
                  void 0 === name ||
                  null === (_name$Mavo$toNode = name[Mavo.toNode]) ||
                  void 0 === _name$Mavo$toNode
                    ? void 0
                    : _name$Mavo$toNode.property)
              ) {
                var _name$Mavo$toNode2;
                return (
                  (ret[Mavo.as] =
                    null === name ||
                    void 0 === name ||
                    null === (_name$Mavo$toNode2 = name[Mavo.toNode]) ||
                    void 0 === _name$Mavo$toNode2
                      ? void 0
                      : _name$Mavo$toNode2.property),
                  ret
                );
              }
              if ("string" === $.type(name)) return (ret[Mavo.as] = name), ret;
              if (
                void 0 !==
                (null === (_name$ = name[0]) ||
                void 0 === _name$ ||
                null === (_name$$Mavo$toNode = _name$[Mavo.toNode]) ||
                void 0 === _name$$Mavo$toNode
                  ? void 0
                  : _name$$Mavo$toNode.property)
              ) {
                var _name$2, _name$2$Mavo$toNode;
                return (
                  (ret[Mavo.as] =
                    null === (_name$2 = name[0]) ||
                    void 0 === _name$2 ||
                    null === (_name$2$Mavo$toNode = _name$2[Mavo.toNode]) ||
                    void 0 === _name$2$Mavo$toNode
                      ? void 0
                      : _name$2$Mavo$toNode.property),
                  ret
                );
              }
              return property;
            }
            return property;
          },
          precedence: 3,
        },
      },
      getNumericalOperands: function (a, b) {
        if (isNaN(a) || isNaN(b)) {
          var da = $u.date(a),
            db = $u.date(b);
          if (da && db) return [da, db];
        }
        return [a, b];
      },
      childProperties: [
        "arguments",
        "callee",
        "left",
        "right",
        "argument",
        "elements",
        "test",
        "consequent",
        "alternate",
        "object",
        "property",
        "body",
      ],
      walk: function (node, callback, o = {}, property, parent) {
        if (!o.type || node.type === o.type)
          var ret = callback(node, property, parent);
        if (!o.ignore || -1 === o.ignore.indexOf(node.type))
          if (Array.isArray(node))
            for (let n of node) _.walk(n, callback, o, property, node);
          else
            _.childProperties.forEach((property) => {
              node[property] &&
                _.walk(node[property], callback, o, property, node);
            });
        return void 0 !== ret && parent && (parent[property] = ret), ret;
      },
      serializers: {
        BinaryExpression: (node) =>
          ""
            .concat(_.serialize(node.left, node), " ")
            .concat(node.operator, " ")
            .concat(_.serialize(node.right, node)),
        UnaryExpression: (node) =>
          "".concat(node.operator).concat(_.serialize(node.argument, node)),
        CallExpression: (node) => {
          var callee = node.callee;
          let root = node.callee;
          let parent = node;
          let prop = "callee";
          for (; "MemberExpression" === root.type; )
            (parent = root), (root = root.object), (prop = "object");
          if (
            ("MemberExpression" === node.callee.type &&
              "Identifier" === node.callee.property.type &&
              "call" === node.callee.property.name &&
              (callee = node.callee.object),
            "Identifier" === root.type)
          ) {
            var name = root.name;
            if ("scope" === name) return _.serializeScopeCall(node.arguments);
            name in Mavo.Script.$fn &&
              (parent[prop] = {
                type: "MemberExpression",
                computed: !1,
                object: { type: "Identifier", name: "$fn" },
                property: root,
              });
          }
          var nameSerialized = _.serialize(node.callee, node);
          var argsSerialized = node.arguments.map((n) => _.serialize(n, node));
          return ""
            .concat(nameSerialized, "(")
            .concat(argsSerialized.join(", "), ")");
        },
        ConditionalExpression: (node) =>
          ""
            .concat(_.serialize(node.test, node), "? ")
            .concat(_.serialize(node.consequent, node), " : ")
            .concat(_.serialize(node.alternate, node)),
        MemberExpression: (node) => {
          let n = node,
            pn;
          do {
            if ("CallExpression" === n.type && n.callee === pn) break;
            pn = n;
          } while ((n = n.parent));
          if (n) {
            var property = node.computed
              ? "[".concat(_.serialize(node.property, node), "]")
              : ".".concat(node.property.name);
            return "".concat(_.serialize(node.object, node)).concat(property);
          }
          n = node;
          let properties = [],
            object,
            objectParent;
          for (; "MemberExpression" === n.type; ) {
            let serialized = n.computed
              ? _.serialize(n.property, n)
              : '"'.concat(n.property.name, '"');
            properties.push(serialized),
              (objectParent = n),
              (object = n = n.object);
          }
          return "$fn.get("
            .concat(_.serialize(object, objectParent), ", ")
            .concat(properties.reverse().join(", "), ")");
        },
        ArrayExpression: (node) =>
          "[".concat(
            node.elements.map((n) => _.serialize(n, node)).join(", "),
            "]"
          ),
        Literal: (node) => {
          let quote = node.raw[0];
          if ("'" === quote || '"' === quote) {
            let content = node.raw.slice(1, -1);
            return (
              (content = content.replace(/\r/g, "\\r").replace(/\n/g, "\\n")),
              (content = content.replaceAll(quote, "\\" + quote)),
              quote + content + quote
            );
          }
          return node.raw;
        },
        Identifier: (node) => node.name,
        ThisExpression: () => "this",
        Compound: (node) =>
          node.body.map((n) => _.serialize(n, node)).join(", "),
      },
      transformations: {
        BinaryExpression: (node) => {
          var _def$transformation, _def$postFlattenTrans;
          let name = _.getOperatorName(node.operator);
          let def = _.operators[name];
          null === (_def$transformation = def.transformation) ||
          void 0 === _def$transformation
            ? void 0
            : _def$transformation.call(def, node);
          var nodeLeft = node;
          var ret = {
            type: "CallExpression",
            arguments: [],
            callee: { type: "Identifier", name },
          };
          if (def.comparison) {
            let comparisonOperands = [];
            do {
              let operatorName = _.getOperatorName(nodeLeft.operator);
              comparisonOperands.unshift({
                comparison: operatorName,
                operand: nodeLeft.right,
              }),
                (nodeLeft = nodeLeft.left);
            } while (
              !1 !== def.flatten &&
              _.isComparisonOperator(nodeLeft.operator)
            );
            let comparisonsHeterogeneous = !1;
            for (let i = 0; i < comparisonOperands.length - 1; i++)
              if (
                comparisonOperands[i].comparison !=
                comparisonOperands[i + 1].comparison
              ) {
                comparisonsHeterogeneous = !0;
                break;
              }
            ret.arguments.push(nodeLeft),
              comparisonsHeterogeneous
                ? ((ret.callee.name = "compare"),
                  comparisonOperands.forEach((co) => {
                    ret.arguments.push({
                      type: "Literal",
                      value: co.comparison,
                      raw: '"'.concat(co.comparison, '"'),
                    }),
                      ret.arguments.push(co.operand);
                  }))
                : comparisonOperands.forEach((co) => {
                    ret.arguments.push(co.operand);
                  });
          } else {
            do
              ret.arguments.unshift(nodeLeft.right), (nodeLeft = nodeLeft.left);
            while (
              !1 !== def.flatten &&
              nodeLeft.right &&
              _.getOperatorName(nodeLeft.operator) === name
            );
            ret.arguments.unshift(nodeLeft);
          }
          return (
            null === (_def$postFlattenTrans = def.postFlattenTransformation) ||
            void 0 === _def$postFlattenTrans
              ? void 0
              : _def$postFlattenTrans.call(def, ret),
            ret
          );
        },
        UnaryExpression: (node) => {
          var name = _.getOperatorName(node.operator, !0);
          if (name)
            return {
              type: "CallExpression",
              arguments: [node.argument],
              callee: { type: "Identifier", name },
            };
        },
        CallExpression: (node) => {
          if ("Identifier" == node.callee.type)
            if ("if" == node.callee.name) {
              node.callee.name = "iff";
              var condition = node.arguments[0];
              for (let i = 1; i < node.arguments.length; i++)
                2 == i &&
                  ((condition = _.parse("not()")),
                  condition.arguments.push(node.arguments[0])),
                  _.walk(
                    node.arguments[i],
                    (n) => {
                      var name = n.callee.name;
                      Mavo.Actions.Functions.hasOwnProperty(name) &&
                        !/if$/.test(name) &&
                        ((n.callee.name += "if"),
                        n.arguments.unshift(condition));
                    },
                    { type: "CallExpression" }
                  );
            } else if ("delete" == node.callee.name) node.callee.name = "clear";
            else {
              var def = Mavo.Functions[node.callee.name];
              def &&
                def.needsContext &&
                ((node.callee = {
                  type: "MemberExpression",
                  computed: !1,
                  object: node.callee,
                  property: { type: "Identifier", name: "call" },
                }),
                node.arguments.unshift({ type: "Identifier", name: "$this" }));
            }
        },
        ThisExpression: () => ({ type: "Identifier", name: "$this" }),
      },
      closest(node, type) {
        let n = node;
        do if (n.type === type) return n;
        while ((n = n.parent));
        return null;
      },
      serialize: (node, parent) => {
        var _$transformations$nod, _$transformations;
        if ("string" == typeof node) return node;
        parent && (node.parent = parent);
        var ret =
          null ===
            (_$transformations$nod = (_$transformations = _.transformations)[
              node.type
            ]) || void 0 === _$transformations$nod
            ? void 0
            : _$transformations$nod.call(_$transformations, node, parent);
        if (
          "object" == typeof ret &&
          null !== ret &&
          void 0 !== ret &&
          ret.type
        )
          node = ret;
        else if (void 0 !== ret) return ret;
        if (!node.type || !_.serializers[node.type])
          throw new TypeError(
            "Cannot understand this expression at all \uD83D\uDE14"
          );
        return _.serializers[node.type](node, parent);
      },
      rewrite: function (code, o) {
        let ast = _.parse(code);
        return o && (o.ast = ast), _.serialize(ast);
      },
      compile: function (code, o) {
        return /\S/.test(code)
          ? ((code = _.rewrite(code, o)),
            (code =
              "with (Mavo.Data.stub)\n\twith (data || {}) {\n\t\tlet $fn = Mavo.Script.$fn;\n\t\treturn (".concat(
                code,
                ");\n\t}"
              )),
            null !== o &&
              void 0 !== o &&
              o.actions &&
              (code =
                "\nMavo.Actions._running = Mavo.Actions.running;\nMavo.Actions.running = true;\n".concat(
                  code,
                  "\nMavo.Actions.running = Mavo.Actions._running;"
                )),
            new Function("data", code))
          : () => "";
      },
      parse: self.jsep,
      serializeScopeCall: (args) => {
        var withCode =
          "with (Mavo.Script.subScope(scope, $this) || {}) { return (".concat(
            _.serialize(args[1]),
            "); }"
          );
        return "(function() {\n\tvar scope = "
          .concat(
            _.serialize(args[0]),
            ";\n\tif (Array.isArray(scope)) {\n\t\treturn scope.map(function(scope) {\n\t\t\t"
          )
          .concat(withCode, "\n\t\t});\n\t}\n\n\t")
          .concat(withCode, "\n})()");
      },
      subScope: (proxy, $this) => {
        var unscopables = Object.keys($this).reduce(
          (o, k) => ((o[k] = !0), o),
          { $this: !0 }
        );
        return proxy && "object" == typeof proxy
          ? new Proxy(proxy, {
              get: (t, property, r) =>
                property === Symbol.unscopables
                  ? unscopables
                  : Reflect.get(t, property, r),
            })
          : proxy;
      },
    });
    for (let name in ((_.serializers.LogicalExpression =
      _.serializers.BinaryExpression),
    (_.transformations.LogicalExpression = _.transformations.BinaryExpression),
    _.operators)) {
      var _details$scalar;
      let details = _.operators[name];
      if (
        2 >
        (null === (_details$scalar = details.scalar) ||
        void 0 === _details$scalar
          ? void 0
          : _details$scalar.length)
      )
        var ret = _.addUnaryOperator(name, details);
      else var ret = _.addBinaryOperator(name, details);
      (details.code = details.code || ret),
        ret && !1 !== details.export && (Mavo.Functions[name] = ret);
    }
    Mavo.Functions.compare = function (...operands) {
      let result = !0;
      for (let i = 2; i < operands.length; i += 2) {
        let a = operands[i - 2];
        let op = operands[i - 1];
        let b = operands[i];
        let term = _.binaryOperation(a, b, Mavo.Script.operators[op]);
        result = _.binaryOperation(result, term, Mavo.Script.operators.and);
      }
      return result;
    };
  })(Bliss, Mavo.value, Mavo.Functions.util),
  (function ($) {
    Mavo.attributes.push("mv-action");
    let _ = (Mavo.Actions = {
      listener: (evt) => {
        let tag = "submit" === evt.type ? "form" : ":not(form)";
        let element = evt.target.closest(tag + "[mv-action]");
        if (element) {
          let node = Mavo.Node.get(element);
          (node && node.editing && "edit" !== node.modes) ||
            ("submit" === evt.type && evt.preventDefault(),
            element && _.run(element.getAttribute("mv-action"), element, evt));
        }
      },
      run: (code, element, evt) => {
        if (code) {
          let node = Mavo.Node.getClosest(element);
          if (node) {
            let expression = new Mavo.Expression(code, { actions: !0 });
            let previousEvt = Mavo.Functions.$evt;
            Mavo.Functions.$evt = evt;
            let ret = expression.eval(node.getLiveData());
            return (Mavo.Functions.$evt = previousEvt), ret;
          }
        }
      },
      getNodes: (ref) => {
        let node = _.getNode(ref);
        return node
          ? [node]
          : Mavo.toArray(ref)
              .map((n) => _.getNode(n))
              .filter((n) => n !== void 0);
      },
      getNode: (node) => {
        if (node instanceof Mavo.Node) return node;
        return null !== node && void 0 !== node && node[Mavo.toNode]
          ? node[Mavo.toNode]
          : void 0;
      },
      getCollection: (ref) => {
        var _collection$collectio;
        let collection = _.getNode(ref);
        return collection instanceof Mavo.Collection
          ? collection
          : null !==
              (_collection$collectio =
                null === collection || void 0 === collection
                  ? void 0
                  : collection.collection) && void 0 !== _collection$collectio
          ? _collection$collectio
          : null;
      },
      nope: () => {
        let actions = Object.keys(_.Functions).map((name) =>
          "".concat(name, "()")
        );
        Mavo.warn(
          "Mavo actions (".concat(
            actions,
            ") can only be used in the mv-action attribute."
          )
        );
      },
      Functions: {
        add: Object.assign(
          function (data, ref, index) {
            let args = [...arguments],
              collection;
            if (
              (3 > arguments.length &&
                (1 >= arguments.length
                  ? ([data, ref] = [void 0, data])
                  : 2 === arguments.length &&
                    ((collection = _.getCollection(ref)),
                    !collection &&
                      ((collection = _.getCollection(data)),
                      collection &&
                        ([data, ref, index] = [void 0, data, ref])))),
              !!ref)
            ) {
              if (
                ((collection = collection || _.getCollection(ref)),
                collection ||
                  ((collection = _.getCollection(this)),
                  collection && ([data, index] = args)),
                !collection)
              )
                return (
                  Mavo.warn(
                    "No collection or collection item provided to add().",
                    { once: !1 }
                  ),
                  data
                );
              if (void 0 === index) {
                let node = _.getNode(ref);
                node && node.collection === collection && (index = node.index);
              }
              return (Array.isArray(data) ? data : [data]).map((datum) => {
                let item = collection.add(void 0, index);
                return (
                  void 0 !== datum && item.render(datum),
                  collection.editing && collection.editItem(item),
                  item.getLiveData()
                );
              });
            }
          },
          { needsContext: !0 }
        ),
        move: (from, to, index) => {
          var _toNode;
          if (!from || void 0 === to) return;
          let toNode = _.getNode(to);
          "number" != $.type(to) ||
            (null !== (_toNode = toNode) &&
              void 0 !== _toNode &&
              _toNode.collection) ||
            (([index, to] = [to]), (toNode = void 0));
          let fromNodes = Mavo.toArray(from)
            .map(_.getNode)
            .filter((n) =>
              null === n || void 0 === n ? void 0 : n.closestCollection
            );
          let collection = (toNode || fromNodes[0]).closestCollection;
          if (!fromNodes.length)
            return collection
              ? (Mavo.warn(
                  "First parameter of move() was not a collection or collection item, using add() instead.",
                  { once: !1 }
                ),
                _.Functions.add(from, collection, index))
              : (Mavo.warn(
                  "You need to provide at least one collection or collection item for move() to have something to do.",
                  { once: !1 }
                ),
                from);
          let ret = _.Functions.add(from, collection, index);
          return Mavo.Collection.delete(fromNodes, { silent: !0 }), ret;
        },
        clear: (...ref) => {
          if (!ref.length || !ref[0]) return;
          let nodes = _.getNodes(ref.flat());
          let itemsToDelete = [];
          return (
            nodes.forEach((node) => {
              node &&
                (node instanceof Mavo.Collection
                  ? itemsToDelete.push(...node.children)
                  : node.collection
                  ? itemsToDelete.push(node)
                  : node.walk((n) => {
                      n instanceof Mavo.Primitive
                        ? (n.value = null)
                        : n !== node && _.Functions.clear(n);
                    }));
            }),
            Mavo.Collection.delete(itemsToDelete),
            nodes.map((n) => n.getLiveData())
          );
        },
        clearif: (condition, ...targets) => (
          (targets = targets.map((t) => Mavo.Functions.iff(condition, t))),
          _.Functions.clear(...targets)
        ),
        set: (ref, values) => {
          if (ref) {
            let node = _.getNode(ref);
            if (node) node.render(values);
            else {
              let wasArray = Array.isArray(ref);
              let nodes = _.getNodes(ref);
              nodes.length
                ? Mavo.Script.binaryOperation(
                    wasArray ? nodes : nodes[0],
                    values,
                    {
                      scalar: (node, value) =>
                        node ? node.render(value) : null,
                    }
                  )
                : Mavo.warn(
                    "The first parameter of set() needs to be one or more existing properties, ".concat(
                      Mavo.safeToJSON(ref),
                      " is not."
                    )
                  );
            }
            return values;
          }
        },
      },
    });
    for (let name in _.Functions) {
      let nameif = name + "if";
      nameif in _.Functions ||
        (_.Functions[nameif] = (condition, target, ...rest) => (
          (target = Mavo.Functions.iff(condition, target)),
          Mavo.value(condition) ? _.Functions[name](target, ...rest) : null
        ));
    }
    _.Functions.deleteif = _.Functions.clearif;
  })(Bliss, Bliss.$),
  (function ($) {
    var _ = (Mavo.Data = $.Class(
      class Data {
        constructor(node, data) {
          (this.node = node), data !== void 0 && (this.data = data);
        }
        get parent() {
          var _parent$liveData;
          var parent = this.node.parent;
          return null !==
            (_parent$liveData =
              null === parent || void 0 === parent
                ? void 0
                : parent.liveData) && void 0 !== _parent$liveData
            ? _parent$liveData
            : null;
        }
        get collection() {
          return this.node.collection;
        }
        get key() {
          return (this._key = this.collection
            ? this.node.index
            : this.node.property);
        }
        proxify() {
          return _.proxify(this.data);
        }
        update() {
          if (
            this.node instanceof Mavo.Collection ||
            this.node instanceof Mavo.ImplicitCollection
          ) {
            this.data.length = 0;
            for (var i = 0; i < this.node.children.length; i++)
              this.data[i] = this.node.children[i].liveData.data;
            if (this.node instanceof Mavo.ImplicitCollection) {
              for (var i = 0; i < this.data.length; i++)
                null === Mavo.value(this.data[i]) &&
                  (this.data.splice(i, 1), i--);
              this.updateParent();
            }
          } else if (this.node instanceof Mavo.Primitive) {
            var value = this.node.value;
            this.node.isDataNull({ live: !0 }) && (value = null),
              (this.data = Mavo.objectify(value)),
              (Mavo.isPlainObject(value) || Array.isArray(value)) &&
                _.computeRoutes(this.data),
              this.updateParent();
          }
        }
        updateParent() {
          if (this.parent)
            if (this.node instanceof Mavo.ImplicitCollection) {
              var data = 1 === this.data.length ? this.data[0] : this.data;
              this.parent.set(this.node.property, data, !0);
            } else if (this.collection instanceof Mavo.ImplicitCollection)
              this.parent.update();
            else {
              var key = this.key,
                isDeleted = !1;
              this.collection instanceof Mavo.Collection &&
                (isDeleted =
                  this.collection.children[this.node.index] !== this.node),
                void 0 === key ||
                  isDeleted ||
                  this.parent.set(key, this.data, !0);
            }
        }
        set(property, value, shallow) {
          (this.data[property] = value),
            _["computeRoute" + (shallow ? "" : "s")](
              value,
              property,
              this.data
            );
        }
        updateKey() {
          var oldKey = this._key;
          this.parent[oldKey] === this.data && delete this.parent[oldKey],
            this.updateParent();
        }
        resolve(property) {
          return _.resolve(property, this.data);
        }
      },
      {
        live: {
          data: function (data) {
            if (data !== this._data) {
              var _this$parent2;
              return (
                (this.isArray = Array.isArray(data)),
                (this._data = data),
                (data[Mavo.toNode] = this.node),
                (data[Mavo.parent] =
                  null === (_this$parent2 = this.parent) ||
                  void 0 === _this$parent2
                    ? void 0
                    : _this$parent2.data),
                (data[Mavo.mavo] = this.node.mavo),
                (this.proxy = this.proxify()),
                this.updateParent(),
                this._data
              );
            }
          },
        },
        static: {
          stub: self.Proxy
            ? new Proxy(
                { [Symbol.unscopables]: { data: !0, undefined: !0 } },
                {
                  get: (data, property) => {
                    var ret = Reflect.get(data, property);
                    if (ret !== void 0 || "string" != typeof property)
                      return ret;
                    var propertyL = property.toLowerCase();
                    if ("$" === propertyL[0] && propertyL in Mavo.Functions)
                      return Mavo.Functions[propertyL];
                    var propertyU = property.toUpperCase();
                    if (propertyU in Math) return Math[propertyU];
                    if (
                      "undefined" != typeof window &&
                      window.hasOwnProperty(property)
                    )
                      return window[property];
                    if ("$" !== property[0]) {
                      var $property = "$" + property.toLowerCase();
                      if ($property in Mavo.Functions)
                        return Mavo.Functions[$property];
                    }
                    return property;
                  },
                  has: (data, property) =>
                    Reflect.has(data, property) || "string" == typeof property,
                }
              )
            : Mavo.Functions,
          isItem(data) {
            return Array.isArray(
              null === data || void 0 === data ? void 0 : data[Mavo.parent]
            );
          },
          isCollection(data) {
            return (
              Array.isArray(data) &&
              (null === data || void 0 === data
                ? void 0
                : data[Mavo.toNode]) instanceof Mavo.Collection
            );
          },
          closest(obj, test) {
            var path = [];
            do {
              if (test(obj)) return { value: obj, path };
              path.push(obj[Mavo.property]);
            } while ((obj = obj[Mavo.parent]));
            return { value: null, path };
          },
          root(obj) {
            return _.closest(obj, (o) => !o[Mavo.parent]);
          },
          closestItem(obj) {
            return _.closest(obj, _.isItem);
          },
          closestArray(obj) {
            return _.closest(obj, Array.isArray);
          },
          getProperty(data) {
            var ret = _.isItem(data) ? data[Mavo.parent] : data;
            return ret[Mavo.property];
          },
          find(property, data, o = {}) {
            if (data && o.exclude !== data) {
              if (Mavo.in(property, data) && o.exclude !== data[property])
                return data[property];
              if (!data[Mavo.route] || !Mavo.in(property, data[Mavo.route])) {
                if (data[Mavo.property] === property) return data;
                if (_.isItem(data) && _.getProperty(data) === property)
                  return data;
                if (Array.isArray(data)) {
                  var ret = data
                    .map((a) => _.find(property, a))
                    .filter((x) => void 0 !== x);
                  if (ret.length) return ret.flat();
                }
                return;
              }
              var results = [],
                returnArray = Array.isArray(data),
                ret;
              (results[Mavo.route] = {}),
                (results[Mavo.mavo] = data[Mavo.mavo]);
              var findDown = (prop) => {
                var ret = _.find(property, data[prop], o);
                if (void 0 !== ret) {
                  if (Mavo.in(Mavo.route, ret))
                    for (var p in ret[Mavo.route]) results[Mavo.route][p] = !0;
                  Array.isArray(ret)
                    ? (results.push(...ret), (returnArray = !0))
                    : results.push(ret);
                }
              };
              if (Array.isArray(data) || !0 === data[Mavo.route][property])
                for (var prop in data) findDown(prop);
              else data[Mavo.route][property].forEach(findDown);
              return returnArray || 1 < results.length ? results : results[0];
            }
          },
          findUp(property, data) {
            let parent = data;
            let child;
            let isDataArray = _.isCollection(data);
            do {
              if (!_.isCollection(parent) || isDataArray) {
                let ret = _.find(property, parent, { exclude: child });
                if (ret !== void 0) return ret;
                if (_.getProperty(parent) === property) return parent;
              }
              (child = parent), (parent = parent[Mavo.parent]);
            } while (parent);
          },
          resolve(property, data) {
            if (property === Mavo.isProxy) return !0;
            if ("symbol" == typeof property) return data[property];
            var ret;
            var propertyIsNumeric = !isNaN(property);
            if (property in data) ret = data[property];
            else {
              if (_.isCollection(data) && data[Mavo.property] === property)
                return data;
              if (!propertyIsNumeric)
                if (property in _.special) ret = _.special[property](data);
                else if (data[Mavo.mavo]) {
                  var all = data[Mavo.mavo].root.liveData.data[Mavo.route];
                  Mavo.in(property, all) && (ret = _.findUp(property, data));
                } else
                  Mavo.in(Mavo.route, data) &&
                    Mavo.in(property, data[Mavo.route]) &&
                    (ret = _.find(property, data));
            }
            if (!propertyIsNumeric) var propertyL = property.toLowerCase();
            if (void 0 !== ret) {
              var proxify =
                null !== ret &&
                "object" == typeof ret &&
                (Mavo.route in ret || Mavo.toNode in ret);
              return proxify ? _.proxify(ret) : ret;
            }
            if (!propertyIsNumeric) {
              var _Mavo$all, _Mavo$all$property;
              if (
                isNaN(property) &&
                null !== (_Mavo$all = Mavo.all) &&
                void 0 !== _Mavo$all &&
                null !== (_Mavo$all$property = _Mavo$all[property]) &&
                void 0 !== _Mavo$all$property &&
                _Mavo$all$property.root
              )
                return Mavo.all[property].root.getLiveData();
              if ("$" !== property[0]) {
                var $property = "$" + propertyL;
                if ($property in _.special) return _.resolve($property, data);
              }
            }
          },
          has(property, data) {
            if (property === Mavo.isProxy) return !0;
            if ("string" != typeof property) return Reflect.has(data, property);
            if (_.getProperty(data) === property) return !0;
            var objects = [data, Mavo.all, _.special];
            if (objects.some((obj) => property in obj)) return !0;
            if ("string" == typeof property) {
              var propertyL = property.toLowerCase();
              if (
                propertyL !== property &&
                objects.some((obj) => propertyL in obj)
              )
                return !0;
              if ("$" !== propertyL[0] && "$" + propertyL in _.special)
                return !0;
            }
            return data[Mavo.mavo]
              ? Mavo.in(
                  property,
                  data[Mavo.mavo].root.liveData.data[Mavo.route]
                )
              : void 0;
          },
          proxify(data) {
            return data &&
              "object" == typeof data &&
              self.Proxy &&
              !data[Mavo.isProxy]
              ? new Proxy(data, {
                  get: (data, property) => _.resolve(property, data),
                  has: (data, property) => _.has(property, data),
                  set: function (data, property = "", value) {
                    return "symbol" == typeof property
                      ? Reflect.set(data, property, value)
                      : (Mavo.warn(
                          "You cannot set data via expressions. Attempt to set "
                            .concat(property.toString(), " to ")
                            .concat(value, " ignored.")
                        ),
                        value);
                  },
                })
              : data;
          },
          computeMetadata(object, property, parent) {
            object &&
              "object" == typeof object &&
              (property !== void 0 && (object[Mavo.property] = property),
              parent && !object[Mavo.parent] && (object[Mavo.parent] = parent));
          },
          computeRoute(object, property, parent) {
            if (
              "function" != typeof object &&
              (_.computeMetadata(object, property, parent),
              (Mavo.isPlainObject(object) || Array.isArray(object)) &&
                !object[Mavo.route] &&
                (object[Mavo.route] = {}),
              "number" !== $.type(property))
            )
              for (var child = object; parent; ) {
                var _child;
                parent[Mavo.route] || (parent[Mavo.route] = {});
                var up =
                  null === (_child = child) || void 0 === _child
                    ? void 0
                    : _child[Mavo.property];
                if (up && !0 !== parent[Mavo.route][property]) {
                  if (
                    (parent[Mavo.route][property] ||
                      (parent[Mavo.route][property] = new Set()),
                    parent[Mavo.route][property].has(up))
                  )
                    break;
                  parent[Mavo.route][property].add(up);
                } else parent[Mavo.route][property] = !0;
                (child = parent), (parent = parent[Mavo.parent]);
              }
          },
          computeRoutes(object, property, parent) {
            _.traverse(_.computeRoute, object, property, parent);
          },
          traverseDown(callback, object) {
            if (Array.isArray(object))
              object.forEach((item, i) =>
                _.traverse(callback, item, i, object)
              );
            else if (Mavo.isPlainObject(object))
              for (var prop in object)
                _.traverse(callback, object[prop], prop, object);
          },
          traverse(callback, object, property, parent) {
            callback(object, property, parent),
              _.traverseDown(callback, object, property, parent);
          },
          special: {
            $index: function (obj) {
              var closestItem = _.closestItem(obj).value;
              if (!closestItem) return -1;
              var property = closestItem[Mavo.property];
              return isNaN(property)
                ? closestItem[Mavo.parent].indexOf(closestItem)
                : property;
            },
            $item: function (obj) {
              return _.closestItem(obj).value;
            },
            $all: function (obj) {
              var _ret$;
              var arr = _.closestArray(obj);
              let path = arr.path.reverse(),
                index;
              [index, ...path] = path;
              var ret = arr.value.map((a) => $.value(a, ...path));
              return (
                0 < ret.length &&
                  null !== ret &&
                  void 0 !== ret &&
                  null !== (_ret$ = ret[0]) &&
                  void 0 !== _ret$ &&
                  _ret$[Mavo.route] &&
                  ((ret[Mavo.route] = $.each(ret[0][Mavo.route], () => !0)),
                  (ret[Mavo.mavo] = ret[0][Mavo.mavo])),
                $.lazy(ret, {
                  $previous: function () {
                    return ret.slice(0, index);
                  },
                  $next: function () {
                    return ret.slice(index);
                  },
                }),
                ret
              );
            },
            $next: function (obj) {
              var _arr$value;
              var arr = _.closestArray(obj);
              var path = arr.path.reverse();
              var index = arr.path[0];
              path = path.slice(1);
              var nextClosestItem =
                null === (_arr$value = arr.value) || void 0 === _arr$value
                  ? void 0
                  : _arr$value[index + 1];
              return nextClosestItem ? $.value(nextClosestItem, ...path) : null;
            },
            $previous: function (obj) {
              var _arr$value2;
              var arr = _.closestArray(obj);
              var path = arr.path.reverse();
              var index = arr.path[0];
              path = path.slice(1);
              var prevClosestItem =
                null === (_arr$value2 = arr.value) || void 0 === _arr$value2
                  ? void 0
                  : _arr$value2[index - 1];
              return prevClosestItem ? $.value(prevClosestItem, ...path) : null;
            },
            $this: function (obj) {
              return obj;
            },
          },
        },
      }
    ));
  })(Bliss, Bliss.$),
  (function ($) {
    function delay(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }
    var _class6, _temp3;
    let _ = Mavo.Backend.register(
      ((_temp3 = _class6 =
        class Github extends Mavo.Backend {
          constructor(url, o) {
            super(url, o),
              _defineProperty(this, "id", "Github"),
              _defineProperty(this, "oAuthParams", () => "&scope=repo"),
              this.permissions.on(["login", "read"]),
              this.login(!0);
          }
          update(url, o) {
            super.update(url, o);
            let extension = this.format.constructor.extensions[0] || ".json";
            for (const prop in ((this.defaults = {
              repo: "mv-data",
              filename: "".concat(this.mavo.id).concat(extension),
            }),
            (this.info = _.parseURL(this.source, this.defaults)),
            o))
              if (!["format", "mavo"].includes(prop)) {
                if ("graphql" === this.info.apiCall && "query" === prop) {
                  this.info.apiData = { query: o.query };
                  continue;
                }
                this.info[prop] = o[prop];
              }
            $.extend(this, this.info);
          }
          async get(url) {
            if (this.isAuthenticated() || !this.path || url) {
              let info = url ? _.parseURL(url) : this.info;
              if (info.apiData)
                return this.request(info.apiCall, info.apiData, "POST").then(
                  (response) => {
                    var _response$errors;
                    return null !== (_response$errors = response.errors) &&
                      void 0 !== _response$errors &&
                      _response$errors.length
                      ? Promise.reject(
                          response.errors.map((x) => x.message).join("\n")
                        )
                      : response.data;
                  }
                );
              let isRawAPICall = info.apiParams !== void 0;
              let responseType = isRawAPICall ? "response" : "json";
              let req = {
                responseType,
                headers: {
                  Accept: "application/vnd.github.squirrel-girl-preview",
                },
              };
              let response = await this.request(
                info.apiCall,
                { ref: this.branch },
                "GET",
                req
              );
              if (isRawAPICall) {
                let json = await response.json();
                let params = new URL(info.apiCall, this.constructor.apiDomain)
                  .searchParams;
                let maxPages = params.get("max_pages") - 1;
                if (
                  0 < maxPages &&
                  null === params.get("page") &&
                  Array.isArray(json)
                ) {
                  let next;
                  do {
                    var _response$headers$get, _response$headers$get2;
                    if (
                      ((next =
                        null ===
                          (_response$headers$get =
                            response.headers.get("Link")) ||
                        void 0 === _response$headers$get ||
                        null ===
                          (_response$headers$get2 =
                            _response$headers$get.match(
                              /<(.+?)>; rel="next"/
                            )) ||
                        void 0 === _response$headers$get2
                          ? void 0
                          : _response$headers$get2[1]),
                      !next)
                    )
                      break;
                    else if (
                      ((response = await this.request(
                        next,
                        { ref: this.branch },
                        "GET",
                        req
                      )),
                      response.ok)
                    ) {
                      let pageJSON = await response.json();
                      if (Array.isArray(pageJSON)) json.push(...pageJSON);
                      else break;
                    } else break;
                  } while (0 < --maxPages);
                }
                return json;
              }
              return info.repo && response.content
                ? _.atob(response.content)
                : response;
            } else {
              (url = new URL(
                "https://raw.githubusercontent.com/"
                  .concat(this.username, "/")
                  .concat(this.repo, "/")
                  .concat(this.branch || "main", "/")
                  .concat(this.path)
              )),
                url.searchParams.set("timestamp", Date.now());
              let response = await fetch(url.href);
              return response.ok
                ? ((this.branch = this.branch || "main"), response.text())
                : 404 === response.status &&
                  !this.branch &&
                  ((url.pathname = "/"
                    .concat(this.username, "/")
                    .concat(this.repo, "/master/")
                    .concat(this.path)),
                  (response = await fetch(url.href)),
                  response.ok)
                ? ((this.branch = "master"), response.text())
                : null;
            }
          }
          upload(file, path = this.path) {
            return Mavo.readFile(file)
              .then((dataURL) => {
                let base64 = dataURL.slice(5);
                let media = base64.match(/^\w+\/[\w+]+/)[0];
                return (
                  (media = media.replace("+", "\\+")),
                  (base64 = base64.replace(
                    RegExp("^".concat(media, "(;base64)?,")),
                    ""
                  )),
                  (path = this.path.replace(/[^/]+$/, "") + path),
                  this.put(base64, path, { isEncoded: !0 })
                );
              })
              .then((fileInfo) => this.getURL(path, fileInfo.commit.sha));
          }
          async put(serialized, path = this.path, o = {}) {
            if (!path) return;
            let repoCall = "repos/"
              .concat(this.username, "/")
              .concat(this.repo);
            let fileCall = "".concat(repoCall, "/contents/").concat(path);
            let commitPrefix =
              this.mavo.element.getAttribute("mv-github-commit-prefix") || "";
            serialized = o.isEncoded ? serialized : _.btoa(serialized);
            let repoInfo = await this.repoInfo;
            if (
              !repoInfo ||
              repoInfo.owner.login !== this.username ||
              repoInfo.name !== this.repo
            )
              try {
                var _this$branch;
                (repoInfo = await this.request(repoCall)),
                  null !== (_this$branch = this.branch) &&
                  void 0 !== _this$branch
                    ? _this$branch
                    : (this.branch = repoInfo.default_branch);
              } catch (e) {
                if (404 === e.status) {
                  var _this$options$private;
                  repoInfo = this.repoInfo = await this.request(
                    "user/repos",
                    {
                      name: this.repo,
                      private:
                        null !==
                          (_this$options$private = this.options.private) &&
                        void 0 !== _this$options$private
                          ? !!_this$options$private
                          : !!o.private,
                    },
                    "POST"
                  );
                }
              }
            if (!this.canPush()) {
              let forkInfo = await this.request(
                "".concat(repoCall, "/forks"),
                { name: this.repo },
                "POST"
              );
              (fileCall = "repos/"
                .concat(forkInfo.full_name, "/contents/")
                .concat(path)),
                (this.forkInfo = forkInfo);
              let fetchedForkInfo;
              do
                await delay(1e3),
                  (fetchedForkInfo = await this.request(
                    "repos/".concat(forkInfo.full_name, "/commits"),
                    { until: "1970-01-01T00:00:00Z" },
                    "HEAD"
                  ));
              while (!fetchedForkInfo);
              repoInfo = forkInfo = fetchedForkInfo;
            }
            let fileInfo;
            try {
              (fileInfo = await this.request(fileCall, { ref: this.branch })),
                (fileInfo = await this.request(
                  fileCall,
                  {
                    message:
                      commitPrefix +
                      this.mavo._("gh-updated-file", {
                        name: fileInfo.name || "file",
                      }),
                    content: serialized,
                    branch: this.branch,
                    sha: fileInfo.sha,
                  },
                  "PUT"
                ));
            } catch (xhr) {
              404 == xhr.status &&
                (fileInfo = await this.request(
                  fileCall,
                  {
                    message: commitPrefix + "Created file",
                    content: serialized,
                    branch: this.branch,
                  },
                  "PUT"
                ));
            }
            const env = { context: this, fileInfo };
            return Mavo.hooks.run("gh-after-commit", env), env.fileInfo;
          }
          login(passive) {
            return this.oAuthenticate(passive)
              .then(() => this.getUser())
              .catch((xhr) => {
                401 == xhr.status && this.logout();
              })
              .then(() => {
                if (
                  this.user &&
                  (this.permissions.on("logout"),
                  this.info.path && this.permissions.on(["edit", "save"]),
                  this.repo)
                )
                  return this.request(
                    "repos/".concat(this.username, "/").concat(this.repo)
                  )
                    .then((repoInfo) => {
                      var _this$branch2;
                      if (
                        (null !== (_this$branch2 = this.branch) &&
                        void 0 !== _this$branch2
                          ? _this$branch2
                          : (this.branch = repoInfo.default_branch),
                        (this.repoInfo = repoInfo),
                        !this.mavo.source && !this.canPush())
                      ) {
                        if (this.user.info.public_repos < repoInfo.forks) {
                          return this.request(
                            "https://api.github.com/graphql",
                            {
                              query:
                                "query {\n\t\t\t\t\t\t\t\t\t\t\t\t\t  viewer {\n\t\t\t\t\t\t\t\t\t\t\t\t\t    name\n\t\t\t\t\t\t\t\t\t\t\t\t\t      repositories(last: 100, isFork: true) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t      nodes {\n\t\t\t\t\t\t\t\t\t\t\t\t\t        url\n\t\t\t\t\t\t\t\t\t\t\t\t\t        parent {\n\t\t\t\t\t\t\t\t\t\t\t\t\t          nameWithOwner\n\t\t\t\t\t\t\t\t\t\t\t\t\t        }\n\t\t\t\t\t\t\t\t\t\t\t\t\t      }\n\t\t\t\t\t\t\t\t\t\t\t\t\t    }\n\t\t\t\t\t\t\t\t\t\t\t\t\t  }\n\t\t\t\t\t\t\t\t\t\t\t\t\t}",
                            },
                            "POST"
                          ).then((data) => {
                            let repos = data.data.viewer.repositories.nodes;
                            for (let i in repos)
                              if (
                                repos[i].parent.nameWithOwner ===
                                repoInfo.full_name
                              )
                                return (
                                  this.switchToMyForkDialog(repos[i].url),
                                  repoInfo
                                );
                            return repoInfo;
                          });
                        }
                        return this.request(repoInfo.forks_url).then(
                          (forks) => {
                            for (let i in forks)
                              if (forks[i].owner.login === this.user.username)
                                return (
                                  this.switchToMyForkDialog(forks[i].html_url),
                                  repoInfo
                                );
                            return repoInfo;
                          }
                        );
                      }
                      return repoInfo;
                    })
                    .then((repoInfo) => {
                      const env = { context: this, repoInfo };
                      return (
                        Mavo.hooks.run("gh-after-login", env), env.repoInfo
                      );
                    });
              });
          }
          canPush() {
            var _this$user, _this$user$username;
            return this.repoInfo
              ? this.repoInfo.permissions.push
              : (null === (_this$user = this.user) ||
                void 0 === _this$user ||
                null === (_this$user$username = _this$user.username) ||
                void 0 === _this$user$username
                  ? void 0
                  : _this$user$username.toLowerCase()) ==
                  this.username.toLowerCase();
          }
          logout() {
            return this.oAuthLogout().then(() => {
              this.user = null;
            });
          }
          getUser() {
            return this.user
              ? Promise.resolve(this.user)
              : this.request("user").then((info) => {
                  (this.user = {
                    username: info.login,
                    name: info.name || info.login,
                    avatar: info.avatar_url,
                    url: "https://github.com/" + info.login,
                    info,
                  }),
                    $.fire(this, "mv-login");
                });
          }
          getURL(path = this.path, sha) {
            let repoInfo = this.forkInfo || this.repoInfo;
            let repo = repoInfo.full_name;
            return (
              (path = path.replace(/ /g, "%20")),
              (repoInfo.pagesInfo =
                repoInfo.pagesInfo ||
                this.request("repos/".concat(repo, "/pages"), {}, "GET", {
                  headers: {
                    Accept:
                      "application/vnd.github.mister-fantastic-preview+json",
                  },
                })),
              repoInfo.pagesInfo
                .then((pagesInfo) => pagesInfo.html_url + path)
                .catch(() =>
                  "https://cdn.jsdelivr.net/gh/"
                    .concat(repo, "@")
                    .concat(sha || this.branch || "latest", "/")
                    .concat(path)
                )
            );
          }
          switchToMyForkDialog(forkURL) {
            let params = new URL(location).searchParams;
            return (
              params.append(
                "".concat(this.mavo.id, "-storage"),
                forkURL + "/" + this.path
              ),
              (this.notice = this.mavo.message(
                "\n\t\t\t"
                  .concat(
                    this.mavo._("gh-login-fork-options"),
                    '\n\t\t\t<form onsubmit="return false">\n\t\t\t\t<a href="'
                  )
                  .concat(location.pathname, "?")
                  .concat(params, '"><button>')
                  .concat(
                    this.mavo._("gh-use-my-fork"),
                    "</button></a>\n\t\t\t</form>"
                  ),
                { classes: "mv-inline", dismiss: ["button", "submit"] }
              )),
              void this.notice.closed.then((form) => {
                form &&
                  (history.pushState(
                    {},
                    "",
                    "".concat(location.pathname, "?").concat(params)
                  ),
                  location.replace(
                    "".concat(location.pathname, "?").concat(params)
                  ));
              })
            );
          }
          static test(url) {
            return (
              (url = new URL(url, Mavo.base)),
              /^((api\.)?github\.com|raw\.githubusercontent\.com)/.test(
                url.host
              )
            );
          }
          static parseURL(source, defaults = {}) {
            const ret = {};
            Object.defineProperties(ret, {
              apiCall: {
                get() {
                  var _this$resources, _this$apiParams;
                  let call = "repos/"
                    .concat(this.username, "/")
                    .concat(this.repo, "/")
                    .concat(
                      null !== (_this$resources = this.resources) &&
                        void 0 !== _this$resources
                        ? _this$resources
                        : "contents"
                    );
                  const path = this.path;
                  return (
                    path && (call += "/".concat(path)),
                    call +
                      (null !== (_this$apiParams = this.apiParams) &&
                      void 0 !== _this$apiParams
                        ? _this$apiParams
                        : "")
                  );
                },
                set(v) {
                  delete this.apiCall, (this.apiCall = v);
                },
                configurable: !0,
                enumerable: !0,
              },
              path: {
                get() {
                  return this.filename
                    ? (this.filepath ? this.filepath + "/" : "") + this.filename
                    : this.filepath;
                },
                set(v) {
                  delete this.path, (this.path = v);
                },
                configurable: !0,
                enumerable: !0,
              },
            });
            const url = new URL(source, Mavo.base);
            let path = url.pathname.slice(1).split("/");
            if (
              ((ret.username = path.shift()),
              (ret.repo = path.shift() || defaults.repo),
              /raw.githubusercontent.com$/.test(url.host))
            )
              ret.branch = path.shift();
            else if (/api.github.com$/.test(url.host)) {
              delete ret.username,
                delete ret.repo,
                (ret.apiParams = url.search),
                (ret.apiData = Mavo.Functions.from(source, "#"));
              const apiCall = url.pathname.slice(1) + ret.apiParams;
              if ("graphql" == apiCall)
                return (
                  (ret.apiCall = apiCall),
                  (ret.apiData = { query: ret.apiData }),
                  ret
                );
              path = url.pathname.slice(1).split("/");
              const firstSegment = path.shift();
              if ("repos" != firstSegment) return (ret.apiCall = apiCall), ret;
              (ret.username = path.shift()),
                (ret.repo = path.shift()),
                (ret.resources = path.shift());
            } else
              "blob" == path[0] && (path.shift(), (ret.branch = path.shift()));
            const lastSegment = path[path.length - 1];
            return (
              /\.\w+$/.test(lastSegment)
                ? ((ret.filename = lastSegment),
                  path.splice(path.length - 1, 1))
                : (ret.filename = ret.hasOwnProperty("apiParams")
                    ? ""
                    : defaults.filename),
              (ret.filepath = path.join("/") || defaults.filepath || ""),
              ret
            );
          }
        }),
      _defineProperty(_class6, "apiDomain", "https://api.github.com/"),
      _defineProperty(
        _class6,
        "oAuth",
        "https://github.com/login/oauth/authorize"
      ),
      _defineProperty(_class6, "key", "7e08e016048000bc594e"),
      _defineProperty(_class6, "btoa", (str) =>
        btoa(unescape(encodeURIComponent(str)))
      ),
      _defineProperty(_class6, "atob", (str) =>
        decodeURIComponent(escape(window.atob(str)))
      ),
      _temp3)
    );
  })(Bliss, Bliss.$);
//# sourceMappingURL=maps/mavo.es5.min.js.map
