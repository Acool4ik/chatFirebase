import React, { useRef, useContext, SyntheticEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose, faPhotoVideo, faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { FilesContext } from './context/FilesContext'

export const Modal: React.FC<{setModal: any}> = ({setModal}) => {
    const { addFile, addImage, addAll } = useContext(FilesContext)

    const file = useRef<HTMLInputElement>(null)
    const image = useRef<HTMLInputElement>(null)

    const fileAnnotation = useRef<HTMLSpanElement>(null)
    const imageAnnotation = useRef<HTMLSpanElement>(null)

    const filesHandler = () => {
        if(file.current!.files!.length > 0 && image.current!.files!.length > 0) {
            addAll(file.current!.files![0], image.current!.files![0])
            setModal(false)
        }

        if(file.current!.files!.length > 0) {
            addFile(file.current!.files![0])  
            setModal(false)
        }

        if(image.current!.files!.length > 0) {
            addImage(image.current!.files![0])
            setModal(false)
        }
    }

    const remove = () => {
        fileAnnotation.current!.textContent = ''
        imageAnnotation.current!.textContent = ''
        
        file.current!.value = ''
        image.current!.value = ''
    }

    const changeSpanImage = (e: SyntheticEvent) => imageAnnotation.current!.textContent = `${(e.currentTarget as HTMLFormElement).files[0].name}  ${Math.floor((e.currentTarget as HTMLFormElement).files[0].size / 1024)}кб`
    const changeSpanFile = (e: SyntheticEvent) => fileAnnotation.current!.textContent = `${(e.currentTarget as HTMLFormElement).files[0].name}  ${Math.floor((e.currentTarget as HTMLFormElement).files[0].size / 1024)}кб`
    
    return (
        <div className="modal d-block">
        <div className="modal-dialog ">
            <div className="modal-content p-1 bg-light text-dark" style={{ borderRadius: '30px', borderColor: '#343a40!important' }} >

                <div className="modal-header">
                    <h5 className="modal-title">Chouse neaded elements:</h5>
                    <button type="button" className="close" onClick={() => remove()}>
                        <FontAwesomeIcon icon={faWindowClose} size={"1x"} />
                    </button>
                </div>

                <div className="modal-body d-flex justify-content-around align-items-center flex-wrap">

                    <input ref={image} type="file" id="photo-wideo" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={changeSpanImage}
                    />

                    <input ref={file} type="file" id="file" 
                        accept=".pdf" 
                        style={{ display: 'none' }} 
                        onChange={changeSpanFile}
                    />

                    <label htmlFor="photo-wideo" className="d-flex flex-column align-items-center cursor position-relative">
                        <FontAwesomeIcon icon={faPhotoVideo} size="2x" />
                        <span className="font-weight-lighter fs-castom mt-2">Photo/Video</span>
                        <span ref={imageAnnotation} className="font-weight-lighter fs-castom mt-2" />
                    </label>

                    <label htmlFor="file" className="d-flex flex-column align-items-center cursor position-relative">
                        <FontAwesomeIcon icon={faFileUpload} size="2x" />
                        <span className="font-weight-lighter fs-castom mt-2">Documents</span>
                        <span ref={fileAnnotation} className="font-weight-lighter fs-castom mt-2" />
                    </label>

                </div>

                <div className="modal-footer">

                    <button type="button" className="btn btn-dark" 
                        onClick={() => setModal(false)}
                    >
                        Close
                    </button>

                    <button type="button" className="btn btn-success"
                        onClick={filesHandler}
                    >
                        Add
                    </button>

                </div>

            </div>
        </div>
        </div>
    )
}

