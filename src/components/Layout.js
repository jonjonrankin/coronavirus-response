import React from 'react'

class Layout extends React.Component {
  render () {
    return (
      <div className='layout'>
        <header>
          <h1>
            coronavirus response
          </h1>
          <small>last updated: 03/25/2020 2:09:17UTC</small>
        </header>
        {this.props.children}
        <footer><a href={'https://data.humdata.org/dataset/novel-coronavirus-2019-ncov-cases'}>Source data</a></footer>
      </div>
    )
  }
}

export default Layout
