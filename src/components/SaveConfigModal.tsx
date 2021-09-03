import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './SaveConfigModal.module.scss';

export interface SaveConfigFormProps {
	show: boolean;
	onSubmit?: (entryName: string) => void;
	onClose?: () => void;
}

const SaveConfigModal: React.FC<SaveConfigFormProps> = ({ show, onSubmit, onClose }) => {
	const [entryName, setEntryName] = useState(`random categories ${new Date().toISOString()}`);

	const submitForm = (): void => {
		if (onSubmit) onSubmit(entryName);
	};

	const closeModal = (): void => {
		if (onClose) onClose();
	};

	return (
		<Modal show={show} onHide={() => closeModal}>
			<Modal.Header>
				<Modal.Title>Save Configuration</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<input
					className={styles.save_name_input}
					onChange={(event) => setEntryName(event.target.value)}
					defaultValue={entryName}
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => closeModal()}>
					Close
				</Button>
				<Button variant="primary" onClick={() => submitForm()}>
					Save Changes
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default SaveConfigModal;
