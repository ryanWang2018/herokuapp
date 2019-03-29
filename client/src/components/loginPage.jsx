import React, { Component } from "react";
import LoginForm from "./loginForm";
import './loginPage.css';

class LoginPage extends Component {

  render() {
    return (
      <div className="container-fluid">
        <div className="row no-gutter">
          <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
          <div className="col-md-8 col-lg-6">
            <LoginForm className="col-md-8 col-lg-6"></LoginForm>

          </div>
        </div>
      </div>

    );
  }
}

export default LoginPage;
