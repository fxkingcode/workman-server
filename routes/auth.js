const express = require('express');
const bcrypt = require('bcrypt');
const { User, Auth, Sequelize: { Op }  } = require('../models');
const util = require('../util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const router = express.Router();

require('dotenv').config(); //.env 설정

//이메일 중복확인
router.post('/email', async (req, res, next) => {
    try{
        const { email } = req.body;
        console.log('이메일 중복확인', email);
        //이메일 존재여부 파악
        const exuser = User.findOne({
            where: {email: email}
        })
        if(exuser!==null || exuser !== undefined) {
            //존재시 토큰 생성 후
            const token = crypto.randomBytes(2).toString('hex'); // token 생성
            const data = { // 데이터 정리
                token,
                email: email,
                type: 1
            };
            Auth.create(data); // 데이터베이스 Auth 테이블에 데이터 입력

            //메일로 토큰 보내기
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 456,
                secure: true,
                auth: {
                    user: process.env.gmail_user,
                    pass: process.env.gmail_pass
                }
            });
            const emailOptions = { // 옵션값 설정
                from: 'test@gmail.com',
                to: email,
                subject: `[Workman]] 회원가입을 위한 안내메일 입니다. `,
                html: '회원가입을 위해 토큰을 입력하여 주세요.'
                + `<br>token 정보 : ${token}`+ `<br>유효시간 10분`,
            };
            transporter.sendMail(emailOptions, res); //전송

            // 토큰 생성 성공 메세지 리턴
            console.log('info', `${token}`);
            return res.status(200).send(token);
        } else {
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '존재하는 이메일 입니다.';
            console.log('info');
            return res.status(200).send(result);
        }

    }catch(e){
        console.error(e);
        return next(e);
    }
})



//회원가입
/* Sign Up API
 * - parameter email
 * - parameter nickname
 * - parameter password
 */
router.post('/join', async (req, res, next) => {
    try{
        const { email, password, name, phone_number, token } = req.body;
        console.log('회원가입 요청',  email, password, name, phone_number, token );


        await Auth.findOne({
            where: {
                token,
                createdAt: {
                    [Op.gt]: new Date() - 600000
                },
            }
        }).then(async exauth => {
            let authemail = exauth.email;
            await console.log('여기다여기',authemail)

            await Auth.destroy({where: {token: exauth.token}}).then().catch()

            const uid = await bcrypt.hash(email, 12);
            const pw = await bcrypt.hash(password, 12);
            const newUser = await User.create({
                user_uid: uid,
                email,
                name,
                password: pw,
                phone_number,
                rank : 0,
                group: null
            })
        
            // let text = {password,pw}
            console.log('newUser',newUser);
            res.status(201).json(newUser);

        }).catch(async e => {
            console.error(e);
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '유효한 토큰이 아닙니다.';
            console.log('info', `[AUTH] ${result.message}`);
            return res.status(200).send(result);
        })

    } catch(e){
        console.error(e);
        return next(e);
    }
});

//로그인
router.post('/login', async (req, res, next) => {
    try{
        const { email, password } = req.body;

        let isValid = true;
        let validationError = {
            name:'ValidationError',
            errors:{}
        };
        if(!email){
            console.log('email 탐');
            isValid = false;
            validationError.errors.email = {"message":'email is required!'};
        }
        if(!password){
            console.log('password 탐');
            isValid = false;
            validationError.errors.password = {"message":'Password is required!'};
        }

        if(!isValid) return res.status(201).json(util.successFalse(validationError));
        else next();

    } catch(e){
        console.error(e);
        return next(e);
    }
}, async (req, res, next) => {
    try{
        const { email, password } = req.body;
        const exUser = await User.findOne({where: { email:email } })
        console.log('exUser', exUser.email)
        let pass = false;
        if(exUser) {pass = await bcrypt.compare(password, exUser.password);}
        if(pass){
            let payload = { 
                user_uid : exUser.user_uid
            };
            const secretOrPrivateKey = process.env.JWT_SECRET;
            let resToken = {
                accessToken:'',
                refreshToken:'',
            };
            let refreshOptions = {expiresIn: 60*60*24*14};
            let accessOptions = {expiresIn: 60*60};
            await jwt.sign(payload, secretOrPrivateKey, refreshOptions, (err, token) => {
                if(err) return res.json(util.successFalse(err));
                resToken.refreshToken = util.successTrue(token);
                console.log('refresh 생성')

                jwt.sign(payload, secretOrPrivateKey, accessOptions, (err, token) => {
                    if(err) return res.json(util.successFalse(err));
                    resToken.accessToken = util.successTrue(token);
                    res.setHeader('x-access-token', token);
                    res.cookie('x-access-token', token);
                    console.log('access 생성');
                    res.status(201).json(resToken);
                });
            });
        }else{
            return res.status(201).json(util.successFalse(null, '이메일과 비밀번호를 확인해주세요'))
        }
    } catch(e){
        console.error(e);
        return next(e);
    }
});

//유저정보 반환
router.get('/me', util.isLoggedin, async (req,res,next) => {
    try{
        console.log('me탐', req.decoded.user_uid)
        const user = await User.findOne({where: {user_uid: req.decoded.user_uid}})
        if (user) {
            res.json(util.successTrue(user)), console.log('me성공');
        } else{
            return res.status(200).json(util.successFalse(null, '유저정보가 없습니다')), console.error('me에러')
        }
    } catch(e){
        console.error(e);
        return next(e);
    }
  }
);

// refresh
router.get('/refresh', util.isRefresh, async (req,res,next) => {
    try{
        console.log('refresh탐')
        const user = await User.findOne({where: {user_uid: req.decoded.user_uid}})
        if(user) {
            let payload = {
                user_uid: user.user_uid
            };
            const secretOrPrivateKey = process.env.JWT_SECRET;
            const options = {expiresIn: 60*60};
            jwt.sign(payload, secretOrPrivateKey, options,  (err, token) => {
                if(err) return res.json(util.successFalse(err));
                else res.json(util.successTrue(token));
            });
        }else{
            return res.status(200).json(util.successFalse(null,'유저정보가 없습니다'));
        }
    }catch(e){
        console.error(e);
        return next(e);
    }
  }
);

module.exports = router;
