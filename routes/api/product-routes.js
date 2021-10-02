const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data

  Product.findAll({
    attributes: ["id", "product_name", "price", "stock"],

    include: [
      {
        model: Category,
        attributes: ["category_name"],
      },
      {
        model: Tag,
        attributes: ["tag_name"],
      },
    ],
  })
    .then((dbProductData) => res.json(dbProductData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get one product
router.get("/:id", (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  Product.findOne({
    where: {
      id: req.params.id,
    },

    attributes: ["id", "product_name", "price", "stock"],
    include: [
      {
        model: Category,
        attributes: ["category_name"],
      },
      {
        model: Tag,
        attributes: ["tag_name"],
      },
    ],
  })
    .then((dbProductData) => {
      if (!dbProductData) {
        res.status(404).json({ message: "No Product found with that ID." });
        return;
      }
      res.status(200).json(dbProductData);
    })

    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create new product
router.post("/", (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */

   
  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    tagIds: req.body.tagIds,
  })
    .then((product) => {
      
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
     
      res.status(400).json("Unable to creat Product Tag or information is not valid");
    });
});

// update product
router.put("/:id", (req, res) => {
  Product.findOne({
    where: {
      id: req.params.id,
    }})

  

    .then((dbProductData) => {
      
      if (!dbProductData) {
        res.status(404).json({ message: "No Product found with that ID." });
        return;
      }
      Product.update(req.body, {
        where: {
          id: req.params.id,
        },
      })
      
     res.json("product is updated");
    })
     
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});
//***************** */
router.delete("/:id", (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((productData) => {
      if (!productData) {
        res.status(404).json({ message: "No Category found with that ID." });
        return;
      }
      res.json(productData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
