import { Router } from "express";
import fs from "fs";
const router = Router();

// export const products = [
//   {
//     id: 1,
//     timestamp: Date.now(),
//     nombre: "Remera",
//     descripcion: "Remera negra",
//     codigo: "AB330",
//     precio: 90,
//     foto: "https://picsum.photos/200/300",
//     stock: 10,
//   },
// ];

const checkIfAdmin = (req, res, next) => {
  const userType = req.headers["usertype"];

  if (userType === "ADMIN") {
    next();
  } else {
    res.status(401).json({
      status: "Unauthorized",
      data: null,
    });
  }
};

router
  .get("/:id", (req, res) => {
    // - Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores
    const { id } = req.params;

    try {
      const products = JSON.parse(
        fs.readFileSync("src/productsArchivos/products.json", "utf-8")
      );
      const productFound = products.find((product) => product.id === id);

      if (id === productFound.id) {
        res.status(200).json({
          status: "Ok",
          data: productFound,
        });
      }
      //No me funca este if me va directo al catch
      if (id !== productFound.id) {
        res.status(404).json({ error: "Producto  no encontrado", data: null });
      }
    } catch (err) {
      console.log(err);
      res.json({
        status: "fail",
        data: "No encuentro el producto dentro del archivo products.json",
      });
    }
  })
  .get("/", (req, res) => {
    try {
      const products = JSON.parse(
        fs.readFileSync("src/productsArchivos/products.json", "utf-8")
      );
      const response = {
        status: "Ok",
        data: products,
      };

      res.json(response);
    } catch (error) {
      console.log(error);
      res.json({
        status: "fail",
        data: "No encuentro los productos",
      });
    }
  })
  .post("/", checkIfAdmin, (req, res) => {
    // - Para incorporar productos al listado (disponible para administradores)

    const { nombre, precio, foto, descripcion, stock } = req.body;

    // const newProductId = products[products.length - 1].id + 1; // se le agrega el id
    const idGeneratorProduct = Math.random().toString(30).substring(2);

    const date = new Date();

    const newProduct = {
      id: idGeneratorProduct,
      nombre: nombre,
      precio: Number(precio),
      foto: foto,
      descripcion: descripcion,
      stock: Number(stock),
      codigo: idGeneratorProduct,
      timestamp: date.toUTCString(),
    };

    try {
      const products = JSON.parse(
        fs.readFileSync("src/productsArchivos/products.json", "utf-8")
      );
      products.push(newProduct);
      fs.writeFileSync(
        "src/productsArchivos/products.json",
        JSON.stringify(products, null, 2)
      );

      res.status(200).json({
        status: "Created",
        data: newProduct,
      });
    } catch (err) {
      console.log(err);

      res.status(404).json({
        status: "Error",
        data: "No se pudo cargar el producto",
      });
    }
  })
  .put("/:id", checkIfAdmin, (req, res) => {
    // - Actualiza un producto por su id (disponible para administradores)
    try {
      const { id } = req.params;

      const { nombre, precio, foto, descripcion, stock, codigo, timestamp } =
        req.body;

      const products = JSON.parse(
        fs.readFileSync("src/productsArchivos/products.json", "utf-8")
      );
      const indexProductToUpdate = products.findIndex(
        (product) => product.id === id
      );

      if (indexProductToUpdate === -1) {
        return res
          .status(404)
          .json({ status: "Not Found", data: "No existe producto con ese id" });
      }

      products.splice(indexProductToUpdate, 1, {
        id: id,
        nombre,
        precio,
        foto,
        descripcion,
        stock: Number(stock),
        codigo,
        timestamp,
      });

      res.status(200).json({
        status: "Updated",
        data: {
          id,
          nombre,
          precio,
          foto,
          descripcion,
          stock,
          codigo,
          timestamp,
        },
      });
    } catch (error) {
      console.log(error);
      res.json({ status: "Error", data: "No se pudo actualizar el producto" });
    }
  })
  .delete("/:id", checkIfAdmin, (req, res) => {
    //  Borra un producto por su id (disponible para administradores
    const { id } = req.params;
    try {
      const products = JSON.parse(
        fs.readFileSync("src/productsArchivos/products.json", "utf-8")
      );

      const indexProductToUpdate = products.findIndex(
        (product) => product.id === id
      );
      const productToDelete = products[indexProductToUpdate];

      if (!productToDelete) {
        return res.status(404).json({ status: "Not Found", data: null });
      }

      products.splice(indexProductToUpdate, 1);

      res.status(200).json({
        status: "Deleted",
        data: productToDelete,
      });
    } catch (err) {
      console.log(err);
      res.json({
        status: "Error",
        data: " No ha sido posible eliminar el producto",
      });
    }
  });

export default router;
