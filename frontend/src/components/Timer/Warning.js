import React from 'react'

import {useState} from 'react'
import '../../styles/Warning.css'

function Warning({shown, warningChoice}) {
    var final = null;
    switch(shown) {
        case true:
            final = "animate__fadeInDown"
            break
        case false:
            final = "animate__fadeOutUp"
            break
        default:
            final = null
            break
    }
    const handler = (e) => {
        e.preventDefault()
        warningChoice(e.target.value)

    }
  return (
      <div className="warning-container">
        <div className={`animate__animated ${final} warning-container-box`}>
            <div className="warning-text-container">
                <p>You are halfway there! Are you sure you want to switch?</p>
            </div>
            <div className="warning-btn-container">
                <button  className="pro-btn" value={true} onClick={(e) => handler(e) }>Yes</button>
                <button className="pro-btn" value={false} onClick={(e) => handler(e) }>No</button>
            </div>
            
        </div>
  </div>
  )
}

export default Warning
