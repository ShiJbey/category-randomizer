import React from 'react';
import { Modal, Button } from 'react-bootstrap';
// import styles from './HelpModal.module.scss';

export interface HelpModalProps {
	show: boolean;
	onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ show, onClose }) => {
	const closeModal = (): void => {
		if (onClose) onClose();
	};

	return (
		<Modal show={show} onHide={() => closeModal()}>
			<Modal.Body>
				<h2>Help</h2>
				<hr></hr>
				<h3>What is this?</h3>
				<p>
					This is a simple application for creating random combinations of categories. You can
					randomize a single category at a time or all three categories at once. Users can
					add/remove categories, as well as add/remove and select/deselect options within
					categories.
				</p>
				<p>
					Options that are deselected (not checked and greyed out), are not included when
					randomizing.
				</p>
				<p>
					If you find a setup that you like, you can use the 'save' button to save it for later in
					the browser's storage. You can then load the same setup at a later date, assuming you're
					using the same web browser.
				</p>
				<h3>Troubleshooting</h3>
				<h4>Where are my saves?</h4>
				<p>
					Chances are you're using a different device or browser from your last visit. Setting are
					saved to the specific brower used during the last session.
				</p>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => closeModal()}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default HelpModal;
