import React from 'react'
import ReactDOM from 'react-dom'
import { onConfirm } from 'react-confirm-pro';
import "./Notify_Suc.scss";


const deledeCon = () => {
    const defaultOptions = {
        title: (
            <h3>
                Are you sure?
            </h3>
        ),
        description: (
            <p>Do you really want to delete this records? This process cannot be undone.</p>
        ),
        onSubmit: () => {
            alert("Submit")
        },
        onCancel: () => {
            alert("Cancel")
        },
    };
    const onClickDark = () => {
        onConfirm({
            ...defaultOptions,
            type: "dark",
            btnSubmit: "Confirm ",
            btnCancel: "Cancel ",
            keyboardEvents: {
                escape: true,
                submit: true
            }
        })
    };
    return (
        <div className='react-confirm-pro__preview'>
            <div className='react-confirm-pro__actions'>
                <button type="button" onClick={onClickDark}>Dark</button>
            </div>
        </div>
    )
}

export default deledeCon
