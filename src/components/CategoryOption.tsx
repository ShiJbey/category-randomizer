import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';
import { Option } from '../CategoryConfig';
import styles from './CategoryOption.module.scss';

interface CategoryOptionProps {
	option: Option;
	editable?: boolean;
	onUpdate?: (chagnges: Option) => void;
	onDelete?: () => void;
}

interface CategoryOptionState {
	editable: boolean;
}

class CategoryOption extends React.Component<CategoryOptionProps, CategoryOptionState> {
	state: CategoryOptionState = {
		editable: !!this.props.editable,
	};

	render() {
		return (
			<div
				className={classNames(styles.category_option, {
					[`${styles.deselected}`]: !this.props.option.selected,
				})}
			>
				<div className={classNames(styles.select_checkbox)}>
					<input
						type="checkbox"
						checked={!!this.props.option.selected}
						onChange={(event) => this.handleSelectionUpdate(event.target.checked)}
					/>
				</div>
				<div
					className={classNames(styles.option_text)}
					onClick={() => this.setEditable(true)}
					onBlur={(event) => {
						this.setEditable(false);
						this.handleTextUpdate(event.target.innerText);
					}}
					contentEditable={this.state.editable}
					suppressContentEditableWarning={true}
				>
					{this.props.option.text}
				</div>
				<div className={classNames(styles.delete_button)} onClick={() => this.deleteOption()}>
					<FontAwesomeIcon icon={faTimes} />
				</div>
			</div>
		);
	}

	setEditable(editable: boolean): void {
		this.setState({
			...this.state,
			editable,
		});
	}

	handleSelectionUpdate(selected: boolean): void {
		if (this.props.onUpdate)
			this.props.onUpdate({
				selected,
				text: this.props.option.text ?? '',
			});
	}

	handleTextUpdate(text: string): void {
		if (this.props.onUpdate)
			this.props.onUpdate({
				selected: !!this.props.option.selected,
				text,
			});
	}

	deleteOption(): void {
		if (this.props.onDelete) this.props.onDelete();
	}
}

export default CategoryOption;
