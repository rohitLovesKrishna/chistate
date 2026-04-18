import React, { ReactNode } from 'react';

type ChiState<T> = {
    value: T;
    local: (key?: string) => ChiState<T>;
    session: (key?: string) => ChiState<T>;
};
declare function chiBatch(fn: () => void): void;
declare function chiState<T>(initialValue: T): ChiState<T>;
declare function chiView(renderFn: () => ReactNode): React.ReactNode;
declare function chiComputed<T>(fn: () => T): ChiState<T>;
declare function chiLog(fn: () => void | (() => void)): void;
type ChiBaseProps = {
    fallback?: React.ReactNode;
    as?: React.ElementType;
    className?: string;
};
type ChiValueProps<T> = ChiBaseProps & {
    value: ChiState<T>;
    children?: React.ReactNode | ((value: T) => React.ReactNode);
};
type ChiArrayProps<T> = ChiBaseProps & {
    value: ChiState<T[]>;
    children: (item: T, index: number) => React.ReactNode;
};
type ChiWatchProps = ChiBaseProps & {
    value?: undefined;
    children?: React.ReactNode | (() => React.ReactNode);
};
declare function Chi<T>(props: ChiArrayProps<T>): JSX.Element;
declare function Chi<T>(props: ChiValueProps<T>): JSX.Element;
declare function Chi(props: ChiWatchProps): JSX.Element;
type AudioTrackInput = string | {
    id?: string | number;
    src: string;
    name?: string;
    artist?: string;
    image?: string;
    [key: string]: any;
};
type AudioTrack = {
    id?: string | number;
    src: string;
    name: string;
    artist: string;
    image: string;
    [key: string]: any;
};
type ChiAudioConfig = {
    src?: string;
    playlist?: AudioTrackInput[];
    initialIndex?: number;
    autoplay?: boolean;
    volume?: number;
};
declare function chiAudio(config: ChiAudioConfig): {
    audio: HTMLAudioElement | null;
    playing: ChiState<boolean>;
    loading: ChiState<boolean>;
    muted: ChiState<boolean>;
    length: ChiState<number>;
    index: ChiState<number>;
    current: ChiState<AudioTrack>;
    currentTime: ChiState<number>;
    duration: ChiState<number>;
    progress: ChiState<number>;
    volume: ChiState<number>;
    startTime: ChiState<string>;
    endTime: ChiState<string>;
    play: () => Promise<void>;
    pause: () => void;
    toggle: () => void;
    next: () => Promise<void>;
    prev: () => Promise<void>;
    seekTo: (sec: number) => void;
    seekPercent: (percent: number) => void;
    setVolume: (v: number) => void;
    mute: () => void;
    unmute: () => void;
    setIndex: (i: number, auto?: boolean) => Promise<void>;
    destroy: () => void;
};

export { type AudioTrack, type AudioTrackInput, Chi, type ChiState, chiAudio, chiBatch, chiComputed, chiLog, chiState, chiView };
