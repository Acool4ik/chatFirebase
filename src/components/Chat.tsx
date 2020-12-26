import React, { useState, useRef, useContext, useEffect, createRef, RefObject } from 'react'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import { useList } from 'react-firebase-hooks/database'
import { useAuthState } from 'react-firebase-hooks/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileDownload, faPaperPlane, faFileAlt, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { BrowserRouter, Switch, Route, useHistory } from 'react-router-dom'
import { Header } from './Header'
import { FilesPage } from './pages/Files'
import { ImagesPage } from './pages/Images'
import { LinksPage } from './pages/Links'
import { Loader } from './Loader'
import { IMessage } from '../interface/IMessage'
import { EAlert, IAlertState } from '../interface/IAlert'
import { uid } from 'uid'
import { Alert } from './Alert'
import { Modal } from './Modal'
import { MyMessage } from './MyMessage'
import { OtherMessage } from './OtherMessage'
import { FileReader } from './pages/FileReader'
import { ImageReader } from './pages/ImageReader'
import { FilesContext } from './context/FilesContext'
import { IModal } from '../interface/IModal'
import { readAsDataURL } from '../reader/readAsDataURL'

const initialAlert: IAlertState = {isAlert: false, info: {status: EAlert.error, title: 'test'}}

export const Chat: React.FC = () => {
	const { removeFile, removeImage, removeAll, files } = useContext(FilesContext);

	const [snapshots, loading] = useList(firebase.database().ref('root'))
	const [user] = useAuthState(firebase.auth())

	let history = useHistory();

	const [value, setValue] = useState<string>('')
	const [modal, setModal] = useState<boolean>(false)
	const [alert, setAlert] = useState<IAlertState>(initialAlert)
	const [loaderBtn, setLoaderBtn] = useState<boolean>(false)

	const input = useRef<HTMLTextAreaElement>(null)
	const btnFiles = useRef<HTMLButtonElement>(null)
	const btnSend = useRef<HTMLButtonElement>(null)
	const imgFixed = useRef<HTMLImageElement>(null)
	const btnRemoveFile = useRef<HTMLButtonElement>(null)
	const btnRemoveImage = useRef<HTMLButtonElement>(null)
	const scroll = useRef<HTMLTableSectionElement>(null)

	useEffect(() => {
		imgFixed.current !== null && readAsDataURL((files as IModal).image, imgFixed)
	}, [files, imgFixed])

	useEffect(() => {
		scroll.current !== null && (scroll.current.scrollTop = scroll.current.scrollHeight)
	}, [snapshots?.length, loading, history])

	function setDisabled(state: boolean): void {
		input.current!.disabled = state
		btnFiles.current!.disabled = state
		btnSend.current!.disabled = state
		
		if(btnRemoveFile.current !== null) { btnRemoveFile.current.disabled = state }
		if(btnRemoveImage.current !== null) { btnRemoveImage.current.disabled = state }
	}

	function submitHandler(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault()
		innerHundler()
	}

	async function innerHundler() {
        if(value.trim() === '') { return }
		setDisabled(true)
		setLoaderBtn(true)

		const time: string = `${Date.now()}`
		const message: IMessage = {
			key: uid(),
			uidM: user.uid,
			name: user.displayName,
			message: value,
			data: time,
			isChanged: false,
			file: files.file !== null ? files.file.name : null,
			photo: files.image !== null ? files.image.name : null
		}

		messagesLS(message)
		
		await uploadFiles(files)
		await firebase.database().ref(`root/${time}`).set(message)
		
		if(getLinksFromText(message.message) !== '') {
			await firebase.database().ref(`links/${time}`).set(getLinksFromText(message.message))
		}
		setAlert(messageSuccess())
		setDisabled(false)
		input.current!.focus()
		setValue('')
		setLoaderBtn(false)
		removeAll()
	}

    return (
		<BrowserRouter>
		<div className="d-flex flex-column bg-light p-2 pt-3 pb-4 width-chat">
            <Header />

			<hr className="w-100 mb-0" />

			{/* {
				alert.isAlert && <Alert {...alert.info} setAlert={setAlert} /> 
			} */}

			{
                modal && <Modal setModal={setModal} /> 
			}

			<Switch>
                <Route path={'/images/:id'} children={<ImageReader />} />

				<Route path={'/images'} children={<ImagesPage />} />

				<Route path={'/links'} children={<LinksPage />} />
			
				<Route path={'/files/:id'} children={<FileReader />} />

				<Route path={'/files'} children={<FilesPage /> } />
				
				<Route path={'/'} >

				<div className="text-dark h-100">

                <section ref={scroll} style={{ height: resize(files).messages, overflowX: 'hidden' }} >
				<div className="d-flex justify-content-start flex-column align-items-center flex-wrap">

					{
						loading && <div className="text-center" style={{ marginTop: 'calc(26vh)' }}><Loader /></div>
					}

                    {
						!loading && snapshots!.map((v: any) => {
							const props: IMessage = v.val()
							return props.uidM === user.uid ? <MyMessage {...props} /> : <OtherMessage {...props} />
						})
					}

					{
						!loading && snapshots?.length === 0 && <p style={{ marginTop: 'calc(26vh)' }} >there are no messages yet</p> 
					}
					
				</div>
				</section>

				<hr className="w-100 mt-0 mb-1" />

				<section className="mt-2" style={{ height: resize(files).form }} >
				<form className={`input-group mb-1 input-group-lg ${resize(files).fixed}`} onSubmit={submitHandler}>
                  
					<button className="btn btn-outline-secondary mw-48px" 
					    type="button" 
						onClick={() => setModal(true)}
						ref={btnFiles}
						children={ <FontAwesomeIcon icon={faFileDownload} size={'1x'} /> }
					/>

					<textarea className="form-control fs-castom p-0 pl-1 pr-1 castom-textarea" 
						placeholder="enter message" 
						rows={2} 
						onChange={e => setValue(e.target.value)}
						value={value}
						ref={input}
                    />
						
					<button className="btn btn-outline-secondary mw-48px" 
					    type="submit" 
						ref={btnSend}
						children={ !loaderBtn ? <FontAwesomeIcon icon={faPaperPlane} size={'1x'} /> : <div className="spinner-border text-dark spinner-border-sm"><span className="sr-only">Loading...</span></div> }
					/>

                </form>		

				<div className="d-flex flex-column  pt-2 pb-2 text-dark" >

					{
						(files as IModal).file !== null && <li className={`caston-files list-group-item list-group-item-warning rounded position-relative pt-1 pb-1 pl-4 pr-4 mb-2 height-px64`}>
                            <FontAwesomeIcon icon={faFileAlt} size="2x" />
                            <p className="mb-0 ml-2 mr-2" > { (files as IModal).file!.name } </p>
                            <span> { Math.floor((files as IModal).file!.size / 1024) } kb </span>
							<button ref={btnRemoveFile} type="button" className="close top-right-absolute" onClick={() => removeFile()}>
                                <FontAwesomeIcon icon={faWindowClose} size={"1x"} />
                            </button>
                        </li>
					}

                    {
						(files as IModal).image !== null && <li className={`caston-files list-group-item list-group-item-success rounded position-relative pt-1 pb-1 pl-4 pr-4 height-px64`}>
                            <img ref={imgFixed} className="avatar-fixed-foto rounded" alt="fixed" />
                            <p className="mb-0 ml-2 mr-2" > { (files as IModal).image!.name } </p>
                            <span> { Math.floor((files as IModal).image!.size / 1024) } kb </span>
							<button ref={btnRemoveImage} type="button" className="close top-right-absolute" onClick={() => removeImage()}>
                                <FontAwesomeIcon icon={faWindowClose} size={"1x"} />
                            </button>
                        </li>
					}
						
				</div>
				</section>

                </div>
				</Route>
			</Switch>

		</div>
		</BrowserRouter>
    )
}

