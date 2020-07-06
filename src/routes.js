import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
  // Link
} from 'react-router-dom'
import Home from './views/Home'
import Layout from './components/Layout'
import About from './views/About'
import Test from './views/test'
import US from './views/US'

export default function Routes() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/">
            <US />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/global">
            <Home />
          </Route>
        </Switch>
      </Layout>
    </Router>
  )
}
