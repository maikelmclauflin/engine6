// use with express like this
// app.engine('html', engine6());
// app.set('views', 'views');
// app.set('view engine', 'html');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
module.exports = {
    renders: function () {
        return function (filePath, options, callback) {
            fs.readFile(filePath, function (err, content) {
                if (err) {
                    return callback(new Error(err));
                }
                var string = content.toString();
                var rep = options.replacements;
                var replaces = function (memo, value, key) {
                    return memo.replace(new RegExp(key, 'gm'), value);
                };
                var rel = path.relative(filePath, options.rootpath).slice(1);
                console.log(rel);
                return callback(null, _.reduce({
                    __ROOT_URL__: rel
                }, replaces, _.reduce(rep, replaces, string)));
            });
        };
    },
    static: function (rootpath, extension, opts) {
        var xtension = extension || '.html',
            options = _.isFunction(opts) ? opts : function () {
                return opts;
            };
        return function (req, res, next) {
            var extension = path.extname(req.url);
            if (extension !== xtension) {
                return next();
            }
            var fullpath = path.join(rootpath, req.url);
            fs.stat(fullpath, function (err, stats) {
                if (err) {
                    return next();
                }
                if (stats.isFile()) {
                    res.render(fullpath, {
                        rootpath: rootpath,
                        replacements: options()
                    });
                } else {
                    next();
                }
            });
        };
    }
};