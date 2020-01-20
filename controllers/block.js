const { JsonRpc } = require("eosjs");
const fetch = require("node-fetch");
const rpc = new JsonRpc("https://api.eosnewyork.io", { fetch });

exports.getIndex = (req, res, next) => {
    res.render("index", {
        pageTitle: "Block.one Test"
    });
};

exports.getBlocks = (req, res, next) => {
  (async () => {
    try {
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
    } catch (error) {
      res.status(500).json(error);
    }
  })();
};