function messagesLS(message: IMessage): void {
	const messages: string[] | null = JSON.parse(window.localStorage.getItem('messages') || 'null') 

	if(messages !== null) {
		window.localStorage.setItem('messages', JSON.stringify([...messages, message.uidM]))
	} else {
		window.localStorage.setItem('messages', JSON.stringify([message.uidM]))
	}
}

function messageSuccess(): IAlertState {
    return {isAlert: true, info: {status: EAlert.success, title: 'message have beed sended'}}
}

async function uploadFiles(files: IModal) {
	files.file !== null && await firebase.storage().ref(`files/${files.file.name}`).put(files.file)
	files.image !== null && await firebase.storage().ref(`images/${files.image.name}`).put(files.image)
}

interface IResize {
	form: string, 
	messages: string, 
	fixed: string
}

function resize(files: IModal): IResize {
	let result = {} as IResize

	if (files.file === null && files.image === null) {
		result = { form: '11vh', messages: '65vh', fixed: 'h-100' }
	}

	if (files.file !== null || files.image !== null) {
        result = { form: '27vh', messages: '49vh', fixed: 'h-75' }
	} 

	if (files.file !== null && files.image !== null) {
		result = { form: '40vh', messages: '38vh', fixed: 'h-50' }
	} 

	return result
}

function getLinksFromText(text: any): string {
	return text.split(' ')
		.filter((word: string) => word.trim().startsWith('http://') || word.trim().startsWith('https://'))
		.map((word: string) => word.trim())
		.join(' ') 
}
