require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const router = require('./self_modules/routes/routes');
const routerSecure = require('./self_modules/routes/routesSecure');
const authorize = require('./self_modules/middlewares/authorize');
const corsOptions = require('./self_modules/middlewares/cors');
const cookieParser = require('cookie-parser'); 

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json({limit:"1.1MB"}));
app.use(express.static('public'));
app.use(cookieParser()); 
app.use(cors(corsOptions))

const securityLogger = (req, res, next) => {
    const start = Date.now();
    const now = new Date().toISOString();
    const ip = req.ip || req.socket.remoteAddress;

    res.on('finish', () => {
        const duration = Date.now() - start;

        let logMessage = `\n====================================================\n`;
        logMessage += `[${now}] REQUÊTE CAPTURÉE\n`;
        logMessage += `IP       : ${ip}\n`;
        logMessage += `Cible    : ${req.method} ${req.originalUrl}\n`;
        logMessage += `Statut   : ${res.statusCode} (${duration}ms)\n`;
        logMessage += `Outil    : ${req.headers['user-agent'] || 'Inconnu'}\n`;
        logMessage += `Headers  : ${JSON.stringify(req.headers)}\n`;

        if (req.cookies && Object.keys(req.cookies).length > 0) {
            logMessage += `Cookies  : ${JSON.stringify(req.cookies)}\n`;
        }

        if (req.jwtid || req.user) {
            logMessage += `Auth     : ID Token: ${req.jwtid || 'N/A'}, User: ${JSON.stringify(req.user || 'N/A')}\n`;
        }

        if (Object.keys(req.query).length > 0) {
            logMessage += `Query    : ${JSON.stringify(req.query)}\n`;
        }

        if (Object.keys(req.body).length > 0) {
            logMessage += `Payload  : ${JSON.stringify(req.body)}\n`;
        }

        if (req.method === 'POST' && req.originalUrl.includes('/connection')) {
            const mailTried = req.body.mail || "aucun";

            logMessage += `\nTENTATIVE DE CONNEXION :\n`;
            logMessage += `   Mail ciblé     = "${mailTried}"\n`;
            logMessage += `   Password testé = "attention au RGPD..."\n`;
        }

        logMessage += `====================================================\n`;

        console.log(logMessage);

        fs.appendFile(path.join(__dirname, 'attack.log'), logMessage, (err) => {
            if (err) console.error("Erreur lors de l'écriture du log:", err);
        });
    });

    next();
};


app.use(securityLogger);
app.use('/', router);
app.use(authorize);
app.use('/', routerSecure);

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.info(`[SERVER] Listening on http://localhost:${port}`); 
})