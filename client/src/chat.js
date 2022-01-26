import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";
import { Link } from "react-router-dom";

export default function Chat() {
    const chatMessages = useSelector((state) => state && state.chat);

    const chatContainerRef = useRef();
    const textareaRef = useRef();

    useEffect(() => {
        chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
    });

    const formatDate = (dbDate) => {
        let createdAtDateObj = new Date(dbDate);
        let newDate = new Intl.DateTimeFormat("en-GB", {
            dateStyle: "long",
            timeStyle: "short",
        }).format(createdAtDateObj);
        return newDate;
    };

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("newChatMessage", e.target.value);
            textareaRef.current.value = "";
        }
    };

    // console.log("in chat.js", chatMessages);

    return (
        <>
            <div className="chat-container" ref={chatContainerRef}>
                {chatMessages &&
                    chatMessages.map((message) => (
                        <div className="message" key={message.chat_id}>
                            <Link
                                className="chat-link"
                                to={`/user/${message.user_id}`}
                            >
                                <img
                                    className="minipic"
                                    src={message.url}
                                ></img>
                                {message.first} {message.last}:
                            </Link>
                            {message.message}
                            <p className="time-chat">
                                {formatDate(message.time)}
                            </p>
                            <hr className="chat-hr" />
                        </div>
                    ))}
            </div>
            <textarea
                className="chat-textarea"
                ref={textareaRef}
                onKeyDown={keyCheck}
                placeholder="Push enter to send a message."
            ></textarea>
        </>
    );
}
