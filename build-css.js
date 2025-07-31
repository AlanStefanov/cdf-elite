
const postcss = require('postcss');
const fs = require('fs');
const path = require('path');

async function buildCSS() {
  try {
    const css = fs.readFileSync('./public/css/input.css', 'utf8');
    
    const result = await postcss([
      require('@tailwindcss/postcss'),
      require('autoprefixer')
    ]).process(css, {
      from: './public/css/input.css',
      to: './public/css/output.css'
    });
    
    fs.writeFileSync('./public/css/output.css', result.css);
    
    if (result.map) {
      fs.writeFileSync('./public/css/output.css.map', result.map.toString());
    }
    
    console.log('✅ CSS compiled successfully!');
  } catch (error) {
    console.error('❌ Error compiling CSS:', error);
  }
}

buildCSS();
