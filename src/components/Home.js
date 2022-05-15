import React, { useState } from "react"
import { Card, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useStorage } from "../contexts/StorageContext"
import { UploadModal } from "./UploadModal"
// import { ref } from "firebase/storage"

export default function Home() {
    const [error, setError] = useState("")
    const { currentUser } = useAuth()
    const [showModal, setShowModal] = useState(false);
    const { uploadFile } = useStorage();


    return (
        <>
            <UploadModal show={showModal} onHide={() => setShowModal(false)} onUpload={uploadFile} />
            <div className="w-100 text-center mt-2">
                <Link to="/profile" className="btn btn-primary w-100 mt-3">
                    Profile
                </Link>
                <Button className="btn btn-primary w-100 mt-3" onClick={() => setShowModal(true)}>
                    Upload New File
                </Button>
            </div>
            <Card>
                <Card.Body>

                </Card.Body>
            </Card>
        </>
    )
}
