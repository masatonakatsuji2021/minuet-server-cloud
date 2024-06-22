"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    "/": "controller=home, action=index",
    "/adm": {
        "/": "controller=main, action=index",
        "/login": "controller=main, action=login",
    },
    "/cloud_a/*": "container=a",
};
