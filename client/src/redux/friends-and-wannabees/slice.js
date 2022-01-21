export function friendsAndWannabeesReducer(friendsAndWannabees=null, action) {
    if (action.type == "friends-and-wannabees/received") {
        friendsAndWannabees = action.payload.friendsAndWannabees;
    } else if (action.type === "friends-and-wannabees/accept") {
        const newFriendsAndWannabees = friendsAndWannabees.map((friend) => {
            if (friend.id === action.payload.id) {
                return { ...friend, accepted: true };
            }
            return friend;
        });
        return newFriendsAndWannabees;
    } else if (action.type === "friends-and-wannabees/end") {
        const newFriendsAndWannabees = friendsAndWannabees.filter((friend) => {
            return friend.id !== action.payload.id;
        });
        return newFriendsAndWannabees;
    }
    return friendsAndWannabees;
}

export function makeFriend(id) {
    return {
        type: "friends-and-wannabees/accept",
        payload: { id },
    };
}

export function endFriend(id) {
    return {
        type: "friends-and-wannabees/end",
        payload: { id },
    };
}

export function allFriend(friendsAndWannabees) {
    return {
        type: "friends-and-wannabees/received",
        payload: { friendsAndWannabees },
    };
}
