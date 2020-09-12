const crypto = require('crypto');

class KoInBBSModel {
    constructor() {
        this.database = {
            freeBoard: [{
                number: 2,
                author: '심영',
                title: '김두한에게...',
                content: '안 하겠소! 다시는 안 하겠소!',
                date: new Date('1972-11-21')
            }, {
                number: 1,
                author: '김두한',
                title: '심영에게...',
                content: '공산당 할 거야, 안 할 거야!',
                date: new Date('1972-11-21')
            }], anonBoard: [], fleaMarket: [{
                number: 1,
                author: '상하이 조',
                title: '야인시대 65화 팝니다.',
                content: '야인시대 65화는 정말 일품이란 말이야. 대사도 뻑뻑하고 연기혼도 꽤 많이 들었어.',
                date: new Date('1972-11-21')
            }]
        }
    }

    static generateAnonAuthor(username) {
        return 'anon_' + crypto.createHash('md5').update(username).digest("hex").substring(0, 5);
    }

    static generatePasswordHash(password) {
        return crypto.createHash('sha512').update(password).digest('base64');
    }

    getPostList(boardType) {
        return this.database[boardType];
    }

    deletePost(post) {
        let board = this.database[post.boardType];
        board.splice(board.indexOf(post), 1);
    }

    addPost(post) {
        let board = this.database[post.boardType];
        post.number = board.length + 1;
        board.unshift(post);
    }
}

exports = module.exports = KoInBBSModel;