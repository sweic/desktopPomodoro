import React, { useEffect } from 'react';
import './styles/App.css';
import Timer from './components/Timer/Timer.js'
import {useState} from 'react'
import 'animate.css' 
import {DEFAULTCONFIG} from './constants/constants.js'

function App() {

  const [mode, setMode] = useState('ProdogoSeconds')
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState(DEFAULTCONFIG)
  const [historyChart, setHistoryChart] = useState([])

  useEffect(() => {
    window.backend.Helper.FetchConfig().then((data) => {
      setConfig(data)
      setLoading(false)
    })
    window.backend.Helper.FetchHistoryChart().then((data) => {
      setHistoryChart(data)
    })

  }, [])

  const setModeParent = (parent) => {
    setMode(parent)
  }

  return (
    <div id="app" className="App">
      {loading && <div className="loading"></div>}
      <div className={`main-container ${mode}`}>
        <Timer chartData={historyChart} mode={mode} setModeParent={setModeParent} timerInit={config}/>
      </div>
    </div>
  );
}

export default App;
