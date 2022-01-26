import ProfilePic from "./profilePic";
import BioEditor from "./bioEditor";
import DeleteBtn from "./deleteAccBtn";

export default function Profile({
    first,
    last,
    imageUrl,
    toggler,
    bio,
    renderbio,
    id
}) {
    imageUrl = imageUrl || `default.png`;
    return (
        <>
            <div>
                <ProfilePic
                    first={first}
                    last={last}
                    imageUrl={imageUrl}
                    toggler={toggler}
                    id="big-profile-pic"
                />
                <div>
                    <h2>
                        {first} {last}
                    </h2>
                    <BioEditor bio={bio} renderbio={renderbio} />
                </div>
                <DeleteBtn id={id} />
            </div>
        </>
    );
}
