export type FoodName = string;

export type FoodCategory = 'fruit' | 'vegetable';

export type FoodItem = {
	type: 'food';
	hungerRestore: number;
	happinessRestore: number;
	recipe?: (FoodName | FoodCategory)[][];
	categories?: FoodCategory[];
	img: string;
};

export type Item = FoodItem;

export const foodItems: { [name: FoodName]: FoodItem } = {
	apple: {
		type: 'food',
		hungerRestore: 10,
		happinessRestore: 20,
		categories: ['fruit'],
		img: 'apple'
	},
	banana: {
		type: 'food',
		hungerRestore: 12,
		happinessRestore: 15,
		categories: ['fruit'],
		img: 'banana'
	},
	bread: {
		type: 'food',
		hungerRestore: 35,
		happinessRestore: 5,
		recipe: [['wheat', 'wheat']],
		img: 'bread'
	},
	burger: {
		type: 'food',
		hungerRestore: 90,
		happinessRestore: 100,
		recipe: [
			['bread', 'bread', 'meat', 'tomato'],
			['bread', 'bread', 'meat', 'tomato', 'vegetable'],
			['bread', 'bread', 'meat', 'egg'],
			['bread', 'bread', 'meat', 'egg', 'vegetable'],
			['bread', 'bread', 'meat', 'tomato', 'egg'],
			['bread', 'bread', 'meat', 'tomato', 'egg', 'vegetable']
		],
		img: 'burger'
	},
	'burrito tortilla': {
		type: 'food',
		hungerRestore: 25,
		happinessRestore: 5,
		recipe: [['corn', 'corn']],
		img: 'burrito-tortilla'
	},
	burrito: {
		type: 'food',
		hungerRestore: 85,
		happinessRestore: 85,
		recipe: [['burrito tortilla', 'meat', 'vegetable']],
		img: 'burrito'
	},
	butter: {
		type: 'food',
		hungerRestore: 30,
		happinessRestore: 5,
		recipe: [['milk', 'milk']],
		img: 'butter'
	},
	candy: {
		type: 'food',
		hungerRestore: 5,
		happinessRestore: 80,
		recipe: [
			['sugar cane', 'sugar cane'],
			['sugar cane', 'fruit']
		],
		img: 'candy'
	},
	carrot: {
		type: 'food',
		hungerRestore: 15,
		happinessRestore: 0,
		categories: ['vegetable'],
		img: 'carrot'
	},
	'cheese cake': {
		type: 'food',
		hungerRestore: 100,
		happinessRestore: 100,
		recipe: [['sugar cane', 'cheese', 'wheat']],
		img: 'cheese-cake'
	},
	cheese: {
		type: 'food',
		hungerRestore: 60,
		happinessRestore: 40,
		recipe: [
			['milk', 'butter'],
			['butter', 'butter'],
			['milk', 'milk', 'milk']
		],
		img: 'cheese'
	},
	cherry: {
		type: 'food',
		hungerRestore: 5,
		happinessRestore: 25,
		categories: ['fruit'],
		img: 'cherry'
	},
	'chocolate cake': {
		type: 'food',
		hungerRestore: 100,
		happinessRestore: 100,
		recipe: [['butter', 'wheat', 'chocolate', 'egg', 'sugar cane']],
		img: 'chocolate-cake'
	},
	chocolate: {
		type: 'food',
		hungerRestore: 5,
		happinessRestore: 80,
		img: 'chocolate'
	},
	corn: {
		type: 'food',
		hungerRestore: 15,
		happinessRestore: 10,
		categories: ['vegetable'],
		img: 'corn'
	},
	cracker: {
		type: 'food',
		hungerRestore: 50,
		happinessRestore: 30,
		recipe: [
			['wheat', 'sugar cane'],
			['wheat', 'wheat', 'wheat']
		],
		img: 'cracker'
	},
	croissant: {
		type: 'food',
		hungerRestore: 50,
		happinessRestore: 100,
		recipe: [['wheat', 'butter', 'sugar cane']],
		img: 'croissant'
	},
	egg: {
		type: 'food',
		hungerRestore: 10,
		happinessRestore: 5,
		img: 'egg'
	},
	eggplant: {
		type: 'food',
		hungerRestore: 15,
		happinessRestore: 0,
		categories: ['vegetable'],
		img: 'eggplant'
	},
	'fish soup': {
		type: 'food',
		hungerRestore: 50,
		happinessRestore: 5,
		recipe: [['fish', 'vegetable']],
		img: 'fish-soup'
	},
	fish: {
		type: 'food',
		hungerRestore: 12,
		happinessRestore: 5,
		img: 'fish'
	},
	'fried egg': {
		type: 'food',
		hungerRestore: 50,
		happinessRestore: 50,
		recipe: [['egg', 'butter']],
		img: 'fried-egg'
	},
	'fruit salad': {
		type: 'food',
		hungerRestore: 30,
		happinessRestore: 30,
		recipe: [['fruit', 'fruit']],
		img: 'fruit-salad'
	},
	grapes: {
		type: 'food',
		hungerRestore: 10,
		happinessRestore: 15,
		categories: ['fruit'],
		img: 'grapes'
	},
	'ice cream': {
		type: 'food',
		hungerRestore: 100,
		happinessRestore: 100,
		recipe: [
			['milk', 'sugar cane', 'ice', 'egg', 'chocolate'],
			['butter', 'sugar cane', 'ice', 'chocolate']
		],
		img: 'ice-cream'
	},
	'ice pop': {
		type: 'food',
		hungerRestore: 50,
		happinessRestore: 80,
		recipe: [['sugar cane', 'ice', 'fruit']],
		img: 'ice-pop'
	},
	ice: {
		type: 'food',
		hungerRestore: 0,
		happinessRestore: 0,
		img: 'ice'
	},
	lollipop: {
		type: 'food',
		hungerRestore: 5,
		happinessRestore: 100,
		recipe: [['sugar cane', 'milk', 'fruit']],
		img: 'lollipop'
	},
	meat: {
		type: 'food',
		hungerRestore: 15,
		happinessRestore: 15,
		img: 'meat'
	},
	milk: {
		type: 'food',
		hungerRestore: 15,
		happinessRestore: 5,
		img: 'milk'
	},
	orange: {
		type: 'food',
		hungerRestore: 10,
		happinessRestore: 15,
		categories: ['fruit'],
		img: 'orange'
	},
	paella: {
		type: 'food',
		hungerRestore: 85,
		happinessRestore: 90,
		recipe: [
			['rice', 'pepper', 'tomato', 'meat'],
			['rice', 'pepper', 'tomato', 'fish']
		],
		img: 'paella'
	},
	pear: {
		type: 'food',
		hungerRestore: 10,
		happinessRestore: 10,
		categories: ['fruit'],
		img: 'pear'
	},
	pepper: {
		type: 'food',
		hungerRestore: 15,
		happinessRestore: 0,
		categories: ['vegetable'],
		img: 'pepper'
	},
	pie: {
		type: 'food',
		hungerRestore: 50,
		happinessRestore: 100,
		recipe: [['wheat', 'sugar cane', 'fruit']],
		img: 'pie'
	},
	pizza: {
		type: 'food',
		hungerRestore: 80,
		happinessRestore: 100,
		recipe: [
			['wheat', 'tomato', 'cheese', 'vegetable'],
			['wheat', 'tomato', 'cheese', 'vegetable', 'meat'],
			['wheat', 'tomato', 'cheese', 'vegetable', 'fish'],
			['wheat', 'tomato', 'cheese', 'meat'],
			['wheat', 'tomato', 'cheese', 'fish']
		],
		img: 'pizza'
	},
	pumpkin: {
		type: 'food',
		hungerRestore: 15,
		happinessRestore: 1,
		categories: ['vegetable'],
		img: 'pumpkin'
	},
	rice: {
		type: 'food',
		hungerRestore: 15,
		happinessRestore: 1,
		categories: ['vegetable'],
		img: 'rice'
	},
	roast: {
		type: 'food',
		hungerRestore: 25,
		happinessRestore: 15,
		recipe: [['meat']],
		img: 'roast'
	},
	'roasted corn': {
		type: 'food',
		hungerRestore: 45,
		happinessRestore: 20,
		recipe: [['corn', 'butter']],
		img: 'roasted-corn'
	},
	sandwich: {
		type: 'food',
		hungerRestore: 35,
		happinessRestore: 35,
		recipe: [
			['bread', 'vegetable'],
			['bread', 'meat'],
			['bread', 'fish']
		],
		img: 'sandwich'
	},
	'sugar cane': {
		type: 'food',
		hungerRestore: 0,
		happinessRestore: 15,
		categories: ['vegetable'],
		img: 'sugar-cane'
	},
	tomato: {
		type: 'food',
		hungerRestore: 10,
		happinessRestore: 5,
		categories: ['vegetable'],
		img: 'tomato'
	},
	'vegetable soup': {
		type: 'food',
		hungerRestore: 55,
		happinessRestore: 0,
		recipe: [['vegetable', 'vegetable', 'vegetable']],
		img: 'vegetable-soup'
	},
	wheat: {
		type: 'food',
		hungerRestore: 15,
		happinessRestore: 0,
		categories: ['vegetable'],
		img: 'wheat'
	}
};

export const itemList: { [name: FoodName]: Item } = { ...foodItems };
