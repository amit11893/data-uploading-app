import React from "react"
import Signup from "./Signup"
import { Container } from "react-bootstrap"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "./ForgotPassword"
import UpdateProfile from "./UpdateProfile"
import Home from "./Home"
import { StorageProvider } from "../contexts/StorageContext"

function App() {
  return (
    <Container
      className="d-flex justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Router>
          <AuthProvider>
            <StorageProvider>
              <Switch>
                <PrivateRoute exact path="/" component={Home} />
                <PrivateRoute path="/profile" component={Dashboard} />
                <PrivateRoute path="/update-profile" component={UpdateProfile} />
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/forgot-password" component={ForgotPassword} />
              </Switch>
            </StorageProvider>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  )
}

export default App
