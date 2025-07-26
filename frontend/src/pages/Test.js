// import React from 'react';
import './Test.css';

const Test = (props) =>{
  var X = prompt("請輸入 被乘數 X");
  var Y = prompt("請輸入 乘數 Y");
  var innerString = "<table border='1'>";
  return (
    <div id="result">
    {
      (
        ()=>{
            for (var i=1; i<=X; i++) {
              if (i%5 == 0)
                continue;
              if (i%2 != 0 )
                innerString += `<tr class="odd">`;
              else
                innerString += `<tr class="even">`;
              for (var j=1; j<=Y; j++) {
                if (j%5 == 0)
                  continue;
                if (i == j)
                  if (j%2 != 0)
                    innerString += `<td class="same oddCol">`;
                  else 
                    innerString += `<td class="same evenCol">`;
                else
                  if (j%2 != 0)
                    innerString += `<td class="oddCol">`;
                  else 
                    innerString += `<td class="evenCol">`;
                innerString += `${i} * ${j} = ${i*j} </td>`;  
              }
              innerString += `</tr>`;  
            }
            innerString += "</table>";
            document.getElementById("mxn").innerHTML = innerString;
        })()     
    }  
  </div>
  )
};

export default Test;