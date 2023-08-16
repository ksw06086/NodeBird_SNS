"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const user_1 = require("../controllers/user");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.patch('/update', middlewares_1.isLoggedIn, upload.none(), user_1.update);
router.post('/:id/follow', middlewares_1.isLoggedIn, user_1.follow);
router.post('/:id/follow/cancel', middlewares_1.isLoggedIn, user_1.followCancel);
router.post('/:id/like', middlewares_1.isLoggedIn, user_1.like);
router.post('/:id/like/cancel', middlewares_1.isLoggedIn, user_1.likeCancel);
exports.default = router;
