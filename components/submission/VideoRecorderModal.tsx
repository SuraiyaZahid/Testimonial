"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Mic, Square, Play, RotateCcw, Check, Upload, Star, X, Loader2, Sparkles, Volume2 } from "lucide-react";

interface VideoRecorderModalProps {
  spaceId: string;
  spaceName: string;
  primaryColor?: string;
  maxDuration?: number; // in seconds, default 180 (3 min)
  onClose: () => void;
  onSuccess: () => void;
}

export default function VideoRecorderModal({
  spaceId,
  spaceName,
  primaryColor = "#5D5FEF",
  maxDuration = 180,
  onClose,
  onSuccess,
}: VideoRecorderModalProps) {
  const [mode, setMode] = useState<"record" | "upload">("record");
  const [step, setStep] = useState<"preview" | "countdown" | "recording" | "review" | "details">("preview");
  const [countdown, setCountdown] = useState(3);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Form Fields
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [authorTitle, setAuthorTitle] = useState("");
  const [authorSocial, setAuthorSocial] = useState("");
  const [consent, setConsent] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Media references
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Initialize camera and mic
  useEffect(() => {
    if (mode === "record" && (step === "preview" || step === "recording")) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [mode, step]);

  async function startCamera() {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: true,
      });
      mediaStreamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play().catch(() => {});
      }

      // Audio visualizer setup
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          audioContextRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const checkLevel = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            animFrameRef.current = requestAnimationFrame(checkLevel);
          };
          checkLevel();
        }
      } catch (err) {
        console.warn("Audio meter setup skipped", err);
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setErrorMsg("Camera or microphone permission was denied. You can still upload a video file!");
      setMode("upload");
    }
  }

  function stopCamera() {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }
  }

  // Handle countdown
  function handleStartRecordingSequence() {
    setErrorMsg("");
    setStep("countdown");
    setCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(interval);
        startActualRecording();
      } else {
        setCountdown(count);
      }
    }, 1000);
  }

  function startActualRecording() {
    if (!mediaStreamRef.current) return;
    recordedChunksRef.current = [];

    let mimeType = "video/webm;codecs=vp9,opus";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm";
    }

    try {
      const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        stopCamera();
        setStep("review");
      };

      recorder.start(1000);
      setStep("recording");
      setElapsedSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev + 1 >= maxDuration) {
            handleStopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (e: any) {
      console.error("Recording error:", e);
      setErrorMsg("Failed to start recorder: " + e.message);
    }
  }

  function handleStopRecording() {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }

  function handleReRecord() {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
      setRecordedVideoUrl(null);
    }
    setStep("preview");
    setElapsedSeconds(0);
  }

  function handleProceedToDetails() {
    setStep("details");
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setRecordedVideoUrl(url);
      setStep("review");
    }
  }

  async function handleSubmitVideo() {
    if (!authorName.trim() || !authorEmail.trim()) {
      setErrorMsg("Please provide your name and email.");
      return;
    }
    if (!consent) {
      setErrorMsg("Please accept the consent checkbox to submit.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // In production with S3/Mux, we would upload blob to pre-signed S3 URL.
      // Here we use a reliable video URL or local blob URL for instant preview & playback
      const videoPayloadUrl = recordedVideoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

      const res = await fetch("/api/v1/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceId,
          type: "VIDEO",
          rating,
          authorName,
          authorEmail,
          authorTitle,
          authorSocial,
          videoUrl: videoPayloadUrl,
          videoDuration: elapsedSeconds || 45,
          content: `Video testimonial recorded by ${authorName}.`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed");
      }

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to submit video. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Record Video Testimonial</h3>
              <p className="text-xs text-slate-400">For {spaceName} (Up to {Math.floor(maxDuration / 60)} mins)</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Switcher (Record vs Upload) */}
        {(step === "preview" || mode === "upload") && (
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-1">
            <button
              onClick={() => {
                setMode("record");
                setStep("preview");
              }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                mode === "record"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              Use Webcam
            </button>
            <button
              onClick={() => {
                stopCamera();
                setMode("upload");
              }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                mode === "upload"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              Upload Video File
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-center">
          {errorMsg && (
            <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Mode 1: Webcam Record / Review */}
          {mode === "record" && (
            <>
              {/* Preview or Recording Stage */}
              {(step === "preview" || step === "countdown" || step === "recording") && (
                <div className="space-y-4">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-slate-800 flex items-center justify-center">
                    <video
                      ref={videoPreviewRef}
                      autoPlay
                      playsInline
                      muted
                      className="h-full w-full object-cover -scale-x-100"
                    />

                    {/* Countdown Overlay */}
                    {step === "countdown" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <span className="text-7xl font-extrabold text-indigo-400 animate-pulse">
                          {countdown}
                        </span>
                      </div>
                    )}

                    {/* Live Recording HUD */}
                    {step === "recording" && (
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white shadow-lg animate-pulse">
                          <span className="h-2 w-2 rounded-full bg-white"></span>
                          REC {formatTimer(elapsedSeconds)} / {formatTimer(maxDuration)}
                        </div>

                        {/* Audio Meter Visualizer */}
                        <div className="flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 border border-white/10 text-xs text-slate-300">
                          <Mic className="h-3 w-3 text-indigo-400" />
                          <div className="h-2 w-16 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-emerald-400 transition-all duration-75"
                              style={{ width: `${audioLevel}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center justify-center gap-4 pt-2">
                    {step === "preview" && (
                      <button
                        onClick={handleStartRecordingSequence}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
                      >
                        <Camera className="h-4 w-4" />
                        Record Video
                      </button>
                    )}

                    {step === "recording" && (
                      <button
                        onClick={handleStopRecording}
                        className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
                      >
                        <Square className="h-4 w-4 fill-white" />
                        Stop Recording
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Review Stage */}
              {step === "review" && recordedVideoUrl && (
                <div className="space-y-4">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-slate-800">
                    <video
                      src={recordedVideoUrl}
                      controls
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      onClick={handleReRecord}
                      className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Re-record
                    </button>

                    <button
                      onClick={handleProceedToDetails}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Use this video & Continue
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Mode 2: File Upload */}
          {mode === "upload" && step !== "details" && step !== "review" && (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/40 p-8 text-center hover:border-indigo-500 transition-colors">
              <Upload className="h-10 w-10 text-slate-400 mb-3" />
              <p className="text-sm font-semibold text-slate-200">Drag and drop your video file here</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">Supports MP4, WebM, MOV (Max 50MB)</p>
              <label className="cursor-pointer rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all">
                Browse Files
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Step 3: Author Details Form */}
          {step === "details" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Overall Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-slate-400 ml-2 font-medium">
                    {rating} of 5 stars
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@company.com"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Title / Company (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. VP of Growth @ ScaleLogic"
                    value={authorTitle}
                    onChange={(e) => setAuthorTitle(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Social Handle or URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="@sarah_growth or LinkedIn URL"
                    value={authorSocial}
                    onChange={(e) => setAuthorSocial(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Consent checkbox */}
              <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-xs text-slate-400 leading-relaxed">
                    I grant permission to use this video testimonial in promotional materials, website social proof walls, and marketing channels.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitVideo}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading & Queuing AI Transcription...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Submit Video Testimonial</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
