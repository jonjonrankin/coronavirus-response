import React from 'react'
import { Link } from 'react-router-dom'
import { FaGithub } from 'react-icons/fa'

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
        <footer><a href='https://github.com/jonjonrankin/coronavirus-response'><FaGithub /></a><span>|</span><a href={'https://data.humdata.org/dataset/novel-coronavirus-2019-ncov-cases'}>Source data</a><span>|</span><small>last updated: 03/26/2020 2:09:17UTC</small></footer>
      </div>
    )
  }
}

export default Layout
