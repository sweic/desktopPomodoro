import React, {useEffect, useState} from 'react'
import Modal from 'react-modal'
import ChartData from "./ChartData"

function HistoryModal({open, handler}) {
  const [data, setData] = useState({})

  useEffect(() => {
    window.backend.Helper.FetchHistoryChart().then((data) => {
      setData(data)
    })
  }, [])

  

  const handleRefresh = (e) => {
    e.preventDefault()
    window.backend.Helper.FetchHistoryChart().then((data) => {
      setData(data)
    })
  }

  return (
    <Modal className="modal-container" onRequestClose={handler} isOpen={open} contentLabel={"History Modal"}>
        <div className="history-modal-container">
          <div className="chart-selection-container">
            <h4>Time spent (Last 7 Days) </h4>
          </div>
          <div className="chart-data-container">
          <ChartData  data={data}/>
          </div>
        </div>
        <div className="history-modal-btn-container">
          <button className="pro-btn" onClick={(e) => handleRefresh(e)}>Refresh Data</button>
          <button className="pro-btn" onClick={(e) => handler(e)}>Close</button>

        </div>
        
    </Modal>
  )
}

export default HistoryModal