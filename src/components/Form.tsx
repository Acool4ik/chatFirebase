import React from 'react'

import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'firebase/app'
import { Loader } from './Loader'
import { GoogleIcon } from '../icons/Google'


export const Form: React.FC = () => {

    const [loading] = useAuthState(firebase.auth())

    const authWithGoogle: () => void = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
    }

    if(loading) { return <Loader /> }

    return (
        <div className="App">
            <header className="App-header">
                {
                    <section className="d-flex flex-column bg-light p-2 pt-4 pb-4"
                        style={{ borderRadius: '30px' }}
                    >
                        <h4 className="text-dark mb-4">
                            Welcome Acool4ik Chat
                        </h4>

                        <button className="btn btn-outline-dark mt-2 mb-2"
                            onClick={authWithGoogle} 
                        >
                            Sign in with google
                            <GoogleIcon />
                        </button>

                        <button className="btn btn-outline-dark mt-2 mb-2"
                            onClick={authWithGoogle} 
                        >
                            Sign in with google
                            <GoogleIcon />
                        </button>

                        <button className="btn btn-outline-dark mt-2 mb-2"
                            onClick={authWithGoogle} 
                        >
                            Sign in with google
                            <GoogleIcon />
                        </button>

                        <p className="text-dark">no other way registration:]]]</p>

                    </section>
                }
            </header>
        </div>
    )
}

