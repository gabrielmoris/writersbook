import { useState } from "react";

export default function useFormSubmit(url, userInput) {
    const [error, setError] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInput),
        })
            .then((data) => data.json())
            .then((data) => {
               
                if (data.success === true) {
                    location.replace("/");
                } else {
                    setError("Something went wrong.");
                }
            })
            .catch((err) => {
                console.log("Err in fetcch /register.json", err);
                setError("Something went wrong.");
            });
    };
    return [handleSubmit, error];
}
