import express from "express";

const tenantRouter = express.Router();

tenantRouter.post("/", (req, res) => {
    res.status(201).json({});
});

export default tenantRouter;
