const Router = require('express')
const router = new Router()

router.post('/registration')
router.post('/login')

router.get('/auth', (req, res)=>{res.json('all working!!!')})
// app.get('/', (req, res) =>{
//     res.status(200).json({message: 'working!!!'})
// })


module.exports = router