import React, { useState } from 'react';
import './Test.css';

const Test = () =>{
  const [X, setX] = useState('');
  const [Y, setY] = useState('');
  const [showTable, setShowTable] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowTable(true);
  };
  const handleReset = () => {
    setX('');
    setY('');
    setShowTable(false);
  };

  // X = parseInt(prompt("被乘數 X:")) || 0;
  // Y = parseInt(prompt("乘數 Y:")) || 0;

  var innerString = "<table border='1'>";
  return (
  <div className="test-container">
    <h1>乘法表</h1>
    <div id="result">
      <form onSubmit={handleSubmit}>
        <label> 被乘數 X:
          <input type="number" value={X} onChange={(e) => setX(e.target.value)} />
        </label>  
        <label> 乘數 Y:
          <input type="number" value={Y} onChange={(e) => setY(e.target.value)} />
        </label>
        <button type="submit">產生表格</button>
        <button type="button" onClick={handleReset}>重置</button>
      </form>
    </div>
    {
      (
        ()=>{
            for (var i=1; i<=X; i++) {
              if (i%5 === 0)
                continue;
              if (i%2 !== 0 )
                innerString += `<tr class="odd">`;
              else
                innerString += `<tr class="even">`;
              for (var j=1; j<=Y; j++) {
                if (j%5 === 0)
                  continue;
                if (i === j)
                  if (j%2 !== 0)
                    innerString += `<td class="same oddCol">`;
                  else 
                    innerString += `<td class="same evenCol">`;
                else
                  if (j%2 !== 0)
                    innerString += `<td class="oddCol">`;
                  else 
                    innerString += `<td class="evenCol">`;
                innerString += `${i} * ${j} = ${i*j} </td>`;  
              }
              innerString += `</tr>`;  
            }
            innerString += "</table>";
        })()     
    }  
    <div id="mxn" dangerouslySetInnerHTML={{ __html: innerString }}></div>
  </div>
  )
};

export default Test;