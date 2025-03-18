"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsController = void 0;
const accountModel_1 = require("../models/accountModel");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const appUrl = process.env.APP_URL;
const minioEndpoint = process.env.MINIO_ENDPOINT;
const minioPort = process.env.MINIO_PORT;
class AccountsController {
}
exports.AccountsController = AccountsController;
_a = AccountsController;
AccountsController.getAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.id;
    const account = yield accountModel_1.Account.byId(id);
    // console.log(account, "account");
    // console.log(id, "id");
    res.status(200).json(account);
});
AccountsController.updateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const id = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    if (!id) {
        res.status(400).json({ error: "❌ يجب إرسال ID المستخدم" });
        return;
    } // استخدم `req.user.id` بدلاً من `req.body.id`
    if (req.file) {
        const fileLocation = req.file.location;
        req.body.data = Object.assign(Object.assign({}, req.body.data), { profile_picture: fileLocation });
    }
    const account = yield accountModel_1.Account.update(req.body.data, id);
    res.status(200).json(account);
});
