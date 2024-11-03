import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    title: {type: String, required:[true, "El título es obligatorio"]},
    description: {type: String, required:[true, "La descripción es obligatoria"]},
    code: {type: String, required:[true, "El código es obligatorio"], unique: true},
    price: {type: Number, required:[true, "El precio es obligatorio"]},
    stock: {type: Number, required:[true, "El stock es obligatorio"]},
    category: {type: String, require:[true, "La catergoría es obligatoria"]},
    thumbnails: String
});

productsSchema.set('toJSON',{
    transform: function(doc,ret){
        delete ret.__v;
        return ret;
    }
});

const ProductsModel = mongoose.model("products", productsSchema);
export default ProductsModel;