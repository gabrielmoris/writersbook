import { Link } from "react-router-dom";
import useForm from "./hooks/useForm";
import useFormSubmit from "./hooks/useFormSubmit";

export default function Login() {
    const [userInput, handleChange] = useForm();
    const [handleSubmit, error] = useFormSubmit("/login.json", userInput);

    return (
        <>
            {error && (
                <h2 className="error" style={{ color: "red" }}>
                    {error}
                </h2>
            )}
            <form>
                <h1>Login:</h1>
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
                <button onClick={handleSubmit}>Login</button>
                <Link to="/">Click here to register!</Link>
            </form>
            <Link className="reset-password" to="/reset-password">
                Forgot your password?
            </Link>
        </>
    );
}

//AS A CLASS COMPONENT
// import { Component } from "react";
// import { Link } from "react-router-dom";

// export class Login extends Component {
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
//         // console.log("Login mounted");
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
//         fetch("/login.json", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(this.state),
//         })
//             .then((data) => data.json())
//             .then((data) => {
//                 // console.log("response data from /login.json", data.success);
//                 if (data.success === true) {
//                     location.reload();
//                 } else {
//                     this.setState({ error: "Something went wrong." });
//                 }
//             })
//             .catch((err) => {
//                 console.log("Err in fetcch /login.json", err);
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
//                     <h1>Login:</h1>
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
//                     <button onClick={this.handleSubmit}>Login</button>
//                     <Link to="/">Click here to register!</Link>
//                 </form>
//                 <Link className="reset-password" to="/reset-password">
//                     Forgot your password?
//                 </Link>
//             </>
//         );
//     }
// }
