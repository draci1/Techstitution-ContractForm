const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const DB_URI = "mongodb://localhost:27017/Techstitution-ContractForm";
const bodyParser = require('body-parser');
const Router = express.Router();
const ObjectId = require('mongodb').ObjectId;

MongoClient.connect(DB_URI, (err, db) => {
    if (err) {
        console.log('Error connecting to db: ' + err);
        return;
    }
    contracts = db.collection('contracts');
    archive = db.collection('archive');
    console.log('Successful connection to db' + DB_URI);
});

app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    contracts.find({}).toArray(function (err, docs1) {
        archive.find({}).toArray(function (err, docs2) {
            if (err) {
                console.log(err);
            }
            res.render('index', { docs: docs1, arch: docs2 });
        })
    });
});
app.post('/create', function (req, res, next) {
    MongoClient.connect(DB_URI, function (err, db) {
        if (err) { throw err; }
        var collection = db.collection('contracts');
        var contract = {
            contract_title: req.body.contract_title,
            contract_language: {
                albanian: req.body.language1,
                english: req.body.language2,
                serbian: req.body.language3
            },
            procurement_number: req.body.procurement_number,
            procurement_type: req.body.procurement_type,
            procurement_activity: req.body.procurement_activity,
            date_start: req.body.date_start,
            date_publication: req.body.date_publication,
            date_signed: req.body.date_signed,
            imp_deadline_start: req.body.imp_deadline_start,
            imp_deadline_end: req.body.imp_deadline_end,
            conclusion_date: req.body.conclusion_date,
            price: req.body.price,
            total_price: req.body.total_price,
            contractor_name: req.body.contractor_name
        };
        collection.insert(contract, function (err, result) {
            if (err) { throw err; }
            db.close();
            res.redirect('/');
        });
    });
});

app.post('/edit', function (req, res, next) {
    MongoClient.connect(DB_URI, function (err, db) {
        if (err) { throw err; }
        var collection = db.collection('contracts');
        var query = { '_id': ObjectId(req.body.edit_hidden_id) };
        var newval = {
            $set:
                {
                    'contract_title': req.body.edit_contract_title,
                    'contract_language': {
                        'albanian': req.body.edit_language1,
                        'english': req.body.edit_language2,
                        'serbian': req.body.edit_language3
                    },
                    'procurement_number': req.body.edit_procurement_number,
                    'procurement_activity': req.body.edit_procurement_activity,
                    'date_start': req.body.edit_date_start,
                    'date_publication': req.body.edit_date_publication,
                    'date_signed': req.body.edit_date_signed,
                    'imp_deadline_start': req.body.edit_imp_deadline_start,
                    'imp_deadline_end': req.body.edit_imp_deadline_end,
                    'conclusion_date': req.body.edit_conclusion_date,
                    'price': req.body.edit_price,
                    'total_price': req.body.edit_total_price,
                    'contractor_name': req.body.edit_contractor_name
                }
        };
        console.log(newval);
        collection.updateOne(query, newval, function (err, result) {
            if (err) throw err;
            db.close();
            res.redirect('/');
        });
    });
});

app.post('/delete', function (req, res) {
    MongoClient.connect(DB_URI, function (err, db) {
        if (err) { throw err; }
        var collection = db.collection('contracts');
        var query = { '_id': ObjectId(req.body.delete_hidden_id) };
        collection.deleteOne(query, (err, result) => {
            if (err) throw err;
            db.close();
            res.redirect('/');
        });
    });
});

app.post('/archive', function (req, res) {
    MongoClient.connect(DB_URI, function (err, db) {
        if (err) { throw err; }
        var collection = db.collection('contracts');
        collection.findOne({ '_id': ObjectId(req.body.archive_hidden_id) }, (err, doc) => {
            if (err) throw err;
            else {
                var query1 = {
                    contract_title: doc.contract_title,
                    contract_language: {
                        albanian: doc.contract_language.albanian,
                        english: doc.contract_language.english,
                        serbian: doc.contract_language.serbian
                    },
                    procurement_number: doc.procurement_number,
                    procurement_type: doc.procurement_type,
                    procurement_activity: doc.procurement_activity,
                    date_start: doc.date_start,
                    date_publication: doc.date_publication,
                    date_signed: doc.date_signed,
                    imp_deadline_start: doc.imp_deadline_start,
                    imp_deadline_end: doc.imp_deadline_end,
                    conclusion_date: doc.conclusion_date,
                    price: doc.price,
                    total_price: doc.total_price,
                    contractor_name: doc.contractor_name
                };
                db.collection('archive').insert(query1, (err, doc) => {
                    if (err) throw err;
                    else {
                        collection.deleteOne({ '_id': ObjectId(req.body.archive_hidden_id) }, (err, doc) => {
                            if (err) throw err;
                            else res.redirect('/');
                        });
                    }
                });
            }
        });
    })
});
app.listen(3000, "localhost", (err) => {
    if (err) {
        console.log("Something's off with the connection: " + err);
    }
    else {
        console.log("Listening to localhost!");
    }
});

