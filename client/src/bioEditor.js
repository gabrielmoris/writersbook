import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bioIsVisible: false,
            bioButton: false,
        };
        this.togglerBio = this.togglerBio.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }

    componentDidMount() {
        console.log("props in bioeditor", this.props);
    }

    togglerBio() {
        this.setState({
            bioIsVisible: !this.state.bioIsVisible,
            bioButton: !this.state.bioButton,
        });
    }

    updateBio(e) {
        e.preventDefault();
        fetch("/update-bio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((data) => data.json())
            .then((data) => {
                // console.log("response data from /login.json", data);
                if (data.success === true) {
                    this.props.renderbio(data.bio);
                    this.togglerBio();
                } else {
                    this.setState({ error: "Something went wrong." });
                }
            })
            .catch((err) => {
                console.log("Err in fetcch /login.json", err);
                this.setState({ error: "Something went wrong." });
            });
    }

    handleChange({ target }) {
        // console.log(("evt", target.value));

        this.setState(
            {
                [target.name]: target.value,
            },
            () => {
                // console.log("handle change uplade done", this.state);
            }
        );
    }

    render() {
        return (
            <>
                {this.state.error && (
                    <h2 style={{ color: "red" }}>{this.state.error}</h2>
                )}
                <h3 className="bio">{this.props.bio}</h3>
                {this.state.bioIsVisible && (
                    <>
                        <form>
                            <textarea
                                onChange={this.handleChange}
                                defaultValue={this.props.bio}
                                name="textarea"
                            />
                        </form>
                    </>
                )}
                <button onClick={this.togglerBio}>
                    {(this.state.bioButton && "Cancel") || "Write your Bio"}
                </button>
                {this.state.bioIsVisible && (
                    <button onClick={this.updateBio}>Save</button>
                )}
            </>
        );
    }
}
