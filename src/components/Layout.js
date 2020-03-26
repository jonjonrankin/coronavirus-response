import React from 'react'
import { Link } from 'react-router-dom'

class Layout extends React.Component {
  render () {
    return (
      <div className='layout'>
        <header>
          <h1>
            COVID LENS
          </h1>
          <div className='subtitle'>explore global coronavirus data</div>
          <div className='nav'>
            <Link to='/'>Compare Countries</Link>
            <Link to='/global'>Global Cases</Link>
            <Link to='/about'>About</Link>
          </div>
        </header>
        {this.props.children}
        <footer><a href={'https://data.humdata.org/dataset/novel-coronavirus-2019-ncov-cases'}>Source data</a><span>|</span><small>last updated: 03/25/2020 2:09:17UTC</small></footer>
      </div>
    )
  }
}

export default Layout
