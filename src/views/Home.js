import React from 'react'
import moment from 'moment'
import { VictoryLine, VictoryAxis, VictoryLabel } from 'victory'
import Slider from '../components/Slider'
import { getStyles, stringToColor } from '../styles/graph-styles'
import { postVisit, getData, getCountries } from '../requests/data'
import CasesTimeSeries from '../components/Charts/CasesTimeSeries'
import { ordinalSuffixOf } from '../utils.js'

class Home extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      cases: null,
      log: true,
      daysToDouble: 3,
      daysSinceNthCase: 100,
      countries: [],
      selectedCountries: ["Italy", "US", "Iran", "Korea, South", "India"],
      query: '',
      maxCases: null,
      windowWidth: window.innerWidth,
      loading: true,
      data: null
    }

    this.inputRef = React.createRef()

    getData(this.state.selectedCountries)
      .then(data => {
        this.setState({loading: false, data})
        getCountries().then(data => {
          this.setState({countries: data})
        })
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

  updateCountries (co) {
    let selectedCountries = this.state.selectedCountries
    selectedCountries.push(co)
    getData(selectedCountries).then(r => {
      this.setState({
        data: r,
        query: '',
        selectedCountries
      })
    })
  }

  onlyUnique (value, index, self) { 
    return self.indexOf(value) === index
  }

  renderCombinedCountriesChart () {
    return (
      <CasesTimeSeries
        data={this.state.data}
        selectedCountries={this.state.selectedCountries}
        daysSinceNthCase={this.state.daysSinceNthCase}
        windowWidth={this.state.windowWidth}
        log={this.state.log}
        daysToDouble={this.state.daysToDouble}
      />
    )
  }

  toggleLog = () => {
    this.setState({log: !this.state.log})
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
                this.updateCountries(co)
              }}>{co}</div>
            )
          })}
        </div>
      )
    }
  }

  renderCountrySearch () {
    return (
      <div className='search'>
        <div style={{postition: 'relative'}}>
          <h4>Search for countries</h4>
          <input ref={this.inputRef} value={this.state.query} onChange={(e) => this.setState({query: e.target.value})} />
          {this.renderDropdown()}
        </div>
        <div className='selected-countries'>
          {this.state.selectedCountries.map(co => {
            return (
              <div className='selected-country' key={this.state.selectedCountries.indexOf(co)}>
                {this.renderSelectedCountry(co)}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  ordinalSuffixOf (i) {
    return ordinalSuffixOf(i)
  }

  logSlider (value) {
    // position will be between 0 and 100
    var minp = 0
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
    var minp = 0
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
        <div className='search-container'>
          {this.renderCountrySearch()}
        </div>
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
              min={1} max={100}
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
          <div className='graphs-container'>
            {this.renderCombinedCountriesChart()}
          </div>
        </div>
      </div>
    )
  }
  
  render () {
    if (this.state.loading) {
      return <div>...</div>
    } else {
      return this.renderContent()
    }
  }
}

export default Home
