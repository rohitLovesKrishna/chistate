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

export { Chi, type ChiState, chiBatch, chiComputed, chiLog, chiState, chiView };
