/*! jsTree - v3.0.3 - 2014-08-06 - (MIT) */
(function(e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? e(require("jquery")) : e(jQuery)
})(function(e, t) {
    "use strict";
    if (!e.jstree) {
        var i = 0,
            s = !1,
            r = !1,
            n = !1,
            a = [],
            d = e("script:last").attr("src"),
            o = document,
            c = o.createElement("LI"),
            l, h;
        c.setAttribute("role", "treeitem"), l = o.createElement("I"), l.className = "jstree-icon jstree-ocl", c.appendChild(l), l = o.createElement("A"), l.className = "jstree-anchor disabled", l.setAttribute("href", "#"), h = o.createElement("I"), h.className = "jstree-icon jstree-themeicon jstree-custom-folder jstree-themeicon-custom", l.appendChild(h), c.appendChild(l), l = h = null, e.jstree = {
            version: "3.0.3",
            defaults: {
                plugins: []
            },
            plugins: {},
            path: d && -1 !== d.indexOf("/") ? d.replace(/\/[^\/]+$/, "") : "",
            idregex: /[\\:&!^|()\[\]<>@*'+~#";.,=\- \/${}%]/g
        }, e.jstree.create = function(t, s) {
            var r = new e.jstree.core(++i),
                n = s;
            return s = e.extend(!0, {}, e.jstree.defaults, s), n && n.plugins && (s.plugins = n.plugins), e.each(s.plugins, function(e, t) {
                "core" !== e && (r = r.plugin(t, s[t]))
            }), r.init(t, s), r
        }, e.jstree.core = function(e) {
            this._id = e, this._cnt = 0, this._wrk = null, this._data = {
                core: {
                    themes: {
                        name: !1,
                        dots: !1,
                        icons: !1
                    },
                    selected: [],
                    last_error: {},
                    working: !1,
                    worker_queue: []
                }
            }
        }, e.jstree.reference = function(i) {
            var s = null,
                r = null;
            if (i && i.id && (i = i.id), !r || !r.length) try {
                r = e(i)
            } catch (n) {}
            if (!r || !r.length) try {
                r = e("#" + i.replace(e.jstree.idregex, "\\$&"))
            } catch (n) {}
            return r && r.length && (r = r.closest(".jstree")).length && (r = r.data("jstree")) ? s = r : e(".jstree").each(function() {
                var r = e(this).data("jstree");
                return r && r._model.data[i] ? (s = r, !1) : t
            }), s
        }, e.fn.jstree = function(i) {
            var s = "string" == typeof i,
                r = Array.prototype.slice.call(arguments, 1),
                n = null;
            return this.each(function() {
                var a = e.jstree.reference(this),
                    d = s && a ? a[i] : null;
                return n = s && d ? d.apply(a, r) : null, a || s || i !== t && !e.isPlainObject(i) || e(this).data("jstree", new e.jstree.create(this, i)), (a && !s || i === !0) && (n = a || !1), null !== n && n !== t ? !1 : t
            }), null !== n && n !== t ? n : this
        }, e.expr[":"].jstree = e.expr.createPseudo(function(i) {
            return function(i) {
                return e(i).hasClass("jstree") && e(i).data("jstree") !== t
            }
        }), e.jstree.defaults.core = {
            data: !1,
            strings: !1,
            check_callback: !1,
            error: e.noop,
            animation: 200,
            multiple: !0,
            themes: {
                name: !1,
                url: !1,
                dir: !1,
                dots: !0,
                icons: !0,
                stripes: !1,
                variant: !1,
                responsive: !1
            },

            worker: !0,
            force_text: !1
        }, e.jstree.core.prototype = {
            plugin: function(t, i) {
                var s = e.jstree.plugins[t];
                return s ? (this._data[t] = {}, s.prototype = this, new s(i, this)) : this
            },
            init: function(t, i) {
                this._model = {
                    data: {
                        "#": {
                            id: "#",
                            parent: null,
                            parents: [],
                            children: [],
                            children_d: [],
                            state: {
                                loaded: !1
                            }
                        }
                    },
                    changed: [],
                    force_full_redraw: !1,
                    redraw_timeout: !1,
                    default_state: {
                        loaded: !0,
                        opened: !1,
                        selected: !1,
                        disabled: !1
                    }
                }, this.element = e(t).addClass("jstree jstree-" + this._id), this.settings = i, this.element.bind("destroyed", e.proxy(this.teardown, this)), this._data.core.ready = !1, this._data.core.loaded = !1, this._data.core.rtl = "rtl" === this.element.css("direction"), this.element[this._data.core.rtl ? "addClass" : "removeClass"]("jstree-rtl"), this.element.attr("role", "tree"), this.bind(), this.trigger("init"), this._data.core.original_container_html = this.element.find(" > ul > li").clone(!0), this._data.core.original_container_html.find("li").addBack().contents().filter(function() {
                    return 3 === this.nodeType && (!this.nodeValue || /^\s+$/.test(this.nodeValue))
                }).remove(), this.element.html("<ul class='jstree-container-ul jstree-children'><li class='jstree-initial-node jstree-loading jstree-leaf jstree-last'><i class='jstree-icon jstree-ocl'></i><a class='jstree-anchor' href='#'><i class='jstree-icon jstree-themeicon-hidden'></i>" + this.get_string("Loading ...") + "</a></li></ul>"), this._data.core.li_height = this.get_container_ul().children("li:eq(0)").height() || 24, this.trigger("loading"), this.load_node("#")
            },
            destroy: function(e) {
                e || this.element.empty(), this.element.unbind("destroyed", this.teardown), this.teardown()
            },
            teardown: function() {
                this.unbind(), this.element.removeClass("jstree").removeData("jstree").find("[class^='jstree']").addBack().attr("class", function() {
                    return this.className.replace(/jstree[^ ]*|$/gi, "")
                }), this.element = null
            },
            bind: function() {
                this.element.on("dblclick.jstree", function() {
                    if (document.selection && document.selection.empty) document.selection.empty();
                    else if (window.getSelection) {
                        var e = window.getSelection();
                        try {
                            e.removeAllRanges(), e.collapse()
                        } catch (t) {}
                    }
                }).on("click.jstree", ".jstree-ocl", e.proxy(function(e) {
                    this.toggle_node(e.target)
                }, this)).on("click.jstree", ".jstree-anchor", e.proxy(function(t) {

                     if(t.toElement.textContent.includes('pdf')){
                         console.log('pdf');


                     }


                    t.preventDefault(), e(t.currentTarget).focus(), this.activate_node(t.currentTarget, t)
                }, this)).on("keydown.jstree", ".jstree-anchor", e.proxy(function(t) {

                    if ("INPUT" === t.target.tagName) return !0;
                    var i = null;
                    switch (t.which) {
                        case 13:
                        case 32:
                            t.type = "click", e(t.currentTarget).trigger(t);
                            break;
                        case 37:
                            t.preventDefault(), this.is_open(t.currentTarget) ? this.close_node(t.currentTarget) : (i = this.get_prev_dom(t.currentTarget), i && i.length && i.children(".jstree-anchor").focus());
                            break;
                        case 38:
                            t.preventDefault(), i = this.get_prev_dom(t.currentTarget), i && i.length && i.children(".jstree-anchor").focus();
                            break;
                        case 39:
                            t.preventDefault(), this.is_closed(t.currentTarget) ? this.open_node(t.currentTarget, function(e) {
                                this.get_node(e, !0).children(".jstree-anchor").focus()
                            }) : (i = this.get_next_dom(t.currentTarget), i && i.length && i.children(".jstree-anchor").focus());
                            break;
                        case 40:
                            t.preventDefault(), i = this.get_next_dom(t.currentTarget), i && i.length && i.children(".jstree-anchor").focus();
                            break;
                        case 46:
                            t.preventDefault(), i = this.get_node(t.currentTarget), i && i.id && "#" !== i.id && (i = this.is_selected(i) ? this.get_selected() : i);
                            break;
                        case 113:
                            t.preventDefault(), i = this.get_node(t.currentTarget);
                            break;
                        default:
                    }
                }, this)).on("load_node.jstree", e.proxy(function(t, i) {
                    if (i.status && ("#" !== i.node.id || this._data.core.loaded || (this._data.core.loaded = !0, this.trigger("loaded")), !this._data.core.ready && !this.get_container_ul().find(".jstree-loading:eq(0)").length)) {
                        if (this._data.core.ready = !0, this._data.core.selected.length) {
                            if (this.settings.core.expand_selected_onload) {
                                var s = [],
                                    r, n;
                                for (r = 0, n = this._data.core.selected.length; n > r; r++) s = s.concat(this._model.data[this._data.core.selected[r]].parents);
                                for (s = e.vakata.array_unique(s), r = 0, n = s.length; n > r; r++) this.open_node(s[r], !1, 0)
                            }
                            this.trigger("changed", {
                                action: "ready",
                                selected: this._data.core.selected
                            })
                        }
                        setTimeout(e.proxy(function() {
                            this.trigger("ready")
                        }, this), 0)
                    }
                }, this)).on("init.jstree", e.proxy(function() {
                    var e = this.settings.core.themes;
                    this._data.core.themes.dots = e.dots, this._data.core.themes.stripes = e.stripes, this._data.core.themes.icons = e.icons, this.set_theme(e.name || "default", e.url), this.set_theme_variant(e.variant)
                }, this)).on("loading.jstree", e.proxy(function() {
                    this[this._data.core.themes.dots ? "show_dots" : "hide_dots"](), this[this._data.core.themes.icons ? "show_icons" : "hide_icons"](), this[this._data.core.themes.stripes ? "show_stripes" : "hide_stripes"]()
                }, this)).on("blur.jstree", ".jstree-anchor", e.proxy(function(t) {
                    e(t.currentTarget).filter(".jstree-hovered").mouseleave()
                }, this)).on("focus.jstree", ".jstree-anchor", e.proxy(function(t) {
                    this.element.find(".jstree-hovered").not(t.currentTarget).mouseleave(), e(t.currentTarget).mouseenter()
                }, this)).on("mouseenter.jstree", ".jstree-anchor", e.proxy(function(e) {
                    this.hover_node(e.currentTarget)
                }, this)).on("mouseleave.jstree", ".jstree-anchor", e.proxy(function(e) {
                    this.dehover_node(e.currentTarget)
                }, this))
            },
            unbind: function() {
                this.element.off(".jstree"), e(document).off(".jstree-" + this._id)
            },
            trigger: function(e, t) {
                t || (t = {}), t.instance = this, this.element.triggerHandler(e.replace(".jstree", "") + ".jstree", t)
            },
            get_container: function() {
                return this.element
            },
            get_container_ul: function() {
                return this.element.children(".jstree-children:eq(0)")
            },
            get_string: function(t) {
                var i = this.settings.core.strings;
                return e.isFunction(i) ? i.call(this, t) : i && i[t] ? i[t] : t
            },
            _firstChild: function(e) {
                e = e ? e.firstChild : null;
                while (null !== e && 1 !== e.nodeType) e = e.nextSibling;
                return e
            },
            _nextSibling: function(e) {
                e = e ? e.nextSibling : null;
                while (null !== e && 1 !== e.nodeType) e = e.nextSibling;
                return e
            },
            _previousSibling: function(e) {
                e = e ? e.previousSibling : null;
                while (null !== e && 1 !== e.nodeType) e = e.previousSibling;
                return e
            },
            get_node: function(t, i) {
                t && t.id && (t = t.id);
                var s;
                try {
                    if (this._model.data[t]) t = this._model.data[t];
                    else if (((s = e(t, this.element)).length || (s = e("#" + t.replace(e.jstree.idregex, "\\$&"), this.element)).length) && this._model.data[s.closest(".jstree-node").attr("id")]) t = this._model.data[s.closest(".jstree-node").attr("id")];
                    else {
                        if (!(s = e(t, this.element)).length || !s.hasClass("jstree")) return !1;
                        t = this._model.data["#"]
                    }
                    return i && (t = "#" === t.id ? this.element : e("#" + t.id.replace(e.jstree.idregex, "\\$&"), this.element)), t
                } catch (r) {
                    return !1
                }
            },
            get_path: function(e, t, i) {
                if (e = e.parents ? e : this.get_node(e), !e || "#" === e.id || !e.parents) return !1;
                var s, r, n = [];
                for (n.push(i ? e.id : e.text), s = 0, r = e.parents.length; r > s; s++) n.push(i ? e.parents[s] : this.get_text(e.parents[s]));
                return n = n.reverse().slice(1), t ? n.join(t) : n
            },
            get_next_dom: function(t, i) {
                var s;
                return t = this.get_node(t, !0), t[0] === this.element[0] ? (s = this._firstChild(this.get_container_ul()[0]), s ? e(s) : !1) : t && t.length ? i ? (s = this._nextSibling(t[0]), s ? e(s) : !1) : t.hasClass("jstree-open") ? (s = this._firstChild(t.children(".jstree-children")[0]), s ? e(s) : !1) : null !== (s = this._nextSibling(t[0])) ? e(s) : t.parentsUntil(".jstree", ".jstree-node").next(".jstree-node").eq(0) : !1
            },
            get_prev_dom: function(t, i) {
                var s;
                if (t = this.get_node(t, !0), t[0] === this.element[0]) return s = this.get_container_ul()[0].lastChild, s ? e(s) : !1;
                if (!t || !t.length) return !1;
                if (i) return s = this._previousSibling(t[0]), s ? e(s) : !1;
                if (null !== (s = this._previousSibling(t[0]))) {
                    t = e(s);
                    while (t.hasClass("jstree-open")) t = t.children(".jstree-children:eq(0)").children(".jstree-node:last");
                    return t
                }
                return s = t[0].parentNode.parentNode, s && s.className && -1 !== s.className.indexOf("jstree-node") ? e(s) : !1
            },
            get_parent: function(e) {
                return e = this.get_node(e), e && "#" !== e.id ? e.parent : !1
            },
            get_children_dom: function(e) {
                return e = this.get_node(e, !0), e[0] === this.element[0] ? this.get_container_ul().children(".jstree-node") : e && e.length ? e.children(".jstree-children").children(".jstree-node") : !1
            },
            is_parent: function(e) {
                return e = this.get_node(e), e && (e.state.loaded === !1 || e.children.length > 0)
            },
            is_loaded: function(e) {
                return e = this.get_node(e), e && e.state.loaded
            },
            is_loading: function(e) {
                return e = this.get_node(e), e && e.state && e.state.loading
            },
            is_open: function(e) {
                return e = this.get_node(e), e && e.state.opened
            },
            is_closed: function(e) {
                return e = this.get_node(e), e && this.is_parent(e) && !e.state.opened
            },
            is_leaf: function(e) {
                return !this.is_parent(e)
            },
            load_node: function(t, i) {
                var s, r, n, a, d;
                if (e.isArray(t)) return this._load_nodes(t.slice(), i), !0;
                if (t = this.get_node(t), !t) return i && i.call(this, t, !1), !1;
                if (t.state.loaded) {
                    for (t.state.loaded = !1, s = 0, r = t.children_d.length; r > s; s++) {
                        for (n = 0, a = t.parents.length; a > n; n++) this._model.data[t.parents[n]].children_d = e.vakata.array_remove_item(this._model.data[t.parents[n]].children_d, t.children_d[s]);
                        this._model.data[t.children_d[s]].state.selected && (d = !0, this._data.core.selected = e.vakata.array_remove_item(this._data.core.selected, t.children_d[s])), delete this._model.data[t.children_d[s]]
                    }
                    t.children = [], t.children_d = [], d && this.trigger("changed", {
                        action: "load_node",
                        node: t,
                        selected: this._data.core.selected
                    })
                }
                return t.state.loading = !0, this.get_node(t, !0).addClass("jstree-loading"), this._load_node(t, e.proxy(function(e) {
                    t = this._model.data[t.id], t.state.loading = !1, t.state.loaded = e;
                    var s = this.get_node(t, !0);
                    t.state.loaded && !t.children.length && s && s.length && !s.hasClass("jstree-leaf") && s.removeClass("jstree-closed jstree-open").addClass("jstree-leaf"), s.removeClass("jstree-loading"), this.trigger("load_node", {
                        node: t,
                        status: e
                    }), i && i.call(this, t, e)
                }, this)), !0
            },
            _load_nodes: function(e, t, i) {
                var s = !0,
                    r = function() {
                        this._load_nodes(e, t, !0)
                    },
                    n = this._model.data,
                    a, d;
                for (a = 0, d = e.length; d > a; a++) !n[e[a]] || n[e[a]].state.loaded && i || (this.is_loading(e[a]) || this.load_node(e[a], r), s = !1);
                s && t && !t.done && (t.call(this, e), t.done = !0)
            },
            _load_node: function(t, i) {
                var s = this.settings.core.data,
                    r;
                return s ? e.isFunction(s) ? s.call(this, t, e.proxy(function(s) {
                    s === !1 && i.call(this, !1), this["string" == typeof s ? "_append_html_data" : "_append_json_data"](t, "string" == typeof s ? e(s) : s, function(e) {
                        i.call(this, e)
                    })
                }, this)) : "object" == typeof s ? s.url ? (s = e.extend(!0, {}, s), e.isFunction(s.url) && (s.url = s.url.call(this, t)), e.isFunction(s.data) && (s.data = s.data.call(this, t)), e.ajax(s).done(e.proxy(function(s, r, n) {
                    var a = n.getResponseHeader("Content-Type");
                    return -1 !== a.indexOf("json") || "object" == typeof s ? this._append_json_data(t, s, function(e) {
                        i.call(this, e)
                    }) : -1 !== a.indexOf("html") || "string" == typeof s ? this._append_html_data(t, e(s), function(e) {
                        i.call(this, e)
                    }) : (this._data.core.last_error = {
                        error: "ajax",
                        plugin: "core",
                        id: "core_04",
                        reason: "Could not load node",
                        data: JSON.stringify({
                            id: t.id,
                            xhr: n
                        })
                    }, this.settings.core.error.call(this, this._data.core.last_error), i.call(this, !1))
                }, this)).fail(e.proxy(function(e) {
                    i.call(this, !1), this._data.core.last_error = {
                        error: "ajax",
                        plugin: "core",
                        id: "core_04",
                        reason: "Could not load node",
                        data: JSON.stringify({
                            id: t.id,
                            xhr: e
                        })
                    }, this.settings.core.error.call(this, this._data.core.last_error)
                }, this))) : (r = e.isArray(s) || e.isPlainObject(s) ? JSON.parse(JSON.stringify(s)) : s, "#" === t.id ? this._append_json_data(t, r, function(e) {
                    i.call(this, e)
                }) : (this._data.core.last_error = {
                    error: "nodata",
                    plugin: "core",
                    id: "core_05",
                    reason: "Could not load node",
                    data: JSON.stringify({
                        id: t.id
                    })
                }, this.settings.core.error.call(this, this._data.core.last_error), i.call(this, !1))) : "string" == typeof s ? "#" === t.id ? this._append_html_data(t, e(s), function(e) {
                    i.call(this, e)
                }) : (this._data.core.last_error = {
                    error: "nodata",
                    plugin: "core",
                    id: "core_06",
                    reason: "Could not load node",
                    data: JSON.stringify({
                        id: t.id
                    })
                }, this.settings.core.error.call(this, this._data.core.last_error), i.call(this, !1)) : i.call(this, !1) : "#" === t.id ? this._append_html_data(t, this._data.core.original_container_html.clone(!0), function(e) {
                    i.call(this, e)
                }) : i.call(this, !1)
            },
            _node_changed: function(e) {
                e = this.get_node(e), e && this._model.changed.push(e.id)
            },
            _append_html_data: function(t, i, s) {
                t = this.get_node(t), t.children = [], t.children_d = [];
                var r = i.is("ul") ? i.children() : i,
                    n = t.id,
                    a = [],
                    d = [],
                    o = this._model.data,
                    c = o[n],
                    l = this._data.core.selected.length,
                    h, _, u;
                for (r.each(e.proxy(function(t, i) {
                    h = this._parse_model_from_html(e(i), n, c.parents.concat()), h && (a.push(h), d.push(h), o[h].children_d.length && (d = d.concat(o[h].children_d)))
                }, this)), c.children = a, c.children_d = d, _ = 0, u = c.parents.length; u > _; _++) o[c.parents[_]].children_d = o[c.parents[_]].children_d.concat(d);
                this.trigger("model", {
                    nodes: d,
                    parent: n
                }), "#" !== n ? (this._node_changed(n), this.redraw()) : (this.get_container_ul().children(".jstree-initial-node").remove(), this.redraw(!0)), this._data.core.selected.length !== l && this.trigger("changed", {
                    action: "model",
                    selected: this._data.core.selected
                }), s.call(this, !0)
            },
            _append_json_data: function(t, i, s) {
                t = this.get_node(t), t.children = [], t.children_d = [], i.d && (i = i.d, "string" == typeof i && (i = JSON.parse(i))), e.isArray(i) || (i = [i]);
                var r = null,
                    n = {
                        df: this._model.default_state,
                        dat: i,
                        par: t.id,
                        m: this._model.data,
                        t_id: this._id,
                        t_cnt: this._cnt,
                        sel: this._data.core.selected
                    },
                    a = function(e, t) {
                        e.data && (e = e.data);
                        var i = e.dat,
                            s = e.par,
                            r = [],
                            n = [],
                            a = [],
                            d = e.df,
                            o = e.t_id,
                            c = e.t_cnt,
                            l = e.m,
                            h = l[s],
                            _ = e.sel,
                            u, g, f, p, m = function(e, i, s) {
                                s = s ? s.concat() : [], i && s.unshift(i);
                                var r = "" + e.id,
                                    n, o, c, h, _ = {
                                        id: r,
                                        text: e.text || "",
                                        icon: e.icon !== t ? e.icon : !0,
                                        parent: i,
                                        parents: s,
                                        children: e.children || [],
                                        children_d: e.children_d || [],
                                        data: e.data,
                                        state: {},
                                        li_attr: {
                                            id: !1
                                        },
                                        a_attr: {
                                            href: "#"
                                        },
                                        original: !1
                                    };
                                for (n in d) d.hasOwnProperty(n) && (_.state[n] = d[n]);
                                if (e && e.data && e.data.jstree && e.data.jstree.icon && (_.icon = e.data.jstree.icon), e && e.data && (_.data = e.data, e.data.jstree))
                                    for (n in e.data.jstree) e.data.jstree.hasOwnProperty(n) && (_.state[n] = e.data.jstree[n]);
                                if (e && "object" == typeof e.state)
                                    for (n in e.state) e.state.hasOwnProperty(n) && (_.state[n] = e.state[n]);
                                if (e && "object" == typeof e.li_attr)
                                    for (n in e.li_attr) e.li_attr.hasOwnProperty(n) && (_.li_attr[n] = e.li_attr[n]);
                                if (_.li_attr.id || (_.li_attr.id = r), e && "object" == typeof e.a_attr)
                                    for (n in e.a_attr) e.a_attr.hasOwnProperty(n) && (_.a_attr[n] = e.a_attr[n]);
                                for (e && e.children && e.children === !0 && (_.state.loaded = !1, _.children = [], _.children_d = []), l[_.id] = _, n = 0, o = _.children.length; o > n; n++) c = m(l[_.children[n]], _.id, s), h = l[c], _.children_d.push(c), h.children_d.length && (_.children_d = _.children_d.concat(h.children_d));
                                return delete e.data, delete e.children, l[_.id].original = e, _.state.selected && a.push(_.id), _.id
                            },
                            v = function(e, i, s) {
                                s = s ? s.concat() : [], i && s.unshift(i);
                                var r = !1,
                                    n, h, _, u, g;
                                do r = "j" + o + "_" + ++c; while (l[r]);
                                g = {
                                    id: !1,
                                    text: "string" == typeof e ? e : "",
                                    icon: "object" == typeof e && e.icon !== t ? e.icon : !0,
                                    parent: i,
                                    parents: s,
                                    children: [],
                                    children_d: [],
                                    data: null,
                                    state: {},
                                    li_attr: {
                                        id: !1
                                    },
                                    a_attr: {
                                        href: "#"
                                    },
                                    original: !1
                                };
                                for (n in d) d.hasOwnProperty(n) && (g.state[n] = d[n]);
                                if (e && e.id && (g.id = "" + e.id), e && e.text && (g.text = e.text), e && e.data && e.data.jstree && e.data.jstree.icon && (g.icon = e.data.jstree.icon), e && e.data && (g.data = e.data, e.data.jstree))
                                    for (n in e.data.jstree) e.data.jstree.hasOwnProperty(n) && (g.state[n] = e.data.jstree[n]);
                                if (e && "object" == typeof e.state)
                                    for (n in e.state) e.state.hasOwnProperty(n) && (g.state[n] = e.state[n]);
                                if (e && "object" == typeof e.li_attr)
                                    for (n in e.li_attr) e.li_attr.hasOwnProperty(n) && (g.li_attr[n] = e.li_attr[n]);
                                if (g.li_attr.id && !g.id && (g.id = "" + g.li_attr.id), g.id || (g.id = r), g.li_attr.id || (g.li_attr.id = g.id), e && "object" == typeof e.a_attr)
                                    for (n in e.a_attr) e.a_attr.hasOwnProperty(n) && (g.a_attr[n] = e.a_attr[n]);
                                if (e && e.children && e.children.length) {
                                    for (n = 0, h = e.children.length; h > n; n++) _ = v(e.children[n], g.id, s), u = l[_], g.children.push(_), u.children_d.length && (g.children_d = g.children_d.concat(u.children_d));
                                    g.children_d = g.children_d.concat(g.children)
                                }
                                return e && e.children && e.children === !0 && (g.state.loaded = !1, g.children = [], g.children_d = []), delete e.data, delete e.children, g.original = e, l[g.id] = g, g.state.selected && a.push(g.id), g.id
                            };
                        if (i.length && i[0].id !== t && i[0].parent !== t) {
                            for (g = 0, f = i.length; f > g; g++) i[g].children || (i[g].children = []), l["" + i[g].id] = i[g];
                            for (g = 0, f = i.length; f > g; g++) l["" + i[g].parent].children.push("" + i[g].id), h.children_d.push("" + i[g].id);
                            for (g = 0, f = h.children.length; f > g; g++) u = m(l[h.children[g]], s, h.parents.concat()), n.push(u), l[u].children_d.length && (n = n.concat(l[u].children_d));
                            for (g = 0, f = h.parents.length; f > g; g++) l[h.parents[g]].children_d = l[h.parents[g]].children_d.concat(n);
                            p = {
                                cnt: c,
                                mod: l,
                                sel: _,
                                par: s,
                                dpc: n,
                                add: a
                            }
                        } else {
                            for (g = 0, f = i.length; f > g; g++) u = v(i[g], s, h.parents.concat()), u && (r.push(u), n.push(u), l[u].children_d.length && (n = n.concat(l[u].children_d)));
                            for (h.children = r, h.children_d = n, g = 0, f = h.parents.length; f > g; g++) l[h.parents[g]].children_d = l[h.parents[g]].children_d.concat(n);
                            p = {
                                cnt: c,
                                mod: l,
                                sel: _,
                                par: s,
                                dpc: n,
                                add: a
                            }
                        }
                        return p
                    },
                    d = function(t, i) {
                        if (this._cnt = t.cnt, this._model.data = t.mod, i) {
                            var r, n, a = t.add,
                                d = t.sel,
                                o = this._data.core.selected.slice(),
                                c = this._model.data;
                            if (d.length !== o.length || e.vakata.array_unique(d.concat(o)).length !== d.length) {
                                for (r = 0, n = d.length; n > r; r++) - 1 === e.inArray(d[r], a) && -1 === e.inArray(d[r], o) && (c[d[r]].state.selected = !1);
                                for (r = 0, n = o.length; n > r; r++) - 1 === e.inArray(o[r], d) && (c[o[r]].state.selected = !0)
                            }
                        }
                        t.add.length && (this._data.core.selected = this._data.core.selected.concat(t.add)), this.trigger("model", {
                            nodes: t.dpc,
                            parent: t.par
                        }), "#" !== t.par ? (this._node_changed(t.par), this.redraw()) : this.redraw(!0), t.add.length && this.trigger("changed", {
                            action: "model",
                            selected: this._data.core.selected
                        }), s.call(this, !0)
                    };
                if (this.settings.core.worker && window.Blob && window.URL && window.Worker) try {
                    null === this._wrk && (this._wrk = window.URL.createObjectURL(new window.Blob(["self.onmessage = " + ("" + a).replace(/return ([^;}]+)[\s;}]+$/, "postMessage($1);}")], {
                        type: "text/javascript"
                    }))), r = new window.Worker(this._wrk), r.onmessage = e.proxy(function(e) {
                        d.call(this, e.data, !0), this._data.core.working = !1, this._data.core.worker_queue.length && this._append_json_data.apply(this, this._data.core.worker_queue.shift())
                    }, this), this._data.core.working ? this._data.core.worker_queue.push([t, i, s]) : (this._data.core.working = !0, r.postMessage(n))
                } catch (o) {
                    d.call(this, a(n), !1)
                } else d.call(this, a(n), !1)
            },
            _parse_model_from_html: function(i, s, r) {
                r = r ? [].concat(r) : [], s && r.unshift(s);
                var n, a, d = this._model.data,
                    o = {
                        id: !1,
                        text: !1,
                        icon: !0,
                        parent: s,
                        parents: r,
                        children: [],
                        children_d: [],
                        data: null,
                        state: {},
                        li_attr: {
                            id: !1
                        },
                        a_attr: {
                            href: "#"
                        },
                        original: !1
                    },
                    c, l, h;
                for (c in this._model.default_state) this._model.default_state.hasOwnProperty(c) && (o.state[c] = this._model.default_state[c]);
                if (l = e.vakata.attributes(i, !0), e.each(l, function(i, s) {
                        return s = e.trim(s), s.length ? (o.li_attr[i] = s, "id" === i && (o.id = "" + s), t) : !0
                    }), l = i.children("a").eq(0), l.length && (l = e.vakata.attributes(l, !0), e.each(l, function(t, i) {
                        i = e.trim(i), i.length && (o.a_attr[t] = i)
                    })), l = i.children("a:eq(0)").length ? i.children("a:eq(0)").clone() : i.clone(), l.children("ins, i, ul").remove(), l = l.html(), l = e("<div />").html(l), o.text = this.settings.core.force_text ? l.text() : l.html(), l = i.data(), o.data = l ? e.extend(!0, {}, l) : null, o.state.opened = i.hasClass("jstree-open"), o.state.selected = i.children("a").hasClass("jstree-clicked"), o.state.disabled = i.children("a").hasClass("jstree-disabled"), o.data && o.data.jstree)
                    for (c in o.data.jstree) o.data.jstree.hasOwnProperty(c) && (o.state[c] = o.data.jstree[c]);
                l = i.children("a").children(".jstree-themeicon"), l.length && (o.icon = l.hasClass("jstree-themeicon-hidden") ? !1 : l.attr("rel")), o.state.icon && (o.icon = o.state.icon), l = i.children("ul").children("li");
                do h = "j" + this._id + "_" + ++this._cnt; while (d[h]);
                return o.id = o.li_attr.id ? "" + o.li_attr.id : h, l.length ? (l.each(e.proxy(function(t, i) {
                    n = this._parse_model_from_html(e(i), o.id, r), a = this._model.data[n], o.children.push(n), a.children_d.length && (o.children_d = o.children_d.concat(a.children_d))
                }, this)), o.children_d = o.children_d.concat(o.children)) : i.hasClass("jstree-closed") && (o.state.loaded = !1), o.li_attr["class"] && (o.li_attr["class"] = o.li_attr["class"].replace("jstree-closed", "").replace("jstree-open", "")), o.a_attr["class"] && (o.a_attr["class"] = o.a_attr["class"].replace("jstree-clicked", "").replace("jstree-disabled", "")), d[o.id] = o, o.state.selected && this._data.core.selected.push(o.id), o.id
            },
            _parse_model_from_flat_json: function(e, i, s) {
                s = s ? s.concat() : [], i && s.unshift(i);
                var r = "" + e.id,
                    n = this._model.data,
                    a = this._model.default_state,
                    d, o, c, l, h = {
                        id: r,
                        text: e.text || "",
                        icon: e.icon !== t ? e.icon : !0,
                        parent: i,
                        parents: s,
                        children: e.children || [],
                        children_d: e.children_d || [],
                        data: e.data,
                        state: {},
                        li_attr: {
                            id: !1
                        },
                        a_attr: {
                            href: "#"
                        },
                        original: !1
                    };
                for (d in a) a.hasOwnProperty(d) && (h.state[d] = a[d]);
                if (e && e.data && e.data.jstree && e.data.jstree.icon && (h.icon = e.data.jstree.icon), e && e.data && (h.data = e.data, e.data.jstree))
                    for (d in e.data.jstree) e.data.jstree.hasOwnProperty(d) && (h.state[d] = e.data.jstree[d]);
                if (e && "object" == typeof e.state)
                    for (d in e.state) e.state.hasOwnProperty(d) && (h.state[d] = e.state[d]);
                if (e && "object" == typeof e.li_attr)
                    for (d in e.li_attr) e.li_attr.hasOwnProperty(d) && (h.li_attr[d] = e.li_attr[d]);
                if (h.li_attr.id || (h.li_attr.id = r), e && "object" == typeof e.a_attr)
                    for (d in e.a_attr) e.a_attr.hasOwnProperty(d) && (h.a_attr[d] = e.a_attr[d]);
                for (e && e.children && e.children === !0 && (h.state.loaded = !1, h.children = [], h.children_d = []), n[h.id] = h, d = 0, o = h.children.length; o > d; d++) c = this._parse_model_from_flat_json(n[h.children[d]], h.id, s), l = n[c], h.children_d.push(c), l.children_d.length && (h.children_d = h.children_d.concat(l.children_d));
                return delete e.data, delete e.children, n[h.id].original = e, h.state.selected && this._data.core.selected.push(h.id), h.id
            },
            _parse_model_from_json: function(e, i, s) {
                s = s ? s.concat() : [], i && s.unshift(i);
                var r = !1,
                    n, a, d, o, c = this._model.data,
                    l = this._model.default_state,
                    h;
                do r = "j" + this._id + "_" + ++this._cnt; while (c[r]);
                h = {
                    id: !1,
                    text: "string" == typeof e ? e : "",
                    icon: "object" == typeof e && e.icon !== t ? e.icon : !0,
                    parent: i,
                    parents: s,
                    children: [],
                    children_d: [],
                    data: null,
                    state: {},
                    li_attr: {
                        id: !1
                    },
                    a_attr: {
                        href: "#"
                    },
                    original: !1
                };
                for (n in l) l.hasOwnProperty(n) && (h.state[n] = l[n]);
                if (e && e.id && (h.id = "" + e.id), e && e.text && (h.text = e.text), e && e.data && e.data.jstree && e.data.jstree.icon && (h.icon = e.data.jstree.icon), e && e.data && (h.data = e.data, e.data.jstree))
                    for (n in e.data.jstree) e.data.jstree.hasOwnProperty(n) && (h.state[n] = e.data.jstree[n]);
                if (e && "object" == typeof e.state)
                    for (n in e.state) e.state.hasOwnProperty(n) && (h.state[n] = e.state[n]);
                if (e && "object" == typeof e.li_attr)
                    for (n in e.li_attr) e.li_attr.hasOwnProperty(n) && (h.li_attr[n] = e.li_attr[n]);
                if (h.li_attr.id && !h.id && (h.id = "" + h.li_attr.id), h.id || (h.id = r), h.li_attr.id || (h.li_attr.id = h.id), e && "object" == typeof e.a_attr)
                    for (n in e.a_attr) e.a_attr.hasOwnProperty(n) && (h.a_attr[n] = e.a_attr[n]);
                if (e && e.children && e.children.length) {
                    for (n = 0, a = e.children.length; a > n; n++) d = this._parse_model_from_json(e.children[n], h.id, s), o = c[d], h.children.push(d), o.children_d.length && (h.children_d = h.children_d.concat(o.children_d));
                    h.children_d = h.children_d.concat(h.children)
                }
                return e && e.children && e.children === !0 && (h.state.loaded = !1, h.children = [], h.children_d = []), delete e.data, delete e.children, h.original = e, c[h.id] = h, h.state.selected && this._data.core.selected.push(h.id), h.id
            },
            _redraw: function() {
                var e = this._model.force_full_redraw ? this._model.data["#"].children.concat([]) : this._model.changed.concat([]),
                    t = document.createElement("UL"),
                    i, s, r;
                for (s = 0, r = e.length; r > s; s++) i = this.redraw_node(e[s], !0, this._model.force_full_redraw), i && this._model.force_full_redraw && t.appendChild(i);
                this._model.force_full_redraw && (t.className = this.get_container_ul()[0].className, this.element.empty().append(t)), this._model.force_full_redraw = !1, this._model.changed = [], this.trigger("redraw", {
                    nodes: e
                })
            },
            redraw: function(e) {
                e && (this._model.force_full_redraw = !0), this._redraw()
            },
            redraw_node: function(t, i, s) {
                var r = this.get_node(t),
                    n = !1,
                    a = !1,
                    d = !1,
                    o = !1,
                    l = !1,
                    h = !1,
                    _ = "",
                    u = document,
                    g = this._model.data,
                    f = !1,
                    p = !1,
                    m = null;
                if (!r) return !1;
                if ("#" === r.id) return this.redraw(!0);
                if (i = i || 0 === r.children.length, t = document.querySelector ? this.element[0].querySelector("#" + (-1 !== "0123456789".indexOf(r.id[0]) ? "\\3" + r.id[0] + " " + r.id.substr(1).replace(e.jstree.idregex, "\\$&") : r.id.replace(e.jstree.idregex, "\\$&"))) : document.getElementById(r.id)) t = e(t), s || (n = t.parent().parent()[0], n === this.element[0] && (n = null), a = t.index()), i || !r.children.length || t.children(".jstree-children").length || (i = !0), i || (d = t.children(".jstree-children")[0]), p = t.attr("aria-selected"), f = t.children(".jstree-anchor")[0] === document.activeElement, t.remove();
                else if (i = !0, !s) {
                    if (n = "#" !== r.parent ? e("#" + r.parent.replace(e.jstree.idregex, "\\$&"), this.element)[0] : null, !(null === n || n && g[r.parent].state.opened)) return !1;
                    a = e.inArray(r.id, null === n ? g["#"].children : g[r.parent].children)
                }
                t = c.cloneNode(!0), _ = "jstree-node ";
                for (o in r.li_attr)
                    if (r.li_attr.hasOwnProperty(o)) {
                        if ("id" === o) continue;
                        "class" !== o ? t.setAttribute(o, r.li_attr[o]) : _ += r.li_attr[o]
                    }


                p && "false" !== p && t.setAttribute("aria-selected", !0), r.state.loaded && !r.children.length ? _ += " jstree-leaf" : (_ += r.state.opened && r.state.loaded ? " jstree-open" : " jstree-closed", t.setAttribute("aria-expanded", r.state.opened && r.state.loaded)), null !== r.parent && g[r.parent].children[g[r.parent].children.length - 1] === r.id && (_ += " jstree-last"), t.id = r.id, t.className = _, _ = (r.state.selected ? " jstree-clicked" : "") + (r.state.disabled ? " jstree-disabled" : "");
                for (l in r.a_attr)
                    if (r.a_attr.hasOwnProperty(l)) {
                        if ("href" === l && "#" === r.a_attr[l]) continue;
                        "class" !== l ? t.childNodes[1].setAttribute(l, r.a_attr[l]) : _ += " " + r.a_attr[l]
                    }
                if (_.length && (t.childNodes[1].className = "jstree-anchor " + _), (r.icon && r.icon !== !0 || r.icon === !1) && (r.icon === !1 ? t.childNodes[1].childNodes[0].className += " jstree-themeicon-hidden" : -1 === r.icon.indexOf("/") && -1 === r.icon.indexOf(".") ? t.childNodes[1].childNodes[0].className += " " + r.icon + " jstree-themeicon-custom" : (t.childNodes[1].childNodes[0].style.backgroundImage = "url(" + r.icon + ")", t.childNodes[1].childNodes[0].style.backgroundPosition = "center center", t.childNodes[1].childNodes[0].style.backgroundSize = "auto", t.childNodes[1].childNodes[0].className += " jstree-themeicon-custom")), this.settings.core.force_text ? t.childNodes[1].appendChild(u.createTextNode(r.text)) : t.childNodes[1].innerHTML += r.text, i && r.children.length && r.state.opened && r.state.loaded) {
                    for (h = u.createElement("UL"), h.setAttribute("role", "group"), h.className = "jstree-children", o = 0, l = r.children.length; l > o; o++) h.appendChild(this.redraw_node(r.children[o], i, !0));
                    t.appendChild(h)
                }
                if (d && t.appendChild(d), !s) {
                    for (n || (n = this.element[0]), o = 0, l = n.childNodes.length; l > o; o++)
                        if (n.childNodes[o] && n.childNodes[o].className && -1 !== n.childNodes[o].className.indexOf("jstree-children")) {
                            m = n.childNodes[o];
                            break
                        }
                    m || (m = u.createElement("UL"), m.setAttribute("role", "group"), m.className = "jstree-children", n.appendChild(m)), n = m, n.childNodes.length > a ? n.insertBefore(t, n.childNodes[a]) : n.appendChild(t), f && t.childNodes[1].focus()
                }
                return r.state.opened && !r.state.loaded && (r.state.opened = !1, setTimeout(e.proxy(function() {
                    this.open_node(r.id, !1, 0)
                }, this), 0)), t
            },
            open_node: function(i, s, r) {
                var n, a, d, o;
                if (e.isArray(i)) {
                    for (i = i.slice(), n = 0, a = i.length; a > n; n++) this.open_node(i[n], s, r);
                    return !0
                }
                if (i = this.get_node(i), !i || "#" === i.id) return !1;
                if (r = r === t ? this.settings.core.animation : r, !this.is_closed(i)) return s && s.call(this, i, !1), !1;
                if (this.is_loaded(i)) d = this.get_node(i, !0), o = this, d.length && (i.children.length && !this._firstChild(d.children(".jstree-children")[0]) && (i.state.opened = !0, this.redraw_node(i, !0), d = this.get_node(i, !0)), r ? (this.trigger("before_open", {
                    node: i
                }), d.children(".jstree-children").css("display", "none").end().removeClass("jstree-closed").addClass("jstree-open").attr("aria-expanded", !0).children(".jstree-children").stop(!0, !0).slideDown(r, function() {
                    this.style.display = "", o.trigger("after_open", {
                        node: i
                    })
                })) : (this.trigger("before_open", {
                    node: i
                }), d[0].className = d[0].className.replace("jstree-closed", "jstree-open"), d[0].setAttribute("aria-expanded", !0))), i.state.opened = !0, s && s.call(this, i, !0), d.length || this.trigger("before_open", {
                    node: i
                }), this.trigger("open_node", {
                    node: i
                }), r && d.length || this.trigger("after_open", {
                    node: i
                });
                else {
                    if (this.is_loading(i)) return setTimeout(e.proxy(function() {
                        this.open_node(i, s, r)
                    }, this), 500);
                    this.load_node(i, function(e, t) {
                        return t ? this.open_node(e, s, r) : s ? s.call(this, e, !1) : !1
                    })
                }
            },
            _open_to: function(t) {
                if (t = this.get_node(t), !t || "#" === t.id) return !1;
                var i, s, r = t.parents;
                for (i = 0, s = r.length; s > i; i += 1) "#" !== i && this.open_node(r[i], !1, 0);
                return e("#" + t.id.replace(e.jstree.idregex, "\\$&"), this.element)
            },
            close_node: function(i, s) {
                var r, n, a, d;
                if (e.isArray(i)) {
                    for (i = i.slice(), r = 0, n = i.length; n > r; r++) this.close_node(i[r], s);
                    return !0
                }
                return i = this.get_node(i), i && "#" !== i.id ? this.is_closed(i) ? !1 : (s = s === t ? this.settings.core.animation : s, a = this, d = this.get_node(i, !0), d.length && (s ? d.children(".jstree-children").attr("style", "display:block !important").end().removeClass("jstree-open").addClass("jstree-closed").attr("aria-expanded", !1).children(".jstree-children").stop(!0, !0).slideUp(s, function() {
                    this.style.display = "", d.children(".jstree-children").remove(), a.trigger("after_close", {
                        node: i
                    })
                }) : (d[0].className = d[0].className.replace("jstree-open", "jstree-closed"), d.attr("aria-expanded", !1).children(".jstree-children").remove())), i.state.opened = !1, this.trigger("close_node", {
                    node: i
                }), s && d.length || this.trigger("after_close", {
                    node: i
                }), t) : !1
            },
            toggle_node: function(i) {
                var s, r;
                if (e.isArray(i)) {
                    for (i = i.slice(), s = 0, r = i.length; r > s; s++) this.toggle_node(i[s]);
                    return !0
                }
                return this.is_closed(i) ? this.open_node(i) : this.is_open(i) ? this.close_node(i) : t
            },
            open_all: function(e, t, i) {
                if (e || (e = "#"), e = this.get_node(e), !e) return !1;
                var s = "#" === e.id ? this.get_container_ul() : this.get_node(e, !0),
                    r, n, a;
                if (!s.length) {
                    for (r = 0, n = e.children_d.length; n > r; r++) this.is_closed(this._model.data[e.children_d[r]]) && (this._model.data[e.children_d[r]].state.opened = !0);
                    return this.trigger("open_all", {
                        node: e
                    })
                }
                i = i || s, a = this, s = this.is_closed(e) ? s.find(".jstree-closed").addBack() : s.find(".jstree-closed"), s.each(function() {
                    a.open_node(this, function(e, s) {
                        s && this.is_parent(e) && this.open_all(e, t, i)
                    }, t || 0)
                }), 0 === i.find(".jstree-closed").length && this.trigger("open_all", {
                    node: this.get_node(i)
                })
            },
            close_all: function(t, i) {
                if (t || (t = "#"), t = this.get_node(t), !t) return !1;
                var s = "#" === t.id ? this.get_container_ul() : this.get_node(t, !0),
                    r = this,
                    n, a;
                if (!s.length) {
                    for (n = 0, a = t.children_d.length; a > n; n++) this._model.data[t.children_d[n]].state.opened = !1;
                    return this.trigger("close_all", {
                        node: t
                    })
                }
                s = this.is_open(t) ? s.find(".jstree-open").addBack() : s.find(".jstree-open"), e(s.get().reverse()).each(function() {
                    r.close_node(this, i || 0)
                }), this.trigger("close_all", {
                    node: t
                })
            },
            is_disabled: function(e) {
                return e = this.get_node(e), e && e.state && e.state.disabled
            },
            enable_node: function(i) {
                var s, r;
                if (e.isArray(i)) {
                    for (i = i.slice(), s = 0, r = i.length; r > s; s++) this.enable_node(i[s]);
                    return !0
                }
                return i = this.get_node(i), i && "#" !== i.id ? (i.state.disabled = !1, this.get_node(i, !0).children(".jstree-anchor").removeClass("jstree-disabled"), this.trigger("enable_node", {
                    node: i
                }), t) : !1
            },
            disable_node: function(i) {
                var s, r;
                if (e.isArray(i)) {
                    for (i = i.slice(), s = 0, r = i.length; r > s; s++) this.disable_node(i[s]);
                    return !0
                }
                return i = this.get_node(i), i && "#" !== i.id ? (i.state.disabled = !0, this.get_node(i, !0).children(".jstree-anchor").addClass("jstree-disabled"), this.trigger("disable_node", {
                    node: i
                }), t) : !1
            },
            activate_node: function(e, i) {
                if (this.is_disabled(e)) return !1;
                if (this._data.core.last_clicked = this._data.core.last_clicked && this._data.core.last_clicked.id !== t ? this.get_node(this._data.core.last_clicked.id) : null, this._data.core.last_clicked && !this._data.core.last_clicked.state.selected && (this._data.core.last_clicked = null), !this._data.core.last_clicked && this._data.core.selected.length && (this._data.core.last_clicked = this.get_node(this._data.core.selected[this._data.core.selected.length - 1])), this.settings.core.multiple && (i.metaKey || i.ctrlKey || i.shiftKey) && (!i.shiftKey || this._data.core.last_clicked && this.get_parent(e) && this.get_parent(e) === this._data.core.last_clicked.parent))
                    if (i.shiftKey) {
                        var s = this.get_node(e).id,
                            r = this._data.core.last_clicked.id,
                            n = this.get_node(this._data.core.last_clicked.parent).children,
                            a = !1,
                            d, o;
                        for (d = 0, o = n.length; o > d; d += 1) n[d] === s && (a = !a), n[d] === r && (a = !a), a || n[d] === s || n[d] === r ? this.select_node(n[d], !1, !1, i) : this.deselect_node(n[d], !1, i)
                    } else this.is_selected(e) ? this.deselect_node(e, !1, i) : this.select_node(e, !1, !1, i);
                else !this.settings.core.multiple && (i.metaKey || i.ctrlKey || i.shiftKey) && this.is_selected(e) ? this.deselect_node(e, !1, i) : (this.deselect_all(!0), this.select_node(e, !1, !1, i), this._data.core.last_clicked = this.get_node(e));
                this.trigger("activate_node", {
                    node: this.get_node(e)
                })
            },
            hover_node: function(e) {
                if (e = this.get_node(e, !0), !e || !e.length || e.children(".jstree-hovered").length) return !1;
                var t = this.element.find(".jstree-hovered"),
                    i = this.element;
                t && t.length && this.dehover_node(t), e.children(".jstree-anchor").addClass("jstree-hovered"), this.trigger("hover_node", {
                    node: this.get_node(e)
                }), setTimeout(function() {
                    i.attr("aria-activedescendant", e[0].id), e.attr("aria-selected", !0)
                }, 0)
            },
            dehover_node: function(e) {
                return e = this.get_node(e, !0), e && e.length && e.children(".jstree-hovered").length ? (e.attr("aria-selected", !1).children(".jstree-anchor").removeClass("jstree-hovered"), this.trigger("dehover_node", {
                    node: this.get_node(e)
                }), t) : !1
            },
            select_node: function(i, s, r, n) {
                var a, d, o, c;
                if (e.isArray(i)) {
                    for (i = i.slice(), d = 0, o = i.length; o > d; d++) this.select_node(i[d], s, r, n);
                    return !0
                }
                return i = this.get_node(i), i && "#" !== i.id ? (a = this.get_node(i, !0), i.state.selected || (i.state.selected = !0, this._data.core.selected.push(i.id), r || (a = this._open_to(i)), a && a.length && a.children(".jstree-anchor").addClass("jstree-clicked"), this.trigger("select_node", {
                    node: i,
                    selected: this._data.core.selected,
                    event: n
                }), s || this.trigger("changed", {
                    action: "select_node",
                    node: i,
                    selected: this._data.core.selected,
                    event: n
                })), t) : !1
            },
            deselect_node: function(i, s, r) {
                var n, a, d;
                if (e.isArray(i)) {
                    for (i = i.slice(), n = 0, a = i.length; a > n; n++) this.deselect_node(i[n], s, r);
                    return !0
                }
                return i = this.get_node(i), i && "#" !== i.id ? (d = this.get_node(i, !0), i.state.selected && (i.state.selected = !1, this._data.core.selected = e.vakata.array_remove_item(this._data.core.selected, i.id), d.length && d.children(".jstree-anchor").removeClass("jstree-clicked"), this.trigger("deselect_node", {
                    node: i,
                    selected: this._data.core.selected,
                    event: r
                }), s || this.trigger("changed", {
                    action: "deselect_node",
                    node: i,
                    selected: this._data.core.selected,
                    event: r
                })), t) : !1
            },
            select_all: function(e) {
                var t = this._data.core.selected.concat([]),
                    i, s;
                for (this._data.core.selected = this._model.data["#"].children_d.concat(), i = 0, s = this._data.core.selected.length; s > i; i++) this._model.data[this._data.core.selected[i]] && (this._model.data[this._data.core.selected[i]].state.selected = !0);
                this.redraw(!0), this.trigger("select_all", {
                    selected: this._data.core.selected
                }), e || this.trigger("changed", {
                    action: "select_all",
                    selected: this._data.core.selected,
                    old_selection: t
                })
            },
            deselect_all: function(e) {
                var t = this._data.core.selected.concat([]),
                    i, s;
                for (i = 0, s = this._data.core.selected.length; s > i; i++) this._model.data[this._data.core.selected[i]] && (this._model.data[this._data.core.selected[i]].state.selected = !1);
                this._data.core.selected = [], this.element.find(".jstree-clicked").removeClass("jstree-clicked"), this.trigger("deselect_all", {
                    selected: this._data.core.selected,
                    node: t
                }), e || this.trigger("changed", {
                    action: "deselect_all",
                    selected: this._data.core.selected,
                    old_selection: t
                })
            },
            is_selected: function(e) {
                return e = this.get_node(e), e && "#" !== e.id ? e.state.selected : !1
            },
            get_selected: function(t) {
                return t ? e.map(this._data.core.selected, e.proxy(function(e) {
                    return this.get_node(e)
                }, this)) : this._data.core.selected.slice()
            },
            get_top_selected: function(t) {
                var i = this.get_selected(!0),
                    s = {},
                    r, n, a, d;
                for (r = 0, n = i.length; n > r; r++) s[i[r].id] = i[r];
                for (r = 0, n = i.length; n > r; r++)
                    for (a = 0, d = i[r].children_d.length; d > a; a++) s[i[r].children_d[a]] && delete s[i[r].children_d[a]];
                i = [];
                for (r in s) s.hasOwnProperty(r) && i.push(r);
                return t ? e.map(i, e.proxy(function(e) {
                    return this.get_node(e)
                }, this)) : i
            },
            get_bottom_selected: function(t) {
                var i = this.get_selected(!0),
                    s = [],
                    r, n;
                for (r = 0, n = i.length; n > r; r++) i[r].children.length || s.push(i[r].id);
                return t ? e.map(s, e.proxy(function(e) {
                    return this.get_node(e)
                }, this)) : s
            },
            get_state: function() {
                var e = {
                        core: {
                            open: [],
                            scroll: {
                                left: this.element.scrollLeft(),
                                top: this.element.scrollTop()
                            },
                            selected: []
                        }
                    },
                    t;
                for (t in this._model.data) this._model.data.hasOwnProperty(t) && "#" !== t && (this._model.data[t].state.opened && e.core.open.push(t), this._model.data[t].state.selected && e.core.selected.push(t));
                return e
            },
            set_state: function(i, s) {
                if (i) {
                    if (i.core) {
                        var r, n, a, d;
                        if (i.core.open) return e.isArray(i.core.open) ? (r = !0, n = !1, a = this, e.each(i.core.open.concat([]), function(t, d) {
                            n = a.get_node(d), n && (a.is_loaded(d) ? (a.is_closed(d) && a.open_node(d, !1, 0), i && i.core && i.core.open && e.vakata.array_remove_item(i.core.open, d)) : (a.is_loading(d) || a.open_node(d, e.proxy(function(t, r) {
                                !r && i && i.core && i.core.open && e.vakata.array_remove_item(i.core.open, t.id), this.set_state(i, s)
                            }, a), 0), r = !1))
                        }), r && (delete i.core.open, this.set_state(i, s)), !1) : (delete i.core.open, this.set_state(i, s), !1);
                        if (i.core.scroll) return i.core.scroll && i.core.scroll.left !== t && this.element.scrollLeft(i.core.scroll.left), i.core.scroll && i.core.scroll.top !== t && this.element.scrollTop(i.core.scroll.top), delete i.core.scroll, this.set_state(i, s), !1;
                        if (i.core.selected) return d = this, this.deselect_all(), e.each(i.core.selected, function(e, t) {
                            d.select_node(t)
                        }), delete i.core.selected, this.set_state(i, s), !1;
                        if (e.isEmptyObject(i.core)) return delete i.core, this.set_state(i, s), !1
                    }
                    return e.isEmptyObject(i) ? (i = null, s && s.call(this), this.trigger("set_state"), !1) : !0
                }
                return !1
            },
            refresh: function(t, i) {
                this._data.core.state = i === !0 ? {} : this.get_state(), i && e.isFunction(i) && (this._data.core.state = i.call(this, this._data.core.state)), this._cnt = 0, this._model.data = {
                    "#": {
                        id: "#",
                        parent: null,
                        parents: [],
                        children: [],
                        children_d: [],
                        state: {
                            loaded: !1
                        }
                    }
                };
                var s = this.get_container_ul()[0].className;
                t || this.element.html("<ul class='" + s + "'><" + "li class='jstree-initial-node jstree-loading jstree-leaf jstree-last'><i class='jstree-icon jstree-ocl'></i><" + "a class='jstree-anchor' href='#'><i class='jstree-icon jstree-themeicon-hidden'></i>" + this.get_string("Loading ...") + "</a></li></ul>"), this.load_node("#", function(t, i) {
                    i && (this.get_container_ul()[0].className = s, this.set_state(e.extend(!0, {}, this._data.core.state), function() {
                        this.trigger("refresh")
                    })), this._data.core.state = null
                })
            },
            refresh_node: function(t) {
                if (t = this.get_node(t), !t || "#" === t.id) return !1;
                var i = [],
                    s = [],
                    r = this._data.core.selected.concat([]);
                s.push(t.id), t.state.opened === !0 && i.push(t.id), this.get_node(t, !0).find(".jstree-open").each(function() {
                    i.push(this.id)
                }), this._load_nodes(s, e.proxy(function(e) {
                    this.open_node(i, !1, 0), this.select_node(this._data.core.selected), this.trigger("refresh_node", {
                        node: t,
                        nodes: e
                    })
                }, this))
            },
            set_id: function(t, i) {
                if (t = this.get_node(t), !t || "#" === t.id) return !1;
                var s, r, n = this._model.data;
                for (i = "" + i, n[t.parent].children[e.inArray(t.id, n[t.parent].children)] = i, s = 0, r = t.parents.length; r > s; s++) n[t.parents[s]].children_d[e.inArray(t.id, n[t.parents[s]].children_d)] = i;
                for (s = 0, r = t.children.length; r > s; s++) n[t.children[s]].parent = i;
                for (s = 0, r = t.children_d.length; r > s; s++) n[t.children_d[s]].parents[e.inArray(t.id, n[t.children_d[s]].parents)] = i;
                return s = e.inArray(t.id, this._data.core.selected), -1 !== s && (this._data.core.selected[s] = i), s = this.get_node(t.id, !0), s && s.attr("id", i), delete n[t.id], t.id = i, n[i] = t, !0
            },
            get_text: function(e) {
                return e = this.get_node(e), e && "#" !== e.id ? e.text : !1
            },
            set_text: function(t, i) {
                var s, r;
                if (e.isArray(t)) {
                    for (t = t.slice(), s = 0, r = t.length; r > s; s++) this.set_text(t[s], i);
                    return !0
                }
                return t = this.get_node(t), t && "#" !== t.id ? (t.text = i, this.get_node(t, !0).length && this.redraw_node(t.id), this.trigger("set_text", {
                    obj: t,
                    text: i
                }), !0) : !1
            },
            get_json: function(e, t, i) {
                if (e = this.get_node(e || "#"), !e) return !1;
                t && t.flat && !i && (i = []);
                var s = {
                        id: e.id,
                        text: e.text,
                        icon: this.get_icon(e),
                        li_attr: e.li_attr,
                        a_attr: e.a_attr,
                        state: {},
                        data: t && t.no_data ? !1 : e.data
                    },
                    r, n;
                if (t && t.flat ? s.parent = e.parent : s.children = [], !t || !t.no_state)
                    for (r in e.state) e.state.hasOwnProperty(r) && (s.state[r] = e.state[r]);
                if (t && t.no_id && (delete s.id, s.li_attr && s.li_attr.id && delete s.li_attr.id), t && t.flat && "#" !== e.id && i.push(s), !t || !t.no_children)
                    for (r = 0, n = e.children.length; n > r; r++) t && t.flat ? this.get_json(e.children[r], t, i) : s.children.push(this.get_json(e.children[r], t));
                return t && t.flat ? i : "#" === e.id ? s.children : s
            },
            create_node: function(i, s, r, n, a) {
                if (null === i && (i = "#"), i = this.get_node(i), !i) return !1;
                if (r = r === t ? "last" : r, !("" + r).match(/^(before|after)$/) && !a && !this.is_loaded(i)) return this.load_node(i, function() {
                    this.create_node(i, s, r, n, !0)
                });
                s || (s = {
                    text: this.get_string("New node")
                }), s.text === t && (s.text = this.get_string("New node"));
                var d, o, c, l;
                switch ("#" === i.id && ("before" === r && (r = "first"), "after" === r && (r = "last")), r) {
                    case "before":
                        d = this.get_node(i.parent), r = e.inArray(i.id, d.children), i = d;
                        break;
                    case "after":
                        d = this.get_node(i.parent), r = e.inArray(i.id, d.children) + 1, i = d;
                        break;
                    case "inside":
                    case "first":
                        r = 0;
                        break;
                    case "last":
                        r = i.children.length;
                        break;
                    default:
                        r || (r = 0)
                }
                if (r > i.children.length && (r = i.children.length), s.id || (s.id = !0), !this.check("create_node", s, i, r)) return this.settings.core.error.call(this, this._data.core.last_error), !1;
                if (s.id === !0 && delete s.id, s = this._parse_model_from_json(s, i.id, i.parents.concat()), !s) return !1;
                for (d = this.get_node(s), o = [], o.push(s), o = o.concat(d.children_d), this.trigger("model", {
                    nodes: o,
                    parent: i.id
                }), i.children_d = i.children_d.concat(o), c = 0, l = i.parents.length; l > c; c++) this._model.data[i.parents[c]].children_d = this._model.data[i.parents[c]].children_d.concat(o);
                for (s = d, d = [], c = 0, l = i.children.length; l > c; c++) d[c >= r ? c + 1 : c] = i.children[c];
                return d[r] = s.id, i.children = d, this.redraw_node(i, !0), n && n.call(this, this.get_node(s)), this.trigger("create_node", {
                    node: this.get_node(s),
                    parent: i.id,
                    position: r
                }), s.id
            },
            rename_node: function(t, i) {
                var s, r, n;
                if (e.isArray(t)) {
                    for (t = t.slice(), s = 0, r = t.length; r > s; s++) this.rename_node(t[s], i);
                    return !0
                }
                return t = this.get_node(t), t && "#" !== t.id ? (n = t.text, this.check("rename_node", t, this.get_parent(t), i) ? (this.set_text(t, i), this.trigger("rename_node", {
                    node: t,
                    text: i,
                    old: n
                }), !0) : (this.settings.core.error.call(this, this._data.core.last_error), !1)) : !1
            },
            delete_node: function(t) {
                var i, s, r, n, a, d, o, c, l, h;
                if (e.isArray(t)) {
                    for (t = t.slice(), i = 0, s = t.length; s > i; i++) this.delete_node(t[i]);
                    return !0
                }
                if (t = this.get_node(t), !t || "#" === t.id) return !1;
                if (r = this.get_node(t.parent), n = e.inArray(t.id, r.children), h = !1, !this.check("delete_node", t, r, n)) return this.settings.core.error.call(this, this._data.core.last_error), !1;
                for (-1 !== n && (r.children = e.vakata.array_remove(r.children, n)), a = t.children_d.concat([]), a.push(t.id), c = 0, l = a.length; l > c; c++) {
                    for (d = 0, o = t.parents.length; o > d; d++) n = e.inArray(a[c], this._model.data[t.parents[d]].children_d), -1 !== n && (this._model.data[t.parents[d]].children_d = e.vakata.array_remove(this._model.data[t.parents[d]].children_d, n));
                    this._model.data[a[c]].state.selected && (h = !0, n = e.inArray(a[c], this._data.core.selected), -1 !== n && (this._data.core.selected = e.vakata.array_remove(this._data.core.selected, n)))
                }
                for (this.trigger("delete_node", {
                    node: t,
                    parent: r.id
                }), h && this.trigger("changed", {
                    action: "delete_node",
                    node: t,
                    selected: this._data.core.selected,
                    parent: r.id
                }), c = 0, l = a.length; l > c; c++) delete this._model.data[a[c]];
                return this.redraw_node(r, !0), !0
            },
            check: function(t, i, s, r, n) {
                i = i && i.id ? i : this.get_node(i), s = s && s.id ? s : this.get_node(s);
                var a = t.match(/^move_node|copy_node|create_node$/i) ? s : i,
                    d = this.settings.core.check_callback;
                return "move_node" !== t && "copy_node" !== t || n && n.is_multi || i.id !== s.id && e.inArray(i.id, s.children) !== r && -1 === e.inArray(s.id, i.children_d) ? (a && a.data && (a = a.data), a && a.functions && (a.functions[t] === !1 || a.functions[t] === !0) ? (a.functions[t] === !1 && (this._data.core.last_error = {
                    error: "check",
                    plugin: "core",
                    id: "core_02",
                    reason: "Node data prevents function: " + t,
                    data: JSON.stringify({
                        chk: t,
                        pos: r,
                        obj: i && i.id ? i.id : !1,
                        par: s && s.id ? s.id : !1
                    })
                }), a.functions[t]) : d === !1 || e.isFunction(d) && d.call(this, t, i, s, r, n) === !1 || d && d[t] === !1 ? (this._data.core.last_error = {
                    error: "check",
                    plugin: "core",
                    id: "core_03",
                    reason: "User config for core.check_callback prevents function: " + t,
                    data: JSON.stringify({
                        chk: t,
                        pos: r,
                        obj: i && i.id ? i.id : !1,
                        par: s && s.id ? s.id : !1
                    })
                }, !1) : !0) : (this._data.core.last_error = {
                    error: "check",
                    plugin: "core",
                    id: "core_01",
                    reason: "Moving parent inside child",
                    data: JSON.stringify({
                        chk: t,
                        pos: r,
                        obj: i && i.id ? i.id : !1,
                        par: s && s.id ? s.id : !1
                    })
                }, !1)
            },
            last_error: function() {
                return this._data.core.last_error
            },
            move_node: function(i, s, r, n, a) {
                var d, o, c, l, h, _, u, g, f, p, m, v, j, k;
                if (s = this.get_node(s), r = r === t ? 0 : r, !s) return !1;
                if (!("" + r).match(/^(before|after)$/) && !a && !this.is_loaded(s)) return this.load_node(s, function() {
                    this.move_node(i, s, r, n, !0)
                });
                if (e.isArray(i)) {
                    for (i = i.reverse().slice(), d = 0, o = i.length; o > d; d++) this.move_node(i[d], s, r, n, a);
                    return !0
                }
                if (i = i && i.id ? i : this.get_node(i), !i || "#" === i.id) return !1;
                if (c = "" + (i.parent || "#"), h = ("" + r).match(/^(before|after)$/) && "#" !== s.id ? this.get_node(s.parent) : s, _ = i.instance ? i.instance : this._model.data[i.id] ? this : e.jstree.reference(i.id), u = !_ || !_._id || this._id !== _._id, l = _ && _._id && c && _._model.data[c] && _._model.data[c].children ? e.inArray(i.id, _._model.data[c].children) : -1, u) return this.copy_node(i, s, r, n, a) ? (_ && _.delete_node(i), !0) : !1;
                switch ("#" === h.id && ("before" === r && (r = "first"), "after" === r && (r = "last")), r) {
                    case "before":
                        r = e.inArray(s.id, h.children);
                        break;
                    case "after":
                        r = e.inArray(s.id, h.children) + 1;
                        break;
                    case "inside":
                    case "first":
                        r = 0;
                        break;
                    case "last":
                        r = h.children.length;
                        break;
                    default:
                        r || (r = 0)
                }
                if (r > h.children.length && (r = h.children.length), !this.check("move_node", i, h, r, {
                        core: !0,
                        is_multi: _ && _._id && _._id !== this._id,
                        is_foreign: !_ || !_._id
                    })) return this.settings.core.error.call(this, this._data.core.last_error), !1;
                if (i.parent === h.id) {
                    for (g = h.children.concat(), f = e.inArray(i.id, g), -1 !== f && (g = e.vakata.array_remove(g, f), r > f && r--), f = [], p = 0, m = g.length; m > p; p++) f[p >= r ? p + 1 : p] = g[p];
                    f[r] = i.id, h.children = f, this._node_changed(h.id), this.redraw("#" === h.id)
                } else {
                    for (f = i.children_d.concat(), f.push(i.id), p = 0, m = i.parents.length; m > p; p++) {
                        for (g = [], k = _._model.data[i.parents[p]].children_d, v = 0, j = k.length; j > v; v++) - 1 === e.inArray(k[v], f) && g.push(k[v]);
                        _._model.data[i.parents[p]].children_d = g
                    }
                    for (_._model.data[c].children = e.vakata.array_remove_item(_._model.data[c].children, i.id), p = 0, m = h.parents.length; m > p; p++) this._model.data[h.parents[p]].children_d = this._model.data[h.parents[p]].children_d.concat(f);
                    for (g = [], p = 0, m = h.children.length; m > p; p++) g[p >= r ? p + 1 : p] = h.children[p];
                    for (g[r] = i.id, h.children = g, h.children_d.push(i.id), h.children_d = h.children_d.concat(i.children_d), i.parent = h.id, f = h.parents.concat(), f.unshift(h.id), k = i.parents.length, i.parents = f, f = f.concat(), p = 0, m = i.children_d.length; m > p; p++) this._model.data[i.children_d[p]].parents = this._model.data[i.children_d[p]].parents.slice(0, -1 * k), Array.prototype.push.apply(this._model.data[i.children_d[p]].parents, f);
                    this._node_changed(c), this._node_changed(h.id), this.redraw("#" === c || "#" === h.id)
                }
                return n && n.call(this, i, h, r), this.trigger("move_node", {
                    node: i,
                    parent: h.id,
                    position: r,
                    old_parent: c,
                    old_position: l,
                    is_multi: _ && _._id && _._id !== this._id,
                    is_foreign: !_ || !_._id,
                    old_instance: _,
                    new_instance: this
                }), !0
            },
            copy_node: function(i, s, r, n, a) {
                var d, o, c, l, h, _, u, g, f, p, m;
                if (s = this.get_node(s), r = r === t ? 0 : r, !s) return !1;
                if (!("" + r).match(/^(before|after)$/) && !a && !this.is_loaded(s)) return this.load_node(s, function() {
                    this.copy_node(i, s, r, n, !0)
                });
                if (e.isArray(i)) {
                    for (i = i.reverse().slice(), d = 0, o = i.length; o > d; d++) this.copy_node(i[d], s, r, n, a);
                    return !0
                }
                if (i = i && i.id ? i : this.get_node(i), !i || "#" === i.id) return !1;
                switch (g = "" + (i.parent || "#"), f = ("" + r).match(/^(before|after)$/) && "#" !== s.id ? this.get_node(s.parent) : s, p = i.instance ? i.instance : this._model.data[i.id] ? this : e.jstree.reference(i.id), m = !p || !p._id || this._id !== p._id, "#" === f.id && ("before" === r && (r = "first"), "after" === r && (r = "last")), r) {
                    case "before":
                        r = e.inArray(s.id, f.children);
                        break;
                    case "after":
                        r = e.inArray(s.id, f.children) + 1;
                        break;
                    case "inside":
                    case "first":
                        r = 0;
                        break;
                    case "last":
                        r = f.children.length;
                        break;
                    default:
                        r || (r = 0)
                }
                if (r > f.children.length && (r = f.children.length), !this.check("copy_node", i, f, r, {
                        core: !0,
                        is_multi: p && p._id && p._id !== this._id,
                        is_foreign: !p || !p._id
                    })) return this.settings.core.error.call(this, this._data.core.last_error), !1;
                if (u = p ? p.get_json(i, {
                        no_id: !0,
                        no_data: !0,
                        no_state: !0
                    }) : i, !u) return !1;
                if (u.id === !0 && delete u.id, u = this._parse_model_from_json(u, f.id, f.parents.concat()), !u) return !1;
                for (l = this.get_node(u), i && i.state && i.state.loaded === !1 && (l.state.loaded = !1), c = [], c.push(u), c = c.concat(l.children_d), this.trigger("model", {
                    nodes: c,
                    parent: f.id
                }), h = 0, _ = f.parents.length; _ > h; h++) this._model.data[f.parents[h]].children_d = this._model.data[f.parents[h]].children_d.concat(c);
                for (c = [], h = 0, _ = f.children.length; _ > h; h++) c[h >= r ? h + 1 : h] = f.children[h];
                return c[r] = l.id, f.children = c, f.children_d.push(l.id), f.children_d = f.children_d.concat(l.children_d), this._node_changed(f.id), this.redraw("#" === f.id), n && n.call(this, l, f, r), this.trigger("copy_node", {
                    node: l,
                    original: i,
                    parent: f.id,
                    position: r,
                    old_parent: g,
                    old_position: p && p._id && g && p._model.data[g] && p._model.data[g].children ? e.inArray(i.id, p._model.data[g].children) : -1,
                    is_multi: p && p._id && p._id !== this._id,
                    is_foreign: !p || !p._id,
                    old_instance: p,
                    new_instance: this
                }), l.id
            },
            cut: function(i) {
                if (i || (i = this._data.core.selected.concat()), e.isArray(i) || (i = [i]), !i.length) return !1;
                var a = [],
                    d, o, c;
                for (o = 0, c = i.length; c > o; o++) d = this.get_node(i[o]), d && d.id && "#" !== d.id && a.push(d);
                return a.length ? (s = a, n = this, r = "move_node", this.trigger("cut", {
                    node: i
                }), t) : !1
            },
            copy: function(i) {
                if (i || (i = this._data.core.selected.concat()), e.isArray(i) || (i = [i]), !i.length) return !1;
                var a = [],
                    d, o, c;
                for (o = 0, c = i.length; c > o; o++) d = this.get_node(i[o]), d && d.id && "#" !== d.id && a.push(d);
                return a.length ? (s = a, n = this, r = "copy_node", this.trigger("copy", {
                    node: i
                }), t) : !1
            },
            get_buffer: function() {
                return {
                    mode: r,
                    node: s,
                    inst: n
                }
            },
            can_paste: function() {
                return r !== !1 && s !== !1
            },
            paste: function(e, i) {
                return e = this.get_node(e), e && r && r.match(/^(copy_node|move_node)$/) && s ? (this[r](s, e, i) && this.trigger("paste", {
                    parent: e.id,
                    node: s,
                    mode: r
                }), s = !1, r = !1, n = !1, t) : !1
            },
            edit: function(i, s) {
                if (i = this.get_node(i), !i) return !1;
                if (this.settings.core.check_callback === !1) return this._data.core.last_error = {
                    error: "check",
                    plugin: "core",
                    id: "core_07",
                    reason: "Could not edit node because of check_callback"
                }, this.settings.core.error.call(this, this._data.core.last_error), !1;
                s = "string" == typeof s ? s : i.text, this.set_text(i, ""), i = this._open_to(i);
                var r = this._data.core.rtl,
                    n = this.element.width(),
                    a = i.children(".jstree-anchor"),
                    d = e("<span>"),
                    o = s,
                    c = e("<div />", {
                        css: {
                            position: "absolute",
                            top: "-200px",
                            left: r ? "0px" : "-1000px",
                            visibility: "hidden"
                        }
                    }).appendTo("body"),
                    l = e("<input />", {
                        value: o,
                        "class": "jstree-rename-input",
                        css: {
                            padding: "0",
                            border: "1px solid silver",
                            "box-sizing": "border-box",
                            display: "inline-block",
                            height: this._data.core.li_height + "px",
                            lineHeight: this._data.core.li_height + "px",
                            width: "150px"
                        },
                        blur: e.proxy(function() {
                            var t = d.children(".jstree-rename-input"),
                                s = t.val();
                            "" === s && (s = o), c.remove(), d.replaceWith(a), d.remove(), this.set_text(i, o), this.rename_node(i, e("<div></div>").text(s)[this.settings.core.force_text ? "text" : "html"]()) === !1 && this.set_text(i, o)
                        }, this),
                        keydown: function(e) {
                            var t = e.which;
                            27 === t && (this.value = o), (27 === t || 13 === t || 37 === t || 38 === t || 39 === t || 40 === t || 32 === t) && e.stopImmediatePropagation(), (27 === t || 13 === t) && (e.preventDefault(), this.blur())
                        },
                        click: function(e) {
                            e.stopImmediatePropagation()
                        },
                        mousedown: function(e) {
                            e.stopImmediatePropagation()
                        },
                        keyup: function(e) {
                            l.width(Math.min(c.text("pW" + this.value).width(), n))
                        },
                        keypress: function(e) {
                            return 13 === e.which ? !1 : t
                        }
                    }),
                    h = {
                        fontFamily: a.css("fontFamily") || "",
                        fontSize: a.css("fontSize") || "",
                        fontWeight: a.css("fontWeight") || "",
                        fontStyle: a.css("fontStyle") || "",
                        fontStretch: a.css("fontStretch") || "",
                        fontVariant: a.css("fontVariant") || "",
                        letterSpacing: a.css("letterSpacing") || "",
                        wordSpacing: a.css("wordSpacing") || ""
                    };
                d.attr("class", a.attr("class")).append(a.contents().clone()).append(l), a.replaceWith(d), c.css(h), l.css(h).width(Math.min(c.text("pW" + l[0].value).width(), n))[0].select()
            },
            set_theme: function(t, i) {
                if (!t) return !1;
                if (i === !0) {
                    var s = this.settings.core.themes.dir;
                    s || (s = e.jstree.path + "/themes"), i = s + "/" + t + "/style.css"
                }
                i && -1 === e.inArray(i, a) && (e("head").append('<link rel="stylesheet" href="' + i + '" type="text/css" />'), a.push(i)), this._data.core.themes.name && this.element.removeClass("jstree-" + this._data.core.themes.name), this._data.core.themes.name = t, this.element.addClass("jstree-" + t), this.element[this.settings.core.themes.responsive ? "addClass" : "removeClass"]("jstree-" + t + "-responsive"), this.trigger("set_theme", {
                    theme: t
                })
            },
            get_theme: function() {
                return this._data.core.themes.name
            },
            set_theme_variant: function(e) {
                this._data.core.themes.variant && this.element.removeClass("jstree-" + this._data.core.themes.name + "-" + this._data.core.themes.variant), this._data.core.themes.variant = e, e && this.element.addClass("jstree-" + this._data.core.themes.name + "-" + this._data.core.themes.variant)
            },
            get_theme_variant: function() {
                return this._data.core.themes.variant
            },
            show_stripes: function() {
                this._data.core.themes.stripes = !0, this.get_container_ul().addClass("jstree-striped")
            },
            hide_stripes: function() {
                this._data.core.themes.stripes = !1, this.get_container_ul().removeClass("jstree-striped")
            },
            toggle_stripes: function() {
                this._data.core.themes.stripes ? this.hide_stripes() : this.show_stripes()
            },
            show_dots: function() {
                this._data.core.themes.dots = !0, this.get_container_ul().removeClass("jstree-no-dots")
            },
            hide_dots: function() {
                this._data.core.themes.dots = !1, this.get_container_ul().addClass("jstree-no-dots")
            },
            toggle_dots: function() {
                this._data.core.themes.dots ? this.hide_dots() : this.show_dots()
            },
            show_icons: function() {
                this._data.core.themes.icons = !0, this.get_container_ul().removeClass("jstree-no-icons")
            },
            hide_icons: function() {
                this._data.core.themes.icons = !1, this.get_container_ul().addClass("jstree-no-icons")
            },
            toggle_icons: function() {
                this._data.core.themes.icons ? this.hide_icons() : this.show_icons()
            },
            set_icon: function(t, i) {
                var s, r, n, a;
                if (e.isArray(t)) {
                    for (t = t.slice(), s = 0, r = t.length; r > s; s++) this.set_icon(t[s], i);
                    return !0
                }
                return t = this.get_node(t), t && "#" !== t.id ? (a = t.icon, t.icon = i, n = this.get_node(t, !0).children(".jstree-anchor").children(".jstree-themeicon"), i === !1 ? this.hide_icon(t) : i === !0 ? n.removeClass("jstree-themeicon-custom " + a).css("background", "").removeAttr("rel") : -1 === i.indexOf("/") && -1 === i.indexOf(".") ? (n.removeClass(a).css("background", ""), n.addClass(i + " jstree-themeicon-custom").attr("rel", i)) : (n.removeClass(a).css("background", ""), n.addClass("jstree-themeicon-custom").css("background", "url('" + i + "') center center no-repeat").attr("rel", i)), !0) : !1
            },
            get_icon: function(e) {
                return e = this.get_node(e), e && "#" !== e.id ? e.icon : !1
            },
            hide_icon: function(t) {
                var i, s;
                if (e.isArray(t)) {
                    for (t = t.slice(), i = 0, s = t.length; s > i; i++) this.hide_icon(t[i]);
                    return !0
                }
                return t = this.get_node(t), t && "#" !== t ? (t.icon = !1, this.get_node(t, !0).children(".jstree-anchor").children(".jstree-themeicon").addClass("jstree-themeicon-hidden"), !0) : !1
            },
            show_icon: function(t) {
                var i, s, r;
                if (e.isArray(t)) {
                    for (t = t.slice(), i = 0, s = t.length; s > i; i++) this.show_icon(t[i]);
                    return !0
                }
                return t = this.get_node(t), t && "#" !== t ? (r = this.get_node(t, !0), t.icon = r.length ? r.children(".jstree-anchor").children(".jstree-themeicon").attr("rel") : !0, t.icon || (t.icon = !0), r.children(".jstree-anchor").children(".jstree-themeicon").removeClass("jstree-themeicon-hidden"), !0) : !1
            }
        }, e.vakata = {}, e.vakata.attributes = function(t, i) {
            t = e(t)[0];
            var s = i ? {} : [];
            return t && t.attributes && e.each(t.attributes, function(t, r) {
                -1 === e.inArray(r.nodeName.toLowerCase(), ["style", "contenteditable", "hasfocus", "tabindex"]) && null !== r.nodeValue && "" !== e.trim(r.nodeValue) && (i ? s[r.nodeName] = r.nodeValue : s.push(r.nodeName))
            }), s
        }, e.vakata.array_unique = function(e) {
            var t = [],
                i, s, r;
            for (i = 0, r = e.length; r > i; i++) {
                for (s = 0; i >= s; s++)
                    if (e[i] === e[s]) break;
                s === i && t.push(e[i])
            }
            return t
        }, e.vakata.array_remove = function(e, t, i) {
            var s = e.slice((i || t) + 1 || e.length);
            return e.length = 0 > t ? e.length + t : t, e.push.apply(e, s), e
        }, e.vakata.array_remove_item = function(t, i) {
            var s = e.inArray(i, t);
            return -1 !== s ? e.vakata.array_remove(t, s) : t
        };
        var _ = document.createElement("I");
        _.className = "jstree-icon jstree-checkbox", e.jstree.defaults.checkbox = {
            visible: !0,
            three_state: !0,
            whole_node: !0,
            keep_selected_style: !0,
            cascade: "",
            tie_selection: !0
        }, e.jstree.plugins.checkbox = function(i, s) {
            this.bind = function() {
                s.bind.call(this), this._data.checkbox.uto = !1, this._data.checkbox.selected = [], this.settings.checkbox.three_state && (this.settings.checkbox.cascade = "up+down+undetermined"), this.element.on("init.jstree", e.proxy(function() {
                    this._data.checkbox.visible = this.settings.checkbox.visible, this.settings.checkbox.keep_selected_style || this.element.addClass("jstree-checkbox-no-clicked"), this.settings.checkbox.tie_selection && this.element.addClass("jstree-checkbox-selection")
                }, this)).on("loading.jstree", e.proxy(function() {
                    this[this._data.checkbox.visible ? "show_checkboxes" : "hide_checkboxes"]()
                }, this)), -1 !== this.settings.checkbox.cascade.indexOf("undetermined") && this.element.on("changed.jstree uncheck_node.jstree check_node.jstree uncheck_all.jstree check_all.jstree move_node.jstree copy_node.jstree redraw.jstree open_node.jstree", e.proxy(function() {
                    this._data.checkbox.uto && clearTimeout(this._data.checkbox.uto), this._data.checkbox.uto = setTimeout(e.proxy(this._undetermined, this), 50)
                }, this)), this.settings.checkbox.tie_selection || this.element.on("model.jstree", e.proxy(function(e, t) {
                    var i = this._model.data,
                        s = i[t.parent],
                        r = t.nodes,
                        n, a;
                    for (n = 0, a = r.length; a > n; n++) i[r[n]].state.checked = i[r[n]].original && i[r[n]].original.state && i[r[n]].original.state.checked, i[r[n]].state.checked && this._data.checkbox.selected.push(r[n])
                }, this)), (-1 !== this.settings.checkbox.cascade.indexOf("up") || -1 !== this.settings.checkbox.cascade.indexOf("down")) && this.element.on("model.jstree", e.proxy(function(t, i) {
                    var s = this._model.data,
                        r = s[i.parent],
                        n = i.nodes,
                        a = [],
                        d, o, c, l, h, _, u = this.settings.checkbox.cascade,
                        g = this.settings.checkbox.tie_selection;
                    if (-1 !== u.indexOf("down"))
                        if (r.state[g ? "selected" : "checked"]) {
                            for (o = 0, c = n.length; c > o; o++) s[n[o]].state[g ? "selected" : "checked"] = !0;
                            this._data[g ? "core" : "checkbox"].selected = this._data[g ? "core" : "checkbox"].selected.concat(n)
                        } else
                            for (o = 0, c = n.length; c > o; o++)
                                if (s[n[o]].state[g ? "selected" : "checked"]) {
                                    for (l = 0, h = s[n[o]].children_d.length; h > l; l++) s[s[n[o]].children_d[l]].state[g ? "selected" : "checked"] = !0;
                                    this._data[g ? "core" : "checkbox"].selected = this._data[g ? "core" : "checkbox"].selected.concat(s[n[o]].children_d)
                                }
                    if (-1 !== u.indexOf("up")) {
                        for (o = 0, c = r.children_d.length; c > o; o++) s[r.children_d[o]].children.length || a.push(s[r.children_d[o]].parent);
                        for (a = e.vakata.array_unique(a), l = 0, h = a.length; h > l; l++) {
                            r = s[a[l]];
                            while (r && "#" !== r.id) {
                                for (d = 0, o = 0, c = r.children.length; c > o; o++) d += s[r.children[o]].state[g ? "selected" : "checked"];
                                if (d !== c) break;
                                r.state[g ? "selected" : "checked"] = !0, this._data[g ? "core" : "checkbox"].selected.push(r.id), _ = this.get_node(r, !0), _ && _.length && _.children(".jstree-anchor").addClass(g ? "jstree-clicked" : "jstree-checked"), r = this.get_node(r.parent)
                            }
                        }
                    }
                    this._data[g ? "core" : "checkbox"].selected = e.vakata.array_unique(this._data[g ? "core" : "checkbox"].selected)
                }, this)).on(this.settings.checkbox.tie_selection ? "select_node.jstree" : "check_node.jstree", e.proxy(function(t, i) {
                    var s = i.node,
                        r = this._model.data,
                        n = this.get_node(s.parent),
                        a = this.get_node(s, !0),
                        d, o, c, l, h = this.settings.checkbox.cascade,
                        _ = this.settings.checkbox.tie_selection;
                    if (-1 !== h.indexOf("down"))
                        for (this._data[_ ? "core" : "checkbox"].selected = e.vakata.array_unique(this._data[_ ? "core" : "checkbox"].selected.concat(s.children_d)), d = 0, o = s.children_d.length; o > d; d++) l = r[s.children_d[d]], l.state[_ ? "selected" : "checked"] = !0, l && l.original && l.original.state && l.original.state.undetermined && (l.original.state.undetermined = !1);
                    if (-1 !== h.indexOf("up"))
                        while (n && "#" !== n.id) {
                            for (c = 0, d = 0, o = n.children.length; o > d; d++) c += r[n.children[d]].state[_ ? "selected" : "checked"];
                            if (c !== o) break;
                            n.state[_ ? "selected" : "checked"] = !0, this._data[_ ? "core" : "checkbox"].selected.push(n.id), l = this.get_node(n, !0), l && l.length && l.children(".jstree-anchor").addClass(_ ? "jstree-clicked" : "jstree-checked"), n = this.get_node(n.parent)
                        } - 1 !== h.indexOf("down") && a.length && a.find(".jstree-anchor").addClass(_ ? "jstree-clicked" : "jstree-checked")
                }, this)).on(this.settings.checkbox.tie_selection ? "deselect_all.jstree" : "uncheck_all.jstree", e.proxy(function(e, t) {
                    var i = this.get_node("#"),
                        s = this._model.data,
                        r, n, a;
                    for (r = 0, n = i.children_d.length; n > r; r++) a = s[i.children_d[r]], a && a.original && a.original.state && a.original.state.undetermined && (a.original.state.undetermined = !1)
                }, this)).on(this.settings.checkbox.tie_selection ? "deselect_node.jstree" : "uncheck_node.jstree", e.proxy(function(t, i) {
                    var s = i.node,
                        r = this.get_node(s, !0),
                        n, a, d, o = this.settings.checkbox.cascade,
                        c = this.settings.checkbox.tie_selection;
                    if (s && s.original && s.original.state && s.original.state.undetermined && (s.original.state.undetermined = !1), -1 !== o.indexOf("down"))
                        for (n = 0, a = s.children_d.length; a > n; n++) d = this._model.data[s.children_d[n]], d.state[c ? "selected" : "checked"] = !1, d && d.original && d.original.state && d.original.state.undetermined && (d.original.state.undetermined = !1);
                    if (-1 !== o.indexOf("up"))
                        for (n = 0, a = s.parents.length; a > n; n++) d = this._model.data[s.parents[n]], d.state[c ? "selected" : "checked"] = !1, d && d.original && d.original.state && d.original.state.undetermined && (d.original.state.undetermined = !1), d = this.get_node(s.parents[n], !0), d && d.length && d.children(".jstree-anchor").removeClass(c ? "jstree-clicked" : "jstree-checked");
                    for (d = [], n = 0, a = this._data[c ? "core" : "checkbox"].selected.length; a > n; n++) - 1 !== o.indexOf("down") && -1 !== e.inArray(this._data[c ? "core" : "checkbox"].selected[n], s.children_d) || -1 !== o.indexOf("up") && -1 !== e.inArray(this._data[c ? "core" : "checkbox"].selected[n], s.parents) || d.push(this._data[c ? "core" : "checkbox"].selected[n]);
                    this._data[c ? "core" : "checkbox"].selected = e.vakata.array_unique(d), -1 !== o.indexOf("down") && r.length && r.find(".jstree-anchor").removeClass(c ? "jstree-clicked" : "jstree-checked")
                }, this)), -1 !== this.settings.checkbox.cascade.indexOf("up") && this.element.on("delete_node.jstree", e.proxy(function(e, t) {
                    var i = this.get_node(t.parent),
                        s = this._model.data,
                        r, n, a, d, o = this.settings.checkbox.tie_selection;
                    while (i && "#" !== i.id) {
                        for (a = 0, r = 0, n = i.children.length; n > r; r++) a += s[i.children[r]].state[o ? "selected" : "checked"];
                        if (a !== n) break;
                        i.state[o ? "selected" : "checked"] = !0, this._data[o ? "core" : "checkbox"].selected.push(i.id), d = this.get_node(i, !0), d && d.length && d.children(".jstree-anchor").addClass(o ? "jstree-clicked" : "jstree-checked"), i = this.get_node(i.parent)
                    }
                }, this)).on("move_node.jstree", e.proxy(function(t, i) {
                    var s = i.is_multi,
                        r = i.old_parent,
                        n = this.get_node(i.parent),
                        a = this._model.data,
                        d, o, c, l, h, _ = this.settings.checkbox.tie_selection;
                    if (!s) {
                        d = this.get_node(r);
                        while (d && "#" !== d.id) {
                            for (o = 0, c = 0, l = d.children.length; l > c; c++) o += a[d.children[c]].state[_ ? "selected" : "checked"];
                            if (o !== l) break;
                            d.state[_ ? "selected" : "checked"] = !0, this._data[_ ? "core" : "checkbox"].selected.push(d.id), h = this.get_node(d, !0), h && h.length && h.children(".jstree-anchor").addClass(_ ? "jstree-clicked" : "jstree-checked"), d = this.get_node(d.parent)
                        }
                    }
                    d = n;
                    while (d && "#" !== d.id) {
                        for (o = 0, c = 0, l = d.children.length; l > c; c++) o += a[d.children[c]].state[_ ? "selected" : "checked"];
                        if (o === l) d.state[_ ? "selected" : "checked"] || (d.state[_ ? "selected" : "checked"] = !0, this._data[_ ? "core" : "checkbox"].selected.push(d.id), h = this.get_node(d, !0), h && h.length && h.children(".jstree-anchor").addClass(_ ? "jstree-clicked" : "jstree-checked"));
                        else {
                            if (!d.state[_ ? "selected" : "checked"]) break;
                            d.state[_ ? "selected" : "checked"] = !1, this._data[_ ? "core" : "checkbox"].selected = e.vakata.array_remove_item(this._data[_ ? "core" : "checkbox"].selected, d.id), h = this.get_node(d, !0), h && h.length && h.children(".jstree-anchor").removeClass(_ ? "jstree-clicked" : "jstree-checked")
                        }
                        d = this.get_node(d.parent)
                    }
                }, this))
            }, this._undetermined = function() {
                var t, i, s = this._model.data,
                    r = this.settings.checkbox.tie_selection,
                    n = this._data[r ? "core" : "checkbox"].selected,
                    a = [],
                    d = this;
                for (t = 0, i = n.length; i > t; t++) s[n[t]] && s[n[t]].parents && (a = a.concat(s[n[t]].parents));
                for (this.element.find(".jstree-closed").not(":has(.jstree-children)").each(function() {
                    var e = d.get_node(this),
                        r;
                    if (e.state.loaded)
                        for (t = 0, i = e.children_d.length; i > t; t++) r = s[e.children_d[t]], !r.state.loaded && r.original && r.original.state && r.original.state.undetermined && r.original.state.undetermined === !0 && (a.push(r.id), a = a.concat(r.parents));
                    else e.original && e.original.state && e.original.state.undetermined && e.original.state.undetermined === !0 && (a.push(e.id), a = a.concat(e.parents))
                }), a = e.vakata.array_unique(a), a = e.vakata.array_remove_item(a, "#"), this.element.find(".jstree-undetermined").removeClass("jstree-undetermined"), t = 0, i = a.length; i > t; t++) s[a[t]].state[r ? "selected" : "checked"] || (n = this.get_node(a[t], !0), n && n.length && n.children(".jstree-anchor").children(".jstree-checkbox").addClass("jstree-undetermined"))
            }, this.redraw_node = function(t, i, r) {
                if (t = s.redraw_node.call(this, t, i, r)) {
                    var n, a, d = null;
                    for (n = 0, a = t.childNodes.length; a > n; n++)
                        if (t.childNodes[n] && t.childNodes[n].className && -1 !== t.childNodes[n].className.indexOf("jstree-anchor")) {
                            d = t.childNodes[n];
                            break
                        }
                    d && (!this.settings.checkbox.tie_selection && this._model.data[t.id].state.checked && (d.className += " jstree-checked"), d.insertBefore(_.cloneNode(!1), d.childNodes[0]))
                }
                return r || -1 === this.settings.checkbox.cascade.indexOf("undetermined") || (this._data.checkbox.uto && clearTimeout(this._data.checkbox.uto), this._data.checkbox.uto = setTimeout(e.proxy(this._undetermined, this), 50)), t
            }, this.show_checkboxes = function() {
                this._data.core.themes.checkboxes = !0, this.get_container_ul().removeClass("jstree-no-checkboxes")
            }, this.hide_checkboxes = function() {
                this._data.core.themes.checkboxes = !1, this.get_container_ul().addClass("jstree-no-checkboxes")
            }, this.toggle_checkboxes = function() {
                this._data.core.themes.checkboxes ? this.hide_checkboxes() : this.show_checkboxes()
            }, this.is_undetermined = function(t) {
                t = this.get_node(t);
                var i = this.settings.checkbox.cascade,
                    s, r, n = this.settings.checkbox.tie_selection,
                    a = this._data[n ? "core" : "checkbox"].selected,
                    d = this._model.data;
                if (!t || t.state[n ? "selected" : "checked"] === !0 || -1 === i.indexOf("undetermined") || -1 === i.indexOf("down") && -1 === i.indexOf("up")) return !1;
                if (!t.state.loaded && t.original.state.undetermined === !0) return !0;
                for (s = 0, r = t.children_d.length; r > s; s++)
                    if (-1 !== e.inArray(t.children_d[s], a) || !d[t.children_d[s]].state.loaded && d[t.children_d[s]].original.state.undetermined) return !0;
                return !1
            }, this.activate_node = function(i, r) {
                return this.settings.checkbox.tie_selection && (this.settings.checkbox.whole_node || e(r.target).hasClass("jstree-checkbox")) && (r.ctrlKey = !0), this.settings.checkbox.tie_selection || !this.settings.checkbox.whole_node && !e(r.target).hasClass("jstree-checkbox") ? s.activate_node.call(this, i, r) : (this.is_checked(i) ? this.uncheck_node(i, r) : this.check_node(i, r), this.trigger("activate_node", {
                    node: this.get_node(i)
                }), t)
            }, this.check_node = function(i, s) {
                if (this.settings.checkbox.tie_selection) return this.select_node(i, !1, !0, s);
                var r, n, a, d;
                if (e.isArray(i)) {
                    for (i = i.slice(), n = 0, a = i.length; a > n; n++) this.check_node(i[n], s);
                    return !0
                }
                return i = this.get_node(i), i && "#" !== i.id ? (r = this.get_node(i, !0), i.state.checked || (i.state.checked = !0, this._data.checkbox.selected.push(i.id), r && r.length && r.children(".jstree-anchor").addClass("jstree-checked"), this.trigger("check_node", {
                    node: i,
                    selected: this._data.checkbox.selected,
                    event: s
                })), t) : !1
            }, this.uncheck_node = function(i, s) {
                if (this.settings.checkbox.tie_selection) return this.deselect_node(i, !1, s);
                var r, n, a;
                if (e.isArray(i)) {
                    for (i = i.slice(), r = 0, n = i.length; n > r; r++) this.uncheck_node(i[r], s);
                    return !0
                }
                return i = this.get_node(i), i && "#" !== i.id ? (a = this.get_node(i, !0), i.state.checked && (i.state.checked = !1, this._data.checkbox.selected = e.vakata.array_remove_item(this._data.checkbox.selected, i.id), a.length && a.children(".jstree-anchor").removeClass("jstree-checked"), this.trigger("uncheck_node", {
                    node: i,
                    selected: this._data.checkbox.selected,
                    event: s
                })), t) : !1
            }, this.check_all = function() {
                if (this.settings.checkbox.tie_selection) return this.select_all();
                var e = this._data.checkbox.selected.concat([]),
                    t, i;
                for (this._data.checkbox.selected = this._model.data["#"].children_d.concat(), t = 0, i = this._data.checkbox.selected.length; i > t; t++) this._model.data[this._data.checkbox.selected[t]] && (this._model.data[this._data.checkbox.selected[t]].state.checked = !0);
                this.redraw(!0), this.trigger("check_all", {
                    selected: this._data.checkbox.selected
                })
            }, this.uncheck_all = function() {
                if (this.settings.checkbox.tie_selection) return this.deselect_all();
                var e = this._data.checkbox.selected.concat([]),
                    t, i;
                for (t = 0, i = this._data.checkbox.selected.length; i > t; t++) this._model.data[this._data.checkbox.selected[t]] && (this._model.data[this._data.checkbox.selected[t]].state.checked = !1);
                this._data.checkbox.selected = [], this.element.find(".jstree-checked").removeClass("jstree-checked"), this.trigger("uncheck_all", {
                    selected: this._data.checkbox.selected,
                    node: e
                })
            }, this.is_checked = function(e) {
                return this.settings.checkbox.tie_selection ? this.is_selected(e) : (e = this.get_node(e), e && "#" !== e.id ? e.state.checked : !1)
            }, this.get_checked = function(t) {
                return this.settings.checkbox.tie_selection ? this.get_selected(t) : t ? e.map(this._data.checkbox.selected, e.proxy(function(e) {
                    return this.get_node(e)
                }, this)) : this._data.checkbox.selected
            }, this.get_top_checked = function(t) {
                if (this.settings.checkbox.tie_selection) return this.get_top_selected(t);
                var i = this.get_checked(!0),
                    s = {},
                    r, n, a, d;
                for (r = 0, n = i.length; n > r; r++) s[i[r].id] = i[r];
                for (r = 0, n = i.length; n > r; r++)
                    for (a = 0, d = i[r].children_d.length; d > a; a++) s[i[r].children_d[a]] && delete s[i[r].children_d[a]];
                i = [];
                for (r in s) s.hasOwnProperty(r) && i.push(r);
                return t ? e.map(i, e.proxy(function(e) {
                    return this.get_node(e)
                }, this)) : i
            }, this.get_bottom_checked = function(t) {
                if (this.settings.checkbox.tie_selection) return this.get_bottom_selected(t);
                var i = this.get_checked(!0),
                    s = [],
                    r, n;
                for (r = 0, n = i.length; n > r; r++) i[r].children.length || s.push(i[r].id);
                return t ? e.map(s, e.proxy(function(e) {
                    return this.get_node(e)
                }, this)) : s
            }
        }, e.jstree.defaults.contextmenu = {

            select_node: !0,
            show_at_node: !0,
            items: function(t, i) {

                return {
                    create: {

                        separator_before: !1,
                        separator_after: !0,
                        _disabled: !1,
                        label: "Create",
                        action: function(t) {

                            var i = e.jstree.reference(t.reference),
                                s = i.get_node(t.reference);
                            i.create_node(s, {}, "last", function(e) {
                                setTimeout(function() {
                                    i.edit(e)
                                }, 0)
                            })
                        }
                    },
                    rename: {
                        separator_before: !1,
                        separator_after: !1,
                        _disabled: !1,
                        label: "Rename",
                        action: function(t) {
                            var i = e.jstree.reference(t.reference),
                                s = i.get_node(t.reference);
                            i.edit(s)
                        }
                    },
                    remove: {
                        separator_before: !1,
                        icon: !1,
                        separator_after: !1,
                        _disabled: !1,
                        label: "Delete",
                        action: function(t) {
                            var i = e.jstree.reference(t.reference),
                                s = i.get_node(t.reference);
                            i.is_selected(s) ? i.delete_node(i.get_selected()) : i.delete_node(s)

                        }
                    },
                    ccp: {
                        separator_before: !0,
                        icon: !1,
                        separator_after: !1,
                        label: "Edit",
                        action: !1,
                        submenu: {
                            cut: {
                                separator_before: !1,
                                separator_after: !1,
                                label: "Cut",
                                action: function(t) {
                                    var i = e.jstree.reference(t.reference),
                                        s = i.get_node(t.reference);
                                    i.is_selected(s) ? i.cut(i.get_selected()) : i.cut(s)
                                }
                            },
                            copy: {
                                separator_before: !1,
                                icon: !1,
                                separator_after: !1,
                                label: "Copy",
                                action: function(t) {
                                    var i = e.jstree.reference(t.reference),
                                        s = i.get_node(t.reference);
                                    i.is_selected(s) ? i.copy(i.get_selected()) : i.copy(s)
                                }
                            },
                            paste: {
                                separator_before: !1,
                                icon: !1,
                                _disabled: function(t) {
                                    return !e.jstree.reference(t.reference).can_paste()
                                },
                                separator_after: !1,
                                label: "Paste",
                                action: function(t) {
                                    var i = e.jstree.reference(t.reference),
                                        s = i.get_node(t.reference);
                                    i.paste(s)
                                }
                            }
                        }
                    }
                }
            }
        }, e.jstree.plugins.contextmenu = function(i, s) {
            this.bind = function() {
                s.bind.call(this);
                var t = 0;
                this.element.on("contextmenu.jstree", ".jstree-anchor", e.proxy(function(e) {
                    e.preventDefault(), t = e.ctrlKey ? e.timeStamp : 0, this.is_loading(e.currentTarget) || this.show_contextmenu(e.currentTarget, e.pageX, e.pageY, e)
                }, this)).on("click.jstree", ".jstree-anchor", e.proxy(function(i) {
                    this._data.contextmenu.visible && (!t || i.timeStamp - t > 250) && e.vakata.context.hide()
                }, this)), e(document).on("context_hide.vakata", e.proxy(function() {
                    this._data.contextmenu.visible = !1
                }, this))
            }, this.teardown = function() {
                this._data.contextmenu.visible && e.vakata.context.hide(), s.teardown.call(this)
            }, this.show_contextmenu = function(i, s, r, n) {
                if (i = this.get_node(i), !i || "#" === i.id) return !1;
                var a = this.settings.contextmenu,
                    d = this.get_node(i, !0),
                    o = d.children(".jstree-anchor"),
                    c = !1,
                    l = !1;
                (a.show_at_node || s === t || r === t) && (c = o.offset(), s = c.left, r = c.top + this._data.core.li_height), this.settings.contextmenu.select_node && !this.is_selected(i) && this.activate_node(i, n), l = a.items, e.isFunction(l) && (l = l.call(this, i, e.proxy(function(e) {
                    this._show_contextmenu(i, s, r, e)
                }, this))), e.isPlainObject(l) && this._show_contextmenu(i, s, r, l)
            }, this._show_contextmenu = function(t, i, s, r) {
                var n = this.get_node(t, !0),
                    a = n.children(".jstree-anchor");
                e(document).one("context_show.vakata", e.proxy(function(t, i) {
                    var s = "jstree-contextmenu jstree-" + this.get_theme() + "-contextmenu";
                    e(i.element).addClass(s)
                }, this)), this._data.contextmenu.visible = !0, e.vakata.context.show(a, {
                    x: i,
                    y: s
                }, r), this.trigger("show_contextmenu", {
                    node: t,
                    x: i,
                    y: s
                })
            }
        },
            function(e) {
                var i = !1,
                    s = {
                        element: !1,
                        reference: !1,
                        position_x: 0,
                        position_y: 0,
                        items: [],
                        html: "",
                        is_visible: !1
                    };
                e.vakata.context = {
                    settings: {
                        hide_onmouseleave: 0,
                        icons: !0
                    },
                    _trigger: function(t) {
                        e(document).triggerHandler("context_" + t + ".vakata", {
                            reference: s.reference,
                            element: s.element,
                            position: {
                                x: s.position_x,
                                y: s.position_y
                            }
                        })
                    },
                    _execute: function(t) {
                        return t = s.items[t], t && (!t._disabled || e.isFunction(t._disabled) && !t._disabled({
                            item: t,
                            reference: s.reference,
                            element: s.element
                        })) && t.action ? t.action.call(null, {
                            item: t,
                            reference: s.reference,
                            element: s.element,
                            position: {
                                x: s.position_x,
                                y: s.position_y
                            }
                        }) : !1
                    },
                    _parse: function(i, r) {
                        if (!i) return !1;
                        r || (s.html = "", s.items = []);
                        var n = "",
                            a = !1,
                            d;
                        return r && (n += "<ul>"), e.each(i, function(i, r) {
                            return r ? (s.items.push(r), !a && r.separator_before && (n += "<li class='vakata-context-separator'><a href='#' " + (e.vakata.context.settings.icons ? "" : 'style="margin-left:0px;"') + ">&#160;<" + "/a><" + "/li>"), a = !1, n += "<li class='" + (r._class || "") + (r._disabled === !0 || e.isFunction(r._disabled) && r._disabled({
                                item: r,
                                reference: s.reference,
                                element: s.element
                            }) ? " vakata-contextmenu-disabled " : "") + "' " + (r.shortcut ? " data-shortcut='" + r.shortcut + "' " : "") + ">", n += "<a href='#' rel='" + (s.items.length - 1) + "'>", e.vakata.context.settings.icons && (n += "<i ", r.icon && (n += -1 !== r.icon.indexOf("/") || -1 !== r.icon.indexOf(".") ? " style='background:url(\"" + r.icon + "\") center center no-repeat' " : " class='" + r.icon + "' "), n += "></i><span class='vakata-contextmenu-sep'>&#160;</span>"), n += (e.isFunction(r.label) ? r.label({
                                item: i,
                                reference: s.reference,
                                element: s.element
                            }) : r.label) + (r.shortcut ? ' <span class="vakata-contextmenu-shortcut vakata-contextmenu-shortcut-' + r.shortcut + '">' + (r.shortcut_label || "") + "</span>" : "") + "<" + "/a>", r.submenu && (d = e.vakata.context._parse(r.submenu, !0), d && (n += d)), n += "</li>", r.separator_after && (n += "<li class='vakata-context-separator'><a href='#' " + (e.vakata.context.settings.icons ? "" : 'style="margin-left:0px;"') + ">&#160;<" + "/a><" + "/li>", a = !0), t) : !0
                        }), n = n.replace(/<li class\='vakata-context-separator'\><\/li\>$/, ""), r && (n += "</ul>"), r || (s.html = n, e.vakata.context._trigger("parse")), n.length > 10 ? n : !1
                    },
                    _show_submenu: function(t) {
                        if (t = e(t), t.length && t.children("ul").length) {
                            var s = t.children("ul"),
                                r = t.offset().left + t.outerWidth(),
                                n = t.offset().top,
                                a = s.width(),
                                d = s.height(),
                                o = e(window).width() + e(window).scrollLeft(),
                                c = e(window).height() + e(window).scrollTop();
                            i ? t[0 > r - (a + 10 + t.outerWidth()) ? "addClass" : "removeClass"]("vakata-context-left") : t[r + a + 10 > o ? "addClass" : "removeClass"]("vakata-context-right"), n + d + 10 > c && s.css("bottom", "-1px"), s.show()
                        }
                    },
                    show: function(t, r, n) {
                        var a, d, o, c, l, h, _, u, g = !0;
                        switch (s.element && s.element.length && s.element.width(""), g) {
                            case !r && !t:
                                return !1;
                            case !!r && !!t:
                                s.reference = t, s.position_x = r.x, s.position_y = r.y;
                                break;
                            case !r && !!t:
                                s.reference = t, a = t.offset(), s.position_x = a.left + t.outerHeight(), s.position_y = a.top;
                                break;
                            case !!r && !t:
                                s.position_x = r.x, s.position_y = r.y
                        }
                        t && !n && e(t).data("vakata_contextmenu") && (n = e(t).data("vakata_contextmenu")), e.vakata.context._parse(n) && s.element.html(s.html), s.items.length && (d = s.element, o = s.position_x, c = s.position_y, l = d.width(), h = d.height(), _ = e(window).width() + e(window).scrollLeft(), u = e(window).height() + e(window).scrollTop(), i && (o -= d.outerWidth(), e(window).scrollLeft() + 20 > o && (o = e(window).scrollLeft() + 20)), o + l + 20 > _ && (o = _ - (l + 20)), c + h + 20 > u && (c = u - (h + 20)), s.element.css({
                            left: o,
                            top: c
                        }).show().find("a:eq(0)").focus().parent().addClass("vakata-context-hover"), s.is_visible = !0, e.vakata.context._trigger("show"))
                    },
                    hide: function() {
                        s.is_visible && (s.element.hide().find("ul").hide().end().find(":focus").blur(), s.is_visible = !1, e.vakata.context._trigger("hide"))
                    }
                }, e(function() {
                    i = "rtl" === e("body").css("direction");
                    var t = !1;
                    s.element = e("<ul class='vakata-context'></ul>"), s.element.on("mouseenter", "li", function(i) {
                        i.stopImmediatePropagation(), e.contains(this, i.relatedTarget) || (t && clearTimeout(t), s.element.find(".vakata-context-hover").removeClass("vakata-context-hover").end(), e(this).siblings().find("ul").hide().end().end().parentsUntil(".vakata-context", "li").addBack().addClass("vakata-context-hover"), e.vakata.context._show_submenu(this))
                    }).on("mouseleave", "li", function(t) {
                        e.contains(this, t.relatedTarget) || e(this).find(".vakata-context-hover").addBack().removeClass("vakata-context-hover")
                    }).on("mouseleave", function(i) {
                        e(this).find(".vakata-context-hover").removeClass("vakata-context-hover"), e.vakata.context.settings.hide_onmouseleave && (t = setTimeout(function(t) {
                            return function() {
                                e.vakata.context.hide()
                            }
                        }(this), e.vakata.context.settings.hide_onmouseleave))
                    }).on("click", "a", function(t) {

                        t.preventDefault(), e(this).blur().parent().hasClass("vakata-context-disabled") || e.vakata.context._execute(e(this).attr("rel")) === !1 || e.vakata.context.hide()
                    }).on("keydown", "a", function(t) {
                        var i = null;
                        switch (t.which) {
                            case 13:
                            case 32:
                                t.type = "mouseup", t.preventDefault(), e(t.currentTarget).trigger(t);
                                break;
                            case 37:
                                s.is_visible && (s.element.find(".vakata-context-hover").last().parents("li:eq(0)").find("ul").hide().find(".vakata-context-hover").removeClass("vakata-context-hover").end().end().children("a").focus(), t.stopImmediatePropagation(), t.preventDefault());
                                break;
                            case 38:
                                s.is_visible && (i = s.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").prevAll("li:not(.vakata-context-separator)").first(), i.length || (i = s.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").last()), i.addClass("vakata-context-hover").children("a").focus(), t.stopImmediatePropagation(), t.preventDefault());
                                break;
                            case 39:
                                s.is_visible && (s.element.find(".vakata-context-hover").last().children("ul").show().children("li:not(.vakata-context-separator)").removeClass("vakata-context-hover").first().addClass("vakata-context-hover").children("a").focus(), t.stopImmediatePropagation(), t.preventDefault());
                                break;
                            case 40:
                                s.is_visible && (i = s.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").nextAll("li:not(.vakata-context-separator)").first(), i.length || (i = s.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").first()), i.addClass("vakata-context-hover").children("a").focus(), t.stopImmediatePropagation(), t.preventDefault());
                                break;
                            case 27:
                                e.vakata.context.hide(), t.preventDefault();
                                break;
                            default:
                        }
                    }).on("keydown", function(e) {

                        e.preventDefault();
                        var t = s.element.find(".vakata-contextmenu-shortcut-" + e.which).parent();
                        t.parent().not(".vakata-context-disabled") && t.mouseup()
                    }).appendTo("body"), e(document).on("mousedown", function(t) {
                        s.is_visible && !e.contains(s.element[0], t.target) && e.vakata.context.hide()
                    }).on("context_show.vakata", function(e, t) {
                        s.element.find("li:has(ul)").children("a").addClass("vakata-context-parent"), i && s.element.addClass("vakata-context-rtl").css("direction", "rtl"), s.element.find("ul").hide().end()
                    })
                })
            }(e), e.jstree.defaults.dnd = {
            copy: !0,
            open_timeout: 500,
            is_draggable: !0,
            check_while_dragging: !0,
            multiple : !0,
            always_copy: !0,
             inside_pos: 0

        }, e.jstree.plugins.dnd = function(i, s) {
            this.bind = function() {
                s.bind.call(this), this.element.on("mousedown.jstree touchstart.jstree", ".jstree-anchor", e.proxy(function(i) {
                    var s = this.get_node(i.target),
                        r = this.is_selected(s) ? this.get_selected().length : 1;
                    return s && s.id && "#" !== s.id && (1 === i.which || "touchstart" === i.type) && (this.settings.dnd.is_draggable === !0 || e.isFunction(this.settings.dnd.is_draggable) && this.settings.dnd.is_draggable.call(this, r > 1 ? this.get_selected(!0) : [s])) ? (this.element.trigger("mousedown.jstree"), e.vakata.dnd.start(i, {
                        jstree: !0,
                        origin: this,
                        obj: this.get_node(s, !0),
                        nodes: r > 1 ? this.get_selected() : [s.id]
                    }, '<div id="jstree-dnd" class="jstree-' + this.get_theme() + (this.settings.core.themes.responsive ? " jstree-dnd-responsive" : "") + '"><i class="jstree-icon jstree-er"></i>' + (r > 1 ? r + " " + this.get_string("nodes") : this.get_text(i.currentTarget, !0)) + '<ins class="jstree-copy" style="display:none;">+</ins></div>')) : t
                }, this))
            }
        }, e(function() {
            var i = !1,
                s = !1,
                r = !1,
                n = e('<div id="jstree-marker">&#160;</div>').hide().appendTo("body");
            e(document).bind("dnd_start.vakata", function(e, t) {
                i = !1
                console.log(e);
                console.log(t);

            }).bind("dnd_move.vakata", function(a, d) {
                if (r && clearTimeout(r), d && d.data && d.data.jstree && (!d.event.target.id || "jstree-marker" !== d.event.target.id)) {
                    var o = e.jstree.reference(d.event.target),
                        c = !1,
                        l = !1,
                        h = !1,
                        _, u, g, f, p, m, v, j, k, y, x, b, w, C;
                    if (o && o._data && o._data.dnd)
                        if (n.attr("class", "jstree-" + o.get_theme() + (o.settings.core.themes.responsive ? " jstree-dnd-responsive" : "")), d.helper.children().attr("class", "jstree-" + o.get_theme() + (o.settings.core.themes.responsive ? " jstree-dnd-responsive" : "")).find(".jstree-copy:eq(0)")[d.data.origin && (d.data.origin.settings.dnd.always_copy || d.data.origin.settings.dnd.copy && (d.event.metaKey || d.event.ctrlKey)) ? "show" : "hide"](), d.event.target !== o.element[0] && d.event.target !== o.get_container_ul()[0] || 0 !== o.get_container_ul().children().length) {
                            if (c = e(d.event.target).closest(".jstree-anchor"), c && c.length && c.parent().is(".jstree-closed, .jstree-open, .jstree-leaf") && (l = c.offset(), h = d.event.pageY - l.top, g = c.height(), m = g / 3 > h ? ["b", "i", "a"] : h > g - g / 3 ? ["a", "i", "b"] : h > g / 2 ? ["i", "a", "b"] : ["i", "b", "a"], e.each(m, function(a, h) {
                                    switch (h) {
                                        case "b":
                                            _ = l.left - 6, u = l.top, f = o.get_parent(c), p = c.parent().index();
                                            break;
                                        case "i":
                                            w = o.settings.dnd.inside_pos, C = o.get_node(c.parent()), _ = l.left - 2, u = l.top + g / 2 + 1, f = C.id, p = "first" === w ? 0 : "last" === w ? C.children.length : Math.min(w, C.children.length);
                                            break;
                                        case "a":
                                            _ = l.left - 6, u = l.top + g, f = o.get_parent(c), p = c.parent().index() + 1
                                    }
                                    for (v = !0, j = 0, k = d.data.nodes.length; k > j; j++)
                                        if (y = d.data.origin && (d.data.origin.settings.dnd.always_copy || d.data.origin.settings.dnd.copy && (d.event.metaKey || d.event.ctrlKey)) ? "copy_node" : "move_node", x = p, "move_node" === y && "a" === h && d.data.origin && d.data.origin === o && f === o.get_parent(d.data.nodes[j]) && (b = o.get_node(f), x > e.inArray(d.data.nodes[j], b.children) && (x -= 1)), v = v && (o && o.settings && o.settings.dnd && o.settings.dnd.check_while_dragging === !1 || o.check(y, d.data.origin && d.data.origin !== o ? d.data.origin.get_node(d.data.nodes[j]) : d.data.nodes[j], f, x, {
                                                dnd: !0,
                                                ref: o.get_node(c.parent()),
                                                pos: h,
                                                is_multi: d.data.origin && d.data.origin !== o,
                                                is_foreign: !d.data.origin
                                            })), !v) {
                                            o && o.last_error && (s = o.last_error());
                                            break
                                        }
                                    return v ? ("i" === h && c.parent().is(".jstree-closed") && o.settings.dnd.open_timeout && (r = setTimeout(function(e, t) {
                                        return function() {
                                            e.open_node(t)
                                        }
                                    }(o, c), o.settings.dnd.open_timeout)), i = {
                                        ins: o,
                                        par: f,
                                        pos: "i" !== h || "last" !== w || 0 !== p || o.is_loaded(C) ? p : "last"
                                    }, n.css({
                                        left: _ + "px",
                                        top: u + "px"
                                    }).show(), d.helper.find(".jstree-icon:eq(0)").removeClass("jstree-er").addClass("jstree-ok"), s = {}, m = !0, !1) : t
                                }), m === !0)) return
                        } else {
                            for (v = !0, j = 0, k = d.data.nodes.length; k > j; j++)
                                if (v = v && o.check(d.data.origin && (d.data.origin.settings.dnd.always_copy || d.data.origin.settings.dnd.copy && (d.event.metaKey || d.event.ctrlKey)) ? "copy_node" : "move_node", d.data.origin && d.data.origin !== o ? d.data.origin.get_node(d.data.nodes[j]) : d.data.nodes[j], "#", "last", {
                                        dnd: !0,
                                        ref: o.get_node("#"),
                                        pos: "i",
                                        is_multi: d.data.origin && d.data.origin !== 0,
                                        is_foreign: !d.data.origin
                                    }), !v) break;
                            if (v) return i = {
                                ins: o,
                                par: "#",
                                pos: "last"
                            }, n.hide(), d.helper.find(".jstree-icon:eq(0)").removeClass("jstree-er").addClass("jstree-ok"), t
                        }
                    i = !1, d.helper.find(".jstree-icon").removeClass("jstree-ok").addClass("jstree-er"), n.hide()
                }
            }).bind("dnd_scroll.vakata", function(e, t) {
                t && t.data && t.data.jstree && (n.hide(), i = !1, t.helper.find(".jstree-icon:eq(0)").removeClass("jstree-ok").addClass("jstree-er"))
            }).bind("dnd_stop.vakata", function(t, a) {
                if (r && clearTimeout(r), a && a.data && a.data.jstree) {
                    n.hide();
                    var d, o, c = [];
                    if (i) {
                        for (d = 0, o = a.data.nodes.length; o > d; d++) c[d] = a.data.origin ? a.data.origin.get_node(a.data.nodes[d]) : a.data.nodes[d], a.data.origin && (c[d].instance = a.data.origin);
                        i.ins[a.data.origin && (a.data.origin.settings.dnd.always_copy || a.data.origin.settings.dnd.copy && (a.event.metaKey || a.event.ctrlKey)) ? "copy_node" : "move_node"](c, i.par, i.pos)
                    } else d = e(a.event.target).closest(".jstree"), d.length && s && s.error && "check" === s.error && (d = d.jstree(!0), d && d.settings.core.error.call(this, s))
                }
            }).bind("keyup keydown", function(t, i) {
                i = e.vakata.dnd._get(), i && i.data && i.data.jstree && i.helper.find(".jstree-copy:eq(0)")[i.data.origin && (i.data.origin.settings.dnd.always_copy || i.data.origin.settings.dnd.copy && (t.metaKey || t.ctrlKey)) ? "show" : "hide"]()
            })
        }),
            function(e) {
                var i = {
                    element: !1,
                    target: !1,
                    is_down: !1,
                    is_drag: !1,
                    helper: !1,
                    helper_w: 0,
                    data: !1,
                    init_x: 0,
                    init_y: 0,
                    scroll_l: 0,
                    scroll_t: 0,
                    scroll_e: !1,
                    scroll_i: !1,
                    is_touch: !1
                };
                e.vakata.dnd = {
                    settings: {
                        scroll_speed: 10,
                        scroll_proximity: 20,
                        helper_left: 5,
                        helper_top: 10,
                        threshold: 5,
                        threshold_touch: 50
                    },
                    _trigger: function(t, i) {
                        var s = e.vakata.dnd._get();
                        s.event = i, e(document).triggerHandler("dnd_" + t + ".vakata", s)
                    },
                    _get: function() {
                        return {
                            data: i.data,
                            element: i.element,
                            helper: i.helper
                        }
                    },
                    _clean: function() {
                        i.helper && i.helper.remove(), i.scroll_i && (clearInterval(i.scroll_i), i.scroll_i = !1), i = {
                            element: !1,
                            target: !1,
                            is_down: !1,
                            is_drag: !1,
                            helper: !1,
                            helper_w: 0,
                            data: !1,
                            init_x: 0,
                            init_y: 0,
                            scroll_l: 0,
                            scroll_t: 0,
                            scroll_e: !1,
                            scroll_i: !1,
                            is_touch: !1
                        }, e(document).off("mousemove touchmove", e.vakata.dnd.drag), e(document).off("mouseup touchend", e.vakata.dnd.stop)
                    },
                    _scroll: function(t) {
                        if (!i.scroll_e || !i.scroll_l && !i.scroll_t) return i.scroll_i && (clearInterval(i.scroll_i), i.scroll_i = !1), !1;
                        if (!i.scroll_i) return i.scroll_i = setInterval(e.vakata.dnd._scroll, 100), !1;
                        if (t === !0) return !1;
                        var s = i.scroll_e.scrollTop(),
                            r = i.scroll_e.scrollLeft();
                        i.scroll_e.scrollTop(s + i.scroll_t * e.vakata.dnd.settings.scroll_speed), i.scroll_e.scrollLeft(r + i.scroll_l * e.vakata.dnd.settings.scroll_speed), (s !== i.scroll_e.scrollTop() || r !== i.scroll_e.scrollLeft()) && e.vakata.dnd._trigger("scroll", i.scroll_e)
                    },
                    start: function(t, s, r) {
                        "touchstart" === t.type && t.originalEvent && t.originalEvent.changedTouches && t.originalEvent.changedTouches[0] && (t.pageX = t.originalEvent.changedTouches[0].pageX, t.pageY = t.originalEvent.changedTouches[0].pageY, t.target = document.elementFromPoint(t.originalEvent.changedTouches[0].pageX - window.pageXOffset, t.originalEvent.changedTouches[0].pageY - window.pageYOffset)), i.is_drag && e.vakata.dnd.stop({});
                        try {
                            t.currentTarget.unselectable = "on", t.currentTarget.onselectstart = function() {
                                return !1
                            }, t.currentTarget.style && (t.currentTarget.style.MozUserSelect = "none")
                        } catch (n) {}
                        return i.init_x = t.pageX, i.init_y = t.pageY, i.data = s, i.is_down = !0, i.element = t.currentTarget, i.target = t.target, i.is_touch = "touchstart" === t.type, r !== !1 && (i.helper = e("<div id='vakata-dnd'></div>").html(r).css({
                            display: "block",
                            margin: "0",
                            padding: "0",
                            position: "absolute",
                            top: "-2000px",
                            lineHeight: "16px",
                            zIndex: "10000"
                        })), e(document).bind("mousemove touchmove", e.vakata.dnd.drag), e(document).bind("mouseup touchend", e.vakata.dnd.stop), !1
                    },
                    drag: function(s) {
                        if ("touchmove" === s.type && s.originalEvent && s.originalEvent.changedTouches && s.originalEvent.changedTouches[0] && (s.pageX = s.originalEvent.changedTouches[0].pageX, s.pageY = s.originalEvent.changedTouches[0].pageY, s.target = document.elementFromPoint(s.originalEvent.changedTouches[0].pageX - window.pageXOffset, s.originalEvent.changedTouches[0].pageY - window.pageYOffset)), i.is_down) {
                            if (!i.is_drag) {
                                if (!(Math.abs(s.pageX - i.init_x) > (i.is_touch ? e.vakata.dnd.settings.threshold_touch : e.vakata.dnd.settings.threshold) || Math.abs(s.pageY - i.init_y) > (i.is_touch ? e.vakata.dnd.settings.threshold_touch : e.vakata.dnd.settings.threshold))) return;
                                i.helper && (i.helper.appendTo("body"), i.helper_w = i.helper.outerWidth()), i.is_drag = !0, e.vakata.dnd._trigger("start", s)
                            }
                            var r = !1,
                                n = !1,
                                a = !1,
                                d = !1,
                                o = !1,
                                c = !1,
                                l = !1,
                                h = !1,
                                _ = !1,
                                u = !1;
                            return i.scroll_t = 0, i.scroll_l = 0, i.scroll_e = !1, e(e(s.target).parentsUntil("body").addBack().get().reverse()).filter(function() {
                                return /^auto|scroll$/.test(e(this).css("overflow")) && (this.scrollHeight > this.offsetHeight || this.scrollWidth > this.offsetWidth)
                            }).each(function() {
                                var r = e(this),
                                    n = r.offset();
                                return this.scrollHeight > this.offsetHeight && (n.top + r.height() - s.pageY < e.vakata.dnd.settings.scroll_proximity && (i.scroll_t = 1), s.pageY - n.top < e.vakata.dnd.settings.scroll_proximity && (i.scroll_t = -1)), this.scrollWidth > this.offsetWidth && (n.left + r.width() - s.pageX < e.vakata.dnd.settings.scroll_proximity && (i.scroll_l = 1), s.pageX - n.left < e.vakata.dnd.settings.scroll_proximity && (i.scroll_l = -1)), i.scroll_t || i.scroll_l ? (i.scroll_e = e(this), !1) : t
                            }), i.scroll_e || (r = e(document), n = e(window), a = r.height(), d = n.height(), o = r.width(), c = n.width(), l = r.scrollTop(), h = r.scrollLeft(), a > d && s.pageY - l < e.vakata.dnd.settings.scroll_proximity && (i.scroll_t = -1), a > d && d - (s.pageY - l) < e.vakata.dnd.settings.scroll_proximity && (i.scroll_t = 1), o > c && s.pageX - h < e.vakata.dnd.settings.scroll_proximity && (i.scroll_l = -1), o > c && c - (s.pageX - h) < e.vakata.dnd.settings.scroll_proximity && (i.scroll_l = 1), (i.scroll_t || i.scroll_l) && (i.scroll_e = r)), i.scroll_e && e.vakata.dnd._scroll(!0), i.helper && (_ = parseInt(s.pageY + e.vakata.dnd.settings.helper_top, 10), u = parseInt(s.pageX + e.vakata.dnd.settings.helper_left, 10), a && _ + 25 > a && (_ = a - 50), o && u + i.helper_w > o && (u = o - (i.helper_w + 2)), i.helper.css({
                                left: u + "px",
                                top: _ + "px"
                            })), e.vakata.dnd._trigger("move", s), !1
                        }
                    },
                    stop: function(t) {
                        if ("touchend" === t.type && t.originalEvent && t.originalEvent.changedTouches && t.originalEvent.changedTouches[0] && (t.pageX = t.originalEvent.changedTouches[0].pageX, t.pageY = t.originalEvent.changedTouches[0].pageY, t.target = document.elementFromPoint(t.originalEvent.changedTouches[0].pageX - window.pageXOffset, t.originalEvent.changedTouches[0].pageY - window.pageYOffset)), i.is_drag) e.vakata.dnd._trigger("stop", t);
                        else if ("touchend" === t.type && t.target === i.target) {
                            var s = setTimeout(function() {
                                e(t.target).click()
                            }, 100);
                            e(t.target).one("click", function() {
                                s && clearTimeout(s)
                            })
                        }
                        return e.vakata.dnd._clean(), !1
                    }
                }
            }(e), e.jstree.defaults.search = {
            ajax: !1,
            fuzzy: !1,
            case_sensitive: !1,
            show_only_matches: !0,
            close_opened_onclear: !0,
            search_leaves_only: !1,
            search_callback: !1
        }, e.jstree.plugins.search = function(i, s) {
            this.bind = function() {
                s.bind.call(this), this._data.search.str = "", this._data.search.dom = e(), this._data.search.res = [], this._data.search.opn = [], this.element.on("before_open.jstree", e.proxy(function(t, i) {
                    var s, r, n, a = this._data.search.res,
                        d = [],
                        o = e();
                    if (a && a.length && (this._data.search.dom = e(this.element[0].querySelectorAll("#" + e.map(a, function(t) {
                            return -1 !== "0123456789".indexOf(t[0]) ? "\\3" + t[0] + " " + t.substr(1).replace(e.jstree.idregex, "\\$&") : t.replace(e.jstree.idregex, "\\$&")
                        }).join(", #"))), this._data.search.dom.children(".jstree-anchor").addClass("jstree-search"), this.settings.search.show_only_matches && this._data.search.res.length)) {
                        for (s = 0, r = a.length; r > s; s++) d = d.concat(this.get_node(a[s]).parents);
                        d = e.vakata.array_remove_item(e.vakata.array_unique(d), "#"), o = d.length ? e(this.element[0].querySelectorAll("#" + e.map(d, function(t) {
                            return -1 !== "0123456789".indexOf(t[0]) ? "\\3" + t[0] + " " + t.substr(1).replace(e.jstree.idregex, "\\$&") : t.replace(e.jstree.idregex, "\\$&")
                        }).join(", #"))) : e(), this.element.find(".jstree-node").hide().filter(".jstree-last").filter(function() {
                            return this.nextSibling
                        }).removeClass("jstree-last"), o = o.add(this._data.search.dom), o.parentsUntil(".jstree").addBack().show().filter(".jstree-children").each(function() {
                            e(this).children(".jstree-node:visible").eq(-1).addClass("jstree-last")
                        })
                    }
                }, this)), this.settings.search.show_only_matches && this.element.on("search.jstree", function(t, i) {
                    i.nodes.length && (e(this).find(".jstree-node").hide().filter(".jstree-last").filter(function() {
                        return this.nextSibling
                    }).removeClass("jstree-last"), i.nodes.parentsUntil(".jstree").addBack().show().filter(".jstree-children").each(function() {
                        e(this).children(".jstree-node:visible").eq(-1).addClass("jstree-last")
                    }))
                }).on("clear_search.jstree", function(t, i) {
                    i.nodes.length && e(this).find(".jstree-node").css("display", "").filter(".jstree-last").filter(function() {
                        return this.nextSibling
                    }).removeClass("jstree-last")
                })
            }, this.search = function(i, s) {
                if (i === !1 || "" === e.trim("" + i)) return this.clear_search();
                i = "" + i;
                var r = this.settings.search,
                    n = r.ajax ? r.ajax : !1,
                    a = null,
                    d = [],
                    o = [],
                    c, l;
                return this._data.search.res.length && this.clear_search(), s || n === !1 ? (this._data.search.str = i, this._data.search.dom = e(), this._data.search.res = [], this._data.search.opn = [], a = new e.vakata.search(i, !0, {
                    caseSensitive: r.case_sensitive,
                    fuzzy: r.fuzzy
                }), e.each(this._model.data, function(e, t) {
                    t.text && (r.search_callback && r.search_callback.call(this, i, t) || !r.search_callback && a.search(t.text).isMatch) && (!r.search_leaves_only || t.state.loaded && 0 === t.children.length) && (d.push(e), o = o.concat(t.parents))
                }), d.length && (o = e.vakata.array_unique(o), this._search_open(o), this._data.search.dom = e(this.element[0].querySelectorAll("#" + e.map(d, function(t) {
                    return -1 !== "0123456789".indexOf(t[0]) ? "\\3" + t[0] + " " + t.substr(1).replace(e.jstree.idregex, "\\$&") : t.replace(e.jstree.idregex, "\\$&")
                }).join(", #"))), this._data.search.res = d, this._data.search.dom.children(".jstree-anchor").addClass("jstree-search")), this.trigger("search", {
                    nodes: this._data.search.dom,
                    str: i,
                    res: this._data.search.res
                }), t) : e.isFunction(n) ? n.call(this, i, e.proxy(function(t) {
                    t && t.d && (t = t.d), this._load_nodes(e.isArray(t) ? e.vakata.array_unique(t) : [], function() {
                        this.search(i, !0)
                    }, !0)
                }, this)) : (n = e.extend({}, n), n.data || (n.data = {}), n.data.str = i, e.ajax(n).fail(e.proxy(function() {
                    this._data.core.last_error = {
                        error: "ajax",
                        plugin: "search",
                        id: "search_01",
                        reason: "Could not load search parents",
                        data: JSON.stringify(n)
                    }, this.settings.core.error.call(this, this._data.core.last_error)
                }, this)).done(e.proxy(function(t) {
                    t && t.d && (t = t.d), this._load_nodes(e.isArray(t) ? e.vakata.array_unique(t) : [], function() {
                        this.search(i, !0)
                    }, !0)
                }, this)))
            }, this.clear_search = function() {
                this._data.search.dom.children(".jstree-anchor").removeClass("jstree-search"), this.settings.search.close_opened_onclear && this.close_node(this._data.search.opn, 0), this.trigger("clear_search", {
                    nodes: this._data.search.dom,
                    str: this._data.search.str,
                    res: this._data.search.res
                }), this._data.search.str = "", this._data.search.res = [], this._data.search.opn = [], this._data.search.dom = e()
            }, this._search_open = function(t) {
                var i = this;
                e.each(t.concat([]), function(s, r) {
                    if ("#" === r) return !0;
                    try {
                        r = e("#" + r.replace(e.jstree.idregex, "\\$&"), i.element)
                    } catch (n) {}
                    r && r.length && i.is_closed(r) && (i._data.search.opn.push(r[0].id), i.open_node(r, function() {
                        i._search_open(t)
                    }, 0))
                })
            }
        },
            function(e) {
                e.vakata.search = function(e, t, i) {
                    i = i || {}, i.fuzzy !== !1 && (i.fuzzy = !0), e = i.caseSensitive ? e : e.toLowerCase();
                    var s = i.location || 0,
                        r = i.distance || 100,
                        n = i.threshold || .6,
                        a = e.length,
                        d, o, c, l;
                    return a > 32 && (i.fuzzy = !1), i.fuzzy && (d = 1 << a - 1, o = function() {
                        var t = {},
                            i = 0;
                        for (i = 0; a > i; i++) t[e.charAt(i)] = 0;
                        for (i = 0; a > i; i++) t[e.charAt(i)] |= 1 << a - i - 1;
                        return t
                    }(), c = function(e, t) {
                        var i = e / a,
                            n = Math.abs(s - t);
                        return r ? i + n / r : n ? 1 : i
                    }), l = function(t) {
                        if (t = i.caseSensitive ? t : t.toLowerCase(), e === t || -1 !== t.indexOf(e)) return {
                            isMatch: !0,
                            score: 0
                        };
                        if (!i.fuzzy) return {
                            isMatch: !1,
                            score: 1
                        };
                        var r, l, h = t.length,
                            _ = n,
                            u = t.indexOf(e, s),
                            g, f, p = a + h,
                            m, v, j, k, y, x = 1,
                            b = [];
                        for (-1 !== u && (_ = Math.min(c(0, u), _), u = t.lastIndexOf(e, s + a), -1 !== u && (_ = Math.min(c(0, u), _))), u = -1, r = 0; a > r; r++) {
                            g = 0, f = p;
                            while (f > g) _ >= c(r, s + f) ? g = f : p = f, f = Math.floor((p - g) / 2 + g);
                            for (p = f, v = Math.max(1, s - f + 1), j = Math.min(s + f, h) + a, k = Array(j + 2), k[j + 1] = (1 << r) - 1, l = j; l >= v; l--)
                                if (y = o[t.charAt(l - 1)], k[l] = 0 === r ? (1 | k[l + 1] << 1) & y : (1 | k[l + 1] << 1) & y | (1 | (m[l + 1] | m[l]) << 1) | m[l + 1], k[l] & d && (x = c(r, l - 1), _ >= x)) {
                                    if (_ = x, u = l - 1, b.push(u), !(u > s)) break;
                                    v = Math.max(1, 2 * s - u)
                                }
                            if (c(r + 1, s) > _) break;
                            m = k
                        }
                        return {
                            isMatch: u >= 0,
                            score: x
                        }
                    }, t === !0 ? {
                        search: l
                    } : l(t)
                }
            }(e), e.jstree.defaults.sort = function(e, t) {
            return this.get_text(e) > this.get_text(t) ? 1 : -1
        }, e.jstree.plugins.sort = function(t, i) {
            this.bind = function() {
                i.bind.call(this), this.element.on("model.jstree", e.proxy(function(e, t) {
                    this.sort(t.parent, !0)
                }, this)).on("rename_node.jstree create_node.jstree", e.proxy(function(e, t) {
                    this.sort(t.parent || t.node.parent, !1), this.redraw_node(t.parent || t.node.parent, !0)
                }, this)).on("move_node.jstree copy_node.jstree", e.proxy(function(e, t) {
                    this.sort(t.parent, !1), this.redraw_node(t.parent, !0)
                }, this))
            }, this.sort = function(t, i) {
                var s, r;
                if (t = this.get_node(t), t && t.children && t.children.length && (t.children.sort(e.proxy(this.settings.sort, this)), i))
                    for (s = 0, r = t.children_d.length; r > s; s++) this.sort(t.children_d[s], !1)
            }
        };
        var u = !1;
        e.jstree.defaults.state = {
            key: "jstree",
            events: "changed.jstree open_node.jstree close_node.jstree",
            ttl: !1,
            filter: !1
        }, e.jstree.plugins.state = function(t, i) {
            this.bind = function() {
                i.bind.call(this);
                var t = e.proxy(function() {
                    this.element.on(this.settings.state.events, e.proxy(function() {
                        u && clearTimeout(u), u = setTimeout(e.proxy(function() {
                            this.save_state()
                        }, this), 100)
                    }, this))
                }, this);
                this.element.on("ready.jstree", e.proxy(function(e, i) {
                    this.element.one("restore_state.jstree", t), this.restore_state() || t()
                }, this))
            }, this.save_state = function() {
                var t = {
                    state: this.get_state(),
                    ttl: this.settings.state.ttl,
                    sec: +new Date
                };
                e.vakata.storage.set(this.settings.state.key, JSON.stringify(t))
            }, this.restore_state = function() {
                var t = e.vakata.storage.get(this.settings.state.key);
                if (t) try {
                    t = JSON.parse(t)
                } catch (i) {
                    return !1
                }
                return t && t.ttl && t.sec && +new Date - t.sec > t.ttl ? !1 : (t && t.state && (t = t.state), t && e.isFunction(this.settings.state.filter) && (t = this.settings.state.filter.call(this, t)), t ? (this.element.one("set_state.jstree", function(i, s) {
                    s.instance.trigger("restore_state", {
                        state: e.extend(!0, {}, t)
                    })
                }), this.set_state(t), !0) : !1)
            }, this.clear_state = function() {
                return e.vakata.storage.del(this.settings.state.key)
            }
        },
            function(e, t) {
                e.vakata.storage = {
                    set: function(e, t) {
                        return window.localStorage.setItem(e, t)
                    },
                    get: function(e) {
                        return window.localStorage.getItem(e)
                    },
                    del: function(e) {
                        return window.localStorage.removeItem(e)
                    }
                }
            }(e), e.jstree.defaults.types = {
            "#": {},
            "default": {}
        }, e.jstree.plugins.types = function(i, s) {
            this.init = function(e, i) {
                var r, n;
                if (i && i.types && i.types["default"])
                    for (r in i.types)
                        if ("default" !== r && "#" !== r && i.types.hasOwnProperty(r))
                            for (n in i.types["default"]) i.types["default"].hasOwnProperty(n) && i.types[r][n] === t && (i.types[r][n] = i.types["default"][n]);
                s.init.call(this, e, i), this._model.data["#"].type = "#"
            }, this.refresh = function(e, t) {
                s.refresh.call(this, e, t), this._model.data["#"].type = "#"
            }, this.bind = function() {
                this.element.on("model.jstree", e.proxy(function(e, i) {
                    var s = this._model.data,
                        r = i.nodes,
                        n = this.settings.types,
                        a, d, o = "default";
                    for (a = 0, d = r.length; d > a; a++) o = "default", s[r[a]].original && s[r[a]].original.type && n[s[r[a]].original.type] && (o = s[r[a]].original.type), s[r[a]].data && s[r[a]].data.jstree && s[r[a]].data.jstree.type && n[s[r[a]].data.jstree.type] && (o = s[r[a]].data.jstree.type), s[r[a]].type = o, s[r[a]].icon === !0 && n[o].icon !== t && (s[r[a]].icon = n[o].icon);
                    s["#"].type = "#"
                }, this)), s.bind.call(this)
            }, this.get_json = function(t, i, r) {
                var n, a, d = this._model.data,
                    o = i ? e.extend(!0, {}, i, {
                        no_id: !1
                    }) : {},
                    c = s.get_json.call(this, t, o, r);
                if (c === !1) return !1;
                if (e.isArray(c))
                    for (n = 0, a = c.length; a > n; n++) c[n].type = c[n].id && d[c[n].id] && d[c[n].id].type ? d[c[n].id].type : "default", i && i.no_id && (delete c[n].id, c[n].li_attr && c[n].li_attr.id && delete c[n].li_attr.id);
                else c.type = c.id && d[c.id] && d[c.id].type ? d[c.id].type : "default", i && i.no_id && (c = this._delete_ids(c));
                return c
            }, this._delete_ids = function(t) {
                if (e.isArray(t)) {
                    for (var i = 0, s = t.length; s > i; i++) t[i] = this._delete_ids(t[i]);
                    return t
                }
                return delete t.id, t.li_attr && t.li_attr.id && delete t.li_attr.id, t.children && e.isArray(t.children) && (t.children = this._delete_ids(t.children)), t
            }, this.check = function(i, r, n, a, d) {
                if (s.check.call(this, i, r, n, a, d) === !1) return !1;
                r = r && r.id ? r : this.get_node(r), n = n && n.id ? n : this.get_node(n);
                var o = r && r.id ? e.jstree.reference(r.id) : null,
                    c, l, h, _;
                switch (o = o && o._model && o._model.data ? o._model.data : null, i) {
                    case "create_node":
                    case "move_node":
                    case "copy_node":
                        if ("move_node" !== i || -1 === e.inArray(r.id, n.children)) {
                            if (c = this.get_rules(n), c.max_children !== t && -1 !== c.max_children && c.max_children === n.children.length) return this._data.core.last_error = {
                                error: "check",
                                plugin: "types",
                                id: "types_01",
                                reason: "max_children prevents function: " + i,
                                data: JSON.stringify({
                                    chk: i,
                                    pos: a,
                                    obj: r && r.id ? r.id : !1,
                                    par: n && n.id ? n.id : !1
                                })
                            }, !1;
                            if (c.valid_children !== t && -1 !== c.valid_children && -1 === e.inArray(r.type, c.valid_children)) return this._data.core.last_error = {
                                error: "check",
                                plugin: "types",
                                id: "types_02",
                                reason: "valid_children prevents function: " + i,
                                data: JSON.stringify({
                                    chk: i,
                                    pos: a,
                                    obj: r && r.id ? r.id : !1,
                                    par: n && n.id ? n.id : !1
                                })
                            }, !1;
                            if (o && r.children_d && r.parents) {
                                for (l = 0, h = 0, _ = r.children_d.length; _ > h; h++) l = Math.max(l, o[r.children_d[h]].parents.length);
                                l = l - r.parents.length + 1
                            }(0 >= l || l === t) && (l = 1);
                            do {
                                if (c.max_depth !== t && -1 !== c.max_depth && l > c.max_depth) return this._data.core.last_error = {
                                    error: "check",
                                    plugin: "types",
                                    id: "types_03",
                                    reason: "max_depth prevents function: " + i,
                                    data: JSON.stringify({
                                        chk: i,
                                        pos: a,
                                        obj: r && r.id ? r.id : !1,
                                        par: n && n.id ? n.id : !1
                                    })
                                }, !1;
                                n = this.get_node(n.parent), c = this.get_rules(n), l++
                            } while (n)
                        }
                }
                return !0
            }, this.get_rules = function(e) {
                if (e = this.get_node(e), !e) return !1;
                var i = this.get_type(e, !0);
                return i.max_depth === t && (i.max_depth = -1), i.max_children === t && (i.max_children = -1), i.valid_children === t && (i.valid_children = -1), i
            }, this.get_type = function(t, i) {
                return t = this.get_node(t), t ? i ? e.extend({
                    type: t.type
                }, this.settings.types[t.type]) : t.type : !1
            }, this.set_type = function(i, s) {
                var r, n, a, d, o;
                if (e.isArray(i)) {
                    for (i = i.slice(), n = 0, a = i.length; a > n; n++) this.set_type(i[n], s);
                    return !0
                }
                return r = this.settings.types, i = this.get_node(i), r[s] && i ? (d = i.type, o = this.get_icon(i), i.type = s, (o === !0 || r[d] && r[d].icon && o === r[d].icon) && this.set_icon(i, r[s].icon !== t ? r[s].icon : !0), !0) : !1
            }
        }, e.jstree.defaults.unique = {
            case_sensitive: !1,
            duplicate: function(e, t) {
                return e + " (" + t + ")"
            }
        }, e.jstree.plugins.unique = function(i, s) {
            this.check = function(t, i, r, n, a) {
                if (s.check.call(this, t, i, r, n, a) === !1) return !1;
                if (i = i && i.id ? i : this.get_node(i), r = r && r.id ? r : this.get_node(r), !r || !r.children) return !0;
                var d = "rename_node" === t ? n : i.text,
                    o = [],
                    c = this.settings.unique.case_sensitive,
                    l = this._model.data,
                    h, _;
                for (h = 0, _ = r.children.length; _ > h; h++) o.push(c ? l[r.children[h]].text : l[r.children[h]].text.toLowerCase());
                switch (c || (d = d.toLowerCase()), t) {
                    case "delete_node":
                        return !0;
                    case "rename_node":
                        return h = -1 === e.inArray(d, o) || i.text && i.text[c ? "toString" : "toLowerCase"]() === d, h || (this._data.core.last_error = {
                            error: "check",
                            plugin: "unique",
                            id: "unique_01",
                            reason: "Child with name " + d + " already exists. Preventing: " + t,
                            data: JSON.stringify({
                                chk: t,
                                pos: n,
                                obj: i && i.id ? i.id : !1,
                                par: r && r.id ? r.id : !1
                            })
                        }), h;
                    case "create_node":
                        return h = -1 === e.inArray(d, o), h || (this._data.core.last_error = {
                            error: "check",
                            plugin: "unique",
                            id: "unique_04",
                            reason: "Child with name " + d + " already exists. Preventing: " + t,
                            data: JSON.stringify({
                                chk: t,
                                pos: n,
                                obj: i && i.id ? i.id : !1,
                                par: r && r.id ? r.id : !1
                            })
                        }), h;
                    case "copy_node":
                        return h = -1 === e.inArray(d, o), h || (this._data.core.last_error = {
                            error: "check",
                            plugin: "unique",
                            id: "unique_02",
                            reason: "Child with name " + d + " already exists. Preventing: " + t,
                            data: JSON.stringify({
                                chk: t,
                                pos: n,
                                obj: i && i.id ? i.id : !1,
                                par: r && r.id ? r.id : !1
                            })
                        }), h;
                    case "move_node":
                        return h = i.parent === r.id || -1 === e.inArray(d, o), h || (this._data.core.last_error = {
                            error: "check",
                            plugin: "unique",
                            id: "unique_03",
                            reason: "Child with name " + d + " already exists. Preventing: " + t,
                            data: JSON.stringify({
                                chk: t,
                                pos: n,
                                obj: i && i.id ? i.id : !1,
                                par: r && r.id ? r.id : !1
                            })
                        }), h
                }
                return !0
            }, this.create_node = function(i, r, n, a, d) {
                if (!r || r.text === t) {
                    if (null === i && (i = "#"), i = this.get_node(i), !i) return s.create_node.call(this, i, r, n, a, d);
                    if (n = n === t ? "last" : n, !("" + n).match(/^(before|after)$/) && !d && !this.is_loaded(i)) return s.create_node.call(this, i, r, n, a, d);
                    r || (r = {});
                    var o, c, l, h, _, u = this._model.data,
                        g = this.settings.unique.case_sensitive,
                        f = this.settings.unique.duplicate;
                    for (c = o = this.get_string("New node"), l = [], h = 0, _ = i.children.length; _ > h; h++) l.push(g ? u[i.children[h]].text : u[i.children[h]].text.toLowerCase());
                    h = 1;
                    while (-1 !== e.inArray(g ? c : c.toLowerCase(), l)) c = "" + f.call(this, o, ++h);
                    r.text = c
                }
                return s.create_node.call(this, i, r, n, a, d)
            }
        };
        var g = document.createElement("DIV");
        g.setAttribute("unselectable", "on"), g.className = "jstree-wholerow", g.innerHTML = "&#160;", e.jstree.plugins.wholerow = function(t, i) {
            this.bind = function() {
                i.bind.call(this), this.element.on("ready.jstree set_state.jstree", e.proxy(function() {
                    this.hide_dots()
                }, this)).on("init.jstree loading.jstree ready.jstree", e.proxy(function() {
                    this.get_container_ul().addClass("jstree-wholerow-ul")
                }, this)).on("deselect_all.jstree", e.proxy(function(e, t) {
                    this.element.find(".jstree-wholerow-clicked").removeClass("jstree-wholerow-clicked")
                }, this)).on("changed.jstree", e.proxy(function(e, t) {
                    this.element.find(".jstree-wholerow-clicked").removeClass("jstree-wholerow-clicked");
                    var i = !1,
                        s, r;
                    for (s = 0, r = t.selected.length; r > s; s++) i = this.get_node(t.selected[s], !0), i && i.length && i.children(".jstree-wholerow").addClass("jstree-wholerow-clicked")
                }, this)).on("open_node.jstree", e.proxy(function(e, t) {
                    this.get_node(t.node, !0).find(".jstree-clicked").parent().children(".jstree-wholerow").addClass("jstree-wholerow-clicked")
                }, this)).on("hover_node.jstree dehover_node.jstree", e.proxy(function(e, t) {
                    this.get_node(t.node, !0).children(".jstree-wholerow")["hover_node" === e.type ? "addClass" : "removeClass"]("jstree-wholerow-hovered")
                }, this)).on("contextmenu.jstree", ".jstree-wholerow", e.proxy(function(t) {
                    t.preventDefault();
                    var i = e.Event("contextmenu", {
                        metaKey: t.metaKey,
                        ctrlKey: t.ctrlKey,
                        altKey: t.altKey,
                        shiftKey: t.shiftKey,
                        pageX: t.pageX,
                        pageY: t.pageY
                    });
                    e(t.currentTarget).closest(".jstree-node").children(".jstree-anchor:eq(0)").trigger(i)
                }, this)).on("click.jstree", ".jstree-wholerow", function(t) {
                    t.stopImmediatePropagation();
                    var i = e.Event("click", {
                        metaKey: t.metaKey,
                        ctrlKey: t.ctrlKey,
                        altKey: t.altKey,
                        shiftKey: t.shiftKey
                    });
                    e(t.currentTarget).closest(".jstree-node").children(".jstree-anchor:eq(0)").trigger(i).focus()
                }).on("click.jstree", ".jstree-leaf > .jstree-ocl", e.proxy(function(t) {
                    t.stopImmediatePropagation();
                    var i = e.Event("click", {
                        metaKey: t.metaKey,
                        ctrlKey: t.ctrlKey,
                        altKey: t.altKey,
                        shiftKey: t.shiftKey
                    });
                    e(t.currentTarget).closest(".jstree-node").children(".jstree-anchor:eq(0)").trigger(i).focus()
                }, this)).on("mouseover.jstree", ".jstree-wholerow, .jstree-icon", e.proxy(function(e) {
                    return e.stopImmediatePropagation(), this.hover_node(e.currentTarget), !1
                }, this)).on("mouseleave.jstree", ".jstree-node", e.proxy(function(e) {
                    this.dehover_node(e.currentTarget)
                }, this))
            }, this.teardown = function() {
                this.settings.wholerow && this.element.find(".jstree-wholerow").remove(), i.teardown.call(this)
            }, this.redraw_node = function(t, s, r) {
                if (t = i.redraw_node.call(this, t, s, r)) {
                    var n = g.cloneNode(!0); - 1 !== e.inArray(t.id, this._data.core.selected) && (n.className += " jstree-wholerow-clicked"), t.insertBefore(n, t.childNodes[0])
                }
                return t
            }
        }
    }
});