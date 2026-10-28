const { Router } = require("express");
const Menu = require("../model/menuSchema");
const menuRouter = Router();

const menuCategories = {
  chicken: "Chicken Buckets",
  launch: "New Launch",
  rolls: "Chicken Rolls",
  biryani: "Biryani Buckets",
  boxmeals: "Box Meals",
  burger: "Burgers",
  stayhome: "Stay Home Specials",
  snacks: "Snacks & Sides",
  beverages: "Beverages",
};

menuRouter.get("/menu", async (req, res) => {
  const { type, ...filters } = req.query;
  const category = menuCategories[type?.toLowerCase()];
  const query = category
    ? {
        ...filters,
        $or: [{ category }, { type }],
      }
    : req.query;
  const items = await Menu.find(query);
  res.json(items);
});

menuRouter.get("/menu/:id", async (req, res) => {
  let { id } = req.params;
  let only = await Menu.find({ _id: id });
  return res.json(only);
});
module.exports = menuRouter;