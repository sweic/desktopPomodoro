import React, {useState} from "react"
import { DEFAULTCONFIG } from "../constants/constants"
export const useTimer = () => { 
 
  const [timerSeconds, setTimerSeconds] = useState(DEFAULTCONFIG)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [minutes, setMinutes] = useState("00")
  const [seconds, setSeconds] = useState("00")
  const [toChange, setToChange] = useState('SbreakSeconds')
  const [start, setStart] = useState(false)
  const [rest, setRest] = useState(0)

  const changeMode = (changer, setModeParent) => {
    setTotalSeconds(timerSeconds[changer])
    setModeParent(changer)
    calc(timerSeconds[changer], setMinutes, setSeconds)
     
  }
  
  const decrementTime = (mode, rest, setModeParent) => {
    var timerID;
    if (start && totalSeconds > -1) {
      timerID = setInterval(() => {
      
        setTotalSeconds(totalSeconds - 1)
        calc(totalSeconds, setMinutes, setSeconds)
      
    }, 1000);
    }

    if (totalSeconds == -1) {
      setTotalSeconds(-2)
      saveEvent(mode)
      setStart(false)
      if (mode === "ProdogoSeconds") {
        setRest(rest + 1)
      }
      if (timerSeconds.Rest <= rest + 1 ) {
        if (mode === "LbreakSeconds") {
          setRest(0)
        }
        if (mode === "ProdogoSeconds") {
          changeMode('LbreakSeconds', setModeParent)
        } else {
          changeMode('ProdogoSeconds', setModeParent)
        }

      } else if (timerSeconds.Rest > rest) {
        if (mode === "ProdogoSeconds") {
          changeMode('SbreakSeconds', setModeParent)
          
        } else if (mode === "LbreakSeconds") {
          setRest(0)
          changeMode('ProdogoSeconds', setModeParent)

        } else {
          changeMode('ProdogoSeconds', setModeParent)
        }
          
        
      } 
      
      
    }
    return timerID
    
  }

  const saveEvent = (mode) => {
    const current = new Date()
    const y = current.getFullYear().toString()
    const m = (current.getMonth() + 1).toString().padStart(2, "0")
    const d = current.getDate().toString().padStart(2, "0")
    const finalDate = y.concat(m).concat(d)


    const eventDetails = {
      "date": finalDate, 
      "mode": mode,
      "timeTaken": timerSeconds[mode].toString(),

    }
    window.backend.Helper.Update(eventDetails)
  }

  const configChange = (mode, configuration) => {
    setTimerSeconds(configuration)
    const curr = configuration[mode]
    calc(curr, setMinutes, setSeconds)
    setTotalSeconds(curr)
    window.backend.Helper.SaveConfig(configuration)

  }
  
  const resetTimer = (mode) => {
    setStart(false)
    const targetSeconds = timerSeconds[mode]
    setTotalSeconds(targetSeconds)
    calc(targetSeconds, setMinutes, setSeconds)
  }
  

  return {rest, setRest, start, setStart, changeMode, timerSeconds, setTimerSeconds, totalSeconds, setTotalSeconds, minutes, setMinutes, seconds, setSeconds, toChange, setToChange, decrementTime, configChange, resetTimer}
  
}

export const calc = (total, setMinutes, setSeconds) => {
    var currTotal = total
    var hours = "00"
    var minutes = "00"
    if (currTotal / 3600 >= 1) {
      var hours = Math.floor(currTotal / 3600).toString().padStart(2, "0")
      currTotal = currTotal % 3600
    }
    if (currTotal / 60 >= 1) {
      var minutes = Math.floor(currTotal / 60).toString().padStart(2, "0")
      currTotal = currTotal % 60
    }

    setMinutes(minutes)
    setSeconds(currTotal.toString().padStart(2, "0"))
   
    return [hours, minutes, currTotal.toString().padStart(2, "0")]
}

export const checkMoved = (mode, total, timerSeconds) => {
    var initialSeconds = 0
    initialSeconds = timerSeconds[mode]
    if (initialSeconds !== total) {
      return true
    }
    return false

}
