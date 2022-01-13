export default function ProfilePic({ first, last, imageUrl, toggler,id}) {
    console.log(toggler);
    imageUrl = imageUrl || `default.png`;
    return (
        <>
            <div>
                <img
                    onClick={() => toggler()}
                    className="profile-pic-small"
                    src={imageUrl}
                    alt={`${first} ${last}`}
                    id={id}
                />
            </div>
        </>
    );
}
