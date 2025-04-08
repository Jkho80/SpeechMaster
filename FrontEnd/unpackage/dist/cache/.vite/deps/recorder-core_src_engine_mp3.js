// ../../../XMU/Sem4/计算机大赛/FrontEnd/node_modules/recorder-core/src/engine/mp3.js
(function(factory) {
  var browser = typeof window == "object" && !!window.document;
  var win = browser ? window : Object;
  var rec = win.Recorder, ni = rec.i18n;
  factory(rec, ni, ni.$T, browser);
})(function(Recorder, i18n, $T, isBrowser) {
  "use strict";
  var SampleS = "48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000";
  var BitS = "8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 192, 224, 256, 320";
  Recorder.prototype.enc_mp3 = {
    stable: true,
    takeEC: "full",
    getTestMsg: function() {
      return $T("Zm7L::采样率范围：{1}；比特率范围：{2}（不同比特率支持的采样率范围不同，小于32kbps时采样率需小于32000）", 0, SampleS, BitS);
    }
  };
  var NormalizeSet = function(set) {
    var bS = set.bitRate, sS = set.sampleRate, s = sS;
    if ((" " + BitS + ",").indexOf(" " + bS + ",") == -1) {
      Recorder.CLog($T("eGB9::{1}不在mp3支持的取值范围：{2}", 0, "bitRate=" + bS, BitS), 3);
    }
    if ((" " + SampleS + ",").indexOf(" " + sS + ",") == -1) {
      var arr = SampleS.split(", "), vs = [];
      for (var i = 0; i < arr.length; i++)
        vs.push({ v: +arr[i], s: Math.abs(arr[i] - sS) });
      vs.sort(function(a, b) {
        return a.s - b.s;
      });
      s = vs[0].v;
      set.sampleRate = s;
      Recorder.CLog($T("zLTa::sampleRate已更新为{1}，因为{2}不在mp3支持的取值范围：{3}", 0, s, sS, SampleS), 3);
    }
  };
  var ImportEngineErr = function() {
    return $T.G("NeedImport-2", ["mp3.js", "src/engine/mp3-engine.js"]);
  };
  var HasWebWorker = isBrowser && typeof Worker == "function";
  Recorder.prototype.mp3 = function(res, True, False) {
    var This = this, set = This.set, size = res.length;
    if (!Recorder.lamejs) {
      False(ImportEngineErr());
      return;
    }
    ;
    if (HasWebWorker) {
      var ctx = This.mp3_start(set);
      if (ctx) {
        if (ctx.isW) {
          This.mp3_encode(ctx, res);
          This.mp3_complete(ctx, True, False, 1);
          return;
        }
        This.mp3_stop(ctx);
      }
      ;
    }
    ;
    NormalizeSet(set);
    var mp3 = new Recorder.lamejs.Mp3Encoder(1, set.sampleRate, set.bitRate);
    var blockSize = 57600;
    var memory = new Int8Array(5e5), mOffset = 0;
    var idx = 0, isFlush = 0;
    var run = function() {
      try {
        if (idx < size) {
          var buf = mp3.encodeBuffer(res.subarray(idx, idx + blockSize));
        } else {
          isFlush = 1;
          var buf = mp3.flush();
        }
        ;
      } catch (e) {
        console.error(e);
        if (!isFlush)
          try {
            mp3.flush();
          } catch (r) {
            console.error(r);
          }
        False("MP3 Encoder: " + e.message);
        return;
      }
      ;
      var bufLen = buf.length;
      if (bufLen > 0) {
        if (mOffset + bufLen > memory.length) {
          var tmp = new Int8Array(memory.length + Math.max(5e5, bufLen));
          tmp.set(memory.subarray(0, mOffset));
          memory = tmp;
        }
        memory.set(buf, mOffset);
        mOffset += bufLen;
      }
      ;
      if (idx < size) {
        idx += blockSize;
        setTimeout(run);
      } else {
        var data = [memory.buffer.slice(0, mOffset)];
        var meta = mp3TrimFix.fn(data, mOffset, size, set.sampleRate);
        mp3TrimFixSetMeta(meta, set);
        True(data[0] || new ArrayBuffer(0), "audio/mp3");
      }
      ;
    };
    run();
  };
  var mp3Worker;
  Recorder.BindDestroy("mp3Worker", function() {
    if (mp3Worker) {
      Recorder.CLog("mp3Worker Destroy");
      mp3Worker.terminate();
      mp3Worker = null;
    }
    ;
  });
  Recorder.prototype.mp3_envCheck = function(envInfo, set) {
    var errMsg = "";
    if (set.takeoffEncodeChunk) {
      if (!newContext()) {
        errMsg = $T("yhUs::当前浏览器版本太低，无法实时处理");
      }
      ;
    }
    ;
    if (!errMsg && !Recorder.lamejs) {
      errMsg = ImportEngineErr();
    }
    ;
    return errMsg;
  };
  Recorder.prototype.mp3_start = function(set) {
    return newContext(set);
  };
  var openList = { id: 0 };
  var newContext = function(setOrNull, _badW) {
    var run = function(e) {
      var ed = e.data;
      var wk_ctxs = scope.wkScope.wk_ctxs;
      var wk_lame = scope.wkScope.wk_lame;
      var wk_mp3TrimFix = scope.wkScope.wk_mp3TrimFix;
      var cur = wk_ctxs[ed.id];
      if (ed.action == "init") {
        wk_ctxs[ed.id] = {
          sampleRate: ed.sampleRate,
          bitRate: ed.bitRate,
          takeoff: ed.takeoff,
          pcmSize: 0,
          memory: new Int8Array(5e5),
          mOffset: 0,
          encObj: new wk_lame.Mp3Encoder(1, ed.sampleRate, ed.bitRate)
        };
      } else if (!cur) {
        return;
      }
      ;
      var addBytes = function(buf2) {
        var bufLen = buf2.length;
        if (cur.mOffset + bufLen > cur.memory.length) {
          var tmp = new Int8Array(cur.memory.length + Math.max(5e5, bufLen));
          tmp.set(cur.memory.subarray(0, cur.mOffset));
          cur.memory = tmp;
        }
        cur.memory.set(buf2, cur.mOffset);
        cur.mOffset += bufLen;
      };
      switch (ed.action) {
        case "stop":
          if (!cur.isCp)
            try {
              cur.encObj.flush();
            } catch (e2) {
              console.error(e2);
            }
          cur.encObj = null;
          delete wk_ctxs[ed.id];
          break;
        case "encode":
          if (cur.isCp)
            break;
          cur.pcmSize += ed.pcm.length;
          try {
            var buf = cur.encObj.encodeBuffer(ed.pcm);
          } catch (e2) {
            cur.err = e2;
            console.error(e2);
          }
          ;
          if (buf && buf.length > 0) {
            if (cur.takeoff) {
              worker.onmessage({ action: "takeoff", id: ed.id, chunk: buf });
            } else {
              addBytes(buf);
            }
            ;
          }
          ;
          break;
        case "complete":
          cur.isCp = 1;
          try {
            var buf = cur.encObj.flush();
          } catch (e2) {
            cur.err = e2;
            console.error(e2);
          }
          ;
          if (buf && buf.length > 0) {
            if (cur.takeoff) {
              worker.onmessage({ action: "takeoff", id: ed.id, chunk: buf });
            } else {
              addBytes(buf);
            }
            ;
          }
          ;
          if (cur.err) {
            worker.onmessage({
              action: ed.action,
              id: ed.id,
              err: "MP3 Encoder: " + cur.err.message
            });
            break;
          }
          ;
          var data = [cur.memory.buffer.slice(0, cur.mOffset)];
          var meta = wk_mp3TrimFix.fn(data, cur.mOffset, cur.pcmSize, cur.sampleRate);
          worker.onmessage({
            action: ed.action,
            id: ed.id,
            blob: data[0] || new ArrayBuffer(0),
            meta
          });
          break;
      }
      ;
    };
    var initOnMsg = function(isW) {
      worker.onmessage = function(e) {
        var data = e;
        if (isW)
          data = e.data;
        var ctx2 = openList[data.id];
        if (ctx2) {
          if (data.action == "takeoff") {
            ctx2.set.takeoffEncodeChunk(new Uint8Array(data.chunk.buffer));
          } else {
            ctx2.call && ctx2.call(data);
            ctx2.call = null;
          }
          ;
        }
        ;
      };
    };
    var initCtx = function() {
      var ctx2 = { worker, set: setOrNull };
      if (setOrNull) {
        ctx2.id = ++openList.id;
        openList[ctx2.id] = ctx2;
        NormalizeSet(setOrNull);
        worker.postMessage({
          action: "init",
          id: ctx2.id,
          sampleRate: setOrNull.sampleRate,
          bitRate: setOrNull.bitRate,
          takeoff: !!setOrNull.takeoffEncodeChunk,
          x: new Int16Array(5)
          //低版本浏览器不支持序列化TypedArray
        });
      } else {
        worker.postMessage({
          x: new Int16Array(5)
          //低版本浏览器不支持序列化TypedArray
        });
      }
      ;
      return ctx2;
    };
    var scope, worker = mp3Worker;
    if (_badW || !HasWebWorker) {
      Recorder.CLog($T("k9PT::当前环境不支持Web Worker，mp3实时编码器运行在主线程中"), 3);
      worker = { postMessage: function(ed) {
        run({ data: ed });
      } };
      scope = { wkScope: {
        wk_ctxs: {},
        wk_lame: Recorder.lamejs,
        wk_mp3TrimFix: mp3TrimFix
      } };
      initOnMsg();
      return initCtx();
    }
    ;
    try {
      if (!worker) {
        var onmsg = (run + "").replace(/[\w\$]+\.onmessage/g, "self.postMessage");
        onmsg = onmsg.replace(/[\w\$]+\.wkScope/g, "wkScope");
        var jsCode = ");wk_lame();self.onmessage=" + onmsg;
        jsCode += ";var wkScope={ wk_ctxs:{},wk_lame:wk_lame";
        jsCode += ",wk_mp3TrimFix:{rm:" + mp3TrimFix.rm + ",fn:" + mp3TrimFix.fn + "} }";
        var lamejsCode = Recorder.lamejs.toString();
        var url = (window.URL || webkitURL).createObjectURL(new Blob(["var wk_lame=(", lamejsCode, jsCode], { type: "text/javascript" }));
        worker = new Worker(url);
        setTimeout(function() {
          (window.URL || webkitURL).revokeObjectURL(url);
        }, 1e4);
        initOnMsg(1);
      }
      ;
      var ctx = initCtx();
      ctx.isW = 1;
      mp3Worker = worker;
      return ctx;
    } catch (e) {
      worker && worker.terminate();
      console.error(e);
      return newContext(setOrNull, 1);
    }
    ;
  };
  Recorder.prototype.mp3_stop = function(startCtx) {
    if (startCtx && startCtx.worker) {
      startCtx.worker.postMessage({
        action: "stop",
        id: startCtx.id
      });
      startCtx.worker = null;
      delete openList[startCtx.id];
      var opens = -1;
      for (var k in openList) {
        opens++;
      }
      ;
      if (opens) {
        Recorder.CLog($T("fT6M::mp3 worker剩{1}个未stop", 0, opens), 3);
      }
      ;
    }
    ;
  };
  Recorder.prototype.mp3_encode = function(startCtx, pcm) {
    if (startCtx && startCtx.worker) {
      startCtx.worker.postMessage({
        action: "encode",
        id: startCtx.id,
        pcm
      });
    }
    ;
  };
  Recorder.prototype.mp3_complete = function(startCtx, True, False, autoStop) {
    var This = this;
    if (startCtx && startCtx.worker) {
      startCtx.call = function(data) {
        if (autoStop) {
          This.mp3_stop(startCtx);
        }
        ;
        if (data.err) {
          False(data.err);
        } else {
          mp3TrimFixSetMeta(data.meta, startCtx.set);
          True(data.blob, "audio/mp3");
        }
        ;
      };
      startCtx.worker.postMessage({
        action: "complete",
        id: startCtx.id
      });
    } else {
      False($T("mPxH::mp3编码器未start"));
    }
    ;
  };
  Recorder.mp3ReadMeta = function(mp3Buffers, length) {
    var parseInt_ES3 = typeof window != "undefined" && window.parseInt || typeof self != "undefined" && self.parseInt || parseInt;
    var u8arr0 = new Uint8Array(mp3Buffers[0] || []);
    if (u8arr0.length < 4) {
      return null;
    }
    ;
    var byteAt = function(idx2, u8) {
      return ("0000000" + ((u8 || u8arr0)[idx2] || 0).toString(2)).substr(-8);
    };
    var b2 = byteAt(0) + byteAt(1);
    var b4 = byteAt(2) + byteAt(3);
    if (!/^1{11}/.test(b2)) {
      return null;
    }
    ;
    var version = { "00": 2.5, "10": 2, "11": 1 }[b2.substr(11, 2)];
    var layer = { "01": 3 }[b2.substr(13, 2)];
    var sampleRate = {
      //lamejs -> Tables.samplerate_table
      "1": [44100, 48e3, 32e3],
      "2": [22050, 24e3, 16e3],
      "2.5": [11025, 12e3, 8e3]
    }[version];
    sampleRate && (sampleRate = sampleRate[parseInt_ES3(b4.substr(4, 2), 2)]);
    var bitRate = [
      //lamejs -> Tables.bitrate_table
      [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
      [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
      //MPEG 1
    ][version == 1 ? 1 : 0][parseInt_ES3(b4.substr(0, 4), 2)];
    if (!version || !layer || !bitRate || !sampleRate) {
      return null;
    }
    ;
    var duration = Math.round(length * 8 / bitRate);
    var frame = layer == 1 ? 384 : layer == 2 ? 1152 : version == 1 ? 1152 : 576;
    var frameDurationFloat = frame / sampleRate * 1e3;
    var frameSize = Math.floor(frame * bitRate / 8 / sampleRate * 1e3);
    var hasPadding = 0, seek = 0;
    for (var i = 0; i < mp3Buffers.length; i++) {
      var buf = mp3Buffers[i];
      seek += buf.byteLength;
      if (seek >= frameSize + 3) {
        var buf8 = new Uint8Array(buf);
        var idx = buf.byteLength - (seek - (frameSize + 3) + 1);
        var ib4 = byteAt(idx, buf8);
        hasPadding = ib4.charAt(6) == "1";
        break;
      }
      ;
    }
    ;
    if (hasPadding) {
      frameSize++;
    }
    ;
    return {
      version,
      layer,
      sampleRate,
      bitRate,
      duration,
      size: length,
      hasPadding,
      frameSize,
      frameDurationFloat
      //每帧时长，含小数 ms
    };
  };
  var mp3TrimFix = {
    //minfiy keep name
    rm: Recorder.mp3ReadMeta,
    fn: function(mp3Buffers, length, pcmLength, pcmSampleRate) {
      var meta = this.rm(mp3Buffers, length);
      if (!meta) {
        return { size: length, err: "mp3 unknown format" };
      }
      ;
      var pcmDuration = Math.round(pcmLength / pcmSampleRate * 1e3);
      var num = Math.floor((meta.duration - pcmDuration) / meta.frameDurationFloat);
      if (num > 0) {
        var size = num * meta.frameSize - (meta.hasPadding ? 1 : 0);
        length -= size;
        var arr0 = 0, arrs = [];
        for (var i = 0; i < mp3Buffers.length; i++) {
          var arr = mp3Buffers[i];
          if (size <= 0) {
            break;
          }
          ;
          if (size >= arr.byteLength) {
            size -= arr.byteLength;
            arrs.push(arr);
            mp3Buffers.splice(i, 1);
            i--;
          } else {
            mp3Buffers[i] = arr.slice(size);
            arr0 = arr;
            size = 0;
          }
          ;
        }
        ;
        var checkMeta = this.rm(mp3Buffers, length);
        if (!checkMeta) {
          arr0 && (mp3Buffers[0] = arr0);
          for (var i = 0; i < arrs.length; i++) {
            mp3Buffers.splice(i, 0, arrs[i]);
          }
          ;
          meta.err = "mp3 fix error: 已还原，错误原因不明";
        }
        ;
        var fix = meta.trimFix = {};
        fix.remove = num;
        fix.removeDuration = Math.round(num * meta.frameDurationFloat);
        fix.duration = Math.round(length * 8 / meta.bitRate);
      }
      ;
      return meta;
    }
  };
  var mp3TrimFixSetMeta = function(meta, set) {
    var tag = "MP3 Info: ";
    if (meta.sampleRate && meta.sampleRate != set.sampleRate || meta.bitRate && meta.bitRate != set.bitRate) {
      Recorder.CLog(tag + $T("uY9i::和设置的不匹配{1}，已更新成{2}", 0, "set:" + set.bitRate + "kbps " + set.sampleRate + "hz", "set:" + meta.bitRate + "kbps " + meta.sampleRate + "hz"), 3, set);
      set.sampleRate = meta.sampleRate;
      set.bitRate = meta.bitRate;
    }
    ;
    var trimFix = meta.trimFix;
    if (trimFix) {
      tag += $T("iMSm::Fix移除{1}帧", 0, trimFix.remove) + " " + trimFix.removeDuration + "ms -> " + trimFix.duration + "ms";
      if (trimFix.remove > 2) {
        meta.err = (meta.err ? meta.err + ", " : "") + $T("b9zm::移除帧数过多");
      }
      ;
    } else {
      tag += (meta.duration || "-") + "ms";
    }
    ;
    if (meta.err) {
      Recorder.CLog(tag, meta.size ? 1 : 0, meta.err, meta);
    } else {
      Recorder.CLog(tag, meta);
    }
    ;
  };
});
//# sourceMappingURL=recorder-core_src_engine_mp3.js.map
