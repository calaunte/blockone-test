const express = require("express");
const bodyParser = require("body-parser");
const { JsonRpc } = require("eosjs");
const fetch = require("node-fetch");
const expressHbs = require("express-handlebars");
const path = require("path");


const rpc = new JsonRpc("https://api.eosnewyork.io", { fetch });

const app = express();

app.engine(
  "hbs",
  expressHbs({
    layoutsDir: "views/layouts",
    defaultLayout: "main-layout",
    extname: "hbs",
    helpers: {
        toJSON: function(obj){
            return JSON.stringify(obj, null, 3);
        }
    }
  })
);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

let blockList = [];

app.get("/", (req, res, next) => {
  res.render("index", {
    pageTitle: "Block One Test",
    blocks: blockList
  });
});

app.post("/", (req, res, next) => {
    (async () => {
    let result = await rpc.get_info();
    let lastNum = result.last_irreversible_block_num;
    let numList = [];

    for (let i = lastNum - 10; i < lastNum; i++) {
      numList.push(i);
    }

    let blockList = [];
    for (let j = 0; j < numList.length; j++) {
      let res = await rpc.get_block(numList[j]);
      count = 0;
      res.transactions.forEach(() => {
        count++;
      });

      blockList.push({
        blockInfo: res,
        count: count
      });
    }

    res.render("index", {
        pageTitle: "Block.one Test",
        block: blockList
    });
  })();
});

app.use((req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found"
  });
});

app.listen(3000);
