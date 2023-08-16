const app = require('./app');

app.default.listen(app.default.get('port'), () => {
    console.log(app.default.get('port'), '번 포트에서 대기 중');
});