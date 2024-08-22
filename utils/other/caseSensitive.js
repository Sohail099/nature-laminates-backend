module.exports.formatString = (input) => {
    return input.toLowerCase()
                .split('.')
                .map(sentence => sentence.trim())
                .filter(sentence => sentence.length > 0)
                .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1))
                .join('. ') + '.';
}
