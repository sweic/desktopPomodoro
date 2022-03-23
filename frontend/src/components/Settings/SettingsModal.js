import React, {useState, useEffect} from 'react'
import Modal from 'react-modal'
function SettingsModal({open, handler, config, saveConfig}) {
    const [page, setPage] = useState(0)
    const [modalConfig, setModalConfig] = useState({"AlarmSound":0,"AutoMove":true,"AutoStartBreak":true,"AutoStartProdogo":true,"DesktopNotifications":false,"LbreakSeconds":600,"ProdogoSeconds":1500,"Rest":4,"SbreakSeconds":300})

    const pageHandler = e => {
        e.preventDefault(e)
        setPage(e.target.value)
    }

    const handleChange = (e) => {
        let property = Object.assign({}, modalConfig);
        const target = e.target.id
        const curr = modalConfig[target]
        property[target] = !curr
        setModalConfig(property)
        
    }

    const handleInput = (e) => {
        e.preventDefault()
      
        let property = Object.assign({}, modalConfig);
        const target = e.target.id
        
        if (target != "Rest") {
            property[target] = (e.target.value) * 60
        } else {
            property[target] = e.target.value * 1
        }
        
        setModalConfig(property)
    }

    const validation = () => {
        if (Number.isInteger(modalConfig.ProdogoSeconds / 60) && Number.isInteger(modalConfig.SbreakSeconds / 60) && Number.isInteger(modalConfig.LbreakSeconds / 60) && Number.isInteger(modalConfig.Rest) && modalConfig.ProdogoSeconds < 3600 && modalConfig.SbreakSeconds < 3600 && modalConfig.LbreakSeconds < 3600 && modalConfig.Rest > 0 && modalConfig.ProdogoSeconds > 0 && modalConfig.SbreakSeconds > 0 && modalConfig.LbreakSeconds > 0 ) {
            return true
        }
        return false
    }

    const handleSaveConfig = e => {
        e.preventDefault()
        if (validation()) {
            saveConfig(modalConfig)
            handler(e)
        }
        
       
    }

    useEffect(() => {
        setModalConfig(config)
    }, [config])

  return (
    <Modal className="modal-container"  onRequestClose={handler} isOpen={open} contentLabel={"Settings Modal"}>
        <div className="settings-modal-container">
            <div className="pagination-container">
                <button className="pro-btn"value={0} onClick={(e) => pageHandler(e)}>Time</button>
                <button className="pro-btn"value={1} onClick={(e) => pageHandler(e)}>Ease</button>
            </div>
            <div className="settings-divider"></div>
            {page == 0 && <div><div className="timer-config-box">
                <p>Prodogo Time</p>
                <input id="ProdogoSeconds" onChange={(e) => {handleInput(e)}} value={parseFloat((modalConfig.ProdogoSeconds / 60).toFixed(2))} min={0.166666666666667} max={3600} type="number"></input>
            </div>
            <div className="timer-config-box">
                <p>Short Break Time</p>
                <input id="SbreakSeconds" onChange={(e) => {handleInput(e)}}  value={parseFloat((modalConfig.SbreakSeconds / 60).toFixed(2))} min={0.166666666666667} max={3600}  type="number"></input>
            </div>
            <div className="timer-config-box">
                <p>Long Break Time</p>
                <input  id="LbreakSeconds" onChange={(e) => {handleInput(e)}}  value={parseFloat((modalConfig.LbreakSeconds / 60).toFixed(2))}  min={0.166666666666667} max={3600}  type="number"></input>
            </div>
            <div className="timer-config-box">
                <p>Long Break Interval</p>
                <input id="Rest" onChange={(e) => {handleInput(e)}}  value={parseFloat((modalConfig.Rest))}min="1" type="number"></input>
            </div>
            <div className="settings-divider"></div></div>}
            {page == 1 && <div><div className="timer-config-box">
                <p>Automatically Move to Next</p>
                <label className="switch">
                    <input id="AutoMove" onChange={(e) => handleChange(e)}checked={modalConfig.AutoMove} type="checkbox"/>
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="timer-config-box">
                <p>Automatically Start Break</p>
                <label className="switch">
                    <input id="AutoStartBreak" onChange={(e) => handleChange(e)}checked={modalConfig.AutoStartBreak} type="checkbox"/>
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="timer-config-box">
                <p>Automatically Start Prodogo</p>
                <label className="switch">
                    <input id="AutoStartProdogo" onChange={(e) => handleChange(e)}checked={modalConfig.AutoStartProdogo} type="checkbox"/>
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="settings-divider"></div>
            <div className="timer-config-box">
                <p>Desktop Notifications</p>
                <label className="switch">
                    <input id="DesktopNotifications" onChange={(e) => handleChange(e)}checked={modalConfig.DesktopNotifications}type="checkbox"/>
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="settings-divider"></div></div>}
            <div className="history-modal-btn-container">
                <button className="pro-btn" onClick={(e) => handleSaveConfig(e)} >Save</button>
                <button className="pro-btn" onClick={(e) => handler(e)}>Close</button>
            </div>
            
            
                
            

        </div>
    </Modal>
  )
}

export default SettingsModal