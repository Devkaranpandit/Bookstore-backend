const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// 🔥 MongoDB connect (yaha apna URL dalna)
mongoose.connect("mongodb+srv://devkaranxb_db_user:TTdjv3Iz3SIQuoNR@cluster0.zrebsho.mongodb.net/bookstore")
.then(() => console.log("DB connected"))
.catch(err => console.log(err));

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Backend running");
});
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) return res.status(400).send("User not found");

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(400).send("Wrong password");

    const token = jwt.sign({ id: user._id }, "secret");

    res.json({ token });
});
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.status(400).send("Username already exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashed });
    await user.save();

    res.send("User created");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});