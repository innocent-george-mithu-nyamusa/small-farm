const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

//synnchronous file reading
// const text = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(text)

// const textout = `here is some interesting stuff ${text} \n created on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textout)
// console.log('File Written ')

//non-blockin asynchronous file reading .
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) =>{
//     fs.readFile(`./txt/${data}`, 'utf-8', (err, data1)=>{
//         fs.readFile('./txt/input.txt', 'utf-8', (err, data2) =>{

//             fs.writeFile('./txt/output.txt', `${data1} \n ${data2}`,'utf-8',err =>{

//                 console.log("file written ")
//             })
//         })
//     })
//})

//reading_data
const temp_overview = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	'utf-8',
);
const temp_product = fs.readFileSync(
	`${__dirname}/templates/template-product.html`,
	'utf-8',
);
const temp_card = fs.readFileSync(
	`${__dirname}/templates/template-card.html`,
	'utf-8',
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
// dataObj.append();

const server = http.createServer((req, resp) => {
	//inorder to view urls like "product?id=0" we need the query object which is submitted with the url address and point that to our product page
	const { query, pathname } = url.parse(req.url, true);
	// const slug = dataObj.map(item => {
	// 	item.append(
	// 		productSlug,
	// 		slugify(item.productName, { replacement: '-', lower: true }),
	// 	);
	// });

	//OVERVIEW part of the application
	if (pathname === '/' || pathname === '/overview') {
		//you specify the type of content you are sending to the server each time withthis header
		resp.writeHead(200, { 'Content-type': 'text/html' });

		//we are iterating in the dataObj object , and with each object item in the dataobj
		//we replace some placeholder text with the replaceTemplate funtcion.
		//we convert the html into a string with the join('') method
		const cards_html = dataObj
			.map(el => replaceTemplate(temp_card, el))
			.join('');

		//we are replacing the {%PRODUCT_CARDS%} placeholder with a string
		const output = temp_overview.replace('{%PRODUCT_CARDS%}', cards_html);

		//we are responding with the completed template output
		resp.end(output);

		//PRODUCT
	} else if (pathname === '/product') {
		//head to specify the html content we are sending to client
		resp.writeHead(200, { 'Content-type': 'text/html' });
		//we want to get the object item in dataObj at index query.id
		const product = dataObj[query.id];

		const output = replaceTemplate(temp_product, product);

		resp.end(output);
		//API
	} else if (pathname === '/api') {
		resp.writeHead(200, { 'Content-type': 'application/json' });
		resp.end(data);
		//NOT-FOUND
	} else {
		resp.writeHead(404, {
			'Content-type': 'text/html',
		});
		resp.end('<h1>Page not found !</h1>');
	}
});

server.listen(8000, '127.0.0.1', () => {
	console.log('Listening to request on port 8000');
});
