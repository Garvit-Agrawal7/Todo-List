import express from "express";
import bodyParser from "body-parser";
import mongoose, {mongo} from "mongoose";

const app = express();
const port = 3000;
mongoose.connect("mongodb://localhost:27017/TodoList")

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended:true }));

const itemSchema = {
    text: String,
    time: String
}

const Item = mongoose.model("Item", itemSchema)

const item1 = new Item({
    text: "Welcome to this TodoList!",
    time: calcTime()
})

const item2 = new Item({
    text: "Type in your todo and hit the add button to create a todo",
    time: calcTime()
})

const defaultItems = [item1, item2];

app.get("/", (req, res) => {
    Item.find({})
        .then(function (todos) {
            if (todos.length === 0) {
                Item.insertMany(defaultItems)
                    .catch(function (err) {
                        console.log(err)
                    })
            }
            res.render("index.ejs", { title: calcDate(), todos: todos });
        })
        .catch(function (err) {
            console.log(err)
        })
});

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
    const item = new Item({
        text: todoText,
        time: calcTime()
    });
    item.save();
    res.redirect("/")
});

app.post("/delete", (req, res) => {
    Item.findByIdAndRemove(req.body.checkbox)
        .catch(function (err) {
            console.log(err)
        })
    res.redirect("/")
})

app.listen(port)