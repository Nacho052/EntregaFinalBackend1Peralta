import express from "express";
import mongoose from "mongoose";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import ProductsModel from "./models/products.models.js";
import { deleteProduct } from "./controllers/products.controllers.js";
import { getProductsServices, addProductServices } from "./services/products.services.js";

const app = express();
const PORT = 8080;

mongoose.connect("mongodb+srv://nachoperalta052:04eFnSLLHRi2iu5P@clusterperalta.glbge.mongodb.net/?retryWrites=true&w=majority&appName=ClusterPeralta")
    .then(() => console.log("Conectado a MongoDB Atlas"))
    .catch((error) => console.log("Error al conectar a MongoDB", error))

const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


httpServer.listen(PORT, () => {
    console.log(`Escuchando en puerto: ${PORT}`);
});


io.on("connection", async (socket) => {
    const { payload } = await getProductsServices({});
    const products = payload
    socket.emit("products", payload);

    socket.on("addProduct", async (product) => {
        const newProduct = await addProductServices({ ...product });
        if (newProduct) {
            products.push(newProduct)
            socket.emit("products", products);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            console.log("ID a eliminar:", productId);
            const result = await ProductsModel.findByIdAndDelete(productId);

            if (result === null) {
                socket.emit("error", { message: "Producto no encontrado" });
            } else {
                const updatedProducts = await ProductsModel.find();
                io.emit("products", updatedProducts);
            }
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            socket.emit("error", { message: "Error al eliminar el producto" });
        }
    });
});