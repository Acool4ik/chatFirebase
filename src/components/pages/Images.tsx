import React, { useState, useEffect } from 'react'
 
import { Link } from 'react-router-dom'
import { Loader } from '../Loader'
import { Base64 } from 'js-base64'
import firebase from 'firebase/app'
import 'firebase/storage'

const initialImages = [
    { key: 'efunew', url: 'https://via.placeholder.com/100' },
]

interface IImages {
    key: string 
    url: string
}

export const ImagesPage: React.FC = () => {
    const [images, setImages] = useState<IImages[]>(initialImages)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        firebaseLoadingImages(setImages, setLoading)
    }, [])

    return (
        <section className="container-photos text-dark" style={{ overflowY: 'scroll' }}>

            {
                loading && <div className="text-center" style={{ marginTop: 'calc(26vh)' }}><Loader /></div>
            }

            {
                !loading && images.map(({key, url}: IImages) => (
                    <Link key={key} to={`/images/${key}`} className="d-block" >
                        <div style={{ backgroundImage: `url(${url})`, backgroundSize: 'cover', height: '100%', width: '100%', backgroundPosition: 'center center' }}></div>
                    </Link>
                ))
            }

            {
                !loading && images.length === 0 && <p className="text-dark" style={{ marginTop: 'calc(28vh)' }} >There is not photos yet</p>
            }

        </section>
    )
}


async function firebaseLoadingImages(setImages: any, setLoading: any): Promise<IImages[]> {
    const { items } = await firebase.storage().ref('images/').listAll()
    let newImages = [] as IImages[]
    let prev: number[] = []
    
    items.forEach(async (itemRef, length, mass) => {
        const { name } = await itemRef.getMetadata()

        const url: string = await itemRef.getDownloadURL()
        newImages = [...newImages, { key: Base64.encode(name), url }]    
        prev.push(length)
        
        if(mass.length === prev.length) {
            setImages(newImages)
            setLoading(false)
        }
    })

    return newImages
}