import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

// const getCart = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const cart = await cartModel
//       .findOne({ userId })
//       .populate("items.productId");
//     if (!cart) {
//       return res.json({ success: true, cart: [] });
//     }
//     return res.status(200).json({ success: true, cart });
//   } catch (error) {
//     console.log("getCart Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// const addToCart = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { productId } = req.body;
//     // console.log(productId);
//     // check product exists or not
//     const product = await productModel.findById(productId);
//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "product not found" });
//     }

//     // find the user carts (if exits )
//     let cart = await cartModel.findOne({ userId });

//     // if cart does not exits create a new cart
//     if (!cart) {
//       cart = new cartModel({
//         userId,
//         items: [{ productId, quantity: 1, price: product.productPrice }],
//         totalPrice: product.productPrice,
//       });
//     } else {
//       // find if already in the cart
//       const itemIndex = cart.items.findIndex(
//         (item) => item.productId.toString() === productId,
//       );
//       if (itemIndex > -1) {
//         cart.items[itemIndex].quantity += 1;
//       } else {
//         // if product not then  -> push into  cart
//         cart.items.push({
//           productId,
//           quantity: 1,
//           price: product.productPrice,
//         });
//       }
//       //  re calculate total price
//       cart.totalPrice = cart.items.reduce(
//         (acc, item) => acc + item.price * item.quantity,
//         0,
//       );
//     }

//     //  save updated card
//     await cart.save();
//     // populate product details before sending response
//     const populatedCart = await cartModel
//       .findById(cart._id)
//       .populate("items.productId");

//     return res.status(200).json({
//       success: true,
//       message: "product aaToCart successfully",
//       cart: populatedCart,
//     });
//   } catch (error) {
//     console.log("addTpCart Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// const updateQuantity = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { productId, type } = req.body;

//     const cart = await cartModel.findOne({ userId });
//     if (!cart) {
//       return res
//         .status(404)
//         .json({ success: false, message: "cart not found" });
//     }

//     const item = cart.items.find(
//       (item) => item.productId.toString() === productId,
//     );

//     if (!item) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Item not found" });
//     }
//     if (type === "increase") item.quantity += 1;
//     if (type === "decrease" && item.quantity > 1) item.quantity -= 1;

//     cart.totalPrice = cart.items.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0,
//     );

//     await cart.save();
//     cart = await cart.populate("items.productId");
//     return res.status(200).json({ success: true, cart });
//   } catch (error) {
//     console.log("updateQuantity Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// const removeToCart = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { productId } = req.body;

//     let cart = await cartModel.findOne({ userId });
//     if (!cart) {
//       return res
//         .status(404)
//         .json({ success: false, message: "cart not found" });
//     }

//     cart.items = cart.items.filter(
//       (item) => item.productId.toString() !== productId,
//     );

//     cart.totalPrice = cart.items.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0,
//     );

//     await cart.save();

//     return res.status(200).json({ success: true, cart });
//   } catch (error) {
//     console.log("removeToCart Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// export { getCart, addToCart, updateQuantity, removeToCart };


const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    const product = await productModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found try another " });
    }

    let cart = await cartModel.findOne({ userId });
    if (!cart) {
      cart = new cartModel({
        userId,
        items: [
          {
            productId,
            price: product.productPrice,
            quantity: 1,
          },
        ],
        totalPrice: product.productPrice,
      });
    } else {
      const item = cart.items.find(
        (item) => item.productId.toString() === productId,
      );

      if (!item) {
        cart.items.push({
          productId,
          price: product.productPrice,
          quantity: 1,
        });
      } else {
        item.quantity += 1;
      }

      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
    }
    await cart.save();

    const populatedData = await cart.populate("items.productId");
    return res.status(200).json({
      success: true,
      message: "Added to cart successfully",
      cart: populatedData,
    });
  } catch (error) {
    console.log("addToCart error:",error)
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await cartModel
      .findOne({ userId })
      .populate("items.productId");
    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: [], //{ items: [], totalPrice: 0
      });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.log("getCert error:", error);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, action } = req.body;

    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    if (action === "increment") {
      item.quantity += 1;
    } else {
      if (action === "decrement") {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId,
          );
        }
      }
    }

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    await cart.save();
    const populatedData = await cart.populate("items.productId");
    return res.status(200).json({ success: true, cart: populatedData });
  } catch (error) {
    console.log("updateCart error:", error);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

const removeToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found " });
    }

    // const product = await productModel.findById(productId);
    // if (!product) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "product not found " });
    // }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    await cart.save();

    const populateData = await cart.populate("items.productId");
    return res.status(200).json({ success: true, cart: populateData });
  } catch (error) {
    console.log("removeToCart error:", error);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

export { getCart, addToCart, updateCartQuantity, removeToCart };
