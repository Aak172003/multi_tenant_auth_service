import express from "express";

const app = express();

// console.log("app=========", app);

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Auth Service",
        status: "Ok",
    });
});

export default app;
