document.getElementById('frm').addEventListener('submit',addtolocal)
document.getElementById('adlog').addEventListener('submit',function(){
    event.preventDefault();
    var email = document.getElementById('adem').value;
    var pw = document.getElementById('adpw').value;
    console.log(email,pw)
    firebase.auth().signInWithEmailAndPassword(email, pw).then(function(){
        window.location='./adminpage.html';
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          }
          else if(errorCode==='auth/user-not-found'){
              alert("Wrong email")
          }
          else
        console.log(errorMessage)
        // 
      });

})
function addtolocal(){
    event.preventDefault();
    var email = document.getElementById('em').value;
    var pw = document.getElementById('pw').value;
    var user = {}
    user.em = email;
    user.password = pw;
    localStorage.setItem('render',JSON.stringify(user));
    firebase.auth().signInWithEmailAndPassword(email, pw).then(function(){
        var renderMail = email.replace('.com','');
        window.location = './transcript.html';
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          }
          else if(errorCode==='auth/user-not-found'){
              alert("Wrong email")
          }
          else
        console.log(errorMessage)
        // ...
      });
}