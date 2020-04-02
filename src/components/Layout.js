import React from 'react'
import { Link } from 'react-router-dom'
import { FaGithub } from 'react-icons/fa'
import icon from '../assets/covid.ico'

class Layout extends React.Component {
  render () {
    return (
      <div className='layout'>
        <header>
          <h1>
            <img style={{width: '18px', heigth: 'auto', margin: '0 8px -2px 0'}} src={icon} />COVID LENS
          </h1>
          <div className='subtitle'>explore global coronavirus data</div>
          <div className='nav'>
            <Link to='/'>Compare Countries</Link>
            <Link to='/global'>Global Cases</Link>
            <Link to='/about'>About</Link>
          </div>
        </header>
        <main>
          {this.props.children}
        </main>
        <footer><a href='https://github.com/jonjonrankin/coronavirus-response'><FaGithub /></a><span>|</span><a href={'https://data.humdata.org/dataset/novel-coronavirus-2019-ncov-cases'}>Source data</a></footer>
      </div>
    )
  }
}

export default Layout
