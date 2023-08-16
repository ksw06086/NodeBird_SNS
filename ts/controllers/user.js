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
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeCancel = exports.like = exports.followCancel = exports.follow = exports.update = void 0;
const user_1 = __importDefault(require("../models/user"));
const user_2 = require("../services/user");
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // req.user.id, req.body.nick
    try {
        console.log(req.body);
        const user = yield user_1.default.findOne({ where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id } });
        if (user) { // user가 없을 수도 있으니까
            yield user_1.default.update({
                nick: req.body.nick,
            }, {
                where: { id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id }
            });
            res.send('success');
        }
        else {
            res.status(404).send('no user');
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.update = update;
const follow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    // req.user.id, req.params.id
    const result = yield (0, user_2.follow)(req.user.id, req.params.id);
    try {
        const user = yield user_1.default.findOne({ where: { id: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id } });
        if (result === 'ok') { // user가 없을 수도 있으니까
            res.send('success');
        }
        else if (result === 'no user') {
            res.status(404).send('no user');
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.follow = follow;
const followCancel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    // req.user.id, req.params.id
    try {
        const user = yield user_1.default.findOne({ where: { id: (_d = req.user) === null || _d === void 0 ? void 0 : _d.id } });
        if (user) { // user가 없을 수도 있으니까
            yield user.removeFollowing(parseInt(req.params.id, 10));
            res.send('success');
        }
        else {
            res.status(404).send('no user');
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.followCancel = followCancel;
const like = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    // req.user.id, req.params.id
    try {
        const user = yield user_1.default.findOne({ where: { id: (_e = req.user) === null || _e === void 0 ? void 0 : _e.id } });
        if (user) { // user가 없을 수도 있으니까
            yield user.addLikePost(parseInt(req.params.id, 10));
            res.send('success');
        }
        else {
            res.status(404).send('no post');
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.like = like;
const likeCancel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    // req.user.id, req.params.id
    try {
        const user = yield user_1.default.findOne({ where: { id: (_f = req.user) === null || _f === void 0 ? void 0 : _f.id } });
        if (user) { // user가 없을 수도 있으니까
            yield user.removeLikePost(parseInt(req.params.id, 10));
            res.send('success');
        }
        else {
            res.status(404).send('no post');
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.likeCancel = likeCancel;
