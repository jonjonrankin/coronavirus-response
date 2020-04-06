export const getStyles = () => {
  const GRAY_COLOR = '#fafafa'
  const GRAY_COLOR_75 = GRAY_COLOR + '75'
  const GRAY_COLOR_50 = GRAY_COLOR + '50'
  const GRAY_COLOR_25 = GRAY_COLOR + '25'
  const COLOR = '#fafafa'
  const COLOR_75 = COLOR + '75'
  const COLOR_50 = COLOR + '50'
  const COLOR_25 = COLOR + '25'

  return {
    parent: {
      fontFamily: 'monospace',
      width: '100%',
      height: 'auto'
    },

    // AXIS DEFAULT
    axis: {
      grid: {
        stroke: COLOR_25,
        strokeWidth: (tick) => {
          if (tick.tick === 0) {
            return 0
          } else {
            return 2
          }
        }
      },
      axis: { stroke: COLOR, strokeWidth: 1 },
      ticks: { strokeWidth: 0 },
      tickLabels: {
        fill: GRAY_COLOR,
        fontFamily: 'inherit',
        fontSize: '10px',
        angle: 30
      },
      axisLabel: {
        fontFamily: 'inherit',
        fontSize: '14px',
        fill: GRAY_COLOR
      }
    },

    label: {
      fill: GRAY_COLOR,
      fontFamily: 'inherit',
      fontSize: '10px'
    },

    // AXIS LABEL
    axisLabel: {
      fill: GRAY_COLOR,
      fontFamily: 'inherit',
      fontSize: '14px'
    },

    // LINE DEFAULT
    line: {
      data: { stroke: COLOR, strokeWidth: 1 },
      label: {
        fill: GRAY_COLOR,
        fontFamily: 'inherit',
        fontSize: '7px'
      },
    },

    // AREA DEFAULT
    area: {
      data: { fill: COLOR_50, stroke: COLOR, strokeWidth: 2 }
    },

    // STACK DEFAULT
    stack: {
      colorScale: [COLOR_50, COLOR_75, COLOR]
    },

    // SCATTER
    scatter: {
      data: { stroke: COLOR, strokeWidth: 2, fill: '#ffffff' }
    },

    // ANIMATION
    animate: {
      duration: 800,
      onLoad: {
        duration: 0
      }
    }
  }
}

export const stringToColor = (string) => {
	var colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
                '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
                '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
                '#a3a37a', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
                '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
                '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']
  var hash = 0
	if (string.length === 0) return hash
  for (var i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
      hash = hash & hash
  }
  hash = ((hash % colors.length) + colors.length) % colors.length
  return colors[hash]
}