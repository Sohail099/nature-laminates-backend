module.exports.formatString = (input) => {
    // console.log("se the @@@@@@@@@@@@@@@@@@@@@", input);
    let lowerCaseString = input.toLowerCase();
    let sentences = lowerCaseString.split('.');
    let formattedSentences = sentences.map(sentence => {
        let trimmedSentence = sentence.trim();
        let words = trimmedSentence.split(' ').map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
        return words.join(' ');
    });

    let result = formattedSentences.join('. ');
    return result.trim().replace(/\.\s*$/, '');
}
