export default {
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
            "/edit2/{id1}/{?id2}": "controller=admAccount, action=edit2",
        },
        // admin container
        "/container": {
            "/": "controller=admContainer, action=index",
        },
    },
};