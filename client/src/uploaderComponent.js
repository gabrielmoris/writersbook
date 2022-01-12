import { Component } from "react";

export default class uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
        //I can turn in the render this in arrow functions, but this way is better for the performance.
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange({ target }) {
        console.log(("evt", target.files[0]));

        //to update the state I use this.setState and pass it to an object with our state changes
        this.setState(
            {
                [target.name]: target.files[0],
            },
            () => {
                // console.log("handle change uplade done", this.state);
            }
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        const fd = new FormData();
        fd.append("file", this.state.file);
        fetch("/upload", {
            method: "POST",
            body: fd,
        })
            .then((data) => data.json())
            .then((data) => {
                // console.log("response data from /login.json", data.success);
                if (data.success === true) {
                    location.reload();
                } else {
                    this.setState({ error: "Something went wrong." });
                }
            })
            .catch((err) => {
                console.log("Err in fetcch /login.json", err);
            });
    }

    render() {
        return (
            <>
                {this.state.error && (
                    <h2 style={{ color: "red" }}>{this.state.error}</h2>
                )}
                <form>
                    <h2>Upload your picture!</h2>
                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={this.handleChange}
                    ></input>
                    <button onClick={this.handleSubmit}>UPLOAD</button>
                </form>
            </>
        );
    }
}
