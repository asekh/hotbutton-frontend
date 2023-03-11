import ReactWordcloud from 'react-wordcloud';

const WordCloud = ({ words }) => {
  const options = {
    fontFamily: 'Helvetica',
    fontSizes: [20, 100],
    fontWeight: 'normal',
    rotations: 0,
    scale: 'log',
    rotationsAngles: [0, 0],
    spiral: 'rectangular',
    transitionDuration: 1000,
  };

  const callbacks = {
    onWordClick: console.log,
    onWordMouseOver: console.log,
    getWordTooltip: (word) => `${word.text} (${word.value})`,
  };
  console.log(words);
  const wordsArray = words.map(([text, value]) => ({ text, value }));
  console.log(wordsArray);
  return (
    <div style={{ width: '80%', height: '400px' }}>
      <ReactWordcloud options={options} callbacks={callbacks} words={wordsArray} />
    </div>
  );
};

export default WordCloud;
