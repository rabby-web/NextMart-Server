import { Request, Response, NextFunction } from 'express';
import { UAParser } from 'ua-parser-js';

const clientInfoParser = (req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const parser = new UAParser(); // Create an instance
    parser.setUA(userAgent); // Set the User-Agent string
    const parsedUA = parser.getResult(); // Get the parsed result

    req.body.clientInfo = {
        device: parsedUA.device.type || 'pc', // Default to 'pc' if no device type is detected
        browser: parsedUA.browser.name || 'Unknown',
        ipAddress: req.ip || req.headers['x-forwarded-for'] || 'Unknown',
        pcName: req.headers['host'] || '', // Optionally include host header (not reliable for PC name)
        os: parsedUA.os.name || 'Unknown',
        userAgent: userAgent,
    };

    next();
};

export default clientInfoParser;
