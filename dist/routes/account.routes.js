"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accounts_controller_1 = require("../controllers/accounts.controller");
const auth_validation_1 = require("../middleware/auth.validation");
const account_validation_1 = require("../middleware/account.validation");
const uploadProfilePicture_1 = require("../middleware/uploadProfilePicture");
const router = (0, express_1.Router)();
router.get("/", auth_validation_1.AuthValidation.checkJwt, accounts_controller_1.AccountsController.getAccount);
router.put("/", auth_validation_1.AuthValidation.checkJwt, account_validation_1.AccountValidation.validateUserData, accounts_controller_1.AccountsController.updateAccount);
router.put("/profilepecture", auth_validation_1.AuthValidation.checkJwt, uploadProfilePicture_1.upload.single("profile_picture"), accounts_controller_1.AccountsController.updateAccount);
exports.default = router;
