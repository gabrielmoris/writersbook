import  {Registration}  from "./registration"

export default function Welcome () {
    return (
        <>
            <header>
                <img className="logo" src="/logo.png" alt="logo" />
                <h1 className="welcome">Writersbook</h1>
            </header>
            <Registration />
        </>
    );
}