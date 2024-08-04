const uuid = require("uuid");

module.exports.generateUUID = () => 
{
    // console.log("{generateUUID() !!Called!!}");
	let str = uuid.v4();
	let asciiStr = "";
	let asciiStr2 = "";
	let j = 0;
	for (i = 0; i < str.length; i++) {
		if (str.charCodeAt(i) == '45') asciiStr = asciiStr + "";
		else asciiStr = asciiStr + str.charCodeAt(i);
	}
	for (j = 0; j < asciiStr.length; j++) {
		if (j % 7 == 0 && j != 0) {
			asciiStr2 = asciiStr2 + "-" + asciiStr[j - 1];
		}
		else {
			asciiStr2 = asciiStr2 + asciiStr[j];
		}
	}
	return asciiStr2;
}

module.exports.generateConflictHandlingId = ()=>
{
	let key= uuid.v4();
	return key;
}