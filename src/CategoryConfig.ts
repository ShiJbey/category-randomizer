export interface Option {
	text: string;
	selected?: boolean;
}

export interface Category {
	name: string;
	options: Option[];
}

export interface CategoryConfig {
	format: string;
	name: string;
	categories: Category[];
}
