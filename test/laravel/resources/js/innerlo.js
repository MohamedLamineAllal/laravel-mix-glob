import EasyStyle from './easyStyle';
import EventEmitter from 'eventemitter3';
function OutsideEvents () {

}// complete all events, one store or one center, queue, perfromant


// force all top (loop through all els zIndex, set something bigger then that)

// lite version (give ease of animation, without all the overiding options, neither the created container)
function InnerloLite () {

}



// later add no container option [el appended directly]
// add more class state  [or make state and work with state] (infinite number of state dynamic) [each state have there function ] (then easily switch between states)



/**
 * bugs and problems to solves
 * 
 * multi innerlo and click outside (use one prototype click window listener (for innerlo and it's extensions))
 * // undo one innerlo at a time (the last one get first hidden)
 * 
 * // provide hide all (one after another with animation or not ....etc) // some day
 * 
 * 
 * 
 * check your logic for the click handlers (multiple you set)
 * 
 */
function Innerlo(container, el, options) {
    this.el = el;
    if (container === 'parent') {
        this.cc = this.el.parentNode;
    } else {
        this.cc = container;
    }

    this.state = 'init';

    // contianer container
    var containerPosition = 'absolute';
    if (!this.cc) {
        this.cc = document.body;
    }

    if(this.cc === document.body) {
        containerPosition = 'fixed';
    }
        //(find max zIndex, in container) //// (also can be handled from css)
        
        this.elStyl = new EasyStyle(this.el);
        this.elStyl.style({
            zIndex: this.topZIndex,
            pointerEvents: 'initial'
        });

        this.container = document.createElement('div');

        this.cstyl = new EasyStyle(this.container);
        this.cstyl.style({
            width: '100%',
            height: '100%',
            position: containerPosition,
            top: 0,
            left: 0,
            overflow: 'hidden', // add options to set that to not that (that just the default, to avoid problem, but if you need not to have that, then an option will do it. case scenario (i want overflow, and i will set the hidden overflow, in another container))
            transition: 'all 400ms ease',
            background: 'transparent'
        });
        console.log(this.cc);
        this.cc.appendChild(this.container);
        //options.elPosInVirtualContainer
        // positioning will be set conditionally depending on the options
        // need to support multiple type of positioning (absolute, relative, centered, vertical, horizontal, and see how we keep all that with a good animation engine), presets
        this.cstyl.style({
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center'
        });

        this.container.appendChild(this.el);
    

    this.initCls = null;
    this.outCls = null;
    this.baseCls = null;
    this.elDfltDisplay = 'unset';
    this.containerDfltDisplay = 'flex';
    this.duration = 500; // number or {in: , out: }
    this.delay = 0; // number or {in: , out: }
    this.easing = 'ease'
    this.el.style.transition = 'all ' + this.easing + ' ' + this.duration+ 'ms ' +  this.delay + 'ms';
    this.clickOutAutoHide = true;
    // later have stylesheet added by js (add init, in, out classes, each will set transition style, ..etc)  // we separate the prametrisation
    this.containerZIndex = 1000000000; // that's too too big (but you can overide it in options)
    this.outsideClickPropagationStoped = false;
    
    this.container.className = 'innerlo_container';
    this.showEl = false;

    if(options) {
        if (options.elDfltDisplay) {
            this.elDfltDisplay = options.elDfltDisplay;
        }
        if (options.containerDfltDisplay) {
            this.containerDfltDisplay = options.containerDfltDisplay;
        }

        if(options.initCls) {
            this.initCls = options.initCls;
        }

        if(options.outCls) {
            this.outCls = options.outCls;
        }

        if(options.baseCls) {
            this.baseCls = options.baseCls;
            this.addClass(this.baseCls);
        }

        if(options.backBackground) {
            this.backBackground = options.backBackground;
        }

        if (options.containerZIndex) {
            this.containerZIndex = options.containerZIndex;
        }

        if (options.containerClass) {
            this.container.className += ' ' + options.containerClass;
        }

        if (options.showEl) {
            this.showEl = options.showEl;
        }

        if (typeof options.clickOutAutoHide !== 'undefined') {
            alert('option a'+ options.clickOutAutoHide)
            this.clickOutAutoHide = options.clickOutAutoHide;
        }
        if (options.noClickOutHandling) {
            this.noClickOutHandling = options.noClickOutHandling;
        } else {
            this.noClickOutHandling = false;
        }

        if (options.reinsertContainer) {
            this.reinsertContainer = options.reinsertContainer;
        } else {
            this.reinsertContainer = true;
        }

        if (! options.noClickOutHandling) {
            if (options.clickOutsideHandler) {
                this.clickOutsideHandler = options.clickOutsideHandler;
            } else {//default value
                this.clickOutsideHandler = function (evt) {
                    this.chide(function () {
                        execEvtHandler.call(this, 'chideEnd', evt);
                    });
                }
            }
            this.clickOutsideHandler = this.clickOutsideHandler.bind(this);

                this.clickOutHandlerSet = false;
                console.log('click out auto hide');
                console.log(this.clickOutAutoHide);
                if (this.clickOutAutoHide) {
                this.clickOutsideActive = false;
                if (Innerlo.prototype.clickListener === null) {
                    Innerlo.prototype.clickListener = window.addEventListener('click', function (evt) {
                        Innerlo.prototype.eeEmit('windowClickHandler_getit');
                        console.log('length clickhand = ', Innerlo.prototype.clickHandlers.length);
                        for (let i = 0; i < Innerlo.prototype.clickHandlers.length; i++) {
                            Innerlo.prototype.clickHandlers[i](evt);
                            console.log('>>>>');
                        }
                    }); // later add unbined at object distruction
                }

                this.addClickOutHandler();
        }


        if (options.specifiedTexts) {
            this.specifiedTexts = options.specifiedTexts;
        }

        if (options.specifiedEls) {
            this.specifiedEls = options.specifiedEls;
        }

        if (options.contentDefiners) {
            this.contentDefiners = options.contentDefiners;
        }
        /*
        {
            dfinerName: {
                specifiedTexts : {
                    elname: innerHTML_value,
                    .....
                },
                specifiedEls: {
                    elname: innerHTML_value,
                    ......
                },
                ......
            }
        }
        */  
    }

    this.cstyl.style({
        zIndex: this.containerZIndex
    })

    if (this.showEl) {
        removeClass(this.el, 'init');
        this.state = 'init';
        this.state = 'shown';
    } else {
        addClass(this.el, 'init');
        // alert(this.el.className);
    }

    }


    this.events = {
        onElOutsideClick: this.clickOutsideHandler,
        onContainerOutsideClick: null,
        chideStart: null,
        chideEnd: null,
        cshowStart: null,
        cshowEnd: null
    }
}


