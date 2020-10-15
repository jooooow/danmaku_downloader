let get_cid_btn = document.getElementById('get_cid_btn');
let cid_input = document.getElementById('cid_input');

var xhr = new XMLHttpRequest();

var script=document.createElement("script"); 
script.type="text/javascript"; 
script.src="jquery-3.1.1.min.js"; 
document.getElementsByTagName('head')[0].appendChild(script); 

chrome.storage.sync.get('color', function(data) {

});

var bv2 = "";

chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.sendMessage(tab.id, {greeting: "bvid"}, function(response) {
        console.log(response);
		bv2 = response;
    });
});

console.log("popup");
  
get_cid_btn.onclick = function(element) {
	SetInput("downloading..");
    let color = element.target.value;
    chrome.tabs.getSelected(null, function (tab) {
		url = tab.url;
		bv_start = url.indexOf("BV");
		if(bv_start != -1)
		{
			bv_end = url.indexOf("?");
			console.log("bv_end = " + bv_end);
			if(bv_end == -1)
				bv_end = url.length;
			bv = url.substring(bv_start, bv_end);
		}
		else
		{
			if(bv2 != "")
				bv = bv2;
		}
		console.log(bv);
		
		if(bv != "")
		{
			var get_aid_ulr = "https://api.feseliud.com/bili/ba.php?BV=" + bv;
			xhr.onreadystatechange = function()
			{
				if (xhr.readyState == 4 && xhr.status == 200)
				{
					var av = xhr.responseText
					if(av != "")
					{
						av = av.substring(1,av.length-1);
						GetCid(av);
					}
					else
					{
						SetInput("cannot get av");
					}
				}
			}
			xhr.open('GET',get_aid_ulr,true);
			xhr.send(null);
		}
		else
		{
			SetInput("cannot find bv");
		}
	});
};

function GetCid(aid)
{
	var get_cid_url = "https://www.bilibili.com/widget/getPageList?aid=" + aid;
	console.log(get_cid_url);
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState == 4 && xhr.status == 200)
		{
			var cid_html = xhr.responseText
			console.log(cid_html)
			if(cid_html != "")
			{
				var cid_json = JSON.parse(cid_html);
				//console.log(cid_json);
				var cid = cid_json[0].cid;
				GetDanmaku(cid);
			}
		}
	}
	xhr.open('GET',get_cid_url,true);
	xhr.send(null);
}

function SetInput(str)
{
	cid_input.value = str;
}

function GetDanmaku(cid)
{
	console.log("GetDanmaku");
	var get_danmaku_url = "https://comment.bilibili.com/" + cid + ".xml";
	//var get_danmaku_url = "https://www.bilibili.com/widget/getPageList?aid=" + cid;
	//window.open(get_danmaku_url);
	//window.location.href = get_danmaku_url;
	/*console.log(get_danmaku_url);
	xhr.onload = function(e){
		
	}
	xhr.open('GET',get_danmaku_url,true);
	xhr.send(null);*/
	console.log("get");
	/*$.get(get_danmaku_url,function(data){
		console.log(data);
		doSave(data,"text/xml","dmk.xml");
	});*/
	var filename = cid + ".xml";
	dld(get_danmaku_url, filename, "", 'GET');
	SetInput("");
}

function dld(url, fn, data, method) { // 获得url和data
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);//get请求，请求地址，是否异步
    xhr.responseType = "blob";    // 返回类型blob
    xhr.onload = function () {// 请求完成处理函数
        if (this.status === 200) {
            var blob = this.response;// 获取返回值
            if (navigator.msSaveBlob) // IE10 can't do a[download], only Blobs:
            {
                window.navigator.msSaveBlob(blob, fn);
                return;
            }

            if (window.URL) { // simple fast and modern way using Blob and URL:        
                var a = document.createElement('a');
                var oURL = window.URL.createObjectURL(blob);
                if ('download' in a) { //html5 A[download]             
                    a.href = oURL;
                    a.setAttribute("download", fn);
                    a.innerHTML = "downloading...";
                    document.body.appendChild(a);
                    setTimeout(function () {
                        a.click();
                        document.body.removeChild(a);
                        setTimeout(function () {
                            window.URL.revokeObjectURL(a.href);
                        }, 250);
                    }, 66);
                    return;
                }

                //do iframe dataURL download (old ch+FF):
                var f = document.createElement("iframe");
                document.body.appendChild(f);

                oURL = "data:" + oURL.replace(/^data:([\w\/\-\+]+)/, "application/octet-stream");

                f.src = oURL;
                setTimeout(function () {
                    document.body.removeChild(f);
                }, 333);

            }
        }
    };

    var form = new FormData();
    jQuery.each(data.split('&'), function () {
        var pair = this.split('=');
        form.append(pair[0], pair[1]);
    });

    // 发送ajax请求
    xhr.send(form);

};

function doSave(value, type, name) {
    var blob;
    if (typeof window.Blob == "function") {
        blob = new Blob([value], {type: type});
    } else {
        var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
        var bb = new BlobBuilder();
        bb.append(value);
        blob = bb.getBlob(type);
    }
    var URL = window.URL || window.webkitURL;
    var bloburl = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    if ('download' in anchor) {
        anchor.style.visibility = "hidden";
        anchor.href = bloburl;
        anchor.download = name;
        document.body.appendChild(anchor);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);
    } else if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, name);
    } else {
        location.href = bloburl;
    }
}
//https://www.bilibili.com/video/BV1c5411x75E?spm_id_from=333.851.b_7265706f7274466972737431.9