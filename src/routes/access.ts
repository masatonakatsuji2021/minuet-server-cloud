export default {
    "/admin": {
        // admin top
        "/" : "controller=admin/main, action=index",
        // admin login
        "/login": "controller=admin/main, action=login",
        // admin logiout
        "/logout": "controller=admin/main, action=logout",
        // admin setting
        "/setting": "controller=admin/setting, action=index",
        // admin account
        "/account": {
            "/": "controller=admin/account, action=index",
            "/edit/{?id}": "controller=admin/account, action=edit",
            "/edit2/{id1}/{?id2}": "controller=admin/account, action=edit2",
        },
        // admin container
        "/container": {
            "/": "controller=admin/container, action=index",
        },
    },
};