(function (p) {
    p.eventEmitter = new EventEmitter();
    p.topZIndex = 5000; // this value get updated by the biggest last zIndex // each time we show an innerlo, that get rized up. Depending in options (each time check the whole dom tree for zindex. Or jsut do that at init, and then the game is between innerlo. Why when popping several, the new one will get on top of the old one. We can keep rizing that number. or we can keep a list of active innerlo and zindex.) we can keep => base (without innerlo) & innerlo => innerlo add. (this better, two variable will do the trick)

    p.eeOn = function () {
        p.eventEmitter.on.apply(p.eventEmitter, arguments);
    }

    p.eeEmit = function () {
        p.eventEmitter.emit.apply(p.eventEmitter, arguments);
    }

    p.ee = function (prop) {
        // if (prop in p.eventEmitter) { // don't check
            p.eventEmitter[prop].apply(p.eventEmitter, Array.prototype.slice.call(arguments, 1)); // later check if it's a function
        // }
    }

    p.clickListener = null;
    p.clickHandlers = [];
    
    p.addClickOutHandler = function () { // you may restrict the handling to only clicks with a target that have a parent [so the one that get removed from the DOM will not be triggered]  / use stoppropagatioon in other handler (if they remove detach elements)
        if(!this.clickOutHandlerSet) {
            this.clickOutHandlerSet = true;
            console.log('hi theere hi hi hi hi');
            Innerlo.prototype.clickHandlers.push(function (evt) {
                if (this.clickOutsideActive/* && evt.target.parentNode !== null*/) { // not active don't bother, it get activated at the end of the fist show, deactivted at start of the hide
                    if(!isDescendant(this.el, evt.target)) {// event happend outside
                        if (!this.outsideClickPropagationStoped) {
                            execEvtHandler.call(this, 'onElOutsideClick', evt);
                            console.log('click outside hide !!!!!!!!hide hidehide');
                            console.log(evt.target);
                            console.log(this.el);
                        }
                    } 

                    if(!isDescendant(this.container, evt.target)) { // outside hte container
                        if(!this.outsideClickPropagationStoped) {
                            execEvtHandler.call(this, 'onContainerOutsideClick', evt);
                        }
                    }

                    this.outsideClickStopPropagation = false; // get it back so it work the next round (this a mean to stop the propagation by the outside handlers)
                }
            }.bind(this));
        }
    }


    p.on = function (evt, handler) {
        if(this.events.hasOwnProperty(evt)) {
            this.events[evt] = handler.bind(this);
        } else {
            throw 'Wrong event name!';
        }
        return this;
    }

    p.outsideClickStopPropagation = function () {
        this.outsideClickPropagationStoped = true;
    }

    p.addClass = function (cls) { // a class or an array
        if (this instanceof Innerlo) {
            addClass(this.el, cls);
            return this;
        } else { //static 
            addClass(arguments[0], arguments[1]); // two arguments should be provided [otherwise it will trigger an error]
        }
    }

    p.removeClass = function (cls) { // a class or an array
        if (this instanceof Innerlo) {
            removeClass(this.el, cls);
            return this;
        } else { //static 
            removeClass(arguments[0], arguments[1]); // two arguments should be provided [otherwise it will trigger an error]
        }
    }

    p.toggleClass = function (cls) { // a class or an array
        if (this instanceof Innerlo) {
            toggleClass(this.el, cls);
            return this;
        } else { //static 
            toggleClass(arguments[0], arguments[1]); // two arguments should be provided [otherwise it will trigger an error]
        }
    }

    p.hasClass = function (cls) {
        if (this instanceof Innerlo) {
            hasClass(this.el, cls);
            return this;
        } else { //static 
            hasClass(arguments[0], arguments[1]); // two arguments should be provided [otherwise it will trigger an error]
        }
    }

    p.display = function (valEl, valContainer) {
        if (arguments.length == 1) {
           if (arguments[0]) {
            if (arguments[0] === true) {
                console.log("=======**=============>");
                console.log(this.elDfltDisplay);
                console.log(this.containerDfltDisplay);
                console.log("=======**=============>");
                this.el.style.display = this.elDfltDisplay;
                this.container.style.display = this.containerDfltDisplay;
            } else { // if something else then true (we put it like Block, Flex ...etc)
                this.el.style.display = arguments[0];
                this.container.style.display = arguments[0];
            }
        }
        else {
            this.el.style.display = 'none';
            this.container.style.display = 'none';
        }
            return this;
        } else if(arguments.length == 0) {
            this.el.style.display = 'none';
            this.container.style.display = 'none';
            return this;
        } 

        if (valEl) {
            if(valEl === true) {
                this.el.style.display = this.elDfltDisplay;
            } else { // if something else then true (we put it like Block, Flex ...etc)
                this.el.style.display = valEl;
            }
        }
        else {
            this.el.style.display = 'none';
        }
        
        if (valContainer) {
            if(valContainer === true) {
                this.container.style.display = this.containerDfltDisplay;
            } else { // if something else then true (we put it like Block, Flex ...etc)
                this.container.style.display = valContainer;
            }
        }
        else {
            this.container.style.display = 'none';
        }

        return this;
    }

    p.alert = function (domEl, position) {

    }

    p.reinsertInContainer = function () {
        if (this.container.parentNode !== this.cc) {
            this.cc.appendChild(this.container);
        }
    }

    p.getState = function () {
        return this.state;
    }

    p.cshow = function (finishedcallback, hiddenClass, showClass) {
        if (this.reinsertContainer) {
            this.reinsertInContainer();
        }

        execEvtHandler.call(this, 'cshowStart');

        setTimeout(function () {
            this.removeClass(this.outCls);
            this.addClass(this.baseCls);
            this.addClass(this.initCls);
            this.display(true);
            setTimeout(function () { // better have it an object function, and bind it
                if (this.backBackground) {
                    // alert(JSON.stringify(this.backBackground.background))
                    this.cstyl.style(this.backBackground);
                    // this.container.style.background = this.backBackground.background
                }
                this.removeClass(this.initCls);
                this.addClass(this.baseCls);
                this.clickOutsideActive = true;
                if (finishedcallback) { // if this precised we will nt exec the event handler (you can stay execut it with this.execEvent() method)
                    finishedcallback.call(this); // here you can have a function that allow manual execution of the set event handler
                    // this within it (your callback) refer to this Innerlo instance
                } else {
                    execEvtHandler.call(this, 'cshowEnd');
                }
                this.state = 'shown';
            }.bind(this), 50);
        }.bind(this), this.delay)

        return this;
    }

    p.chide = function (finishedcallback) {
        execEvtHandler.call(this, 'chideStart');
        setTimeout(function () {
            this.clickOutsideActive = false;
            this.addClass(this.outCls);
            this.addClass(this.baseCls);
            if (this.backBackground) {
                this.cstyl.style({
                    background: 'transparent'
                });
            }

             setTimeout(function () { // better have it an object function, and bind it
                this.display(false);
                this.removeClass(this.outCls);
                this.addClass(this.baseCls);
                if (finishedcallback) {
                    finishedcallback.call(this); // here you can have a function that allow manual execution of the set event handler
                } else {
                    console.log('=====================================================+++> ');
                    execEvtHandler.call(this, 'chideEnd');
                }
                this.state = 'hidden';
             }.bind(this), this.duration);
        }.bind(this), this.delay)

        return this;
    }

    p.execEvtHandler = function (evt) { // it allow a manual execution of the set events handlers (you can pass the argument, work with all events)
        console.log(arguments);
        execEvtHandler.call(this, evt, Array.prototype.slice.call(arguments, 1));
    }

    p.cToggleEl = function () {
        // if() {

        // }
    }
    
    p.getEl = function () {
        return this.el;
    }

    /**
     * to do: accept object  (test for arguments number and if one then it should be an object!!!)
     */
    p.updateText = function (specifiedFiled, newText) { // a dom el we specify in advance (then)
        if (arguments.length === 1) {
            //object provided // later add check here
            let keys = Object.keys(arguments[0])
            for (let i = 0; i < keys.length; i++){
                let textFieldName = keys[i]
                let textFieldValue = arguments[0][textFieldName];
                
                if (this.specifiedTexts.hasOwnProperty(textFieldName)) {
                    this.specifiedTexts[textFieldName].innerHTML = textFieldValue;
                } else {
                    throw 'Specified text field wasn\'t specified';
                }
            }
        } else if (arguments.length === 2) {
            console.log("this.specifiedTexts = ", this.specifiedTexts);
    
            if (this.specifiedTexts.hasOwnProperty(specifiedFiled)) {
                this.specifiedTexts[specifiedFiled].innerHTML = newText;
            } else {
                throw 'Specified text field wasn\'t specified';
            }
        } else {
            throw 'NO Argument specified';
        }

        return this;
    }

    // add support for transition in text change (don't know if it make sense)

    p.replaceEL = function (specifiedEl, newEl) {
        // add new above the old then remove the old
        if (this.specifiedEls.hasOwnProperty(specifiedEl)) {
            // this.textFields[specifiedFiled].innerHTML = newText;
            //[flow the same logic as in alter (all the child will be detached, and the new el, will be attached)]
        } else {
            throw 'Specified element field wasn\'t specified';
        }

        return this; // you can chaine
    }

    p.alter = function (definer) { // you set in advance definers [set specified text, el, fields ..etc]
        // then you build definers (set them) [then you simply alter with alter easily]
        if (this.contentDefiners.hasOwnProperty(definer)) {
            let defineObj = this.contentDefiners[definer];
            console.log("this content definers = " , this.contentDefiners);
            if (defineObj.hasOwnProperty('specifiedTexts')) {
                let keys = Object.keys(defineObj.specifiedTexts);
                let el;
                let val;
                for(let i = 0; i < keys.length; i++){
                    el = this.specifiedTexts[keys[i]];
                    val = defineObj.specifiedTexts[keys[i]];

                    el.innerHTML = val;
                }
            } 
            
            if (defineObj.hasOwnProperty('specifiedEls')) {
                let keys = Object.keys(defineObj.specifiedEls);
                let container;
                let el;
                for (let i = 0; i < keys.length; i++) {
                    container = this.specifiedEls[keys[i]];
                    console.log("container = = = == = ", container);
                    el = defineObj.specifiedEls[keys[i]];

                    console.log("el = = = == = ", el);

                    clearDomNodeInner(container);
                    container.appendChild(el);// for all this to work, your element in the template should be inserted into a container (we wipe the container all childrens and then insert the new one (the container is ment to hold only one element [or it's simpler like that, we can add support for multiple els]))

                    //old el is referenced by the definer (so it will still in memory)
                }
            }
          
            // {
            //     dfinerName: {
            //         specifiedTexts: {
            //             elname: innerHTML_value,
            //             .....
            //         },
            //         specifiedEls: {
            //             elname:  elToPutOnTheContainer// not that to replace, we
            //             ......
            //         },
            //         ......
            //     }
            // }
        } else {
            throw 'wrong definner !!'
        }
        return this // to be able to chaine
    }

    p.setEl = function () 
    {

    }

    p.setContainer = function () {

    }

    p.extend = function (Cls) {
       Innerlo.prototype
    }
})(Innerlo.prototype);
























