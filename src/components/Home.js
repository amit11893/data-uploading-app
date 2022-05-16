import React, { useEffect, useState } from "react"
import { Card, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useStorage } from "../contexts/StorageContext"
import { UploadModal } from "./UploadModal"
import { FaTrash, FaEdit, FaDownload } from 'react-icons/fa';
import { WarningModal } from "./WarningModal"

export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const { uploadFile, listAllFiles, downloadFile, deleteFile, updateMetadata } = useStorage();
    const [files, setFiles] = useState([]);
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        listAllFiles().then(
            (snapshot) => {
                setFiles(snapshot.items)
            }
        ).catch(
            (error) => {
                console.log("error: ", error)
            }
        )
    }, [listAllFiles]);


    return (
        <>
            <UploadModal show={showModal} onHide={() => setShowModal(false)} onUpload={async (fileTitle, fileDesc, file) => {
                try {
                    await uploadFile(fileTitle, fileDesc, file)
                    setFiles(files.push(file))
                    setShowModal(false)
                } catch (error) {
                    console.log("error: ", error)
                }
            }} />
            <WarningModal show={showDeleteWarning} message="This File will be permanently removed, are you sure?" onHide={() => setShowDeleteWarning(false)} onProceed={() => deleteFile({ fileTitle: selectedItem.name })} />
            <div className="w-100 text-center mt-2 mb-4">
                <Link to="/profile" className="btn btn-secondary w-100 mt-3">
                    Profile
                </Link>
                <Button className="btn btn-primary w-100 mt-3" onClick={() => setShowModal(true)}>
                    Upload New File
                </Button>
            </div>

            <div>
                {files.map((item) => (
                    <Card key={item.name}>
                        <Card.Body className="d-flex row justify-content-between">
                            <div className="ml-4">
                                <h6>{item.name}</h6>
                                <p>{item.description}</p>
                            </div>
                            <div className="w-25 d-flex row justify-content-between mr-4">
                                <button className="border-0 bg-white" onClick={() => {
                                    setSelectedItem(item);
                                    setShowDeleteWarning(true)
                                }}><FaTrash /></button>
                                <button className="border-0 bg-white" onClick={() => updateMetadata({ fileTitle: item.name, metadata: { description: item.description } })}><FaEdit /></button>
                                <button className="border-0 bg-white" onClick={() => downloadFile({ fileTitle: item.name })}><FaDownload /></button>
                            </div>
                        </Card.Body>
                    </Card>))}
            </div>

        </>
    )
}
