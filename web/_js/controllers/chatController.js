var timerId4EmojiScale = -1;

$("#txtMessage").keydown(function (event) {
    if (!event.shiftKey && event.keyCode === 13) {
        event.preventDefault();
    }
    if ($("#txtMessage").html().trim() === ""){
        sendTypingSignal("upul",false);
    }else{
        sendTypingSignal("upul",true);
    }
});

function sendTypingSignal(user,isTyping){
    $.ajax("/PublicChat/TypingDetector",{
        contentType:"application/x-www-form-urlencoded",
        dataType:"json",
        method:"POST",
        data:{
            user:user,
            isTyping:isTyping
        }
    });
}

setInterval(function(){
    $.ajax("/PublicChat/TypingDetector",{
        contentType:"text/html",
        dataType:"json",
        method:"GET"
    }).done(function(json){
        console.log("Came : " + json);
    });    
},1000);

$("#spn-emoji").click(function () {
    $("#div-emoji-container").css("display", "initial");
    var top = $("#frmClient").offset().top - $("#div-emoji-container").height() - 15;
    var left = $("#spn-emoji").offset().left + 4;
    $("#div-emoji-container").css("top", top + "px");
    $("#div-emoji-container").css("left", left + "px");
});

$(window).resize(function () {
    $("#div-emoji-container").css("display", "none");
    $("#div-camera-container").css("display", "none");
});

$(".emoji").mousedown(function (e) {
    var bImage;
    if ($(e.target).is(".emoji")){
        bImage = $(e.target).children("i").css('background-image');
    }else{
        bImage = $(e.target).css('background-image');
    }
    bImage = (bImage.substring(5, bImage.length - 2));
    if ($("#txtMessage *").last().is("br")){
        $("#txtMessage *").last().remove();
    }
    $("#txtMessage").append('<img src="' + bImage + '" height="18">');
    timerId4EmojiScale = setInterval(function () {
        var height = $("#txtMessage img:last-child").height();
        height += 5;
        if (height > 44) {
            clearInterval(timerId4EmojiScale);
        } else {
            $("#txtMessage img:last-child").css("height", height + "px");
        }   
    }, 50);


});

$(".emoji").mouseup(function (e) {
    clearInterval(timerId4EmojiScale);
});

$("#div-camera").click(function(event){
    $("#file-uploading-loader").css("visibility","hidden");
    $("#div-camera-container").css("display", "initial");
    $("#div-camera-container").css("visibility", "hidden");      
    var top = $("#frmClient").offset().top - $("#div-camera-container").height() - 15;
    var left = $("#spn-emoji").offset().left + 4;
    $("#div-camera-container").css("top", top + "px");
    $("#div-camera-container").css("left", left + "px");
//   
    
    
    // Grab elements, create settings, etc.
    var video = document.getElementById('video');

    // Get access to the camera!
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
        });
    }  
    
    $("#div-camera-container").css("visibility", "visible");
    
});

$(document).click(function (e) {
    if (!$(e.target).is("#spn-emoji,#spn-emoji *") && !$(e.target).is("#div-emoji-container,#div-emoji-container *")) {
        $("#div-emoji-container").css("display", "none");
    }
    if (!$(e.target).is("#div-camera,#div-camera *") && !$(e.target).is("#div-camera-container,#div-camera-container *")) {
        $("#div-camera-container").css("display", "none");
    }    
});

$("#btnSnap").click(function(){
    $("#file-uploading-loader").css("visibility","visible");
    var canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');
    context.drawImage(document.getElementById("video"), 0, 0, $("#video").width(), $("#video").height());
    var dataURL = canvas.toDataURL();  
    console.log(dataURL);
    $.ajax("/PublicChat/ImageUploader",{
        method:"POST",
        data:{
             imgBase64: dataURL
        }
    });
});





