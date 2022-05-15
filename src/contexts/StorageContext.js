import React, { useContext } from "react"
import { storage } from "../firebase"
import { useAuth } from "../contexts/AuthContext"


const StorageContext = React.createContext()

export function useStorage() {
    return useContext(StorageContext)
}

export function StorageProvider({ children }) {
    const { currentUser } = useAuth()

    function uploadFile(fileTitle, fileDesc, file) {
        const fileRef = storage.ref(`/files/${currentUser.uid}/${fileTitle}`)
        fileRef.put(file).then(
            (snapshot) => {
                console.log("snapshot: ", snapshot)
                return fileRef.getDownloadURL()
            }
        ).catch(
            (error) => {
                console.log("error: ", error)
            }
        )
    }

    function updateMetadata({ fileTitle, metadata }) {
        try {
            const fileRef = storage.ref(`/files/${currentUser.uid}/${fileTitle}`)
            fileRef.updateMetadata(metadata)
        } catch {
            console.error("Failed to update metadata")
        }
    }

    function deleteFile({ fileTitle }) {
        try {
            const fileRef = storage.ref(`/files/${currentUser.uid}/${fileTitle}`)
            fileRef.delete()
        } catch {
            console.error("Failed to delete file")
        }
    }

    function downloadFile({ fileTitle }) {
        try {
            const fileRef = storage.ref(`/files/${currentUser.uid}/${fileTitle}`)
            fileRef.getDownloadURL()
        } catch {
            console.error("Failed to download file")
        }
    }


    const value = {
        uploadFile,
        updateMetadata,
        deleteFile,
        downloadFile,
    }

    return (
        <StorageContext.Provider value={value}>
            {children}
        </StorageContext.Provider>
    )
}