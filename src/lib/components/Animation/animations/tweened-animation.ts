import { tweened } from 'svelte/motion';
import type { Animation } from '../animated-container';

export type TweenedAnimationValues = {
	x?: number;
	y?: number;
	angle?: number;
	scaleX?: number;
	scaleY?: number;
	opacity?: number;
};

export const tweenedAnimation = ({
	from,
	to,
	easing,
	duration,
	delay
}: {
	duration?: number;
	delay?: number;
	easing?: (t: number) => number;
	from: TweenedAnimationValues;
	to: TweenedAnimationValues;
}) => {
	const durationAux = duration || 200;
	const delayAux = delay || 0;

	return {
		execute: (setParameters) => {
			const options = {
				duration: durationAux,
				easing
			};

			const params = {
				x: typeof from.x === 'number' ? tweened(from.x, options) : undefined,
				y: typeof from.y === 'number' ? tweened(from.y, options) : undefined,
				angle: typeof from.angle === 'number' ? tweened(from.angle, options) : undefined,
				scaleX: typeof from.scaleX === 'number' ? tweened(from.scaleX, options) : undefined,
				scaleY: typeof from.scaleY === 'number' ? tweened(from.scaleY, options) : undefined,
				opacity: typeof from.opacity === 'number' ? tweened(from.opacity, options) : undefined
			};
			params.x?.set(typeof to.x === 'number' ? to.x : (from.x as number));
			params.y?.set(typeof to.y === 'number' ? to.y : (from.y as number));
			params.angle?.set(typeof to.angle === 'number' ? to.angle : (from.angle as number));
			params.scaleX?.set(typeof to.scaleX === 'number' ? to.scaleX : (from.scaleX as number));
			params.scaleY?.set(typeof to.scaleY === 'number' ? to.scaleY : (from.scaleY as number));
			params.opacity?.set(typeof to.opacity === 'number' ? to.opacity : (from.opacity as number));
			setParameters(params);
		},
		duration: durationAux,
		delay: delayAux
	} as Animation;
};
