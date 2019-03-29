import React, { Component } from 'react';
class Score extends Component {

    render() {
        const point = this.props.score.point;
        const playerId = this.props.score.playerId;
        return (
            <React.Fragment>
                <div className="p-2 bd-highlight">
                    {playerId} : {point}
                </div>

            </React.Fragment>
        );
    }
}

export default Score;