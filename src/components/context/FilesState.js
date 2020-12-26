import React, { useReducer } from 'react'
import { FilesContext } from './FilesContext'
import { filesReduser } from './filesReduser'
import { initialReduser, FilesEnum } from './types'


export const FilesState = ({ children }) => {
    const [state, dispatch] = useReducer(filesReduser, initialReduser)

    const addFile = (file) => dispatch({ type: FilesEnum.ADD_FIlE, payload: file })
    const addImage = (image) => dispatch({ type: FilesEnum.ADD_IMAGE, payload: image })
    const addAll = (...payload) => dispatch({ type: FilesEnum.ADD_ALL, payload })

    const removeFile = () => dispatch({ type: FilesEnum.REMOVE_FIlE })
    const removeImage = () => dispatch({ type: FilesEnum.REMOVE_IMAGE })
    const removeAll = () => dispatch({ type: FilesEnum.REMOVE_ALL })

    return (
        <FilesContext.Provider value={{
            addFile, addImage, addAll, removeFile, removeImage, removeAll, files: state
        }}>
            { children }
        </FilesContext.Provider>
    )
}