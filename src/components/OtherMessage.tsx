import React, { Fragment, useState, useEffect } from 'react'

import { IReadMessage } from '../interface/IMessage'
import { Loader } from './Loader'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt } from '@fortawesome/free-solid-svg-icons'
import { Base64 } from 'js-base64'
import firebase from 'firebase/app'
import 'firebase/storage'

enum pathEnum { files = 'files', images = 'images'}
type pathType = pathEnum.files | pathEnum.images
interface ILink { src: string }

type typeSetUrl = React.Dispatch<React.SetStateAction<string>>
const getItemStorage = async (name: string, setUrl: typeSetUrl, path: pathType) => setUrl(await firebase.storage().ref(`${path}/${name}`).getDownloadURL())

export const OtherMessage: React.FC<IReadMessage> = ({data, message, name, isChanged, photo = null, file = null}) => {
    const [image, setImage] = useState<string>('')
    const [loadingI, setLoadingI] = useState<boolean>(false)

    useEffect(() => {
        photo !== null && setLoadingI(true)
        photo !== null && getItemStorage(photo, setImage, pathEnum.images).then(() => setLoadingI(false))
    }, [photo])

    
    return (
        <div className="d-flex flex-wrap flex-column align-items-start text-light bg-dark"
            style={styleMyMessage()}
        >
            <div className="font-weight-light text-wrap">{name} <span className="ml-3 text-danger">{isChanged && 'changed'}</span></div>
            <span className="font-weight-lighter">{new Date(+data).toLocaleDateString()}</span>

            <p className="font-weight-normal mb-2 text-left m-chat-castom">
            
                { 
                    getString(message).map((Element: string | ILink, index: number) => {

                        if(typeof Element === 'string') {
                            return <Fragment key={index} >{Element}{' '}</Fragment>
                        }
                        
                        if(typeof Element === 'object')  {
                            return <Fragment key={index} ><a key={index} rel="noreferrer" target="_blank" className="text-primary" href={Element.src}>{Element.src}</a>{' '}</Fragment>
                        }

                        return null;
                    }) 
                }

            </p>

            {
                loadingI && <Loader />
            }

            {
                !loadingI && photo !== null && <img className="chat-photo-castom" src={image} alt="something" />
            }

            {
                file !== null && <div className="list-group text-dark w-100">
                    <li key={Base64.encode(file)} className="list-group-item list-group-item-secondary w-100 d-flex justify-content-around align-items-center mb-2 mr-2 ml-0 pl-1 pr-1">
                        <FontAwesomeIcon icon={faFileAlt} size="2x" />
                        <span>{ file }</span>
                        <Link className="ml-2 mr-2 text-break" to={`/files/${Base64.encode(file)}`}>
                            <button type="button" className="btn btn-outline-dark pl-1 pr-1">Open</button>
                        </Link>
                    </li>
                </div>
            }

        </div>
    )
}

function getString(text: string): any[] {
    return text.split(' ').map(word => {

        if(word.trim().startsWith('http://') || word.trim().startsWith('https://')) {
            return { src: word.trim() }
        } else {
            return word.trim() 
        }

    }) 
}

function styleMyMessage(): object {
    return {
        alignSelf: 'flex-start',
        borderTopRightRadius: '15px',
        borderBottomRightRadius: '15px',
        backgroundColor: '#282c34',
        margin: '9px 0 9px 0',
        padding: '5px',
        position: 'relative',
        fontSize: 'calc(10px + 1.1vmin)',
        maxWidth: '80%',
        minWidth: '100px',
        // width: '100%'
    }
}
