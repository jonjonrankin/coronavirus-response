import React from 'react'
import { VictoryLine, VictoryAxis, VictoryLabel } from 'victory'
import { getStyles, stringToColor } from '../../styles/graph-styles'
import moment from 'moment'
import { ordinalSuffixOf } from '../../utils.js'

class CasesTimeSeries extends React.Component {
  renderCombinedCountries (data, selectedCountries, daysSinceNthCase, windowWidth, log, daysToDouble) {
    let usableCountries = selectedCountries
    let styles = getStyles()

    let groupedData = []
    data.forEach(co => {
      let d = []
      let data
      co.cases.forEach(c => {
        d.push({x: parseInt(moment(c.date).format('x')), y: c.count})
      })

      data = d.filter(d => d.y >= daysSinceNthCase)
      if (data.length > 1) {
        groupedData.push({
          country: co.country,
          data: data.map(d => { return {x: moment(d.x, 'x').diff(moment(Math.min.apply(Math, data.map(d => d.x)), 'x'), 'days'), y: d.y} })
        })
      } else {
        usableCountries = usableCountries.filter(c => c !== co.country)
      }
    })

    let combinedData = []
    groupedData.forEach(g => {
      combinedData = combinedData.concat(g.data)
    })

    let size = windowWidth < 1000 ? {w: 400, h: 400} : {w: 650, h: 460}
    if (combinedData.length > 1) {
      let domain = [
        Math.min.apply(Math, combinedData.map(d => d.x)),
        Math.max.apply(Math, combinedData.map(d => d.x)) + Math.max.apply(Math, combinedData.map(d => d.x)) * 0.25
      ]
      let range = [
        daysSinceNthCase,
        Math.max.apply(Math, combinedData.map(d => d.y)) + Math.max.apply(Math, combinedData.map(d => d.y)) * (log ? 5 : 0.33)
      ]
      return (
        <div style={{margin: '1rem', maxWidth: '100vw', flexGrow: '1'}}>
          <svg style={styles.parent} viewBox={`0 0 ${size.w} ${size.h}`}>
            <VictoryAxis
              dependentAxis
              domain={range}
              standalone={false}
              scale={log ? 'log' : null}
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
              label={'Days since ' + (ordinalSuffixOf(daysSinceNthCase)) + ' case'}
            />
            {usableCountries.map(co => {
              let d = groupedData.find(d => d.country === co).data
              return (
                <g key={usableCountries.indexOf(co)}>
                  <VictoryLine
                    width={size.w} height={size.h}
                    scale={log ? {y: 'log'} : null}
                    domain={{x: domain, y: range}}
                    standalone={false}
                    data={d}
                    style={{...styles.line, data: {stroke: stringToColor(co)}}}
                    labels={(datum) => datum.datum.x === Math.max.apply(Math, d.map(d => d.x)) ? co : ''}
                    labelComponent={<VictoryLabel style={{...styles.label, fill: stringToColor(co)}} />}
                    interpolation='monotoneX'
                  />
                </g>
              )
            })}
            <VictoryLine
              width={size.w} height={size.h}
              scale={log ? {y: 'log'} : null}
              domain={{x: domain, y: range}}
              standalone={false}
              style={{...styles.line, data: {stroke: '#fafafa75', strokeWidth: 1, strokeDasharray: '4, 3' }}}
              y={(d) => {
                let r = (Math.log(2) / daysToDouble)
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
              scale={log ? 'log' : null}
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
              label={'Days since ' + (ordinalSuffixOf(daysSinceNthCase)) + ' case'}
            />
            <VictoryLine
              width={size.w} height={size.h}
              scale={log ? {y: 'log'} : null}
              domain={{x: domain, y: range}}
              standalone={false}
              style={{...styles.line, data: {stroke: '#fafafa50', strokeWidth: 3}}}
              y={(d) => {
                let r = (Math.log(2) / daysToDouble)
                let y = daysSinceNthCase * (Math.exp(1) ** (r * d.x))
                return y
              }}
            />
          </svg>
        </div>
      )
    }
  }

  render () {
    return (
      this.renderCombinedCountries(this.props.data, this.props.selectedCountries, this.props.daysSinceNthCase, this.props.windowWidth, this.props.log, this.props.daysToDouble)
    )
  }
}

export default CasesTimeSeries
