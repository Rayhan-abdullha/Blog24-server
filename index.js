const express = require("express");
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const postsRoute = require("./routes/post")
const categoryRoute = require("./routes/categories");
const multer = require("multer")
const path = require("path")

const port = process.env.PORT || 5000;

app.use(express.json())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

dotenv.config()
app.use("/images", express.static(path.join(__dirname,"/images")))

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2nody.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`).then(console.log("Connected to Mongodb"))
.catch(err => console.log(err))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

app.get("/", (req, res) => {
    res.send("Server Starting...")
})

const upload = multer({storage: storage})
app.post("/api/upload", upload.single("file"), (req,res) => {
    res.status(200).json("file has been uploded")
})

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postsRoute)
app.use("/api/categories", categoryRoute)

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
});