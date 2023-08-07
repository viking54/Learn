const express = require("express");
const { Pro } = require("../model/proSchema");
const { User } = require("../model/userSchema");
const multer = require("multer");
const router = express.Router();

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, type, price, quantity, sellerId, desc } = req.body;

    const imagePath = req.file.path;

    const newPro = new Pro({
      name,
      image: imagePath,
      price,
      quantity,
      type,
      sellerId,
      desc,
    });

    await newPro.save();

    return res.status(200).send({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error saving product:", error);
    return res.status(400).send({ message: "Failure" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Pro.find();
    const formattedProducts = products.map((product) => ({
      ...product.toObject(),
      image: product.image.toString("utf-8"), // Convert the Buffer to a string
    }));
    res.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/products/:sellerId", async (req, res) => {
  const sellerId = req.params.sellerId;

  try {
    // Fetch products by seller ID
    const products = await Pro.find({ sellerId });

    if (!products) {
      return res
        .status(404)
        .json({ message: "No products found for this seller." });
    }

    const formattedProducts = products.map((product) => ({
      ...product.toObject(),
      image: product.image.toString("utf-8"), // Convert the Buffer to a string
    }));
    return res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
});

router.post("/edit/:productId", async (req, res) => {
  try {
    const { price, quantity, desc } = req.body;
    const productId = req.params.productId;
    const product = await Pro.findById(productId);

    if (!product) {
      res.status(404).send({ message: "Product not found" });
    }

    product.price = price;
    product.quantity = quantity;
    product.desc = desc;

    await product.save();

    res.status(200).send({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.delete("/products/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    const deletedProduct = await Pro.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/cartCall/:UserId", async (req, res) => {
  try {
    const userId = req.params.UserId;

    // Fetch the user with the provided user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract unique product IDs from all carts using Set
    const productIdSet = new Set();
    user.cart.forEach((item) => {
      if (item._id) {
        // Add a check to ensure productId is defined
        productIdSet.add(item._id.toString());
      }
    });

    // Convert Set to an array of unique product IDs
    const uniqueProductIds = Array.from(productIdSet);

    // Fetch product details for each unique product ID using Promise.all
    const promises = uniqueProductIds.map(async (productId) => {
      const product = await Pro.findById(productId);
      return product;
    });

    // Resolve all promises and get the product details
    const productDetails = await Promise.all(promises);

    const formattedProducts = productDetails.map((product) => ({
      ...product.toObject(),
      image: product.image.toString("utf-8"), // Convert the Buffer to a string
    }));
    return res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error fetching product details from cart:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete("/cartproducts/:productId/:userId", async (req, res) => {
  const productId = req.params.productId;
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const productIndex = user.cart.findIndex(
      (item) => item._id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    user.cart.splice(productIndex, 1);
    await user.save();

    res.json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error deleting product from cart:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/saveorder/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { buyername, address, pincode, productId, sellerId,name, price, image } =
      req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const orderItem = {
      buyername,
      address,
      pincode,
      productId,
      sellerId,
      name,
      price,
      image,
    };

    user.orders.push(orderItem);
    await user.save();

    res.json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/orderCall/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const OrderData = user.orders;
    return res.status(200).json(OrderData);
  } catch (error) {
    console.error("Error fetching orders data:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/callorders/:sellerId", async (req, res) => {

  try {
    const sellerId = req.params.sellerId;

    // Find all users who have placed orders for products with the given sellerId
    const usersWithOrders = await User.find({ 'orders.sellerId': sellerId });

    // Extract all orders for the specific seller from the found users
    const orders = [];
    usersWithOrders.forEach((user) => {
      const sellerOrders = user.orders.filter((order) => order.sellerId === sellerId);
      orders.push(...sellerOrders);
    });

    // Return the orders to the frontend
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders data:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
router.put('/updateOrderStatus/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;

    // Find the user by searching for the order ID in the orders array
    const user = await User.findOne({ 'orders._id': orderId });
    if (!user) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Find the specific order in the orders array and update its status
    const orderToUpdate = user.orders.find((order) => order._id.toString() === orderId);
    if (!orderToUpdate) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    orderToUpdate.status = status;

    // Save the updated user
    await user.save();

    // Status updated successfully
    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});



module.exports = router;
