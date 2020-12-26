import React, { useState, useEffect } from 'react'

import { useParams } from 'react-router-dom'
import { Base64 } from 'js-base64'
import { Loader } from '../Loader'
import firebase from 'firebase/app'
import 'firebase/storage'

type typeSetUrl = React.Dispatch<React.SetStateAction<string>>
const getFileStorage = async (id: string, setUrl: typeSetUrl) => setUrl(await firebase.storage().ref(`files/${Base64.decode(id)}`).getDownloadURL())

export const FileReader: React.FC = () => {
    let { id }: { id: string } = useParams()
    const [loading, setLoading] = useState<boolean>(true)
    const [url, setUrl] = useState<string>('')    
    
    useEffect(() => {
        getFileStorage(id, setUrl)
        setLoading(false)
    }, [id])

    return (<>

        {
            loading && <div className="text-center" style={{ marginTop: 'calc(26vh)' }}><Loader /></div>
        }

        {
            !loading && <div className="file-reader" >
                <iframe title={Base64.encode(url)} className="file-frame" src={url} />
            </div>
        }
    
    </>)
}