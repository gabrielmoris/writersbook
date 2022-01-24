import { useSelector, useDispatch } from "react-redux";
import {
    makeFriend,
    allFriend,
    endFriend,
} from "./redux/friends-and-wannabees/slice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function FriendsAndWannabees() {
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const wannabees = useSelector(
        (state) =>
            state.friendsAndWannabees &&
            state.friendsAndWannabees.filter(
                (friendship) => !friendship.accepted
            )
    );

    const follows = useSelector(
        (state) =>
            state.friendsAndWannabees &&
            state.friendsAndWannabees.filter(
                (friendship) => friendship.accepted
            )
    );

    useEffect(() => {
        let abort = false;
        fetch(`/follow`)
            .then((res) => res.json())
            .then((data) => {
                if (!abort) {
                    dispatch(allFriend(data));
                }
            });
        return () => {
            abort = true;
        };
    }, []);

    const handleAccept = (id) => {
       
        fetch(`/api/follow-status/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id, buttonText: "Accept" }),
        })
            .then((data) => data.json())
            .then(() => {
                dispatch(makeFriend(id));
            })
            .catch((e) => {
                console.log("Error Accepting the request: ", e);
                setError("Something went wrong 🤔");
            });
    };
    const handleUnfollow = (id) => {
        fetch(`/api/follow-status/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id, buttonText: "Unfollow" }),
        })
            .then((data) => data.json())
            .then(() => {
                dispatch(endFriend(id));
            })
            .catch((e) => {
                console.log("Error Accepting the request: ", e);
                setError("Something went wrong 🤔");
            });
    };

    const handleReject = (id) => {
        
        fetch(`/api/follow-status/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id, buttonText: "Reject" }),
        })
            .then((data) => data.json())
            .then(() => {
                dispatch(endFriend(id));
            })
            .catch((e) => {
                console.log("Error Accepting the request: ", e);
                setError("Something went wrong 🤔");
            });
    };    

    return (
        <>
            {error && <h2 style={{ color: "red" }}>{error}</h2>}
            <Link className="link" to={`/`}>
                Go back
            </Link>
            <h1 className="h1-smaller">Wants to follow you:</h1>
            {!wannabees && <h2>Nobody.</h2>}
            {wannabees &&
                wannabees.map((wannabe) => {
                    return (
                        <div className="wannafriends" key={wannabe.id}>
                            <img
                                style={{ cursor: "auto" }}
                                id="big-profile-pic"
                                src={wannabe.url}
                            />
                            <p>
                                {wannabe.first} {wannabe.last}
                            </p>
                            <div className="2-buttons">
                                <button
                                    onClick={() => handleAccept(wannabe.id)}
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleReject(wannabe.id)}
                                >
                                    Reject
                                </button>
                            </div>
                            <hr className="friends-hr" />
                        </div>
                    );
                })}
            <hr className="long-hr" />
            <h1 className="h1-smaller">Following:</h1>
            {!follows && <h2>Nobody.</h2>}
            {follows &&
                follows.map((following) => {
                    return (
                        <div className="wannafriends" key={following.id}>
                            <img
                                style={{ cursor: "auto" }}
                                id="big-profile-pic"
                                src={following.url}
                            />
                            <p>
                                {following.first} {following.last}
                            </p>
                            <button
                                onClick={() => handleUnfollow(following.id)}
                            >
                                Unfollow
                            </button>
                            <hr className="friends-hr" />
                        </div>
                    );
                })}
        </>
    );
}
