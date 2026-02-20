const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit")

const app = express();

// securit of headers
app.use(helmet());
// rate limiting --> because the huggingface only support limited free options
const limiter = rateLimit({
    windowMs: 15*60*1000,
    max:20
});

app.use(limiter);
// body parser
app.use(express.json());
// cors
app.use(cors());

// routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/generations", require("./routes/generation.routes"));

//global error handling
app.use(require("./middlewares/error.middleware"));

module.exports = app;