// add form values show for inputs confirmation before sending


export function InnerloAlert(options) {
    if (options) {
        if(options.icon) {
            this.icon = options.icon; // for icon later you set them globaly (prototype) [here] (and have predefined) // play on precedency
        }
        if (options.container) {
            this.container = options.container;
        } else {
            this.container = document.body;
        }
    }
    
    // this.icon; later add the svg icon in the code
    this.innerloMessageEl = document.createElement('div');
    this.innerloMessageEl.className = 'innerloMessageEl';
    this.innerloMessageEl_title = document.createElement('h3');
    this.innerloMessageEl_title.className = 'title';
    this.innerloMessageEl_mainMessageContainer = document.createElement('div');
    this.innerloMessageEl_mainMessageContainer.className = 'mainMessageContainer';
    this.innerloMessageEl_mainMessage = document.createElement('p');
    this.innerloMessageEl_mainMessage.className = 'mainMessage';
    this.innerloMessageEl_mainMessageContainer.append(this.innerloMessageEl_mainMessage);
    // edgeFade_mainMessage = new EdgesFade(innerloMessageEl_mainMessageContainer, {
    //     top: {
    //         height: '20%'
    //     },
    //     bottom: {
    //         height: '20%'
    //     },
    //     maxHeight: '150px'
    // });

    this.innerloMessageEl_topIcon = document.createElement('div');
    this.innerloMessageEl_topIcon.className = 'topIcon';

    this.innerloMessageEl_innerContainer = document.createElement('div');
    this.innerloMessageEl_innerContainer.className = "innerContainer";

    this.innerloMessageEl_topIcon.append(this.icon);

    this.innerloMessageEl_innerContainer.append(this.innerloMessageEl_topIcon, this.innerloMessageEl_title, this.innerloMessageEl_mainMessageContainer);

    this.innerloMessageEl.append(this.innerloMessageEl_innerContainer);

    this.emeStyl = new EasyStyle(this.innerloMessageEl)
        .style({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60%',
            height: '60%'
        });
//[to do] make that config personalisable from outside  [create multilevel Object merge]
    this.innerloInst = new Innerlo(this.container, this.innerloMessageEl, {
        initCls: 'up init',
        inCls: 'fade move',
        outCls: 'up out',
        baseCls: 'innerlo fade move up',
        backBackground: {
            background: '#ffffffe6'
            // background: '#03030333'
        },
        dfltDisplay: 'flex',
        specifiedTexts: {
            title: this.innerloMessageEl_title,
            mainMessage: this.innerloMessageEl_mainMessage
        },
        specifiedEls: {
            topIcon: this.innerloMessageEl_topIcon
        },
        // clickOutAutoHide: false,
        containerClass: 'innerloMessage_container',
        // contentDefiners: {
        //     alreadyBlocked: {
        //         specifiedTexts: {
        //             h5: 'The company is already blocked',
        //             p: "Don't worry and relax"
        //         },
        //         specifiedEls: {
        //             icon: svgAlreadyBlock
        //         }
        //     },
        //     wrongId: {
        //         specifiedTexts: {
        //             h5: "Company not found",
        //             p: "company id doesn't exist in the db, try to refresh. Or contact a the system maintainers"
        //         },
        //         specifiedEls: {
        //             icon: svgWrongIdBlockCmpny
        //         }
        //     }
        // }
    }).on('cshowStart', function () {   // you can set that by option (also you can write separatly the on InnerloPrototype function so you can add this to them (by option) so when those events are rewriting (depend on the option, the provided function will get those bellow action binded))
        document.body.style.overflow = 'hidden';
    }).on('chideStart', function () {
        setTimeout(() => {
            document.body.style.overflow = 'auto';
        }, 100);
    });
}

