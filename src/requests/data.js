import API from './api'

export async function getData (countries) {
  let response
  if (countries) {
    await API.get(`/data/${countries.join('&')}`)
      .then(r => { response = r.data })
      .catch(() => { response = false })
  } else {
    await API.get(`/data`)
    .then(r => { response = r.data })
    .catch(() => { response = false })
  }
  return response
}

export async function getCountries () {
  let countries
  await API.get(`/data/countries`)
    .then(r => { countries = r.data })
    .catch(() => { countries = false })
  return countries
}

export async function getGlobalData () {
  let data
  await API.get(`/data/global`)
    .then(r => { data = r.data })
    .catch(() => { data = false })
  return data
}

export function postVisit () {
  API.post('/visit', '')
    .then(r => console.log(r))
    .catch(e => console.log(e))
}
