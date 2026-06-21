"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Pause, Play, Volume2, VolumeX, X } from "lucide-react";

interface VideoComponentProps {
    sourcePath: string;
}

const formatTime = (value: number) => {
    if (!Number.isFinite(value)) return "0:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
};

export default function VideoComponent({ sourcePath }: VideoComponentProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [autoPlay, setAutoPlay] = useState(false);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTime = () => setCurrentTime(video.currentTime);
        const handleLoaded = () => setDuration(video.duration || 0);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        video.addEventListener("timeupdate", handleTime);
        video.addEventListener("loadedmetadata", handleLoaded);
        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);

        return () => {
            video.removeEventListener("timeupdate", handleTime);
            video.removeEventListener("loadedmetadata", handleLoaded);
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
        };
    }, [isOpen]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFs = Boolean(document.fullscreenElement);
            setIsFullscreen(isFs);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        if (isOpen && autoPlay) {
            const video = videoRef.current;
            if (video) {
                video.play().catch(() => null);
            }
            setAutoPlay(false);
        }
    }, [isOpen, autoPlay]);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play().catch(() => null);
        } else {
            video.pause();
        }
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
        if (video.muted) {
            setVolume(0);
        } else if (video.volume === 0) {
            video.volume = 0.6;
            setVolume(0.6);
        }
    };

    const handleVolumeChange = (value: number) => {
        const video = videoRef.current;
        if (!video) return;
        const nextValue = Math.min(1, Math.max(0, value));
        video.volume = nextValue;
        video.muted = nextValue === 0;
        setIsMuted(video.muted);
        setVolume(nextValue);
    };

    const handleSeek = (value: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = value;
        setCurrentTime(value);
    };

    const toggleFullscreen = async () => {
        const container = containerRef.current;
        if (!container) return;
        if (document.fullscreenElement) {
            await document.exitFullscreen();
        } else {
            await container.requestFullscreen();
        }
    };

    const openModal = () => {
        setIsOpen(true);
        setAutoPlay(true);
    };

    const closeModal = () => {
        const video = videoRef.current;
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => null);
        }
        setIsOpen(false);
        setIsPlaying(false);
        setCurrentTime(0);
    };

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                className="group relative w-full overflow-hidden rounded-3xl bg-black/5 shadow-[0_20px_50px_rgba(17,24,39,0.08)]"
                aria-label="Play video"
            >
                <video
                    src={sourcePath}
                    preload="metadata"
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 transition group-hover:bg-black/10" />
                <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1E1F21] shadow-lg">
                    <Play className="h-6 w-6" />
                </span>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
                    onClick={closeModal}
                >
                    <div
                        ref={containerRef}
                        className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-black"
                        onClick={(event) => event.stopPropagation()}
                        onMouseEnter={() => setHovering(true)}
                        onMouseLeave={() => setHovering(false)}
                    >
                        <video
                            ref={videoRef}
                            src={sourcePath}
                            className="h-full w-full object-contain"
                            playsInline
                            onClick={togglePlay}
                        />

                        <button
                            type="button"
                            onClick={closeModal}
                            className="absolute right-4 top-4 z-20 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
                            aria-label="Close video"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {(hovering || isFullscreen) && (
                            <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/55 px-4 pb-4 pt-3 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={togglePlay}
                                            className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
                                            aria-label={isPlaying ? "Pause" : "Play"}
                                        >
                                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={toggleMute}
                                            className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
                                            aria-label={isMuted ? "Unmute" : "Mute"}
                                        >
                                            {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                        </button>
                                        <input
                                            type="range"
                                            min={0}
                                            max={1}
                                            step={0.05}
                                            value={volume}
                                            onChange={(event) => handleVolumeChange(Number(event.target.value))}
                                            className="h-1 w-20 cursor-pointer accent-white"
                                            aria-label="Volume"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={toggleFullscreen}
                                        className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
                                        aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
                                    >
                                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                    </button>
                                </div>

                                {isFullscreen && (
                                    <div className="mt-3 flex items-center gap-3 text-xs sm:text-sm">
                                        <span className="tabular-nums text-white/80">{formatTime(currentTime)}</span>
                                        <input
                                            type="range"
                                            min={0}
                                            max={duration || 0}
                                            step={0.1}
                                            value={currentTime}
                                            onChange={(event) => handleSeek(Number(event.target.value))}
                                            className="h-1 w-full cursor-pointer accent-white"
                                        />
                                        <span className="tabular-nums text-white/80">{formatTime(duration)}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {!isPlaying && (
                            <button
                                type="button"
                                onClick={togglePlay}
                                className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1E1F21] shadow-lg"
                                aria-label="Play"
                            >
                                <Play className="h-6 w-6" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
