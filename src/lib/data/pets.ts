export type PetType = {
	phase: number;
	evolutionName?: string[];
};

export const petData: { [petName: string]: PetType } = {
	Ceroin: {
		phase: 3
	},
	Chicku: {
		phase: 1,
		evolutionName: ['Palomino', 'Lizarto']
	},
	Dolprin: {
		phase: 3
	},
	Fosel: {
		phase: 2,
		evolutionName: ['Dolprin', 'Morseal']
	},
	Koloa: {
		phase: 2,
		evolutionName: ['Ceroin', 'Lapaino']
	},
	Lapaino: {
		phase: 3
	},
	Lizarto: {
		phase: 2,
		evolutionName: ['Spinauri', 'Tirosaur']
	},
	Morseal: {
		phase: 3
	},
	Ostruz: {
		phase: 3
	},
	Palomino: {
		phase: 2,
		evolutionName: ['Ostruz', 'Pelicudo']
	},
	Pelicudo: {
		phase: 3
	},
	Raba: {
		phase: 1,
		evolutionName: ['Koloa', 'Fosel']
	},
	Spinauri: {
		phase: 3
	},
	Tirosaur: {
		phase: 3
	}
};
