import React, { useState, useRef} from 'react'
import useClickOutSide from '../hooks/useClickOutSide';
import './Element.css'

const Element = ({ id, nextStep, syntaxTreeJson, updateSyntaxTree }) => {
    const ref = useRef(null);
    const [showRemove, showRemoveChange] = useState(false);
    const [deleteFormula, SetDeleteFormula] = useState(false);
    useClickOutSide(ref, (e) => {
        showRemoveChange(false);
    })

    const handleDeleteFormula = (e) => {
        SetDeleteFormula(true);
        updateSyntaxTree(id);
    }

    return (
        <>
            {deleteFormula?
                null
                :
                <div ref={ref} className='container'>
                    <div className={showRemove ? 'canRemoveModule-clicked': 'canRemoveModule'} id={id} onClick={()=> showRemoveChange(true)}>{nextStep}</div>
                    {showRemove ? <div className='deleteIcon' onClick={handleDeleteFormula}>X</div> : null}
                </div>
            }
        </>
    )
}

export default Element