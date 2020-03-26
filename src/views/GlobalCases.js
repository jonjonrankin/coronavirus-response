import React from 'react'
import Papa from 'papaparse'
import moment from 'moment'
import { VictoryLine, VictoryAxis } from 'victory'
import Slider from '../components/Slider'
import { getStyles, stringToColor } from '../styles/graph-styles'

class GlobalCases extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      cases: null,
      log: false,
      daysToDouble: 4,
      daysSinceNthCase: 10,
      countries: [],
      maxCases: null,
      windowWidth: window.innerWidth,
      china: false
    }

    this.inputRef = React.createRef()
  }

  componentDidMount () {
    var csvFilePath = require('../assets/time_series_covid19_confirmed_global.csv')
    Papa.parse(csvFilePath, {
      complete: (r) => this.handleData(r),
      header: true,
      download: true,
      skipEmptyLines: true,
      chunk: false
    })

    window.addEventListener('resize', (e) => {
      this.setState({windowWidth: e.target.innerWidth})
    })
  }

  componentWillUnmount () {
    window.removeEventListener('resize', () => null)
  }

  onlyUnique (value, index, self) { 
    return self.indexOf(value) === index
  }

  handleData (r) {
    let countries = r.data.map(d => d['Country/Region']).filter(this.onlyUnique)
    this.setState({cases: r.data, countries})
  }

  renderChart (c) {
    let daysSinceNthCase = this.state.daysSinceNthCase
    let styles = getStyles()
    let cases = this.state.china ? this.state.cases : this.state.cases.filter(co => co['Country/Region'] !== 'China')
  
    let d = []
    cases.forEach(c => {
      Object.keys(c).forEach(day => {
        if (!['Province/State','Country/Region','Lat','Long'].includes(day)) {
          let x = parseInt(moment(day).format('x'))
          let datum = d.find(d => d.x === x)

          if (datum !== undefined) {
            datum.y += parseInt(c[day])
          } else {
            datum = {x: x, y: parseInt(c[day])}
            d.push(datum)
          }
        }
      })
    })

    d = d.filter(datum => datum.y > this.state.daysSinceNthCase)

    let size = this.state.windowWidth < 1000 ? {w: 400, h: 400} : {w: 650, h: 460}

    if (d.length > 1) {
      let firstDay = Math.min.apply(Math, d.map(datum => datum.x))
      d = d.map(datum => {return {x: moment(datum.x, 'x').diff(moment(firstDay, 'x'), 'days'), y: datum.y}})
      let domain = [
        Math.min.apply(Math, d.map(d => d.x)),
        Math.max.apply(Math, d.map(d => d.x)) + Math.max.apply(Math, d.map(d => d.x)) * 0.25
      ]
      let range = [
        daysSinceNthCase,
        Math.max.apply(Math, d.map(d => d.y)) + Math.max.apply(Math, d.map(d => d.y)) * (this.state.log ? 5 : 0.33)
      ]
      return (
        <div style={{margin: '1rem', maxWidth: '100vw', flexGrow: '1'}}>
          <svg style={styles.parent} viewBox={`0 0 ${size.w} ${size.h}`}>
            <VictoryAxis
              dependentAxis
              domain={range}
              standalone={false}
              scale={this.state.log ? 'log' : null}
              tickFormat={d => parseInt(d)}
              tickCount={6}
              style={styles.axis}
              width={size.w} height={size.h}
            />
            <VictoryAxis
              domain={domain}
              standalone={false}
              tickFormat={d => d}
              style={styles.axis}
              width={size.w} height={size.h}
              label={'Days since ' + (this.ordinalSuffixOf(daysSinceNthCase)) + ' case'}
            />
            <g>
              <VictoryLine
                width={size.w} height={size.h}
                scale={this.state.log ? {y: 'log'} : null}
                domain={{x: domain, y: range}}
                standalone={false}
                data={d}
                style={{...styles.line, data: {stroke: 'red'}}}
                interpolation='monotoneX'
              />
            </g>
            <VictoryLine
              width={size.w} height={size.h}
              scale={this.state.log ? {y: 'log'} : null}
              domain={{x: domain, y: range}}
              standalone={false}
              style={{...styles.line, data: {stroke: '#fafafa75', strokeWidth: 1, strokeDasharray: '4, 3' }}}
              y={(d) => {
                let r = (Math.log(2) / this.state.daysToDouble)
                let y = daysSinceNthCase * (Math.exp(1) ** (r * d.x))
                return y
              }}
            />
          </svg>
        </div>
      )
    } else {
      let domain = [
        0,
        50
      ]
      let range = [
        daysSinceNthCase,
        10001
      ]
      return (
        <div style={{margin: '1rem', maxWidth: '100vw', flexGrow: '1'}}>
          <svg style={styles.parent} viewBox={`0 0 ${size.w} ${size.h}`}>
            <VictoryAxis
              dependentAxis
              domain={range}
              standalone={false}
              scale={this.state.log ? 'log' : null}
              tickFormat={d => parseInt(d)}
              tickCount={6}
              style={styles.axis}
              width={size.w} height={size.h}
            />
            <VictoryAxis
              domain={domain}
              standalone={false}
              tickFormat={d => d}
              style={styles.axis}
              width={size.w} height={size.h}
              label={'Days since ' + (this.ordinalSuffixOf(daysSinceNthCase)) + ' case'}
            />
            <VictoryLine
              width={size.w} height={size.h}
              scale={this.state.log ? {y: 'log'} : null}
              domain={{x: domain, y: range}}
              standalone={false}
              style={{...styles.line, data: {stroke: '#fafafa50', strokeWidth: 3}}}
              y={(d) => {
                let r = (Math.log(2) / this.state.daysToDouble)
                let y = daysSinceNthCase * (Math.exp(1) ** (r * d.x))
                return y
              }}
            />
          </svg>
        </div>
      )
    }
  }

  toggleLog = () => {
    this.setState({log: !this.state.log})
  }

  toggleChina = () => {
    if (!this.state.china && this.state.daysSinceNthCase < 600) {
      this.setState({china: !this.state.china, daysSinceNthCase: 600})
    } else {
      this.setState({china: !this.state.china})
    }
  }

  renderSelectedCountry (country) {
    return (
      <p><span onClick={() => {
        let selectedCountries = this.state.selectedCountries
        if (selectedCountries.length > 1) {
          selectedCountries.splice(selectedCountries.indexOf(country), 1)
        }
        this.setState({selectedCountries})
      }} className='exit'>x</span><b style={{color: stringToColor(country)}}>{country}</b></p>
    )
  }

  renderDropdown () {
    if (this.state.query !== '') {
      let countries = this.state.countries.filter(co => co.toLowerCase().includes(this.state.query.toLowerCase()))
      return (
        <div className='select-dropdown' style={{position: 'absolute', border: '1px solid black', width: this.inputRef.current.offsetWidth + 'px'}}>
          {countries.map(co => {
            return (
              <div style={{color: stringToColor(co)}} className='select-dropdown-option' key={countries.indexOf(co)} onClick={() => {
                let selectedCountries = this.state.selectedCountries
                selectedCountries.push(co)
                this.setState({selectedCountries, query: ''})
              }}>{co}</div>
            )
          })}
        </div>
      )
    }
  }

  ordinalSuffixOf (i) {
    var j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
  }

  logSlider (value) {
    // position will be between 0 and 100
    var minp = 7
    var maxp = 100
  
    // The result should be between 100 an 10000000
    var minv = Math.log(1)
    var maxv = Math.log(10000)
  
    // calculate adjustment factor
    var scale = (maxv  - minv) / (maxp - minp)
  
    return Math.round(Math.exp(minv + scale * (value - minp)))
  }

  logPosition (value) {
    // position will be between 0 and 100
    var minp = 7
    var maxp = 100
  
    // The result should be between 100 an 10000000
    var minv = Math.log(1)
    var maxv = Math.log(10000)
  
    // calculate adjustment factor
    var scale = (maxv  - minv) / (maxp - minp)
    
    return (Math.log(value)-minv) / scale + minp
  }

  renderControlPanel () {
    return (
      <div className='control-panel'>
        <div className='slider-container'>
          <h4>Scale</h4>
          <form>
            <input type='radio' checked={!this.state.log} onChange={this.toggleLog} />
            <label style={{marginRight: '8px'}} onClick={this.toggleLog}>Linear</label>
            <input type='radio' checked={this.state.log} onChange={this.toggleLog} />
            <label onClick={this.toggleLog}>Logarithmic</label>
          </form>
        </div>
        <div className='slider-container'>
          <h4>Data to include</h4>
          <form>
            <input type='radio' checked={this.state.china} onChange={this.toggleChina} />
            <label onClick={this.toggleChina}>Everything</label><br />
            <input type='radio' checked={!this.state.china} onChange={this.toggleChina} />
            <label onClick={this.toggleChina}>Everything but China</label>
          </form>
        </div>
        <div className='slider-container'>
          <h4>Reference line</h4>
          <p>Cases double every {this.state.daysToDouble} days</p>
          <div className='combined-countries-slider'>
            <Slider min={1} max={30} initialSliderValue={this.state.daysToDouble} updateValue={(v) => this.setState({daysToDouble: v})} />
          </div>
        </div>
        <div className='slider-container'>
          <h4>Days since {this.ordinalSuffixOf(this.state.daysSinceNthCase)} case</h4>
          <div className='combined-countries-slider'>
            <Slider
              min={this.logPosition(this.state.china ? 600 : 10)} max={100}
              initialSliderValue={this.logPosition(this.state.daysSinceNthCase)}
              updateValue={(v) => this.setState({daysSinceNthCase: this.logSlider(v)})}
            />
          </div>
        </div>
      </div>
    )
  }

  renderContent () {
    return (
      <div>
        <div className='combined-countries-graph'>
          {this.renderControlPanel()}
          {this.renderChart()}
        </div>
      </div>
    )
  }
  
  render () {
    if (this.state.cases) {
      return this.renderContent()
    } else {
      return <div>...</div>
    }
  }
}

export default GlobalCases
