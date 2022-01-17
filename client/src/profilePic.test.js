import ProfilePic from "./profilePic";
import { render, fireEvent } from "@testing-library/react";

test("When no url is passed img src is default.png", () => {
    const { container } = render(<ProfilePic />);
    console.log(container.querySelector("img").src);
    expect(container.querySelector("img").src.endsWith("default.png")).toBe(
        true
    );
});

test("When a url is passed img src is that picture", () => {
    const { container } = render(
        <ProfilePic imageUrl="www.thisIsaUrl.com" />
    );
    expect(
        container.querySelector("img").src.endsWith("www.thisIsaUrl.com")).toBe(true);
});

test("First and Last appears as an attribute in img", () => {
    const { container } = render(
        <ProfilePic first="onion" last="testing" />
    );
    expect(
        container.querySelector("img").alt.endsWith("onion testing")).toBe(true);
});

test("onClick prop runs when the img is clicked",()=>{
    const fakeOnClick = jest.fn(()=>console.log("User clicked"));
    const {container}= render(<ProfilePic toggler={fakeOnClick}/>);
    fireEvent.click(container.querySelector("img"));
    console.log("Fakeclick: ",fakeOnClick.mock);
    expect(fakeOnClick.mock.calls.length).toBe(1);
});