// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require('fs')

const file2html = require('file2html')
const OOXMLReader = require('file2html-ooxml')

file2html.config({
    readers: [OOXMLReader]
});

let docPath = 'assets/sample.docx'
fileBuffer = fs.readFileSync(docPath, null)

file2html.read({
    fileBuffer, // Can be a buffer (like in this case), otherwise file2html converts it to an array buffer; Ex:Uint8Array(buffer.length)
    meta: {
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // The preset that specifies what decoding method to use in the reader,
    }                                                                                       // this string is normally supplied by [READER].testFileMimeType.
}).then((file) => {
    const {styles, content} = file.getData()    
    const meta = file.getMeta()
    
    // Publish Results
    document.body.innerHTML = styles + content
    console.log("Result", styles + content)
    console.log("MetaInfo", meta)
});