import React from 'react'
import { FaGithub, FaHeart } from 'react-icons/fa'

export default function About () {
  return (
    <div className='about'>
      <h1>About</h1>
      <p>
        While there are<span> </span>
        <a href='https://www.vox.com/policy-and-politics/2020/3/13/21178289/confirmed-coronavirus-cases-us-countries-italy-iran-singapore-hong-kong'>many</a><span> </span>
        <a href='https://ourworldindata.org/grapher/covid-confirmed-cases-since-100th-case?time=56'>excellent</a><span> </span>
        <a href='https://www.nytimes.com/interactive/2020/03/21/upshot/coronavirus-deaths-by-country.html'>visualizations</a><span> </span>
        out there depicting the unfolding COVID-19 pandemic, I thought 
        the internet could use a more customizable, interactive
        one. I hope users are able to derive their own insights 
        from this data set, and more fully grasp the gravity of 
        this global health crisis.
      </p>
      <small><FaGithub /> <a href='https://github.com/jonjonrankin/coronavirus-response'>Collaborate</a> with me on GitHub - <FaHeart /> <a href='https://github.com/jonjonrankin/'>jonjonrankin</a></small>
    </div>
  )
}
