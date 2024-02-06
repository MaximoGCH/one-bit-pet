export type Shoot = {
	sprite: string;
	damage: number;
	delay: number;
	angle: number;
	duration?: number;
	y: number;
};

export const gameHordesPetData: {
	[petName: string]: {
		shoots: Shoot[];
	};
} = {
	Ceroin: {
		shoots: [
			{
				sprite: 'acorn.png',
				damage: 0.334,
				delay: 0,
				angle: 0,
				duration: undefined,
				y: 0
			},
			{
				sprite: 'acorn.png',
				damage: 0.334,
				delay: 100,
				angle: 0,
				duration: undefined,
				y: 0
			},
			{
				sprite: 'acorn.png',
				damage: 0.334,
				delay: 200,
				angle: 0,
				duration: undefined,
				y: 0
			}
		]
	},
	Chicku: {
		shoots: [
			{
				sprite: 'ball-small.png',
				damage: 1,
				delay: 0,
				angle: 0,
				duration: undefined,
				y: 0
			}
		]
	},
	Dolprin: {
		shoots: [
			{
				sprite: 'fish-small.png',
				damage: 0.25,
				delay: 100,
				angle: -10,
				duration: 80,
				y: 8
			},
			{
				sprite: 'fish-small.png',
				damage: 0.25,
				delay: 100,
				angle: 10,
				duration: 80,
				y: -8
			},
			{
				sprite: 'fish-big.png',
				damage: 0.6,
				delay: 0,
				angle: 0,
				duration: undefined,
				y: 0
			}
		]
	},
	Fosel: {
		shoots: [
			{
				sprite: 'fish-small.png',
				damage: 0.5,
				delay: 0,
				angle: -10,
				duration: 80,
				y: 8
			},
			{
				sprite: 'fish-small.png',
				damage: 0.5,
				delay: 0,
				angle: 10,
				duration: 80,
				y: -8
			}
		]
	},
	Koloa: {
		shoots: [
			{
				sprite: 'leave.png',
				damage: 0.5,
				delay: 0,
				angle: 0,
				duration: undefined,
				y: 0
			},
			{
				sprite: 'leave.png',
				damage: 0.5,
				delay: 100,
				angle: 0,
				duration: undefined,
				y: 0
			}
		]
	},
	Lapaino: {
		shoots: [
			{
				sprite: 'carrot.png',
				damage: 0.6,
				delay: 0,
				angle: 0,
				duration: 60,
				y: 0
			},
			{
				sprite: 'carrot.png',
				damage: 0.6,
				delay: 250,
				angle: 0,
				duration: 60,
				y: 0
			}
		]
	},
	Lizarto: {
		shoots: [
			{
				sprite: 'bone.png',
				damage: 0.5,
				delay: 0,
				angle: 0,
				duration: undefined,
				y: -10
			},
			{
				sprite: 'bone.png',
				damage: 0.5,
				delay: 0,
				angle: 0,
				duration: undefined,
				y: 10
			}
		]
	},
	Morseal: {
		shoots: [
			{
				sprite: 'fish-small.png',
				damage: 0.25,
				delay: 0,
				angle: -20,
				duration: 0,
				y: 0
			},
			{
				sprite: 'fish-small.png',
				damage: 0.25,
				delay: 100,
				angle: 10,
				duration: 125,
				y: 0
			},
			{
				sprite: 'fish-small.png',
				damage: 0.25,
				delay: 200,
				angle: -10,
				duration: 250,
				y: 0
			},
			{
				sprite: 'fish-small.png',
				damage: 0.25,
				delay: 300,
				angle: -20,
				duration: 375,
				y: 0
			}
		]
	},
	Ostruz: {
		shoots: [
			{
				sprite: 'egg-big.png',
				damage: 1,
				delay: 0,
				angle: 0,
				duration: undefined,
				y: 0
			}
		]
	},
	Palomino: {
		shoots: [
			{
				sprite: 'egg-small.png',
				damage: 1,
				delay: 0,
				angle: 0,
				duration: undefined,
				y: 0
			}
		]
	},
	Pelicudo: {
		shoots: [
			{
				sprite: 'egg-small.png',
				damage: 0.5,
				delay: 0,
				angle: -15,
				duration: undefined,
				y: -10
			},
			{
				sprite: 'egg-small.png',
				damage: 0.5,
				delay: 0,
				angle: 15,
				duration: undefined,
				y: -10
			}
		]
	},
	Raba: {
		shoots: [
			{
				sprite: 'ball-small.png',
				damage: 0.5,
				delay: 0,
				angle: 0,
				duration: undefined,
				y: 3
			},
			{
				sprite: 'ball-small.png',
				damage: 0.5,
				delay: 250,
				angle: 0,
				duration: undefined,
				y: -3
			}
		]
	},
	Spinauri: {
		shoots: [
			{
				sprite: 'bone.png',
				damage: 0.25,
				delay: 0,
				angle: 0,
				duration: undefined,
				y: 0
			},
			{
				sprite: 'bone.png',
				damage: 0.25,
				delay: 100,
				angle: -30,
				duration: undefined,
				y: -10
			},
			{
				sprite: 'bone.png',
				damage: 0.25,
				delay: 100,
				angle: 0,
				duration: undefined,
				y: 0
			},
			{
				sprite: 'bone.png',
				damage: 0.25,
				delay: 100,
				angle: 30,
				duration: undefined,
				y: 10
			}
		]
	},
	Tirosaur: {
		shoots: [
			{
				sprite: 'meat.png',
				damage: 1.25,
				delay: 0,
				angle: 0,
				duration: 50,
				y: 0
			}
		]
	}
};

export type Enemy = {
	health: number;
	speed: number;
	coins: number;
};

export const gameHordesEnemyData: {
	[name: string]: Enemy;
} = {
	demon: {
		health: 300,
		speed: 40,
		coins: 3
	},
	dragon: {
		health: 600,
		speed: 80,
		coins: 10
	},
	'fallen-angel': {
		health: 100,
		speed: 60,
		coins: 1
	},
	octopus: {
		health: 500,
		speed: 20,
		coins: 6
	},
	spider: {
		health: 1000,
		speed: 10,
		coins: 10
	}
};
