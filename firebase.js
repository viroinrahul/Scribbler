var firebaseConfig = {
    apiKey: "AIzaSyDMMlDXa4La2Xbxzgdmg-KjUIp5TLCDiNQ",
    authDomain: "scribbler-26bbe.firebaseapp.com",
    databaseURL: "https://scribbler-26bbe-default-rtdb.firebaseio.com/",
    projectId: "scribbler-26bbe",
    storageBucket: "scribbler-26bbe.appspot.com",
    messagingSenderId: "262187834408",
    appId: "1:262187834408:web:318fede0282bfde6aca91d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log(firebase);


chrome.runtime.onMessage.addListener((msg, sender, response) => {

    if (msg.command == 'fetchNotes') {
        firebase.database().ref('/notes').once('value').then(function (snapshot) {
            response({ type: "result", status: "success", data: snapshot.val(), request: msg });
        });

    }

    if (msg.command == 'deleteNote') {

        //..
        var noteId = msg.data.id;
        if (noteId != '') {
            try {

                var deleteNote = firebase.database().ref('/notes/' + noteId).remove();
                response({ type: "result", status: "success", id: noteId, request: msg });

            } catch (e) {
                //
                console.log("error", e);
                response({ type: "result", status: "error", data: e, request: msg });
            }
        }

    }




    if (msg.command == 'postNote') {

        //..
        var title = msg.data.title;
        var body = msg.data.body;
        var icon = msg.data.icon;
        var noteId = msg.data.id;

        try {

            if (noteId != 'EMPTY-AUTOGEN--') {
                var newNote = firebase.database().ref('/notes/' + noteId).update({
                    title: title,
                    icon: icon,
                    body: body
                });
                response({ type: "result", status: "success", id: noteId, request: msg });
            } else {
                //..
                var newPostKey = firebase.database().ref().child('notes').push().key;
                var newNote = firebase.database().ref('/notes/' + newPostKey).set({
                    title: title,
                    icon: icon,
                    body: body
                });
                console.log('new note id', newPostKey);
                response({ type: "result", status: "success", id: newPostKey, request: msg });
            }

        } catch (e) {
            //...

            console.log("error", e);
            response({ type: "result", status: "error", data: e, request: msg });
        }

    }

    return true;


});
