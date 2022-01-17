import { useParams, useHistory } from "react-router";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function OtherProfile() {
    const { id } = useParams();
    const history = useHistory();
    const [userData, setUserData] = useState();

    useEffect(() => {
        //make some kind of request to some kind of place
        fetch(`/api/user/${id}`)
            .then((data) => {
                return data.json();
            })
            .then((data2) => {
                setUserData(data2);
            })
            .catch((e) => {
                console.log("Error in otherprofile: ", e);
                history.replace("/");
            });
    }, [id]);

    return (
        <>
            {userData && (
                <div>
                    <img
                        id="other-profile-pic"
                        src={userData.url}
                        alt={`${userData.first} ${userData.last}`}
                    />
                    <h2>
                        {userData.first} {userData.last}
                    </h2>
                    <h3 className="bio">{userData.bio}</h3>
                    <Link className="link" to={`/`}>
                        Go back
                    </Link>
                </div>
            )}
        </>
    );
}
