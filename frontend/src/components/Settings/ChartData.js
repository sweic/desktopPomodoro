import React from 'react'
import {Line} from 'react-chartjs-2'


function ChartData({data}) {
    
    const dataC = {
      labels: data.datesArr,
      datasets: [
        {
          label: "Minutes spent",
          data: data.dataArr,
          backgroundColor: '#db635e'
        }
      ]
    }

    const legend = {
      position: "bottom"
    }

    const options = {
      scales: {
        yAxes: [
          {ticks: {
            beginAtZero: true
          }}
        ]
      }
    }
    
  return (
    <div>
        <Line data={dataC} legend={legend} options={options}/>
    </div>
  )
}

export default ChartData