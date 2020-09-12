const blessed = require('blessed');

class KoInBBSView {
    constructor() {
        this.screen = blessed.screen({
            title: 'KOIN Community',
            resizeTimeout: 300,
            dockBorders: true,
            cursor: {
                artificial: true,
                shape: 'line',
                blink: true,
                color: null
            },
            debug: true,
            warnings: false,
            fullUnicode: true
        });
        this.screen.on('keypress', (ch, key) => {
            if (key.name === 'tab') {
                return key.shift
                    ? this.screen.focusPrevious()
                    : this.screen.focusNext();
            }
            if (key.name === 'escape' || key.name === 'q') {
                return process.exit(0);
            }
        });
        this.screen.key('C-z', () => {
            this.screen.sigtstp();
        });
        this.screen.on('element focus', (cur, old) => {
            if (old && old.border) {
                old.style.border.fg = 'default';
            }
            if (cur && cur.border) {
                cur.style.border.fg = 'green';
            }
            this.screen.render();
        });
        this.contentElements = [];
    }

    addHeaderInfoUI() {
        let headerInfoText = blessed.text({
            top: 0,
            left: 0,
            width: '100%',
            content: ' {green-fg}KOIN Community{/green-fg} in <{red-fg}Nownuri{/red-fg} / {magenta-fg}Chollian{/magenta-fg} / {yellow-fg}Hitel{/yellow-fg} / {cyan-fg}Unitel{/cyan-fg}>',
            style: {
                bg: '#0000ff'
            },
            tags: true,
            align: 'center'
        });
        this.contentElements.push(headerInfoText);
        let headerInfoLine = blessed.line({
            orientation: 'horizontal',
            top: 1,
            left: 0,
            right: 0
        });
        this.contentElements.push(headerInfoLine);
    }

    drawMainPage(username) {
        let title = blessed.text({
            top: '10%',
            left: 'center',
            content: '{center}{green-fg}KOIN Community{/green-fg}{/center}',
            style: {
                bg: '#0000ff'
            },
            tags: true
        });
        this.contentElements.push(title);

        let helloUserText = blessed.text({
            top: '15%',
            left: '70%',
            content: `{center}{magenta-fg}Hello! ${username}!!!{/magenta-fg}{/center}`,
            style: {
                bg: '#0000ff'
            },
            tags: true
        });
        this.contentElements.push(helloUserText);
        let freeBoard = blessed.button({
            top: '20%',
            left: 'center',
            width: '80%',
            height: '20%',
            content: '{center}Free Board{/center}',
            border: 'line',
            style: {
                fg: 'red',
                bg: 'blue'
            },
            mouse: true,
            tags: true
        });
        freeBoard.on('press', () => {
            this.onPressFreeBoard ? this.onPressFreeBoard() : void 0;
            this.screen.render();
        });
        this.contentElements.push(freeBoard);
        let anonBoard = blessed.button({
            top: '50%',
            left: 'center',
            width: '80%',
            height: '20%',
            content: '{center}Anonymous Board{/center}',
            mouse: true,
            border: 'line',
            style: {
                fg: 'red',
                bg: 'blue'
            },
            tags: true
        });
        anonBoard.on('press', () => {
            this.onPressAnonBoard ? this.onPressAnonBoard() : void 0;
            this.screen.render();
        });
        this.contentElements.push(anonBoard);
        let fleaMarket = blessed.button({
            top: '80%',
            left: 'center',
            width: '80%',
            height: '20%',
            content: '{center}Flea Market{/center}',
            mouse: true,
            border: 'line',
            style: {
                fg: 'red',
                bg: 'blue'
            },
            tags: true
        });

        fleaMarket.on('press', () => {
            this.onPressFleaMarket ? this.onPressFleaMarket() : void 0;
            this.screen.render();
        });
        this.contentElements.push(fleaMarket);

        this.addHeaderInfoUI();
        this.renderContent();
        freeBoard.focus();
    }

    drawLoginPage() {
        let title = blessed.text({
            top: '10%',
            left: 'center',
            content: '{center}{green-fg}Login{/green-fg}{/center}',
            style: {
                bg: '#0000ff'
            },
            tags: true
        });
        this.contentElements.push(title);

        let usernameInput = blessed.textbox({
            label: 'Your Username?',
            content: '',
            border: 'line',
            style: {
                fg: 'blue',
                bg: 'default',
                bar: {
                    bg: 'default',
                    fg: 'blue'
                },
                border: {
                    fg: 'default',
                    bg: 'default'
                }
            },
            width: '30%',
            left: 'center',
            top: '30%',
            height: 3,
            keys: true,
            mouse: true
        });
        usernameInput.on('submit', (value) => {
            this.onSubmitUsernameLogin ? this.onSubmitUsernameLogin(usernameInput, value) : void 0;
        });
        this.contentElements.push(usernameInput);
        this.addHeaderInfoUI();
        this.renderContent();
        usernameInput.focus();
    }

