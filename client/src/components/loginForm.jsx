import React, { Component } from "react";
import api from "./api.js";
import ErrorMessage from "./errorMessage.jsx";
import { Redirect } from "react-router";
import "./loginPage.css";
import GoogleLogin from "react-google-login";
const client_id = "google-sign-in-button";
class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: { content: "", shown: "" },
      username: "",
      password: "",
      remember: false,
      isAuth: false
    };
    this.handleOnChanges = this.handleOnChanges.bind(this);
    //this.onSuccess = this.onSuccess.bind(this);
  }

  componentDidMount() {
    // window.gapi.signin2.render(client_id, {
    //   width: "auto",
    //   height: 40,
    //   onsuccess: this.onSuccess
    // });
  }

  success = res => {
    let name = res.profileObj.name;
    console.log(name);

    api
      .post("/GoogleSignin/", { name })
      .then(res => {
        console.log(res.data);
        this.setState({ isAuth: true });
      })
      .catch(err => {
        console.log(err);
      });
  };

  failure = res => {
    console.log("sign in failed");
    this.setState({ isAuth: false });
  };

  handleOnChanges(event) {
    const value =
      event.type === "checkbox" ? event.target.checked : event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value
    });
  }
  render() {
    if (!this.state.isAuth) {
      return (
        <div className="login d-flex align-items-center py-5">
          <div className="container">
            <div className="row">
              <div className="col-md-9 col-lg-8 mx-auto">
                <h3 className="login-heading mb-4">Welcome back!</h3>
                <ErrorMessage
                  onChange={this.handleOnError}
                  error={this.state.error}
                />
                <div className="text-right mb-4">
                  <a href="/api/register/">Register</a>
                </div>
                <form onSubmit={this.login}>
                  <div className="form-group">
                    <label htmlFor="username"> Username </label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      placeholder="Username"
                      value={this.state.username}
                      onChange={this.handleOnChanges}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password"> Password </label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Password"
                      value={this.state.password}
                      onChange={this.handleOnChanges}
                      required
                    />
                  </div>

                  <label htmlFor="remember">
                    <input
                      type="checkbox"
                      className="checkbox mb-3"
                      name="remember"
                      checked={this.state.remember}
                      onChange={this.handleOnChanges}
                    />
                    Remember me
                  </label>
                  <div>
                    <button
                      type="submit"
                      className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2"
                    >
                      Log In
                    </button>
                    <hr className="my-4" />
                  </div>
                </form>
                <GoogleLogin
                  clientId="569317549016-ruc7mrn11uaagrirmjka8mv874vqv0sr.apps.googleusercontent.com"
                  buttonText="Google Login"
                  onSuccess={this.success}
                  onFailure={this.failure}
                />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // let path = url(this.state.username);
      return <Redirect to="/api/rooms/" />;
    }
  }

  handleOnError = (err, shown) => {
    let error = { ...this.state.error };
    error.content = err;
    error.shown = "alert alert-primary";
    this.setState({ error });
    this.setState({ password: "", username: "" });
  };

  login = event => {
    event.preventDefault();
    api
      .post("/signin/", {
        username: this.state.username,
        password: this.state.password
      })
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.setState({ isAuth: true });
          console.log("hello");
          // this.props.history.push("/");
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
}

export default LoginForm;
