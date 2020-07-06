import React, {useState, useRef} from 'react'
import Slider from '../components/Slider'
import { stringToColor } from '../styles/graph-styles'
import { getData, getCountries } from '../requests/data'
import CasesTimeSeries from '../components/Charts/CasesTimeSeries'
import NewCasesDaily from '../components/Charts/NewCasesDaily'
import { ordinalSuffixOf } from '../utils.js'
import NewCasesVsTotalCases from '../components/Charts/NewCasesVsTotalCases'
import { Link } from 'react-router-dom'

const Search = (props) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  const updateCountries = (c, bool) => {
    setQuery('')
    props.updateCountries(c, bool)
  }

  const renderDropdown = () => {
    if (query !== '') {
      let countries = props.countries.filter(co => co.toLowerCase().includes(query.toLowerCase()))
      return (
        <div className='select-dropdown' style={{position: 'absolute', border: '1px solid black', width: inputRef.current.offsetWidth + 'px'}}>
          {countries.map(co => {
            return (
              <div style={{color: stringToColor(co)}} className='select-dropdown-option' key={countries.indexOf(co)} onClick={() => {
                updateCountries(co, true)
              }}>{co}</div>
            )
          })}
        </div>
      )
    }
  }

  const renderSelectedCountry = (country) => {
    return (
      <p><span onClick={() => updateCountries(country, false)} className='exit'>x</span><b style={{color: stringToColor(country)}}>{country}</b></p>
    )
  }

  return (
    <div className='search'>
      <div style={{postition: 'relative'}}>
        <input ref={inputRef} placeholder='search for a country' value={query} onChange={(e) => setQuery(e.target.value)} />
        {renderDropdown()}
      </div>
      <div className='selected-countries'>
        {props.selectedCountries.map(co => {
          return (
            <div className='selected-country' key={props.selectedCountries.indexOf(co)}>
              {renderSelectedCountry(co)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

class Home extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      cases: null,
      daysToDouble: 4,
      daysSinceNthCase: 100,
      countries: [],
      selectedCountries: ["Brazil", "India", "Korea, South"],
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

  updateCountries (co, bool) {
    console.log(co)
    let selectedCountries = this.state.selectedCountries
    if (bool) {
      selectedCountries.push(co)
    } else {
      selectedCountries = selectedCountries.filter(c => c !== co)
    }
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
  
  renderDailyIncreaseGraph () {
    return (
      this.state.selectedCountries.map(c => {
        return (
          <NewCasesDaily daysToDouble={this.state.daysToDouble} key={this.state.selectedCountries.indexOf(c)} data={this.state.data.find(d => d.country === c)} daysSinceNthCase={this.state.daysSinceNthCase} windowWidth={this.state.windowWidth}/>
        )
      })
    )
  }

  renderNewCasesVsTotalCases () {
    return (
      this.state.selectedCountries.map(c => {
        return (
          <NewCasesVsTotalCases daysToDouble={this.state.daysToDouble} key={this.state.selectedCountries.indexOf(c)} data={this.state.data.find(d => d.country === c)} daysSinceNthCase={this.state.daysSinceNthCase} windowWidth={this.state.windowWidth}/>
        )
      })
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
          <Search countries={this.state.countries} selectedCountries={this.state.selectedCountries} updateCountries={(c, bool) => this.updateCountries(c, bool)} />
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
          <h2>Growth in cases since the {ordinalSuffixOf(this.state.daysSinceNthCase)} case</h2>
          <p>
            This chart shows how rapidly the COVID-19 disease has spread since each country's {ordinalSuffixOf(this.state.daysSinceNthCase)} case. 
            You can adjust the start date in the control panel.
          </p>
          <div className='combined-countries-graph'>
            {this.renderCombinedCountriesChart(false)}
          </div>
          <h2>Growth in cases since the {ordinalSuffixOf(this.state.daysSinceNthCase)} case</h2>
          <p>This is the same chart on a logarithmic scale. A straight line on a logarithmic scale represents exponential growth. Adjust the reference line on the control panel to see how the logarithmic scale distorts the data.</p>
          <div className='combined-countries-graph'>
            {this.renderCombinedCountriesChart(true)}
          </div>
          <h1>How do we know if things are getting better?</h1>
          <p>
            Accelerating growth in cases only ends when the number of new cases each day starts to stall or decrease. 
            Some countries have already made progress on this front, while others still struggle with growing daily increases.
          </p>
          <h2 style={{marginTop: '2rem', marginBottom: '1rem'}}>New cases each day</h2>
          <div className='daily-increase-graphs'>
            {this.renderDailyIncreaseGraph()}
          </div>
          {/* <p>
            Uncontrolled growth in cases can only be avoided if the number of new cases each day starts to decrease. 
            Some countries have already made progress on this front, while others still struggle with growing daily increases.
          </p>
          <div className='new-cases-vs-total-cases-graphs'>
            {this.renderNewCasesVsTotalCases()}
          </div> */}
          <Link to='/'>See United States data 👉</Link>
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
