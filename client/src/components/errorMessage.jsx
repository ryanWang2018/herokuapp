import React, { Component } from "react";
class ErrorMessage extends Component {
  render() {
    return (
      <React.Fragment>
        <div
          onChange={() =>
            this.props.onChange(
              this.props.error.content,
              this.props.error.shown
            )
          }
          className={this.props.error.shown}
          role="alert"
          value="error"
        >
          {this.props.error.content}
        </div>
      </React.Fragment>
    );
  }
}

export default ErrorMessage;
