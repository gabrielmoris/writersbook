import ProfilePic from "./profilePic";
import BioEditor from "./bioEditor";

export default function Profile({
    first,
    last,
    imageUrl,
    toggler,
    bio,
    renderbio
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
                    <BioEditor
                        bio={bio}
                        renderbio={renderbio}
                    />
                </div>
            </div>
        </>
    );
}
