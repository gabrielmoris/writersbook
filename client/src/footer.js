export default function footer() {
    return (
        <div className="footer">
            <hr />
            <h5>Follow me:</h5>
            <div className="icons-footer">
                <a
                    href="https://www.instagram.com/gabrieltrumpet/"
                    target="__blank"
                >
                    <img src="/instagram.svg" alt="instagram-icon" />
                </a>
                <a href="https://github.com/gabrielmoris" target="__blank">
                    <img src="/github.svg" alt="github-icon" />
                </a>
                <a
                    href="https://www.linkedin.com/in/gabrielcmoris/"
                    target="__blank"
                >
                    <img src="/linkedin.svg" alt="linkedin-icon" />
                </a>
            </div>
            <p className="copyright">
                Powered by Gabrielcmoris. All rights reserved © 2021
            </p>
        </div>
    );
}
