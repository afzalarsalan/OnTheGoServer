var page = new WebPage(),
system = require('system'),
address

if(system.args.length<2) {
console.log('You need an address');
phantom.exit();
}
else
{
console.log("It is working");
address = system.args[1];
console.log(address);
page.open(address,function(status){
/*if(status == "success"){
console.log(status);
}
});*/

page.evaluate(function(){
//window.onload = init();
console.log("Program entered");
document.getElementById('mce-EMAIL').value="mnav4692@gmail.com";
//$("#mce-EMAIL").val="karun.devanidhi@tamu.edu";
//console.log($("mce-EMAIL").val);
//document.getElementById("mce-FNAME").value="karun.devanidhi@tamu.edu";
//document.getElementById("mce-EMAIL").value="karun.devanidhi@tamu.edu";
document.getElementById('mc-embedded-subscribe').click();
});
setTimeout(function(){phantom.exit()},500);
});
}