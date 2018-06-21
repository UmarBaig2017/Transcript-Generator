document.body.onload = function () {
    var user = JSON.parse(localStorage.getItem("render"));
    //  var data = JSON.parse(localStorage.getItem(user.em))
    user.em = user.em.replace('.com', '');
    var leadsRef = firebase.database().ref(user.em);
    leadsRef.on('value', function (snapshot) {
        var data = snapshot.val();
        document.getElementById('sName').innerText = data.studentName;
        document.getElementById('fName').innerText = data.fName;
        document.getElementById('roll').innerText = data.id;
        document.getElementById('em').innerText = data.email;
        document.getElementById('sem').innerText = data.semester
        document.getElementById('dep').innerText = data.department
        addImage(data.email);
        var grades = [];
        var cgpa = 0.0;
        var passed = 0;
        document.getElementById('down').addEventListener('click', function () {
            document.getElementById('down').style.display = 'none';
            html2canvas(document.body, {
                useCORS:true,
                proxy:"https://onlinetranscript.000webhostapp.com/",
                letterRendering: 1,
               // allowTaint: true,
                logging:true,
                onrendered: function (canvas) {
                    canvas.id = 'screen';
                    document.body.innerHTML = ''
                    document.body.appendChild(canvas);
                }
            });
        })
        function calculateGrades(mark) {
            if (mark >= 50) {
                passed++;
                if (mark >= 85) {
                    grades.push('A');
                    cgpa += 4.00;
                }
                else if (mark >= 80 && mark <= 84) {
                    grades.push('A-');
                    cgpa += 3.66;
                }
                else if (mark >= 75 && mark <= 79) {
                    grades.push('B+');
                    cgpa += 3.33;
                }
                else if (mark >= 71 && mark <= 74) {
                    grades.push('B');
                    cgpa += 3.00;
                }
                else if (mark >= 68 && mark <= 70) {
                    grades.push('B-');
                    cgpa += 2.66;
                }
                else if (mark >= 64 && mark <= 67) {
                    grades.push('C+');
                    cgpa += 2.33;
                }
                else if (mark >= 61 && mark <= 63) {
                    grades.push('C');
                    cgpa += 2.00;
                }
                else if (mark >= 58 && mark <= 60) {
                    grades.push('C-');
                    cgpa += 1.66;
                }
                else if (mark >= 54 && mark <= 57) {
                    grades.push('D+');
                    cgpa += 1.33;
                }
                else if (mark >= 50 && mark <= 53) {
                    grades.push('D');
                    cgpa += 1.00;
                }

            }
            else {
                grades.push('F');
            }
        }
        var subjects = '';
        var total = 0;
        for (var i = 0; i < data.subjects.length; i++) //creating table from data...
        {
            calculateGrades(data.marks[i])
            var remarks;
            (grades[i] == 'F') ? remarks = "Failed" : remarks = "Passed"
            subjects += '<tr><td id="sub">' + data.subjects[i] + '</td><td id="obt">' + data.marks[i] + '</td><td>100</td><td id="grade">' + grades[i] + '</td><td id = "remarks">' + remarks + '</td></tr>'
            total += 100;
        }
        var GPA = cgpa / passed;
        var final = '<tr><td><b>Total Marks</b></td><td id="obtained">' + data.obtained + '</td><td id="max">' + data.subjects.length * 100 + '</td><td><b>CGPA</b></td><td id ="percentage">' + GPA.toFixed(4) + '</td></tr>';
        var hit = document.getElementById('marks');
        hit.innerHTML += subjects + final;
    });
    function addImage(email) {
        var storageRef = firebase.storage().ref('photos');
        storageRef.child(email).getDownloadURL().then(function (url) {
            // `url` is the download URL for 'images/stars.jpg'

            // This can be downloaded directly:
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function (event) {
                var blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();

            // Or inserted into an <img> element:
            var img = document.getElementById('pic');
            img.src = url;
            //img.crossOrigin = 'Anonymous';
        }).catch(function (error) {
            console.log(error);
        });
    }
}