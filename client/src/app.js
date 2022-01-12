import { Component } from "react";
import ProfilePic from "./profilePic";
import Uploader from "./uploaderComponent";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        this.togglerUploader = this.togglerUploader.bind(this);
    }

    componentDidMount() {
        fetch("/appmount").then((answer)=>{
            return answer.json();
        }).then((data)=>{
            this.setState({
                email: data.email,
                first: data.first,
                last: data.last,
                id: data.id,
                url: data.url,
            });
        });
        //make fetch request to get data for currently loger in user
        //and store this data un the component state

    }

    togglerUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }


    render() {
        return (
            <>
                <header>
                    <img className="logo" src="/logo.png" alt="logo" />
                    <h1 className="welcome">Writersbook</h1>
                    <a className="logout" href="/logout">
                        Logout
                    </a>
                </header>
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.url}
                    toggler={this.togglerUploader}
                />
                {this.state.uploaderIsVisible && <Uploader />}
            </>
        );
    }
}

