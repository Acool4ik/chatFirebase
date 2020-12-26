import React, { useState, useEffect } from 'react'

import { useParams } from 'react-router-dom'
import { Base64 } from 'js-base64'
import { Loader } from '../Loader'
import firebase from 'firebase/app'
import 'firebase/storage'

type typeSetUrl = React.Dispatch<React.SetStateAction<string>>
const getImageStorage = async (id: string, setUrl: typeSetUrl) => setUrl(await firebase.storage().ref(`images/${Base64.decode(id)}`).getDownloadURL())

export const ImageReader: React.FC = () => {
    let { id }: { id: string } = useParams()
    const [loading, setLoading] = useState<boolean>(true)
    const [url, setUrl] = useState<string>('')

    useEffect(() => {
        getImageStorage(id, setUrl)
        setLoading(false)
    }, [id])

    return (<>
        
        {
            loading && <div className="text-center" style={{ marginTop: 'calc(26vh)' }}><Loader /></div>
        }

        {
            !loading && <div style={{ backgroundImage: `url(${url})`, backgroundSize: 'cover', height: '100%', width: '100%', backgroundPosition: 'center center' }}></div>
        }

    </>)
}
