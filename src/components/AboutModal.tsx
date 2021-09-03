import React from 'react';
import { Modal } from 'react-bootstrap';
import styles from './AboutModal.module.scss';

export interface AboutModalProps {
	show: boolean;
	onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ show, onClose }) => {
	const closeModal = (): void => {
		if (onClose) onClose();
	};

	return (
		<Modal show={show} onHide={() => closeModal()} centered size="sm">
			<Modal.Body>
				<div className={styles.about_text}>
					<h2>Category Randomizer</h2>
					<p>Version: 1.0.0</p>
					<p>
						View this project on{' '}
						<a href="https://github.com/ShiJBey/category-randomizer" rel="noreferrer">
							GitHub
						</a>
					</p>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default AboutModal;
