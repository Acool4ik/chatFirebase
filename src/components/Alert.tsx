import React, { useEffect } from 'react'
import { IAlert } from '../interface/IAlert'

export const Alert: React.FC<IAlert> = ({status, title, setAlert}) => {

    useEffect(() => {
        setTimeout(() => setAlert((prev: any) => ({...prev, isAlert: false})), 4000)
    })

    return (
        <div className={`position-fixed d-flex justify-content-between align-items-center flex-wrap alert alert-${status} alert-dismissible fade show pr-1 pl-3`}
            style={{ top: 'calc(79px + 7vh)', zIndex: 10000, maxWidth: 'calc(584px)', width: '100%' }}
        >
            <div>
                <strong>{status}!</strong>{' '} {title}
            </div>
            
            <button type="button" className="close text-center position-static"
               onClick={() => setAlert((prev: any) => ({...prev, isAlert: false}))}
            >
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    )
}