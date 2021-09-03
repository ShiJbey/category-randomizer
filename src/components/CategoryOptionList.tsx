import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import CategoryOption from './CategoryOption';
import { Category, Option } from '../CategoryConfig';
import classNames from 'classnames';
import styles from './CategoryOptionList.module.scss';

interface CategoryOptionListProps {
	name: string;
	options: Option[];
	onUpdate?: (changes: Category) => void;
	onRemove?: () => void;
}

const CategoryOptionList: React.FC<CategoryOptionListProps> = ({
	name,
	options,
	onUpdate,
	onRemove,
}) => {
	const [titleEditable, setTitleEditable] = useState(false);

	const updateName = (newName: string): void => {
		if (onUpdate)
			onUpdate({
				name: newName,
				options,
			});
	};

	const addOption = (): void => {
		const updatedOptions = [...options];
		updatedOptions.push({ text: '', selected: true });
		if (onUpdate)
			onUpdate({
				name,
				options: updatedOptions,
			});
	};

	const deleteOption = (index: number): void => {
		const updatedOptions = [...options];
		updatedOptions.splice(index, 1);
		if (onUpdate)
			onUpdate({
				name,
				options: updatedOptions,
			});
	};

	const updateOption = (changes: Option, index: number): void => {
		const updatedOptions = [...options];
		updatedOptions[index] = changes;
		if (onUpdate)
			onUpdate({
				name,
				options: updatedOptions,
			});
	};

	return (
		<div className={classNames(styles.category_option_list)}>
			<div className={styles.title_bar}>
				<div
					className={classNames(styles.title)}
					contentEditable={titleEditable}
					suppressContentEditableWarning={true}
					onDoubleClick={() => setTitleEditable(true)}
					onBlur={(event) => {
						setTitleEditable(false);
						updateName(event.target.innerText);
					}}
				>
					{name}
				</div>
				<Button
					variant="danger"
					className={styles.remove_category_btn}
					onClick={() => {
						if (onRemove) onRemove();
					}}
				>
					<FontAwesomeIcon icon={faTimes} />
				</Button>
			</div>
			<div className={classNames(styles.options_list)}>
				{options.map((option, index) => (
					<CategoryOption
						key={`${option.text.substring(5)}_${index}`}
						option={option}
						onUpdate={(changes) => updateOption(changes, index)}
						onDelete={() => deleteOption(index)}
					/>
				))}

				<Button onClick={() => addOption()}>
					Add Option <FontAwesomeIcon icon={faPlus} />
				</Button>
			</div>
		</div>
	);
};

export default CategoryOptionList;
