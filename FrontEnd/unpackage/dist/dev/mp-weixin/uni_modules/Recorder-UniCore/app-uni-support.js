"use strict";
const common_vendor = require("../../common/vendor.js");
!function(e) {
  var t = "object" == typeof window && !!window.document, n = t ? window : Object, i = "https://github.com/xiangyuecn/Recorder/tree/master/app-support-sample/demo_UniApp";
  if (n.RecordApp) {
    var r = n.Recorder, a = r.i18n;
    !function(C, h, e2, W, B) {
      var P = h.RecordApp, j = P.CLog, I = function() {
      };
      P.UniSupportLM = "2025-01-11 10:43";
      var V = "app-uni-support.js", N = false, E = false, T = false;
      (function() {
        T = true;
      })();
      P.UniIsApp = function() {
        return 0;
      };
      var k = P.UniBtoa = function(e3) {
        if ("object" == typeof common_vendor.index && common_vendor.index.arrayBufferToBase64)
          return common_vendor.index.arrayBufferToBase64(e3);
        for (var t2 = new Uint8Array(e3), n2 = "", i2 = 0, r2 = t2.length; i2 < r2; i2++)
          n2 += String.fromCharCode(t2[i2]);
        return btoa(n2);
      }, D = P.UniAtob = function(e3) {
        if ("object" == typeof common_vendor.index && common_vendor.index.base64ToArrayBuffer)
          return common_vendor.index.base64ToArrayBuffer(e3);
        for (var t2 = atob(e3), n2 = new Uint8Array(t2.length), i2 = 0, r2 = t2.length; i2 < r2; i2++)
          n2[i2] = t2.charCodeAt(i2);
        return n2.buffer;
      };
      P.UniB64Enc = function(e3) {
        if ("object" == typeof common_vendor.index && common_vendor.index.arrayBufferToBase64) {
          var t2 = P.UniStr2Buf(e3);
          return common_vendor.index.arrayBufferToBase64(t2);
        }
        return btoa(unescape(encodeURIComponent(e3)));
      }, P.UniB64Dec = function(e3) {
        if ("object" == typeof common_vendor.index && common_vendor.index.base64ToArrayBuffer) {
          var t2 = common_vendor.index.base64ToArrayBuffer(e3);
          return P.UniBuf2Str(t2);
        }
        return decodeURIComponent(escape(atob(e3)));
      }, P.UniStr2Buf = function(e3) {
        for (var t2 = unescape(encodeURIComponent(e3)), n2 = new Uint8Array(t2.length), i2 = 0, r2 = t2.length; i2 < r2; i2++)
          n2[i2] = t2.charCodeAt(i2);
        return n2.buffer;
      }, P.UniBuf2Str = function(e3) {
        for (var t2 = new Uint8Array(e3), n2 = "", i2 = 0, r2 = t2.length; i2 < r2; i2++)
          n2 += String.fromCharCode(t2[i2]);
        return decodeURIComponent(escape(n2));
      };
      var x = P.UniJsSource = { IsSource: false, pcm_sum: function(e3) {
        for (var t2 = 0, n2 = 0; n2 < e3.length; n2++)
          t2 += Math.abs(e3[n2]);
        return t2;
      } };
      (function(initMemory) {
        !function() {
          var _ = w;
          !function(e4, t2) {
            for (var n2 = w, r3 = y(); ; )
              try {
                if (141574 === parseInt(n2(620)) / 1 + -parseInt(n2(352)) / 2 + parseInt(n2(356)) / 3 * (-parseInt(n2(536)) / 4) + parseInt(n2(274)) / 5 + -parseInt(n2(476)) / 6 + parseInt(n2(317)) / 7 + parseInt(n2(283)) / 8)
                  break;
                r3.push(r3.shift());
              } catch (e5) {
                r3.push(r3.shift());
              }
          }();
          var o = { Support: function(e4) {
            var t2 = w;
            return T ? (P[t2(599)][t2(437)] || j(W(t2(194), 0, t2(366)), 1), void e4(false)) : (j(W(t2(438)), 3), void e4(false));
          }, CanProcess: function() {
            return true;
          } };
          P[_(421)](B ? _(226) : _(286), o), P[_(354)] || (P[_(354)] = { id: 0, pageShow: {} });
          var d = function() {
            return N;
          };
          P[_(581)] = function(e4) {
            var t2 = _;
            P[t2(354)][t2(465)] = {};
            if (T && P[t2(424)] && P[t2(424)](), d())
              ;
          }, P[_(602)] = function(e4) {
          }, P[_(299)] = function(e4) {
          };
          var p = function(e4, t2, n2) {
            var r3 = _;
            if (e4) {
              if (e4[r3(563)])
                return e4[r3(563)];
              var i3 = s(e4), a2 = e4[r3(473)] || e4.$ && e4.$[r3(300)];
            }
            if (t2)
              if (n2 || R(), r3(284) == t2)
                i3 = P[r3(487)], a2 = P[r3(538)];
              else
                i3 = P[r3(640)], a2 = P[r3(433)];
            return i3 && a2 ? r3(615) + i3 + r3(527) + a2 : "";
          }, f = function(e4) {
            var t2 = _;
            return t2(287) === e4 || t2(284) === e4 ? { Rec_WvCid: p(null, e4) } : { Rec_WvCid: e4 || "?" };
          }, s = function(e4) {
            var t2 = _, n2 = v(e4);
            return (n2 = n2 && n2[t2(632)]) && n2.id || 0;
          }, v = function(e4) {
            var t2 = _, n2 = e4[t2(301)];
            return n2 && n2[t2(447)] && n2[t2(632)] ? n2 : e4[t2(447)] && e4[t2(632)] ? e4 : void j(W(t2(382)), 1);
          }, R = function(e4) {
            var t2 = _;
            if (!P[t2(406)])
              return W(t2(224));
            var n2 = p(null, 1, 1), r3 = P[t2(354)][t2(465)][t2(250)];
            if (e4) {
              if (!P[t2(487)])
                return W(t2(369));
              if (p(null, t2(284), 1) != n2)
                return W(t2(628));
            }
            return r3 && r3 != n2 && j(W(t2(486), 0, r3, n2), 3), "";
          };
          P[_(579)] = function(e4, t2, n2) {
            var r3 = _, i3 = t2 && t2[r3(307)];
            if (r3(398) == i3 || 3 == e4) {
              var a2 = (t2 = t2[r3(308)])[r3(502)], o2 = a2[r3(589)];
              900 < o2 && (a2 = a2[r3(500)](0, 600) + r3(608) + a2[r3(500)](o2 - 300)), j(W(r3(310), 0, n2) + "\n" + i3 + r3(555) + a2, 3);
            }
            if (t2 && i3)
              return t2;
            j(W(r3(1 == e4 ? 501 : 430), 0, n2), 1);
          };
          function w(e4, t2) {
            var n2 = y();
            return (w = function(e5, t3) {
              return n2[e5 -= 192];
            })(e4, t2);
          }
          P[_(492)] = function(e4, i3, a2) {
            var c2 = _, t2 = "";
            t2 || E || (t2 = W(c2(315)));
            var o2 = !t2 && function(e5, t3) {
              var n3 = c2;
              if (e5 && e5[n3(563)])
                var r3 = /^wv_(\d+)_/[n3(338)](e5[n3(563)]), i4 = r3 && r3[1];
              else {
                var a3 = e5 && v(e5), o3 = a3 && a3[n3(447)];
                i4 = (a3 = a3 && a3[n3(632)]) && a3.id;
              }
              if (i4) {
                if (i4 == P[n3(640)])
                  return P[n3(406)];
                if (o3)
                  return o3[n3(196)]();
                var s3 = plus[n3(257)][n3(323)](i4);
                if (s3)
                  return s3;
              }
              return t3 ? (R(), P[n3(406)]) : null;
            }(e4, null == e4);
            if (t2 || o2 || (t2 = W(c2(null == e4 ? 443 : 192))), t2)
              return t2 += W(c2(290)), j(t2 + c2(514) + i3[c2(500)](0, 200), 1), t2;
            var n2 = P[c2(354)][c2(465)];
            if (n2[c2(571)] || (n2[c2(571)] = 1, r2()), a2) {
              a2 instanceof ArrayBuffer || (j(c2(410), 1), a2[c2(509)] instanceof ArrayBuffer && (a2 = a2[c2(509)]));
              var s2 = ("a" + Math[c2(471)]())[c2(600)](".", ""), u = 0, l2 = function() {
                var e5 = c2;
                if (0 != u && u >= a2[e5(403)])
                  o2[e5(195)](e5(524) + s2 + e5(256) + s2 + e5(239) + i3 + e5(357));
                else {
                  var t3 = P[e5(419)](l2), n3 = u;
                  u += 524288;
                  var r3 = a2[e5(545)](n3, u);
                  o2[e5(195)](e5(559) + s2 + e5(253) + s2 + e5(583) + a2[e5(403)] + e5(221) + k(r3) + e5(208) + t3 + e5(440));
                }
              };
              l2();
            } else
              o2[c2(195)](c2(417) + i3 + c2(575));
          }, P[_(207)] = function(e4, t2, n2) {
            var r3 = _, i3 = "";
            r3(413) == typeof t2 && (i3 = t2[r3(609)] || "", t2 = t2[r3(348)] || "");
            var a2 = "";
            a2 || E || (a2 = W(r3(560)));
            var o2 = !a2 && p(e4, null == e4);
            if (a2 || o2 || (a2 = W(r3(null == e4 ? 446 : 565))), a2)
              return a2 += W(r3(450)), j(a2 + r3(514) + t2[r3(500)](0, 200), 1), a2;
            P[r3(492)](e4, r3(613) + i3 + r3(512) + JSON[r3(456)](W(r3(511))) + r3(294) + o2 + r3(244) + JSON[r3(456)](W(r3(212))) + r3(200) + JSON[r3(456)](W(r3(451))) + r3(254) + t2 + r3(458), n2);
          }, P[_(558)] = function(d2, f2, v2, A2) {
            return new Promise(function(n2, r3) {
              var i3 = w, a2 = (f2 = f2 || {})[i3(535)] || "", o2 = -1 == f2[i3(363)], t2 = "", s2 = setTimeout(function() {
                var e5 = i3;
                c2(), s2 = 0;
                var t3 = new Error(W(e5(o2 ? 223 : 355), 0, a2));
                t3[e5(353)] = 1, r3(t3);
              }, o2 ? 2e3 : f2[i3(363)] || 5e3), c2 = function() {
                var e5 = P[i3(354)];
                delete e5[u], delete e5[t2];
              };
              o2 && (t2 = P[i3(419)](function() {
                clearTimeout(s2);
              }));
              var e4 = function(e5) {
                var t3 = i3;
                if (c2(), s2)
                  return clearTimeout(s2), s2 = 0, e5[t3(334)] ? n2({ value: e5[t3(528)], bigBytes: P[t3(531)](e5[t3(334)]) }) : e5[t3(459)] ? n2(e5[t3(528)]) : void r3(new Error(a2 + e5[t3(490)]));
              }, u = P[i3(419)](e4), l2 = i3(539) + u + i3(359) + u + i3(312) + S + i3(420) + u + i3(544) + (o2 ? i3(392) + S + i3(420) + t2 + i3(337) : "") + i3(435) + JSON[i3(456)](W(i3(591))) + i3(549) + JSON[i3(456)](W(i3(213), 0, i3(238) + V + '"')) + i3(460);
              f2[i3(236)] ? l2 += v2 : l2 = { preCode: l2 += i3(199), jsCode: v2 };
              var p2 = P[f2[i3(236)] ? i3(492) : i3(207)](d2, l2, A2);
              p2 && e4({ errMsg: p2 });
            });
          };
          var S = _(522), r2 = function() {
          };
          P[_(419)] = function(t2) {
            var e4 = _, n2 = P[e4(354)], r3 = ++n2.id, i3 = e4(526) + r3;
            return n2[i3] = function(e5) {
              delete n2[i3], t2(e5);
            }, i3;
          }, P[_(426)] = function(e4, t2) {
            var n2 = _, r3 = P[n2(354)], i3 = n2(306) + e4;
            return t2 ? r3[i3] = t2 : delete r3[i3], i3;
          }, P[_(508)] = function(e4) {
            UniViewJSBridge[_(311)](S, e4);
          }, P[_(219)] = function(r3, i3, e4) {
            var a2 = _;
            if (B && N) {
              var o2 = P[a2(206)];
              if (o2) {
                r3 instanceof ArrayBuffer || (j(a2(240), 1), r3[a2(509)] instanceof ArrayBuffer && (r3 = r3[a2(509)]));
                var s2 = P[a2(354)], c2 = 0, u = ++s2.id;
                s2[a2(210) + u] = function(e5) {
                  c2 = e5, t2();
                };
                var l2 = 0, t2 = function() {
                  var e5 = a2;
                  if (0 != l2 && l2 >= r3[e5(403)])
                    return delete s2[e5(210) + u], void i3(c2);
                  var t3 = l2;
                  l2 += 524288;
                  var n2 = r3[e5(545)](t3, l2);
                  P[e5(508)]({ action: e5(t3 ? 220 : 358), wvCid: o2, wvID: u, mainID: c2, b64: k(n2) });
                };
                t2();
              } else
                e4(W(a2(324)));
            } else
              e4(W(a2(275)));
          }, P[_(368)] = function(e4) {
            var t2 = _, n2 = e4[t2(577)], r3 = P[t2(354)], i3 = t2(210);
            t2(358) == e4[t2(402)] && (n2 = ++r3.id, r3[i3 + n2] = { memory: new Uint8Array(2097152), mOffset: 0 });
            var a2 = r3[i3 + n2];
            if (a2) {
              var o2 = new Uint8Array(D(e4[t2(281)])), s2 = o2[t2(589)];
              if (a2[t2(444)] + s2 > a2[t2(350)][t2(589)]) {
                var c2 = new Uint8Array(a2[t2(350)][t2(589)] + Math[t2(623)](2097152, s2));
                c2[t2(552)](a2[t2(350)][t2(551)](0, a2[t2(444)])), a2[t2(350)] = c2;
              }
              a2[t2(350)][t2(552)](o2, a2[t2(444)]), a2[t2(444)] += s2, P[t2(492)](f(e4[t2(399)]), t2(506) + i3 + e4[t2(374)] + t2(282) + n2 + t2(372));
            } else
              j(W(t2(639)), 3);
          }, P[_(531)] = function(e4) {
            return null;
          }, P[_(598)] = function(n2, i3, a2, r3) {
            var o2 = _;
            a2 = a2 || I, r3 = r3 || I;
            var s2 = function(e5) {
              var t2 = w;
              r3(W(t2(243), 0, n2) + (e5[t2(267)] || e5[t2(490)]));
            };
            if (T) {
              var e4 = common_vendor.wx$1[o2(616)][o2(448)] + "/" + n2;
              common_vendor.wx$1[o2(289)]()[o2(233)]({ filePath: e4, encoding: o2(585), data: i3, success: function() {
                a2(e4);
              }, fail: s2 });
            } else
              r3(W(o2(467)));
          };
          var i2 = function(e4) {
            if (A(), E)
              ;
          };
          P[_(252)] = function(e4, t2, n2, a2) {
            var r3 = _, o2 = [], s2 = function(e5) {
              return W(w(385), 0, e5);
            };
            if (T) {
              var c2 = function(n3) {
                var r4 = w;
                if (n3 >= t2[r4(589)])
                  a2[r4(405)](e4, o2);
                else {
                  var i3 = t2[n3];
                  e4[r4(263)]()[r4(397)](i3)[r4(469)]({ node: true })[r4(338)](function(e5) {
                    var t3 = r4;
                    e5[0] ? (o2[t3(211)](e5[0][t3(370)]), c2(n3 + 1)) : j(s2(i3), 1);
                  });
                }
              };
              c2(0);
            } else {
              j(W(r3(258)), 1);
            }
          };
          var U = function() {
            var r3 = _;
            g(r3(248), {}, null, null, function(e5) {
              var t2 = r3, n2 = e5[t2(402)];
              t2(592) == n2 ? e5[t2(478)] ? j("[" + i3 + "][" + e5[t2(535)] + "]" + e5[t2(267)], 1) : j("[" + i3 + "][" + e5[t2(535)] + "]" + e5[t2(267)]) : t2(540) == n2 ? P[t2(297)](e5[t2(595)], e5[t2(318)]) : t2(328) == n2 || j(W(t2(407), 0, i3) + t2(605) + n2, 3), P[t2(230)] && P[t2(230)](e5);
            });
            var e4 = P[r3(288)], i3 = e4 && e4[r3(510)] ? l : r3(590);
            e4 && (P[r3(627)] = 1);
          }, c = _(271);
          _(573) + c;
          var l = c, A = P[_(489)] = function() {
            var e4 = _;
            P[e4(288)];
            return "";
          }, g = function(e4, t2, n2, r3, i3) {
            var a2 = _, o2 = A(), s2 = P[a2(288)];
            if (s2) {
              var c2 = { action: e4, args: t2 || {} };
              i3 || (i3 = function(e5) {
                var t3 = a2;
                t3(445) == e5[t3(377)] ? n2 && n2(e5[t3(528)], e5) : r3 && r3(e5[t3(267)]);
              }), s2[a2(510)] ? P[a2(576)][a2(495)](c2, i3) : s2[a2(495)](c2, i3);
            } else
              r3 && r3(o2);
          };
          P[_(422)] = function(r3, i3) {
            return new Promise(function(t2, n2) {
              var e4 = w;
              return n2(new Error(W(e4(396))));
            });
          }, o[_(498)] = function(e4, t2) {
            i2(), e4();
          }, o[_(330)] = function() {
            return e3(_(330));
          }, o[_(237)] = function() {
            return e3(_(237));
          };
          var e3 = function(e4) {
            return false;
          };
          o[_(634)] = function(e4, t2, n2) {
            var s2 = _, r3 = q[s2(415)];
            q[s2(415)] = null, r3 && d() && P[s2(492)](f(r3[s2(480)]), s2(427)), P[s2(487)] = P[s2(640)], P[s2(538)] = P[s2(433)], i2(), function(r4) {
              return r4();
            }(function() {
              b(e4, t2, n2);
            });
          };
          var b = function(i3, a2, v2) {
            var o2 = _;
            if (B)
              return P[o2(202)] ? void a2() : void v2(W(o2(409)));
            var A2 = function() {
              v2(W(o2(351)), true);
            }, e4 = function(n3) {
              var r3 = o2;
              U(), j(W(r3(483))), g(r3(404), {}, function(e5) {
                var t3 = r3;
                1 == e5 ? (j(W(t3(454))), n3()) : (j(W(t3(331)) + t3(504) + e5, 1), A2());
              }, v2);
            };
            if (P[o2(316)])
              e4(a2);
            else {
              var s2 = f(o2(284)), t2 = function(e5) {
                var n3 = o2, t3 = R(1), r3 = W(n3(507));
                t3 ? v2(r3 + t3) : P[n3(558)](s2, { tag: r3, timeout: 2e3, useEval: true }, n3(378))[n3(327)](function() {
                  e5();
                })[n3(321)](function(e6) {
                  var t4 = n3;
                  v2(e6[t4(353)] ? r3 + W(t4(326)) : e6[t4(267)]);
                });
              }, n2 = function(e5) {
                var n3 = o2;
                if (P[n3(333)](i3)) {
                  var t3 = n3(491), r3 = P[t3] || {};
                  P[n3(558)](s2, { timeout: -1 }, n3(457) + !!e5 + n3(280) + t3 + "=" + JSON[n3(456)](r3) + n3(360))[n3(327)](function(e6) {
                    var t4 = n3;
                    e6.ok ? a2() : v2(e6[t4(490)], e6[t4(557)]);
                  })[n3(321)](function(e6) {
                    v2(e6[n3(267)]);
                  });
                } else
                  v2(n3(246));
              };
              P[o2(288)] ? t2(function() {
                e4(function() {
                  n2(true);
                });
              }) : t2(function() {
                !function(p2) {
                  var d2 = w;
                  j(W(d2(278))), plus[d2(265)][d2(400)]([d2(361)], function(e5) {
                    var t3 = d2;
                    0 < e5[t3(601)][t3(589)] ? (j(W(t3(302)) + JSON[t3(456)](e5)), p2()) : (j(W(t3(561)), 1, e5), A2());
                  }, function(e5) {
                    var t3 = d2;
                    j(W(t3(622)) + e5[t3(267)], 1, e5), v2(W(t3(216)) + e5[t3(267)]);
                  });
                }(function() {
                  n2();
                });
              });
            }
          };
          function y() {
            var e4 = initMemory;
            return (y = function() {
              return e4;
            })();
          }
          o[_(484)] = function(t2, o2, n2, s2) {
            var c2 = _, e4 = q[c2(415)];
            if (q[c2(415)] = null, e4 && d() && P[c2(492)](f(e4[c2(480)]), c2(427)), !d()) {
              q[c2(431)] = o2;
              var u = h(o2);
              if (u[c2(552)][c2(225)] = true, u[c2(434)] = c2(344), q[c2(553)] = false, q[c2(415)] = u, P[c2(614)] = u, B)
                return P[c2(202)] ? void n2() : void s2(W(c2(215)));
              var r3 = function(t3) {
                var n3 = c2, e5 = JSON[n3(296)](JSON[n3(456)](l2));
                e5[n3(464)] = e5[n3(464)] || P[n3(264)] || 0, e5[n3(617)] = e5[n3(318)], e5[n3(318)] = 48e3;
                var r4 = (e5[n3(205)] || {})[n3(587)], i4 = e5[n3(314)];
                r4 && null == i4 && (i4 = 1, e5[n3(314)] = true), null != e5[n3(546)] || (e5[n3(546)] = i4 ? 7 : P[n3(638)] || "0"), j(n3(401) + JSON[n3(456)](e5)), U(), g(n3(313), e5, function() {
                  var e6 = n3;
                  P[e6(320)] = setInterval(function() {
                    g(e6(291), {}, function() {
                    });
                  }, 5e3), t3();
                }, s2);
              };
              clearInterval(P[c2(320)]);
              var l2 = {};
              for (var i3 in o2)
                /_renderjs$/[c2(624)](i3) || (l2[i3] = o2[i3]);
              if (l2 = JSON[c2(296)](JSON[c2(456)](l2)), P[c2(316)])
                r3(n2);
              else {
                u[c2(552)][c2(519)] = c2(453);
                var a2 = function(e5, t3) {
                  var n3 = c2, r4 = R(1);
                  if (r4)
                    s2(W(n3(423)) + r4);
                  else {
                    u[n3(480)] = p(null, n3(284)), q[n3(553)] = t3;
                    var i4 = [n3(612) + JSON[n3(456)](l2) + ";"], a3 = n3(621);
                    i4[n3(211)](n3(375) + (o2[n3(391)] || 0) + n3(626) + (o2[n3(570)] || 0) + n3(474) + (o2[n3(594)] || 0) + n3(537) + a3 + n3(276) + a3 + n3(270)), (o2[n3(339)] || o2[n3(449)]) && i4[n3(211)](n3(345) + (o2[n3(449)] || 0) + n3(249)), i4[n3(211)](n3(619)), P[n3(558)](f(u[n3(480)]), { timeout: -1 }, i4[n3(418)]("\n"))[n3(327)](function() {
                      e5();
                    })[n3(321)](function(e6) {
                      s2(e6[n3(267)]);
                    });
                  }
                };
                P[c2(288)] ? a2(function() {
                  var e5 = c2;
                  P[e5(333)](t2) ? r3(n2) : s2(e5(246));
                }, true) : a2(n2);
              }
            }
          }, o[_(603)] = function(e4) {
            return !!d();
          }, o[_(547)] = function(e4) {
            var t2 = _;
            for (var n2 in e4)
              /_renderjs$/[t2(624)](n2) && delete e4[n2];
          };
          var q = function(e4, t2) {
            var n2 = _, r3 = q[n2(415)];
            if (r3) {
              if (r3[n2(470)] || r3[n2(197)]({ envName: o[n2(364)], canProcess: o[n2(408)]() }, t2), r3[n2(470)] = 1, e4 instanceof Int16Array)
                var i3 = new Int16Array(e4);
              else
                i3 = new Int16Array(D(e4));
              var a2 = x[n2(245)](i3);
              r3[n2(335)](i3, a2);
            } else
              j(W(n2(272)), 3);
          };
          P[_(297)] = function(e4, t2) {
            var n2 = _;
            if (q[n2(553)]) {
              var r3 = q[n2(415)];
              return r3 ? void P[n2(492)](f(r3[n2(480)]), n2(285) + e4 + '",' + t2 + ")") : void j(W(n2(229)), 3);
            }
            q(e4, t2);
          }, o[_(636)] = function(n2, i3, r3) {
            var a2 = _, o2 = function(e5) {
              var t3 = w;
              P[t3(333)](n2) && (q[t3(415)] = null, s2 && c2 && d() && P[t3(492)](f(s2[t3(480)]), t3(427))), r3(e5);
            }, s2 = q[a2(415)], c2 = true, u = i3 ? "" : P[a2(214)](), e4 = function() {
              var e5 = a2;
              if (P[e5(333)](n2))
                if (q[e5(415)] = null, s2) {
                  if (j(e5(269) + s2[e5(198)] + e5(414) + s2[e5(218)] + e5(481) + JSON[e5(456)](q[e5(431)])), !i3)
                    return l2(), void o2(u);
                  s2[e5(380)](function(e6, t3, n3) {
                    l2(), i3(e6, t3, n3);
                  }, function(e6) {
                    l2(), o2(e6);
                  });
                } else
                  o2(W(e5(387)) + (u ? " (" + u + ")" : ""));
              else
                o2(e5(246));
            }, l2 = function() {
              var e5 = a2;
              if (P[e5(333)](n2))
                for (var t3 in q[e5(415)] = null, s2[e5(552)])
                  q[e5(431)][t3] = s2[e5(552)][t3];
            };
            if (B)
              return P[a2(202)] ? void e4() : void o2(W(a2(390)));
            var t2 = function(e5) {
              g(a2(279), {}, e5, o2);
            };
            if (clearInterval(P[a2(320)]), P[a2(316)])
              t2(e4);
            else {
              var p2 = function(e5) {
                var r4 = a2;
                if (s2) {
                  var t3 = R(1);
                  if (t3)
                    o2(W(r4(322)) + t3);
                  else {
                    var n3 = r4(569) + (i3 && q[r4(431)][r4(349)] || 0) + r4(574) + !i3 + r4(209);
                    P[r4(558)](f(s2[r4(480)]), { timeout: -1 }, n3)[r4(327)](function(e6) {
                      var t4 = r4;
                      c2 = false, s2[t4(552)][t4(519)] = q[t4(431)][t4(519)], s2[t4(552)][t4(318)] = e6[t4(261)], s2[t4(552)][t4(394)] = e6[t4(379)], l2();
                      var n4 = P[t4(531)](e6[t4(412)]);
                      n4 ? i3(n4, e6[t4(325)], e6[t4(562)]) : o2(W(t4(389)));
                    })[r4(321)](function(e6) {
                      c2 = false, o2(e6[r4(267)]);
                    });
                  }
                } else
                  o2(W(r4(477)) + (u ? " (" + u + ")" : ""));
              };
              P[a2(288)] ? t2(function() {
                var e5 = a2;
                P[e5(333)](n2) ? p2() : o2(e5(246));
              }) : p2();
            }
          };
        }();
      })(["UniWebViewEval bigBytes must be ArrayBuffer", "e6Mo::，请检查此页面代码中是否编写了lang=renderjs的module，并且调用了RecordApp.UniRenderjsRegister；如果确实没有renderjs，比如nvue页面，请设置RecordApp.UniWithoutAppRenderjs=true并且搭配配套的原生插件在逻辑层中直接录音", "dataId", "object", " srcSR:", "rec", "在uni-app中编译到App平台时仅供测试用，不可用于正式发布或商用，正式发布或商用需先获得授权许可（编译到其他平台时无此授权限制，比如：H5、小程序，均为免费授权）。本对话框仅在第一次请求录音权限时会弹出一次，如何去除本弹框、如何获取商用授权、更多信息请看控制台日志", "(function(){\n", "join", "UniMainCallBack", '",{action:"', "RegisterPlatform", "UniNativeUtsPluginCallAsync", "Bjx9::无法调用Start：", "MiniProgramWx_onShow", "我已获得UniAppID=", "UniMainCallBack_Register", "RecordApp.Stop()", "H753::未配置RecordApp.UniNativeUtsPlugin原生录音插件", " WvCid=", "dX6B::{1}需要传入当前页面或组件的this对象作为参数", "param", "iKhe::plus.ios请求录音权限，状态值: ", "__uniAppComponentId", "dataType", "\n		if(!window.RecordApp){\n			return CallFail(", "bytes", "miniProgram-wx", "4ATo::Recorder-UniCore目前只支持：H5、APP(Android iOS)、MP-WEIXIN，其他平台环境需要自行编写适配文件实现接入", "kSjQ::当前App未打包进双端原生插件[{1}]，尝试加载单端[{2}]", '"});\n		})()', "$ownerInstance", "RecordApp.UniRenderjsRegister", "peIm::当前还未调用过RecordApp.UniWebViewActivate", "mOffset", "success", "mSbR::当前还未调用过RecordApp.UniWebViewActivate", "$scope", "USER_DATA_PATH", "takeoffEncodeChunk_renderjs", "TtoS::，不可以调用RecordApp.UniWebViewVueCall", "URyD::没有找到组件的renderjs模块", "ZHwv::[MainReceive]从renderjs发回未知数据：", "unknown", "Lx6r::已获得录音权限", "querySelectorAll", "stringify", "\n			RecordApp.UniAppUseNative=", "\n		}).call(vm);\n	})()", "isOk", ");\n		};\n	", "iOS", "__9xoE", "Xh1W::已加载原生录音插件[{1}]", "appNativePlugin_sampleRate", "pageShow", "sharedInstance", "kxOd::当前环境未支持保存本地文件", "RecordApp.", "fields", "_appStart", "random", "__rModule", "_$id", ";\n		var startFn=", "NSBundle", "1356906lijWyv", "pP4O::未开始录音", "isError", "style", "__wvCid", " set:", "$vm", "Lx5r::正在调用原生插件请求录音权限", "Start", "__uniAppMainReceiveBind", "SWsy::检测到有其他页面或组件调用了RecordApp.UniPageOnShow（WvCid={1}），但未调用过RecordApp.UniWebViewActivate（当前WvCid={2}），部分功能会继续使用之前Activate的WebView和组件，请确保这是符合你的业务逻辑，不是因为忘记了调用UniWebViewActivate", "__uniAppReqWebViewId", "MTdp::未开始录音，但收到renderjs回传的onRecEncodeChunk", "UniCheckNativeUtsPluginConfig", "errMsg", "RequestPermission_H5OpenSet", "UniWebViewEval", "uts", "getStorageSync", "request", "vEgr::不应该出现的MainReceiveBind重复绑定", "height", "Install", "getSystemInfoSync", "substr", "dX5B::{1}需在renderjs中调用并且传入当前模块的this", "outerHTML", "l6sY::renderjs中不支持设置RecordApp.UniNativeUtsPlugin", " code=", "ownerId", '(function(){\n		var fn=RecordApp.__UniData["', "ksoA::无法调用RequestPermission：", "UniWebViewSendToMain", "buffer", "nativePlugin", "U1Be::renderjs中未import导入RecordApp", "\n		if(!window.RecordApp){\n			var err=", "setAttribute", "   jsCode=", "requireNativePlugin", "rec_wv_cid_key", "canvas", "fullPath", "type", "createElement", "xYRb::当前RecordApp运行在逻辑层中（性能会略低一些，可视化等插件不可用）", "RecordApp__uniAppMainReceive", "fqhr::当前已配置RecordApp.UniWithoutAppRenderjs，必须提供原生录音插件或uts插件才能录音，请参考RecordApp.UniNativeUtsPlugin配置", "(function(){\n				var BigBytes=window.", "indexOf", "mainCb_", "_cid_", "value", "recEncodeChunk", "nativePluginName", "UniMainTakeBigBytes", "appendChild", "TGMm::提供的RecordApp.UniNativeUtsPlugin值不是RecordApp的uts原生录音插件", "w37G::已购买原生录音插件，获得授权许可", "tag", "897508WgBLZb", ";\n		set.onProcess=function(", "__uniAppReqComponentId", '\n		var CallSuccess=function(val,buf){\n			if(buf){\n				RecordApp.UniWebViewSendBigBytesToMain(buf,function(dataID){\n					RecordApp.UniWebViewSendToMain({action:"', "onRecord", "__0hyi", "showModal", "S3eF::未找到当前页面renderjs所在的WebView", '",errMsg:err});\n		};', "slice", "android_audioSource", "AllStart_Clean", "未获得商用授权时，App上仅供测试哈", ');\n		};\n		if(!RecordApp.Platforms["UniApp-Renderjs"]){\n			return CallFail(', "当前未获得授权许可。文件", "subarray", "set", "nativeToRjs", "__xYRb", " parentNode:\n", "$el", "isUserNotAllow", "UniWebViewCallAsync", "(function(){\n			var cur=window.", "lU1W::当前不是App逻辑层", "Ruxl::plus.android请求录音权限：无权限", "mime", "Rec_WvCid", "我知道啦", "6Iql::未找到此页面renderjs所在的WebView Cid", "0FGq::未开始录音，不可以调用{1}", ',1);\n					return;\n				}else{\n					if(el2){\n						if(!el2.getAttribute("el2")){ el=els[1]; el2=els[0] }\n						el2.parentNode.removeChild(el2);\n					}\n					el.style.display="none";\n					el2=document.createElement("canvas");\n					el2.setAttribute("el2","1"); el2.style.width=el2.style.height="100%";\n					el.parentNode.appendChild(el2);\n				}\n				var canvas', "100%", "(function(){\n			var stopFn=", "onProcessBefore_renderjs", "mrBind", "requestFileSystem", "https://ext.dcloud.net.cn/plugin?name=", ";\n			var clear=", "\n})()", "__uniNP", "mainID", "j15C::已获得iOS原生录音权限", "__dX7B", "createWriter", "UniPageOnShow", '\n				var els=cpEl.querySelectorAll("', "||{memory:new Uint8Array(", "XSYY::当前录音由原生录音插件提供支持", "binary", ' canvas"),el=els[0],el2=els[1];\n				if(!el && ', "echoCancellation", "__nnM6", "length", "RecorderUtsPlugin", "TSmQ::需要在页面中提供一个renderjs，在里面import导入RecordApp、录音格式编码器、可视化插件等", "onLog", "=el2;\n			", "start_renderjs", "pcmDataBase64", "writeAsBinary", "PUBLIC_DOWNLOADS", "UniSaveLocalFile", "Platforms", "replace", "granted", "UniWebViewActivate", "Start_Check", "在uni-app中编译到App平台时仅供测试用（App平台包括：Android App、iOS App），不可用于正式发布或商用，正式发布或商用需先获取到商用授权许可（编译到其他平台时无此授权限制，比如：H5、小程序，均为免费授权）。未获得授权时，在App打开后第一次调用RecordApp.RequestPermission请求录音权限时，会先弹出商用授权提示框；获取到授权许可后，请在调用RequestPermission前设置 RecordApp.UniAppUseLicense='", "action=", "==0 && type==2) continue; type=9; //尝试获取el的上级来查询\n				if(!el){\n					RecordApp.CLog(", "0hyi::当前RecordApp运行在renderjs所在的WebView中（逻辑层中只能做有限的实时处理，可视化等插件均需要在renderjs中进行调用）", "\n...\n", "preCode", "__hasWvActivate", "7kJS::RecordApp.UniRenderjsRegister 已注册当前页面renderjs模块", "var set=", "(function(){\n		var CallErr=function(){};\n		", "__Rec", "wv_", "env", "sampleRate_set", "AVAudioSession", "RecordApp.Start(set,function(){\n			startFn&&startFn.call(This);\n			CallSuccess();\n		},function(errMsg){\n			CallFail(errMsg);\n		});", "4405QUTQBY", "buffers,power,duration,sampleRate,newIdx", "0JQw::plus.android请求录音权限出错：", "max", "test", "mzKj::RecordApp.UniRenderjsRegister 重复注册当前页面renderjs模块，一个组件内只允许一个renderjs模块进行注册", ";\r\n		var procBefore=", "__uniNbjc", "VsdN::需重新调用RecordApp.RequestPermission方法", "getAttribute", "newBuffers", "deleteObject", "$page", "unsubscribe", "RequestPermission", "RecApp Main", "Stop", "1f2V:: | RecordApp的uni-app支持文档和示例：{1} ", "Default_Android_AudioSource", "CjMb::无效的BigBytes回传数据", "__uniAppWebViewId", "qDo1::未找到此页面renderjs所在的WebView", "removeChild", "RXs7::微信小程序中需要：{1}", "evalJS", "$getAppWebview", "envStart", "recSize", "CallErr=function(err){ CallFail(err) };", `;
				RecordApp.CLog(err,1); CallErr(err); return;
			};
			var el=document.querySelector("[rec_wv_cid_key='"+wvCid+"']");
			vm=el&&el.__rModule;
			if(!vm){
				var err=`, "appId", "UniAppUseNative", "的商用授权", "plusCallMethod", "audioTrackSet", "__UniWvCid", "UniWebViewVueCall", '"));\n			cur.memory.set(buf,cur.mOffset);\n			cur.mOffset+=buf.byteLength;\n			RecordApp.UniWebViewSendToMain({action:"', ';\n			var errFn=function(errMsg){\n				CallFail(errMsg);\n			};\n			RecordApp.Stop(clear?null:function(arrBuf,duration,mime){\n				stopFn&&stopFn.apply(This,arguments);\n				var recSet=RecordApp.__Rec.set,t1=Date.now();\n				RecordApp.CLog("开始传输"+arrBuf.byteLength+"字节的数据回逻辑层，可能会比较慢，推荐使用takeoffEncodeChunk实时获取音频文件数据可避免Stop时产生超大数据回传");\n				RecordApp.UniWebViewSendBigBytesToMain(arrBuf,function(dataId){//数据可能很大\n					RecordApp.CLog("完成传输"+arrBuf.byteLength+"字节的数据回逻辑层，耗时"+(Date.now()-t1)+"ms");\n					CallSuccess({recSet_sr:recSet.sampleRate,recSet_bit:recSet.bitRate,dataId:dataId,duration:duration,mime:mime});\n				},errFn);\n			},errFn);\n		})()', "bigBytes_", "push", "Bcgi::renderjs中的mounted内需要调用RecordApp.UniRenderjsRegister", "AN0e::需在renderjs中import {1}", "__StopOnlyClearMsg", "rSLO::不应当出现的非H5录音Start", "Mvl7::调用plus的权限请求出错：", "onerror", "srcSampleRate", "UniWebViewSendBigBytesToMain", "bigBytes_chunk", '),mOffset:0};\n			var buf=new Uint8Array(RecordApp.UniAtob("', "WpKg::RecordApp.UniWebViewActivate 已切换当前页面或组件的renderjs所在的WebView", "KQhJ::{1}连接renderjs超时", "AGd7::需要先调用RecordApp.UniWebViewActivate方法", "disableEnvInFix", "UniApp-Renderjs", "__WebVieW_Id__", "importClass", "byzO::未开始录音，但收到UniNativeUtsPlugin PCM数据", "UniNativeUtsPlugin_JsCall", " canvas", "show", "writeFile", "GwCz::RecordApp.UniWebViewActivate 需要传入当前页面或组件的this对象作为参数", "__uniNupErr", "useEval", "Resume", '"@/uni_modules/Recorder-UniCore/', ";\n				", "UniWebViewSendBigBytesToMain buffer must be ArrayBuffer", '\n			for(var type=2;type<=3;type++){//@@Fast\n				var cpEl=RecordApp.__dX7B(type, this.$ownerInstance.$el, "RecordApp.UniFindCanvas.renderjs");\n				if(!cpEl) return; //wvFixEl()\n		', "Android", "UqfI::保存文件{1}失败：", '",vm=RecordApp.__uniWvCallVm;\n		if(!vm || RecordApp.__uniWvCallWvCid!=wvCid){\n			if(!RecordApp.__UniData[wvCid]){\n				var err=', "pcm_sum", "Incorrect sync status", "root", "jsCall", ';\n			set.takeoffEncodeChunk=function(bytes){\n				RecordApp.UniWebViewSendToMain({action:"recEncodeChunk",bytes:RecordApp.UniBtoa(bytes.buffer)});\n				takeFn&&takeFn.apply(This,arguments);\n			};', "sWvCid", "infoDictionary", "UniFindCanvas", "=window.", '+" WvCid="+wvCid;\n				RecordApp.CLog(err,1); CallErr(err); return;\n			};\n			RecordApp.__uniWvCallVm=vm;\n			RecordApp.__uniWvCallWvCid=wvCid;\n		}; (function(){ var This=this;\n			', "setStorageSync", ".memory.buffer; delete window.", "webview", "yI24::RecordApp.UniFindCanvas未适配当前环境", "el2", " WvCid=wv_", "recSet_sr", "width", "createSelectorQuery", "Default_AppNativePlugin_SampleRate", "android", "subscribe", "message", "Uc9E::RecordApp.UniRenderjsRegister 发生不应该出现的错误（可能需要升级插件代码）：", "rec encode: pcm:", ');\n			var newBuffers=[],recSet=RecordApp.__Rec.set;\n			for(var i=newIdx;i<buffers.length;i++)newBuffers.push(RecordApp.UniBtoa(buffers[i].buffer));//@@Fast\n			RecordApp.UniWebViewSendToMain({action:"recProcess",recSet_sr:recSet.sampleRate,recSet_bit:recSet.bitRate,sampleRate:sampleRate,newBuffers:newBuffers});\n			return procFn&&procFn.apply(This,arguments);\n		};', "Recorder-NativePlugin", "BjGP::未开始录音，但收到Uni Native PCM数据", "none", "892185CAKnjA", "MujG::只允许在renderjs中调用RecordApp.UniWebViewSendBigBytesToMain", "){\r\n			procBefore&&procBefore.call(This,", "display", "7Noe::正在调用plus.android.requestPermissions请求Android原生录音权限", "recordStop", ";\r\n			RecordApp.Current=null; //需先重置，不然native变化后install不一致\n			RecordApp.", "b64", '"];\n		if(fn)fn(', "4012128ZFFyqy", "@req", 'RecordApp.UniNativeRecordReceivePCM("', "UniApp-Main", "@act", "UniNativeUtsPlugin", "getFileSystemManager", "igw2::，不可以调用RecordApp.UniWebViewEval", "recordAlive", "aPoj::UniAppUseLicense填写无效，如果已获取到了商用授权，请填写：{1}，否则请使用空字符串", "ios", ';\n			window["console"].error(err); CallErr(err); return;\n		};\n		var wvCid="', "9xoE::项目配置中未声明iOS录音权限{1}", "parse", "UniNativeRecordReceivePCM", "__callWvActivate", "UniRenderjsRegister", "uid", "$root", "Bgls::已获得Android原生录音权限：", "requestRecordPermission", "RecordApp.UniFindCanvas.H5", "XCMU::需先调用RecordApp.UniWebViewActivate，然后才可以调用Start", "mainCb_reg_", "nodeName", "parentNode", "DisableIOSPlusReqPermission", "dX7B::{1}未正确查询到节点，将使用传入的当前页面或组件this的$el.parentNode作为组件根节点。如果template下存在多个根节点(vue3 multi-root)，尽量在最外面再套一层view来避免兼容性问题", "publishHandler", '", isOk:true, value:val});\n			}\n		};\n		var CallFail=function(err){\n			UniViewJSBridge.publishHandler("', "recordStart", "appNativePlugin_AEC_Enable", "TfJX::当前不是App逻辑层", "UniWithoutAppRenderjs", "1117214uNlouf", "sampleRate", "SCW9::配置了RecordApp.UniNativeUtsPlugin，但当前App未打包进原生录音插件[{1}]", "_X3Ij_alive", "catch", "H6cq::无法调用Stop：", "getWebviewById", "kE91::renderjs中的mounted内需要调用RecordApp.UniRenderjsRegister才能调用RecordApp.UniWebViewSendBigBytesToMain", "duration", "KnF0::无法连接到renderjs", "then", "noop", "Tag", "Pause", "Lx7r::无录音权限", "UniAppUseLicense", "__Sync", "dataID", "envIn", "kZx6::从renderjs发回数据但UniMainCallBack回调不存在：", '"});\n		', "exec", "takeoffEncodeChunk", "-Android （会赠送Android版原生插件）；购买后可联系客服，同时提供订单信息，客服拉你进入VIP支持QQ群，入群后在群文件中可下载此js文件最新源码；客服联系方式：QQ 1251654593 ，或者直接联系作者QQ 753610399 （回复可能没有客服及时）。详细请参考文档: ", "RecApp Renderjs", "denied ", "recProcess", "arraybuffer", "var takeFn=", " wvCid=", "!id || !cid", "jsCode", "stop_renderjs", "memory", "0caE::用户拒绝了录音权限", "503716XEwjom", "isTimeout", "__UniData", "RDcZ::{1}处理超时", "3jVZBMI", "\n			})()", "bigBytes_start", '", isOk:true, value:val, dataID:dataID});\n				},CallFail)\n			}else{\n				RecordApp.UniWebViewSendToMain({action:"', ";\n			RecordApp.RequestPermission(function(){\n				CallSuccess({ok:1});\n			},function(errMsg,isUserNotAllow){\n				CallSuccess({errMsg:errMsg,isUserNotAllow:isUserNotAllow});\n			});\n		", "android.permission.RECORD_AUDIO", "NSMicrophoneUsageDescription", "timeout", "Key", "mainBundle", "import 'recorder-core/src/app-support/app-miniProgram-wx-support.js'", "PkQ2::需先调用RecordApp.UniWebViewActivate，然后才可以调用RequestPermission", "__UniMainReceiveBigBytes", "7ot0::需先调用RecordApp.RequestPermission方法", "node", "' ，就不会弹提示框了；或者购买了配套的原生录音插件，设置RecordApp.UniNativeUtsPlugin参数后，也不会弹提示框。【获取授权方式】到DCloud插件市场购买授权: ", ");\n	})()", "onwrite", "wvID", "var procFn=", "FabE::【在App内使用{1}的授权许可】", "status", "CallSuccess(1)", "recSet_bit", "stop", "Y3rC::正在调用plus.ios@AVAudioSession请求iOS原生录音权限", "KpY6::严重兼容性问题：无法获取页面或组件this.$root.$scope或.$page", "undefined", "nnM6::当前录音由uts插件提供支持", "k7im::未找到Canvas：{1}，请确保此DOM已挂载（可尝试用$nextTick等待DOM更新）", "__FabE", "YP4V::未开始录音", "e71S::已购买uts插件，获得授权许可", "gomD::不应该出现的renderjs发回的文件数据丢失", "TPhg::不应当出现的非H5录音Stop", "onProcess_renderjs", '\n			UniViewJSBridge.publishHandler("', "ipB3::RecordApp.UniWebViewActivate 发生不应该出现的错误（可能需要升级插件代码）：", "bitRate", "getFile", "MrBx::需在App逻辑层中调用原生插件功能", "select", "#text", "wvCid", "requestPermissions", "Native Start Set:", "action", "byteLength", "recordPermission", "apply", "__uniAppWebView", "dl4f::{1}回传了未知内容，", "CanProcess", "Jk72::不应当出现的非H5权限请求"]);
    }(i, r, 0, a.$T, t);
  } else
    common_vendor.index.__f__("error", "at uni_modules/Recorder-UniCore/app-uni-support.js:38", "需要先引入RecordApp，请按下面代码引入：\n1. 项目根目录 npm install recorder-core\n2. 页面中按顺序import\nimport Recorder from 'recorder-core'\nimport RecordApp from 'recorder-core/src/app-support/app.js'\nimport 你需要的音频格式编码器、可视化插件\n参考文档：" + i);
}();
//# sourceMappingURL=../../../.sourcemap/mp-weixin/uni_modules/Recorder-UniCore/app-uni-support.js.map
