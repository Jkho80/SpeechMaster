import {
  __commonJS
} from "./chunk-Y2F7D3TJ.js";

// ../../../XMU/Sem4/计算机大赛/FrontEnd/node_modules/recorder-core/src/app-support/app.js
var require_app = __commonJS({
  "../../../XMU/Sem4/计算机大赛/FrontEnd/node_modules/recorder-core/src/app-support/app.js"(exports, module) {
    (function(factory) {
      var browser = typeof window == "object" && !!window.document;
      var win = browser ? window : Object;
      var rec = win.Recorder, ni = rec.i18n;
      factory(win, rec, ni, ni.$T, browser);
      if (typeof define == "function" && define.amd) {
        define(function() {
          return win.RecordApp;
        });
      }
      ;
      if (typeof module == "object" && module.exports) {
        module.exports = win.RecordApp;
      }
      ;
    })(function(Export, Recorder, i18n, $T, isBrowser) {
      "use strict";
      var App = {
        LM: "2024-04-09 19:22",
        Current: 0,
        Platforms: {}
      };
      var Platforms = App.Platforms;
      var AppTxt = "RecordApp";
      var ReqTxt = "RequestPermission";
      var RegTxt = "RegisterPlatform";
      var WApp2 = Export[AppTxt];
      if (WApp2 && WApp2.LM == App.LM) {
        WApp2.CLog($T("uXtA::重复导入{1}", 0, AppTxt), 3);
        return;
      }
      ;
      Export[AppTxt] = App;
      Recorder[AppTxt] = App;
      App.__SID_ = 0;
      var SID = App.__SID = function() {
        return ++App.__SID_;
      };
      var Sync = App.__Sync = function(sid, tag, err) {
        if (App.__SID_ != sid) {
          if (tag) {
            CLog($T("kIBu::注意：因为并发调用了其他录音相关方法，当前 {1} 的调用结果已被丢弃且不会有回调", 0, tag) + (err ? ", error: " + err : ""), 3);
          }
          return false;
        }
        return true;
      };
      var CLog = function() {
        var v = arguments;
        v[0] = "[" + (CLog.Tag || AppTxt) + "][" + (App.Current && App.Current.Key || "?") + "]" + v[0];
        Recorder.CLog.apply(null, v);
      };
      App.CLog = CLog;
      App[RegTxt] = function(key, config) {
        config.Key = key;
        if (Platforms[key]) {
          CLog($T("ha2K::重复注册{1}", 0, key), 3);
        }
        Platforms[key] = config;
      };
      App.__StopOnlyClearMsg = function() {
        return $T("wpTL::仅清理资源");
      };
      var KeyH5 = "Default-H5", H5OpenSet = ReqTxt + "_H5OpenSet";
      (function() {
        var impl = {
          Support: function(call) {
            call(true);
          },
          CanProcess: function() {
            return true;
          }
        };
        App[RegTxt](KeyH5, impl);
        impl[ReqTxt] = function(sid, success, fail) {
          var old = App.__Rec;
          if (old) {
            old.close();
            App.__Rec = null;
          }
          ;
          h5Kill();
          var h5Set = App[H5OpenSet];
          App[H5OpenSet] = null;
          var rec = Recorder(h5Set || {});
          rec.open(function() {
            success();
          }, fail);
        };
        var h5Kill = function() {
          if (Recorder.IsOpen()) {
            CLog("kill open...");
            var rec = Recorder();
            rec.open();
            rec.close();
          }
          ;
        };
        impl.Start = function(sid, set, success, fail) {
          var appRec = App.__Rec;
          if (appRec != null) {
            appRec.stop();
          }
          ;
          App.__Rec = appRec = Recorder(set);
          appRec.appSet = set;
          appRec.dataType = "arraybuffer";
          appRec.open(function() {
            if (Sync(sid)) {
              appRec.start();
            }
            ;
            success();
          }, fail);
        };
        impl.Stop = function(sid, success, fail) {
          var appRec = App.__Rec;
          var clearMsg = success ? "" : App.__StopOnlyClearMsg();
          if (!appRec) {
            h5Kill();
            fail($T("bpvP::未开始录音") + (clearMsg ? " (" + clearMsg + ")" : ""));
            return;
          }
          ;
          var end = function() {
            if (Sync(sid)) {
              appRec.close();
              for (var k in appRec.set) {
                appRec.appSet[k] = appRec.set[k];
              }
              ;
            }
            ;
          };
          var stopFail = function(msg) {
            end();
            fail(msg);
          };
          if (!success) {
            stopFail(clearMsg);
            return;
          }
          ;
          appRec.stop(function(arrBuf, duration, mime) {
            end();
            success(arrBuf, duration, mime);
          }, stopFail);
        };
      })();
      App.GetCurrentRecOrNull = function() {
        return App.__Rec || null;
      };
      App.Pause = function() {
        var cur = App.Current, key = "Pause";
        if (cur && cur[key]) {
          if (cur[key]() !== false)
            return;
        }
        var rec = App.__Rec;
        if (rec && canProc(key)) {
          rec.pause();
        }
      };
      App.Resume = function() {
        var cur = App.Current, key = "Resume";
        if (cur && cur[key]) {
          if (cur[key]() !== false)
            return;
        }
        var rec = App.__Rec;
        if (rec && canProc(key)) {
          rec.resume();
        }
      };
      var canProc = function(tag) {
        var cur = App.Current;
        if (cur && cur.CanProcess())
          return 1;
        CLog($T("fLJD::当前环境不支持实时回调，无法进行{1}", 0, tag), 3);
      };
      App.Install = function(success, fail) {
        var cur = App.Current;
        if (cur) {
          success && success();
          return;
        }
        var reqs = App.__reqs || (App.__reqs = []);
        reqs.push({ s: success, f: fail });
        success = function() {
          call("s", arguments);
        };
        fail = function() {
          call("f", arguments);
        };
        var call = function(fn, args) {
          var arr = [].concat(reqs);
          reqs.length = 0;
          for (var i = 0; i < arr.length; i++) {
            var f = arr[i][fn];
            f && f.apply(null, args);
          }
          ;
        };
        if (reqs.length > 1)
          return;
        var keys = [KeyH5], key;
        for (var k in Platforms) {
          if (k != KeyH5)
            keys.push(k);
        }
        keys.reverse();
        var initCur = function(idx) {
          key = keys[idx];
          cur = Platforms[key];
          cur.Support(function(canUse) {
            if (!canUse) {
              return initCur(idx + 1);
            }
            ;
            if (cur.Install) {
              cur.Install(initOk, fail);
            } else {
              initOk();
            }
            ;
          });
        };
        var initOk = function() {
          App.Current = cur;
          CLog("Install platform: " + key);
          success();
        };
        initCur(0);
      };
      App[ReqTxt] = function(success, fail) {
        var sid = SID(), tag = AppTxt + "." + ReqTxt;
        var failCall = function(errMsg, isUserNotAllow) {
          isUserNotAllow = !!isUserNotAllow;
          var msg = errMsg + ", isUserNotAllow:" + isUserNotAllow;
          if (!Sync(sid, tag, msg))
            return;
          CLog($T("YnzX::录音权限请求失败：") + msg, 1);
          fail && fail(errMsg, isUserNotAllow);
        };
        CLog(ReqTxt + "...");
        App.Install(function() {
          if (!Sync(sid, tag))
            return;
          var checkMsg = CheckH5();
          if (checkMsg) {
            failCall(checkMsg);
            return;
          }
          ;
          App.Current[ReqTxt](sid, function() {
            if (!Sync(sid, tag))
              return;
            CLog(ReqTxt + " Success");
            success && success();
          }, failCall);
        }, failCall);
      };
      var NeedReqMsg = function() {
        return $T("nwKR::需先调用{1}", 0, ReqTxt);
      };
      var CheckH5 = function() {
        var msg = "";
        if (App.Current.Key == KeyH5 && !isBrowser) {
          msg = $T("citA::当前不是浏览器环境，需引入针对此平台的支持文件（{1}），或调用{2}自行实现接入", 0, "src/app-support/app-xxx-support.js", AppTxt + "." + RegTxt);
        }
        ;
        return msg;
      };
      App.Start = function(set, success, fail) {
        var sid = SID(), tag = AppTxt + ".Start";
        var failCall = function(msg) {
          if (!Sync(sid, tag, msg))
            return;
          CLog($T("ecp9::开始录音失败：") + msg, 1);
          fail && fail(msg);
        };
        CLog("Start...");
        var cur = App.Current;
        if (!cur) {
          failCall(NeedReqMsg());
          return;
        }
        ;
        set || (set = {});
        var obj = {
          type: "mp3",
          sampleRate: 16e3,
          bitRate: 16,
          onProcess: function() {
          }
        };
        for (var k in obj) {
          set[k] || (set[k] = obj[k]);
        }
        ;
        for (var k in Platforms) {
          var pf = Platforms[k];
          if (pf.AllStart_Clean) {
            pf.AllStart_Clean(set);
          }
        }
        ;
        var checkMsg = false;
        if (cur.Start_Check) {
          checkMsg = cur.Start_Check(set);
        }
        ;
        if (checkMsg === false) {
          var checkRec = Recorder(set);
          checkMsg = checkRec.envCheck({ envName: cur.Key, canProcess: cur.CanProcess() });
          if (!checkMsg)
            checkMsg = CheckH5();
        }
        if (checkMsg) {
          failCall($T("EKmS::不能录音：") + checkMsg);
          return;
        }
        ;
        App._SRec = 0;
        cur.Start(sid, set, function() {
          if (!Sync(sid, tag))
            return;
          CLog($T("k7Qo::已开始录音"), set);
          App._STime = Date.now();
          success && success();
        }, failCall);
      };
      App.Stop = function(success, fail) {
        var sid = SID(), tag = AppTxt + ".Stop";
        var failCall = function(msg) {
          if (!Sync(sid, tag, msg))
            return;
          CLog($T("Douz::结束录音失败：") + msg, success ? 1 : 0);
          try {
            fail && fail(msg);
          } finally {
            clear();
          }
        };
        var clear = function() {
          App._SRec = App.__Rec;
          App.__Rec = null;
        };
        CLog("Stop... " + $T("wqSH::和Start时差：{1}ms", 0, App._STime ? Date.now() - App._STime : -1) + " Recorder.LM:" + Recorder.LM + " " + AppTxt + ".LM:" + App.LM);
        var t1 = Date.now();
        var cur = App.Current;
        if (!cur) {
          failCall(NeedReqMsg());
          return;
        }
        ;
        cur.Stop(sid, !success ? null : function(arrayBuffer, duration, mime) {
          if (!Sync(sid, tag))
            return;
          CLog($T("g3VX::结束录音 耗时{1}ms 音频时长{2}ms 文件大小{3}b {4}", 0, Date.now() - t1, duration, arrayBuffer.byteLength, mime));
          try {
            success(arrayBuffer, duration, mime);
          } finally {
            clear();
          }
        }, failCall);
      };
    });
  }
});
export default require_app();
//# sourceMappingURL=recorder-core_src_app-support_app.js.map
