import React, { useEffect, useState } from "react"
import { Card, Button, OverlayTrigger, ProgressBar, Tooltip } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useStorage } from "../contexts/StorageContext"
import { UploadModal } from "./UploadModal"
import { FaTrash, FaPause, FaDownload, FaLink, FaPlay, FaStop, FaUserCircle } from 'react-icons/fa';
import { WarningModal } from "./WarningModal"
import { shortenUrl } from "../tinyurl";
import firebase from "firebase/app"


export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const { uploadFile, listAllFiles, downloadFile, deleteFile } = useStorage();
    const [files, setFiles] = useState([]);
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadTask, setUploadTask] = useState(null);
    const [copied, setCopied] = useState(false);

    function clearState() {
        setSelectedItem(null);
        setProgress(0);
        setUploading(false);
        setUploadTask(null);
        setShowDeleteWarning(false);
        setShowModal(false)
        setCopied(false)
    }


    function onUpload({ fileTitle, fileDesc, file }) {
        setShowModal(false);
        setUploading(true);
        try {
            const uploadTask = uploadFile({ fileTitle, fileDesc, file });
            setUploadTask(uploadTask);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(parseInt(progress));
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED:
                            setUploading(false);
                            break;
                        case firebase.storage.TaskState.RUNNING:
                            setUploading(true);
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    switch (error.code) {
                        case 'storage/unauthorized':
                            alert("User doesn't have permission to access the object")
                            break;
                        case 'storage/canceled':
                            alert("User canceled the upload")
                            break;

                        case 'storage/unknown':
                            alert("Unknown error occurred, inspect error.serverResponse")
                            break;
                        default:
                            alert("Unknown error occurred, inspect error.serverResponse")
                    }
                },
                async () => {
                    const fileRef = uploadTask.snapshot.ref;
                    let metadata = await fileRef.getMetadata();
                    const url = await fileRef.getDownloadURL();
                    const tinyUrl = await shortenUrl(url);
                    metadata = await fileRef.updateMetadata({ ...metadata, downloadUrl: tinyUrl ?? url });

                    setFiles(files => [...files, {
                        title: metadata.customMetadata.title,
                        description: metadata.customMetadata.description,
                        id: fileRef.name,
                        ref: fileRef,
                        downloadUrl: metadata.downloadUrl,
                        size: metadata.size
                    }])
                    clearState();
                }
            )

        } catch (error) {
            console.log("error: ", error)
        }
    }

    useEffect(() => {
        listAllFiles().then(
            (snapshot) => {
                snapshot.items.forEach(itemRef => {
                    itemRef.getMetadata().then(
                        async (metadata) => {
                            const url = await itemRef.getDownloadURL();
                            setFiles(files => [...files, {
                                title: metadata.customMetadata.title,
                                description: metadata.customMetadata.description,
                                id: itemRef.name,
                                ref: itemRef,
                                downloadUrl: metadata.downloadUrl ?? url
                            }])
                        }
                    )
                });
            }
        ).catch(
            (error) => {
                console.log("error: ", error)
            }
        )
    }, [listAllFiles]);

    return (
        <>
            <UploadModal show={showModal} onHide={() => setShowModal(false)} onUpload={onUpload} />
            <WarningModal show={showDeleteWarning} message="This File will be permanently removed, are you sure?" onHide={() => setShowDeleteWarning(false)} onProceed={async () => {
                await deleteFile({ fileName: selectedItem.id })
                setFiles(files.filter(file => file.id !== selectedItem.id))
                setShowDeleteWarning(false)
            }} />
            <div className="d-flex row w-100  justify-content-around mt-5 mb-4">
                <Link to="/profile" className="color-secondary">
                    <FaUserCircle size={30} fill="black" />
                </Link>
                <Button className="btn btn-primary w-50" disabled={uploading || !!progress} onClick={() => setShowModal(true)}>
                    Upload New File
                </Button>
            </div>

            {(uploading || !!progress) && <div>
                <ProgressBar now={progress} label={`${progress}%`} className="mt-3" />
                <button onClick={() => {
                    if (uploading) uploadTask.pause();
                    else uploadTask.resume();
                }} className="mt-2 mr-2" >{uploading ? <FaPause /> : <FaPlay />}</button>
                <button className="mt-2" onClick={() => {
                    uploadTask.cancel();
                    clearState()
                }}><FaStop /></button>
            </div>}

            <div>
                {files.map((item) => (
                    <Card key={item.id} className="mt-2">
                        <Card.Body className="d-flex row justify-content-between">
                            <div className="ml-4">
                                <h6>{item.title}</h6>
                                <p>{item.description}</p>
                            </div>
                            <div className="w-25 d-flex row justify-content-between mr-4">
                                <button className="border-0 bg-white" onClick={() => {
                                    setSelectedItem(item);
                                    setShowDeleteWarning(true)
                                }}><FaTrash /></button>
                                <OverlayTrigger
                                    trigger="focus"
                                    placement="bottom"
                                    overlay={<Tooltip id={item.id}>
                                        {
                                            !copied ? (<><h5>Shareable Link</h5>
                                                <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer">{item.downloadUrl}</a></>) : (<h5>Link Copied</h5>)}
                                    </Tooltip>}
                                ><button className="border-0 bg-white" onClick={() => {
                                    navigator.clipboard.writeText(item.downloadUrl);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}><FaLink /></button></OverlayTrigger>
                                <button className="border-0 bg-white" onClick={() => downloadFile({ fileName: item.id })}><FaDownload /></button>
                            </div>
                        </Card.Body>
                    </Card>))}
            </div>

        </>
    )
}
