auto render relative paths for your static html or other files in a simple and lightweight package

```
app.engine('html', engine6());
app.set('views', 'views');
app.set('view engine', 'html');
...
app.get('/somepath', function (req, res) {
    res.render('/somepath', {
        replacements: req.params
    });
});
```