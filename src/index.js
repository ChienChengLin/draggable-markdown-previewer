import React from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';
import Bootstrap from 'bootstrap';
import Toggle from 'react-bootstrap-toggle';
import pretty from 'pretty';
import 'jquery';

const SCSS_STYLE = require('./style.scss');

const placeholder = 
`# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:
  
Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
  
You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`

// interprets carriage returns and renders them as br (line break) elements
marked.setOptions({
  breaks: true,
});

// insert target='_blank'
const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
  return `<a target="_blank" href="${href}">${text}` + '</a>';
}


class App extends React.Component {
  constructor(props){
    super(props);   
    this.state = {
      boxLeftWidth: '',
      editorLabel: 'Editor',
      previewerLabel: 'Previewer',
      markdown: placeholder,
      toggle: true
    };
    
    this.handleDrag = this.handleDrag.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }
  
  handleDrag(){
    let boxLeftWidth = event.clientX - containerOffsetLeft - 22.5;
    if(boxLeftWidth < 0){
      this.setState({boxLeftWidth: 0 + 'px'});
    }
    else{
      this.setState({boxLeftWidth: boxLeftWidth + 'px'});      
    }    
    boxLeft.style.flexGrow = 0; //prevent left box from growing
    boxRight.style.flexBasis = '0%';
    boxLeft.style.width = this.state.boxLeftWidth; //update css style
  }
  
  handleChange(e){
    if(e.target.value == '') this.setState({markdown: placeholder});
    else this.setState({markdown: e.target.value});
  }

  handleToggle(){
    this.setState({toggle: !this.state.toggle});
  }
    
  
  render(){
    return (
      <div>
        <div id="header"><h1>Markdown Previewer</h1></div>
        <div id="container">
          <div id="left">
            <Toolbar text={this.state.editorLabel} />
            <Editor onChange={this.handleChange}/>
          </div>
          <Dragbar onDrag={this.handleDrag} />
          <div id="right">
            <Toolbar text={this.state.previewerLabel} toggle={this.state.toggle} handleToggle={this.handleToggle}/>
            <Previewer markdown={this.state.markdown} toggle={this.state.toggle} />
          </div>
        </div>
      </div>
    );
  }
};

const Toolbar = (props) => {
  
  return (
    <div className="toolbar">
      <h1>{props.text}</h1>
      {props.text == 'Previewer' ? <CheckBox handleToggle={props.handleToggle} toggle={props.toggle}/> : ''}
    </div>
  );
}

const CheckBox = (props) => {
  return (
    <div id="previewToggle">
      <Toggle
          onClick={props.handleToggle}
          on={<h2>MARKED</h2>}
          off={<h2>SOURCE</h2>}
          size="xs"
          onstyle="success"
          offstyle="info"
          active={props.toggle}
          width="100px"
          height="30px"
        />
    </div>
  );
}

const Editor = (props) => {
   return (
      <textarea id="editor" type="text" placeholder={placeholder} onChange={props.onChange}></textarea>
   );
}

const Previewer = (props) => {
  if(props.toggle == false){
    return (
        <div id="preview"><pre>{pretty(marked(props.markdown))}</pre></div>
    );
  }
  else{ return (
     <div id="preview" dangerouslySetInnerHTML={{__html: marked(props.markdown, { renderer: renderer })}}></div>
    );
  }
}

const Dragbar = (props) => {
  return (
    <div id="dragbar" onDrag={props.onDrag}></div>
  );
}

//render
ReactDOM.render(<App />, document.getElementById('app'));
//variables used for dragging
var dragbar = document.querySelector('#dragbar');
var container = dragbar.closest('#container');
var boxLeft = document.querySelector('#left');
var boxRight = document.querySelector('#right');
var containerOffsetLeft = container.offsetLeft;



