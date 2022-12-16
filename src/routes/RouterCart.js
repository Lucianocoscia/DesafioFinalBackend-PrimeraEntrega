import { Router } from "express";
// import { products } from "./RouterProduct.js";
import fs from "fs";

const router = Router();

// const carts = [];

router
  .get("/:id/productos", (req, res) => {
    // - Me permite listar todos los productos guardados en el carrito
    const { id } = req.params;
    try {
      const cartToShow = JSON.parse(
        fs.readFileSync(`src/cartsArchivos/${id}.json`, "utf-8")
      );
      res.status(200).json({
        status: "Cart Found",
        data: cartToShow,
      });
    } catch (err) {
      console.log(err);

      res.status(404).json({
        status: "Not Found",
        data: ` No existe el carrito con id: ${id}`,
      });
    }
  })
  .post("/", (req, res) => {
    try {
      // - Crea un carrito y devuelve su id.
      const idGenerator = Math.random().toString(36).slice(2);
      const idCart = idGenerator;

      const date = new Date();

      const newCart = {
        id: idCart,
        timestampCart: date.toUTCString(),
        products: [],
      };

      fs.writeFileSync(
        `src/cartsArchivos/${idCart}.json`,
        JSON.stringify(newCart, null, 2)
      );

      // carts.push(newCart);

      return res.json({
        status: "Created",
        data: newCart,
      });
    } catch (err) {
      console.log(err);
      res.status(404).json({
        status: "Not Found",
        data: "No existe el carrito ",
      });
    }
  })
  .post("/:id/productos", (req, res) => {
    // -Para incorporar productos al carrito por su id de producto
    try {
      const { id } = req.params;
      const { productID } = req.body;

      const cartToShow = JSON.parse(
        fs.readFileSync(`src/cartsArchivos/${id}.json`, "utf-8")
      );
      const productList = JSON.parse(
        fs.readFileSync("src/productsArchivos/products.json", "utf-8")
      );

      const productFound = productList.find(
        (producto) => producto.id === productID
      );

      if (productID === productFound.id) {
        cartToShow.products.push(productFound);
      }
      fs.writeFileSync(
        `src/cartsArchivos/${id}.json`,
        JSON.stringify(cartToShow, null, 2)
      );

      res.status(200).json({
        status: "Success",
        data: cartToShow,
      });
    } catch (err) {
      console.log(err);

      res.status(404).json({
        status: "Not Found",
        data: "Cart Not Found or does not exist the product",
      });
    }
  })
  .delete("/:id", (req, res) => {
    // - -Vacía un carrito y lo elimina.

    try {
      const { id } = req.params;
      fs.unlinkSync(`src/cartsArchivos/${id}.json`);

      res.status(200).json({
        status: ` Success`,
        data: ` Cart ${id} deleted`,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        status: "Not Found",
        data: " No se encontro ningun cart con ese id",
      });
    }

    // const cartToDelete = carts.find((cart) => cart.id === id);

    // if (cartToDelete) {
    //   carts.splice(cartToDelete, 1);

    //   res.status(200).json({
    //     status: "Deleted",
    //     data: carts,
    //   });
    // } else {
    // }
  })
  .delete("/:id/productos/:id_prod", (req, res) => {
    // - - Eliminar un producto del carrito por su id de carrito y de producto

    try {
      const { id, id_prod } = req.params;

      const readCart = JSON.parse(
        fs.readFileSync(`src/cartsArchivos/${id}.json`, "utf-8")
      );
      readCart.products = readCart.products.filter(
        (product) => product.id !== id_prod
      );
      fs.writeFileSync(
        `src/cartsArchivos/${id}.json`,
        JSON.stringify(readCart, null, 2)
      );

      res.status(200).json({
        status: "Success",
        data: `Producto ${id_prod} eliminado del carrito ${id}`,
      });
    } catch (err) {
      console.log(err);
      res.status(404).json({
        status: "Not Found",
        data: " No se encontro ningun cart con ese id",
      });
    }
  });

export default router;
