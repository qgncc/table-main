const http =  require("http");
const express = require("express");
const cors = require("cors");
const api = require("./routers/api");
const app = express();


const PORT = 8081

app.use(cors());
app.use(express.static("./build"));
app.use(express.json());
app.use("/api", api);

const server = http.createServer(app);

function start() {
    try {
        server.listen(PORT, ()=>{console.log("Server running at port", PORT)});
    } catch (error) {
        console.log(error)
    }
}
start();
