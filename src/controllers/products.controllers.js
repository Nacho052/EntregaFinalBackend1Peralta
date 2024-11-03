import { request, response } from "express";
import {addProductServices, deleteProductServices, getProductsByIdServices, getProductsServices, updateProductServices} from "../services/products.services.js";


export const getProducts = async (req = request, res = response) => {
  try {
    const result = await getProductsServices({ ...req.query });
    return res.json({ result });
  } catch (error) {
    return res.status(500).json({ msg: "ERROR" });
  }
};

export const getProductsById = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const Product = await getProductsByIdServices(pid);
    if (!Product)
      return res.status(404).json({ msg: `El producto ID ${pid} no existe` });
    return res.json({ Product });
  } catch (error) {
    console.log("getProductsById = ", error);
    return res.status(500).json({ msg: "ERROR" });
  }
};

export const addProduct = async (req = request, res = response) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title, !description, !code, !price, !stock, !category)
      return res
        .status(404)
        .json({
          msg: "Los campos: Title, Description, Code, Price, Stock y Category son obligatorios",
        });

    const product = await addProductServices({...req.body});
    return res.json({ product });

  } catch (error) {
    return res.status(500).json({ msg: "ERROR" });
  }
};

export const updateProduct = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const { _id, ...rest } = req.body;
    const product = await updateProductServices(pid, rest);

    if (product) return res.json({ msg: "Product update", product });
    return res.status(404).json({ msg: `No se pudo actualizar el producto ID ${pid}` });
  } catch (error) {
    return res.status(500).json({ msg: "ERROR" });
  }
};

export const deleteProduct = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const product = await deleteProductServices(pid);
    if (product) return res.json({ msg: "Producto eliminado", product });
    return res.status(404).json({ msg: `No se pudo eliminar el producto ID ${pid}` });
  } catch (error) {
    console.log("deleteProduct = ", error);
    return res.status(500).json({ msg: "ERROR" });
  }
};
