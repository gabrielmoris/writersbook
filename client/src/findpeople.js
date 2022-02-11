import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
            <input
                className="search-people"
                placeholder="Find more writers"
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="relative">
                <div className="absolute">
                    {people.map((user) => (
                        <div className="user-list" key={user.id}>
                            <Link
                                className="each-person-search"
                                onClick={() => {
                                    setSearch({ target: { value: "" } });
                                }}
                                to={`/user/${user.id}`}
                            >
                                <img className="minipic" src={user.url}></img>
                                <h4 className="name-person-search">
                                    {user.first} {user.last}
                                </h4>
                            </Link>
                            <hr className="findpeople-hr" />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
