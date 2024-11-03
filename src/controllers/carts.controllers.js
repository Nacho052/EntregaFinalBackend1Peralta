import { request, response } from "express";
import CartsModel from "../models/carts.models.js";
import { getCartByIdServices, createCartServices, addProductToCartServices, deleteProductsInCartServices, deleteCartServices, updateProductsInCartServices } from "../services/carts.services.js";

export const getCartById = async (req = request, res = response) => {
  try {
    const { cid } = req.params;
    const cart = await getCartByIdServices(cid);

    if (cart)
      return res.json({ cart });

    return res.status(404).json({ msg: `El carrito ID ${cid} no existe` })
  } catch (error) {
    return res.status(500).json({ msg: "ERROR" });
  }
};

export const createCart = async (req = request, res = response) => {
  try {
    const cart = await createCartServices();
    return res.json({ msg: 'Carrito creado', cart })
  } catch (error) {
    console.log("createCart = ", error);
    return res.status(500).json({ msg: "ERROR" });
  }
};

export const addProductToCart = async (req = request, res = response) => {
  try {
    const { cid, pid } = req.params;
    const cart = await addProductToCartServices(cid, pid);

    if (!cart)
      return res.status(404).json({ msg: `El carrito ID ${cid} no existe` });

    return res.json({ msg: "Carrito actualizado", cart });

  } catch (error) {
    return res.status(500).json({ msg: "ERROR" });
  }
};

export const deleteProductsInCart = async (req = request, res = response) => {
  try {
    const { cid, pid } = req.params;
    const cart = await deleteProductsInCartServices(cid, pid);
    if (!cart)
      return res.status(404).json({ msg: "El producto no pudo eliminarse" });
    return res.json({ msg: "Producto eliminado", cart });
  } catch (error) {
    return res.status(500).json({ msg: "ERROR" });
  }
}

export const updateProductsInCart = async (req = request, res = response) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || !Number.isInteger(quantity))
      return res.status(404).json({ msg: "La cantidad es obligatoria y debe ser un número entero!" });

    const cart = await updateProductsInCartServices(cid, pid, quantity);

    if (!cart)
      return res.status(404).json({ msg: "El producto no pudo actualizarse" });

    return res.json({ msg: "Producto actualizado", cart })
  } catch (error) {
    return res.status(500).json({ msg: "ERROR" });
  }
}

export const deleteCart = async (req = request, res = response) => {
  try {
    const { cid } = req.params;

    const cart = await deleteCartServices(cid);

    if (!cart)
      return res.status(404).json({ msg: "El carrito no pudo eliminarse" });
    return res.json({ msg: "Carrito eliminado", cart });
  } catch (error) {
    return res.status(500).json({ msg: "ERROR" });
  }
}