/**
 * Created by nazi on 2015.10.06..
 * version dev v0.2.3
 */

;
(function ($) {

    /*
     * Private methods
     */
    var arrow, arrowR, arrowL, $active_image = 0, settings, title, obj,
        switches, bullet, $this, autoPlay = false, thumbName, lastImageIndex,
        activeImageIndex, _options, parent, objectSize, listSlider, thumbOpit, listThumbOpit,

    /*thumChose = {
     _listSliderStep: function(index) {_listSliderStep(index);},
     _thumbStep: function(index) {_thumbStep(index);}
     },*/

        _setParams = function (_settings, _obj) {
            switches = _settings.switches;
            obj = _obj;
            settings = _settings.gallery;
            $this = obj.parent();
            lastImageIndex = obj.length - 1;
            objectSize = obj.size();
            activeImageIndex = defaults.gallery.activeImageIndex();

            obj.filter('.image').eq(activeImageIndex).addClass('active');
        },
        _start = function () {
            _galleryStart();

            for (var key in switches) {
                switch (key) {
                    case 'arrow':
                        if (switches.arrow) {
                            _addArrow(obj);
                        }
                        break;
                    case 'bullet':
                        if (switches.bullet) {
                            _addBullet(obj);
                            bullet = $this.find('.' + settings.bullet).children();
                        }
                        break;
                    case 'autoPlay':
                        if (switches.autoPlay) {
                            autoPlay = true;
                            setInterval(_autoPlay, settings.speed);
                        }
                        break;
                    case 'title':
                        if (switches.title && !switches.addListSlider) {
                            _addTitle();
                        }
                        break;
                    case 'player':
                        if (switches.player) {
                            _addPlayer();
                        }
                        break;
                    case 'thumbnail':
                        if (switches.thumbnail) {
                            _addThumbnail();
                            thumbName = "_thumbStep";
                        }
                        break;
                    case 'addVerticalThumbnail':
                        if (switches.addVerticalThumbnail) {
                            _addVerticalThumbnail();
                            thumbName = "_verticalThumbStep";
                        }
                        break;
                    case 'addListSlider':
                        if (switches.addListSlider) {
                            _addListSlider();
                            thumbName = "_listSliderStep";
                        }
                        break;
                    default:
                        //alert(key);
                        break;
                }
            }
        },
        _galleryStart = function () {
            var img = obj.eq(activeImageIndex).children().clone(),
                origImageSize, imageScale;

            $("<img>").attr("src", $(img).attr("src")).load(function () {
                console.log(this.width);
                origImageSize = {_width: this.width, _height: this.height};
                switch (thumbName) {
                    case '_thumbStep':
                        _heightOriginalSize();
                        break;
                    case '_listSliderStep':
                        _widthOriginalSize();
                        break;
                }
            });

            function _widthOriginalSize() {
                imageScale = origImageSize._width / origImageSize._height;

                obj.each(function (index) {
                    var _width = settings.galleryHeight * $(this).width() / $(this).height();
                    $(this).css({
                        height: settings.galleryHeight + 'px',
                        width: _round(_width) + 'px',
                        'z-index': 0
                    });

                    if (index == activeImageIndex) {
                        $('.gallery').css({
                            'height': settings.galleryHeight + 'px',
                            'width': _round(settings.galleryHeight * imageScale)
                        });
                    }
                });
            }

            function _heightOriginalSize() {
                imageScale = origImageSize._height / origImageSize._width;

                obj.each(function (index) {
                    var _height = settings.galleryWidth * $(this).height() / $(this).width();
                    $(this).css({
                        width: settings.galleryWidth + 'px',
                        height: _round(_height) + 'px',
                        'z-index': 0
                    });

                    if (index == activeImageIndex) {
                        $('.gallery').css({
                            'width': defaults.gallery.galleryWidth + 'px',
                            'height': _round(defaults.gallery.galleryWidth * imageScale)
                        });
                    }
                });
            }
        },
        _addTitle = function () {
            var title = obj.eq(activeImageIndex).attr('text'),
                verticalPos;

            switch (settings.title.verticalPos) {
                case 'top':
                    break;
                case 'bottom':
                    verticalPos = -154;
                    break;
            }
            switch (settings.title.position) {
                case 'outside':
                    $this.last().append('<div class="title outside"><p></p>' + title + '</div>');
                    break;
                case 'inside':
                    $this.last().append('<div class="title inside"><p></p>' + title + '</div>');
                    break;
                case 'over':
                    $this.last().append('<div class="title over"><p></p>' + title + '</div>');
                    break;
                default:
                    $this.last().append('<div class="title outside"><p></p>' + title + '</div>');
                    break;
            }
            $('.title').css({'width': $this.width(), transform: "translateY(" + verticalPos + "px)"});
        },
        _addImageNumber = function (_obj) {
            for (var i = 0; i <= objectSize; i++) {
                var number = i + 1;
                _obj.children().eq(i).find('div').children().first().before('<p class="imageNumber">' + number + '/' + objectSize + '</p>')
            }
        },
        _addArrow = function () {
            var arrowL = '<div class="arrow arrowL"><div class="arrowIsaideL">X</div></div>',
                arrowR = '<div class="arrow arrowR"><div class="arrowInsideR">X</div></div>';

            obj.last().after(arrowR, arrowL);
            arrow = {arrowR: $('.arrowR'), arrowL: $('.arrowL')};
            _arrowStep()
        },
        _arrowStep = function () {
            var y = (defaults.gallery.galleryHeight / 2 + arrow.arrowR.height() / 2 ) * -1,
                x = $this.width(),
                arrowL_y = y - arrow.arrowR.height(), arrowR_x,
                browserObjAgent = navigator.userAgent.toLowerCase();

            // console.log($('.gallery').get(0).scrollWidth);
            // console.log( $('.gallery'));

            if (browserObjAgent.indexOf("chrome") > -1) {
                arrowR_x = x - arrow.arrowR.width();
            } else if (browserObjAgent.indexOf('firefox') > -1) {
                arrowR_x = x;
            }
            arrow.arrowR.css({"transform": "translate3d(0," + arrowL_y + "px, 0)"});
            arrow.arrowL.css({"transform": "translate3d(0," + arrowL_y + "px, 0) rotate(180deg)"});
        },
        _step = function (index) {
            var arrowL = $this.find('.arrowL'),
                currentIndex = obj.filter('.active').index(),
                nextIndex = currentIndex + (1 * index),
                bulletIndex = (index == -1) ? -2 : 0;

            $('.gallery').width(obj.eq(nextIndex).width());

            _thumbnailSwitch(index);
            _arrowStep();

            obj.removeClass('active').addClass('inactive');
            $active_image = obj.eq(nextIndex).removeClass('inactive').addClass('active');

            bullet.filter('.bulletActive').switchClass('bulletActive', 'bulletInactive');
            bullet.eq(currentIndex + bulletIndex + (index * index)).removeClass('bulletInactive').addClass('bulletActive');

            if (switches.title) {
                $this.find('.' + settings.title.position + ' p').text($this.find('.active').attr('text'));
            }
            currentIndex = currentIndex + (1 * index);

            if ($active_image.length == 0) {
                $active_image = $this.find('div').first().removeClass('inactive').addClass('active');
                bullet.first().addClass('bulletInactive').addClass('bulletActive');
                if (switches.title) {
                    $this.find('.' + settings.title.position + ' p').text('').text($this.find('.active').attr('text'));
                }
                currentIndex = 0;
            }
        },
        _addBullet = function (obj) {
            var bullet = '<object class="' + settings.bullet + '"  >',
                className = null;

            for (var i = 1; i <= obj.length; i++) {
                (i - 1 == activeImageIndex) ? className = 'bulletActive' : className = 'bulletInactive';
                bullet += '<div class= "bullet ' + className + '" ><div class="inner"></div></div>';
            }

            bullet += '</object>';
            $this.append(bullet);
            var settingsBullet = $('.' + settings.bullet),
                bulletLeft = $this.width() / 2 - (settingsBullet.width()) / 2,
                bulletBottom = $this.height() * 0.1;
            settingsBullet.css({'left': bulletLeft, 'bottom': bulletBottom});
        },
        _autoPlay = function () {
            if (autoPlay) {
                var index = 0;
                _step(index + 1);
            }
        },
        _stop = function () {
            autoPlay = false;
        },
        _addPlayer = function () {
            var player = '<div class="player">' +
                '<div class="fa-step-forward arrowL"></div>' +
                '<div class="fa-pause inactive stop"></div>' +
                '<div class="fa-play active play"></div>' +
                '<div class="fa-step-backward arrowR"></div>' +
                '</div>';

            switch (settings.playerPosition.corner) {
                case 'bottom-right':
                    if (settings.playerPosition.position == 'inside') {
                        $this.children().last().after(player);
                        $this.find('.player').addClass('br_inside');
                    } else if (settings.playerPosition.position == 'over') {
                        $this.find('.title').append(player);
                        $this.find('.player').addClass('br_over');
                    }
                    break;
                case 'bottom-left':
                    if (settings.playerPosition.position == 'inside') {

                    } else if (settings.playerPosition.position == 'over') {
                        $this.find('.title').children().before(player);
                        $this.find('.title p').css('text-align', 'right');
                        $this.find('.player').addClass('bl_over');
                    }
                    break;
                case 'top-right':
                    if (settings.playerPosition.position == 'inside') {
                        $this.find('.image').first().before(player);
                        $this.find('.player').addClass('tr_inside');
                    } else if (settings.playerPosition.position == 'over') {
                        $this.find('.image').first().before(player);
                        $this.find('.player').addClass('tr_over');
                    }
                    break;
                case 'top-left':
                    if (settings.playerPosition.position == 'inside') {
                        $this.find('.image').first().before(player);
                        $this.find('.player').addClass('tl_inside');
                    } else if (settings.playerPosition.position == 'over') {
                        $this.find('.image').first().before(player);
                        $this.find('.player').addClass('tl_over');
                    }
                    break;
            }
        },
        _addThumbnail = function () {
            var sideThumb = '<div class="sideThumb" style="transform: translateY(-110px)">',
                thumbnailL = '<div class="thumbnail thumbL"></div>',
                thumbnailR = '<div class="thumbnail thumbR"></div>';
            $this.append(sideThumb + thumbnailL + '<div class="thumbParent" style="height: 102px; width: '+settings.galleryWidth+'px"></div>' + thumbnailR + '</div></div>');

            var thumbnailWidth = settings.thumb.width + settings.thumb.margin + settings.thumb.borderWidth / 2,
                maxThumb = _round(settings.galleryWidth / (thumbnailWidth)),
                displayThumbNumber = objectSize - maxThumb, //12-9 = 3
                thumb = $('.thumbParent'),
                active = 0,
                x,
                after = ((maxThumb - 1) / 2),
                before = ((maxThumb - 1) / 2),
                endToStart = 0,
                isOutside = (thumbnailWidth * maxThumb - settings.galleryWidth) / 2,
                addImage = function (i) {
                    $('.thumbParent').append(obj.eq(i).children().clone());
                },
                show = function(currentListSlider, x) {
                    currentListSlider.css({
                        transform: 'translateX(' + x + 'px)',
                        width: settings.thumb.width,
                        position: 'absolute'
                    });
                },
                display = function(currentListSlider) {
                    currentListSlider.css({display: 'none'});
                },
                middle = function() {
                    for (var i = 0; i < objectSize; i++) {
                        addImage(i);
                        var currentListSlider = thumb.children().eq(i);

                        if (i < activeImageIndex - before || i > activeImageIndex + after) {
                            display(currentListSlider);
                        } else if (i < activeImageIndex && i >= activeImageIndex - before) {
                            show(currentListSlider, active * thumbnailWidth - isOutside);
                            before--;
                            active++;
                        } else if (i == activeImageIndex) {
                            show(currentListSlider, settings.galleryWidth / 2 - settings.thumb.width / 2 - 2);
                            active++;
                        } else if (i > activeImageIndex && i < activeImageIndex + after + 1) {
                            show(currentListSlider, active * thumbnailWidth - isOutside);
                            active++;
                        }
                    }
            },
                endMoveStart = function() {
                    for (var i = 0; i < objectSize; i++) {
                        addImage(i);
                         currentListSlider = thumb.children().eq(i);

                        if (i <= activeImageIndex + before) {
                            x = ((active) * (thumbnailWidth) - isOutside) - (activeImageIndex - before) * thumbnailWidth;
                            show(currentListSlider, x);
                        }
                        else if (i > activeImageIndex + displayThumbNumber + before) {
                            x =  endToStart * thumbnailWidth - isOutside;
                            show(currentListSlider, endToStart * thumbnailWidth - isOutside);
                            endToStart++;
                        } else {
                            display(currentListSlider);
                        }
                        active++;
                    }
            },
                startMoveEnd = function () {
                    for (var i = 0; i < objectSize; i++) {
                        addImage(i);
                        var currentListSlider = thumb.children().eq(i);

                        if (i >= activeImageIndex - before && i < objectSize) {
                            show(currentListSlider, active * thumbnailWidth - isOutside);
                            active++;
                        } else if (i < activeImageIndex - before - displayThumbNumber) {
                            x = (objectSize - 1 - activeImageIndex + before + 1 + endToStart) * thumbnailWidth - ( (isOutside));
                            show(currentListSlider, x);
                            endToStart++;
                        }
                        else {
                            display(currentListSlider);
                        }
                    }
            };

            thumbOpit = { maxThumb: maxThumb, fullThumbWidth: thumbnailWidth, isOutside: isOutside, displayThumbNumber: displayThumbNumber };
            if ( activeImageIndex - before >= 0 && (activeImageIndex + after) < objectSize-1 ) {
                console.log('könzbenső');
                middle();
                _endIntoStart(thumb);
            }
            else if (activeImageIndex-before < 0) {
                console.log('hátulról előre');
                endMoveStart();
                _startIntoEnd(thumb);
            }
            else if(activeImageIndex + after >= maxThumb) {
                console.log('előről hátra');
                startMoveEnd();
                _startIntoEnd(thumb);
            }

            $('.thumbnail').css({height: $('.thumb').first().height()});

        },
        _addVerticalThumbnail = function () {
            var verticalThumbStart = '<div class="verticalThumb">',
                n = 0,
            //páros
                isEven = function (value) {
                    if (value % 2 == 0) {
                        return true;
                    } else {
                        return false;
                    }
                };

            obj.parent().before(verticalThumbStart);
            var verticalThumb = $('.verticalThumb');

            obj.each(function (index) {
                var imageSrc = obj.eq(index).children().attr('src'),
                    image = '<div class="thumbHoriz" style="background-image:url(' + imageSrc + ')"></div>',
                    style = n * (100) + n * 10 + 'px';
                if (isEven(index)) {
                    verticalThumb.append('<div>');
                    verticalThumb.children().eq(n).append('<div class="thumbBackground" style="left: 170px; top:' + style + '"></div>' + image);
                    verticalThumb.children().eq(n).children().eq(1).append('<div  class="levels"></div>');
                } else {
                    verticalThumb.children().eq(n).append('<div class="thumbBackground" style="top:' + style + '"></div>' + image);
                    verticalThumb.children().eq(n).children().eq(3).append('<div class="levels"></div>')
                    verticalThumb.append('</div>');
                    n++;
                }
            });

            var activeIndex = obj.filter('.active').index(),
                thumbIndex = _round(activeIndex / 2);

            if (isEven(activeIndex)) {
                verticalThumb.children().eq(thumbIndex).children('div').eq(1).children().addClass('icon-plus1 fa-2x');
                verticalThumb.children().eq(thumbIndex).children('div').eq(2).addClass('ThumbActive');

            } else {
                verticalThumb.children().eq(thumbIndex - 1).children('div').eq(3).children().addClass('icon-plus1 fa-2x');
                verticalThumb.children().eq(thumbIndex - 1).children('div').eq(1).addClass('ThumbActive');
            }
        },
        _thumbnailSwitch = function (index) {
            var move, i, next, hidden, show, thumb, currentIndex;
            switch (thumbName) {
                case '_thumbStep':
                    thumb = $('.thumbParent');
                    next = function (index, thumb) {
                        if(index == 1) {
                            for(i = thumbOpit.displayThumbNumber+1; i < objectSize; i++) {
                                step(thumb, i, index);
                            }
                        } else if(index == -1) {
                            for(i = objectSize-1; i > (objectSize-thumbOpit.maxThumb-1); i--) {
                                step(thumb, i, index);
                            }
                        }
                        function step(thumb, i, index) {
                            currentIndex = parseInt(thumb.children().eq(i).css('transform').split(',')[4]);
                            move = currentIndex + (thumbOpit.fullThumbWidth) * (index*-1);
                            thumb.children().eq(i).css({transform: 'translateX(' + move  + 'px)', width: settings.thumb.width});
                        }
                    };
                    hidden = function (thumb, hidden_i) {
                        thumb.children().eq(hidden_i).css({'display': 'none', transform: ''});
                    };
                    show = function (index, thumb, show_i) {
                        var show;
                        if(index == 1) {
                            show = thumb.children().first().clone();
                            thumb.children().last().after(show);
                            thumb.children().first().remove();
                        } else if(index == -1) {
                            show = thumb.children().last().clone();
                            thumb.children().first().before(show);
                            thumb.children().last().remove();
                        }
                        move  = (show_i.move) * thumbOpit.fullThumbWidth - thumbOpit.isOutside;
                        thumb.children().eq(show_i.index).css({
                            display: 'block',
                            transform: 'translateX('+ move + 'px)', width: settings.thumb.width, position: 'absolute'
                        });
                    };
                    _thumbnailStep(index, thumb, next, show, hidden);
                    break;
                case '_listSliderStep':
                    thumb = $('.listSlider');
                    thumbOpit = listThumbOpit;
                    next = function (index, thumb) {
                        if(index == 1) {
                            for(i = listThumbOpit.displayThumbNumber; i < (objectSize); i++) {
                                step(thumb, i, index);
                            }
                        } else if(index == -1) {
                            for(i = (objectSize-2); i > (objectSize-thumbOpit.maxThumb-1); i--) {
                                step(thumb, i, index);
                            }
                        }
                        function step(thumb, i, index) {
                            currentIndex = parseInt(thumb.children().eq(i).css('transform').split(',')[5]);
                            move = (currentIndex - (100 * index) - 5 * index);
                            thumb.children().eq(i).css({transform: "translate3d(5px," + move  + "px, 0)"});
                        }
                    };
                    show = function (index, thumb, show_i) {
                        var show;
                        if (index == 1) {
                            move = ((thumbOpit.maxThumb - 1) * 100) + thumbOpit.maxThumb * 5;
                            show = thumb.children().first().clone();
                            thumb.children().last().after(show);
                            thumb.children().first().remove();
                        }
                        else if (index == -1) {
                            move = 5;
                            show = thumb.children().last().clone();
                            thumb.children().first().before(show);
                            thumb.children().last().remove();
                        }
                        thumb.children().eq(show_i.index).css({
                            'display': 'block',
                            'transform': "translate3d(5px, " + move + "px, 0)"
                        });
                    };
                    hidden = function (thumb, hidden_i) {
                        thumb.children().eq(hidden_i).css({display: 'none', transform: ''}).attr('data-sort', 'null');
                    };
                    _thumbnailStep(index, thumb, next, show, hidden);
                    break;
                case '_verticalThumbStep':
                    _verticalThumbStep(index);
                    break;
                default:
                    break;
            }
        },
        _thumbnailStep = function (index, thumb, next, show, hidden) {
            var hidden_i, show_i;

            if (index == 1) {
                hidden_i = thumbOpit.displayThumbNumber;
                show_i  = {index: objectSize-1, move: thumbOpit.maxThumb- 1};

                hidden(thumb, hidden_i);
                next(index, thumb);
                show(index, thumb, show_i);
            }
            else if (index == -1) {
                hidden_i = objectSize-1;
                show_i = {index: thumbOpit.displayThumbNumber, move: 0 };

                hidden(thumb, hidden_i);
                next(index, thumb);
                show(index, thumb, show_i);
            }
        },
        _verticalThumbStep = function (index) {
            var thumbActive = $('.ThumbActive'),
                parent = thumbActive.parent(),
                selfIndex = thumbActive.index(),
                thumbHoriz = $('.thumbHoriz'),
                verticalThumb = $('.verticalThumb'),
                parentIndex = '';

            if (selfIndex == 2) {
                if (parent.index() + (1 * index) < -1) {
                    parentIndex = verticalThumb.children().length - 1;
                } else if (index == -1) {
                    parentIndex = parent.index() - 1;
                } else {
                    parentIndex = parent.index();
                }

                thumbActive.switchClass('ThumbActive', '');
                parent.children().eq(1).children().attr('class', '');

                verticalThumb.children().eq(parentIndex).children().eq(0).addClass('ThumbActive');
                verticalThumb.children().eq(parentIndex).children().eq(3).children().addClass('levels icon-plus1 fa-2x');
            } else {
                //alert(verticalThumb.children().length);
                if (verticalThumb.children().length <= parent.index() + (1 * index)) {
                    parentIndex = 0;
                } else if (index == -1) {
                    parentIndex = parent.index();
                } else {
                    parentIndex = parent.index() + (1 * index);
                }
                thumbActive.switchClass('ThumbActive', '');
                parent.children().eq(3).children().attr('class', '');

                verticalThumb.children().eq(parentIndex).children().eq(2).addClass('ThumbActive');
                verticalThumb.children().eq(parentIndex).children().eq(1).children().addClass('levels icon-plus1 fa-2x');
            }

        },
        _addListSlider = function () {
            $this.before('<div class="listSlider" style="height:' + defaults.gallery.galleryHeight + 'px"></div>');
            listSlider = $('.listSlider');

            var thumbnailHeight = 100, // 100
                sliderHeight = defaults.gallery.galleryHeight, // 684
                maxThumb = _round(sliderHeight / thumbnailHeight, 0, 'ROUND_DOWN'), // 7
                margin = 5,
                displayThumbNumber = objectSize - maxThumb, // 5
                afterActive = maxThumb, // 7
                active = 0,
                before = objectSize - activeImageIndex,
                addImage = function (i) {
                    var image = obj.children().eq(i).clone(),
                    //   imageNumber = obj.eq(i).find('.imageNumber').clone(),
                        text = obj.eq(i).attr('text'),
                        title = obj.eq(i).attr('_title');

                    listSlider.append('<div></div>');
                    listSlider.children().eq(i).append(image);
                    listSlider.children().eq(i).append('<div class="description"><p class="listSliderText">' + text + '</p></div>');

                    if (title !== undefined) {
                        listSlider.children().eq(i).children('.description').before('<h3 class="title">' + title + '</h3>');
                    }
                };
            listThumbOpit = {displayThumbNumber: displayThumbNumber, maxThumb: maxThumb};

            for (var i = 0; i < objectSize; i++) {
                addImage(i);
                var currentListSlider = listSlider.children().eq(i);

                if (i < activeImageIndex) {
                    if (i <= activeImageIndex - displayThumbNumber - 1) {
                        var y = before * 100 + before * margin + 5;
                        currentListSlider.css("transform", "translate3d(5px, " + y + "px, 0)");
                        afterActive--;
                        before++;
                    }
                    else {
                        currentListSlider.css({'display': 'none'});
                    }
                }
                else if (i == activeImageIndex) {
                    currentListSlider.css("transform", "translate3d(5px, 5px, 0)");
                    active++;
                }
                else if (i > activeImageIndex) {
                    y = (active + 1) * margin + (active) * 100;
                    if (afterActive > 0 && active < maxThumb) {
                        currentListSlider.css("transform", "translate3d(5px,+" + y + "px, 0)").attr('data-sort', y);
                        afterActive--;
                        active++;
                    }
                    else {
                        currentListSlider.css({'display': 'none'}).attr('data-sort', 'null');
                    }
                }
            }
            _addImageNumber(listSlider);
            _startIntoEnd(listSlider);

        },
        _listSliderClickStep = function (clickedObj) {
            var step = _round(clickedObj.attr('data-sort') / 100, 0, 'ROUND_DOWN');

            if (step !== 0) {
                for (var n = 0; n < step; n++) {
                    _step(1);
                }
            }
        },
        _startIntoEnd = function(thumb) {
            if(thumb.children().first().is(':visible')) {
                var move = thumb.children().first().clone();
                thumb.children().first().remove();
                thumb.children().last().after(move);
            _startIntoEnd(thumb);
            }
        },
        _endIntoStart = function(thumb) {
            if(thumb.children().last().is(':hidden')) {
                var move = thumb.children().last().clone();
                thumb.children().last().remove();
                thumb.children().first().before(move);
            _endIntoStart(thumb);
            }
        },
        _round = function (value, precision, mode) {

            var m, f, isHalf, sgn; // helper variables
            // making sure precision is integer
            precision |= 0;
            m = Math.pow(10, precision);
            value *= m;
            // sign of the number
            sgn = (value > 0) | -(value < 0);
            isHalf = value % 1 === 0.5 * sgn;
            f = Math.floor(value);

            if (isHalf) {
                switch (mode) {
                    case 'PHP_ROUND_HALF_DOWN':
                        // rounds .5 toward zero
                        value = f + (sgn < 0);
                        break;
                    case 'PHP_ROUND_HALF_EVEN':
                        // rouds .5 towards the next even integer
                        value = f + (f % 2 * sgn);
                        break;
                    case 'PHP_ROUND_HALF_ODD':
                        // rounds .5 towards the next odd integer
                        value = f + !(f % 2);
                        break;
                    default:
                        // rounds .5 away from zero
                        value = f + (sgn > 0);
                }
            }
            switch (mode) {
                case 'floor':
                    return f;
                    break;
            }
            return (isHalf ? value : Math.round(value)) / m;
        };

    /*
     * Public methods
     */

    $.fn.banana = function (options) {
        var obj = $(this).children().filter('.image');

        _options = options;

        _create_deBug(_options, attrParams);
        _setParams($.extend(true, defaults, _options), obj);

        _start();

        $('.bullet').click(function () {
            var bulletCilckNum = ( $(this).index());
            if (bulletCilckNum > activeImageIndex) {
                _step(1);
            } else {
                _step(-1);
            }
        });

        arrow.arrowL.click(function () {
            _step(-1);
        });

        arrow.arrowR.click(function () {
            _step(1);
        });

        $('.stop').click(function () {
            $(this).switchClass('active', 'inactive');
            $('.play').switchClass('inactive', 'active');
            _stop();
        });

        $('.play').click(function () {
            autoPlay = true;
            _step(+1);
            setInterval(_autoPlay, settings.speed);
            $(this).switchClass('active', 'inactive');
            $('.stop').switchClass('inactive', 'active');
        });
        $('.listSlider').children().click(function () {
            _listSliderClickStep($(this));
        });
    };

    var defaults = {
            gallery: {
                 activeImageIndex: function() {
                    //return  Math.floor((Math.random() * (objectSize-1)) +1);
                     return 8;
                 },
               // activeImageIndex: 4,
                galleryHeight: 650,
                galleryWidth: 1024,
                speed: 3000,
                bullet: 'bullet_1',
                thumb: {
                    width: 150,
                    margin: 5,
                    borderWidth: 2
                },
                title: {
                    position: 'inside',
                    verticalPos: 'bottom'
                },
                playerPosition: {
                    position: 'over',
                    corner: 'bottom-right'
                }
            },
            switches: {
                imageNumber: true,
                title: true,
                bullet: true,
                autoPlay: false,
                player: true,
                arrow: true,
                thumbnail: false,
                addVerticalThumbnail: false,
                addListSlider: true
            }
        },
        functionParamList = {
            gallery: ['speed', 'bullet', 'title', 'player', 'autoPlay', 'imageNumber', 'playerPosition'],
            listSlider: [self.gallery, 'listSlider'],
            verticalThumb: [self.gallery, 'verticalThumb'],
            horizontalThumb: [self.gallery, 'thumb']
        },
        attrParams = {
            gallery: {
                activeImageIndex: 10000,
                title: {
                    position: ['inside', 'outside', 'over']
                },
                playerPosition: {
                    position: ['over', 'over', 'outside'],
                    corner: ['bottom-right', 'bottom-right', 'bottom-left', 'top-left', 'top-right']
                },
                speed: {
                    minimum: 500,
                    maximum: 1000 * 60 * 30 //1.800.000 = 30 min
                },
                bullet: ['bullet_1']
            },
            switches: {
                imageNumber: 'bolean',
                title: 'bolean',
                bullet: 'bolean',
                autoPlay: 'bolean',
                player: 'bolean',
                arrow: 'bolean',
                thumbnail: 'bolean',
                addVerticalThumbnail: 'bolean',
                addListSlider: 'bolean'
            }
        },
        _create_deBug = function (opitions, attrParams) {
            $.each(opitions, function (key, value) {
                if (typeof value == "object") {
                    if (key in attrParams) {
                        parent = key;
                        _create_deBug(value, attrParams[key]);
                    }
                } else {
                    if (key in attrParams) {
                        if (parent == 'switches') {
                            if (!_boleanCheck(value)) {
                                _options.switches[key] = defaults.switches[key];
                            }
                        }
                        else if (key == 'speed') {
                            if (!_minMaxChek(value, attrParams[key])) {
                                _options.gallery[key] = defaults.gallery[key];
                            }
                        }
                        else if (!_check(value, attrParams[key])) {
                            _options.gallery[parent][key] = defaults.gallery[parent][key];
                        }
                    }
                }
            });

            function _check(value, attParam) {
                return ($.inArray(value, attParam) >= 0 || value == attParam ) ? true : false;
            }

            function _minMaxChek(value, attParam) {
                return (attParam.minimum < value && attParam.maximum > value ) ? true : false;
            }

            function _boleanCheck(value) {
                if (value == 0 || value == 1 || value == true || value == false || value == '0' || value == '1') {
                    return true;
                }
            }
        };
})(jQuery);
