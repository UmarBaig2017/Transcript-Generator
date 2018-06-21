var inp;
document.body.onload = function(){
    document.getElementById('icon').innerHTML = ' <i class="fa fa-plus" id="add" aria-hidden="true"></i>'
    document.getElementById('sn').focus();
    var inputs = document.getElementsByClassName('subject');
    var count = 0;
    for(var cpt = 0; cpt < inputs.length; cpt++)
    if (inputs[cpt].type == 'text') count++;
    //alert(count);
    inp=count;
    document.getElementById('add').addEventListener('click',addSubject)
    document.getElementById('submit').addEventListener('click',calc);
    var sem;
    document.getElementById('sem').addEventListener('change',function(){
        var e = document.getElementById("sem");
        var strUser = e.options[e.selectedIndex].value;
        sem = strUser;
    })
    var dep;
    document.getElementById('dep').addEventListener('change',function(){
        var e = document.getElementById("dep");
        var strUser = e.options[e.selectedIndex].value;
        dep = strUser;
    })
    var firebaseRef = firebase.database().ref('admin')
    firebaseRef.once('value',function(snap){
        var saved = snap.val();
        Object.keys(saved).forEach(function(key) {
            addToSideBar(saved[key].email);
        }); 
    })
    var fileButton = document.getElementById('filebutton');
    fileButton.addEventListener('change',uploadImage)
}

function addSubject(){
++inp;
document.getElementById('icon').remove();
var label = '<label>Subject '+inp+': </label>';
var subinput ='<input type="text" placeholder="Subject Name" class="textBox subject">&nbsp&nbsp' 
var markinput = '<input type="text" id="Mark'+inp+'"placeholder="Marks" class="textBox"><span id="icon"><i class="fa fa-plus" id="add" aria-hidden="true"></i></span></br>'
var hit = document.getElementById('additional')
hit.innerHTML+=label+subinput+markinput;
document.getElementById('add').addEventListener('click',addSubject)
var foc = inp-1;
document.getElementsByClassName('subject')[foc].focus();
}
function calc(){
    var subjects=[],marks=[];
    var obtained=0,tot=0;
    for(var i=0;i<inp;i++){
        subjects[i] = document.getElementsByClassName('subject')[i].value; 
    }
    for(var i=1;i<=inp;i++)
    {
        var mark = document.getElementById('Mark'+i).value;
        obtained+=parseInt(mark);
        tot+=100;
        marks.push(parseInt(mark));
    }
    var percentage = (obtained/tot)*100;
    var sName = document.getElementById('sn').value;
    var fName = document.getElementById('fn').value;
    var rn = document.getElementById('rn').value;
    var email = document.getElementById('em').value;

    var data = {};

    data.studentName = sName;
    data.fName = fName;
    data.id = rn;
    data.email = email;
    data.semester = sem.value;
    data.department = dep.value;
    data.marks = marks;
    data.subjects = subjects;
    data.obtained = obtained;
    addtoFirebase(data);
}
function addtoFirebase(data){
 //   localStorage.setItem(email,JSON.stringify(data));
      var referenceMail = data.email.replace('.com','')
     var firebaseRef = firebase.database().ref(referenceMail);
     firebaseRef.set(data);
     createUser(data.email,referenceMail);
     addToSideBar(data.email)
}
function addToSideBar(email){
    var element = '<a href="#">'+email+'</a> <i class="fa fa-trash remove" aria-hidden="true"></i>';
    var list = '<li>'+element+'</li>';
    document.getElementById('saved').innerHTML+=list;

    var countAnchor = document.getElementsByTagName('a');
    for(var i=0;i<countAnchor.length;i++)
    {
 document.getElementsByTagName('a')[i].addEventListener('click',renderTranscript)
 document.getElementsByClassName('remove')[i].addEventListener('click',removeNode)
    }
}
function removeNode(){
    var item = this.parentNode;
    item.remove();
    var link = item.firstChild;
    console.log(link.innerText);
    var reference = link.innerText.replace('.com','')
    var firebaseRef = firebase.database().ref(reference);
    var adminRef = firebase.database().ref('admin').child(reference);
    firebaseRef.remove();
    adminRef.remove();
}
function createUser(email,data){
    var password = data.replace('@','')
    var rand = Math.floor(Math.random()*100);
    password+=rand;
    savePassword(email,password);
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        // ...
      });
}
function savePassword(email,password){
    var login = {};
    login.email=email;
    login.password= password;
    email=email.replace('.com','')
    var firebaseRef = firebase.database().ref('admin').child(email);

    firebaseRef.set(login);
    alert(password);
}
function renderTranscript(){
    event.preventDefault(); 
    var item = this.parentNode;
    var val = item.innerText;
    console.log(val);
   var user = {}
   user.em = val.trim();
   user.password = val;
   localStorage.setItem('render',JSON.stringify(user));
   window.location = './transcript.html';

}
document.getElementById('logout').addEventListener('click',function(){
    firebase.auth().signOut().then(function() {
        window.location='./index.html'
      }).catch(function(error) {
        alert(error);
      });
})

function uploadImage(e){
    var file = e.target.files[0];
    //Create ref
    var email = document.getElementById('em').value;
    if(email){
        var storageRef = firebase.storage().ref('photos/' + email)
        //upload the file
        var task = storageRef.put(file);
    
        //change progress bar...
        task.on('state_changed',
            function progress(snapshot) {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            function error(err) {
                alert(err)
            },
            function complete() {
                alert("file upload complete!");
            })
        
    }
    else
    alert("Enter email address");
}