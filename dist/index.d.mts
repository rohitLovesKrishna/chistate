import React, { ReactNode } from 'react';

/** Public reactive state type */
type ChiState<T> = {
    value: T;
};
declare function chiBatch(fn: () => void): void;
declare function chiState<T>(initialValue: T): ChiState<T>;
declare function chiView(renderFn: () => ReactNode): React.ReactNode;
declare function chiComputed<T>(fn: () => T): ChiState<T>;
declare function chiLog(fn: () => void | (() => void)): void;
type ChiProps<T> = {
    value: ChiState<T>;
    as?: React.ElementType;
    className?: string;
    fallback?: ReactNode;
    format?: (value: T) => ReactNode;
};
declare function Chi<T>(props: ChiProps<T>): React.ReactNode;

export { Chi, type ChiState, chiBatch, chiComputed, chiLog, chiState, chiView };
