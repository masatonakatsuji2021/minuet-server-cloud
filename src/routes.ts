export default {
    "/" : "controller=home, action=index",
    "/adm": {
        "/" : "controller=main, action=index",
        "/login": "controller=main, action=login",
    },
    "/cloud_a/*": "container=a",
};