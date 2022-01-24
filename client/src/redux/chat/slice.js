export function chatReducer(chat = null, action) {
    if (action.type == "chat-messages/received") {
        chat = action.payload.msg;
    } else if (action.type == "chat-message/received") {
        const newChat = action.payload.msg;
        return [newChat,...chat];
    }
    return chat;
}

export function chatMessagesReceived(msg) {
    return {
        type: "chat-messages/received",
        payload: { msg },
    };
}

export function chatMessageReceived(msg) {
    return {
        type: "chat-message/received",
        payload: { msg },
    };
}
