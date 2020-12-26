import React, { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { Loader } from '../Loader'
import { Base64 } from 'js-base64';
import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/database'


interface IFileItem {
    key: string | number,
    size: number,
    name: string,
    idF: string 
}

const filesInitial: IFileItem[] = [
    { key: 'efewf', size: 56, name: 'hefbew', idF: 'ewygfew' },
]

const currentColor = createrColors()

export const FilesPage: React.FC = () => {
    const [files, setFiles] = useState<IFileItem[]>(filesInitial)
    const [loading, setLoading] = useState<boolean>(true)
    
    useEffect(() => {
        firebaseLoadingFiles(setFiles, setLoading)
    }, [])

    function filesHandler() {
        console.log(1);
    }

    return (
        <div className="list-group text-dark m-chat-castom" style={{ overflowY: 'scroll' }}>

            {
                loading && <div className="text-center" style={{ marginTop: 'calc(26vh)' }}><Loader /></div>
            }

            {
                !loading && files.map(({key, size, name}) => (
                    <li key={Base64.encode(`${key}__${size}_${name}`)} className={`caston-files list-group-item list-group-item-${currentColor()}`}>
                        <FontAwesomeIcon icon={faFileAlt} size="2x" onClick={filesHandler} />
                        <Link className="ml-2 mr-2" to={`/files/${Base64.encode(name)}`}>{ name }</Link>
                        <span>{size}kb</span>
                    </li>
                ))
            }

            {
                !loading && files.length === 0 && <p style={{ marginTop: 'calc(28vh)' }}>there are no files yet</p>
            }
            
        </div>
    )
}

function createrColors()  {
    let initial: number = 0
    const colors: string[] = ['secondary', 'success', 'danger', 'warning', 'info', 'dark']

    return function() {
        if(initial > colors.length - 1) {
            initial = 0
        }     

        return colors[initial++]
    }
}

async function firebaseLoadingFiles(setFiles: any, setLoading: any): Promise<IFileItem[]> {
    const { items } = await firebase.storage().ref('files/').listAll()
    let newFiles = [] as IFileItem[]
    let prev: number[] = []
    
    items.forEach(async (itemRef, length, mass) => {
        const {name, size}: {name: string, size: number} = await itemRef.getMetadata()
        const url: string = await itemRef.getDownloadURL()
        newFiles = [...newFiles, { key: Date.now(), size: Math.floor(size/1024) , name, idF: url }]    
        prev.push(length)
        
        if(mass.length === prev.length) {
            setFiles(newFiles)
            setLoading(false)
        }
    })

    return newFiles
}