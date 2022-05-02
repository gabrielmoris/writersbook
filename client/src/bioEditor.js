import { useState, useEffect } from "react";
import useForm from "./hooks/useForm";

export default function BioEditor({ bio, renderbio }) {
    const [userInput, handleChange] = useForm();
    const [bioIsVisible, setBioIsVisible] = useState(false);
    const [bioButton, setBioButton] = useState(false);

    const [error, setError] = useState();

    useEffect(() => {
    }, [bio]);

    const togglerBio = () => {
        setBioIsVisible(!bioIsVisible);
        setBioButton(!bioButton);
    };

    const updateBio = () => {
        fetch("/update-bio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInput),
        })
            .then((data) => data.json())
            .then((data) => {
                if (data.success === true) {
                    renderbio(data.bio);
                    togglerBio();
                } else {
                    this.setState({ error: "Something went wrong." });
                }
            })
            .catch((err) => {
                console.log("Err in fetch /login.json", err);
                setError("Something went wrong 🤔");
            });
    };

    return (
        <>
            {error && <h2 style={{ color: "red" }}>{error}</h2>}
            <h3 className="bio">{bio}</h3>
            {bioIsVisible && (
                <div className="edit-bio-form-wrapper">
                    <form className="form-edit-bio">
                        <textarea
                            onChange={handleChange}
                            defaultValue={bio}
                            name="textarea"
                        />
                    </form>
                </div>
            )}
            <button className="bio-btn" onClick={togglerBio}>
                {(bioButton && "Cancel") || "Write your Bio"}
            </button>
            {bioIsVisible && (
                <button
                    onClick={() => {
                        updateBio(bio);
                    }}
                >
                    Save
                </button>
            )}
        </>
    );
}

//AS A CLASS COMPONENT
// import { Component } from "react";

// export default class BioEditor extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             bioIsVisible: false,
//             bioButton: false,
//         };
//         this.togglerBio = this.togglerBio.bind(this);
//         this.handleChange = this.handleChange.bind(this);
//         this.updateBio = this.updateBio.bind(this);
//     }

//     componentDidMount() {
//         // console.log("props in bioeditor", this.props);
//     }

//     togglerBio() {
//         this.setState({
//             bioIsVisible: !this.state.bioIsVisible,
//             bioButton: !this.state.bioButton,
//         });
//     }

//     updateBio(e) {
//         e.preventDefault();
//         if (this.state.textarea!=this.props.bio) {
//             fetch("/update-bio", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(this.state),
//             })
//                 .then((data) => data.json())
//                 .then((data) => {
//                     if (data.success === true) {
//                         this.props.renderbio(data.bio);
//                         this.togglerBio();
//                     } else {
//                         this.setState({ error: "Something went wrong." });
//                     }
//                 })
//                 .catch((err) => {
//                     console.log("Err in fetcch /login.json", err);
//                     this.setState({ error: "Something went wrong." });
//                 });
//         } else {
//             this.togglerBio();
//         }
//     }

//     handleChange({ target }) {
//         // console.log(("evt", target.value));

//         this.setState(
//             {
//                 [target.name]: target.value,
//             },
//             () => {
//                 // console.log("handle change uplade done", this.state);
//             }
//         );
//     }

//     render() {
//         return (
//             <>
//                 {this.state.error && (
//                     <h2 style={{ color: "red" }}>{this.state.error}</h2>
//                 )}
//                 <h3 className="bio">{this.props.bio}</h3>
//                 {this.state.bioIsVisible && (
//                     <>
//                         <form>
//                             <textarea
//                                 onChange={this.handleChange}
//                                 defaultValue={this.props.bio}
//                                 name="textarea"
//                             />
//                         </form>
//                     </>
//                 )}
//                 <button className="bio-btn" onClick={this.togglerBio}>
//                     {(this.state.bioButton && "Cancel") || "Write your Bio"}
//                 </button>
//                 {this.state.bioIsVisible && (
//                     <button onClick={this.updateBio}>Save</button>
//                 )}
//             </>
//         );
//     }
// }
