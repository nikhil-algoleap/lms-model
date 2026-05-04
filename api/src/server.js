const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`🚀 ALGOLEAP LMS API RUNNING ON PORT ${PORT}`);
  console.log(`===========================================`);
});
