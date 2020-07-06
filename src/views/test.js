import React, {useState, useRef} from 'react'
import Slider from '../components/Slider'
import { stringToColor } from '../styles/graph-styles'
import { getData, getCountries } from '../requests/data'
import CasesTimeSeries from '../components/Charts/CasesTimeSeries'
import NewCasesDaily from '../components/Charts/NewCasesDaily'
import { ordinalSuffixOf } from '../utils.js'
import NewCasesVsTotalCases from '../components/Charts/NewCasesVsTotalCases'

class Test extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      cases: null,
      daysToDouble: 4,
      daysSinceNthCase: 100,
      countries: [],
      query: '',
      maxCases: null,
      windowWidth: window.innerWidth,
      loading: true,
      data: null,
      daysToCountIncreases: 7
    }

    this.inputRef = React.createRef()

    getData()
      .then(data => {
        this.setState({loading: false, data: data.groupedData, countries: data.countries})
      })
      .catch(e => console.log(e))
  }

  componentDidMount () {
    window.addEventListener('resize', (e) => {
      this.setState({windowWidth: e.target.innerWidth})
    })
  }

  componentWillUnmount () {
    window.removeEventListener('resize', () => null)
  }

  getThreeDayAverageIncrease (c, n) {
    let lastNDays = c.cases.slice(c.cases.length - (n+1), c.cases.length - 1)
    let increases = 0
    for (let i = 0; i < lastNDays.length - 1; i++) {
      let increase = 0
      if ((lastNDays[i+1].count - lastNDays[i].count) > 50) {
        increase = (lastNDays[i+1].count - lastNDays[i].count) / lastNDays[i+1].count
      }
      increases += increase
    }
    return (increases / n)
  }

  getBiggestIncreases () {
    let increaseData = []
    this.state.data.forEach(c => {
      let averageIncrease = this.getThreeDayAverageIncrease(c, this.state.daysToCountIncreases)
      increaseData.push({...c, averageIncrease})
    })

    let biggestIncreases = increaseData.sort((a, b) => a.averageIncrease > b.averageIncrease ? -1 : 1).slice(0, 10).map(c => c.country)

    return (
      <CasesTimeSeries
        data={this.state.data}
        selectedCountries={biggestIncreases}
        daysSinceNthCase={100}
        windowWidth={this.state.windowWidth}
        log={true}
        daysToDouble={12}
      />
    )
  }

  render () {
    if (this.state.loading) {
      return <div style={{textAlign: 'center'}}>...</div>
    } else {
      return this.getBiggestIncreases()
    }
  }
}

export default Test
