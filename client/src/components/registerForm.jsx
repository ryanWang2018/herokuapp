import React, { Component } from "react";
import api from "./api.js";
import ErrorMessage from './errorMessage.jsx';
import { Redirect } from "react-router-dom";
import "./loginPage.css";
class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
      first_name: "",
      last_name: "",
      error: { content: "", shown: "" },
      registered: false
    };
    this.handleOnChanges = this.handleOnChanges.bind(this);
  }

  handleOnChanges(event) {
    event.preventDefault();

    //
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  render() {
    if (this.state.registered) return (<Redirect to="/"></Redirect>);
    return (
      <div className="container-fluid">
        <div className="row no-gutter">
          <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
          <div className="col-md-8 col-lg-6">
            <a href="/" className="btn btn-lg btn-primary mb-2 btn-back" role="button">Back</a>
            <div className="login d-flex align-items-center py-5">
              <div className="container">
                <div className="row">
                  <div className="col-md-9 col-lg-8 mx-auto">
                    <h3 className="login-heading mb-4">Hello!</h3>
                    <ErrorMessage
                      onChange={this.handleOnError}
                      error={this.state.error}
                    />
                    <form onSubmit={this.register}>
                      <div className="form-group">
                        <label htmlFor="username"> Username </label>
                        <input
                          className="form-control"
                          type="text"
                          name="username"
                          value={this.state.username}
                          id="username"
                          placeholder="Username"
                          onChange={this.handleOnChanges}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="password"> Password </label>
                        <input
                          className="form-control"
                          type="password"
                          name="password"
                          value={this.state.password}
                          id="password"
                          placeholder="Password"
                          onChange={this.handleOnChanges}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email"> Email Address </label>
                        <input
                          className="form-control"
                          type="email"
                          name="email"
                          value={this.state.email}
                          id="email"
                          placeholder="E-mail Address"
                          onChange={this.handleOnChanges}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="first_name"> First Name </label>
                        <input
                          className="form-control"
                          type="text"
                          name="first_name"
                          value={this.state.first_name}
                          id="first_name"
                          placeholder="First Name"
                          onChange={this.handleOnChanges}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="last_name"> Last Name </label>
                        <input
                          className="form-control"
                          type="text"
                          name="last_name"
                          value={this.state.last_name}
                          id="last_name"
                          placeholder="Last Name"
                          onChange={this.handleOnChanges}
                        />
                      </div>
                      <div>
                        <button type="submit" className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2">
                          Register
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div >
    );
  }
  register = event => {
    event.preventDefault();

    api
      .post("/register", {
        username: this.state.username,
        password: this.state.password,
        email: this.state.email,
        first_name: this.state.first_name,
        last_name: this.state.last_name
      })
      .then(res => {
        console.log(res.status);
        if (res.status === 200) {
          this.handleOnSuccess();
        }
      })
      .catch(err => {
        if (err.response) {
          this.handleOnError(err.response.data);
        } else {
          this.handleOnError(err.message);
        }
      });
  };

  handleOnSuccess = () => {
    // this.context.router.history.push('/');
    this.setState({ registered: true });
  }

  handleOnError = (err, shown) => {
    let error = { ...this.state.error };
    error.content = err;
    error.shown = "alert alert-primary";
    this.setState({ error });
  };
}

export default RegisterForm;
