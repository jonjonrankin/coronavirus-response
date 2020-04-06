import Papa from 'papaparse'

Papa.parsePromise = function (url) {
  return new Promise(function(complete, error) {
    Papa.parse(url, {
      header: true,
      encoding: 'utf8',
      download: true,
      skipEmptyLines: true,
      chunk: false,
      worker: true,
      complete: complete,
      error: error
    })
  })
}

export async function getData (countries) {
  const url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
  let response = await Papa.parsePromise(url)
  return parseData(response.data)
}

// export async function getCountries () {
//   let countries
//   await API.get(`/data/countries`)
//     .then(r => { countries = r.data })
//     .catch(() => { countries = false })
//   return countries
// }

// export async function getGlobalData () {
//   let data
//   await API.get(`/data/global`)
//     .then(r => { data = r.data })
//     .catch(() => { data = false })
//   return data
// }

const parseData = (data) => {
  const onlyUnique = (value, index, self) => { 
    return self.indexOf(value) === index
  }

  let countries = data.map(d => d['Country/Region']).filter(onlyUnique)
  let cases = data
  let groupedData = []

  countries.forEach(co => {
    let coCases = cases.filter(c => c['Country/Region'] === co)
    let d = []
    coCases.forEach(c => {
      Object.keys(c).forEach(day => {
        if (!['Province/State','Country/Region','Lat','Long'].includes(day)) {
          let datum = d.find(d => d.date === day)

          if (datum) {
            d.find(da => da.date === day).count += parseInt(c[day])
          } else {
            datum = {date: day, count: parseInt(c[day])}
            d.push(datum)
          }
        }
      })
    })

    groupedData.push({country: co, cases: d})
  })

  return {groupedData, countries}
}