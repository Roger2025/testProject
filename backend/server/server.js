const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ 後端運行於 http://localhost:${PORT}`);
});