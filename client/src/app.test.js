//#1 Import component I want to test
import App from "./app";
//#2 Imports things I need from RTL
import { render, waitFor } from "@testing-library/react";

//Write the first Test (Confirm that the app will render a div)
//Since I dont want to confirm that the server end point works but the component renders the component
//I will mock first the fetch results
test("app eventually renders a Div", async () => {
    fetch.mockResolvedValue({
        async json() {
            return {
                first: "Gabriel",
                last: " Chamane Moue",
                url: "https://www.lavanguardia.com/files/og_thumbnail/uploads/2021/06/07/60be17e39ecfa.jpeg",
                id: 55555,
                email: "aaa@aaaa.a",
                bio: "mi bio esta aqui",
            };
        },
    });
    //#1 pass to render the component that I want to test
    const { container } = render(<App />);
    // console.log("Test: ", container.innerHTML);
    // expect(container.innerHTML).toContain("Error");
    await waitFor(()=>{
        expect(container.querySelector("div")).toBeTruthy();
    });
});
