import React from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import moment from 'moment'
import {Flipper, Flipped} from 'react-flip-toolkit'
import shuffleSeed from 'shuffle-seed'

const CasesPerThousand = (props) => {
  let cases = []

  for (let i = 0; i < 1000; i++) {
    let className
    if (i < Math.round(props.casesPerThousand)) {
      className = 'case positive'
    } else {
      className = 'case negative'
    }
    cases.push(<div key={i} className={className} />)
  }


  cases = shuffleSeed.shuffle(cases, props.state.state)

  return (
    <div
      className='states-pop-cases'
    >
      {cases.map(d => {
        return d
      })}
    </div>
  )
}

class StatesPop extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
    this.geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'
  }

  HSVtoRGB (h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
      s = h.s
      v = h.v
      h = h.h
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      default:
        r = v
        g = t
        b = p;
        break;
      case 1:
        r = q
        g = v
        b = p;
        break;
      case 2:
        r = p
        g = v
        b = t;
        break;
      case 3:
        r = p
        g = q
        b = v;
        break;
      case 4:
        r = t
        g = p
        b = v;
        break;
      case 5:
        r = v
        g = p
        b = q;
        break;
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
  }

  rainbow (p) {
    let alpha = (p / 100) * 3000
    var rgb = this.HSVtoRGB(0.65, alpha, 1);
    return 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
  }

  getXFormatDate (date) {
    return parseInt(moment(date, 'YYYY-MM-DD').format('X'))
  }

  renderDailyCasesChart () {
    const state = this.state.persistentChoice

    let population = this.props.popData.filter(pd => pd.us_state_fips === state.geo.id).reduce((i, currentValue) => {
      let pop = parseInt(currentValue.population)
      return i + pop
    }, 0)
  
    let casesPerThousand = Math.round((state.cases / population) * 100000) / 100

    return (
      <CasesPerThousand casesPerThousand={casesPerThousand} state={state} />
    )
  }

  renderHover () {
    const h = this.state.persistentChoice
    if (h) {
      let population = this.props.popData.filter(pd => pd.us_state_fips === h.geo.id).reduce((i, currentValue) => {
        let pop = parseInt(currentValue.population)
        return i + pop
      }, 0)
      return (
        <Flipped flipId={this.state.persistentChoice.geo.id}>
          <div className='us-detail'>
            <h1>{h.state}</h1>
            <table>
              <tr>
                <td>Population</td>
                <td>{population}</td>
              </tr>
              <tr>
                <td>Total cases in state</td>
                <td>{h.cases}</td>
              </tr>
              <tr>
                <td>Cases per thousand residents</td>
                <td>{Math.round((h.cases / population) * 100000) / 100}</td>
              </tr>
            </table>
            {this.renderDailyCasesChart()}
          </div>
        </Flipped>
      )
    } else {
      return null
    }
  }

  hoverOrChoiceEqualToState (geo) {
    if (this.state.hovering) {
      if (this.state.hovering.fips === geo.id) return true
    }

    if (this.state.persistentChoice) {
      if(this.state.persistentChoice.fips === geo.id) return true
    }

    return false
  }

  renderContent () {
    return (
      <div className='states-pop-container'>
        <Flipper animateEnt flipKey={this.state.persistentChoice} className='states-pop' spring={'stiff'}>
          {this.renderHover()}
          <Flipped flipId={1}>
            <div className='map-wrapper'>
              <div className='content'>
                <div className='legend'>
                  <div className='col'>
                    <div className='legend-box' style={{background: this.rainbow(0.0000)}} />
                    <div className='legend-box' style={{background: this.rainbow(0.0050)}} />
                    <div className='legend-box' style={{background: this.rainbow(0.0100)}} />
                    <div className='legend-box' style={{background: this.rainbow(0.0150)}} />
                    <div className='legend-box' style={{background: this.rainbow(0.0200)}} />
                    <div className='legend-box' style={{background: this.rainbow(0.0250)}} />
                  </div>
                  <div className='col'>
                    <div>0</div>
                    <div>5</div>
                    <div>10</div>
                    <div>15</div>
                    <div>20</div>
                    <div>25</div>
                  </div>
                </div>
                <div className='map'>
                  <ComposableMap projection="geoAlbersUsa">
                    <Geographies geography={this.geoUrl}>
                      {({geographies}) => geographies.sort((g1) => this.state.persistentChoice ? (this.hoverOrChoiceEqualToState(g1) ? 1 : -1) : -1).map(geo => {
                        let stateData = this.props.data.find(d => parseInt(d.fips) === parseInt(geo.id))
                        let color = '#DDD'

                        if (stateData) {
                          let population = this.props.popData.filter(pd => pd.us_state_fips === geo.id).reduce((i, currentValue) => {
                            let pop = parseInt(currentValue.population)
                            return i + pop
                          }, 0)
                          let percentInfected = stateData.cases / population
                          color = this.rainbow(percentInfected)
                        }

                        let isCurrent = this.hoverOrChoiceEqualToState(geo)

                        return (
                          <Geography
                            style={{
                              outline: 'none'
                            }}
                            className={this.state.persistentChoice ? (this.state.persistentChoice.geo.id === geo.id ? 'hot' : 'not') : 'not'}
                            key={geo.rsmKey}
                            geography={geo}
                            fill={color}
                            stroke={isCurrent ? '#FFF' : '#000'}
                            strokeWidth={isCurrent ? '3.5' : '0.5'}
                            onMouseEnter={() => {
                              this.setState({hovering: {...stateData, geo}})
                            }}
                            onMouseLeave={() => {
                              this.setState({hovering: false})
                            }}
                            onMouseDown={() => {
                              this.setState({persistentChoice: this.state.persistentChoice ? (this.state.persistentChoice.geo.id === geo.id ? null : {...stateData, geo}) : {...stateData, geo}})
                            }}
                          />
                        )
                      })}
                    </Geographies>
                  </ComposableMap>
                </div>
              </div>
            </div>
          </Flipped>
        </Flipper>
      </div>
    )
  }

  render () {
    return this.renderContent()
  }
}

export default StatesPop
