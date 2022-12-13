import express, { json, urlencoded } from "express";
import RouterProduct from "./routes/RouterProduct.js";
import RouterCart from "./routes/RouterCart.js";

//dirname
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true })); // middlewares
app.use("/api/productos", RouterProduct);
app.use("/api/carrito", RouterCart);
app.use("/*", (req, res) => {
  res
    .status(404)
    .json({ error: -2, descripcion: `ruta 'x' método 'y' no implementada` });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
