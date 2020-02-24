var express = require('express');
var router = express.Router();
const models = require('../models');

router.post('/addEmployee', (req, res) => {
  console.log("addEmployee" + JSON.stringify(req.body));

  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const position = req.body.position;
  const memo = req.body.memo;
  const isActive = req.body.isActive;
  const state = req.body.state;
  const group = req.body.group;

  models.Employee.create({name:name , email:email ,phone_number:phone ,position:position ,memo:memo ,is_active:isActive,state:state})
  .then(result => {
    models.Group.findByPk(group).then(g => {
      result.setGroups(g);

      res.json(result);
    });
  })
  .catch(err => {
     console.error(err);
  });
});
module.exports = router;
