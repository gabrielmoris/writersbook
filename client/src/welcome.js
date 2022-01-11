import { BrowserRouter, Route } from "react-router-dom";
import { Registration } from "./registration";
import {Login} from "./login";

export default function Welcome() {
    return (
        <>
            <header>
                <img className="logo" src="/logo.png" alt="logo" />
                <h1 className="welcome">Writersbook</h1>
            </header>
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                </div>
            </BrowserRouter>
        </>
    );
}
