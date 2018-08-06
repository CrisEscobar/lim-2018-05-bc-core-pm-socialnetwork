const buttonLogout = document.querySelector("#out");
const userPostProfile = document.getElementById('userPostProfile');
const allPostsWall = document.getElementById('allPostsWall');
const buttonProfile = document.getElementById('profile');
const buttonWall = document.getElementById('home');
const profileInformation = document.getElementById('profileInformation');
const buttonPublishApost = document.getElementById('publishApost');
const postContent = document.getElementById('postContent');
const selectPublicPrivate = document.getElementById('selectPublicPrivate');
const perfilNoticias = document.getElementById('noticias');
// const bd = document.getElementById('bd');

function menuOptions() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

window.onload = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            userName.innerHTML = `${user.displayName}`;
            userImage.innerHTML = ` <img src="${user.photoURL}" alt="user" class="profile-photo" />`;
            if (userName.innerHTML == 'null') {
                userName.innerHTML = `${user.email}`;
                userImage.innerHTML = `<img src="https://cdn.icon-icons.com/icons2/1540/PNG/128/cinterior150_107120.png" alt="user" class="profile-photo" />`;                ;
            }
            writeUserDataFirebase(user.uid, user.displayName, user.email, user.photoURL);
            //  writeNewPost(user.uid ,user.displayName , user.photoURL , post.value);

            callFirebaseAllPosts(user.uid)
        }
        else {
            console.log('no esta logueado');
        }
        console.log("User > " + JSON.stringify(user));
    });
}
const writeUserDataFirebase = (userId, name, email, imageUrl) => {
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email,
        profile_picture: imageUrl
    });
}
buttonProfile.addEventListener('click', () => {
    allPostsWall.style.display = 'none';
    userPostProfile.style.display = 'block';
    profileInformation.style.display = 'block';
    perfilNoticias.setAttribute("class" , "newsProfile");
    titlePublicaciones.style.display = 'block';
    
})
buttonWall.addEventListener('click', () => {
    allPostsWall.style.display = 'block';
    userPostProfile.style.display = 'none';
    profileInformation.style.display = 'none';
    perfilNoticias.setAttribute("class" , "newsWall");
    titlePublicaciones.style.display = 'none';
})
buttonLogout.addEventListener('click', () => {
    firebase.auth().signOut().then(function () {
        window.location = "home.html"
    })
        .catch(function (error) { });
})
buttonPublishApost.addEventListener('click', () => {
    const postMuro = postContent.value;
    const space = postMuro.trim()
    const select = selectPublicPrivate.value;
    if (postMuro.length !== 0 && space !== '') {
        if (select == 'publico') {
            writeNewPostFirebase();
        }
        else if (select == 'privado') {
            writePrivateUserPosts();
        }

        else {
            writeNewPostFirebase();
        }
    }
})



const writeNewPostFirebase = () => {
    const currentUser = firebase.auth().currentUser;
    const messageAreaText = postContent.value;
    const newPostKey = firebase.database().ref().child('posts').push().key;
    const postData = {
        image: currentUser.photoURL,
        author: currentUser.displayName,
        uid: currentUser.uid,
        body: messageAreaText,
        key: newPostKey,
        likeCount: 0,
        email: currentUser.email
    };
    const updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + currentUser.uid + '/' + newPostKey] = postData;
    return firebase.database().ref().update(updates);

}

const writePrivateUserPosts = () => {
    const currentUser = firebase.auth().currentUser;
    const messageAreaText = postContent.value;
    const newPostKey = firebase.database().ref().child('posts').push().key;
    const postData = {
        image: currentUser.photoURL,
        author: currentUser.displayName,
        uid: currentUser.uid,
        body: messageAreaText,
        key: newPostKey,
        likeCount: 0,
        email: currentUser.email

    };
    const updates = {};
    updates['/user-posts/' + currentUser.uid + '/' + newPostKey] = postData;
    return firebase.database().ref().update(updates);
}

