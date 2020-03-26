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
import GlobalCases from './views/GlobalCases'

export default function Routes() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/global">
            <GlobalCases />
          </Route>
        </Switch>
      </Layout>
    </Router>
  )
}
