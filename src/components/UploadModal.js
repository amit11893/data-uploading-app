import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';


export function UploadModal({ show, onHide, onUpload }) {
    const [fileTitle, setFileTitle] = useState("")
    const [fileDesc, setFileDesc] = useState("")
    const [file, setFile] = useState("")

    return (
        <>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload File</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="uploadForm.fileTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                value={fileTitle}
                                onChange={(e) => setFileTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="uploadForm.fileDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={fileDesc}
                                onChange={(e) => setFileDesc(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="uploadForm.file"
                        >
                            <Form.Control
                                type="file"
                                onChange={(e) => {
                                    setFile(e.target.files[0])
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        onHide();
                        setFileTitle("");
                        setFileDesc("");
                        setFile("");
                    }}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => {
                        onUpload({ fileTitle, fileDesc, file })
                        setFileTitle("")
                        setFileDesc("")
                        setFile("")
                    }}>
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}