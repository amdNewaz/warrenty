var mysql = require('mysql');
var uniqid = require('uniqid');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
const qr = require("qrcode");
const fileUpload = require('express-fileupload');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'rbfglqsf',
    password: '!@Mukta!@2003',
    database: 'rbfglqsf_warrantydb'
});

module.exports.userlogin = function(request, response) {
    var email = request.body.email;
    var phone = request.body.email;
    var password = request.body.password;
    if ((phone || email) && password) {
        connection.query('SELECT * FROM staff WHERE phone=? or email = ? AND password = ?', [phone, email, password], function(error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.email = email;
                response.send({

                    id: "You are logged in",
                    code: "001",
                })
            } else {
                response.send('Incorrect email and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter email and Password!');
        response.end();
    }
}
module.exports.stafflogin = function(request, response) {
    var email = request.body.email;
    var phone = request.body.email;
    var password = request.body.password;
    if ((phone || email) && password) {
        connection.query('SELECT * FROM staff  WHERE phone=? OR email = ? AND password = ?', [phone, email, password], function(error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.email = email;
                response.send({

                    id: "You are logged in",
                    code: "002",
                })
            } else {
                response.send('Incorrect email and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter email and Password!');
        response.end();
    }

    /*
     {
    "email" : "amdnewwaz@gmail.com",
    "phone" : "+601162098849",
    "gender" : "male",
    "name" : "Demo1",
    "date" : "19-20-2000",
    "password" : "0531"

}
*/

}
module.exports.home = function(request, response) {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.email + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
}


module.exports.StaffRegistration = function(request, response) {

    var email = request.body.email;
    var phone = request.body.phone;
    var gender = request.body.gender;
    var name = request.body.name;
    var dob = request.body.date;
    var staff_id = uniqid.time("S");
    console.log(request.body);
    var password = request.body.password;
    if (email && password) {
        connection.query("INSERT INTO staff (name,email,phone,gender,dob,staff_id, password) VALUES (?,?,?,?,?,?,?)", [name, email, phone, gender, dob, staff_id, password], function(error, results, fields) {
            request.session.loggedin = true;
            request.session.name = name;
            response.send({

                message: "Staff Succesfully registerred",
                id: "002",
                staffID: staff_id
            });

            response.end();
        });
    } else {
        response.send('Please enter email and Password!');
        response.end();
    }


}
module.exports.UserRegistration = function(request, response) {

    var email = request.body.email;
    var phone = request.body.phone;
    var gender = request.body.gender;
    var name = request.body.name;
    var dob = request.body.date;
    var buyer_id = uniqid.time("B");

    var password = request.body.password;
    if (email && password) {
        connection.query("INSERT INTO buyer (bname,bemail,bphone,bgender,bdob,buyer_id, password) VALUES (?,?,?,?,?,?,?)", [name, email, phone, gender, dob, buyer_id, password], function(error, results, fields) {
            request.session.loggedin = true;
            request.session.name = name;
            response.send({

                message: `User ${name} Succesfully registerred`,
                id: "002",
                buyerID: buyer_id
            });
            console.log(fields);
            response.end();
        });
    } else {
        response.send('Please enter email and Password!');
        response.end();
    }
    console.log(request.body.date);

}

module.exports.staffProfile = function(request, response) {

    var email = request.body.email;
    var phone = request.body.phone;

    // console.log(request.body.email);


    var sql = 'SELECT * FROM staff WHERE email = ? OR phone = ?';
    connection.query(sql, [email, phone], function(err, result) {
        if (err) throw err;


        console.log(result[0]);
        response.send({

            message: "Staff Profile",
            id: "003",
            photo: result[0].photo,
            name: result[0].name,
            email: result[0].email,
            phone: result[0].phone,


            staffID: result[0].staff_id
        });
        response.end();
    });






}
module.exports.editStaff = function(request, response) {

    var name = request.body.name;
    var staff_id = request.body.staff_id;
    var email = request.body.email;
    var phone = request.body.phone;
    var staffDP = request.files.staffDP;
    let staffPath = './staffProfile/' + staff_id + '.jpg';

    // console.log(request.body.email);
    staffDP.mv(staffPath, function(err) {
        if (err)
            return response.status(500).send(err);


    });

    var profile_url = __dirname + `/staffProfile/Skm65yogr.jpg`;


    var query = 'UPDATE staff SET name = ?,email=?, phone =?,photo=? WHERE staff_id=?';
    connection.query(query, [name, email, phone, profile_url, staff_id], function(err, result) {
        if (err) throw err;



        response.send({

            message: "Staff Profile Updated",
            id: "004",



            staffID: staff_id,
            photo: profile_url
        });
        response.end();
    });






}

module.exports.userProfile = function(request, response) {

    var email = request.body.email;
    var phone = request.body.phone;

    // console.log(request.body.email);


    var sql = 'SELECT * FROM buyer WHERE bemail = ? OR bphone = ?';
    connection.query(sql, [email, phone], function(err, result) {
        if (err) throw err;


        console.log(result[0]);
        response.send({

            message: "Staff Profile",
            id: "003",
            photo: result[0].photo,
            name: result[0].bname,
            email: result[0].bemail,
            phone: result[0].bphone,


            staffID: result[0].staff_id
        });
        response.end();
    });






}
module.exports.editUser = function(request, response) {

    var name = request.body.name;
    var buyer_id = request.body.buyer_id;
    var email = request.body.email;
    var phone = request.body.phone;
    var buyerDP = request.files.buyerDP;
    let buyerPath = './buyerProfile/' + buyer_id + '.jpg';

    // console.log(request.body.email);
    buyerDP.mv(buyerPath, function(err) {
        if (err)
            return response.status(500).send(err);


    });

    var profile_url = `http://localhost:9000\staffProfile\"${buyer_id}.jpg`;


    var query = 'UPDATE buyer SET bname = ?,bemail=?, bphone =?,photo=? WHERE buyer_id=?';
    connection.query(query, [name, email, phone, profile_url, buyer_id], function(err, result) {
        if (err) throw err;



        response.send({

            message: "Buyer Profile Updated",
            id: "006",



            buyer_id: buyer_id,
            photo: profile_url
        });
        response.end();
    });

}
var messagebird = require('messagebird')('EvHdv7s8vCVJTohL5Fub2svUw');

module.exports.requestOtp = function(req, res) {

    var number = req.body.number;

    console.log(req.body);
    var tok;

    messagebird.verify.create(number, {
        originator: 'Code',
        template: 'Your verification code is %token.',
        tok: 'Your verification code is %token.'


    }, function(err, response) {
        if (err) {
            // Request has failed
            console.log(err);
            res.send({
                error: err.errors[0].description
            });
        } else {
            // Request was successful
            console.log(response);
            res.send({
                id: response.id
            });
        }
        console.log(tok);

    })



}

module.exports.submitOtp = function(req, res) {
    var id = "f8dd21b511844275b30e1c495c58ac3b";
    var token = 678353;

    console.log(id);

    // Make request to Verify API
    messagebird.verify.verify(id, token, function(err, response) {
        if (err) {
            // Verification has failed
            console.log(err);
            res.send({
                error: err.errors[0].description,
                id: id
            });
        } else {
            // Verification was successful
            console.log(response);
            res.send(id);
        }
    })
}
module.exports.add_equipment = function(request, response) {

    var product = {
        brand_name: request.body.brand_name,
        model_number: request.body.model_number,
        warrenty_length: request.body.warrenty_length,
        sub_warrenty: request.body.sub_warrenty,

    }


    if (product.model_number && product.warrenty_length) {

        connection.query("INSERT INTO products (brand_name,	model_number,warrenty_length,sub_warrenty) VALUES (?,?,?,?)", [product.brand_name, product.model_number, product.warrenty_length, product.sub_warrenty], function(error, results, fields) {
            request.session.loggedin = true;

            response.send({

                message: "Product Added Succesfully",
                id: "003",
                model_number: product.model_number
            });
            var text = JSON.stringify(product);
            try {
                qr.toFile('./product/p' +
                    product.model_number + '.png', text);
            } catch (err) {
                console.error(err)
            }

            response.end();


        });
    } else {
        response.send('Please enter model number and warrenty');
        response.end();
    }


}
module.exports.registerEquipment = function(request, response) {


    var buyer_HP = request.body.buyer_HP;
    var product_brand = request.body.product_brand;
    var product_model = request.body.product_model;
    var warrenty_length = request.body.warrenty_length;
    var serial = request.files.serial;
    var equipment = request.files.equipment;
    var order_id = uniqid.time("Order");

    var recipt = request.files.recipt;





    let reciptPath = './recipts/recipt_' + order_id + '.png';
    let serialPath = './serial/serial_' + order_id + '.png';
    let equipmentPath = './equipment/equipment_' + order_id + '.png';

    // Use the mv() method to place the file somewhere on your server
    recipt.mv(reciptPath, function(err) {
        if (err)
            return response.status(500).send(err);


    });
    serial.mv(serialPath, function(err) {
        if (err)
            return response.status(500).send(err);


    });
    equipment.mv(equipmentPath, function(err) {
        if (err)
            return response.status(500).send(err);


    });

    if (1) {
        connection.query("INSERT INTO orders (order_id,buyer_HP,product_brand,product_model,warrenty_length) VALUES (?,?,?,?,?)", [order_id, buyer_HP, product_brand, product_model, warrenty_length], function(error, results, fields) {

            response.send({

                message: "Staff Succesfully registerred",
                id: "002",
                staffID: order_id
            });

            response.end();
            if (error) {
                console.log(error);
            }
            console.log(results);
        });
    } else {
        response.send('Please enter email and Password!');
        response.end();
    }







}