import React from 'react'
import { VictoryAxis, VictoryBar, VictoryTooltip, VictoryChart, VictoryVoronoiContainer } from 'victory'
import { getStyles, stringToColor } from '../../styles/graph-styles'
import moment from 'moment'

class NewCasesDaily extends React.Component {
  renderCombinedCountries (data, daysSinceNthCase, windowWidth, log, daysToDouble) {
    let styles = getStyles()

    let d = []
    let previousDayCount = 0
    data.cases.forEach(c => {
      d.push({x: parseInt(moment(c.date).format('x')), y: c.count - previousDayCount, count: c.count})
      previousDayCount = c.count
    })

    d = d.filter(datum => datum.count >= daysSinceNthCase)
    d = d.map(datum => { return {x: moment(datum.x, 'x').diff(moment(Math.min.apply(Math, d.map(d => d.x)), 'x'), 'days'), y: datum.y, label: moment(datum.x, 'x').format('M/D') + ': ' + datum.y.toString()} })

    let size = windowWidth < 1000 ? {w: 400, h: 400} : {w: 650, h: 460}
    if (d.length > 1) {
      let domain = [
        Math.min.apply(Math, d.map(d => d.x)),
        Math.max.apply(Math, d.map(d => d.x))
      ]
      let range = [
        0,
        Math.max.apply(Math, d.map(d => d.y))
      ]
      return (
        <div>
          <h2 style={{color: stringToColor(data.country)}}>{data.country}</h2>
          <VictoryChart
            containerComponent={<VictoryVoronoiContainer />}
          >
            <VictoryAxis
              dependentAxis
              domain={range}
              standalone={false}
              scale={log ? 'log' : null}
              style={styles.axisNoGrid}
              tickFormat={() => ''}
            />
            <VictoryAxis
              domain={domain}
              standalone={false}
              style={styles.axisNoGrid}
              tickFormat={() => ''}
            />
            <VictoryBar
                barRatio={1}
                data={d}
                style={{...styles.bar, data: {fill: stringToColor(data.country)}}}
                labelComponent={<VictoryTooltip flyoutStyle={styles.flyout} />}
              />
            {/* <VictoryLine
              // width={size.w} height={size.h}
              scale={log ? {y: 'log'} : null}
              domain={{x: domain, y: range}}
              standalone={false}
              style={{...styles.bar, data: {stroke: '#fafafa75', strokeWidth: 5, strokeDasharray: '4, 3' }}}
              y={(d) => {
                let r = (Math.log(2) / daysToDouble)
                let y = (daysSinceNthCase * (Math.exp(1) ** (r * d.x))) - (daysSinceNthCase * (Math.exp(1) ** (r * (d.x - 1))))
                return y
              }}
            /> */}
          </VictoryChart>
        </div>
      )
    } else {
      return (
        <div>
          <h2 style={{color: stringToColor(data.country)}}>{data.country}</h2>
        </div>
      )
    }
  }

  render () {
    return (
      this.renderCombinedCountries(this.props.data, this.props.daysSinceNthCase, this.props.windowWidth, this.props.log, this.props.daysToDouble)
    )
  }
}

export default NewCasesDaily
