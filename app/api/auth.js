module.exports = function (req, res, next) {
    res.send(JSON.stringify({
        status: true
    }));
};
