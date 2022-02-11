import { Link } from "react-router-dom";
import useForm from "./hooks/useForm";
import useFormSubmit from "./hooks/useFormSubmit";

export default function Registration() {
    const [userInput, handleChange] = useForm();
    const [handleSubmit, error] = useFormSubmit("/register.json", userInput);

    return (
        <>
            {error && (
                <h2 className="error" style={{ color: "red" }}>
                    {error}
                </h2>
            )}
            <form>
                <h1>Register:</h1>
                <input
                    name="first"
                    placeholder="First Name"
                    type="text"
                    onChange={handleChange}
                ></input>
                <input
                    name="last"
                    placeholder="Last Name"
                    type="text"
                    onChange={handleChange}
                ></input>
                <input
                    name="email"
                    placeholder="your@email.com"
                    type="email"
                    onChange={handleChange}
                ></input>
                <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    onChange={handleChange}
                ></input>
                <button onClick={handleSubmit}>Register</button>
                <Link to="/login">Click here to Log in!</Link>
            </form>
        </>
    );
}

//VERSION AS A CLASS COMPONENT/////////////////////////
// import { Component } from "react";
// import { Link } from "react-router-dom";
// export class Registration extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             // error: "", this would be added automatically
//         };
//         //I can turn in the render this in arrow functions, but this way is better for the performance.
//         this.handleChange = this.handleChange.bind(this);
//         this.handleSubmit = this.handleSubmit.bind(this);
//     }
//     componentDidMount() {
//         // console.log("Registration mounted");
//     }

//     handleChange({ target }) {
//         // console.log(("evt", target.value));
//         //to update the state I use this.setState and pass it to an object with our state changes
//         this.setState(
//             {
//                 [target.name]: target.value,
//             },
//             () => {
//                 // console.log("handle change uplade done", this.state);
//             }
//         );
//     }

//     handleSubmit(e) {
//         e.preventDefault();
//         // console.log("user wants to submit",this.state)
//         fetch("/register.json", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(this.state),
//         })
//             .then((data) => data.json())
//             .then((data) => {
//                 // console.log("response data from /register.json", data.success);
//                 if (data.success === true) {
//                     location.reload();
//                 } else {
//                     this.setState({ error: "Something went wrong." });
//                 }
//             })
//             .catch((err) => {
//                 console.log("Err in fetcch /register.json", err);
//                 this.setState({ error: "Something went wrong." });
//             });
//     }

//     render() {
//         return (
//             <>
//                 {this.state.error && (
//                     <h2 style={{ color: "red" }}>{this.state.error}</h2>
//                 )}
//                 <form>
//                     <h1>Register:</h1>
//                     <input
//                         name="first"
//                         placeholder="First Name"
//                         type="text"
//                         onChange={this.handleChange}
//                     ></input>
//                     <input
//                         name="last"
//                         placeholder="Last Name"
//                         type="text"
//                         onChange={this.handleChange}
//                     ></input>
//                     <input
//                         name="email"
//                         placeholder="your@email.com"
//                         type="email"
//                         onChange={this.handleChange}
//                     ></input>
//                     <input
//                         name="password"
//                         placeholder="Password"
//                         type="password"
//                         onChange={this.handleChange}
//                     ></input>
//                     <button onClick={this.handleSubmit}>Register</button>
//                     <Link to="/login">Click here to Log in!</Link>
//                 </form>
//             </>
//         );
//     }
// }
