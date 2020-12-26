import React, { useEffect, useRef } from 'react'

import firebase from 'firebase/app'
import 'firebase/database'
import { useList } from 'react-firebase-hooks/database'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDoorOpen, faImages, faLink, faFileUpload, faHome } from '@fortawesome/free-solid-svg-icons'
import { NavLink, useHistory } from 'react-router-dom'

export const Header: React.FC = () => {
    const [snapshots] = useList(firebase.database().ref('root'))
    const history = useHistory()
    const signOut: () => void = () => { history.push('/'); firebase.auth().signOut(); } 
    const notification = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        notification.current !== null && (notification.current!.textContent = `${snapshots?.length}`)
    }, [snapshots])

    return (
        <section className="d-flex align-items-center flex-wrap justify-content-between text-dark mb-1">
            <NavLink to={'/'} className="text-dark position-relative" exact >
                <div className="mr-2" >
	            	<FontAwesomeIcon icon={faHome} size={'2x'} />
	            </div>
                <span ref={notification} className="badge badge-primary badge-pill top-right-absolute-pill">0</span>
            </NavLink>

            <NavLink to={'/images'} className="text-dark" >
                <div className="mr-2" >
	            	<FontAwesomeIcon icon={faImages} size={'2x'} />
	            </div>
            </NavLink>
	        
            <NavLink to={'/links'} className="text-dark" >
                <div className="mr-2 ml-2">
	                <FontAwesomeIcon icon={faLink} size={'2x'} />
	            </div>
            </NavLink>
	        
            <NavLink to={'/files'} className="text-dark" >
                <div className="ml-2">
	                <FontAwesomeIcon icon={faFileUpload} size={'2x'} />
	            </div>
            </NavLink>

            <div onClick={signOut} className="ml-2">
	            <FontAwesomeIcon icon={faDoorOpen} size={'2x'} />
	        </div>
        </section>
    )
}