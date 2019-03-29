import React, { Component } from 'react';
class Timer extends Component {

    render() {
        const timeleft = this.props.timer.timeleft;
        return (
            <React.Fragment>
                <div className="p-2 bd-highlight">
                    timer: {timeleft}
                </div>

            </React.Fragment>
        );
    }
}

export default Timer;