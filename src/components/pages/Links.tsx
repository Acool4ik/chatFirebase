import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { Loader } from '../Loader'
import { Base64 } from 'js-base64'
import { useList } from 'react-firebase-hooks/database'
import firebase from 'firebase/app'
import 'firebase/database'
const currentColor = createrColors()

export const LinksPage = () => {
    const [snapshots, loading] = useList(firebase.database().ref('links'));

    return (
        <div className="list-group m-chat-castom" style={{ overflowY: 'scroll' }} >

            {
                loading ? <div className="text-center text-dark" style={{ marginTop: 'calc(26vh)' }}><Loader /></div>
                : snapshots!.map((v: any, index: number) => {
                    const link: string  = v.val()

                    if(link.split(' ').length > 1) {
                        return link.split(' ').map((link: string, i: number) => 
                            <li key={Base64.encode(`${link}__${i}`)} className={`caston-links list-group-item list-group-item-action list-group-item-${currentColor()}`}>
                                <FontAwesomeIcon icon={faPaperclip} size="2x" />
                                <a href={link} style={{ color: 'rgb(70, 57, 189)' }} className="ml-2" >
                                    { link }
                                </a>  
                            </li>
                        )
                    } else {
                        return (
                            <li key={Base64.encode(`${index}_${link}`) } className={`caston-links list-group-item list-group-item-action list-group-item-${currentColor()}`}>
                                <FontAwesomeIcon icon={faPaperclip} size="2x" />
                                <a href={link} rel="noreferrer" target="_blank" style={{ color: 'rgb(70, 57, 189)' }} className="ml-2" >
                                    { link }
                                </a>  
                            </li>
                        )
                    }
                })
            }

            {
                !loading && snapshots?.length === 0 && <p className="text-dark" style={{ marginTop: 'calc(28vh)' }} >there are no links yet</p>
            }

        </div>
    )
}

function createrColors()  {
    let initial: number = 0
    const colors: string[] = [ 'secondary', 'success', 'danger', 'warning', 'info', 'dark']

    return function() {
        if(initial > colors.length - 1) {
            initial = 0
        }     

        return colors[initial++]
    }
}