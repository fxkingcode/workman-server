var express = require('express');
var router = express.Router();
const models = require('../models');

router.post('/addGroup', (req, res) => { //그룹 생성
  console.log("addGroup" + JSON.stringify(req.body));

  const name = req.body.name;
  const marker = req.body.marker;
  const memo = req.body.memo;

  models.Group.create({
      name: name,
      marker: marker,
      memo: memo
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error(err);
    });
});

router.post('/detailGroup', (req, res) => { //그룹 자세히보기
  console.log("detailGroup" + JSON.stringify(req.body));

  const groupId = req.body.id;
  models.Group.findOne({
    include: [{
      model: models.Employee
    }],
    where: {
      groupId: groupId
    }
  }).then(g => {
    res.json(g)
  });
});

router.post('/modifyGroup', (req, res) => { //그룹 수정
  console.log("addGroup" + JSON.stringify(req.body));

  const name = req.body.name;
  const marker = req.body.marker;
  const memo = req.body.memo;

  models.Group.create({
      name: name,
      marker: marker,
      memo: memo
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error(err);
    });
});

router.post('/callGroups', (req, res) => { //그룹들 보기
  console.log("callGroups" + JSON.stringify(req.body));

  const name = req.body.name;
  const marker = req.body.marker;
  const memo = req.body.memo;

  models.Group.create({
      name: name,
      marker: marker,
      memo: memo
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error(err);
    });
});
module.exports = router;
