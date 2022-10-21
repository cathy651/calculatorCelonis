import React, { useState } from 'react';
import './App.css';
import * as Parser from './parser/formula-parser.js';
// import convertToFormula from './convertToFormula.js'
const parse = Parser.parse;

function App() {
  let [formula, formulaChange] = useState('($b + SQRT (SQR($b) - 4 * $a)) / (2 * $a)');
  let [syntaxTree, syntaxTreeChange] = useState('');
  let [syntaxTreeJson, syntaxTreeJsonChange] = useState(null);
  let [visualizerOutput, visualizerChange] = useState('');
  let [canRemove, canRemoveChange] = useState(true);
  const handleChange = (event) => {
    formulaChange(event.target.value);
  }
  const updateAst = () => {
    console.log('creating ast view...');
    const newSyntaxTree = parse(formula);
    syntaxTreeChange(newSyntaxTree);
    syntaxTreeJsonChange(JSON.stringify(newSyntaxTree, null, 2));
  };

  const convertAstToFormula = () => {  
    const convertedFormula = convertToFormula(syntaxTree);   
    visualizerChange(convertedFormula);
  };

  const selectFormula = (e) => {
    if(e.target.className === 'partOfFormula basic' && canRemove) {
      // 可以删除
      let removeButton = document.createElement('button');
      removeButton.append('X');
      e.target.appendChild(removeButton);
      canRemoveChange(false);
    }
  }

  let curClassName = 0;
  const convertToFormula = (tree) => {
    //border lay
    if(!tree || tree.length === 0) return ;
     switch(tree.type) {
        case 'PAREN': 
            let curRes = '(' + convertToFormula(tree.expression) +')';
            return (<div className='partOfFormula' id={(curClassName++).toString()}>{curRes}</div>);
        case 'FUNCTION':
            return (<div className='partOfFormula' id={(curClassName++).toString()}>{tree.name} ( {convertToFormula(tree.arguments[0])} )</div>);
        case 'ADDITION':
            return (<div className='partOfFormula basic' id={(curClassName++).toString()}>{convertToFormula(tree.left)}  + {convertToFormula(tree.right)}</div>);
        case 'SUBTRACTION':
            return (<div className='partOfFormula basic' id={(curClassName++).toString()}>{convertToFormula(tree.left)}  - {convertToFormula(tree.right)}</div>);
        case 'MULTIPLICATION':
            return (<div className='partOfFormula basic' id={(curClassName++).toString()}>{convertToFormula(tree.left)} * {convertToFormula(tree.right)}</div>);
        case 'DIVISION':
            return (<div className='partOfFormula basic' id={(curClassName++).toString()}>{convertToFormula(tree.left)}  / {convertToFormula(tree.right)}</div>);
        case 'NEGATION':
            return (<div className='partOfFormula' id={(curClassName++).toString()}>-{tree.expression.value}</div>);
        case 'POWER':
            return (<div className='partOfFormula' id={(curClassName++).toString()}>{convertToFormula(tree.expression)}^{tree.power.value.toString()}</div>);
        case 'VARIABLE':
            return (<div className='partOfFormula'>{tree.name}</div>);
       	case 'NUMBER':
        		return (<div className='partOfFormula'>{tree.value}</div>);
    }
  } 

  return (
    <div className='formulizer'>
      <h1>Welcome to the formulizer!</h1>
      <h3>Input formula</h3>
      <p>
        <textarea 
          cols={100} 
          rows={8} 
          value={formula} 
          onChange={handleChange}/> <br/>
      </p>
      <p><button onClick={updateAst}>Parse and update AST View</button></p>
      <h3>Syntax tree</h3>
      <pre style={{maxHheight: '300px', overflowy: 'auto',backgroundColor: '#eeeeee'}}>{syntaxTreeJson}</pre>
      <p><button onClick={convertAstToFormula}>Convert AST to Formula</button></p>
      <h3>Visualizer-to-Formula</h3>
      <div className='visualizerContainer' onClick={selectFormula}>{visualizerOutput}</div>
    </div>
  );
}

export default App;
