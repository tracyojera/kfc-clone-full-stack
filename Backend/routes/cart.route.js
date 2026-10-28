const { Router } = require("express");
const mongoose = require("mongoose");
const Cart = require("../model/cartSchema");
const cartRouter = Router();

const findCartItem = async (id) => {
  let item = await Cart.findOne({ id });

  if (!item && mongoose.Types.ObjectId.isValid(id)) {
    item = await Cart.findById(id);
  }

  return item;
};

cartRouter.post("/cart", async (req, res) => {
  await Cart.insertMany(req.body);
  return res.status(201).send("cart added");
});

cartRouter.get("/cart", async (req, res) => {
  let cart = await Cart.find();
  return res.json(cart);
});

cartRouter.delete("/cart/:id", async (req, res) => {
  const item = await findCartItem(req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Cart item was not found." });
  }

  await Cart.deleteOne({ _id: item._id });
  return res.send("delete successful");
});

cartRouter.put("/cart/:id", async (req, res) => {
  const { qty } = req.body;
  if (!Number.isInteger(qty) || qty < 0) {
    return res.status(400).json({ message: "Quantity must be a non-negative integer." });
  }

  const item = await findCartItem(req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Cart item was not found." });
  }

  if (qty === 0) {
    await Cart.deleteOne({ _id: item._id });
    return res.json({ deleted: true, id: req.params.id });
  }

  item.qty = qty;
  await item.save();
  return res.json(item);
});
module.exports = cartRouter;
