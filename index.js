$(document).ready(function () {
    init();
});

const getQueryParam = function (name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
};

const supportLang = {
    "PlainText": "",
    "Apache": "apache",
    "Bash": "bash",
    "C#": "cs",
    "C++": "cpp",
    "CSS": "css",
    "CoffeeScript": "coffescript",
    "Diff": "diff",
    "HTML": "xml",
    "XML": "xml",
    "HTTP": "http",
    "Ini": "ini",
    "JSON": "json",
    "Java": "java",
    "JavaScript": "javascript",
    "Makefile": "makefile",
    "Markdown": "markdown",
    "Nginx": "nginx",
    "Objective-C": "objectivec",
    "PHP": "php",
    "Perl": "perl",
    "Python": "python",
    "Ruby": "ruby",
    "SQL": "sql",
    "Shell Session": "shell",
};

const init = function () {
    console.log("Page Init...");
    $('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
    });

    callNeb("getTotal", "", function (resp) {
        console.log("Total:" + resp);
        $("#total").text(resp);
    });
    callNeb("getLatest", "", function (resp) {
        if (resp && resp !== "null") {
            console.log("Latest:" + resp);
            resp = JSON.parse(resp);
            $("#latest").text(resp.title);
            $("#latest").attr("href", "./index.html?id=" + resp.id);
        }
        else {
            console.log("Latest: None");
        }
    });
    $("#searchId").click(function () {
        $("#codeContent").hide();
        $("#notFound").hide();
        const id = $("#snippetIdInput").val();
        callNeb("loadSnippetWithId", "[" + id + "]", function (resp) {
            console.log(resp);
            if (!resp.startsWith("{")) {
                $("#notFound").show();
                return;
            }
            resp = JSON.parse(resp);
            if (resp.err !== "") {
                $("#notFound").show();
                return;
            }
            $("#codeContent").show();
            const data = JSON.parse(resp.data);
            setCodeContent(data);
        }, function (err) {
            alert(err);
        });
    });
    $("#searchTitle").click(function () {
        $("#codeContent").hide();
        $("#notFound").hide();
        const title = $("#snippetIdInput").val();
        callNeb("loadSnippetWithTitle", "[\"" + title + "\"]", function (resp) {
            console.log(resp);
            if (!resp.startsWith("{")) {
                $("#notFound").show();
                return;
            }
            resp = JSON.parse(resp);
            if (resp.err !== "") {
                $("#notFound").show();
                return;
            }
            $("#codeContent").show();
            const data = JSON.parse(resp.data);
            setCodeContent(data);
        }, function (err) {
            alert(err);
        });
    });
    $("#getRandom").click(function () {
        $("#codeContent").hide();
        $("#notFound").hide();
        callNeb("loadRandom", "", function (resp) {
            console.log(resp);
            if (!resp.startsWith("{")) {
                $("#notFound").show();
                return;
            }
            resp = JSON.parse(resp);
            if (resp.err !== "") {
                $("#notFound").show();
                return;
            }
            $("#codeContent").show();
            const data = JSON.parse(resp.data);
            setCodeContent(data);
        }, function (err) {
            alert(err);
        });
    });
    $("#codeUpload").click(function () {
        const args = [
            $("#codeTitle").val(),
            $("#codeLanguage").val(),
            $("#codeInput").val()
        ];
        callNebPay("saveSnippet", JSON.stringify(args), function (resp) {
            console.log(resp);
            alert("上传成功: " + resp);
        })
    });
    for (let i in supportLang) {
        $("#codeLanguage").append("<option value='" + supportLang[i] + "'>" + i + "</option>");
    }

    const queryId = getQueryParam("id");
    if (queryId) {
        console.log(queryId);
        callNeb("loadSnippetWithId", "[" + queryId + "]", function (resp) {
            console.log(resp);
            if (!resp.startsWith("{")) {
                $("#notFound").show();
                return;
            }
            resp = JSON.parse(resp);
            if (resp.err !== "") {
                $("#notFound").show();
                return;
            }
            $("#codeContent").show();
            const data = JSON.parse(resp.data);
            setCodeContent(data);
        });
    }
};

const setCodeContent = function (data) {
    $("#codeContentId").text(data.id);
    $("#codeContentTitle").text(data.title);
    $("#codeContentAuthor").text(data.author);
    $("#codeContentDate").text((new Date(data.createDate)).toLocaleString());
    $("#codeBlock").attr("class", data.language);
    $("#codeBlock").text(data.content);
    $('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
    });
};

const dappContactAddress = "n1eYktmwXg8nJzNpSg1VMnK2u7WveQpPqsT";
const nebulas = require("nebulas");
const neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));
const NebPay = require("nebpay");
const nebPay = new NebPay();

const callNeb = function (func, args, callback, errCallback) {
    neb.api.call(
        dappContactAddress,
        dappContactAddress,
        "0", "0", "100000", "200000",
        {
            "function": func,
            "args": args
        }).then(function (resp) {
        callback(resp.result);
    }).catch(errCallback);
};

const callNebPay = function (func, args, callback) {
    nebPay.call(dappContactAddress, "0", func, args, {
        listener: callback
    });
};