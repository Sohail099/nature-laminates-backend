module.exports.formatString = (input, addEndDot = true) => {

    input = input.toLowerCase().split('.').map(sentence => sentence.trim()).filter(sentence => sentence.length > 0).map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1)).join('. ');

    if (addEndDot) {
        input = input + ".";
    }
    return input;
}
