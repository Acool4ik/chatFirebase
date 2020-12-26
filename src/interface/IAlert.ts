export enum EAlert {
    warning = 'warning',
    error = 'error',
    success = 'success'
}

type TAlert = 'warning' | 'error' | 'success'

export interface IAlert {
    status: TAlert
    title: string
    setAlert: any
}

export interface IAlertState {
	isAlert: boolean
	info: {
		status: TAlert
		title: string
	}
}


