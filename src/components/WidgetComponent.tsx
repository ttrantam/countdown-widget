import { useEffect } from "react";
import "../index.css";

import {
  useWidgetParams,
  useWidgetState,
  WidgetRuntime,
} from "@joymath/widget-sdk";
import type { WidgetParams } from "../definition";

export function WidgetComponent() {
  // Lấy params từ context - type-safe!
  const params = useWidgetParams<WidgetParams>();

  const [time, setTime] = useWidgetState(params.duration, 60);
  const [running, setRunning] = useWidgetState(params.autoStart, false);

  // Countdown logic
  useEffect(() => {
    if (!running || time <= 0) return;

    const interval = params.showMilliseconds ? 10 : 1000;
    const decrement = params.showMilliseconds ? 0.01 : 1;

    const id = setInterval(() => {
      setTime((t) => {
        const newTime = Math.max(0, t - decrement);
        if (newTime === 0) {
          setRunning(false);

          WidgetRuntime.emitEvent("onComplete", {
            duration: params.duration,
          });

          // Play sound if enabled (only in Advanced mode)
          if (params.mode === "Advanced" && params.advanced?.enableSound) {
            const audioContext = new (
              window.AudioContext || (window as any).webkitAudioContext
            )();
            const oscillator = audioContext.createOscillator();
            oscillator.connect(audioContext.destination);
            oscillator.frequency.value = 800;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
          }
        }
        return newTime;
      });
    }, interval);

    return () => clearInterval(id);
  }, [running, time, params]);

  // Format time display
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);

    const timeStr = `${String(minutes).padStart(2, "0")}:${String(
      seconds,
    ).padStart(2, "0")}`;

    if (params.showMilliseconds) {
      return `${timeStr}.${String(milliseconds).padStart(2, "0")}`;
    }

    return timeStr;
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen p-8 text-center overflow-hidden"
      style={{
        backgroundColor: params.appearance.colors.backgroundColor,
        padding: `${params.appearance.layout.padding}px`,
      }}
    >
      {/* Background image layer */}
      {params.appearance.background.imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${params.appearance.background.imageUrl})`,
            opacity: params.appearance.background.opacity,
            zIndex: 0,
          }}
        />
      )}

      {/* Content layer */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Mode badge */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs text-gray-600 shadow-sm">
          {params.mode}
        </div>

        <h2 className="text-xl text-gray-500 mb-2 font-medium drop-shadow-sm">
          {params.title}
        </h2>

        <div
          className="font-black mb-10 tabular-nums drop-shadow-lg"
          style={{
            color: params.appearance.colors.timerColor,
            fontSize: `${params.appearance.layout.fontSize}px`,
          }}
        >
          {formatTime()}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setRunning(!running)}
            disabled={time === 0}
            className="px-8 py-3 text-white rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            style={{
              backgroundColor:
                time === 0 ? "#9ca3af" : params.appearance.colors.buttonColor,
            }}
          >
            {running ? "Tạm dừng" : "Bắt đầu"}
          </button>

          <button
            onClick={() => {
              setTime(params.duration);
              setRunning(false);
            }}
            className="p-3 bg-white/90 backdrop-blur-sm text-gray-600 rounded-full hover:bg-white transition-colors shadow-lg hover:shadow-xl"
            title="Reset"
          >
            Đặt lại
          </button>
        </div>

        {/* Completion message */}
        {time === 0 && (
          <div className="mt-8 text-2xl font-bold text-green-600 animate-pulse drop-shadow-lg bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl">
            {params.mode === "Advanced"
              ? params.advanced?.completionMessage
              : "⏰ Hết giờ!"}
          </div>
        )}
      </div>
    </div>
  );
}
