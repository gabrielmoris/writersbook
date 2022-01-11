import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <>
            <header>
                <img className="logo" src="/logo.png" alt="logo" />
                <h1 className="welcome">Writersbook</h1>
                <a href="/logout">Logout</a>
            </header>
            <div className="big-logo">
                <img className="home-img" src="/logo.png" alt="logo" />
            </div>
        </>
    );
}
