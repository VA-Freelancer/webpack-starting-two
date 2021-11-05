import Post from '@models/Post'
// import json from './assets/json.json'
// import xml from './assets/data.xml'
// import csv from './assets/data.csv'
import WebpackLogo from '@/assets/img/webpack-logo.png'
import './css/styles.css'
import './less/less.less'

const post = new Post('Webpack Post Title', WebpackLogo);
console.log('Post to String', post.toString());
document.querySelector('pre').classList.add('code')
document.querySelector('pre').innerHTML = (post.toString())
// console.log('JSON', json);
// console.log('XML', xml);
// console.log('CSV', csv);