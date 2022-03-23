import React from 'react'
import {useState, useEffect} from 'react'
import '../../styles/Timer.css'
import {calc, checkMoved, useTimer} from '../../api/calc.js'
import Warning from "./Warning"
import '../../styles/Settings.css'
import { RiRestartLine } from 'react-icons/ri';
import Modal from 'react-modal'
import SettingsModal from "../Settings/SettingsModal"
import HistoryModal from "../Settings/HistoryModal"
import { AiOutlineSetting, AiOutlineHistory } from 'react-icons/ai';
import {MdOutlineFreeBreakfast} from 'react-icons/md'

function Timer({chartData, mode, setModeParent, timerInit}) {
 
  const [err, setErr] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
    const [reportOpen, setReportOpen] = useState(false)


    const reportHandler = (e) => {
        e.preventDefault()
        setReportOpen(!reportOpen)
    }

    const settingsHandler = (e) => {
        e.preventDefault()
        setSettingsOpen(!settingsOpen)
    }

    
    Modal.setAppElement('#app');
    
  
  

  const {rest, setRest, start, setStart, changeMode, timerSeconds, setTimerSeconds, totalSeconds, setTotalSeconds, minutes, setMinutes, seconds, setSeconds, toChange, setToChange, decrementTime, configChange, resetTimer} = useTimer() 
  
  useEffect(() => {
    var timerID;
    timerID = decrementTime(mode, rest, setModeParent)
    return () => {clearInterval(timerID); console.log("Cleared!")}
  })

  useEffect(() => {
    setTimerSeconds(timerInit)
    calc(timerInit.ProdogoSeconds, setMinutes, setSeconds)
    setTotalSeconds(timerInit.ProdogoSeconds)
  
    
  }, [timerInit])

  const clickHandler = e => {
    e.preventDefault()
    setStart(!start)
  }

  const changeHandler = (e) =>  {
    if (mode == e.target.value) return
    e.preventDefault()
    if (checkMoved(mode, totalSeconds, timerSeconds)) {
      setErr(true)
      setStart(false)
      setToChange(e.target.value)
     
    } else {
      setStart(false)
      changeMode(e.target.value, setModeParent)
    }
  }

  const choiceHandler = (accept) => {
    if (accept === "true") {
      setErr(false)
      changeMode(toChange, setModeParent)
      setStart(false)
    } else {
      setErr(false)
    }
  }

  const saveConfig = (configuration) => {
    setTimerSeconds(configuration)
    configChange(mode, configuration)
  }

  const resetHandler = e => {
    e.preventDefault()
    if (checkMoved(mode, totalSeconds, timerSeconds)) {
      setErr(true)
      setStart(false)
      setToChange(mode)
    } else {
      setStart(false)
      changeMode(mode, setModeParent)
    }
  }


  return (
    <div className="timer-container animate__animated animate__fadeIn animate__delay-1s">
      <Warning shown={err} warningChoice={choiceHandler}/>
      <div className={`time-c ${mode}box`}>
        <div className="selection-c">
          <div className="selection-btn-c">
            <button  value={'ProdogoSeconds'}   onClick={(e) => changeHandler(e)} className={mode === "ProdogoSeconds" ? `selection-btn ${mode}box active${mode}` : `selection-btn ${mode}box `}>Prodogo</button>
          </div>
          <div className="selection-btn-c">
            <button value={'SbreakSeconds'}  onClick={(e) => changeHandler(e)} className={mode === "SbreakSeconds" ? `selection-btn ${mode}box active${mode}` : `selection-btn ${mode}box`}>Short Break</button>
          </div>
          <div className="selection-btn-c">
            <button value={'LbreakSeconds'} onClick={(e) => changeHandler(e)} className={mode === "LbreakSeconds" ? `selection-btn ${mode}box active${mode}` : `selection-btn ${mode}box`}>Long Break</button>
          </div>
        </div>
        <div className="time-number-c">
          <span id="minutes">
            {minutes}
          </span>
          <span>:</span>
          <span id="seconds">
            {seconds}
          </span>
        </div>
        <div className="start-btn-container">
          <div className="start-btn-container-item">
            <div className="settings-container-dual refresh">
              <RiRestartLine className={`${mode}btns settings-btn-icon refresh-icon`} onClick={(e) => resetHandler(e)}/>
              <div className="tooltipbox" data-text={timerSeconds.Rest < rest ? `${timerSeconds.Rest}/${timerSeconds.Rest}` : `${rest}/${timerSeconds.Rest}`}><MdOutlineFreeBreakfast  className={`${mode}btns settings-btn-icon break tooltip`}/></div>
             
             </div>
            <button className={`toggle-btn text-${mode} status-${start ? "start" : "stop"}` } onClick={(e) => clickHandler(e)}>{start ?  "STOP" : "START"}</button>
            <div className="settings-container-dual right-side animate__animated animate__fadeIn animate__delay-1s">
              <AiOutlineHistory className={`${mode}btns settings-btn-icon`} onClick={(e) => reportHandler(e)}/>
              <AiOutlineSetting className={`${mode}btns settings-btn-icon`} onClick={(e) => settingsHandler(e)}/>
            </div>
            <SettingsModal saveConfig={saveConfig} config={timerInit} open={settingsOpen} handler={settingsHandler}/>
            <HistoryModal chartData={chartData} config={timerInit} open={reportOpen} handler={reportHandler}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Timer