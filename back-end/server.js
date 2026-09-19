const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const client = new MongoClient(process.env.MONGODB_URI);

async function startServer() {
    try {
        await client.connect();

        console.log("Connected to MongoDB");

        const db = client.db("mydatabase");

        app.get("/api/test", (req, res) => {
            res.json({
                message: "Backend is working!"
            });
        });

        app.post("/api/register", async (req, res) => {
            try {
                const { fullName, email, password } = req.body;

                const usersCollection = db.collection("users");

                const hashedPassword = await bcrypt.hash(password, 10);

                const newUser = {
                    fullName: fullName,
                    email: email,
                    password: hashedPassword
                };

                await usersCollection.insertOne(newUser);

                res.json({
                    message: "Registration successful!"
                });

            } catch (error) {
                console.error(error);

                res.status(500).json({
                    message: "Server error"
                });
            }
        });

        app.post("/api/login", async (req, res) => {
            try {
                const { email, password } = req.body;

                const usersCollection = db.collection("users");

                const user = await usersCollection.findOne({
                    email: email
                });

                if (!user) {
                    return res.status(401).json({
                        message: "Invalid email or password"
                    });
                }

                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!passwordMatch) {
                    return res.status(401).json({
                        message: "Invalid email or password"
                    });
                }

                res.json({
                    message: "Login successful!"
                });

            } catch (error) {
                console.error(error);

                res.status(500).json({
                    message: "Server error"
                });
            }
        });

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

startServer();