(function (p) {
    // extending Innnerlo prototype
    // console.log('exec innerlo alert prototype');
    for (let prop in Innerlo.prototype) {
        // console.log('prop = ', prop);
        if (typeof Innerlo.prototype[prop] === 'function') {
            // console.log('is a function');
            InnerloAlert.prototype[prop] = function () {
                if (this.innerloInst) {
                    this.innerloInst[prop].apply(this.innerloInst, arguments);
                } else {
                    Innerlo.prototype[prop].apply(this, arguments);
                }

                return this;
            }
            // console.log('InnerloAlert');
            // console.log(InnerloAlert.prototype);
        }
    }

    p.updateIcon = function (iconDOM) {
        clearDomNodeInner(this.innerloMessageEl_topIcon);
        this.innerloMessageEl_topIcon.appendChild(iconDOM);
        
        return this;
    }


    // add subAlterns (altern define the btns form)
    // subAlterns define in one type, different settings (events, and other things)

    // later maybe we detach and reatach btns containers
    p.setDialogBtns = function (altern, settings) {
        if (!this.btnsAlters) {
            this.btnsAlters = {};
        } 
        
        if (!this.activeBtnsAltern) {
            this.activeBtnsAltern = altern;
        }

        
        this.btnsAlters[altern] = {};
        let alt = this.btnsAlters[altern];

        if (!alt.dialogBtnsContainer) {
            alt.dialogBtnsContainer = document.createElement('div');
            alt.dialogBtnsContainer.className = 'innerlo_dialogBtnsContainer';
            alt.dialogBtnsContainer.style.display = 'none';
            this.innerloMessageEl.append(alt.dialogBtnsContainer);
        }

        let keys = Object.keys(settings);
        for (let i = 0; i < keys.length; i++){
            let btnName = keys[i]
            let btnSettings = settings[btnName];
            alt[btnName] = {};
            alt[btnName].settings = btnSettings;

            // you can associate a dom directly
            alt[btnName].dom = btnSettings.dom ? btnSettings.dom : document.createElement(btnSettings.domTag ? btnSettings.domTag : 'div');
            let d = alt[btnName].dom;
            d.className = 'innerlo_dialogBtn' + 
            btnSettings.className ? ' ' + btnSettings.className : '';
            if (btnSettings.innerHTML) {
                d.innerHTML = btnSettings.innerHTML;
            }

            alt[btnName].events = {}; // you could have used settings directly (maybe your need to remove setting copy (we will see))
            if (btnSettings.events) {
                alt[btnName].events = Object.assign(alt[btnName].events, btnSettings.events);
            }
            let ev = alt[btnName].events;
            alt[btnName].eventsHandler = {};

            if (btnName === 'cancel') {
                alt[btnName].prevendDefaultChide = false;
                console.log('cancel hura');
                alt[btnName].eventsHandler['click'] = function (evt) {
                    alt[btnName].prevendDefaultChide = false;

                    if (alt[btnName].events['click']) {
                        alt[btnName].events['click'].call(this, evt);
                    }

                    // alert('hi')
                    if (!alt[btnName].prevendDefaultChide) { // later think about binding this, to be an object that have a function that allow preventing default, plus an object that hold which button in the altern  // not needed it's just cancel
                        this.chide();
                    }
                }.bind(this);

                d.addEventListener('click', alt[btnName].eventsHandler['click']); // we will see if we will use events delegation


                let keys3 = Object.keys(ev)
                keys3.splice(keys3.indexOf('click'), 1);

                for (let i = 0; i < keys3.length; i++) {
                    let evName = keys3[i]
                    // let evHandler = ev[evName];

                    alt[btnName].eventsHandler[evName] = function (evt) {
                        if (alt[btnName].events[evName]) {
                            alt[btnName].events[evName].call(this, evt);
                        }
                    }.bind(this);

                    d.addEventListener(evName, alt[btnName].eventsHandler[evName]); // we will see if we will use events delegation
                    // remember when you want to overid an event unbind the old first
                }
            } else {
                let keys2 = Object.keys(ev)
          
                for (let i = 0; i < keys2.length; i++){
                    let evName = keys2[i]
                    // let evHandler = ev[evName];
        
                    alt[btnName].eventsHandler[evName] = function (evt) {
                        if (alt[btnName].events[evName]) {
                            alt[btnName].events[evName].call(this, evt);
                        }
                    }.bind(this);
                     
                    d.addEventListener(evName, alt[btnName].eventsHandler[evName]); // we will see if we will use events delegation
                    // remember when you want to overid an event unbind the old first
                }
            }


            alt.dialogBtnsContainer.append(d);// append btn dom
        }

        return this;
    }

    p.preventCancelBtnDefault = function () {
        this.btnsAlters[this.activeAltern].cancel.prevendDefaultChide = true;

        return this;
    }

    p.isBtnsAlternRendered = function (altern) {
        return this.btnsAlters[altern].dialogBtnsContainer.style.display !== 'none';
    }

    p.unrenderBtnsAltern = function (altern) {
        this.btnsAlters[altern].dialogBtnsContainer.style.display = 'none';

        return this;
    }

    p.renderBtnsAltern = function (altern) {
        if(!altern) {
            altern = this.altern;
        }
        
        this.btnsAlters[altern].dialogBtnsContainer.style.display = '';
        return this;
    }

    p.alternBtnsDialogs = function (altern, show) {
        if (this.activeAltern && this.isBtnsAlternRendered(this.activeAltern) && this.activeAltern !== altern) {
            this.unrenderBtnsAltern(this.activeAltern);
        } 

        this.activeAltern = altern;

        if (show === true) {
            this.renderBtnsAltern(altern);
        }

        return this;
    }

    p.updateBtnsText = function () {
        if (!this.activeAltern) {
            throw 'No active Altern is set!! You need to set one'
        }

        let updateBtnsObj;
        if (arguments === 2) {
            updateBtnsObj = {};
            updateBtnsObj[arguments[0]] = arguments[1];
        } else {
            updateBtnsObj = arguments[0];
        }

        let keys = Object.keys(updateBtnsObj);
        let alt;
        for (let i = 0; i < keys.length; i++){
            let btnName = keys[i]
            let text = updateBtnsObj[btnName];
            
            let alt = this.btnsAlters[this.activeAltern];
            if (alt.hasOwnProperty(btnName)) {
                alt.dom.innerHTML = text;
            } else {
                throw 'Wrong Btn name !!!'
            }
        }

        return this;
    }

    //update events handlers  

    //subalterns
})(InnerloAlert.prototype);



