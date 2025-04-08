// ../../../XMU/Sem4/计算机大赛/FrontEnd/node_modules/recorder-core/src/app-support/app-miniProgram-wx-support.js
(function(factory) {
  var browser = typeof window == "object" && !!window.document;
  var win = browser ? window : Object;
  var rec = win.Recorder, ni = rec.i18n;
  factory(rec, ni, ni.$T, browser);
})(function(Recorder, i18n, $T, isBrowser) {
  "use strict";
  var IsWx = typeof wx == "object" && !!wx.getRecorderManager;
  var App = Recorder.RecordApp;
  var CLog = App.CLog;
  var platform = {
    Support: function(call) {
      if (IsWx && isBrowser) {
        var win = window, doc = win.document, loc = win.location, body = doc.body;
        if (loc && loc.href && loc.reload && body && body.appendChild) {
          CLog("识别是浏览器但又检测到wx", 3);
          call(false);
          return;
        }
      }
      call(IsWx);
    },
    CanProcess: function() {
      return true;
    }
  };
  App.RegisterPlatform("miniProgram-wx", platform);
  App.MiniProgramWx_onShow = function() {
    recOnShow();
  };
  platform.RequestPermission = function(sid, success, fail) {
    requestPermission(success, fail);
  };
  platform.Start = function(sid, set, success, fail) {
    onRecFn.param = set;
    var rec = Recorder(set);
    rec.set.disableEnvInFix = true;
    rec.dataType = "arraybuffer";
    onRecFn.rec = rec;
    App.__Rec = rec;
    recStart(success, fail);
  };
  platform.Stop = function(sid, success, fail) {
    clearCurMg();
    var failCall = function(msg) {
      if (App.__Sync(sid)) {
        onRecFn.rec = null;
      }
      fail(msg);
    };
    var rec = onRecFn.rec;
    onRecFn.rec = null;
    var clearMsg = success ? "" : App.__StopOnlyClearMsg();
    if (!rec) {
      failCall("未开始录音" + (clearMsg ? " (" + clearMsg + ")" : ""));
      return;
    }
    ;
    CLog("rec encode: pcm:" + rec.recSize + " srcSR:" + rec.srcSampleRate + " set:" + JSON.stringify(onRecFn.param));
    var end = function() {
      if (App.__Sync(sid)) {
        for (var k in rec.set) {
          onRecFn.param[k] = rec.set[k];
        }
        ;
      }
      ;
    };
    if (!success) {
      end();
      failCall(clearMsg);
      return;
    }
    ;
    rec.stop(function(arrBuf, duration, mime) {
      end();
      success(arrBuf, duration, mime);
    }, function(msg) {
      end();
      failCall(msg);
    });
  };
  var onRecFn = function(pcm, sampleRate) {
    var rec = onRecFn.rec;
    if (!rec) {
      CLog("未开始录音，但收到wx PCM数据", 3);
      return;
    }
    ;
    if (!rec._appStart) {
      rec.envStart({
        envName: platform.Key,
        canProcess: platform.CanProcess()
      }, sampleRate);
    }
    ;
    rec._appStart = 1;
    var sum = 0;
    for (var i = 0; i < pcm.length; i++) {
      sum += Math.abs(pcm[i]);
    }
    rec.envIn(pcm, sum);
  };
  var hasPermission = false;
  var requestPermission = function(success, fail) {
    clearCurMg();
    initSys();
    if (hasPermission) {
      success();
      return;
    }
    var mg = wx.getRecorderManager(), next = 1;
    mg.onStart(function() {
      hasPermission = true;
      if (next) {
        next = 0;
        stopMg(mg);
        success();
      }
    });
    mg.onError(function(res) {
      var msg = "请求录音权限出现错误：" + res.errMsg;
      CLog(msg + "。" + UserPermissionMsg, 1, res);
      if (next) {
        next = 0;
        stopMg(mg);
        fail(msg, true);
      }
    });
    newStart("req", mg);
  };
  var UserPermissionMsg = "请自行检查wx.getSetting中的scope.record录音权限，如果用户拒绝了权限，请引导用户到小程序设置中授予录音权限。";
  var curMg, mgStime = 0;
  var clearCurMg = function() {
    var old = curMg;
    curMg = null;
    if (old) {
      stopMg(old);
    }
  };
  var stopMg = function(mg) {
    mgStime = Date.now();
    mg.stop();
  };
  var newStart = function(tag, mg) {
    var obj = {
      duration: 6e5,
      sampleRate: 48e3,
      encodeBitRate: 32e4,
      numberOfChannels: 1,
      format: "PCM",
      frameSize: isDev ? 1 : 4
      //4=48/12
    };
    var set = onRecFn.param || {}, aec = (set.audioTrackSet || {}).echoCancellation;
    if (sys.platform == "android") {
      var source = set.android_audioSource, asVal = "";
      if (source == null && aec)
        source = 7;
      if (source == null)
        source = App.Default_Android_AudioSource;
      if (source == 1)
        asVal = "mic";
      if (source == 5)
        asVal = "camcorder";
      if (source == 6)
        asVal = "voice_recognition";
      if (source == 7)
        asVal = "voice_communication";
      if (asVal)
        obj.audioSource = asVal;
    }
    ;
    if (aec) {
      CLog("mg注意：iOS下无法配置回声消除，Android无此问题，建议都启用听筒播放避免回声：wx.setInnerAudioOption({speakerOn:false})", 3);
    }
    ;
    CLog("[" + tag + "]mg.start obj", obj);
    mg.start(obj);
  };
  var recOnShow = function() {
    if (curMg && curMg.__pause) {
      CLog("mg onShow 录音开始恢复...", 3);
      curMg.resume();
    }
  };
  var recStart = function(success, fail) {
    clearCurMg();
    initSys();
    devWebMInfo = {};
    if (isDev) {
      CLog("RecorderManager.onFrameRecorded 在开发工具中测试返回的是webm格式音频，将会尝试进行解码。开发工具中录音偶尔会非常卡，建议使用真机测试（各种奇奇怪怪的毛病就都正常了）", 3);
    }
    var startIsEnd = false, startCount = 1;
    var startEnd = function(err) {
      if (startIsEnd)
        return;
      startIsEnd = true;
      if (err) {
        clearCurMg();
        fail(err);
      } else {
        success();
      }
      ;
    };
    var mg = curMg = wx.getRecorderManager();
    mg.onInterruptionEnd(function() {
      if (mg != curMg)
        return;
      CLog("mg onInterruptionEnd 录音开始恢复...", 3);
      mg.resume();
    });
    mg.onPause(function() {
      if (mg != curMg)
        return;
      mg.__pause = Date.now();
      CLog("mg onPause 录音被打断", 3);
    });
    mg.onResume(function() {
      if (mg != curMg)
        return;
      var t = mg.__pause ? Date.now() - mg.__pause : 0, t2 = 0;
      mg.__pause = 0;
      if (t > 300) {
        t2 = Math.min(1e3, t);
        onRecFn(new Int16Array(48e3 / 1e3 * t2), 48e3);
      }
      CLog("mg onResume 恢复录音，填充了" + t2 + "ms静默", 3);
    });
    mg.onError(function(res) {
      if (mg != curMg)
        return;
      var msg = res.errMsg, tag = "mg onError 开始录音出错：";
      if (!startIsEnd && !mg._srt && /fail.+is.+recording/i.test(msg)) {
        var st2 = 600 - (Date.now() - mgStime);
        if (st2 > 0) {
          st2 = Math.max(100, st2);
          CLog(tag + "等待" + st2 + "ms重试", 3, res);
          setTimeout(function() {
            if (mg != curMg)
              return;
            mg._srt = 1;
            CLog(tag + "正在重试", 3);
            newStart("retry start", mg);
          }, st2);
          return;
        }
        ;
      }
      ;
      CLog(startCount > 1 ? tag + "可能无法继续录音[" + startCount + "]。" + msg : tag + msg + "。" + UserPermissionMsg, 1, res);
      startEnd("开始录音出错：" + msg);
    });
    mg.onStart(function() {
      if (mg != curMg)
        return;
      CLog("mg onStart 已开始录音");
      mg._srt = 0;
      mg._st = Date.now();
      startEnd();
    });
    mg.onStop(function(res) {
      CLog("mg onStop 请勿尝试使用此原始结果中的文件路径（此原始文件的格式、采样率等和录音配置不相同）；如需本地文件：可在RecordApp.Stop回调中将得到的ArrayBuffer（二进制音频数据）用RecordApp.MiniProgramWx_WriteLocalFile接口保存到本地，即可得到有效路径。res:", res);
      if (mg != curMg)
        return;
      if (!mg._st || Date.now() - mg._st < 600) {
        CLog("mg onStop但已忽略", 3);
        return;
      }
      CLog("mg onStop 已停止录音，正在重新开始录音...");
      startCount++;
      mg._st = 0;
      newStart("restart", mg);
    });
    var start0 = function() {
      mg.onFrameRecorded(function(res) {
        if (mg != curMg)
          return;
        if (!startIsEnd)
          CLog("mg onStart未触发，但收到了onFrameRecorded", 3);
        startEnd();
        var aBuf = res.frameBuffer;
        if (!aBuf || !aBuf.byteLength) {
          return;
        }
        if (isDev) {
          devWebmDecode(new Uint8Array(aBuf));
        } else {
          onRecFn(new Int16Array(aBuf), 48e3);
        }
        ;
      });
      newStart("start", mg);
    };
    var st = 600 - (Date.now() - mgStime);
    if (st > 0) {
      st = Math.max(100, st);
      CLog("mg.start距stop太近需等待" + st + "ms", 3);
      setTimeout(function() {
        if (mg != curMg)
          return;
        start0();
      }, st);
    } else {
      start0();
    }
    ;
  };
  App.MiniProgramWx_WriteLocalFile = function(fileName, buffer, True, False) {
    var set = fileName;
    if (typeof set == "string")
      set = { fileName };
    fileName = set.fileName;
    var append = set.append;
    var seek_ = set.seekOffset, seek = +seek_ || 0;
    if (!seek_ && seek_ !== 0)
      seek = -1;
    var EnvUsr = wx.env.USER_DATA_PATH, savePath = fileName;
    if (fileName.indexOf(EnvUsr) == -1)
      savePath = EnvUsr + "/" + fileName;
    var tasks = writeTasks[savePath] = writeTasks[savePath] || [];
    var tk0 = tasks[0], tk = { a: set, b: buffer, c: True, d: False };
    if (tk0 && tk0._r) {
      CLog("wx文件等待写入" + savePath, 3);
      set._tk = 1;
      tasks.push(tk);
      return;
    }
    if (set._tk)
      CLog("wx文件继续写入" + savePath);
    tasks.splice(0, 0, tk);
    tk._r = 1;
    var mg = wx.getFileSystemManager(), fd = 0;
    var endCall = function() {
      if (fd)
        mg.close({ fd });
      setTimeout(function() {
        tasks.shift();
        var tk2 = tasks.shift();
        if (tk2) {
          App.MiniProgramWx_WriteLocalFile(tk2.a, tk2.b, tk2.c, tk2.d);
        }
      });
    };
    var okCall = function() {
      endCall();
      True && True(savePath);
    };
    var failCall = function(e) {
      endCall();
      var msg = e.errMsg || "-";
      CLog("wx文件" + savePath + "写入出错：" + msg, 1);
      False && False(msg);
    };
    if (seek > -1 || append) {
      mg.open({
        filePath: savePath,
        flag: seek > -1 ? "r+" : "a",
        success: function(res) {
          fd = res.fd;
          var opt = { fd, data: buffer, success: okCall, fail: failCall };
          if (seek > -1)
            opt.position = seek;
          mg.write(opt);
        },
        fail: failCall
      });
    } else {
      mg.writeFile({
        filePath: savePath,
        encoding: "binary",
        data: buffer,
        success: okCall,
        fail: failCall
      });
    }
  };
  var writeTasks = {};
  App.MiniProgramWx_DeleteLocalFile = function(savePath, True, False) {
    wx.getFileSystemManager().unlink({
      filePath: savePath,
      success: function() {
        True && True();
      },
      fail: function(e) {
        False && False(e.errMsg || "-");
      }
    });
  };
  var isDev, sys;
  var initSys = function() {
    if (sys)
      return;
    sys = wx.getSystemInfoSync();
    isDev = sys.platform == "devtools" ? 1 : 0;
    if (isDev) {
      devWebCtx = wx.createWebAudioContext();
    }
  };
  var devWebCtx, devWebMInfo;
  var devWebmDecode = function(inBytes) {
    var scope = devWebMInfo;
    if (!scope.pos) {
      scope.pos = [0];
      scope.tracks = {};
      scope.bytes = [];
    }
    ;
    var tracks = scope.tracks, position = [scope.pos[0]];
    var endPos = function() {
      scope.pos[0] = position[0];
    };
    var sBL = scope.bytes.length;
    var bytes = new Uint8Array(sBL + inBytes.length);
    bytes.set(scope.bytes);
    bytes.set(inBytes, sBL);
    scope.bytes = bytes;
    var returnPCM = function() {
      scope.bytes = [];
      onRecFn(new Int16Array(bytes), 48e3);
    };
    if (scope.isNotWebM) {
      returnPCM();
      return;
    }
    ;
    if (!scope._ht) {
      var headPos0 = 0;
      for (var i = 0; i < bytes.length; i++) {
        if (bytes[i] == 26 && bytes[i + 1] == 69 && bytes[i + 2] == 223 && bytes[i + 3] == 163) {
          headPos0 = i;
          position[0] = i + 4;
          break;
        }
      }
      if (!position[0]) {
        if (bytes.length > 5 * 1024) {
          CLog("未识别到WebM数据，开发工具可能已支持PCM", 3);
          scope.isNotWebM = true;
          returnPCM();
        }
        ;
        return;
      }
      readMatroskaBlock(bytes, position);
      if (!BytesEq(readMatroskaVInt(bytes, position), [24, 83, 128, 103])) {
        return;
      }
      readMatroskaVInt(bytes, position);
      while (position[0] < bytes.length) {
        var eid0 = readMatroskaVInt(bytes, position);
        var bytes0 = readMatroskaBlock(bytes, position);
        var pos0 = [0], audioIdx = 0;
        if (!bytes0)
          return;
        if (BytesEq(eid0, [22, 84, 174, 107])) {
          scope._ht = bytes.slice(headPos0, position[0]);
          CLog("WebM Tracks", tracks);
          endPos();
          break;
        }
      }
    }
    var datas = [], dataLen = 0;
    while (position[0] < bytes.length) {
      var p0 = position[0];
      var eid1 = readMatroskaVInt(bytes, position);
      var p1 = position[0];
      var bytes1 = readMatroskaBlock(bytes, position);
      if (!bytes1)
        break;
      if (BytesEq(eid1, [163])) {
        var arr = bytes.slice(p0, position[0]);
        dataLen += arr.length;
        datas.push(arr);
      }
      endPos();
    }
    if (!dataLen) {
      return;
    }
    var more = new Uint8Array(bytes.length - scope.pos[0]);
    more.set(bytes.subarray(scope.pos[0]));
    scope.bytes = more;
    scope.pos[0] = 0;
    var add = [31, 67, 182, 117, 1, 255, 255, 255, 255, 255, 255, 255];
    add.push(231, 129, 0);
    dataLen += add.length;
    datas.splice(0, 0, add);
    dataLen += scope._ht.length;
    datas.splice(0, 0, scope._ht);
    var u8arr = new Uint8Array(dataLen);
    for (var i = 0, i2 = 0; i < datas.length; i++) {
      u8arr.set(datas[i], i2);
      i2 += datas[i].length;
    }
    devWebCtx.decodeAudioData(u8arr.buffer, function(raw) {
      var src = raw.getChannelData(0);
      var pcm = new Int16Array(src.length);
      for (var i3 = 0; i3 < src.length; i3++) {
        var s = Math.max(-1, Math.min(1, src[i3]));
        s = s < 0 ? s * 32768 : s * 32767;
        pcm[i3] = s;
      }
      ;
      onRecFn(pcm, raw.sampleRate);
    }, function() {
      CLog("WebM解码失败", 1);
    });
  };
  var BytesEq = function(bytes1, bytes2) {
    if (!bytes1 || bytes1.length != bytes2.length)
      return false;
    if (bytes1.length == 1)
      return bytes1[0] == bytes2[0];
    for (var i = 0; i < bytes1.length; i++) {
      if (bytes1[i] != bytes2[i])
        return false;
    }
    return true;
  };
  var BytesInt = function(bytes) {
    var s = "";
    for (var i = 0; i < bytes.length; i++) {
      var n = bytes[i];
      s += (n < 16 ? "0" : "") + n.toString(16);
    }
    ;
    return parseInt(s, 16) || 0;
  };
  var readMatroskaVInt = function(arr, pos, trim) {
    var i = pos[0];
    if (i >= arr.length)
      return;
    var b0 = arr[i], b2 = ("0000000" + b0.toString(2)).substr(-8);
    var m = /^(0*1)(\d*)$/.exec(b2);
    if (!m)
      return;
    var len = m[1].length, val = [];
    if (i + len > arr.length)
      return;
    for (var i2 = 0; i2 < len; i2++) {
      val[i2] = arr[i];
      i++;
    }
    if (trim)
      val[0] = parseInt(m[2] || "0", 2);
    pos[0] = i;
    return val;
  };
  var readMatroskaBlock = function(arr, pos) {
    var lenVal = readMatroskaVInt(arr, pos, 1);
    if (!lenVal)
      return;
    var len = BytesInt(lenVal);
    var i = pos[0], val = [];
    if (len < 2147483647) {
      if (i + len > arr.length)
        return;
      for (var i2 = 0; i2 < len; i2++) {
        val[i2] = arr[i];
        i++;
      }
    }
    pos[0] = i;
    return val;
  };
});
//# sourceMappingURL=recorder-core_src_app-support_app-miniProgram-wx-support__js.js.map