    static getBoardName(boardType) {
        switch (boardType) {
            case 'freeBoard':
                return 'Free Board';
            case 'anonBoard':
                return 'Anonymous Board';
            case 'fleaMarket':
                return 'Flea Market';
        }
    }


    drawDeleteConfirm(boardType) {
        let title = blessed.text({
            top: '10%',
            left: 'center',
            content: `{center}Do you really want to delete the post?{/center}`,
            style: {
                bg: '#0000ff'
            },
            tags: true
        });
        this.contentElements.push(title);

        let passwordInput;
        if (boardType === 'anonBoard') {
            passwordInput = blessed.textbox({
                label: 'Password',
                border: 'line',
                style: {
                    fg: 'blue',
                    bg: 'default',
                    bar: {
                        bg: 'default',
                        fg: 'blue'
                    },
                    border: {
                        fg: 'default',
                        bg: 'default'
                    }
                },
                width: '30%',
                left: 'center',
                top: '30%',
                height: 3,
                keys: true,
                mouse: true
            });
            this.contentElements.push(passwordInput);
        }
        let yes = blessed.button({
            top: '80%',
            left: '5%',
            width: '45%',
            height: '20%',
            content: '{center}Yes{/center}',
            border: 'line',
            style: {
                fg: 'red',
                bg: 'blue'
            },
            mouse: true,
            tags: true
        });

        yes.on('press', () => {
            this.onPressDeleteYes ? this.onPressDeleteYes(passwordInput ? passwordInput.value : void 0) : void 0;
            this.screen.render();
        });

        this.contentElements.push(yes);

        let no = blessed.button({
            top: '80%',
            left: '50%',
            width: '45%',
            height: '20%',
            content: '{center}No{/center}',
            border: 'line',
            style: {
                fg: 'red',
                bg: 'blue'
            },
            mouse: true,
            tags: true
        });
        no.on('press', () => {
            this.onPressDeleteNo ? this.onPressDeleteNo() : void 0;
            this.screen.render();
        });
        this.contentElements.push(no);

        this.addHeaderInfoUI();
        this.renderContent();
        no.focus();

    }

    drawPostPage(post) {
        let title = blessed.text({
            top: '10%',
            left: 'center',
            content: `{center}Number:{red-fg}${post.number}{/red-fg}\tAuthor:{magenta-fg}${post.author}{/magenta-fg}\tTitle:{green-fg}${post.title}{/green-fg}{/center}`,
            style: {
                bg: '#0000ff'
            },
            tags: true
        });
        this.contentElements.push(title);

        let content = blessed.box({
            // Possibly support:
            // align: 'center',
            content: post.content,
            style: {
                bg: 'magenta'
            },
            height: '60%',
            width: '85%',
            top: '20%',
            left: 'center',
        });

        this.contentElements.push(content);

        let deleteBtn = blessed.button({
            top: '80%',
            left: '5%',
            width: '45%',
            height: '20%',
            content: '{center}Delete{/center}',
            border: 'line',
            style: {
                fg: 'red',
                bg: 'blue'
            },
            mouse: true,
            tags: true
        });
        deleteBtn.on('press', () => {
            this.onPressPostDelete ? this.onPressPostDelete() : void 0;
            this.screen.render();
        });

        this.contentElements.push(deleteBtn);

        let back = blessed.button({
            top: '80%',
            left: '50%',
            width: '45%',
            height: '20%',
            content: '{center}Back{/center}',
            border: 'line',
            style: {
                fg: 'red',
                bg: 'blue'
            },
            mouse: true,
            tags: true
        });
        back.on('press', () => {
            this.onPressPostBack ? this.onPressPostBack() : void 0;
            this.screen.render();
        });
        this.contentElements.push(back);

        this.addHeaderInfoUI();
        this.renderContent();
        back.focus();


    }

