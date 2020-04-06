import React from 'react'
import { Link } from 'react-router-dom'
import { FaGithub } from 'react-icons/fa'
import icon from '../assets/covid.ico'

class Layout extends React.Component {
  render () {
    return (
      <div className='layout'>
        <header>
          <Link to='/'>
            <h1 className='title'>
              <img style={{width: '18px', heigth: 'auto', margin: '0 8px -2px 0'}} src={icon} />COVID LENS
            </h1>
            <div className='subtitle'>explore global coronavirus data</div>
          </Link>
        </header>
        <main>
          {this.props.children}
        </main>
        <footer><a href='https://github.com/jonjonrankin/coronavirus-response'><FaGithub /></a><span>|</span><a href={'https://data.humdata.org/dataset/novel-coronavirus-2019-ncov-cases'}>Source data</a><span>|</span><Link to='/about'>About</Link></footer>
      </div>
    )
  }
}

export default Layout
