"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    "/": "controller=home, action=index",
    "/adm": {
        "/": "controller=main, action=index",
        "/{id}": "controller=main, action=detail",
        "/{id}/{id}": "controller=main, action=detail_a",
        "/login": "controller=main, action=login",
        "/logins/{?id}": "controller=main, action=login2",
        "/{code}/detail": "controller=adm3, action=detail",
    },
    "/special": "controller=aaa, action=index",
    "/cloud_a/*": "container=a",
};
