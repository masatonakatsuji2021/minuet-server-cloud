export default {
    "/" : "controller=main, action=index",
    "/admin": {
        // admin top
        "/" : "controller=admin, action=index",
        // admin login
        "/login": "controller=admin, action=login",
        // admin logiout
        "/logout": "controller=admin, action=logout",
        // admin setting
        "/setting": "controller=admSetting, action=index",
        // admin account
        "/account": {
            "/": "controller=admAccount, action=index",
            "/edit/{?id}": "controller=admAccount, action=edit",
        },
        // admin container
        "/container": {
            "/": "controller=admContainer, action=index",
        },
    },
};