import type { Readable } from 'svelte/store';

export type AnimationParameters = {
	x?: Readable<number>;
	y?: Readable<number>;
	angle?: Readable<number>;
	scaleX?: Readable<number>;
	scaleY?: Readable<number>;
	opacity?: Readable<number>;
};

export type AnimationParametersSet = (parameters: AnimationParameters) => void;

export type Animation = {
	execute: (setParameters: AnimationParametersSet) => (() => void) | void;
	duration: number;
	delay?: number;
};

export type ConditionalAnimation = {
	animation: Animation;
	condition?: boolean;
};
