import { ReactNode } from 'react';

declare function chiBatch(fn: () => void): void;
declare function chiState<T>(initialValue: T): {
    value: T;
};
declare function chiView(renderFn: () => ReactNode): ReactNode;
declare function chiComputed<T>(fn: () => T): {
    value: T;
};
declare function chiLog(fn: () => void): void;

export { chiBatch, chiComputed, chiLog, chiState, chiView };
