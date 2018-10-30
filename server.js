var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var path = require('path');

mongoose.connect('mongodb://localhost/commerce_db');

var ProductSchema = new mongoose.Schema({
    name: { type: String, required: [true, "name must be at least 3 characters in length"], minlength: 3 },
    qty: { type: Number, required: [true, "quantity must be at least 0"], min: 0 },
    price: { type: Number, required: [true, "price must be at least $0.00"], min: 0 },
});

var Product = mongoose.model('Product', ProductSchema);
var Product = mongoose.model('Product');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public/dist/public'));

app.get('/products', function (req, res) {
    Product.find({}, function (err, products) {
        if (err) {
            console.log("Errors!", err);
            res.json({ message: "Error", error: err });
        } else {
            res.json({ message: "Success", products: products })
            console.log("Success! Here are the current products:")
            console.log(products)
        }
    })
})

app.post('/products/new', function (req, res) {
    var product = new Product({ name: req.body.name, qty: req.body.qty, price: req.body.price });
    product.save(function (err) {
        if (err) {
            console.log("Errors!", err);
            res.json({ message: "These are your errors:", error: err });
        } else {
            console.log("Success! You added a product:");
            res.json({ message: "Success", product: product })
        }
    })
})

app.get('/products/:id', function (req, res) {
    var id = req.params.id;
    Product.findOne({ _id: id }, function (err, product) {
        res.json({ product:product });
    })
})

app.put('/products/:id/edit', function (req, res) {
    var id = req.params.id;
    Product.findById({_id: id}, function (err, product) {
        if (err) {
            console.log('Errors!');
            // $location.path('/products/:id/edit')
        } else {
            // if (req.body.name == null) {
            //     $location.path('/products/:id/edit')
            // }
            // if (req.body.name) {
                product.name = req.body.name;
            // }
            // if (req.body.qty) {
                product.qty = req.body.qty;
            // }
            // if (req.body.price) {
                product.price = req.body.price;
            // }
            product.save(function (err) {
                if (err) {
                    console.log("Errors!", err);
                    res.json({ message: "Error", error: err });
                } else {
                    console.log('Successfully edited a product!');
                    res.json(product)
                }
            })
        }
    })
})

app.delete('/products/:id/delete', function(req, res) {
    var id = req.params.id;
    Product.remove({_id: id}, function(err) {
      if (err){
        console.log("Returned error", err);
        res.json({message: "Error", error: err});
      } else {
        console.log('Product DELETED!');
        res.json({message: "Success"})
      }
    })
})

app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});

app.listen(8000, function () {
    console.log("Listening on port 8000");
})