function InnerloAlertExtend() {

}












function execEvtHandler(evt) { // if you like to support multipe events handlers at same time (add remove ...) [array as no arary] ==> then you can develop this to support all of it
    if (this.events[evt] !== null) {
        console.log(arguments);
        this.events[evt].apply(this, Array.prototype.slice.call(arguments, 1));// the this in the callbacks will point ot innerlo instance
    }
}

function isDescendant(parent, child) {
     var node = child;
     while (node != null) {
         if (node === parent) {
             return true;
         }
         node = node.parentNode;
     }
     return false;
}

function addClass(DOMElement, classes) {
    if (classes) {
        if (typeof classes === 'string') {
            let decompClasses = classes.split(/\s+/);
            for (let i = 0; i < decompClasses.length; i++) {
                let oneClass = decompClasses[i];
                if (!hasClass(DOMElement, oneClass)) {
                    DOMElement.className += " " + oneClass;
                }
            }
        } else if (Object.prototype.toString.call(classes) === "[object Array]") {
            for (let i = 0; i < classes.length; i++) {
                let decompClasses = classes[i].split(/\s+/);
                for (let j = 0; j < decompClasses.length; j++) {
                    let oneClass = decompClasses[j];
                    if (!hasClass(DOMElement, oneClass)) {
                        DOMElement.className += " " + oneClass;
                    }
                }
            }
        }
        DOMElement.className = DOMElement.className.trim();
    }
}

