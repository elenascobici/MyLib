"use strict";
/*
    Define the methods commonly used in multiple files.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorSettings = exports.GetUserData = exports.SetUserData = exports.UpdateUserData = void 0;
const electron = require('electron');
var remote = require('electron').remote;
const url = require('url');
var fs = require('fs');
const path = require('path');
const UserData = require('./user-data-interface');
let userData = require('../user/user-data.json');
// Define the color dictionary, mapping each color option to its 5 color shades
var colorDict = new Map();
colorDict.set("default", ['#d7c8e6', '#c8b1de', '#9d86b3', '#756187', '#4a3a59']);
colorDict.set("blue", ['#bbd1ee', '#92afd4', '#6a84a5', '#43638f', '#284266']);
colorDict.set("pink", ['#ffe6fc', '#ebc5e6', '#d09bc9', '#af75a7', '#82487b']);
colorDict.set("peach", ['#ffdad5', '#f3beb7', '#df9f96', '#be766c', '#8c463c']);
colorDict.set("green", ['#b3ceb3', '#9cc49c', '#7daf7d', '#5e935e', '#396239']);
colorDict.set("gray", ['#d1d1d1', '#acacac', '#888888', '#5a5a5a', '#3e3e3e']);
colorDict.set("darkmode", ['#3e3e3e', '#5a5a5a', '#888888', '#acacac', '#d1d1d1']);
function UpdateUserData() {
    fs.writeFile('./user/user-data.json', JSON.stringify(userData));
}
exports.UpdateUserData = UpdateUserData;
function SetUserData(data) {
    userData = data;
}
exports.SetUserData = SetUserData;
function GetUserData() {
    return userData;
}
exports.GetUserData = GetUserData;
function ColorSettings(color) {
    let root = document.documentElement;
    root.style.setProperty('--lightest', colorDict.get(color)[0]);
    root.style.setProperty('--light', colorDict.get(color)[1]);
    root.style.setProperty('--middle', colorDict.get(color)[2]);
    root.style.setProperty('--dark', colorDict.get(color)[3]);
    root.style.setProperty('--darkest', colorDict.get(color)[4]);
}
exports.ColorSettings = ColorSettings;
