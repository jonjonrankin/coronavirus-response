import React from 'react'
import populationData from '../assets/populationData.json'
import Papa from 'papaparse'
import moment from 'moment'
import StatesIncrease from '../components/StatesIncrease'
import StatesPop from '../components/StatesPop'
import { Link } from 'react-router-dom'

class US extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      data: null,
      today: null,
      sliderValue: 0
    }

    this.dataUrl = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv'

    this.getData()
  }

  parseData = (data) => {
    let today = this.state.today ? this.state.today : moment(data[data.length - 1].date).format('YYYY-MM-DD')

    let differences = []

    for (let i = 0; i < data.length; i++) {
      if (data[i].date === moment(today, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD')) {
        let datum = data[i]
        let oneWeekEarlier = data.find(d => d.fips === datum.fips && d.date === moment(today, 'YYYY-MM-DD').subtract(7, 'days').format('YYYY-MM-DD'))
        if (oneWeekEarlier) {
          let oneWeekEarlierCases = oneWeekEarlier.cases
          let difference = parseInt(datum.cases) - parseInt(oneWeekEarlierCases)
          let oneWeekPercentIncrease = difference / parseInt(oneWeekEarlierCases)
          differences.push({...datum, difference, oneWeekPercentIncrease})
        }
      }
    }

    return differences
  }

  async getData () {
    let data = await Papa.parsePromise(this.dataUrl)
    this.setState({
      data: this.parseData(data.data),
      popData: populationData,
      fullData: data.data,
      loading: false
    }) 
  }

  updateData () {
    let data = this.state.fullData
    this.setState({
      data: this.parseData(data)
    })
  }

  getDate (i) {
    i = 1000 - parseInt(i)
    let today = moment().subtract(1, 'days').format('YYYY-MM-DD')

    if (i === 0) {
      return moment().subtract(1, 'days').format('YYYY-MM-DD')
    } else {
      let daysBetweenTodayAndApril20 = moment(today).diff(moment('2020-04-20'), 'days')
      let daysAgo = (i / 1000) * daysBetweenTodayAndApril20
      return moment().subtract(daysAgo, 'days').format('YYYY-MM-DD')
    }
  }

  renderContent () {
    return (
      <div className='us-container'>
        {/* <div className='date-picker'>
          <div>Previous week</div>
          <label>Seeing data from: {this.state.today}</label>
          <div>Next week</div>
          <input className='range' type='range' min={0} max={1000} onChange={(e) => {
            this.setState({today: this.getDate(e.target.value), sliderValue: e.target.value})
            console.log(this.getDate(e.target.value))
            this.updateData()
          }} />
        </div> */}
        <h1>One Week Increase in COVID-19 Cases by State</h1>
        <p>Click on a state to see more</p>
        <StatesIncrease data={this.state.data} fullData={this.state.fullData} />
        <h1>COVID-19 Cases per Thousand Residents</h1>
        <p>Click on a state to see more</p>
        <StatesPop data={this.state.data} fullData={this.state.fullData} popData={this.state.popData} />
        <Link to='/global'>See the global data 👉</Link>
      </div>
    )
  }

  render () {
    if (this.state.loading) {
      return <div style={{textAlign: 'center'}}>...</div>
    } else {
      return this.renderContent()
    }
  }
}

export default US
