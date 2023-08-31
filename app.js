import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended:true }));

let todos = [];
let time = [];

app.get("/", (req, res) => {
    res.render("index.ejs", { todos: todos, time:time});
});

app.post("/", (req, res) => {
    let todoText = req.body.todo;
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    let formattedHour = currentHour < 10 ? `0${currentHour}` : currentHour;
    const formattedMinute = currentMinute < 10 ? `0${currentMinute}` : currentMinute;
    let currentTime;
    if (formattedHour > 12) {
        formattedHour %= 12
        currentTime = `${formattedHour}:${formattedMinute}pm`
    } else {
        currentTime = `${formattedHour}:${formattedMinute}am`
    }
    todos.push({ text: todoText, time: currentTime });
    res.redirect("/")
});

app.listen(port)