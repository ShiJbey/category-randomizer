import React from 'react';
import styles from './App.module.scss';
import sampleData from './assets/sample_categories.json';
import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import _ from 'lodash';
import CategoryOptionList from './components/CategoryOptionList';
import classNames from 'classnames';
import { CategoryConfig, Category } from './CategoryConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faRandom,
	faSave,
	faFolderOpen,
	faPlus,
	faQuestion,
	faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import OpenConfigModal from './components/OpenConfigModal';
import SaveConfigModal from './components/SaveConfigModal';
import AboutModal from './components/AboutModal';
import HelpModal from './components/HelpModal';

// If this changes then the app won't be able to find old entries
const SAVED_CONFIG_NAMES_KEY: string = 'savedConfigs';

// const BLANK_CONFIG: CategoryConfig = {
// 	format: '2',
// 	name: 'Testing',
// 	categories: [
// 		{ name: 'colleges', options: [] },
// 		{ name: 'rule', options: [] },
// 	],
// };

interface AppState {
	config: CategoryConfig;
	selections: string[];
	showOpenModal: boolean;
	showSaveModal: boolean;
	showAboutModal: boolean;
	showHelpModal: boolean;
	savedConfigs: string[];
}

function sampleCategories(categories: Category[]): string[] {
	return categories
		.map((category) => {
			const selectedOptions = category.options.filter((option) => option.selected);
			const selection = _.sample(selectedOptions);
			if (selection) {
				return selection;
			} else {
				return { text: '' };
			}
		})
		.map((selection) => selection.text);
}

class App extends React.Component<{}, AppState> {
	state: AppState = {
		config: sampleData,
		selections: sampleCategories(sampleData.categories),
		showOpenModal: false,
		showSaveModal: false,
		showAboutModal: false,
		showHelpModal: false,
		savedConfigs: [],
	};

	render(): JSX.Element {
		return (
			<>
				<div className={classNames(styles.app)}>
					<div className={classNames(styles.toolbar)}>
						<h1>Category Randomizer</h1>

						<ButtonToolbar className="mb-3">
							<ButtonGroup className="mr-2" size="sm">
								<Button variant="secondary" onClick={() => this.showSaveConfigModal()}>
									Save <FontAwesomeIcon icon={faSave} />
								</Button>
								<Button variant="secondary" onClick={() => this.showOpenConfigModal()}>
									Load <FontAwesomeIcon icon={faFolderOpen} />
								</Button>
							</ButtonGroup>
							<ButtonGroup className="mr-2" size="sm">
								<Button variant="secondary" onClick={() => this.showHelpModal()}>
									Help <FontAwesomeIcon icon={faQuestion} />
								</Button>
								<Button variant="secondary" onClick={() => this.showAboutModal()}>
									About <FontAwesomeIcon icon={faInfoCircle} />
								</Button>
							</ButtonGroup>
						</ButtonToolbar>

						<Button
							className={classNames(`mb-3`, styles.randomize_all_btn)}
							onClick={() => this.randomizeAll()}
						>
							<span className={classNames(styles.btn_label)}>Randomize All!</span>{' '}
							<FontAwesomeIcon icon={faRandom} />
						</Button>
					</div>
					<div className={classNames(styles.categories)}>
						{this.state.config.categories.map((category, index) => (
							<div key={`${category.name}_${index}`} className={styles.category_column}>
								<div>
									<Button
										variant="secondary"
										className={classNames('mb-3', styles.randomize_btn)}
										onClick={() => this.randomize(index)}
									>
										Randomize <FontAwesomeIcon icon={faRandom} />
									</Button>
								</div>

								<div className={classNames(styles.selection)}>{this.state.selections[index]}</div>

								<CategoryOptionList
									name={category.name}
									options={category.options}
									onUpdate={(changes) => this.handleOptionsUpdate(index, changes)}
									onRemove={() => this.removeCategory(index)}
								/>
							</div>
						))}
						<div className={styles.category_column}>
							<div>
								<Button
									variant="success"
									className={classNames('mb-3', styles.add_vategory_btn)}
									onClick={() => this.addCategory()}
								>
									Add Category <FontAwesomeIcon icon={faPlus} />
								</Button>
							</div>
						</div>
					</div>
				</div>

				<OpenConfigModal
					entryNames={this.state.savedConfigs}
					show={this.state.showOpenModal}
					onDelete={(name) => this.deleteFromStorage(name)}
					onOpen={(name) => {
						const config = this.loadFromStorage(name);
						if (config) {
							this.setState({
								...this.state,
								config,
								showOpenModal: false,
							});
						} else {
							this.hideOpenConfigModal();
						}
					}}
					onClose={() => this.hideOpenConfigModal()}
				/>

				<SaveConfigModal
					show={this.state.showSaveModal}
					onSubmit={(name) => {
						this.saveToStorage(name, this.state.config);
						this.hideSaveConfigModal();
					}}
					onClose={() => this.hideSaveConfigModal()}
				/>

				<AboutModal show={this.state.showAboutModal} onClose={() => this.hideAboutModal()} />

				<HelpModal show={this.state.showHelpModal} onClose={() => this.hideHelpModal()} />
			</>
		);
	}

