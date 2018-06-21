document.body.onload = function(){
  document.getElementById('eml').focus();
}
document.getElementById('hit').addEventListener('click',function(e){
e.preventDefault();    
  var email = document.getElementById('eml').value;
    var password = document.getElementById('psw').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
    
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      }).then(function(){
        //after signing in...
        var user = firebase.auth().currentUser;
        
        user.updateProfile({
          displayName: "Fine User"
        }).then(function() {
          user = firebase.auth().currentUser;
          console.log(user.displayName);
        }).catch(function(error) {
          // An error happened.
        });
        
      });
     /* firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log("Signed in!");
        } else {
          console.log("Not Signed in!");
        }
      });*/
      
})