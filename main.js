(function() {
    var arrSearch = new Array();
    var hookList = {};
    arrSearch = ["1sdfsdf.com", "a11sdafs.net", "b22dsafsdf", "c333asdfsadf", "4444dsafasdf", "dddsfddsafdsaf"];

    function searchPrompt(arrSearch, objInputId) {
        if (arrSearch.constructor != Array) {
            return;
        }
        window.onload = function() {
            var objInput = document.getElementById(objInputId);
            var selectedIndex = -1;
            var intTmp;
            if (objInput == null) {
                return;
            }
            objInput.addEventListener("focus", addHook);
            if (!(document.getElementById("hookList"))) {
                hookList = document.createElement("div");
                hookList.setAttribute("id", "hook-ist");
                hookList.style.cssText = "position:absolute;display:none;top: 32px; left: 10px; width: 153px";
                insertAfter(hookList, objInput);
                //文本框失去焦点
                objInput.onblur = function() {
                    hookList.style.display = 'none';
                }
            }

            function addHook() {

                hookList.checkKeyCode = function() {
                    var ie = (document.all) ? true : false;
                    if (ie) {
                        var keyCode = event.keyCode
                        if (keyCode == 40 || keyCode == 38) { //下上
                            var isUp = false
                            if (keyCode == 40) isUp = true;
                            hookList.chageSelection(isUp)
                            console.log(1);
                            console.log(2);
                        } else if (keyCode == 13) { //回车
                            hookList.outSelection(selectedIndex);
                            console.log(3);
                        } else {
                            hookList.delayrequest()
                            console.log(4);
                        }
                    } else {
                        hookList.delayrequest()
                        console.log(1);
                    }
                }
                hookList.delayrequest = function() {
                    if (hookList.hooktime) {
                        clearInterval(hookList.hooktime);
                    };
                    hookList.style.display = 'none';
                    hookList.innerHTML = "";
                    hookList.hooktime = setInterval(hookList.checkAndShow, 1000);
                }
                hookList.addOption = function(value, keyw) {
                    var v = value.replace(keyw, "<b><font color=red>" + keyw + "</font></b>");
                    this.innerHTML += "<div onmouseover=\"this.className='sman_selectedStyle'\" onmouseout=\"this.className=''\" onmousedown=\"document.getElementById('" + objInputId + "').value='" + value + "'\">" + v + "</div>"
                }
                hookList.checkAndShow = function() {
                    var strInput = objInput.value;
                    if (strInput != "") {
                        selectedIndex = -1;
                        hookList.innerHTML = "";
                        for (var i = 0; i < arrSearch.length; i++) {
                            hookList.addOption(arrSearch[i], strInput);
                        };
                        hookList.style.display = 'block';
                    } else {
                        hookList.style.display = 'none';
                    }
                }
                hookList.chageSelection = function(isUp) {
                    if (this.style.display == 'none') {
                        this.style.display = '';
                    } else {
                        if (isUp)
                            selectedIndex++
                            else
                                selectedIndex--
                    }
                    var maxIndex = this.children.length - 1;
                    if (selectedIndex < 0) {
                        selectedIndex = 0
                    }
                    if (selectedIndex > maxIndex) {
                        selectedIndex = maxIndex
                    }
                    for (intTmp = 0; intTmp <= maxIndex; intTmp++) {
                        if (intTmp == selectedIndex) {
                            this.children[intTmp].className = "sman_selectedStyle";
                        } else {
                            this.children[intTmp].className = "";
                        }
                    }
                }
                hookList.outSelection = function(Index) {
                    objInput.value = this.children[Index].innerText;
                    this.style.display = 'none';
                }
                objInput.addEventListener("keyup", hookList.checkKeyCode());
                objInput.addEventListener("focus", hookList.delayrequest());
            }
        }

        function insertAfter(newEle, targetEle) {
            var parent = targetEle.parentNode;
            if (parent.lastChild == targetEle) {
                parent.appendChild(newEle);
            } else {
                parent.insertBefore(newEle, targetEle.nextSibling);
            };
        }
    }
    searchPrompt(arrSearch, "inputer");
})()
