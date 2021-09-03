import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './OpenConfigModal.module.scss';

export interface SavedConfigListProps {
	entryNames: string[];
	show: boolean;
	onClose?: () => void;
	onOpen?: (entryName: string) => void;
	onDelete?: (entryName: string) => void;
}

const OpenConfigModal: React.FC<SavedConfigListProps> = ({
	entryNames,
	show,
	onOpen,
	onClose,
	onDelete,
}) => {
	const selectEntry = (entryName: string): void => {
		if (onOpen) onOpen(entryName);
	};

	const deleteEntry = (entryName: string): void => {
		if (onDelete) onDelete(entryName);
	};

	const closeModal = (): void => {
		if (onClose) onClose();
	};

	return (
		<Modal show={show} onHide={() => closeModal()}>
			<Modal.Header>
				<Modal.Title>Load Configuration</Modal.Title>
			</Modal.Header>
			<Modal.Body className={styles.modal_body}>
				<div className={styles.saved_config_list}>
					{entryNames.length > 0 ? (
						entryNames.map((name, index) => (
							<div
								key={`${name}_${index}`}
								className={styles.entry_row}
								onClick={() => selectEntry(name)}
							>
								<div>{name}</div>
								<Button
									variant="danger"
									size="sm"
									onClick={() => {
										deleteEntry(name);
									}}
								>
									delete
								</Button>
							</div>
						))
					) : (
						<div className={styles.no_config_text}>No Saved Configurations</div>
					)}
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => closeModal()}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default OpenConfigModal;
