import React from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import moment from 'moment'
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLine, VictoryLabel } from 'victory'
import { getStyles } from '../styles/graph-styles'
import {Flipper, Flipped} from 'react-flip-toolkit'

const Label = (props) => {
  // console.log(props)
  // console.log(props.text(props.datum))
  // return <text x={props.x} y={props.y} fill='white'>{props.text}</text>
  return null
}

class StatesIncrease extends React.Component {
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
    let alpha = (p / 100) * 1.5
    var rgb = this.HSVtoRGB(0, alpha, 0.95);
    return 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
  }

  getXFormatDate (date) {
    return parseInt(moment(date, 'YYYY-MM-DD').format('X'))
  }

  renderDailyCasesChart () {
    const state = this.state.persistentChoice
    const allStateData = this.props.fullData.filter(d => d.fips === state.fips)
    let chartData = []
    allStateData.sort((a, b) => this.getXFormatDate(a.date) > this.getXFormatDate(b.date) ? 1 : -1).forEach(day => {
      let cases = parseInt(day.cases)
      let newCases = chartData.length > 0 ? cases - chartData[chartData.length - 1].cases : cases
      chartData.push({
        x: day.date,
        cases,
        y: newCases > 0 ? newCases : 0
      })
    })

    let movingAverageData = []
    for (let i = 0; i < chartData.length; i++) {
      let sum = 0
      let k = 0
      for (let j = 0; j < 7; j++) {
        let prevDatum = chartData[i - j]
        sum += (prevDatum ? prevDatum.y : 0)
        
        if (prevDatum) k += 1
      }

      let average = sum / k
      movingAverageData.push({
        x: chartData[i].x,
        y: average
      })
    }

    let styles = getStyles()
    const max = Math.max(...movingAverageData.map(d => d.y))

    return (
      <div
        style={{marginRight: '-2.5rem', marginTop: '-2rem', width: '100%', height: '100%'}}
      >
        <VictoryChart
          height={350}
          width={300}
        >
          <VictoryAxis
            dependentAxis
            standalone={false}
            style={styles.axis}
          />
          <VictoryAxis
            standalone={false}
            style={styles.axis}
            tickCount={5}
            tickFormat={(date) => moment(date).format('MM/DD')}
          />
          <VictoryBar
            data={chartData}
            style={{...styles.bar, data: {fill: 'white'}}}
          />
          <VictoryLine
            data={movingAverageData}
            style={{...styles.line, data: {stroke: 'red', strokeWidth: 3}, label: {fill: 'white'}}}
            labels={({datum}) => {
              if (datum.y === max) {
                return true
              }
              return false
            }}
            labelComponent={<Label />}
          />
        </VictoryChart>
      </div>
    )
  }

  renderHover () {
    const h = this.state.persistentChoice
    if (h) {
      return (
        <Flipped flipId={2}>
          <div className='us-detail'>
            <h1>{h.state}</h1>
            <table>
              <tr>
                <td>New cases</td>
                <td>{h.difference}</td>
              </tr>
              <tr>
                <td>Percent growth</td>
                <td>{Math.round(h.oneWeekPercentIncrease * 1000) / 10}%</td>
              </tr>
              <tr>
                <td>Total cases in state</td>
                <td>{h.cases}</td>
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
      <div className='states-increase-container'>
        <Flipper animateEnt flipKey={this.state.persistentChoice} className='states-increase' spring={'stiff'}>
          {this.renderHover()}
          <Flipped flipId={1}>
            <div className='map-wrapper'>
              <div className='content'>
                <div className='legend'>
                  <div className='col'>
                    <div className='legend-box' style={{background: this.rainbow(0)}} />
                    <div className='legend-box' style={{background: this.rainbow(5)}} />
                    <div className='legend-box' style={{background: this.rainbow(10)}} />
                    <div className='legend-box' style={{background: this.rainbow(25)}} />
                    <div className='legend-box' style={{background: this.rainbow(50)}} />
                  </div>
                  <div className='col'>
                    <div>0%</div>
                    <div>+5%</div>
                    <div>+10%</div>
                    <div>+25%</div>
                    <div>+50%</div>
                  </div>
                </div>
                <div className='map'>
                  <ComposableMap projection="geoAlbersUsa">
                    <Geographies geography={this.geoUrl}>
                      {({geographies}) => geographies.sort((g1) => this.state.persistentChoice ? (this.hoverOrChoiceEqualToState(g1) ? 1 : -1) : -1).map(geo => {
                        let stateData = this.props.data.find(d => parseInt(d.fips) === parseInt(geo.id))
                        let color = '#DDD'

                        if (stateData) {
                          color = this.rainbow(stateData.oneWeekPercentIncrease * 100)
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

export default StatesIncrease
