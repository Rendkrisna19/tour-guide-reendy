const http = require('http');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    } else if (req.method === 'POST' && req.url === '/send-email') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { name, email, message } = JSON.parse(body);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'youremail@gmail.com', // Ganti dengan email Anda
                    pass: 'yourpassword' // Ganti dengan password email Anda
                }
            });

            const mailOptions = {
                from: email,
                to: 'youremail@gmail.com', // Ganti dengan email Anda
                subject: 'New Contact Us Message',
                text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Failed to send message.');
                } else {
                    console.log('Email sent:', info.response);
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Message sent successfully!');
                }
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
