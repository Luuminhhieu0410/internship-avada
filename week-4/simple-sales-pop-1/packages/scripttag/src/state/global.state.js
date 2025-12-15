import {signal} from '@preact/signals';

export const currentIndex = signal(0);
export const notifications = signal([]);
export const isVisible = signal(false);
export const isPaused = signal(false);