	setCategoryConfig(config: CategoryConfig): void {
		this.setState({
			...this.state,
			config: {
				...config,
			},
		});
		console.log(config);
	}

	getSavedEntryNames(): string[] {
		const entryNameRecord = window.localStorage.getItem(SAVED_CONFIG_NAMES_KEY);
		if (entryNameRecord) {
			return JSON.parse(entryNameRecord);
		} else {
			return [];
		}
	}

	loadFromStorage(entryName: string): CategoryConfig | null {
		const entry = window.localStorage.getItem(entryName);
		if (entry) {
			const data: CategoryConfig = JSON.parse(entry);
			return data;
		} else {
			console.error(`No saved entry with name '${entryName}'`);
			return null;
		}
	}

	saveToStorage(entryName: string, config: CategoryConfig) {
		// Save the config data to storage
		window.localStorage.setItem(entryName, JSON.stringify(config));
		// save the entry name under a known key
		const savedEntryNames = this.getSavedEntryNames();
		if (!savedEntryNames.includes(entryName)) savedEntryNames.push(entryName);
		window.localStorage.setItem(SAVED_CONFIG_NAMES_KEY, JSON.stringify(savedEntryNames));
	}

	deleteFromStorage(entryName: string): void {
		// Remove data
		window.localStorage.removeItem(entryName);
		// Remove setup name
		const updatedConfigNames = this.getSavedEntryNames().filter((name) => name !== entryName);
		window.localStorage.setItem(SAVED_CONFIG_NAMES_KEY, JSON.stringify(updatedConfigNames));
	}

	showSaveConfigModal(): void {
		this.setState({
			...this.state,
			showSaveModal: true,
		});
	}

	hideSaveConfigModal(): void {
		this.setState({
			...this.state,
			showSaveModal: false,
		});
	}

	showOpenConfigModal(): void {
		this.setState({
			...this.state,
			showOpenModal: true,
			savedConfigs: this.getSavedEntryNames(),
		});
	}

	hideOpenConfigModal(): void {
		this.setState({
			...this.state,
			showOpenModal: false,
		});
	}

	showAboutModal(): void {
		this.setState({
			...this.state,
			showAboutModal: true,
		});
	}

	hideAboutModal(): void {
		this.setState({
			...this.state,
			showAboutModal: false,
		});
	}

	showHelpModal(): void {
		this.setState({
			...this.state,
			showHelpModal: true,
		});
	}

	hideHelpModal(): void {
		this.setState({
			...this.state,
			showHelpModal: false,
		});
	}

	setSelections(selections: string[]): void {
		this.setState({
			...this.state,
			selections,
		});
	}

	randomizeAll(): void {
		const updatedSelections = sampleCategories(this.state.config.categories);
		this.setSelections(updatedSelections);
	}

	randomize(index: number): void {
		const selectedOptions = this.state.config.categories[index].options.filter(
			(option) => option.selected
		);
		const newSelection = _.sample(selectedOptions)?.text ?? '';
		const updatedSelections = [...this.state.selections];
		updatedSelections[index] = newSelection;
		this.setSelections(updatedSelections);
	}

	addCategory(): void {
		const updatedCategories = [...this.state.config.categories];
		updatedCategories.push({ name: 'new category', options: [] });
		const updatedSelections = [...this.state.selections];
		updatedSelections.push('');
		this.setState({
			...this.state,
			selections: updatedSelections,
			config: {
				...this.state.config,
				categories: updatedCategories,
			},
		});
	}

	removeCategory(index: number): void {
		const updatedCategories = [...this.state.config.categories];
		updatedCategories.splice(index, 1);
		const updatedSelections = [...this.state.selections];
		updatedSelections.splice(index, 1);
		this.setState({
			...this.state,
			selections: updatedSelections,
			config: {
				...this.state.config,
				categories: updatedCategories,
			},
		});
	}

	handleOptionsUpdate(index: number, changes: Category): void {
		const updatedCategories = [...this.state.config.categories];
		updatedCategories[index] = changes;
		this.setState({
			...this.state,
			config: {
				...this.state.config,
				categories: updatedCategories,
			},
		});
	}
}

export default App;
