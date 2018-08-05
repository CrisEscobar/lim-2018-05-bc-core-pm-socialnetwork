const buttonLogout = document.querySelector(".buttonLogout");
buttonLogout.addEventListener('click', () => {
    firebase.auth().signOut().then(function () {
        window.location = "home.html"
    })
        .catch(function (error) {

        });
})
window.onload = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) { //Si está logeado, mostraremos la opción loggedIn
            console.log('esta logueado')

            userName.innerHTML = `${user.displayName}`;
            userImage.innerHTML = ` <img src="${user.photoURL}" alt="user" class="profile-photo"/>`;
            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
            bd.classList.remove("hiden");
            posts.classList.remove("hiden");

        } else { //Si NO está logeado, mostraremos la opción loggedOut
            console.log('no esta logueado');
            posts.classList.add('hiden');
            bd.classList.add('hiden');

        }
        console.log("User > " + JSON.stringify(user));
    });
};
// firebase.database().ref('messages')
// .limitToLast(1)
// .on('child_added', (newMessage)=>{
//     messageContainer.innerHTML += `

//         <p>${newMessage.val().text}</p>
//     `;

//     // <p>Nombre : ${newMessage.val().creatorName}</p>
// });
function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email,
        profile_picture: imageUrl
    });
}

const bd = document.getElementById('bd');
const btnSave = document.getElementById('btnSave');
const post = document.getElementById('post');
const posts = document.getElementById('posts');

function writeNewPost(uid, body) {
    var postData = {
        uid: uid,
        body: body
    };

    var newPostKey = firebase.database().ref().child('posts').push().key;
    var updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;
    firebase.database().ref().update(updates);
    return newPostKey;

};
btnSave.addEventListener('click', () => {
    const userId = firebase.auth().currentUser.uid;
    const newPost = writeNewPost(userId , post.value);
    var btnUpdate = document.createElement('input');
    btnUpdate.setAttribute('value' , 'Editar');
    btnUpdate.setAttribute('type' , 'button');
    var btnDelete = document.createElement('input');
    btnDelete.setAttribute('value' , 'delete' ) ;
    btnDelete.setAttribute('type' , 'button');
    var btnLike = document.createElement('input');  //like
    btnLike.setAttribute('value' , 'like' ) ;       //like
    btnLike.setAttribute('type' , 'button');        //like
    btnLike.setAttribute('id' , 'likes');           //like
    var contPost = document.createElement('div');
    var textPost = document.createElement('textarea');
    textPost.setAttribute('id' , newPost);
    textPost.innerHTML = post.value;

    btnDelete.addEventListener('click',()=>{
   firebase.database().ref().child('/user-posts/' + userId +'/'+ newPost).remove();
   firebase.database().ref().child('/posts/' + newPost).remove();
   while(posts.firstChild) posts.removeChild(posts.firstChild);
//    alert('hola');
   reload_page();
    })


    btnLike.addEventListener('click',()=>{
        //alert("hola");
        var contador = 0;    
        contador = contador + 1;
        var btnLikeCount = document.getElementById("likes");
        btnLikeCount.value = "like (" + contador + ")";
        
         })

    
  btnUpdate.addEventListener('click', () =>{
    const newUpdate = document.getElementById(newPost);
    const nuevoPost = {
        body : newUpdate.value,
    };
    var updateUser = {};
    var updatePost = {};
    updateUser['/user-posts/' + userId + '/' + newPost]= nuevoPost;
    updatePost['/posts/' + newPost] = nuevoPost;
    firebase.database().ref().update(updateUser);
    firebase.database().ref().update(updatePost);
} );
contPost.appendChild(textPost);
contPost.appendChild(btnUpdate);
contPost.appendChild(btnDelete);
contPost.appendChild(btnLike);       //like
posts.appendChild(contPost);
})
// const searchUser= getElementById("search-user")

// searchUser.addEventListener('keyup', () => {
//     let usersFilter = userName;
//     search = search.toLowerCase();
//     usersFilter = usersFilter.filter(user => user.name.toLowerCase().indexOf(search) >= 0)
//     return usersFilter;

// }
// )


function reload_page() {
    window.location.reload();
}

// function sendMessage(){
//     const currentUser = firebase.auth().currentUser;
//     const messageAreaText = messageArea.value;

//     //Para tener una nueva llave en la colección messages
//     const newMessageKey = firebase.database().ref().child('messages').push().key;

//     firebase.database().ref(`messages/${newMessageKey}`).set({
//         creator : currentUser.uid,
//         creatorName : currentUser.displayName,
//         text : messageAreaText
//     });
// }