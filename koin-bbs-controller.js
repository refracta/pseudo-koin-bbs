const KoInBBSView = require("./koin-bbs-view.js");
const KoInBBSModel = require("./koin-bbs-model.js");

class KoInBBSController {
    init() {
        this.view = new KoInBBSView();
        this.model = new KoInBBSModel();

        /* 로그인 페이지 유저 입력 Callback */
        this.view.onSubmitUsernameLogin = (input, value) => {
            if (value) {
                this.username = input.value;
                this.view.clearContent();
                this.view.drawMainPage(this.username);
            }
        }

        /* 게시판 입장 버튼 Callback */
        this.view.onPressFreeBoard = () => {
            this.currentBoardType = 'freeBoard';
            this.view.clearContent();
            this.view.drawBBSPage(this.currentBoardType, this.model.getPostList(this.currentBoardType));
        }
        this.view.onPressAnonBoard = () => {
            this.currentBoardType = 'anonBoard';
            this.view.clearContent();
            this.view.drawBBSPage(this.currentBoardType, this.model.getPostList(this.currentBoardType));
        }
        this.view.onPressFleaMarket = () => {
            this.currentBoardType = 'fleaMarket';
            this.view.clearContent();
            this.view.drawBBSPage(this.currentBoardType, this.model.getPostList(this.currentBoardType));
        }

        /* 게시글 목록 Callback */
        this.view.onPressMainBack = () => {
            this.view.clearContent();
            this.view.drawMainPage(this.username);
        }
        this.view.onPressNewPost = () => {
            this.view.clearContent();
            this.view.drawNewPostPage(this.currentBoardType);
        }
        this.view.onSelectPostElement = (v) => {
            let index = v.position.top - 1;
            if (index < 0) {
                return;
            }
            let postList = this.model.getPostList(this.currentBoardType);
            this.view.clearContent();
            this.selectedPost = postList[index];
            this.view.drawPostPage(this.selectedPost);
        };

        /* 게시글 페이지 Callback */
        this.view.onPressNewPostSubmit = (v) => {
            if (v.content.trim() === '' || v.title.trim() === '') {
                return;
            }
            if (this.currentBoardType === 'anonBoard' && v.password.trim() === '') {
                return;
            }
            if (v.password) {
                v.password = KoInBBSModel.generatePasswordHash(v.password);
                v.author = KoInBBSModel.generateAnonAuthor(this.username);
            } else {
                v.author = this.username;
            }
            this.model.addPost({...v, date: new Date(), boardType: this.currentBoardType});
            this.view.clearContent();
            this.view.drawBBSPage(this.currentBoardType, this.model.getPostList(this.currentBoardType));
        }
        this.view.onPressPostDelete = () => {
            this.view.clearContent();
            this.view.drawDeleteConfirm(this.currentBoardType);
        }
        this.view.onPressPostBack = this.view.onPressNewPostBack = () => {
            this.view.clearContent();
            this.view.drawBBSPage(this.currentBoardType, this.model.getPostList(this.currentBoardType));
        };


        /* 게시글 삭제 Callback */
        this.view.onPressDeleteYes = (password) => {
            if (this.currentBoardType === 'anonBoard' && password.trim() === '') {
                return;
            }
            if (password) {
                if (this.selectedPost.password === KoInBBSModel.generatePasswordHash(password)) {
                    this.model.deletePost(this.selectedPost);
                    this.selectedPost = void 0;
                    this.view.clearContent();
                    this.view.drawBBSPage(this.currentBoardType, this.model.getPostList(this.currentBoardType));
                }
            } else {
                if (this.selectedPost.author === this.username) {
                    this.model.deletePost(this.selectedPost);
                    this.selectedPost = void 0;
                    this.view.clearContent();
                    this.view.drawBBSPage(this.currentBoardType, this.model.getPostList(this.currentBoardType));
                }
            }
        }
        this.view.onPressDeleteNo = () => {
            this.view.clearContent();
            this.view.drawPostPage(this.selectedPost);
        }
        this.view.drawLoginPage();
    }
}

exports = module.exports = new KoInBBSController();