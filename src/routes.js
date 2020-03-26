import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
  // Link
} from 'react-router-dom'
import Home from './views/Home'
import Layout from './components/Layout'

export default function Routes() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Layout>
    </Router>
  )
}
