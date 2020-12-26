export const initialReduser = {
    file: null,
    image: null
}

export enum FilesEnum {
    'ADD_FIlE' = 'ADD_FIlE',
    'ADD_IMAGE' = 'ADD_IMAGE',
    'ADD_ALL' = 'ADD_ALL',

    'REMOVE_FIlE' = 'REMOVE_FIlE',
    'REMOVE_IMAGE' = 'REMOVE_IMAGE',
    'REMOVE_ALL' = 'REMOVE_ALL',

    DEFAULT = 'DEFAULT'
}

export interface IFilesState {
    file: any
    image: any
}