const callFirebaseAllPosts = (uid) => {
    const userPost = firebase.database().ref('user-posts').child(uid);
    userPost.on("child_added", newPostsUser => {
        showPostsUserProfile(newPostsUser);
    });
    const everybodyPost = firebase.database().ref('posts');
    everybodyPost.on("child_added", newPosts => {
        showallPostsWall(newPosts);

    });

}
const showallPostsWall = (newPosts) => {

    const postskey = newPosts.key
    const contPost = document.createElement('div');
    contPost.setAttribute('class', "w3-container w3-card w3-white w3-round w3-margin")

    const image = document.createElement('img');
    image.setAttribute('class', "w3-left w3-circle w3-margin-top")
    image.setAttribute('style', "width:60px")
    image.setAttribute('alt', "Avatar")

    const espacaio = document.createElement('hr');
    espacaio.setAttribute('class', "w3-clear")

    const author = document.createElement('h4');
    author.setAttribute('style',"margin-top: 22px,");
    author.setAttribute('class',"author");
  

const salto1= document.createElement('br');
    salto1.setAttribute('class', "w3-clear");

    const textPost = document.createElement('p');
    textPost.setAttribute('class', 'textPostWall');
    textPost.setAttribute('id', postskey);
    textPost.innerHTML = `${newPosts.val().body}`;

/* <button id="${newPostsUser.val().key}" type="button" class="w3-button w3-theme-d1 w3-margin-bottom "><i class="fa fa-thumbs-up"></i> EcoLike</button>  */
    // const br = document.createElement('br');
    const btnLike = document.createElement('input');
    btnLike.setAttribute('value', 'Like ♥');
    btnLike.setAttribute('type', 'button')
    btnLike.setAttribute('id', postskey);
    // btnLike.setAttribute('style', "background-color: orange;");
    btnLike.setAttribute('class' , "w3-pink w3-button w3-margin-bottom ");
    // btnLike.setAttribute('style','margin: 2px')
    // const icolike = document.createElement('i');
    
    // icolike.setAttribute('class', 'fas fa-thumbs-up');
    const contadorlike = document.createElement('a');
    contadorlike.setAttribute('class','w3-pink w3-button w3-margin-bottom ')
   contadorlike.setAttribute('id' , postskey);
   contadorlike.innerHTML=`${newPosts.val().likeCount}`;
   var clicks = 0;  
   btnLike.addEventListener('click', () => {
        clicks += 1;
    contadorlike.innerHTML = clicks;

    const newUpdate = textPost.innerText
    const newPostvalue = newUpdate
    const nuevoPost = {
        body: newPostvalue,
        image:`${newPosts.val().image}`,
        author:`${newPosts.val().author}`,
        uid:`${newPosts.val().uid}`,
        key: postskey,
        likeCount:clicks,
    };
    const updatesUser = {};
    const updatesPost = {};

    updatesPost[`/posts/${newPosts.key}`] = nuevoPost;
    firebase.database().ref().update(updatesUser);
    firebase.database().ref().update(updatesPost);

   })

    
    allPostsWall.appendChild(contPost);
    contPost.appendChild(image);
    contPost.appendChild(author);
    contPost.appendChild(salto1);
    contPost.appendChild(espacaio);
    contPost.appendChild(textPost);
    // contPost.appendChild(br);
    contPost.appendChild(espacaio);
    contPost.appendChild(contadorlike);
    contPost.appendChild(btnLike);
    // btnLike.appendChild(icolike);
    if(`${newPosts.val().author}` == 'undefined' ){
        author.innerHTML =  `${newPosts.val().email}`
        image.setAttribute('src', 'https://cdn.icon-icons.com/icons2/1540/PNG/128/cinterior150_107120.png')
    }
    else{
        author.innerHTML = `${newPosts.val().author}`
           image.setAttribute('src', `${newPosts.val().image}`)
    }

}
const showPostsUserProfile = (newPostsUser) => {
    const postskey = newPostsUser.key

    const contPost = document.createElement('div');
    contPost.setAttribute('class', "w3-container w3-card w3-white w3-round w3-margin")

    const image = document.createElement('img');
    image.setAttribute('class', "w3-left w3-circle w3-margin-top")
    image.setAttribute('style', "width:60px")
    image.setAttribute('alt', "Avatar")

    const espacaio = document.createElement('hr');
    espacaio.setAttribute('class', "w3-clear")

    const author = document.createElement('h4');
    author.setAttribute('class',"author");
    author.setAttribute('style',"margin-top: 22px");
    // author.setAttribute('class',  )
    const salto1= document.createElement('br');
    salto1.setAttribute('class', "w3-clear");

    const textPost = document.createElement('p');
    textPost.setAttribute('class', "textPostProfile");
    
    textPost.setAttribute('id', postskey);
    textPost.innerHTML = `${newPostsUser.val().body}`;
    // const salto = document.createElement('br');
    // salto.setAttribute('class', "w3-clear");  
    
    const btnEdit = document.createElement('button');
    btnEdit.setAttribute('value', 'Editar');
    btnEdit.setAttribute('title', 'Editar');
    btnEdit.setAttribute('id', postskey);
    btnEdit.setAttribute('class', "w3-blue w3-button w3-margin-bottom")
    btnEdit.setAttribute('style','margin: 10px')
    const icoEdit= document.createElement('i');
    icoEdit.setAttribute('class','fas fa-pen');

    const btnDelete = document.createElement('button');
    btnDelete.setAttribute('value', 'Borrar');
    btnDelete.setAttribute('title', 'Eliminar');
    btnDelete.setAttribute('id', postskey);
    btnDelete.setAttribute('class', "w3-pink w3-button w3-margin-bottom");
    btnDelete.setAttribute('style','margin: 10px');
    const icoDelete= document.createElement('i');
    icoDelete.setAttribute('class','fas fa-trash');
    

    btnDelete.addEventListener('click', (evt) => {
        if (newPostsUser.key === evt.target.id) {
            const question = confirm('Esta seguro que desea eliminar esta publicacion?')
            if (question === true) {
                firebase.database().ref().child(`/posts/${newPostsUser.key}`).remove();
                firebase.database().ref().child(`/user-posts/${newPostsUser.val().uid}/${newPostsUser.key}`).remove();
                contPost.remove();
                // textPost.remove();
                // btnEdit.remove();
                // btnDelete.remove();
                // btnLike.remove();
            }
        }

    })

    btnEdit.addEventListener('click', (evt) => {
        textPost.contentEditable = "true";
        btnEdit.style.display = 'none';
        const btnpublish = document.createElement('input');
        btnpublish.setAttribute('value', 'Publicar');
        btnpublish.setAttribute('type', 'button');
        btnpublish.setAttribute('class',"w3-pink w3-button w3-margin-bottom");
        btnpublish.setAttribute('id', postskey);
        btnpublish.setAttribute('style','margin: 10px');
        btnpublish.addEventListener('click', (evt) => {
               if (postskey === evt.target.id) {
                const currentUser = firebase.auth().currentUser;
                const newUpdate = textPost.innerText
                const newPostvalue = newUpdate
                const nuevoPost = {
                    body: newPostvalue,
                    image: currentUser.photoURL,
                    author: currentUser.displayName,
                    uid: currentUser.uid,
                    key: postskey,
                    likeCount: 0,
                };
                const updatesUser = {};
                const updatesPost = {};
                updatesUser[`/user-posts/${newPostsUser.val().uid}/${newPostsUser.key}`] = nuevoPost;
                updatesPost[`/posts/${newPostsUser.key}`] = nuevoPost;
                firebase.database().ref().update(updatesUser);
                firebase.database().ref().update(updatesPost);
            }
            btnpublish.style.display = 'none';
            btnEdit.style.display = 'block';
            textPost.contentEditable = "false";
            
        })
        contPost.appendChild(btnpublish);
        
        
    });

    userPostProfile.appendChild(contPost);
    contPost.appendChild(image);
    contPost.appendChild(author);
    contPost.appendChild(salto1);
    contPost.appendChild(espacaio);
    contPost.appendChild(textPost);
    // contPost.appendChild(salto);
    contPost.appendChild(espacaio);
    contPost.appendChild(btnEdit);
    btnEdit.appendChild(icoEdit);
    contPost.appendChild(btnDelete);
    btnDelete.appendChild(icoDelete);
    if(`${newPostsUser.val().author}` == 'undefined' ){
        author.innerHTML =  `${newPostsUser.val().email}`
        image.setAttribute('src', 'https://cdn.icon-icons.com/icons2/1540/PNG/128/cinterior150_107120.png')
    }
    else{
        author.innerHTML = `${newPostsUser.val().author}`
           image.setAttribute('src', `${newPostsUser.val().image}`)
    }

}
