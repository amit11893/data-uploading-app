import React from 'react';
import { Modal, Button } from 'react-bootstrap';


export function WarningModal({ message, show, onHide, onProceed }) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-warning">
                {message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onProceed}>Go Ahead</Button>
            </Modal.Footer>
        </Modal>
    )
}