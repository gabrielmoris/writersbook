import { Component } from "react";
import ProfilePic from "./profilePic";
import Uploader from "./uploaderComponent";
import Profile from "./profile";
import { FindPeople } from "./findpeople";
import OtherProfile from "./otherProfile";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { FriendsAndWannabees } from "./friendsAndWannabees";
import Chat from "./chat";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        this.togglerUploader = this.togglerUploader.bind(this);
        this.updateImgUrl = this.updateImgUrl.bind(this);
        this.renderBio = this.renderBio.bind(this);
    }

    componentDidMount() {
        fetch("/appmount")
            .then((answer) => {
                return answer.json();
            })
            .then((data) => {
                this.setState({
                    email: data.email,
                    first: data.first,
                    last: data.last,
                    id: data.id,
                    url: data.url,
                    bio: data.bio,
                });
            })
            .catch((e) => {
                console.log("Error Mounting app: ", e);
            });
    }

    updateImgUrl(url) {
        this.setState({ url: url });
    }

    renderBio(newBio) {
        this.setState({ bio: newBio });
    }

    togglerUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    render() {
        return (
            <>
                <BrowserRouter>
                    <header>
                        <img className="logo" src="/logo.png" alt="logo" />
                        <h1 className="welcome">Writersbook</h1>
                        <div className="wannafriends">
                            <ProfilePic
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.url}
                                toggler={this.togglerUploader}
                            />
                            <a className="logout" href="/logout">
                                Logout
                            </a>
                            <Link to="/friends">Friends</Link>
                            <Link to="/chat">Chat</Link>
                        </div>
                    </header>

                    <FindPeople />
                    <Route exact path="/">
                        <Profile
                            first={this.state.first}
                            last={this.state.last}
                            imageUrl={this.state.url}
                            toggler={this.togglerUploader}
                            bio={this.state.bio}
                            renderbio={this.renderBio}
                        />
                    </Route>
                    <Route path="/user/:id">
                        <OtherProfile />
                    </Route>
                    <Route path="/friends">
                        <FriendsAndWannabees />
                    </Route>
                    <Route path="/chat">
                        <Chat/>
                    </Route>
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            updater={this.updateImgUrl}
                            toggler={this.togglerUploader}
                        />
                    )}
                </BrowserRouter>
            </>
        );
    }
}
