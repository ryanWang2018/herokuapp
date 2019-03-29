import React, { Component } from 'react';

class Result extends Component {

    render() {
        const result = this.props.result;
        // if (result === "win") {
        //     return (<div>
        //         <img src="./media/winner.png" alt="win" />
        //     </div>)
        // } else if (result === "lose") {
        //     return (<div>
        //         <img src="./media/smile.png" alt="lose" />
        //     </div>);
        // } else {
        //     return (<div></div>);
        // }
        return (<div>winners: {result}</div>);
    }
}

export default Result;