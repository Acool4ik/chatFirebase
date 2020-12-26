import React from 'react';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Chat } from './components/Chat'
import { Form } from './components/Form'
import { Loader } from './components/Loader'
import { FilesState } from './components/context/FilesState'

const firebaseConfig = {
    apiKey: "AIzaSyCBy7Jds01aHZ1AfiYCTr6R-FveiEUs5Vg",
    authDomain: "chatfirebase-c6a60.firebaseapp.com",
    databaseURL: "https://chatfirebase-c6a60.firebaseio.com",
    projectId: "chatfirebase-c6a60",
    storageBucket: "chatfirebase-c6a60.appspot.com",
    messagingSenderId: "875390231382",
    appId: "1:875390231382:web:51400624c3346fa2966cf7"
}

firebase.initializeApp(firebaseConfig);

export const App: React.FC = () => {
    const [user, loading] = useAuthState(firebase.auth());

    return (
        <div className="App vh-100">
        <header className="App-header vh-100">
            {
				loading ? <Loader /> 
				:
				user ? <FilesState children={<Chat /> } />
				: 
				<Form />
			}
        </header>
        </div>
    );
}











