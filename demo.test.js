const myMockFn = jest.fn((n) => n * 2);

test("thest that map call our function correctely", ()=>{
    const a = [10,20,30,64];
    a.map(myMockFn);
    // console.log(":", myMockFn.mock);
    //I can check that the mocked function is called the number of items in the array
    expect(myMockFn.mock.calls.length).toBe(a.length);
    //I can check a exact value
    expect (myMockFn.mock.results[0].value).toBe(20);
    //I can understand if the function was called with the right arguments
    expect(myMockFn.mock.calls[0]).toEqual([10,0, a]);
});