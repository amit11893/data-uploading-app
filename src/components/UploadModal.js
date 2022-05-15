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
                                    // console.log(e.target.files[0])
                                    setFile(e.target.files[0])
                                    console.log("file1: ", file)
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => {
                        console.log("file: ", file)
                        onUpload(fileTitle, fileDesc, file)
                    }}>
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}