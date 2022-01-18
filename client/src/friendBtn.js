import { useState, useEffect } from "react";

export default function FriendBtn({ id }) {
    // console.log("props in FriendBtn",id);
    const [buttonText, setButtonText] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        fetch(`/api/following/${id}`)
            .then((data) => {
                return data.json();
            })
            .then((returnedData) => {
                setButtonText(returnedData);
            })
            .catch((e) => {
                console.log("Error in friendBtn: ", e);
                setError("Something went wrong 🤔");
            });
    }, [id]);

    const changeStatusFollow = () => {
        fetch(`/api/follow-status/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id, buttonText: buttonText }),
        })
            .then((data) => data.json())
            .then((data) => {
                setButtonText(data);
            })
            .catch((e) => {
                console.log("Error in friendBtn: ", e);
                setError("Something went wrong 🤔");
            });
    };

    return (
        <>
            {error && <h2 style={{ color: "red" }}>{error}</h2>}
            <button onClick={changeStatusFollow}>{buttonText}</button>
        </>
    );
}
