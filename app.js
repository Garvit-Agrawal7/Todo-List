import express from "express";
import bodyParser from "body-parser";
import mongoose, {mongo} from "mongoose";

const app = express();
const port = 3000;
mongoose.connect("mongodb://localhost:27017/TodoList")

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended:true }));

let todos = [];
const itemSchema = {
    todo: String,
    time: String
}

const Item = mongoose.model("Item", itemSchema)

app.get("/", (req, res) => {
    res.render("index.ejs", { title: calcDate(), todos: todos });
});

const item1 = new Item({
    todo: "Welcome to this TodoList!",
})

const item2 = new Item({
    todo: "Type in your todo and hit the add button to create a todo"
})

const defaultItems = [item1, item2];

Item.insertMany(defaultItems)
    .catch(function (err) {
        console.log(err)
    })

function calcTime() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    let formattedHour = currentHour < 10 ? `0${currentHour}` : currentHour;
    const formattedMinute = currentMinute < 10 ? `0${currentMinute}` : currentMinute;
    let currentTime;
    if (formattedHour > 12) {
        formattedHour %= 12
        currentTime = `${formattedHour}:${formattedMinute}pm`
        return currentTime
    } else {
        currentTime = `${formattedHour}:${formattedMinute}am`
        return currentTime
    }
}

function calcDate() {
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    return today.toLocaleDateString("en-US", options);
}


app.post("/", (req, res) => {
    let todoText = req.body.todo;
    todos.push({ text: todoText, time: calcTime() });
    res.redirect("/")
});

app.listen(port)