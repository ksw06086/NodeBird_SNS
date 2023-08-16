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
exports.uploadPost = exports.afterUploadImage = void 0;
const post_1 = __importDefault(require("../models/post"));
const hashtag_1 = __importDefault(require("../models/hashtag"));
const afterUploadImage = (req, res) => {
    var _a;
    console.log(req.file);
    res.json({ url: `/img/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}` });
};
exports.afterUploadImage = afterUploadImage;
const uploadPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // req.body.content, req.body.url
    try {
        // 해시태그 가리키는 정규표현식(/#[^\s#]*/g = #[^\s#]* => #이 있고 그 다음이 공백,# 이 아닌 나머지)
        // 노드교과서 너무 재밌어요, #노드교과서 #익스프레스 짱짱
        const post = yield post_1.default.create({
            content: req.body.content,
            img: req.body.url,
            UserId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if (hashtags) {
            // 포스트와 Hashtag 다대다 관계를 위해 값 둘다 넣어주기
            const result = yield Promise.all(hashtags.map((tag) => {
                // 있으면 찾아오고 없으면 만들어서 가져와라 -> 공식문서 보면 다 알려줌
                return hashtag_1.default.findOrCreate({
                    where: { title: tag.slice(1).toLowerCase() }
                });
            }));
            console.log('result', result);
            yield post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.uploadPost = uploadPost;
