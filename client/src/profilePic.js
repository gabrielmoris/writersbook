export default function ProfilePic({ first, last, imageUrl, toggler}) {
    imageUrl = imageUrl || `default.png`;
    return (
        <div>
            <img onClick={()=>toggler()} className="profile-pic" src={imageUrl} alt={`${first} ${last}`}/>
            <div>
                {first} {last}
            </div>
        </div>
    );
}
