# electron-file2html-boilerplate

**Quick template for building an electron app that uses `file2html` **

[Node](https://www.npmjs.com/package/file2html)
[GitHub](https://github.com/file2html/file2htmll)

###Getting Started

Clone the directory
`git clone https://github.com/Braden-Preston/electron-file2html`

Navigate to Directory
`cd electron-file2html`

Install dependancy packages (creates /node_modules & package-lock.json)
`npm install`

Start the App!
`npm start`

###Edit the Module

The default code does not work (may be user error). You must replace code in `npm-modules/file2html/index.js` to fix the issue. Here it is:

**index.js** (before)
```javascript
    var ReaderConstructor = readers.find(function (ReaderConstructor) {
        return ReaderConstructor.testFileMimeType(meta.mimeType);
    });
```

**index.js** (after)
```javascript
	var ReaderConstructor = readers[0].default
```
**Note:** The ReaderConstructor in the original code is supposed to be obtained by checking the file MimeType, however there are two cases in which it is not working:

1.) [Reader]**.testFileMimeType()** is a function. It calls **lookup()** from `mime.js` module, which I believe freaks out when the filebuffer passes a file that has a null value for mimeType. 

2.) Even if #1 checks out, **.testFileMimeType()** is still being called against a [Reader] class. The way it is currently set up, the class constructor is one level lower than it should be. That is why testing the mimeType does not work, because it is trying to access a constructors method, while it is searching one level too high in the object. By setting it to reader[i].default, you are going to be accessing the default constructor, which contains the **.testFileMimeType()** function.

###Example Setup

After fixing the module, make sure the rest of the code is as follows.

**main.js** (Main Process )
```javascript
const {app, BrowserWindow} = require('electron')

let mainWindow

function createWindow () {
	mainWindow = new BrowserWindow({width: 800, height: 600})
	mainWindow.loadFile('index.html')
	mainWindow.webContents.openDevTools()

	mainWindow.on('closed', function () {
		mainWindow = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow()
	}
})
```

**renderer.js** (Render Process)
```javascript
const fs = require('fs')
const file2html = require('file2html')
const OOXMLReader = require('file2html-ooxml')

file2html.config({
		readers: [OOXMLReader]
});

let docPath = 'assets/sample.docx'
fileBuffer = fs.readFileSync(docPath, null)

file2html.read({
		fileBuffer,
		meta: {
				mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}
}).then((file) => {
		const {styles, content} = file.getData()		
		const meta = file.getMeta()
		
		// Publish Results
		document.body.innerHTML = styles + content
		console.log("Result", styles + content)
		console.log("MetaInfo", meta)
});
```
