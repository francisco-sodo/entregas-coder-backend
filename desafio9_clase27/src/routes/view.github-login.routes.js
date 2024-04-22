import {Router} from 'express';
const router = Router()


router.get('/login', (req,res) =>{
    res.render('github-login',{
        title: "GitHub Login" ,
        styleGithubLogin: "StyleGithubLogin.css",
    })
})

router.get('/error', (req,res) =>{
    res.render('error', {error: "No se pudo autenticar usando Github"})
})


export default router