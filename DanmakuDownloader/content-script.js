console.log("content");

chrome.extension.onMessage.addListener(
function(request, sender, sendMessage) {
	var avlink = document.getElementsByClassName("av-link");
	bv = avlink[0].innerText;
	if (request.greeting == "bvid")
		sendMessage(bv);
    else
        sendMessage("fail");
});