function addClassToAll(DOMList, classes) {
    if (!Array.isArray(DOMList)) {
        addClass(DOMList, classes);
    } else {
        for (let i = 0; i < DOMList.length; i++) {
            addClass(DOMList[i], classes);
        }
    }
}

function removeClass(DOMElement, classes) {
    if (classes && typeof DOMElement.className === 'string') {
        let classesInDOMElement = DOMElement.className.split(/\s+/);
    
        if (typeof classes === 'string') {
            let classesSplit = classes.split(/\s+/);
            if (classesSplit.length > 1) {
                classes = classesSplit;
            }
        }
    
        removeElementFromArray_Mutate(classesInDOMElement, classes);
    
        DOMElement.className = classesInDOMElement.join(' ');
    }
}

function removeClassFromAll(DOMList, classes) {
    if (classes) {
        if (typeof DOMList.length != 'undefined') { // that way both domlist and array of domel will be treated by this condition
            for (let i = 0; i < DOMList.length; i++) {
                removeClass(DOMList[i], classes);
            }
        } else { // otherwise it's a domel
            removeClass(DOMList, classes);
        }
    }
}

function hasClass_ONEtest(DOMElement, classe) {
    if (typeof DOMElement.className === 'string') {
        let allClasses = DOMElement.className.split(/\s+/);
        for (let i = 0; i < allClasses.length; i++) {
            if (allClasses[i].trim() === classe) {
                return true;
            }
        }
    }
    return false;
}

