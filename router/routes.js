const express = require('express')
const router = express.Router()
const userCollection = require('../db')

//Admin password and user id
const credential = {
    email: "clint@gmail.com",
    password: "1"
}
// Login Page
router.get('/', (req, res) => {
    if (req.session.adminLogin) {
        res.redirect('/adminView')
    } else {
        if (req.session.userlogged) {
            res.redirect('/homepage')
        } else {

            res.render('login', { title: "Login Page", err: false })
        }
    }
})

//user login to homepage

router.get('/', (req, res) => {
    if (req.session.userlogged) {
        res.redirect('/homepage')
    } else {
        res.render("login", { title: "Login System", err: false })
    }
})

router.post('/',(req,res)=>{
    if(req.body.name){
        console.log(req.body.name);
    }
})
//Admin login to admin view page

router.post('/adminlogin', (req, res) => {
    if (req.body.email == credential.email && req.body.password == credential.password) {
        req.session.admin = req.body.email;
        req.session.logged = true
        req.session.adminLogin = true
        res.redirect('/adminView')
    } else {
        res.render('admin', { title: "admin paage", err: "Invalid Username or Password" })
    }
})

//users login verification
router.post("/user-login", async (req, res) => {
    const { email, password } = req.body;
    const connects = await userCollection.findOne({ email: email, password: password });
    if (connects) {
        console.log("Login Successfull");
        req.session.user = req.body.email;
        req.session.userlogged = true;
        res.redirect('/homepage');
    } else {
        console.log("Invalid User Name or Password");
        res.render("login", { title: "Login Page", err: "Invalid User Name or Password" });
    }
})

//adding datas to the admin home page

router.get("/adminView", async (req, res) => {
    if (req.session.adminLogin) {
        var i = 0;
        const useData = await userCollection.find();

        res.render("adminView", { title: "user details", useData, i });
    } else {
        res.redirect("/adminlogin");
    }
});

//Admin logout ot login
router.get('/signout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin-log')
})

// loogin to Sign up page
router.get('/signup', (req, res) => {
    if (req.session.adminLogin) {
        res.redirect('/adminView')
    } else {
        if (req.session.userlogged) {
            res.redirect('/homepage')
        } else {
            res.render('signup', { title: "Sign Up page" })
        }
    }
})
// signup to Login page
router.get('/login-page', (req, res) => {
    if (req.session.adminLogin) {
        res.redirect('/adminView')
    } else {
        if (req.session.userlogged) {
            res.redirect('/homepage')
        } else {
            res.render('login', { title: "Login Page", err: false })
        }
    }
})
//login to Admin page
router.get('/admin-log', (req, res) => {
    if (req.session.adminLogin) {
        res.redirect('/adminView')
    } else {

        res.render('admin', { title: "Admin Page" })
    }
})
//admin view to add user
router.get('/addUser', (req, res) => {
    res.render('addusers', { title: "Add user" })
})

// router.post('/actionSignUp',(req,res)=>{
//     console.log(req.body);
// })

//user signup data to home page and data tranfer to DB
router.post('/actionSignUp', async (req, res) => {
    const { name, email, password } = req.body;
    const data = await userCollection.create(req.body)
    req.session.user = email;
    req.session.userlogged = true;
    res.redirect('/homepage')

})
// Define a route for /homepage
router.get('/homepage', (req, res) => {
    res.render("homepage", { title: "Homepage" });
});

//Home page to login page
router.get('/logout-home', (req, res) => {
    req.session.destroy();
    res.redirect('/')
})

//Add or insert user data
router.post("/addData", async (req, res) => {
    const { name, email, password } = req.body;

    const newuser = await userCollection.create(req.body);
    res.redirect("/adminView");
});

//Serch user details
router.post("/search", async (req, res) => {
    var i = 0;
    const data = req.body;
    console.log(data);
    let useData = await userCollection.find({
        name: { $regex: "^" + data.search, $options: "i" },
    });
    console.log(`Search Data ${useData} `);
    res.render("adminView", { title: "User details", user: req.session.user, useData, i });
});


//Edit to user data
router.get("/edit/:id", async (req, res) => {
    const id = req.params.id;
    const dataone = await userCollection.findOne({ _id: id });
    res.render('editpage', { title: "Edit page", dataone })
});

//Edit user detailes and to adminview page
router.post("/update/:id", async (req, res) => {
    let newData = req.body;
    let id = req.params.id
    await userCollection.updateOne(
        { _id: id },
        {
            $set: {
                name: newData.name,
                email: newData.email
            }
        }
    )
    res.redirect("/adminView");
})


//deletion
router.get("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const deleted = await userCollection.deleteOne({ _id: id })
    res.redirect("/adminView");
})




module.exports = router;