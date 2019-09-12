$(document).ready(onReady);

function onReady() {
    getMusicData();
    $('#add').on('click', postMusicData);
}

// get artist data from the server
function getMusicData() {
    $("#musicTableBody").empty();
    $.ajax({
        type: 'GET',
        url: '/musicLibrary'
    }).then(function (response) {
        console.log("skjfhsd", response);
        // append data to the DOM
        for (let i = 0; i < response.length; i++) {
            $('#musicTableBody').append(`
                <tr data-id="${response[i].id}" >
                    <td>${response[i].artist}</td>
                    <td>${response[i].track}</td>
                    <td>${response[i].rank}</td>
                    <td>${response[i].published}</td>
                    <td><button class="deleteThis">Delete</button></td>
                    <td><button class="increase">+</button> <button class="increase">-</button></td>
                </tr>
            `);
        }
        $('.deleteThis').on('click', deleteBtn);
        $('.increase').on('click', updateRank);
    });
}

function updateRank() {
    let direction = $(this).text();
    let songID = $(this).parent().parent().data('id');
    console.log('update rank', direction);
    $.ajax({
        method: 'PUT', // PUTTING IS EDITING, POSTING IS INSERTING
        url: `/musicLibrary/rank/${songID}`, // make the url more specific for easier data change
        data: {
            direction: direction
        }
    }).then( function (response) {
        console.log(response);
        getMusicData();
    }).catch( function (error) {
        alert('error updating rank', error);
    })
}

function deleteBtn() {
    let songID = $(this).parent().parent().data('id');
    console.log('deleteBtn clicked', songID); // grab ID of the row/item;
    $.ajax({
        type: 'DELETE',
        url: `/musicLibrary/${songID}`
    }).then( function (response) {
        console.log(response);
        getMusicData();
    }).catch( function (error) {
        alert('Error in delete request ', error);
    })
}

function postMusicData() {
    let payloadObject = {
        artist: $('#artist').val(),
        track: $('#track').val(),
        rank: $('#rank').val(),
        published: $('#published').val()
    }
    $.ajax({
        type: 'POST',
        url: '/musicLibrary',
        data: payloadObject
    }).then( function (response) {
        $('#artist').val(''),
        $('#track').val(''),
        $('#rank').val(''),
        $('#published').val('')
        getMusicData();
    });
}

