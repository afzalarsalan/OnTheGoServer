var page = new WebPage(),
system = require('system'),
address = '';

if(system.args.length<2) {
	console.log('You need an address');
	phantom.exit();
}else{
	console.log("It is working");
	address = system.args[1];
	console.log(address);
	page.open(address,function(status){
		page.evaluate(function(){
			console.log("Program entered");
			document.getElementById('mce-EMAIL').value="karun.chillz@gmail.com";
			document.getElementById('mc-embedded-subscribe').click();
		});
		setTimeout(function(){phantom.exit()},500);
	});
}