function EasyStyle(el) {
    this.el = el;
}

(function (p) {
    p.style = function (styl) {
        let properties = Object.keys(styl);
        let property, val;
        for (let i = 0; i < properties.length; i++) {
            property = properties[i];
            val = styl[property];
            this.el.style[property] = val;
        }
        return this;
    }

    p.renewEl = function (el) {
        this.el = el;
        return this;
    }
})(EasyStyle.prototype);


export default EasyStyle;