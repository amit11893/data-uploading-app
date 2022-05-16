import React, { useContext } from "react"
import { storage } from "../firebase"
import { useAuth } from "../contexts/AuthContext"
import { uuid } from 'uuidv4';


const StorageContext = React.createContext()

export function useStorage() {
    return useContext(StorageContext)
}

export function StorageProvider({ children }) {
    const { currentUser } = useAuth()

    function uploadFile({ fileTitle, fileDesc, file }) {
        const fileId = uuid();
        const fileRef = storage.ref(`/files/${currentUser.uid}/${fileId}`)

        return fileRef.put(file, {
            name: file.name,
            contentType: file.type,
            size: file.size,
            customMetadata: {
                title: fileTitle,
                description: fileDesc
            }
        })
    }

    function listAllFiles() {
        const ref = storage.ref(`/files/${currentUser.uid}`)
        return ref.listAll()
    }


    async function deleteFile({ fileName }) {
        try {
            const fileRef = storage.ref(`/files/${currentUser.uid}/${fileName}`)
            await fileRef.delete()
        } catch {
            console.error("Failed to delete file")
        }
    }

    async function downloadFile({ fileName }) {
        try {
            const fileRef = storage.ref(`/files/${currentUser.uid}/${fileName}`)
            const url = await fileRef.getDownloadURL();
            const save = document.createElement('a');
            if (typeof save.download !== 'undefined') {
                // if the download attribute is supported, save.download will return empty string, if not supported, it will return undefined
                // if you are using helper method, such as isNone in ember, you can also do isNone(save.download)
                save.href = url;
                save.target = '_blank';
                save.download = fileName;
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
        deleteFile,
        downloadFile,
    }

    return (
        <StorageContext.Provider value={value}>
            {children}
        </StorageContext.Provider>
    )
}