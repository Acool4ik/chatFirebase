import { FilesEnum, initialReduser } from './types';

const handlers = {
    [FilesEnum.ADD_FIlE]: (state, { payload }) => ({...state, file: payload}), 
    [FilesEnum.ADD_IMAGE]: (state, { payload }) => ({...state, image: payload}), 
    [FilesEnum.ADD_ALL]: (state, { payload }) => ({...state, file: payload[0], image: payload[1]}), 

    [FilesEnum.REMOVE_FIlE]: (state) => ({...state, file: null}),
    [FilesEnum.REMOVE_IMAGE]: (state) => ({...state, image: null}),
    [FilesEnum.REMOVE_ALL]: (state) => ({...state, ...initialReduser}),

    [FilesEnum.DEFAULT]: state => state
};

export const filesReduser = (state, action) => {
    const handle = handlers[action.type] || handlers[FilesEnum.DEFAULT]

    return handle(state, action)
}