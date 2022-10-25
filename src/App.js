import React, { useState, useEffect } from 'react';
import './App.css';
import * as Parser from './parser/formula-parser.js';
import Element from './Element/Element.js';

const parse = Parser.parse;

function App() {
  let [formula, formulaChange] = useState('SQRT(SQR($b) - 4 * $a)');
  let [syntaxTree, syntaxTreeChange] = useState('');
  let [syntaxTreeJson, syntaxTreeJsonChange] = useState(null);
  let [visualizerOutput, visualizerChange] = useState('');
  
  useEffect(()=>{
    syntaxTreeJsonChange(JSON.stringify(syntaxTree, null, 2));
  },[syntaxTree])

  const handleChange = (event) => {
    formulaChange(event.target.value);
  }

  const updateAst = () => {
    console.log('creating ast view...');
    const newSyntaxTree = parse(formula);
    syntaxTreeChange(newSyntaxTree);
    syntaxTreeJsonChange(JSON.stringify(newSyntaxTree, null, 2));
  }

  const convertAstToFormula = () => {  
    const convertedFormula = convertToFormula(syntaxTree,'0');   
    visualizerChange(convertedFormula);
  }
  // function to set obj value with a path of string
  const setPath = (object, path, value) => {
  	const parts = path.slice(2,path.length).split('.');
    console.log(parts);
  	const limit = parts.length - 1;
		for (let i = 0; i < limit; i++) {
      	let key = parts[i];
        if(key === 'arguments[0]') {
        	object = object.arguments[0]; 
        } else {
        	object = object[key] ?? (object[key] = { });
        }
    }
  	const key = parts[limit];
    object[key] = value;
  }

  const updateSyntaxTree = (path) => {
    setPath(syntaxTree, path, null);
    syntaxTreeJsonChange(JSON.stringify(syntaxTree, null, 2));
  }
  
  const convertToFormula = (tree, prePath) => {
    //border lay
    if(!tree || tree.length === 0) return ;
      switch(tree.type) {
        case 'PAREN': 
        //.expression
            return (<div className='partOfFormula' id={prePath = prePath + '.expression'}>( {convertToFormula(tree.expression, prePath)} )</div>);
        case 'FUNCTION': 
        //.arguments
            return (<div className='partOfFormula' id={prePath = prePath + '.arguments[0]'}>{tree.name + '(' }  {convertToFormula(tree.arguments[0], prePath)} )</div>);
            case 'ADDITION':
              //.left .right
                let prePathAdd = prePath;
                return (
                  <div className='partOfFormula' id={prePath = prePathAdd }>
                    <Element id={prePath = prePathAdd + '.left'} nextStep={convertToFormula(tree.left, prePath)} syntaxTreeJson={syntaxTreeJson} updateSyntaxTree={updateSyntaxTree} />
                    +
                    <Element id={prePath = prePathAdd + '.right'} nextStep={convertToFormula(tree.right, prePath)} syntaxTreeJson={syntaxTreeJson} updateSyntaxTree={updateSyntaxTree} />
                  </div>
                );
            case 'SUBTRACTION':
                  //.left .right
                let prePathSub = prePath;
                return (
                  <div className='partOfFormula' id={prePath = prePathSub}>
                    <Element id={prePath = prePathSub + '.left'} nextStep={convertToFormula(tree.left, prePath)} syntaxTreeJson={syntaxTreeJson} updateSyntaxTree={updateSyntaxTree} />
                    -
                    <Element id={prePath = prePathSub + '.right'} nextStep={convertToFormula(tree.right, prePath)} syntaxTreeJson={syntaxTreeJson} updateSyntaxTree={updateSyntaxTree} />
                  </div>
                );
            case 'MULTIPLICATION':
                  //.left .right
                let prePathMul = prePath;
                return (
                  <div className='partOfFormula' id={prePath = prePathMul}>
                    <Element id={prePath = prePathMul + '.left'} nextStep={convertToFormula(tree.left, prePath)} syntaxTreeJson={syntaxTreeJson} updateSyntaxTree={updateSyntaxTree} />
                    *
                    <Element id={prePath = prePathMul + '.right'} nextStep={convertToFormula(tree.right, prePath)} syntaxTreeJson={syntaxTreeJson} updateSyntaxTree={updateSyntaxTree} />
                  </div>
                );
            case 'DIVISION':
                  //.left .right
                let prePathDivision = prePath;
                return (
                  <div className='partOfFormula' id={prePath = prePathDivision}>
                    <Element id={prePath = prePathDivision + '.left'} nextStep={convertToFormula(tree.left, prePath)} syntaxTreeJson={syntaxTreeJson} updateSyntaxTree={updateSyntaxTree} />
                    /
                    <Element id={prePath = prePathDivision + '.right'} nextStep={convertToFormula(tree.right, prePath)} syntaxTreeJson={syntaxTreeJson} updateSyntaxTree={updateSyntaxTree} />
                  </div>
                );
        case 'NEGATION':
            return (<div className='partOfFormula' id={prePath}>-{tree.expression.value}</div>);
        case 'POWER':
            return (<div className='partOfFormula' id={prePath}>{convertToFormula(tree.expression, prePath)}^{tree.power.value.toString()}</div>);
        case 'VARIABLE':
            return (<div className='partOfFormula' id={prePath}>{tree.name}</div>);
        case 'NUMBER':
            return (<div className='partOfFormula' id={prePath}>{tree.value}</div>);
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
      <div className='visualizerContainer' >{visualizerOutput}</div>
    </div>
  );
}

export default App;

