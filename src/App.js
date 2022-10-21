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
  // let [canRemove, canRemoveChange] = useState(true);
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
    const convertedFormula = convertToFormula(syntaxTree,false, '0');   
    visualizerChange(convertedFormula);
  };

  const onClickRemove = (target, tree) => {
    let pathToRemove = target.id.substring(2,target.id.length).split('.');
    // split by .
    console.log(pathToRemove);
    let targetNode;
    // 这里不会不知道怎么把["target", "name"] 得到的路径assign to node. tree['target']['name']
    for(let item of pathToRemove) {
      targetNode = tree[item]
    }
  }
  

  const selectFormula = (e) => {
    if(e.target.className === 'partOfFormula basic' ) {
      // 可以删除
      let removeButton = document.createElement('button');
      removeButton.className = 'removeBtn';
      removeButton.append('X');
      e.target.appendChild(removeButton);
      removeButton.onClick = onClickRemove(e.target, syntaxTreeJson);
     
      console.log(syntaxTreeJson);
    }
  }


  let curClassName = 0;
  const convertToFormula = (tree, preCase, prePath) => {
    //border lay
    if(!tree || tree.length === 0) return ;
    if(preCase === true) {
      preCase = false;
      switch(tree.type) {
        case 'PAREN': 
        //.expression
            return (<div className='partOfFormula' id={prePath = prePath + '.expression'}>( {convertToFormula(tree.expression,preCase, prePath)} )</div>);
        case 'FUNCTION': 
        //.arguments
            return (<div className='partOfFormula' id={prePath = prePath + '.arguments'}>{tree.name + '(' }  {convertToFormula(tree.arguments[0],preCase, prePath)} )</div>);
            case 'ADDITION':
              //.left .right
                preCase = true;
                let prePathAdd = prePath;
                return (
                  <>
                    <div className='partOfFormula' id={prePath = prePathAdd + '.left'}>{convertToFormula(tree.left,preCase,prePath)}</div>
                    +
                    <div className='partOfFormula' id={prePath = prePathAdd + '.right'}>{convertToFormula(tree.right,preCase, prePath)}</div>
                  </>
                  );
            case 'SUBTRACTION':
                  //.left .right
                preCase = true;
                let prePathSub = prePath;
                return (
                  <>
                    <div className='partOfFormula' id={prePath = prePathSub + '.left'}>{convertToFormula(tree.left,preCase,prePath)}</div>
                    -
                    <div className='partOfFormula' id={prePath = prePathSub + '.right'}>{convertToFormula(tree.right,preCase, prePath)}</div>
                  </>
                  );
            case 'MULTIPLICATION':
                  //.left .right
                preCase = true;
                let prePathMul = prePath;
                return (
                  <>
                    <div className='partOfFormula' id={prePath = prePathMul + '.left'}>{convertToFormula(tree.left,preCase,prePath)}</div>
                    *
                    <div className='partOfFormula' id={prePath = prePathMul + '.right'}>{convertToFormula(tree.right,preCase, prePath)}</div>
                  </>
                  );
            case 'DIVISION':
                  //.left .right
                preCase = true;
                let prePathDivision = prePath;
                return (
                  <>
                    <div className='partOfFormula' id={prePath = prePathDivision + '.left'}>{convertToFormula(tree.left,preCase,prePath)}</div>
                    /
                    <div className='partOfFormula' id={prePath = prePathDivision + '.right'}>{convertToFormula(tree.right,preCase, prePath)}</div>
                  </>
                  );
        case 'NEGATION':
            return (<div className='partOfFormula' id={prePath}>-{tree.expression.value}</div>);
        case 'POWER':
            return (<div className='partOfFormula' id={prePath}>{convertToFormula(tree.expression,preCase,prePath)}^{tree.power.value.toString()}</div>);
        case 'VARIABLE':
            return (<div className='partOfFormula' id={prePath}>{tree.name}</div>);
       	case 'NUMBER':
        		return (<div className='partOfFormula' id={prePath}>{tree.value}</div>);
      }
    }
    switch(tree.type) {
      case 'PAREN': 
      //.expression
          return (<div className='partOfFormula basic' id={prePath = prePath + '.expression'}>( {convertToFormula(tree.expression,preCase, prePath)} )</div>);
      case 'FUNCTION': 
      //.arguments
          return (<div className='partOfFormula basic' id={prePath = prePath + '.arguments'}>{tree.name + '(' }  {convertToFormula(tree.arguments[0],preCase, prePath)} )</div>);
      case 'ADDITION':
        //.left .right
          preCase = true;
          let prePathAdd = prePath;
          return (
            <>
              <div className='partOfFormula basic' id={prePath = prePathAdd + '.left'}>{convertToFormula(tree.left,preCase,prePath)}</div>
              +
              <div className='partOfFormula basic' id={prePath = prePathAdd + '.right'}>{convertToFormula(tree.right,preCase, prePath)}</div>
            </>
            );
      case 'SUBTRACTION':
            //.left .right
          preCase = true;
          let prePathSub = prePath;
          return (
            <>
              <div className='partOfFormula basic' id={prePath = prePathSub + '.left'}>{convertToFormula(tree.left,preCase,prePath)}</div>
              -
              <div className='partOfFormula basic' id={prePath = prePathSub + '.right'}>{convertToFormula(tree.right,preCase, prePath)}</div>
            </>
            );
      case 'MULTIPLICATION':
            //.left .right
          preCase = true;
          let prePathMul = prePath;
          return (
            <>
              <div className='partOfFormula basic' id={prePath = prePathMul + '.left'}>{convertToFormula(tree.left,preCase,prePath)}</div>
              *
              <div className='partOfFormula basic' id={prePath = prePathMul + '.right'}>{convertToFormula(tree.right,preCase, prePath)}</div>
            </>
            );
      case 'DIVISION':
            //.left .right
          preCase = true;
          let prePathDivision = prePath;
          return (
            <>
              <div className='partOfFormula basic' id={prePath = prePathDivision + '.left'}>{convertToFormula(tree.left,preCase,prePath)}</div>
              /
              <div className='partOfFormula basic' id={prePath = prePathDivision + '.right'}>{convertToFormula(tree.right,preCase, prePath)}</div>
            </>
            );
      case 'NEGATION':
          return (<div className='partOfFormula basic' id={prePath}>-{tree.expression.value}</div>);
      case 'POWER':
          return (<div className='partOfFormula basic' id={prePath}>{convertToFormula(tree.expression,preCase,prePath)}^{tree.power.value.toString()}</div>);
      case 'VARIABLE':
          return (<div className='partOfFormula basic' id={prePath}>{tree.name}</div>);
       case 'NUMBER':
          return (<div className='partOfFormula basic' id={prePath}>{tree.value}</div>);
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
