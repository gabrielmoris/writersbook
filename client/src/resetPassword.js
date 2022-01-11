import { Component } from "react";
import { Link } from "react-router-dom";

export class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { stage: 1 };
        this.handleChange = this.handleChange.bind(this);
        this.resetFirst = this.resetFirst.bind(this);
        this.resetSecond = this.resetSecond.bind(this);
    }
    renderStage() {
        if (this.state.stage === 1) {
            return (
                <>
                    <form>
                        <h1>Reset Password:</h1>
                        <input
                            name="email"
                            placeholder="your@email.com"
                            type="email"
                            onChange={this.handleChange}
                        ></input>
                    </form>
                    <button onClick={this.resetFirst}>Next</button>
                </>
            );
        } else if (this.state.stage === 2) {
            return (
                <>
                    <form>
                        <h1>Reset Password:</h1>
                        <h2>A code has been sent to your email.</h2>
                        <input
                            name="code"
                            placeholder="Insert your code here"
                            type="text"
                            onChange={this.handleChange}
                        ></input>
                        <input
                            name="password"
                            placeholder="New Password"
                            type="password"
                            onChange={this.handleChange}
                        ></input>
                    </form>
                    <button onClick={this.resetSecond}>Next</button>
                </>
            );
        } else if (this.state.stage === 3) {
            return (
                <>
                    <h1>SUCCESS</h1>
                    <h2>Now you can login.</h2>
                    <Link to="/login">Click here to Log in!</Link>
                </>
            );
        }
    }

    handleChange({ target }) {
        // console.log(("evt", target.value));
        //to update the state I use this.setState and pass it to an object with our state changes
        this.setState(
            {
                [target.name]: target.value,
            },
            () => {
                console.log("handle change uplade done", this.state);
            }
        );
    }

    resetFirst(e) {
        e.preventDefault();
        fetch("/reset-password/start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((data) => data.json())
            .then((data) => {
                // console.log("response data from /reset-password/start", data);
                if (data.success === true) {
                    this.setState({ stage: this.state.stage + 1 }); //maybe i send this from server
                }
            });
    }

    resetSecond(e){
        e.preventDefault();
        fetch("/reset-password/confirm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((data) => data.json())
            .then((data) => {
                console.log("response data from /reset-password/confirm", data);
                if (data.success === true) {
                    this.setState({ stage: this.state.stage + 1 }); //maybe i send this from server
                }
            });
    }
    render() {
        return <>{this.renderStage()}</>;
    }
}
