const express = require("express");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const path = require("path");
const blockController = require("./controllers/block");

const PORT = process.env.PORT || 8000;
const app = express();

app.engine(
  "hbs",
  expressHbs({
    layoutsDir: "views/layouts",
    defaultLayout: "main-layout",
    extname: "hbs",
    helpers: {
      toJSON: function(obj) {
        return JSON.stringify(obj, null, 3);
      }
    }
  })
);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", blockController.getIndex);

app.post("/", blockController.getBlocks);

app.use((req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found"
  });
});

app.listen(PORT);
