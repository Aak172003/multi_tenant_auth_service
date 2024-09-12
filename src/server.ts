// This function return type is string

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// .
// .

function login(username: string): string {
    console.log("username ------ username ----- ", username);

    const user = {
        name: "Aakash",
        age: 17,
    };
    // eslint fix into dot notation

    const name = user.name;
    console.log(name);

    return username;
}

login("Aakash");
