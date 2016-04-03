/**
 * Created by nazi on 2015.10.06..
 * version dev v0.2.4
 */

;
(function ($) {

    /*
     * Private methods
     */
    var $active_image = 0, settings, obj, $this, thumbName, activeImageIndex, parent,
        objectSize, listSlider, thumbOpit, listThumbOpit, control, objSize = {},

        _setParams = function (_settings, _obj) {
            control = _settings.control;
            obj = _obj;
            settings = _settings.gallery;
            thumbName = _settings.gallery.thumbName;
            $this = obj.parent();
            objectSize = obj.size();
            activeImageIndex = _settings.gallery.activeImageIndex();

            obj.filter('.image').eq(activeImageIndex).addClass('active');
        },
        _start = function () {
            _galleryStart();

                switch (thumbName) {
                    case 'thumbnail':
                        _addThumbnail();
                        break;
                    case 'addVerticalThumbnail':
                        _addVerticalThumbnail();
                        break;
                    case '_listSlider':
                        _addListSlider();
                        break;
                    case '_fullWidthSlider':
                        _fullWidthSlider(activeImageIndex);
                        break;
                    default:
                        _addThumbnail();
                        break;
                }

            for (var key in control) {
                switch (key) {
                    case 'arrow':
                        if (control.arrow) {
                            _addArrow(obj);
                        }
                        break;
                    case 'bullet':
                        if (control.bullet) {
                            _addBullet(obj);
                            bullet = $this.find('.' + settings.bullet).children();
                        }
                        break;
                    case 'autoPlay':
                        if (control.autoPlay) {
                            console.log(control.autoPlay);
                            objSize.autoPlay = true;
                            setInterval(_autoPlay, settings.speed);
                        }
                        break;
                    case 'title':
                        if (control.title) {
                            _addTitle();
                        }
                        break;
                    case 'player':
                        if (control.player) {
                            _addPlayer();
                        }
                        break;
                }
            }
        },
        _galleryStart = function() {
            var origImageSize, imageScale;

            switch (thumbName) {
                case '_fullWidthSlider':
                    objSize.width = $(document).width();
                    objSize.height = settings.fullWidthSlider.height;
                    _fullWidthSize();
                    break;
                case '_thumbStep':
                    _heightOriginalSize();
                    break;
                case '_listSlider':
                    var img = obj.eq(activeImageIndex).children().clone();
                    loadImg(img);
                    objSize.width = settings.galleryWidth;
                    objSize.height = settings.galleryHeight;
                    _widthOriginalSize();
                    break;
            }

            function loadImg(img) {
              //  $("<img>").attr("src", $(img).attr("src")).load(function () {
                    origImageSize = {width: img.get(0).width, height: img.get(0).height};
                    _widthOriginalSize();
              //  });
            }

            function _fullWidthSize() {
                switch(settings.fullWidthSlider.width) {
                    case 'window':
                        $this.width(objSize.width).height(settings.fullWidthSlider.height);
                        $this.parent().css({'justify-content': '', display: 'block', width: '' });
                    break;
                    case 'gallery':
                        $this.css({width: settings.galleryWidth, height: settings.fullWidthSlider.height });
                    break;
                }
            }

            function _widthOriginalSize() {
                imageScale = origImageSize.width / origImageSize.height;

                obj.each(function (index) {
                    var _width = settings.galleryHeight * ($(this).width() / $(this).height());
                    $(this).css({
                        height: settings.galleryHeight + 'px',
                        width: _round(_width) + 'px',
                        'z-index': 0
                    });
                  $('.gallery').children().eq(index).children().css({height: settings.galleryHeight + 'px' });

                    if (index == activeImageIndex) {
                        $this.css({
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
                        $this.css({
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
                    verticalPos = 0;
                    break;
            }
            switch (settings.title.position) {
                case 'outside':
                    $this.last().append('<div class="title outside"><p class="titleText">' + title + '<div class="titleBac"></div></p></div>');
                    break;
                case 'inside':
                    $this.last().append('<div class="title inside"><p class="titleText">' + title + '<div class="titleBac"></div></p></div>');
                    break;
                case 'over':
                    $this.last().append('<div class="title over"><p class="titleText">' + title + '<div class="titleBac"></div></p></div>');
                    break;
                default:
                    $this.last().append('<div class="title outside"><p class="titleText">' + title + '<dic class="titleBac"></dic></p></div>');
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
            var arrow = {arrowR: $('.arrowR'), arrowL: $('.arrowL')};
            _arrowStep(arrow)
        },
        _arrowStep = function (arrow) {
            var y = (objSize.height / 2 ) * -1,
                x = $this.get(0).clientWidth - arrow.arrowR.width();

            arrow.arrowR.css({"transform": "translate3d("+x+"px," + y + "px, 0)"});
            arrow.arrowL.css({"transform": "translate3d(0," + y + "px, 0) rotate(180deg)"});
        },
        _step = function (index) {
            var arrow = {arrowR:$this.find('.arrowR'), arrowL:$this.find('.arrowL')},
                currentIndex = obj.filter('.active').index(),
                nextIndex = currentIndex + (1 * index),
                bulletIndex = (index == -1) ? -2 : 0;

            objSize.fullWidthCounter = 0;

            if(thumbName == '_fullWidthSlider' && objSize.fullWidthCounter < objectSize) {
                _thumbnailSwitch(index, nextIndex);
                objSize.fullWidthCounter++;
            } else {
                _thumbnailSwitch(index, nextIndex);
            }

            _arrowStep(arrow);

            obj.removeClass('active').addClass('inactive');

            //$active_image = obj.eq(nextIndex).removeClass('inactive').addClass('active');

            obj.eq(nextIndex-1).animate({
                opacity: 0
            });
            obj.eq(nextIndex).animate({
                opacity: 1
            })

            bullet.filter('.bulletActive').switchClass('bulletActive', 'bulletInactive');
            bullet.eq(currentIndex + bulletIndex + (index * index)).removeClass('bulletInactive').addClass('bulletActive');

            if (control.title) {
                $this.find('.' + settings.title.position + ' p').text($this.find('.active').attr('text'));
            }
            currentIndex = currentIndex + (1 * index);

            if ($active_image.length == 0) {
                $active_image = $this.find('div').first().removeClass('inactive').addClass('active');
                bullet.first().addClass('bulletInactive').addClass('bulletActive');
                if (control.title) {
                    $this.find('.' + settings.title.position + ' p').text('').text($this.find('.active').attr('text'));
                }
                currentIndex = 0;
            }
        },
        _addBullet = function() {
            var bullet = '<div class="' + settings.bullet + '"  >',
                className = null;

            for (var i = 1; i <= objectSize; i++) {
                (i - 1 == activeImageIndex) ? className = 'bulletActive' : className = 'bulletInactive';
                bullet += '<div class= "bullet ' + className + '" ><div class="inner"></div></div>';
            }

            bullet += '</div>';
            $this.append(bullet);
            var settingsBullet = $('.' + settings.bullet),
                bulletLeft = objSize.width / 2 - (settingsBullet.width()) / 2,
                bulletBottom = ($this.height() * 0.15) * -1;
            settingsBullet.css({transform: 'translate3d('+bulletLeft+'px, '+bulletBottom+'px, 0)'});
        },
        _autoPlay = function() {
            if (objSize.autoPlay) {
                var index = 0;
                _step(index + 1);
            }
        },
        _stop = function () {
            objSize.autoPlay = false;
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
                //console.log('könzbenső');
                middle();
                _endIntoStart(thumb);
            }
            else if (activeImageIndex-before < 0) {
                //console.log('hátulról előre');
                endMoveStart();
                _startIntoEnd(thumb);
            }
            else if(activeImageIndex + after >= maxThumb) {
                //console.log('előről hátra');
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
        _thumbnailSwitch = function (index, nextIndex) {
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
                case '_listSlider':
                    thumb = $('.listSlider');
                    thumbOpit = listThumbOpit;
                    next = function (index, thumb) {
                        var promise,
                            direction = index,
                            firstThumb;

                        firstThumb = (index == 1) ? (objectSize-thumbOpit.maxThumb-1): (objectSize-thumbOpit.maxThumb-1);
                        promise = thumb.children().eq(firstThumb).nextAll().each(function (index) {
                            step(thumb, index+objectSize-thumbOpit.maxThumb, direction);
                        }).promise();

                        function step(thumb, i, index) {
                            currentIndex = parseInt(thumb.children().eq(i).css('transform').split(',')[5]);
                            move = (currentIndex - (100 * index) - 5 * index);
                           return  thumb.children().eq(i).animate({
                                transform: 'translate(5px, '+move+'px)'
                            }, 500);
                        }

                        return promise;
                    };
                    show = function (index, thumb, show_i) {
                        if (index == 1) {
                            move = ((thumbOpit.maxThumb - 1) * 100) + thumbOpit.maxThumb * 5;
                            show = thumb.children().first().clone();
                            thumb.children().last().after(show);
                            thumb.children().first().remove();
                            thumb.children().eq(objectSize - listThumbOpit.displayThumbNumber-1).css({transform: ''});
                            return local_animate();
                        }
                        else if (index == -1) {
                            move = 5;
                            show = thumb.children().last().clone();
                            thumb.children().first().before(show);
                            thumb.children().last().remove();
                            thumb.children().first().css({transform: ''});
                            return local_animate();
                        }

                        function local_animate() {
                             thumb.children().eq(show_i.index).css({
                                transform: "translate(5px, " + move + "px)"
                            });
                        return thumb.children().eq(show_i.index)
                            .animate({
                              opacity: 1
                            }).fadeIn(500).promise();
                        }
                    };
                    hidden = function (thumb, hidden_i) {
                        return thumb.children().eq(hidden_i)
                            .animate({
                                opacity: 0
                            }, 500).promise();
                    };

                    _thumbnailStep(index, thumb, next, show, hidden);
                    break;
                case '_verticalThumbStep':
                    _verticalThumbStep(index);
                    break;
                case '_fullWidthSlider':
                    _fullWidthSlider(nextIndex);
                    break;
                default:
                    break;
            }
        },
        _thumbnailStep = function (index, thumb, next, show, hidden) {
            var hidden_i, show_i;

            if (index == 1) {
                hidden_i = listThumbOpit.displayThumbNumber;
                show_i  = {index: objectSize-1, move: listThumbOpit.maxThumb - 1};
            }
            else if (index == -1) {
                hidden_i = objectSize-1;
                show_i = {index: listThumbOpit.displayThumbNumber, move: 0 };
            }

            $.when(hidden(thumb, hidden_i))
                .then(function() {
                   return next(index, thumb)})
                .then(function() {
                    show(index, thumb, show_i)})
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
                maxThumb = _round(sliderHeight / thumbnailHeight, 0, 'PHP_ROUND_HALF_DOWN'), // 7
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

                    listSlider.append('<div class="listThumb">');
                    listSlider.children().eq(i).append(image.css({height: 53+'px'}));
                    listSlider.children().eq(i).append('<div class="description"><p class="listSliderText">' + text + '</p></div>');

                    if (title !== undefined) {
                        listSlider.children().eq(i).children('.description').before('<h3 class="title">' + title + '</h3>');
                    }
                };
            listThumbOpit =  {displayThumbNumber: displayThumbNumber, maxThumb: maxThumb};

            for (var i = 0; i < objectSize; i++) {
                addImage(i);
                var currentListSlider = listSlider.children().eq(i);

                if (i < activeImageIndex) {
                    if (i <= activeImageIndex - displayThumbNumber - 1) {
                        var y = before * 100 + before * margin + 5;
                        currentListSlider.css("transform", "translate(5px, " + y + "px)");
                        afterActive--;
                        before++;
                    }
                    else {
                        currentListSlider.hide();
                    }
                }
                else if (i == activeImageIndex) {
                    currentListSlider.css("transform", "translate(5px, 5px)");
                    active++;
                }
                else if (i > activeImageIndex) {
                    y = (active + 1) * margin + (active) * 100;
                    if (afterActive > 0 && active < maxThumb) {
                        currentListSlider.css("transform", "translate(5px,+" + y + "px)");
                        afterActive--;
                        active++;
                    }
                    else {
                        currentListSlider.hide();
                    }
                }
            }
            _addImageNumber(listSlider);
            _endIntoStart(listSlider);

        },
        _listSliderClickStep = function (clickedObj) {
            var step = clickedObj.index()-listThumbOpit.displayThumbNumber;

            if (step !== 0) {
                for (var n = 0; n < step; n++) {
                    _step(1);
                }
            }
        },
        _startIntoEnd = function(thumb, param) {
            param = ':visible';

            if(thumb.children().first().is(':visible')) {
                thumb.children().first().prependTo(thumb.children().last());
            _startIntoEnd(thumb);
            }
        },
        _endIntoStart = function(thumb) {
            if(thumb.children().last().is(':hidden')) {
                 thumb.children().last().prependTo($('.listSlider'));
            _endIntoStart(thumb);
            }
        },
        _fullWidthSlider = function(index) {
               if(settings.fullWidthSlider.width == 'window') {
                   var src = obj.eq(index).children().attr('src'),
                       width =  $(document).width();
                   _resize(src, index, width);
                   $this.prependTo('body');
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
        },
        _resize = function (src, i, width) {
            var img, mainCanvas, origImg = {};

            startResize(src);

            function startResize(src) {
                $.when(
                    createImage(src)
                ).then(resize, function () {console.log('error')});
            }

            function createImage(src) {
                var deferred = $.Deferred();

                img = new Image();

                img.onload = function() {
                    deferred.resolve(img);
                };
                img.src = src;
                return deferred.promise();
            }

            function resize(image) {
                mainCanvas = document.createElement("canvas");
                mainCanvas.width = width;
                mainCanvas.height = 300;
                origImg._width = obj.eq(i).children().width();
                origImg._height = obj.eq(i).children().height();

                var ctx = mainCanvas.getContext("2d");
                ctx.drawImage(image, 0, 0, origImg._width, origImg._height, 0, 0, mainCanvas.width, mainCanvas.height);

                obj.eq(i).children().attr('src', mainCanvas.toDataURL("image/jpeg"));
            }

            function sizeDeBug(i, size) {

            }
        },
        _gallerySort = function() {
            _startIntoEnd($this.children(), ':hidden')
        };


    /*
     * Public methods
     */

    $.fn.banana = function (options) {
        var obj = $(this).children().filter('.image'),
            _opitions = options,
            deBug;

        _createControl(_opitions);
         deBug =  $.extend(true, defaults, _opitions );
        _create_deBug(deBug, attrParams);
        _setParams($.extend(true, defaults, deBug), obj);

        _start();

        $('.bullet').click(function () {
            var bulletCilckNum = ( $(this).index());
            if (bulletCilckNum > activeImageIndex) {
                _step(1);
            } else {
                _step(-1);
            }
        });

        $('.arrowL').stop().click(function () {
            _step(-1);
        });

        $('.arrowR').stop().click(function () {
            _step(1);
        });

        $('.stop').click(function () {
            $(this).switchClass('active', 'inactive');
            $('.play').switchClass('inactive', 'active');
            _stop();
        });

        $('.play').click(function () {
            objSize.autoPlay = true;
            _step(+1);
            setInterval(_autoPlay, settings.speed);
            $(this).switchClass('active', 'inactive');
            $('.stop').switchClass('inactive', 'active');
        });
        $('.listSlider').on('click', '.listThumb',function() {
            _listSliderClickStep($(this));
        });
    };

    var defaults = {
            gallery: {
                thumbName: '_listSlider',
                 activeImageIndex: function() {
                    //return  Math.floor((Math.random() * (objectSize-1)) +1);
                     return 4;
                 },
               // activeImageIndex: 4,
                galleryHeight: 650,
                galleryWidth: 1024,
                speed: 500,
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
                },
                fullWidthSlider: {
                    height: 300,
                    before: true,
                    after: false,
                    width: 'window'
                }
            },
            control:{}
        },
        functionParamList = {
            gallery: ['speed', 'bullet', 'title', 'player', 'autoPlay', 'imageNumber', 'playerPosition'],
            _listSlider: ['arrow', 'bullet', 'autoPlay', 'imageNumber',],
            _verticalThumb: [self.gallery, 'verticalThumb'],
            _horizontalThumb: [self.gallery, 'thumb'],
            _fullWidthSlider: ['bullet', 'arrow', 'autoPlay']
        },
        attrParams = {
            gallery: {
                activeImageIndex: 1,
                title: {
                    position: ['inside', 'outside', 'over']
                },
                playerPosition: {
                    position: ['over', 'over', 'outside'],
                    corner: ['bottom-right', 'bottom-right', 'bottom-left', 'top-left', 'top-right']
                },
                speed: {
                    minimum: '500',
                    maximum: 1000 * 60 * 30
                    //1.800.000 = 30 min
                },
                bullet: ['bullet_1']
            },
            control: {
                imageNumber: 'bolean',
                title: 'bolean',
                bullet: 'bolean',
                autoPlay: 'bolean',
                player: 'bolean',
                arrow: 'bolean',
                thumbnail: 'bolean',
                addVerticalThumbnail: 'bolean',
                addListSlider: 'bolean',
                fullWidthSlider: 'bolean'
            }
        },
        _create_deBug = function (deBug, attrParams) {

            $.each(deBug, function (key, value) {
                if (typeof value == "object") {
                    if (key in attrParams) {
                        parent = key;
                        _create_deBug(value, attrParams[key]);
                    }
                } else {
                        if (key in attrParams && key != 'activeImageIndex') {
                        if (parent == 'control') {
                            if (!_boleanCheck(value)) {
                                deBug.control[key] = defaults.control[key];
                            }
                        }
                        else if (key == 'speed') {
                            if (!_minMaxChek(value)) {
                                deBug.speed = defaults.gallery.speed;
                            }
                        }
                        else if (!_check(value, attrParams[key])) {
                            deBug['gallery'][key] = defaults.gallery[key];
                        }
                    }
                }
            });

            function _check(value, attParam) {
                    return ($.inArray(value, attParam) >= 0 || value == attParam ) ? true : false;
            }

            function _minMaxChek(value) {
                return (attrParams.speed.minimum < value && attrParams.speed.maximum > value ) ? true : false;
            }

            function _boleanCheck(value) {
                if (value == 0 || value == 1 || value == true || value == false || value == '0' || value == '1') {
                    return true;
                }
            }
        };
        function _createControl(options) {
            var controlArray = functionParamList[options.gallery.thumbName];

            $.each(controlArray, function(index, value) {
                defaults.control[value] = true;
            });
        }
        function getType(value) {
            var type = typeof value;
        }
})(jQuery);
