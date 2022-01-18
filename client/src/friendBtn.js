import { useState, useEffect } from "react";

export default function FriendBtn({id}) {

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

    //LOGIC 2
    //on submit
    //I want to either make different fetch requests depending on what the btn text reads  Or make the same fetch and send
    //...

    const changeStatusFollow= ()=>{
        
    };

    return (
        <>
            {error && <h2 style={{ color: "red" }}>{error}</h2>}
            <button onClick={changeStatusFollow}>{buttonText}</button>
        </>
    );
}
