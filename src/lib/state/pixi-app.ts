import type { Application, Container } from 'pixi.js';

let pixiApp: Application | undefined;

export function setPixiApp(app: Application) {
	pixiApp = app;
}

export function getPixiApp() {
	return pixiApp;
}

let pixiContainer: Container | undefined;

export function setPixiContainer(app: Container) {
	pixiContainer = app;
}

export function getPixiContainer() {
	return pixiContainer;
}