function hasClass(DOMElement, classes) {
    if (classes) {
        if (typeof classes === 'string') {
            return hasClass_ONEtest(DOMElement, classes);
        } else { // multiple classes as array
            for (let i = 0; i < classes.length; i++) {
                if (!hasClass_ONEtest(DOMElement, classes[i])) {
                    return false;
                }
            }
            return true;
        }
    }
}

/**
 * 
 * @param {dome el to search the classes in } elementDOM 
 * @param {the classes to check against, string or array of classes (strings)} classes 
 * 
 * @return {bool} [true if has one of the provided classes, false otherwise]
 */
function hasOneOfClasses(elementDOM, classes) {
    if (typeof classes === "string") {
        return hasClass_ONEtest(elementDOM, classes);
    } else { // array
        for (let i = 0; i < classes.length; i++) {
            if (hasClass_ONEtest(elementDOM, classes[i])) return true;
        }
        return false;
    }
}

function toggleClass(DOMElement, classes) {
    if (typeof classes === 'string') {
        toggleClass_one(DOMElement, classes);
    } else { // multiple classes as array
        for (let i = 0; i < classes.length; i++) {
            toggleClass_one(DOMElement, classes[i]);
        }
        return true;
    }
}

function toggleClass_one(DOMElement, classe) {
    if (hasClass_ONEtest(DOMElement, classe)) {
        removeClass(DOMElement, classe);
    } else { // don't have it
        addClass(DOMElement, classe);
    }
}

