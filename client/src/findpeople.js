import { useEffect, useState } from "react";

export function FindPeople() {
    const [search, setSearch] = useState("");
    const [people, setPeople] = useState([]);

    useEffect(() => {
        let abort = false;
        fetch(`/people/${search}`)
            .then((res) => res.json())
            .then((people) => {
                if (!abort) {
                    setPeople(people);
                }
            });
        return () => {
            abort = true;
        };
    }, [search]);

    return (
        <>
            <h3>Find more writers</h3>
            <input onChange={(e) => setSearch(e.target.value)} />
            <div className="relative">
                <div className="absolute">
                    {people.map((user) => (
                        <div key={user.id}>
                            <img className="minipic" src={user.url}></img>{" "}
                            {user.first} {user.last}
                            <hr />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
