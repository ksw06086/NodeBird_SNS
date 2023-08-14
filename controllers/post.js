const User = require('../models/user');
const Post = require('../models/post');
const Hashtag = require('../models/hashtag');

exports.afterUploadImage = (req, res) => {
    console.log(req.file);
    res.json({ url: req.file.location });
}

exports.uploadPost = async (req, res, next) => {
    // req.body.content, req.body.url
    try {
        // 해시태그 가리키는 정규표현식(/#[^\s#]*/g = #[^\s#]* => #이 있고 그 다음이 공백,# 이 아닌 나머지)
        // 노드교과서 너무 재밌어요, #노드교과서 #익스프레스 짱짱
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g); 
        if(hashtags) {
            // 포스트와 Hashtag 다대다 관계를 위해 값 둘다 넣어주기
            const result = await Promise.all(hashtags.map((tag) => {
                // 있으면 찾아오고 없으면 만들어서 가져와라 -> 공식문서 보면 다 알려줌
                return Hashtag.findOrCreate({
                    where: { title: tag.slice(1).toLowerCase() }
                });
            }));
            console.log('result', result);
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
}

