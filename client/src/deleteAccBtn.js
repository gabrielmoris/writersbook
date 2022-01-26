import { useState, useEffect } from "react";

export default function DeleteBtn() {
    const [buttonText, setButtonText] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        setButtonText("Delete Account");
    }, []);

    const deleteAc = () => {
        if (buttonText === "Delete Account") {
            fetch(`/api/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ buttonText: buttonText }),
            })
                .then((data) => data.json())
                .then((data) => {
                    setButtonText(data.btn);
                    setError(data.err);
                })
                .catch((e) => {
                    console.log("Error in friendBtn: ", e);
                    setError("Something went wrong 🤔");
                });
        } else if (buttonText === "Just do it!") {
            fetch(`/api/delete-yes`, {
                method: "POST",
            })
                .then((data) => data.json())
                .then((data) => {
                    console.log(data);
                    if (data.success === true) {
                        location.replace("/");
                    } else {
                        setError("Something went wrong.");
                    }
                })
                .catch((e) => {
                    console.log("Error in just do it btn: ", e);
                    setError("Something went wrong 🤔");
                });
        }
    };

    return (
        <>
            {error && <h2 style={{ color: "red" }}>{error}</h2>}
            <button onClick={deleteAc}>{buttonText}</button>
            {error && (
                <a href="/">
                    Go back
                </a>
            )}
        </>
    );
}
