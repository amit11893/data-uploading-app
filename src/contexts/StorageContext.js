import React, { useContext } from "react"
import { storage } from "../firebase"
import { useAuth } from "../contexts/AuthContext"

const StorageContext = React.createContext()

export function useStorage() {
    return useContext(StorageContext)
}

export function StorageProvider({ children }) {
    const { currentUser } = useAuth()

    async function uploadFile(fileTitle, fileDesc, file) {
        const fileRef = storage.ref(`/files/${currentUser.uid}/${fileTitle}`)
        try {
            return await fileRef.put(file)
        } catch (error) {
            console.log("error: ", error)
        }
    }

    function listAllFiles() {
        const ref = storage.ref(`/files/${currentUser.uid}`)
        return ref.listAll()
    }

    async function updateMetadata({ fileTitle, metadata }) {
        try {
            const fileRef = storage.ref(`/files/${currentUser.uid}/${fileTitle}`)
            await fileRef.updateMetadata(metadata)
        } catch {
            console.error("Failed to update metadata")
        }
    }

    async function deleteFile({ fileTitle }) {
        try {
            const fileRef = storage.ref(`/files/${currentUser.uid}/${fileTitle}`)
            await fileRef.delete()
        } catch {
            console.error("Failed to delete file")
        }
    }

    async function downloadFile({ fileTitle }) {
        try {
            const fileRef = storage.ref(`/files/${currentUser.uid}/${fileTitle}`)
            const url = await fileRef.getDownloadURL();
            const save = document.createElement('a');
            if (typeof save.download !== 'undefined') {
                // if the download attribute is supported, save.download will return empty string, if not supported, it will return undefined
                // if you are using helper method, such as isNone in ember, you can also do isNone(save.download)
                save.href = url;
                save.target = '_blank';
                save.download = fileTitle;
                save.dispatchEvent(new MouseEvent('click'));
            } else {
                window.location.href = url; // so that it opens new tab for IE11
            }
        } catch {
            console.error("Failed to download file")
        }
    }


    const value = {
        uploadFile,
        listAllFiles,
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