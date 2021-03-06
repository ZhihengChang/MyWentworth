/**
 * Logger Class
 * 
 * author: Zhiheng Chang
 * contributor:
 * used by: * file
 * descriptions: custom log
 * date added: 03/03/2021
 */
const color_reset = "\x1b[0m";
const color_map = {
    err: "\x1b[31m%s",
    info: "\x1b[32m%s",
    warn: "\x1b[33m%s",
    note: "\x1b[35m%s",
    msg: "\x1b[36m%s",
}
class Logger {
    constructor(filename) {
        this._filename = filename;
        this._reset = true;
        this._details = false;
        this._counter = 1;
    }

    /**
     * Set logger to show/hide details
     * @param {boolean} show 
     */
    details(show){
        this._details = show;
    }

    /**
    * log the given content in specific color
    * @param {String} color 
    * @param {String} content 
    */
    _color_log(color, content) {
        if (this._reset) color += color_reset;
        console.log(color, content);
    }

    /**
    * log the message
    * usage: logger.log(message).type();
    * the message will display in color based on selected type
    * lot the message in below format when details set to true:
    * "#| [hh:mm:ss] (filename) message"
    * @param {String} message 
    */
    log(message) {
        if(this._details){
            let _ts = new Date().toTimeString().split(' ')[0];
            message = `${this._counter}| [${_ts}] (${this._filename}): ${message}`;
        }
        this._counter++;
        return {
            info: () => {this._color_log(color_map.info, message)},
            msg: () => {this._color_log(color_map.msg, message)},
            note: () => {this._color_log(color_map.note, message)},
            err: () => {this._color_log(color_map.err, message)},
            warn: () => {this._color_log(color_map.warn, message)},
        }
    }
}

module.exports = Logger;