    drawNewPostPage(boardType) {
        let title = blessed.text({
            top: '10%',
            left: 'center',
            content: `{center}{green-fg}${KoInBBSView.getBoardName(boardType)}{/green-fg}{/center}`,
            style: {
                bg: '#0000ff'
            },
            tags: true
        });
        this.contentElements.push(title);

        let titleInput = blessed.textbox({
            label: 'Title',
            border: 'line',
            style: {
                fg: 'blue',
                bg: 'default',
                bar: {
                    bg: 'default',
                    fg: 'blue'
                },
                border: {
                    fg: 'default',
                    bg: 'default'
                }
            },
            width: boardType !== 'anonBoard' ? '90%' : '65%',
            left: boardType !== 'anonBoard' ? 'center' : '5%',
            top: '15%',
            height: 3,
            keys: true,
            mouse: true
        });
        this.contentElements.push(titleInput);
        let passwordInput;
        if (boardType === 'anonBoard') {
            passwordInput = blessed.textbox({
                label: 'Password',
                border: 'line',
                style: {
                    fg: 'blue',
                    bg: 'default',
                    bar: {
                        bg: 'default',
                        fg: 'blue'
                    },
                    border: {
                        fg: 'default',
                        bg: 'default'
                    }
                },
                width: '25%',
                left: '70%',
                top: '15%',
                height: 3,
                keys: true,
                mouse: true
            });
            this.contentElements.push(passwordInput);
        }

        let contentInput = blessed.textarea({
            keys: true,
            // Possibly support:
            // align: 'center',
            style: {
                bg: 'magenta'
            },
            height: '50%',
            width: '85%',
            top: '25%',
            left: 'center',
            tags: true
        });

        this.contentElements.push(contentInput);

        let submit = blessed.button({
            top: '80%',
            left: '5%',
            width: '45%',
            height: '20%',
            content: '{center}Submit{/center}',
            border: 'line',
            style: {
                fg: 'red',
                bg: 'blue'
            },
            mouse: true,
            tags: true
        });
        submit.on('press', () => {
            this.onPressNewPostSubmit ? this.onPressNewPostSubmit({
                title: titleInput.value,
                content: contentInput.value,
                password: passwordInput ? passwordInput.value : void 0
            }) : void 0;
            this.screen.render();
        });

        this.contentElements.push(submit);

        let back = blessed.button({
            top: '80%',
            left: '50%',
            width: '45%',
            height: '20%',
            content: '{center}Back{/center}',
            border: 'line',
            style: {
                fg: 'red',
                bg: 'blue'
            },
            mouse: true,
            tags: true
        });
        back.on('press', () => {
            this.onPressNewPostBack ? this.onPressNewPostBack() : void 0;
            this.screen.render();
        });
        this.contentElements.push(back);

        this.addHeaderInfoUI();
        this.renderContent();
        titleInput.focus();
    }

    drawBBSPage(boardType, postList) {
        let title = blessed.text({
            top: '10%',
            left: 'center',
            content: `{center}{green-fg}${KoInBBSView.getBoardName(boardType)}{/green-fg}{/center}`,
            style: {
                bg: '#0000ff'
            },
            tags: true
        });
        this.contentElements.push(title);

        let table = blessed.listtable({
            top: '20%',
            left: 'center',
            data: null,
            border: 'line',
            align: 'center',
            tags: true,
            keys: true,
            width: '90%',
            height: '60%',
            vi: true,
            mouse: true,
            style: {
                border: {
                    fg: 'red'
                },
                header: {
                    fg: 'blue',
                    bold: true
                },
                cell: {
                    fg: 'magenta',
                    selected: {
                        bg: 'blue'
                    }
                }
            }
        });

        let data = [['Number', 'Author', '\t\t\t\t\t\tTitle\t\t\t\t\t\t', 'Date'].map(e => `{red-fg}${e}{/red-fg}`), ...postList.map(e => [e.number + '', e.author, e.title, e.date.toDateString()])];
        ;
        table.setData(data);
        table.on('select', (info) => {
            this.onSelectPostElement ? this.onSelectPostElement(info) : void 0;
        });
        this.contentElements.push(table);


        let newPost = blessed.button({
            top: '80%',
            left: '5%',
            width: '45%',
            height: '20%',
            content: '{center}New Post{/center}',
            border: 'line',
            style: {
                fg: 'red',
                bg: 'blue'
            },
            mouse: true,
            tags: true
        });
        newPost.on('press', () => {
            this.onPressNewPost ? this.onPressNewPost() : void 0;
            this.screen.render();
        });

        this.contentElements.push(newPost);

        let back = blessed.button({
            top: '80%',
            left: '50%',
            width: '45%',
            height: '20%',
            content: '{center}Back{/center}',
            border: 'line',
            style: {
                fg: 'red',
                bg: 'blue'
            },
            mouse: true,
            tags: true
        });
        back.on('press', () => {
            this.onPressMainBack ? this.onPressMainBack() : void 0;
            this.screen.render();
        });
        this.contentElements.push(back);

        this.addHeaderInfoUI();
        this.renderContent();
        table.focus();
    }

    clearContent() {
        this.contentElements.forEach(e => this.screen.remove(e));
        this.contentElements = [];
    }

    renderContent() {
        this.contentElements.forEach(e => this.screen.append(e));
        this.screen.render();
    }
}

exports = module.exports = KoInBBSView;