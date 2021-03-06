"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
var readers = [];
exports.FileTypes = {
    document: 1,
    presentation: 2,
    spreadsheet: 3,
    drawing: 4,
    image: 5
};
var File = /** @class */ (function () {
    function File(data) {
        this.data = data;
    }
    File.prototype.getMeta = function () {
        return this.data.meta;
    };
    File.prototype.getData = function () {
        return this.data;
    };
    return File;
}());
exports.File = File;
var Reader = /** @class */ (function () {
    function Reader() {
    }
    Reader.prototype.read = function (_params) {
        return Promise.reject(new Error('Invalid file'));
    };
    Reader.testFileMimeType = function (_mimeType) {
        return false;
    };
    return Reader;
}());
exports.Reader = Reader;
function config(options) {
    readers = options.readers.slice(0);
}
exports.config = config;
function read(options) {
    var meta = options.meta;

    var ReaderConstructor = readers[0].default // ^^^ Using the default constructor at the first listed reader. The method below doesn't work in two cases: 
    
    // 1.) ReaderConstructor isn't specififying that it needs to use the default constructor (its one level too high)
    // 2.) .TestFileMimeType() doesn't appear to take into account that there may be a null MimeType.

    // var ReaderConstructor = readers.find(function (ReaderConstructor) {
    //     return ReaderConstructor.testFileMimeType(meta.mimeType);
    // });

    if (!ReaderConstructor) {
        return Promise.reject(new Error(errors_1.errorsNamespace + ".unsupportedFile"));
    }
    var fileContent = new Uint8Array(options.fileBuffer);
    var fileInfo = {
        meta: meta,
        content: fileContent
    };
    return new ReaderConstructor().read({
        fileInfo: fileInfo
    });
}
exports.read = read;
