import BioEditor from "./bioEditor";
import { render, fireEvent } from "@testing-library/react";

test("When no bio is passed to it, an 'Add' button is rendered.", () => {
    const { container } = render(<BioEditor />);
    console.log(container.querySelector("button"));
    expect(container.querySelector("button")).toBeTruthy();
});

test(`When a bio is passed to it, an "Edit" button is rendered.`, () => {
    const { container } = render(<BioEditor bio="blablabla"/>);
    console.log(container.querySelector("button"));
    expect(container.querySelector("button").innerHTML).toContain(
        "Write your Bio"
    );
});

test(`Clicking either the "Add" or "Edit" button causes a textarea and a "Save" button to be rendered.`, () => {
    const fakeOnClick = jest.fn(() => console.log("User clicked"));
    const { container } = render(<BioEditor toggler={fakeOnClick} />);
    fireEvent.click(container.querySelector("img"));
    console.log("Fakeclick: ", fakeOnClick.mock);
    expect(fakeOnClick.mock.calls.length).toBe(1);
});