function removeElementFromArray_Mutate(sourceArray, elementsToRemoveArray) {
    if (Object.prototype.toString.call(elementsToRemoveArray) === '[object Array]') {
        for (let i = 0; i < elementsToRemoveArray.length; i++) {
            for (let j = 0; j < sourceArray.length; j++) {
                if (elementsToRemoveArray[i] === sourceArray[j]) {
                    sourceArray.splice(j, 1);
                    j--; //important whne we splice we don't go to the next element the element come to us
                }
            }
        }
    } else { // if not array then a string or number, or object or function or anything else (to test on an array of functions)
        for (let i = 0; i < sourceArray.length; i++) {
            if (sourceArray[i] === elementsToRemoveArray) {
                sourceArray.splice(i, 1);
                i--; //when we splice the next element will come to that position. so we need not to move
            }
        }
    }
}







// remove dom elements functions


function removeDOMElement(element) {
    var parent = element.parentNode;
    if (parent) {
        parent.removeChild(element);
    }
}


// function clearDomNodeInner(DOM_Node) {
//     while (DOM_Node.firstChild) {
//         DOM_Node.removeChild(DOM_Node.firstChild);
//     }
// }

function clearDomNodeInner(DOM_Node) { // remove child  (remove the el and give us a ref, the element still live, if it's refrenced by something, and you can reinsert it (better performance))
    while (DOM_Node.lastChild) {
        DOM_Node.removeChild(DOM_Node.lastChild);
    }
}


export default Innerlo;