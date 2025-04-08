import {
  __commonJS
} from "./chunk-Y2F7D3TJ.js";

// ../../../XMU/Sem4/计算机大赛/FrontEnd/node_modules/recorder-core/src/recorder-core.js
var require_recorder_core = __commonJS({
  "../../../XMU/Sem4/计算机大赛/FrontEnd/node_modules/recorder-core/src/recorder-core.js"(exports, module) {
    (function(factory) {
      var browser = typeof window == "object" && !!window.document;
      var win = browser ? window : Object;
      factory(win, browser);
      if (typeof define == "function" && define.amd) {
        define(function() {
          return win.Recorder;
        });
      }
      ;
      if (typeof module == "object" && module.exports) {
        module.exports = win.Recorder;
      }
      ;
    })(function(Export, isBrowser) {
      "use strict";
      var NOOP = function() {
      };
      var IsNum = function(v) {
        return typeof v == "number";
      };
      var ToJson = function(v) {
        return JSON.stringify(v);
      };
      var Recorder = function(set) {
        return new initFn(set);
      };
      var LM = Recorder.LM = "2025-01-11 09:28";
      var GitUrl = "https://github.com/xiangyuecn/Recorder";
      var RecTxt = "Recorder";
      var getUserMediaTxt = "getUserMedia";
      var srcSampleRateTxt = "srcSampleRate";
      var sampleRateTxt = "sampleRate";
      var bitRateTxt = "bitRate";
      var CatchTxt = "catch";
      var WRec2 = Export[RecTxt];
      if (WRec2 && WRec2.LM == LM) {
        WRec2.CLog(WRec2.i18n.$T("K8zP::重复导入{1}", 0, RecTxt), 3);
        return;
      }
      ;
      Recorder.IsOpen = function() {
        var stream = Recorder.Stream;
        if (stream) {
          var tracks = Tracks_(stream), track = tracks[0];
          if (track) {
            var state = track.readyState;
            return state == "live" || state == track.LIVE;
          }
          ;
        }
        ;
        return false;
      };
      Recorder.BufferSize = 4096;
      Recorder.Destroy = function() {
        CLog(RecTxt + " Destroy");
        Disconnect();
        for (var k in DestroyList) {
          DestroyList[k]();
        }
        ;
      };
      var DestroyList = {};
      Recorder.BindDestroy = function(key, call) {
        DestroyList[key] = call;
      };
      Recorder.Support = function() {
        if (!isBrowser)
          return false;
        var scope = navigator.mediaDevices || {};
        if (!scope[getUserMediaTxt]) {
          scope = navigator;
          scope[getUserMediaTxt] || (scope[getUserMediaTxt] = scope.webkitGetUserMedia || scope.mozGetUserMedia || scope.msGetUserMedia);
        }
        ;
        if (!scope[getUserMediaTxt]) {
          return false;
        }
        ;
        Recorder.Scope = scope;
        if (!Recorder.GetContext()) {
          return false;
        }
        ;
        return true;
      };
      Recorder.GetContext = function(tryNew) {
        if (!isBrowser)
          return null;
        var AC = window.AudioContext;
        if (!AC) {
          AC = window.webkitAudioContext;
        }
        ;
        if (!AC) {
          return null;
        }
        ;
        var ctx = Recorder.Ctx, isNew = 0;
        if (!ctx) {
          ctx = Recorder.Ctx = new AC();
          isNew = 1;
          Recorder.NewCtxs = Recorder.NewCtxs || [];
          Recorder.BindDestroy("Ctx", function() {
            var ctx2 = Recorder.Ctx;
            if (ctx2 && ctx2.close) {
              CloseCtx(ctx2);
              Recorder.Ctx = 0;
            }
            ;
            var arr = Recorder.NewCtxs;
            Recorder.NewCtxs = [];
            for (var i = 0; i < arr.length; i++)
              CloseCtx(arr[i]);
          });
        }
        ;
        if (tryNew && ctx.close) {
          if (!isNew) {
            if (!ctx._useC)
              CloseCtx(ctx);
            ctx = new AC();
          }
          ;
          ctx._useC = 1;
          Recorder.NewCtxs.push(ctx);
        }
        ;
        return ctx;
      };
      Recorder.CloseNewCtx = function(ctx) {
        if (ctx && ctx.close) {
          CloseCtx(ctx);
          var arr = Recorder.NewCtxs || [], L = arr.length;
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] == ctx) {
              arr.splice(i, 1);
              break;
            }
          }
          CLog($T("mSxV::剩{1}个GetContext未close", 0, L + "-1=" + arr.length), arr.length ? 3 : 0);
        }
      };
      var CloseCtx = function(ctx) {
        if (ctx && ctx.close && !ctx._isC) {
          ctx._isC = 1;
          if (ctx.state != "closed") {
            try {
              ctx.close();
            } catch (e) {
              CLog("ctx close err", 1, e);
            }
          }
        }
      };
      var ResumeCtx = Recorder.ResumeCtx = function(ctx, check, True, False) {
        var isEnd = 0, isBind = 0, isLsSC = 0, runC = 0, EL = "EventListener", Tag = "ResumeCtx ";
        var end = function(err, ok) {
          if (isBind) {
            bind();
          }
          if (!isEnd) {
            isEnd = 1;
            err && False(err, runC);
            ok && True(runC);
          }
          if (ok) {
            if (!ctx._LsSC && ctx["add" + EL])
              ctx["add" + EL]("statechange", run);
            ctx._LsSC = 1;
            isLsSC = 1;
          }
        };
        var bind = function(add) {
          if (add && isBind)
            return;
          isBind = add ? 1 : 0;
          var types = ["focus", "mousedown", "mouseup", "touchstart", "touchend"];
          for (var i = 0; i < types.length; i++)
            window[(add ? "add" : "remove") + EL](types[i], run, true);
        };
        var run = function() {
          var sVal = ctx.state, spEnd = CtxSpEnd(sVal);
          if (!isEnd && !check(spEnd ? ++runC : runC))
            return end();
          if (spEnd) {
            if (isLsSC)
              CLog(Tag + "sc " + sVal, 3);
            bind(1);
            ctx.resume().then(function() {
              if (isLsSC)
                CLog(Tag + "sc " + ctx.state);
              end(0, 1);
            })[CatchTxt](function(e) {
              CLog(Tag + "error", 1, e);
              if (!CtxSpEnd(ctx.state)) {
                end(e.message || "error");
              }
            });
          } else if (sVal == "closed") {
            if (isLsSC && !ctx._isC)
              CLog(Tag + "sc " + sVal, 1);
            end("ctx closed");
          } else {
            end(0, 1);
          }
          ;
        };
        run();
      };
      var CtxSpEnd = Recorder.CtxSpEnd = function(v) {
        return v == "suspended" || v == "interrupted";
      };
      var CtxState = function(ctx) {
        var v = ctx.state, msg = "ctx.state=" + v;
        if (CtxSpEnd(v))
          msg += $T("nMIy::（注意：ctx不是running状态，rec.open和start至少要有一个在用户操作(触摸、点击等)时进行调用，否则将在rec.start时尝试进行ctx.resume，可能会产生兼容性问题(仅iOS)，请参阅文档中runningContext配置）");
        return msg;
      };
      var ConnectEnableWebM = "ConnectEnableWebM";
      Recorder[ConnectEnableWebM] = true;
      var ConnectEnableWorklet = "ConnectEnableWorklet";
      Recorder[ConnectEnableWorklet] = false;
      var Connect = function(streamStore) {
        var bufferSize = streamStore.BufferSize || Recorder.BufferSize;
        var stream = streamStore.Stream;
        var ctx = stream._c, ctxSR = ctx[sampleRateTxt], srChunk = {};
        var tracks = Tracks_(stream), track = tracks[0], trackSet = null, tsMsg = "";
        if (track && track.getSettings) {
          trackSet = track.getSettings();
          var trackSR = trackSet[sampleRateTxt];
          if (trackSR && trackSR != ctxSR) {
            tsMsg = $T("eS8i::Stream的采样率{1}不等于{2}，将进行采样率转换（注意：音质不会变好甚至可能变差），主要在移动端未禁用回声消除时会产生此现象，浏览器有回声消除时可能只会返回16k采样率的音频数据，", 0, trackSR, ctxSR);
          }
        }
        stream._ts = trackSet;
        CLog(tsMsg + "Stream TrackSet: " + ToJson(trackSet), tsMsg ? 3 : 0);
        var mediaConn = function(node) {
          var media = stream._m = ctx.createMediaStreamSource(stream);
          var ctxDest = ctx.destination, cmsdTxt = "createMediaStreamDestination";
          if (ctx[cmsdTxt]) {
            ctxDest = stream._d = ctx[cmsdTxt]();
          }
          ;
          media.connect(node);
          node.connect(ctxDest);
        };
        var isWebM, isWorklet, badInt, webMTips = "";
        var calls = stream._call;
        var onReceive = function(float32Arr, arrSR) {
          for (var k0 in calls) {
            if (arrSR != ctxSR) {
              srChunk.index = 0;
              srChunk = Recorder.SampleData([float32Arr], arrSR, ctxSR, srChunk, { _sum: 1 });
              var pcm = srChunk.data;
              var sum = srChunk._sum;
            } else {
              srChunk = {};
              var size = float32Arr.length;
              var pcm = new Int16Array(size);
              var sum = 0;
              for (var j = 0; j < size; j++) {
                var s = Math.max(-1, Math.min(1, float32Arr[j]));
                s = s < 0 ? s * 32768 : s * 32767;
                pcm[j] = s;
                sum += Math.abs(s);
              }
              ;
            }
            ;
            for (var k in calls) {
              calls[k](pcm, sum);
            }
            ;
            return;
          }
          ;
        };
        var scriptProcessor = "ScriptProcessor";
        var audioWorklet = "audioWorklet";
        var recAudioWorklet = RecTxt + " " + audioWorklet;
        var RecProc = "RecProc";
        var MediaRecorderTxt = "MediaRecorder";
        var MRWebMPCM = MediaRecorderTxt + ".WebM.PCM";
        var oldFn = ctx.createScriptProcessor || ctx.createJavaScriptNode;
        var oldIsBest = $T("ZGlf::。由于{1}内部1秒375次回调，在移动端可能会有性能问题导致回调丢失录音变短，PC端无影响，暂不建议开启{1}。", 0, audioWorklet);
        var oldScript = function() {
          isWorklet = stream.isWorklet = false;
          _Disconn_n(stream);
          CLog($T("7TU0::Connect采用老的{1}，", 0, scriptProcessor) + i18n.get(
            Recorder[ConnectEnableWorklet] ? $T("JwCL::但已设置{1}尝试启用{2}", 2) : $T("VGjB::可设置{1}尝试启用{2}", 2),
            [RecTxt + "." + ConnectEnableWorklet + "=true", audioWorklet]
          ) + webMTips + oldIsBest, 3);
          var process = stream._p = oldFn.call(ctx, bufferSize, 1, 1);
          mediaConn(process);
          process.onaudioprocess = function(e) {
            var arr = e.inputBuffer.getChannelData(0);
            onReceive(arr, ctxSR);
          };
        };
        var connWorklet = function() {
          isWebM = stream.isWebM = false;
          _Disconn_r(stream);
          isWorklet = stream.isWorklet = !oldFn || Recorder[ConnectEnableWorklet];
          var AwNode = window.AudioWorkletNode;
          if (!(isWorklet && ctx[audioWorklet] && AwNode)) {
            oldScript();
            return;
          }
          ;
          var clazzUrl = function() {
            var xf = function(f) {
              return f.toString().replace(/^function|DEL_/g, "").replace(/\$RA/g, recAudioWorklet);
            };
            var clazz = "class " + RecProc + " extends AudioWorkletProcessor{";
            clazz += "constructor " + xf(function(option) {
              DEL_super(option);
              var This = this, bufferSize2 = option.processorOptions.bufferSize;
              This.bufferSize = bufferSize2;
              This.buffer = new Float32Array(bufferSize2 * 2);
              This.pos = 0;
              This.port.onmessage = function(e) {
                if (e.data.kill) {
                  This.kill = true;
                  $C.log("$RA kill call");
                }
              };
              $C.log("$RA .ctor call", option);
            });
            clazz += "process " + xf(function(input, b, c) {
              var This = this, bufferSize2 = This.bufferSize;
              var buffer = This.buffer, pos = This.pos;
              input = (input[0] || [])[0] || [];
              if (input.length) {
                buffer.set(input, pos);
                pos += input.length;
                var len = ~~(pos / bufferSize2) * bufferSize2;
                if (len) {
                  this.port.postMessage({ val: buffer.slice(0, len) });
                  var more = buffer.subarray(len, pos);
                  buffer = new Float32Array(bufferSize2 * 2);
                  buffer.set(more);
                  pos = more.length;
                  This.buffer = buffer;
                }
                This.pos = pos;
              }
              return !This.kill;
            });
            clazz += '}try{registerProcessor("' + RecProc + '", ' + RecProc + ')}catch(e){$C.error("' + recAudioWorklet + ' Reg Error",e)}';
            clazz = clazz.replace(/\$C\./g, "console.");
            return "data:text/javascript;base64," + btoa(unescape(encodeURIComponent(clazz)));
          };
          var awNext = function() {
            return isWorklet && stream._na;
          };
          var nodeAlive = stream._na = function() {
            if (badInt !== "") {
              clearTimeout(badInt);
              badInt = setTimeout(function() {
                badInt = 0;
                if (awNext()) {
                  CLog($T("MxX1::{1}未返回任何音频，恢复使用{2}", 0, audioWorklet, scriptProcessor), 3);
                  oldFn && oldScript();
                }
                ;
              }, 500);
            }
            ;
          };
          var createNode = function() {
            if (!awNext())
              return;
            var node = stream._n = new AwNode(ctx, RecProc, {
              processorOptions: { bufferSize }
            });
            mediaConn(node);
            node.port.onmessage = function(e) {
              if (badInt) {
                clearTimeout(badInt);
                badInt = "";
              }
              ;
              if (awNext()) {
                onReceive(e.data.val, ctxSR);
              } else if (!isWorklet) {
                CLog($T("XUap::{1}多余回调", 0, audioWorklet), 3);
              }
              ;
            };
            CLog($T("yOta::Connect采用{1}，设置{2}可恢复老式{3}", 0, audioWorklet, RecTxt + "." + ConnectEnableWorklet + "=false", scriptProcessor) + webMTips + oldIsBest, 3);
          };
          var ctxOK = function() {
            if (!awNext())
              return;
            if (ctx[RecProc]) {
              createNode();
              return;
            }
            ;
            var url = clazzUrl();
            ctx[audioWorklet].addModule(url).then(function(e) {
              if (!awNext())
                return;
              ctx[RecProc] = 1;
              createNode();
              if (badInt) {
                nodeAlive();
              }
              ;
            })[CatchTxt](function(e) {
              CLog(audioWorklet + ".addModule Error", 1, e);
              awNext() && oldScript();
            });
          };
          ResumeCtx(ctx, function() {
            return awNext();
          }, ctxOK, ctxOK);
        };
        var connWebM = function() {
          var MR = window[MediaRecorderTxt];
          var onData = "ondataavailable";
          var webmType = "audio/webm; codecs=pcm";
          isWebM = stream.isWebM = Recorder[ConnectEnableWebM];
          var supportMR = MR && onData in MR.prototype && MR.isTypeSupported(webmType);
          webMTips = supportMR ? "" : $T("VwPd::（此浏览器不支持{1}）", 0, MRWebMPCM);
          if (!isWebM || !supportMR) {
            connWorklet();
            return;
          }
          var mrNext = function() {
            return isWebM && stream._ra;
          };
          stream._ra = function() {
            if (badInt !== "") {
              clearTimeout(badInt);
              badInt = setTimeout(function() {
                if (mrNext()) {
                  CLog($T("vHnb::{1}未返回任何音频，降级使用{2}", 0, MediaRecorderTxt, audioWorklet), 3);
                  connWorklet();
                }
                ;
              }, 500);
            }
            ;
          };
          var mrSet = Object.assign({ mimeType: webmType }, Recorder.ConnectWebMOptions);
          var mr = stream._r = new MR(stream, mrSet);
          var webmData = stream._rd = {};
          mr[onData] = function(e) {
            var reader = new FileReader();
            reader.onloadend = function() {
              if (mrNext()) {
                var f32arr = WebM_Extract(new Uint8Array(reader.result), webmData);
                if (!f32arr)
                  return;
                if (f32arr == -1) {
                  connWorklet();
                  return;
                }
                ;
                if (badInt) {
                  clearTimeout(badInt);
                  badInt = "";
                }
                ;
                onReceive(f32arr, webmData.webmSR);
              } else if (!isWebM) {
                CLog($T("O9P7::{1}多余回调", 0, MediaRecorderTxt), 3);
              }
              ;
            };
            reader.readAsArrayBuffer(e.data);
          };
          try {
            mr.start(~~(bufferSize / 48));
            CLog($T("LMEm::Connect采用{1}，设置{2}可恢复使用{3}或老式{4}", 0, MRWebMPCM, RecTxt + "." + ConnectEnableWebM + "=false", audioWorklet, scriptProcessor));
          } catch (e) {
            CLog("mr start err", 1, e);
            connWorklet();
          }
          ;
        };
        connWebM();
      };
      var ConnAlive = function(stream) {
        if (stream._na)
          stream._na();
        if (stream._ra)
          stream._ra();
      };
      var _Disconn_n = function(stream) {
        stream._na = null;
        if (stream._n) {
          stream._n.port.postMessage({ kill: true });
          stream._n.disconnect();
          stream._n = null;
        }
        ;
      };
      var _Disconn_r = function(stream) {
        stream._ra = null;
        if (stream._r) {
          try {
            stream._r.stop();
          } catch (e) {
            CLog("mr stop err", 1, e);
          }
          stream._r = null;
        }
        ;
      };
      var Disconnect = function(streamStore) {
        streamStore = streamStore || Recorder;
        var isGlobal = streamStore == Recorder;
        var stream = streamStore.Stream;
        if (stream) {
          if (stream._m) {
            stream._m.disconnect();
            stream._m = null;
          }
          ;
          if (!stream._RC && stream._c) {
            Recorder.CloseNewCtx(stream._c);
          }
          ;
          stream._RC = null;
          stream._c = null;
          if (stream._d) {
            StopS_(stream._d.stream);
            stream._d = null;
          }
          ;
          if (stream._p) {
            stream._p.disconnect();
            stream._p.onaudioprocess = stream._p = null;
          }
          ;
          _Disconn_n(stream);
          _Disconn_r(stream);
          if (isGlobal) {
            StopS_(stream);
          }
          ;
        }
        ;
        streamStore.Stream = 0;
      };
      var StopS_ = Recorder.StopS_ = function(stream) {
        var tracks = Tracks_(stream);
        for (var i = 0; i < tracks.length; i++) {
          var track = tracks[i];
          track.stop && track.stop();
        }
        ;
        stream.stop && stream.stop();
      };
      var Tracks_ = function(stream) {
        var arr1 = 0, arr2 = 0, arr = [];
        if (stream.getAudioTracks) {
          arr1 = stream.getAudioTracks();
          arr2 = stream.getVideoTracks();
        }
        if (!arr1) {
          arr1 = stream.audioTracks;
          arr2 = stream.videoTracks;
        }
        for (var i = 0, L = arr1 ? arr1.length : 0; i < L; i++)
          arr.push(arr1[i]);
        for (var i = 0, L = arr2 ? arr2.length : 0; i < L; i++)
          arr.push(arr2[i]);
        return arr;
      };
      Recorder.SampleData = function(pcmDatas, pcmSampleRate, newSampleRate, prevChunkInfo, option) {
        var Txt = "SampleData";
        prevChunkInfo || (prevChunkInfo = {});
        var index = prevChunkInfo.index || 0;
        var offset = prevChunkInfo.offset || 0;
        var raisePrev = prevChunkInfo.raisePrev || 0;
        var filter = prevChunkInfo.filter;
        if (filter && filter.fn && (filter.sr && filter.sr != pcmSampleRate || filter.srn && filter.srn != newSampleRate)) {
          filter = null;
          CLog($T("d48C::{1}的filter采样率变了，重设滤波", 0, Txt), 3);
        }
        ;
        if (!filter) {
          if (newSampleRate <= pcmSampleRate) {
            var freq = newSampleRate > pcmSampleRate * 3 / 4 ? 0 : newSampleRate / 2 * 3 / 4;
            filter = { fn: freq ? Recorder.IIRFilter(true, pcmSampleRate, freq) : 0 };
          } else {
            var freq = pcmSampleRate > newSampleRate * 3 / 4 ? 0 : pcmSampleRate / 2 * 3 / 4;
            filter = { fn: freq ? Recorder.IIRFilter(true, newSampleRate, freq) : 0 };
          }
          ;
        }
        ;
        filter.sr = pcmSampleRate;
        filter.srn = newSampleRate;
        var filterFn = filter.fn;
        var frameNext = prevChunkInfo.frameNext || [];
        option || (option = {});
        var frameSize = option.frameSize || 1;
        if (option.frameType) {
          frameSize = option.frameType == "mp3" ? 1152 : 1;
        }
        ;
        var useSum = option._sum, _sum = 0;
        var nLen = pcmDatas.length;
        if (index > nLen + 1) {
          CLog($T("tlbC::{1}似乎传入了未重置chunk {2}", 0, Txt, index + ">" + nLen), 3);
        }
        ;
        var size = 0;
        for (var i = index; i < nLen; i++) {
          size += pcmDatas[i].length;
        }
        ;
        var step = pcmSampleRate / newSampleRate;
        if (step > 1) {
          size = Math.max(0, size - Math.floor(offset));
          size = Math.floor(size / step);
        } else if (step < 1) {
          var raiseStep = 1 / step;
          size = Math.floor(size * raiseStep);
        }
        ;
        size += frameNext.length;
        var res = new Int16Array(size);
        var idx = 0;
        for (var i = 0; i < frameNext.length; i++) {
          res[idx] = frameNext[i];
          idx++;
        }
        ;
        for (; index < nLen; index++) {
          var o = pcmDatas[index], isF32 = o instanceof Float32Array;
          var i = offset, il = o.length;
          var F = filterFn && filterFn.Embed, F1 = 0, F2 = 0, Fx = 0, Fy = 0;
          if (step < 1) {
            var idx1 = idx + i, prev = raisePrev;
            for (var i0 = 0; i0 < il; i0++) {
              var oVal = o[i0];
              if (isF32) {
                oVal = Math.max(-1, Math.min(1, oVal));
                oVal = oVal < 0 ? oVal * 32768 : oVal * 32767;
              }
              var pos = Math.floor(idx1);
              idx1 += raiseStep;
              var end = Math.floor(idx1);
              var n = (oVal - prev) / (end - pos);
              for (var j = 1; pos < end; pos++, j++) {
                var s = Math.floor(prev + j * n);
                if (F) {
                  Fx = s;
                  Fy = F.b0 * Fx + F.b1 * F.x1 + F.b0 * F.x2 - F.a1 * F.y1 - F.a2 * F.y2;
                  F.x2 = F.x1;
                  F.x1 = Fx;
                  F.y2 = F.y1;
                  F.y1 = Fy;
                  s = Fy;
                } else {
                  s = filterFn ? filterFn(s) : s;
                }
                if (s > 32767)
                  s = 32767;
                else if (s < -32768)
                  s = -32768;
                if (useSum)
                  _sum += Math.abs(s);
                res[pos] = s;
                idx++;
              }
              ;
              prev = raisePrev = oVal;
              i += raiseStep;
            }
            offset = i % 1;
            continue;
          }
          ;
          for (var i0 = 0, i2 = 0; i0 < il; i0++, i2++) {
            if (i2 < il) {
              var oVal = o[i2];
              if (isF32) {
                oVal = Math.max(-1, Math.min(1, oVal));
                oVal = oVal < 0 ? oVal * 32768 : oVal * 32767;
              }
              if (F) {
                Fx = oVal;
                Fy = F.b0 * Fx + F.b1 * F.x1 + F.b0 * F.x2 - F.a1 * F.y1 - F.a2 * F.y2;
                F.x2 = F.x1;
                F.x1 = Fx;
                F.y2 = F.y1;
                F.y1 = Fy;
              } else {
                Fy = filterFn ? filterFn(oVal) : oVal;
              }
            }
            F1 = F2;
            F2 = Fy;
            if (i2 == 0) {
              i0--;
              continue;
            }
            var before = Math.floor(i);
            if (i0 != before)
              continue;
            var after = Math.ceil(i);
            var atPoint = i - before;
            var beforeVal = F1;
            var afterVal = after < il ? F2 : beforeVal;
            var val = beforeVal + (afterVal - beforeVal) * atPoint;
            if (val > 32767)
              val = 32767;
            else if (val < -32768)
              val = -32768;
            if (useSum)
              _sum += Math.abs(val);
            res[idx] = val;
            idx++;
            i += step;
          }
          ;
          offset = Math.max(0, i - il);
        }
        ;
        if (step < 1 && idx + 1 == size) {
          size--;
          res = new Int16Array(res.buffer.slice(0, size * 2));
        }
        ;
        if (idx - 1 != size && idx != size)
          CLog(Txt + " idx:" + idx + " != size:" + size, 3);
        frameNext = null;
        var frameNextSize = size % frameSize;
        if (frameNextSize > 0) {
          var u8Pos = (size - frameNextSize) * 2;
          frameNext = new Int16Array(res.buffer.slice(u8Pos));
          res = new Int16Array(res.buffer.slice(0, u8Pos));
        }
        ;
        var obj = {
          index,
          offset,
          raisePrev,
          filter,
          frameNext,
          sampleRate: newSampleRate,
          data: res
        };
        if (useSum)
          obj._sum = _sum;
        return obj;
      };
      Recorder.IIRFilter = function(useLowPass, sampleRate, freq) {
        var ov = 2 * Math.PI * freq / sampleRate;
        var sn = Math.sin(ov);
        var cs = Math.cos(ov);
        var alpha = sn / 2;
        var a0 = 1 + alpha;
        var a1 = -2 * cs / a0;
        var a2 = (1 - alpha) / a0;
        if (useLowPass) {
          var b0 = (1 - cs) / 2 / a0;
          var b1 = (1 - cs) / a0;
        } else {
          var b0 = (1 + cs) / 2 / a0;
          var b1 = -(1 + cs) / a0;
        }
        var x1 = 0, x2 = 0, y = 0, y1 = 0, y2 = 0;
        var fn = function(x) {
          y = b0 * x + b1 * x1 + b0 * x2 - a1 * y1 - a2 * y2;
          x2 = x1;
          x1 = x;
          y2 = y1;
          y1 = y;
          return y;
        };
        fn.Embed = { x1: 0, x2: 0, y1: 0, y2: 0, b0, b1, a1, a2 };
        return fn;
      };
      Recorder.PowerLevel = function(pcmAbsSum, pcmLength) {
        var power = pcmAbsSum / pcmLength || 0;
        var level;
        if (power < 1251) {
          level = Math.round(power / 1250 * 10);
        } else {
          level = Math.round(Math.min(100, Math.max(0, (1 + Math.log(power / 1e4) / Math.log(10)) * 100)));
        }
        ;
        return level;
      };
      Recorder.PowerDBFS = function(maxSample) {
        var val = Math.max(0.1, maxSample || 0), Pref = 32767;
        val = Math.min(val, Pref);
        val = 20 * Math.log(val / Pref) / Math.log(10);
        return Math.max(-100, Math.round(val));
      };
      Recorder.CLog = function(msg, err) {
        if (typeof console != "object")
          return;
        var now = /* @__PURE__ */ new Date();
        var t = ("0" + now.getMinutes()).substr(-2) + ":" + ("0" + now.getSeconds()).substr(-2) + "." + ("00" + now.getMilliseconds()).substr(-3);
        var recID = this && this.envIn && this.envCheck && this.id;
        var arr = ["[" + t + " " + RecTxt + (recID ? ":" + recID : "") + "]" + msg];
        var a = arguments, cwe = Recorder.CLog;
        var i = 2, fn = cwe.log || console.log;
        if (IsNum(err)) {
          fn = err == 1 ? cwe.error || console.error : err == 3 ? cwe.warn || console.warn : fn;
        } else {
          i = 1;
        }
        ;
        for (; i < a.length; i++) {
          arr.push(a[i]);
        }
        ;
        if (IsLoser) {
          fn && fn("[IsLoser]" + arr[0], arr.length > 1 ? arr : "");
        } else {
          fn.apply(console, arr);
        }
        ;
      };
      var CLog = function() {
        Recorder.CLog.apply(this, arguments);
      };
      var IsLoser = true;
      try {
        IsLoser = !console.log.apply;
      } catch (e) {
      }
      ;
      var ID = 0;
      function initFn(set) {
        var This = this;
        This.id = ++ID;
        Traffic();
        var o = {
          type: "mp3",
          onProcess: NOOP
          //fn(buffers,powerLevel,bufferDuration,bufferSampleRate,newBufferIdx,asyncEnd) buffers=[[Int16,...],...]：缓冲的PCM数据，为从开始录音到现在的所有pcm片段；powerLevel：当前缓冲的音量级别0-100，bufferDuration：已缓冲时长，bufferSampleRate：缓冲使用的采样率（当type支持边录边转码(Worker)时，此采样率和设置的采样率相同，否则不一定相同）；newBufferIdx:本次回调新增的buffer起始索引；asyncEnd:fn() 如果onProcess是异步的(返回值为true时)，处理完成时需要调用此回调，如果不是异步的请忽略此参数，此方法回调时必须是真异步（不能真异步时需用setTimeout包裹）。onProcess返回值：如果返回true代表开启异步模式，在某些大量运算的场合异步是必须的，必须在异步处理完成时调用asyncEnd(不能真异步时需用setTimeout包裹)，在onProcess执行后新增的buffer会全部替换成空数组，因此本回调开头应立即将newBufferIdx到本次回调结尾位置的buffer全部保存到另外一个数组内，处理完成后写回buffers中本次回调的结尾位置。
          //*******高级设置******
          //,sourceStream:MediaStream Object
          //可选直接提供一个媒体流，从这个流中录制、实时处理音频数据（当前Recorder实例独享此流）；不提供时为普通的麦克风录音，由getUserMedia提供音频流（所有Recorder实例共享同一个流）
          //比如：audio、video标签dom节点的captureStream方法（实验特性，不同浏览器支持程度不高）返回的流；WebRTC中的remote流；自己创建的流等
          //注意：流内必须至少存在一条音轨(Audio Track)，比如audio标签必须等待到可以开始播放后才会有音轨，否则open会失败
          //,runningContext:AudioContext
          //可选提供一个state为running状态的AudioContext对象(ctx)；默认会在rec.open时自动创建一个新的ctx，无用户操作（触摸、点击等）时调用rec.open的ctx.state可能为suspended，会在rec.start时尝试进行ctx.resume，如果也无用户操作ctx.resume可能不会恢复成running状态（目前仅iOS上有此兼容性问题），导致无法去读取媒体流，这时请提前在用户操作时调用Recorder.GetContext(true)来得到一个running状态AudioContext（用完需调用CloseNewCtx(ctx)关闭）
          //,audioTrackSet:{ deviceId:"",groupId:"", autoGainControl:true, echoCancellation:true, noiseSuppression:true }
          //普通麦克风录音时getUserMedia方法的audio配置参数，比如指定设备id，回声消除、降噪开关；注意：提供的任何配置值都不一定会生效
          //由于麦克风是全局共享的，所以新配置后需要close掉以前的再重新open
          //同样可配置videoTrackSet，更多参考: https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
          //,disableEnvInFix:false 内部参数，禁用设备卡顿时音频输入丢失补偿功能
          //,takeoffEncodeChunk:NOOP //fn(chunkBytes) chunkBytes=[Uint8,...]：实时编码环境下接管编码器输出，当编码器实时编码出一块有效的二进制音频数据时实时回调此方法；参数为二进制的Uint8Array，就是编码出来的音频数据片段，所有的chunkBytes拼接在一起即为完整音频。本实现的想法最初由QQ2543775048提出
          //当提供此回调方法时，将接管编码器的数据输出，编码器内部将放弃存储生成的音频数据；如果当前编码器或环境不支持实时编码处理，将在open时直接走fail逻辑
          //因此提供此回调后调用stop方法将无法获得有效的音频数据，因为编码器内没有音频数据，因此stop时返回的blob将是一个字节长度为0的blob
          //大部分录音格式编码器都支持实时编码（边录边转码），比如mp3格式：会实时的将编码出来的mp3片段通过此方法回调，所有的chunkBytes拼接到一起即为完整的mp3，此种拼接的结果比mock方法实时生成的音质更加，因为天然避免了首尾的静默
          //不支持实时编码的录音格式不可以提供此回调（wav格式不支持，因为wav文件头中需要提供文件最终长度），提供了将在open时直接走fail逻辑
        };
        for (var k in set) {
          o[k] = set[k];
        }
        ;
        This.set = o;
        var vB = o[bitRateTxt], vS = o[sampleRateTxt];
        if (vB && !IsNum(vB) || vS && !IsNum(vS)) {
          This.CLog($T.G("IllegalArgs-1", [$T("VtS4::{1}和{2}必须是数值", 0, sampleRateTxt, bitRateTxt)]), 1, set);
        }
        ;
        o[bitRateTxt] = +vB || 16;
        o[sampleRateTxt] = +vS || 16e3;
        This.state = 0;
        This._S = 9;
        This.Sync = { O: 9, C: 9 };
      }
      ;
      Recorder.Sync = {
        /*open*/
        O: 9,
        /*close*/
        C: 9
      };
      Recorder.prototype = initFn.prototype = {
        CLog,
        _streamStore: function() {
          if (this.set.sourceStream) {
            return this;
          } else {
            return Recorder;
          }
        },
        _streamGet: function() {
          return this._streamStore().Stream;
        },
        _streamCtx: function() {
          var m = this._streamGet();
          return m && m._c;
        },
        open: function(True, False) {
          var This = this, set = This.set, streamStore = This._streamStore(), newCtx = 0;
          True = True || NOOP;
          var failCall = function(errMsg, isUserNotAllow) {
            isUserNotAllow = !!isUserNotAllow;
            This.CLog($T("5tWi::录音open失败：") + errMsg + ",isUserNotAllow:" + isUserNotAllow, 1);
            if (newCtx)
              Recorder.CloseNewCtx(newCtx);
            False && False(errMsg, isUserNotAllow);
          };
          This._streamTag = getUserMediaTxt;
          var ok = function() {
            This.CLog("open ok, id:" + This.id + " stream:" + This._streamTag);
            True();
            This._SO = 0;
          };
          var Lock = streamStore.Sync;
          var lockOpen = ++Lock.O, lockClose = Lock.C;
          This._O = This._O_ = lockOpen;
          This._SO = This._S;
          var lockFail = function() {
            if (lockClose != Lock.C || !This._O) {
              var err = $T("dFm8::open被取消");
              if (lockOpen == Lock.O) {
                This.close();
              } else {
                err = $T("VtJO::open被中断");
              }
              ;
              failCall(err);
              return true;
            }
            ;
          };
          if (!isBrowser) {
            failCall($T.G("NonBrowser-1", ["open"]) + $T("EMJq::，可尝试使用RecordApp解决方案") + "(" + GitUrl + "/tree/master/app-support-sample)");
            return;
          }
          ;
          var checkMsg = This.envCheck({ envName: "H5", canProcess: true });
          if (checkMsg) {
            failCall($T("A5bm::不能录音：") + checkMsg);
            return;
          }
          ;
          var ctx;
          var getCtx = function() {
            ctx = set.runningContext;
            if (!ctx)
              ctx = newCtx = Recorder.GetContext(true);
          };
          if (set.sourceStream) {
            This._streamTag = "set.sourceStream";
            if (!Recorder.GetContext()) {
              failCall($T("1iU7::不支持此浏览器从流中获取录音"));
              return;
            }
            ;
            getCtx();
            Disconnect(streamStore);
            var stream = This.Stream = set.sourceStream;
            stream._c = ctx;
            stream._RC = set.runningContext;
            stream._call = {};
            try {
              Connect(streamStore);
            } catch (e) {
              Disconnect(streamStore);
              failCall($T("BTW2::从流中打开录音失败：") + e.message);
              return;
            }
            ok();
            return;
          }
          ;
          var codeFail = function(code, msg) {
            try {
              window.top.a;
            } catch (e) {
              failCall($T("Nclz::无权录音(跨域，请尝试给iframe添加麦克风访问策略，如{1})", 0, 'allow="camera;microphone"'));
              return;
            }
            ;
            if (codeErr1(1, code)) {
              if (/Found/i.test(code)) {
                failCall(msg + $T("jBa9::，无可用麦克风"));
              } else {
                failCall(msg);
              }
              ;
            }
            ;
          };
          var codeErr1 = function(call, code) {
            if (/Permission|Allow/i.test(code)) {
              if (call)
                failCall($T("gyO5::用户拒绝了录音权限"), true);
            } else if (window.isSecureContext === false) {
              if (call)
                failCall($T("oWNo::浏览器禁止不安全页面录音，可开启https解决"));
            } else {
              return 1;
            }
            ;
          };
          if (Recorder.IsOpen()) {
            ok();
            return;
          }
          ;
          if (!Recorder.Support()) {
            codeFail("", $T("COxc::此浏览器不支持录音"));
            return;
          }
          ;
          getCtx();
          var f1 = function(stream2) {
            setTimeout(function() {
              stream2._call = {};
              var oldStream = Recorder.Stream;
              if (oldStream) {
                Disconnect();
                stream2._call = oldStream._call;
              }
              ;
              Recorder.Stream = stream2;
              stream2._c = ctx;
              stream2._RC = set.runningContext;
              if (lockFail())
                return;
              if (Recorder.IsOpen()) {
                if (oldStream)
                  This.CLog($T("upb8::发现同时多次调用open"), 1);
                Connect(streamStore);
                ok();
              } else {
                failCall($T("Q1GA::录音功能无效：无音频流"));
              }
              ;
            }, 100);
          };
          var f2 = function(e) {
            var code = e.name || e.message || e.code + ":" + e;
            var tryMsg = "";
            if (callUmCount == 1 && codeErr1(0, code)) {
              tryMsg = $T("KxE2::，将尝试禁用回声消除后重试");
            }
            var msg1 = $T("xEQR::请求录音权限错误"), msg2 = $T("bDOG::无法录音：");
            This.CLog(msg1 + tryMsg + "|" + e, tryMsg || f2_e ? 3 : 1, e);
            if (tryMsg) {
              f2_c = code;
              f2_e = e;
              callUserMedia(1);
            } else if (f2_e) {
              This.CLog(msg1 + "|" + f2_e, 1, f2_e);
              codeFail(f2_c, msg2 + f2_e);
            } else {
              codeFail(code, msg2 + e);
            }
            ;
          };
          var callUmCount = 0, f2_c, f2_e;
          var callUserMedia = function(retry) {
            callUmCount++;
            var atsTxt = "audioTrackSet";
            var t_AGC = "autoGainControl", t_AEC = "echoCancellation", t_ANS = "noiseSuppression";
            var atsTxtJs = atsTxt + ":{" + t_AEC + "," + t_ANS + "," + t_AGC + "}";
            var trackSet = JSON.parse(ToJson(set[atsTxt] || true));
            This.CLog("open... " + callUmCount + " " + atsTxt + ":" + ToJson(trackSet));
            if (retry) {
              if (typeof trackSet != "object")
                trackSet = {};
              trackSet[t_AGC] = false;
              trackSet[t_AEC] = false;
              trackSet[t_ANS] = false;
            }
            ;
            if (trackSet[sampleRateTxt]) {
              This.CLog($T("IjL3::注意：已配置{1}参数，可能会出现浏览器不能正确选用麦克风、移动端无法启用回声消除等现象", 0, atsTxt + "." + sampleRateTxt), 3);
            }
            ;
            var mSet = { audio: trackSet, video: set.videoTrackSet || false };
            try {
              var pro = Recorder.Scope[getUserMediaTxt](mSet, f1, f2);
            } catch (e) {
              This.CLog(getUserMediaTxt, 3, e);
              mSet = { audio: true, video: false };
              pro = Recorder.Scope[getUserMediaTxt](mSet, f1, f2);
            }
            ;
            This.CLog(getUserMediaTxt + "(" + ToJson(mSet) + ") " + CtxState(ctx) + $T("RiWe::，未配置 {1} 时浏览器可能会自动启用回声消除，移动端未禁用回声消除时可能会降低系统播放音量（关闭录音后可恢复）和仅提供16k采样率的音频流（不需要回声消除时可明确配置成禁用来获得48k高音质的流），请参阅文档中{2}配置", 0, atsTxtJs, atsTxt) + "(" + GitUrl + ") LM:" + LM + " UA:" + navigator.userAgent);
            if (pro && pro.then) {
              pro.then(f1)[CatchTxt](f2);
            }
            ;
          };
          callUserMedia();
        },
        close: function(call) {
          call = call || NOOP;
          var This = this, streamStore = This._streamStore();
          This._stop();
          var sTag = " stream:" + This._streamTag;
          var Lock = streamStore.Sync;
          This._O = 0;
          if (This._O_ != Lock.O) {
            This.CLog($T("hWVz::close被忽略（因为同时open了多个rec，只有最后一个会真正close）") + sTag, 3);
            call();
            return;
          }
          ;
          Lock.C++;
          Disconnect(streamStore);
          This.CLog("close," + sTag);
          call();
        },
        mock: function(pcmData, pcmSampleRate) {
          var This = this;
          This._stop();
          This.isMock = 1;
          This.mockEnvInfo = null;
          This.buffers = [pcmData];
          This.recSize = pcmData.length;
          This._setSrcSR(pcmSampleRate);
          This._streamTag = "mock";
          return This;
        },
        _setSrcSR: function(sampleRate) {
          var This = this, set = This.set;
          var setSr = set[sampleRateTxt];
          if (setSr > sampleRate) {
            set[sampleRateTxt] = sampleRate;
          } else {
            setSr = 0;
          }
          This[srcSampleRateTxt] = sampleRate;
          This.CLog(srcSampleRateTxt + ": " + sampleRate + " set." + sampleRateTxt + ": " + set[sampleRateTxt] + (setSr ? " " + $T("UHvm::忽略") + ": " + setSr : ""), setSr ? 3 : 0);
        },
        envCheck: function(envInfo) {
          var errMsg, This = this, set = This.set;
          var tag = "CPU_BE";
          if (!errMsg && !Recorder[tag] && typeof Int8Array == "function" && !new Int8Array(new Int32Array([1]).buffer)[0]) {
            Traffic(tag);
            errMsg = $T("Essp::不支持{1}架构", 0, tag);
          }
          ;
          if (!errMsg) {
            var type = set.type, hasFn = This[type + "_envCheck"];
            if (set.takeoffEncodeChunk) {
              if (!hasFn) {
                errMsg = $T("2XBl::{1}类型不支持设置takeoffEncodeChunk", 0, type) + (This[type] ? "" : $T("LG7e::(未加载编码器)"));
              } else if (!envInfo.canProcess) {
                errMsg = $T("7uMV::{1}环境不支持实时处理", 0, envInfo.envName);
              }
              ;
            }
            ;
            if (!errMsg && hasFn) {
              errMsg = This[type + "_envCheck"](envInfo, set);
            }
            ;
          }
          ;
          return errMsg || "";
        },
        envStart: function(mockEnvInfo, sampleRate) {
          var This = this, set = This.set;
          This.isMock = mockEnvInfo ? 1 : 0;
          This.mockEnvInfo = mockEnvInfo;
          This.buffers = [];
          This.recSize = 0;
          if (mockEnvInfo) {
            This._streamTag = "env$" + mockEnvInfo.envName;
          }
          ;
          This.state = 1;
          This.envInLast = 0;
          This.envInFirst = 0;
          This.envInFix = 0;
          This.envInFixTs = [];
          This._setSrcSR(sampleRate);
          This.engineCtx = 0;
          if (This[set.type + "_start"]) {
            var engineCtx = This.engineCtx = This[set.type + "_start"](set);
            if (engineCtx) {
              engineCtx.pcmDatas = [];
              engineCtx.pcmSize = 0;
            }
            ;
          }
          ;
        },
        envResume: function() {
          this.envInFixTs = [];
        },
        envIn: function(pcm, sum) {
          var This = this, set = This.set, engineCtx = This.engineCtx;
          if (This.state != 1) {
            if (!This.state)
              This.CLog("envIn at state=0", 3);
            return;
          }
          ;
          var bufferSampleRate = This[srcSampleRateTxt];
          var size = pcm.length;
          var powerLevel = Recorder.PowerLevel(sum, size);
          var buffers = This.buffers;
          var bufferFirstIdx = buffers.length;
          buffers.push(pcm);
          var buffersThis = buffers;
          var bufferFirstIdxThis = bufferFirstIdx;
          var now = Date.now();
          var pcmTime = Math.round(size / bufferSampleRate * 1e3);
          This.envInLast = now;
          if (This.buffers.length == 1) {
            This.envInFirst = now - pcmTime;
          }
          ;
          var envInFixTs = This.envInFixTs;
          envInFixTs.splice(0, 0, { t: now, d: pcmTime });
          var tsInStart = now, tsPcm = 0;
          for (var i = 0; i < envInFixTs.length; i++) {
            var o = envInFixTs[i];
            if (now - o.t > 3e3) {
              envInFixTs.length = i;
              break;
            }
            ;
            tsInStart = o.t;
            tsPcm += o.d;
          }
          ;
          var tsInPrev = envInFixTs[1];
          var tsIn = now - tsInStart;
          var lost = tsIn - tsPcm;
          if (lost > tsIn / 3 && (tsInPrev && tsIn > 1e3 || envInFixTs.length >= 6)) {
            var addTime = now - tsInPrev.t - pcmTime;
            if (addTime > pcmTime / 5) {
              var fixOpen = !set.disableEnvInFix;
              This.CLog("[" + now + "]" + i18n.get(fixOpen ? $T("4Kfd::补偿{1}ms", 1) : $T("bM5i::未补偿{1}ms", 1), [addTime]), 3);
              This.envInFix += addTime;
              if (fixOpen) {
                var addPcm = new Int16Array(addTime * bufferSampleRate / 1e3);
                size += addPcm.length;
                buffers.push(addPcm);
              }
              ;
            }
            ;
          }
          ;
          var sizeOld = This.recSize, addSize = size;
          var bufferSize = sizeOld + addSize;
          This.recSize = bufferSize;
          if (engineCtx) {
            var chunkInfo = Recorder.SampleData(buffers, bufferSampleRate, set[sampleRateTxt], engineCtx.chunkInfo);
            engineCtx.chunkInfo = chunkInfo;
            sizeOld = engineCtx.pcmSize;
            addSize = chunkInfo.data.length;
            bufferSize = sizeOld + addSize;
            engineCtx.pcmSize = bufferSize;
            buffers = engineCtx.pcmDatas;
            bufferFirstIdx = buffers.length;
            buffers.push(chunkInfo.data);
            bufferSampleRate = chunkInfo[sampleRateTxt];
          }
          ;
          var duration = Math.round(bufferSize / bufferSampleRate * 1e3);
          var bufferNextIdx = buffers.length;
          var bufferNextIdxThis = buffersThis.length;
          var asyncEnd = function() {
            var num = asyncBegin ? 0 : -addSize;
            var hasClear2 = buffers[0] == null;
            for (var i2 = bufferFirstIdx; i2 < bufferNextIdx; i2++) {
              var buffer = buffers[i2];
              if (buffer == null) {
                hasClear2 = 1;
              } else {
                num += buffer.length;
                if (engineCtx && buffer.length) {
                  This[set.type + "_encode"](engineCtx, buffer);
                }
                ;
              }
              ;
            }
            ;
            if (hasClear2 && engineCtx) {
              var i2 = bufferFirstIdxThis;
              if (buffersThis[0]) {
                i2 = 0;
              }
              ;
              for (; i2 < bufferNextIdxThis; i2++) {
                buffersThis[i2] = null;
              }
              ;
            }
            ;
            if (hasClear2) {
              num = asyncBegin ? addSize : 0;
              buffers[0] = null;
            }
            ;
            if (engineCtx) {
              engineCtx.pcmSize += num;
            } else {
              This.recSize += num;
            }
            ;
          };
          var asyncBegin = 0, procTxt = "rec.set.onProcess";
          try {
            asyncBegin = set.onProcess(buffers, powerLevel, duration, bufferSampleRate, bufferFirstIdx, asyncEnd);
            asyncBegin = asyncBegin === true;
          } catch (e) {
            console.error(procTxt + $T("gFUF::回调出错是不允许的，需保证不会抛异常"), e);
          }
          ;
          var slowT = Date.now() - now;
          if (slowT > 10 && This.envInFirst - now > 1e3) {
            This.CLog(procTxt + $T("2ghS::低性能，耗时{1}ms", 0, slowT), 3);
          }
          ;
          if (asyncBegin) {
            var hasClear = 0;
            for (var i = bufferFirstIdx; i < bufferNextIdx; i++) {
              if (buffers[i] == null) {
                hasClear = 1;
              } else {
                buffers[i] = new Int16Array(0);
              }
              ;
            }
            ;
            if (hasClear) {
              This.CLog($T("ufqH::未进入异步前不能清除buffers"), 3);
            } else {
              if (engineCtx) {
                engineCtx.pcmSize -= addSize;
              } else {
                This.recSize -= addSize;
              }
              ;
            }
            ;
          } else {
            asyncEnd();
          }
          ;
        },
        start: function() {
          var This = this;
          var isOpen = 1;
          if (This.set.sourceStream) {
            if (!This.Stream) {
              isOpen = 0;
            }
          } else if (!Recorder.IsOpen()) {
            isOpen = 0;
          }
          ;
          if (!isOpen) {
            This.CLog($T("6WmN::start失败：未open"), 1);
            return;
          }
          ;
          var ctx = This._streamCtx();
          This.CLog($T("kLDN::start 开始录音，") + CtxState(ctx) + " stream:" + This._streamTag);
          This._stop();
          This.envStart(null, ctx[sampleRateTxt]);
          This.state = 3;
          if (This._SO && This._SO + 1 != This._S) {
            This.CLog($T("Bp2y::start被中断"), 3);
            return;
          }
          ;
          This._SO = 0;
          var end = function() {
            if (This.state == 3) {
              This.state = 1;
              This.resume();
            }
          };
          var tag = "AudioContext resume: ";
          var stream = This._streamGet();
          stream._call[This.id] = function() {
            This.CLog(tag + ctx.state + "|stream ok");
            end();
          };
          ResumeCtx(ctx, function(runC) {
            runC && This.CLog(tag + "wait...");
            return This.state == 3;
          }, function(runC) {
            runC && This.CLog(tag + ctx.state);
            end();
          }, function(err) {
            This.CLog(tag + ctx.state + $T("upkE::，可能无法录音：") + err, 1);
            end();
          });
        },
        pause: function() {
          var This = this, stream = This._streamGet();
          if (This.state) {
            This.state = 2;
            This.CLog("pause");
            if (stream)
              delete stream._call[This.id];
          }
          ;
        },
        resume: function() {
          var This = this, stream = This._streamGet();
          var tag = "resume", tag3 = tag + "(wait ctx)";
          if (This.state == 3) {
            This.CLog(tag3);
          } else if (This.state) {
            This.state = 1;
            This.CLog(tag);
            This.envResume();
            if (stream) {
              stream._call[This.id] = function(pcm, sum) {
                if (This.state == 1) {
                  This.envIn(pcm, sum);
                }
                ;
              };
              ConnAlive(stream);
            }
            ;
            var ctx = This._streamCtx();
            if (ctx) {
              ResumeCtx(ctx, function(runC) {
                runC && This.CLog(tag3 + "...");
                return This.state == 1;
              }, function(runC) {
                runC && This.CLog(tag3 + ctx.state);
                ConnAlive(stream);
              }, function(err) {
                This.CLog(tag3 + ctx.state + "[err]" + err, 1);
              });
            }
            ;
          }
          ;
        },
        _stop: function(keepEngine) {
          var This = this, set = This.set;
          if (!This.isMock) {
            This._S++;
          }
          ;
          if (This.state) {
            This.pause();
            This.state = 0;
          }
          ;
          if (!keepEngine && This[set.type + "_stop"]) {
            This[set.type + "_stop"](This.engineCtx);
            This.engineCtx = 0;
          }
          ;
        },
        stop: function(True, False, autoClose) {
          var This = this, set = This.set, t1;
          var envInMS = This.envInLast - This.envInFirst, envInLen = envInMS && This.buffers.length;
          This.CLog($T("Xq4s::stop 和start时差:") + (envInMS ? envInMS + "ms " + $T("3CQP::补偿:") + This.envInFix + "ms envIn:" + envInLen + " fps:" + (envInLen / envInMS * 1e3).toFixed(1) : "-") + " stream:" + This._streamTag + " (" + GitUrl + ") LM:" + LM);
          var end = function() {
            This._stop();
            if (autoClose) {
              This.close();
            }
            ;
          };
          var err = function(msg) {
            This.CLog($T("u8JG::结束录音失败：") + msg, 1);
            False && False(msg);
            end();
          };
          var ok = function(blob, mime, duration2) {
            var tBlob = "blob", tABuf = "arraybuffer", tDT = "dataType", tDDT = "DefaultDataType";
            var dType = This[tDT] || Recorder[tDDT] || tBlob, dTag = tDT + "=" + dType;
            var isAB = blob instanceof ArrayBuffer, dErr = 0;
            var dLen = isAB ? blob.byteLength : blob.size;
            if (dType == tABuf) {
              if (!isAB)
                dErr = 1;
            } else if (dType == tBlob) {
              if (typeof Blob != "function") {
                dErr = $T.G("NonBrowser-1", [dTag]) + $T("1skY::，请设置{1}", 0, RecTxt + "." + tDDT + '="' + tABuf + '"');
              } else {
                if (isAB)
                  blob = new Blob([blob], { type: mime });
                if (!(blob instanceof Blob))
                  dErr = 1;
                mime = blob.type || mime;
              }
            } else {
              dErr = $T.G("NotSupport-1", [dTag]);
            }
            ;
            This.CLog($T("Wv7l::结束录音 编码花{1}ms 音频时长{2}ms 文件大小{3}b", 0, Date.now() - t1, duration2, dLen) + " " + dTag + "," + mime);
            if (dErr) {
              err(dErr != 1 ? dErr : $T("Vkbd::{1}编码器返回的不是{2}", 0, set.type, dType) + ", " + dTag);
              return;
            }
            ;
            if (set.takeoffEncodeChunk) {
              This.CLog($T("QWnr::启用takeoffEncodeChunk后stop返回的blob长度为0不提供音频数据"), 3);
            } else if (dLen < Math.max(50, duration2 / 5)) {
              err($T("Sz2H::生成的{1}无效", 0, set.type));
              return;
            }
            ;
            True && True(blob, duration2, mime);
            end();
          };
          if (!This.isMock) {
            var isCtxWait = This.state == 3;
            if (!This.state || isCtxWait) {
              err($T("wf9t::未开始录音") + (isCtxWait ? $T("Dl2c::，开始录音前无用户交互导致AudioContext未运行") : ""));
              return;
            }
            ;
          }
          ;
          This._stop(true);
          var size = This.recSize;
          if (!size) {
            err($T("Ltz3::未采集到录音"));
            return;
          }
          ;
          if (!This[set.type]) {
            err($T("xGuI::未加载{1}编码器，请尝试到{2}的src/engine内找到{1}的编码器并加载", 0, set.type, RecTxt));
            return;
          }
          ;
          if (This.isMock) {
            var checkMsg = This.envCheck(This.mockEnvInfo || { envName: "mock", canProcess: false });
            if (checkMsg) {
              err($T("AxOH::录音错误：") + checkMsg);
              return;
            }
            ;
          }
          ;
          var engineCtx = This.engineCtx;
          if (This[set.type + "_complete"] && engineCtx) {
            var duration = Math.round(engineCtx.pcmSize / set[sampleRateTxt] * 1e3);
            t1 = Date.now();
            This[set.type + "_complete"](engineCtx, function(blob, mime) {
              ok(blob, mime, duration);
            }, err);
            return;
          }
          ;
          t1 = Date.now();
          if (!This.buffers[0]) {
            err($T("xkKd::音频buffers被释放"));
            return;
          }
          ;
          var chunk = Recorder.SampleData(This.buffers, This[srcSampleRateTxt], set[sampleRateTxt]);
          set[sampleRateTxt] = chunk[sampleRateTxt];
          var res = chunk.data;
          var duration = Math.round(res.length / set[sampleRateTxt] * 1e3);
          This.CLog($T("CxeT::采样:{1} 花:{2}ms", 0, size + "->" + res.length, Date.now() - t1));
          setTimeout(function() {
            t1 = Date.now();
            This[set.type](res, function(blob, mime) {
              ok(blob, mime, duration);
            }, function(msg) {
              err(msg);
            });
          });
        }
      };
      var WebM_Extract = function(inBytes, scope) {
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
        if (!scope._ht) {
          readMatroskaVInt(bytes, position);
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
              while (pos0[0] < bytes0.length) {
                var eid1 = readMatroskaVInt(bytes0, pos0);
                var bytes1 = readMatroskaBlock(bytes0, pos0);
                var pos1 = [0], track = { channels: 0, sampleRate: 0 };
                if (BytesEq(eid1, [174])) {
                  while (pos1[0] < bytes1.length) {
                    var eid2 = readMatroskaVInt(bytes1, pos1);
                    var bytes2 = readMatroskaBlock(bytes1, pos1);
                    var pos2 = [0];
                    if (BytesEq(eid2, [215])) {
                      var val = BytesInt(bytes2);
                      track.number = val;
                      tracks[val] = track;
                    } else if (BytesEq(eid2, [131])) {
                      var val = BytesInt(bytes2);
                      if (val == 1)
                        track.type = "video";
                      else if (val == 2) {
                        track.type = "audio";
                        if (!audioIdx)
                          scope.track0 = track;
                        track.idx = audioIdx++;
                      } else
                        track.type = "Type-" + val;
                    } else if (BytesEq(eid2, [134])) {
                      var str = "";
                      for (var i = 0; i < bytes2.length; i++) {
                        str += String.fromCharCode(bytes2[i]);
                      }
                      track.codec = str;
                    } else if (BytesEq(eid2, [225])) {
                      while (pos2[0] < bytes2.length) {
                        var eid3 = readMatroskaVInt(bytes2, pos2);
                        var bytes3 = readMatroskaBlock(bytes2, pos2);
                        if (BytesEq(eid3, [181])) {
                          var val = 0, arr = new Uint8Array(bytes3.reverse()).buffer;
                          if (bytes3.length == 4)
                            val = new Float32Array(arr)[0];
                          else if (bytes3.length == 8)
                            val = new Float64Array(arr)[0];
                          else
                            CLog("WebM Track !Float", 1, bytes3);
                          track[sampleRateTxt] = Math.round(val);
                        } else if (BytesEq(eid3, [98, 100]))
                          track.bitDepth = BytesInt(bytes3);
                        else if (BytesEq(eid3, [159]))
                          track.channels = BytesInt(bytes3);
                      }
                    }
                  }
                }
              }
              ;
              scope._ht = 1;
              CLog("WebM Tracks", tracks);
              endPos();
              break;
            }
          }
        }
        var track0 = scope.track0;
        if (!track0)
          return;
        var trackSR = track0[sampleRateTxt];
        scope.webmSR = trackSR;
        if (track0.bitDepth == 16 && /FLOAT/i.test(track0.codec)) {
          track0.bitDepth = 32;
          CLog("WebM 16->32 bit", 3);
        }
        if (trackSR < 8e3 || track0.bitDepth != 32 || track0.channels < 1 || !/(\b|_)PCM\b/i.test(track0.codec)) {
          scope.bytes = [];
          if (!scope.bad)
            CLog("WebM Track Unexpected", 3, scope);
          scope.bad = 1;
          return -1;
        }
        var datas = [], dataLen = 0;
        while (position[0] < bytes.length) {
          var eid1 = readMatroskaVInt(bytes, position);
          var bytes1 = readMatroskaBlock(bytes, position);
          if (!bytes1)
            break;
          if (BytesEq(eid1, [163])) {
            var trackNo = bytes1[0] & 15;
            var track = tracks[trackNo];
            if (!track) {
              CLog("WebM !Track" + trackNo, 1, tracks);
              return -1;
            } else if (track.idx === 0) {
              var u8arr = new Uint8Array(bytes1.length - 4);
              for (var i = 4; i < bytes1.length; i++) {
                u8arr[i - 4] = bytes1[i];
              }
              datas.push(u8arr);
              dataLen += u8arr.length;
            }
          }
          endPos();
        }
        if (dataLen) {
          var more = new Uint8Array(bytes.length - scope.pos[0]);
          more.set(bytes.subarray(scope.pos[0]));
          scope.bytes = more;
          scope.pos[0] = 0;
          var u8arr = new Uint8Array(dataLen);
          for (var i = 0, i2 = 0; i < datas.length; i++) {
            u8arr.set(datas[i], i2);
            i2 += datas[i].length;
          }
          var arr = new Float32Array(u8arr.buffer);
          if (track0.channels > 1) {
            var arr2 = [];
            for (var i = 0; i < arr.length; ) {
              arr2.push(arr[i]);
              i += track0.channels;
            }
            arr = new Float32Array(arr2);
          }
          ;
          return arr;
        }
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
      var i18n = Recorder.i18n = {
        lang: "zh-CN",
        alias: { "zh-CN": "zh", "en-US": "en" },
        locales: {},
        data: {},
        put: function(set, texts) {
          var tag = RecTxt + ".i18n.put: ";
          var overwrite = set.overwrite;
          overwrite = overwrite == null || overwrite;
          var lang = set.lang;
          lang = i18n.alias[lang] || lang;
          if (!lang)
            throw new Error(tag + "set.lang?");
          var locale = i18n.locales[lang];
          if (!locale) {
            locale = {};
            i18n.locales[lang] = locale;
          }
          ;
          var exp = /^([\w\-]+):/, m;
          for (var i = 0; i < texts.length; i++) {
            var v = texts[i];
            m = exp.exec(v);
            if (!m) {
              CLog(tag + "'key:'? " + v, 3, set);
              continue;
            }
            var key = m[1], v = v.substr(key.length + 1);
            if (!overwrite && locale[key])
              continue;
            locale[key] = v;
          }
        },
        get: function() {
          return i18n.v_G.apply(null, arguments);
        },
        v_G: function(key, args, lang) {
          args = args || [];
          lang = lang || i18n.lang;
          lang = i18n.alias[lang] || lang;
          var locale = i18n.locales[lang];
          var val = locale && locale[key] || "";
          if (!val && lang != "zh") {
            if (lang == "en")
              return i18n.v_G(key, args, "zh");
            return i18n.v_G(key, args, "en");
          }
          i18n.lastLang = lang;
          if (val == "=Empty")
            return "";
          return val.replace(/\{(\d+)(\!?)\}/g, function(v, a, b) {
            a = +a || 0;
            v = args[a - 1];
            if (a < 1 || a > args.length) {
              v = "{?}";
              CLog("i18n[" + key + "] no {" + a + "}: " + val, 3);
            }
            return b ? "" : v;
          });
        },
        $T: function() {
          return i18n.v_T.apply(null, arguments);
        },
        v_T: function() {
          var a = arguments, key = "", args = [], isArgs = 0, tag = RecTxt + ".i18n.$T:";
          var exp = /^([\w\-]*):/, m;
          for (var i = 0; i < a.length; i++) {
            var v = a[i];
            if (i == 0) {
              m = exp.exec(v);
              key = m && m[1];
              if (!key)
                throw new Error(tag + "0 'key:'?");
              v = v.substr(key.length + 1);
            }
            if (isArgs === -1)
              args.push(v);
            else if (isArgs)
              throw new Error(tag + " bad args");
            else if (v === 0)
              isArgs = -1;
            else if (IsNum(v)) {
              if (v < 1)
                throw new Error(tag + " bad args");
              isArgs = v;
            } else {
              var lang = i == 1 ? "en" : i ? "" : "zh";
              m = exp.exec(v);
              if (m) {
                lang = m[1] || lang;
                v = v.substr(m[1].length + 1);
              }
              if (!m || !lang)
                throw new Error(tag + i + " 'lang:'?");
              i18n.put({ lang, overwrite: false }, [key + ":" + v]);
            }
          }
          if (!key)
            return "";
          if (isArgs > 0)
            return key;
          return i18n.v_G(key, args);
        }
      };
      var $T = i18n.$T;
      $T.G = i18n.get;
      $T("NonBrowser-1::非浏览器环境，不支持{1}", 1);
      $T("IllegalArgs-1::参数错误：{1}", 1);
      $T("NeedImport-2::调用{1}需要先导入{2}", 2);
      $T("NotSupport-1::不支持：{1}", 1);
      Recorder.TrafficImgUrl = "//ia.51.la/go1?id=20469973&pvFlag=1";
      var Traffic = Recorder.Traffic = function(report) {
        if (!isBrowser)
          return;
        report = report ? "/" + RecTxt + "/Report/" + report : "";
        var imgUrl = Recorder.TrafficImgUrl;
        if (imgUrl) {
          var data = Recorder.Traffic;
          var m = /^(https?:..[^\/#]*\/?)[^#]*/i.exec(location.href) || [];
          var host = m[1] || "http://file/";
          var idf = (m[0] || host) + report;
          if (imgUrl.indexOf("//") == 0) {
            if (/^https:/i.test(idf)) {
              imgUrl = "https:" + imgUrl;
            } else {
              imgUrl = "http:" + imgUrl;
            }
            ;
          }
          ;
          if (report) {
            imgUrl = imgUrl + "&cu=" + encodeURIComponent(host + report);
          }
          ;
          if (!data[idf]) {
            data[idf] = 1;
            var img = new Image();
            img.src = imgUrl;
            CLog("Traffic Analysis Image: " + (report || RecTxt + ".TrafficImgUrl=" + Recorder.TrafficImgUrl));
          }
          ;
        }
        ;
      };
      if (WRec2) {
        CLog($T("8HO5::覆盖导入{1}", 0, RecTxt), 1);
        WRec2.Destroy();
      }
      ;
      Export[RecTxt] = Recorder;
    });
  }
});
export default require_recorder_core();
//# sourceMappingURL=recorder-core.js.map
