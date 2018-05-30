"use strict";

const SnippetItem = function (from) {
    this.id = 0;
    this.author = from;
    this.title = "";
    this.language = "plain";
    this.content = "";
    this.createDate = (new Date()).getTime();
};

const SnippetContract = function () {
    LocalContractStorage.defineMapProperty(this, "data");
    LocalContractStorage.defineProperty(this, "totalSnippets");
    LocalContractStorage.defineProperty(this, "latest");
};

SnippetContract.prototype = {
    init: function () {
        this.totalSnippets = 0;
        this.latest = "";
    },

    loadSnippet: function (id) {
        const item = this.data.get(id);
        const ret = {
            err: "",
            data: ""
        };
        if (gameData) {
            ret.data = JSON.stringify(item);
        }
        else {
            ret.err = "找不到数据";
        }
        return ret;
    },

    loadRandom: function () {
        if (this.totalSnippets <= 0) {
            return {
                err: "找不到数据",
                data: ""
            }
        }
        const idx = Math.round(Math.random() * this.totalSnippets - 1);
        return this.loadSnippet(1001 + idx);
    },

    saveSnippet: function (title, lang, content) {
        const from = Blockchain.transaction.from;
        const item = new SnippetItem(from);
        this.totalSnippets += 1;
        const id = 1000 + this.totalSnippets;
        if (title === "") {
            title = "Untitled";
        }
        if (lang === "") {
            lang = "plain";
        }
        item.id = id;
        item.title = title;
        item.language = lang;
        item.content = content;
        this.latest = title;
        this.data.put(id, item);
        return id;
    },

    getTotal: function () {
        return this.totalSnippets;
    },

    getLatest: function () {
        if (this.totalSnippets <= 0){
            return null;
        }
        return {
            id: this.totalSnippets + 1000,
            title: this.latest
        };
    },
};