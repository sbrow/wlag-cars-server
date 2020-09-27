"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
// @ts-ignore
var crawler_1 = require("crawler");
var cron_1 = require("cron");
var mongodb = require("mongodb");
function initDB(db) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db.createCollection("cars")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function crawl(db) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _i, site, e_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    _a = [];
                    for (_b in crawler_1.sites)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    site = _a[_i];
                    if (!(site === "cars")) return [3 /*break*/, 3];
                    return [4 /*yield*/, crawler_1.main(db, "cars", crawler_1.sites[site])];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 6];
                case 5:
                    e_2 = _c.sent();
                    console.error(e_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(_this, void 0, void 0, function () {
    var express, cors, bodyParser, logger, API_PORT_1, app, router, dbRoute, client, dbName, db_1, cars_1, e_3;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                express = require("express");
                cors = require("cors");
                bodyParser = require("body-parser");
                logger = require("morgan");
                API_PORT_1 = process.env.SERVER_PORT || process.env.npm_config_server_port || "3001";
                app = express();
                app.use(cors());
                router = express.Router();
                dbRoute = "mongodb://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASS + "@" + process.env.DB_HOST + ":27017";
                if (process.env.MONGO_CONN !== undefined) {
                    dbRoute = process.env.MONGO_CONN;
                }
                else if (process.env.npm_package_config_db !== undefined) {
                    dbRoute = process.env.npm_package_config_db;
                }
                console.log(dbRoute);
                return [4 /*yield*/, mongodb.connect(dbRoute, { useNewUrlParser: true })];
            case 1:
                client = _a.sent();
                dbName = dbRoute.match(/(\/)(.[^\/]*$)/)[2];
                return [4 /*yield*/, client.db(dbName)];
            case 2:
                db_1 = _a.sent();
                return [4 /*yield*/, initDB(db_1)];
            case 3:
                _a.sent();
                console.debug("Registering cronjob...");
                new cron_1.CronJob("0 * * * *", function () {
                    console.log("Triggering crawler");
                    crawl(db_1);
                }, null, true, undefined, undefined, true);
                console.debug("Job registered.");
                return [4 /*yield*/, db_1.collection("cars")];
            case 4:
                cars_1 = _a.sent();
                // (optional) only made for logging and
                // bodyParser, parses the request body to be a readable json format
                app.use(bodyParser.urlencoded({ extended: false }));
                app.use(bodyParser.json());
                app.use(logger("dev"));
                // this is our create method
                // this method adds new data in our database
                router.post("/putData", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        try {
                            cars_1.insertOne(req.body);
                            return [2 /*return*/, res.json({ success: true })];
                        }
                        catch (err) {
                            return [2 /*return*/, res.json({ success: false, error: err })];
                        }
                        return [2 /*return*/];
                    });
                }); });
                // this is our get method
                // this method fetches all available data in our database
                router.get("/getData", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                    var data, err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, cars_1.aggregate([{ $project: { _id: 0 } }]).toArray()];
                            case 1:
                                data = _a.sent();
                                // return res.json({ success: true, data: { aaData: data } });
                                return [2 /*return*/, res.json({ success: true, data: data })];
                            case 2:
                                err_1 = _a.sent();
                                return [2 /*return*/, res.json({ success: false, error: err_1 })];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                router.get("/crawl", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        crawl(db_1);
                        return [2 /*return*/, res.json({ success: true, message: "Crawler started." })];
                    });
                }); });
                // append /api for our http requests
                app.use("/api", router);
                // launch our backend into a port
                app.listen(API_PORT_1, function () { return console.log("LISTENING ON PORT " + API_PORT_1); });
                return [3 /*break*/, 6];
            case 5:
                e_3 = _a.sent();
                console.error(e_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); })();
