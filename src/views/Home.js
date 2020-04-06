import React from 'react'
import Slider from '../components/Slider'
import { stringToColor } from '../styles/graph-styles'
import { getData, getCountries } from '../requests/data'
import CasesTimeSeries from '../components/Charts/CasesTimeSeries'
import { ordinalSuffixOf } from '../utils.js'

class Home extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      cases: null,
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

  updateCountries (co) {
    let selectedCountries = this.state.selectedCountries
    selectedCountries.push(co)
    this.setState({
      query: '',
      selectedCountries
    })
  }

  renderCombinedCountriesChart (log) {
    return (
      <CasesTimeSeries
        data={this.state.data}
        selectedCountries={this.state.selectedCountries}
        daysSinceNthCase={this.state.daysSinceNthCase}
        windowWidth={this.state.windowWidth}
        log={log}
        daysToDouble={this.state.daysToDouble}
      />
    )
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
          <input ref={this.inputRef} placeholder='search for a country' value={this.state.query} onChange={(e) => this.setState({query: e.target.value})} />
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
        <h2>control panel</h2>
        <div className='search-container'>
          {this.renderCountrySearch()}
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
      <div className='home'>
        <div className='control-panel-container'>
          {this.renderControlPanel()}
        </div>
        <div className='graphs-container'>
          <h1>The big picture</h1>
          <p>
            Making sense of the coronavirus numbers you hear in the media can be a challenge. 
            COVID LENS helps you explore the data to see the trends that matter to you. 
            These charts illustrate the how rapidly COVID-19 cases are growing in the countries you've selected in the control panel.
          </p>
          <br /><br />
          <h2>Growth in cases since the {ordinalSuffixOf(this.state.daysSinceNthCase)} case</h2>
          <p>This chart shows how rapidly the COVID-19 disease has spread since each country's {ordinalSuffixOf(this.state.daysSinceNthCase)}</p>
          <div className='combined-countries-graph'>
            {this.renderCombinedCountriesChart(false)}
          </div>
          <h2>Growth in cases since the {ordinalSuffixOf(this.state.daysSinceNthCase)} case</h2>
          <p>This is the same chart on a logarithmic scale. A straight line on a logarithmic scale represents exponential growth. Adjust the reference line on the control panel to see how the logarithmic scale distorts the data.</p>
          <div className='combined-countries-graph'>
            {this.renderCombinedCountriesChart(true)}
          </div>
        </div>
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

export default Home
