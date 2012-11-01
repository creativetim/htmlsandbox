var bootstrap=function(){function g(a){var b=/^(.*\/)?([^?#]*)([?#].*)?$/.exec(a);b.shift();return b}function h(a,b){var c={},e={css:"href",js:"src"}[b],f=typeof a==="string"?a:a[e],h={css:"stylesheets",js:"scripts"}[b],i=g(f)[1],j=p.exec("-"+i.replace(new RegExp("\\."+b+"$","i"),""));if(!/^(?:\.{0,2}\/|https?:\/\/)/.test(f)){f=x[b+"Root"]+f.replace(new RegExp("(?:\\."+b+")?(\\?[^?]*)?$"),"."+b+"$1")}if(a.cache===false||x.cache===false){f+=(f.indexOf("?")>-1?"&":"?")+"_="+d}if(x[h][f]){return x[h][f]}c[e]=f;if(b==="css"){c.media=a.media||(/\b(screen|print|all|handheld)\b/.exec(i)||[,"screen"])[1]}if(a.condition||j[0]){c.condition=a.condition||j[0].slice(1)}var k=c.condition&&c.condition!=="all"&&!x.test(c.condition);if(!k){x[h][c[e]]=c;return c}}function i(b,d){var e=typeof d==="function";if(!(b=h(b,"js"))){return}if(!b.readyState){var f=a.createElement("script");b.readyState="loading";b.callbacks=e?[d]:[];f.onload=f.onerror=f.onreadystatechange=function(){if(f.readyState&&!/^c|loade/.test(f.readyState)||b.readyState==="complete"){return}f.onload=f.onreadystatechange=null;b.readyState="complete";for(var a=0,c=b.callbacks.length;a<c;a++){b.callbacks[a]()}delete b.callbacks};f.async=false;f.src=b.src;c.insertBefore(f,c.firstChild)}else if(e){if(b.readyState==="loading"){b.callbacks.push(d)}else{d()}}return b}function l(a,b){b=b||[];for(var c in a){if(a.hasOwnProperty(c)&&c!=="test"){b.push(c);if(typeof a[c]==="object"&&!(a[c]instanceof RegExp)){l(a[c],b)}}}return b}function q(a,b){var c,d,e;for(var f in a){if(!a.hasOwnProperty(f)||f==="test"){continue}c=a[f];e=typeof c==="object"&&!(c instanceof RegExp);if(c.hasOwnProperty("test")){c=c.test}if(typeof c==="function"){d=c(b)}else if(c instanceof RegExp){d=c.exec(b)}if(e){if(d){q(a[f],b)}else if(!a[f].hasOwnProperty("test")){d=q(a[f],b)}}if(d){m[f]=d[1]||true;return true}}}function r(a,b){var c;a=a.split(".");b=b.split(".");for(var d=0,e=Math.min(a.length,b.length);d<e;d++){c=a[d]-b[d];if(c!==0){break}}return c}var a=document,b=a.documentElement,c=a.getElementsByTagName("head")[0],d=(new Date).getTime(),e=a.createElement("script").async===true||"MozAppearance"in b.style||window.opera,f=[];if(!a.readyState&&a.addEventListener){a.addEventListener("DOMContentLoaded",function F(){a.removeEventListener("DOMContentLoaded",F,false);a.readyState="complete"},false);a.readyState="loading"}var j={webkit:{test:/webkit[ \/]([\w.]+)/i,chrome:/Chrome\/([\w.]+)/i,safari:function(a){return navigator.vendor.indexOf("Apple")>-1&&/version\/([\w.]+)/i.exec(a)}},opera:/opera(?:.*version)?[ \/]([\w.]+)/i,ie:/msie ([\w.]+)/i,mozilla:{test:function(a){return a.indexOf("compatible")<0&&/mozilla(?:.*? rv:([\w.]+))?/i.exec(a)},firefox:/Firefox\/([\w.]+)/i}};var k={mobile:{ios:/iP(?:hone|ad|od)/,android:/Android/,blackberry:/BlackBerry/},windows:/Win/,mac:/Mac/,linux:/X11/};var m={},n=l(j),o=l(k),p=new RegExp("(?:-("+n.join("|")+")(?:([<>]?)(\\d+(?:\\.\\d+)*))?)?(?:-("+o.join("|")+"))?$");q(j,navigator.userAgent);q(k,navigator.appVersion);var s=a.getElementsByTagName("link"),t=a.getElementsByTagName("script"),u=t[t.length-1],v;for(var w=s.length-1;w>=0;w--){if(/\bbootstrap\.css\b/.test(s[w].href)){v=s[w];break}}var x=function(a){a(x);for(var b in B){if(B.hasOwnProperty(b)){x[b].apply(x,B[b])}}B={}};x.cssRoot=g(v.getAttribute("href",2))[0];x.jsRoot=g(u.getAttribute("src",2))[0];x.stylesheets={};x.scripts={};x.supported=true;x.tags=m;x.test=function(a){var b=this.tags,c=p.exec("-"+a),d=c[1],e=c[2],f=c[3],g=c[4],h=true;if(!c[0]){return false}if(d){h=d in b}if(h&&f){var i=r(f,b[d]);if(e){h=e==="<"?i>0:i<0}else{h=i===0}}if(h&&g){h=g in b}return h};x.css=function(){if(!this.supported){return this}var b=/in/.test(a.readyState);for(var d=0,e=arguments.length,f;d<e;d++){f=h(arguments[d],"css");if(!f||f.readyState==="complete"){continue}f.readyState="complete";if(b){a.write('<link rel="stylesheet" href="'+f.href+'" media="'+f.media+'" charset="utf-8">')}else{var g=a.createElement("link");g.rel="stylesheet";g.href=f.href;g.media=f.media;g.charset="utf-8";c.insertBefore(g,c.firstChild)}}return this};x.js=function(){if(!this.supported){return this}var a=f.slice(),b;for(var c=0,d=arguments.length,b;c<d;c++){b=arguments[c];if(Object.prototype.toString.call(b)==="[object Array]"||typeof b==="function"){a.push(b)}else{a.push([b])}}setTimeout(function(){(function b(c){var d=0,f;if(typeof c==="function"){c();if(a.length){b(a.shift())}}else{if(typeof a[0]==="function"){f=a.shift()}for(var g=0,h=c.length;g<h;g++){i(c[g],function(){if(++d===c.length){f&&f();if(!e&&a.length){b(a.shift())}}})}if(e&&a.length){b(a.shift())}}})(a.shift())},0);return this};x.require=function(){if(!this.supported){return this}this.js.apply(this,Array.prototype.slice.call(arguments));for(var a=0,b=arguments.length,c;a<b;a++){c=arguments[a];if(typeof c!=="function"){f.push(Object.prototype.toString.call(c)==="[object Array]"?c:[c])}}return this};var y=[];for(var z in m){if(m.hasOwnProperty(z)){y.push(z);if(typeof m[z]==="string"){y.push(z+parseInt(m[z],10))}}}b.className+=(b.className.length?" ":"")+y.join(" ");var A=h({src:u.getAttribute("data-main",2)||"site",condition:"all"},"js").src;a.write('<script src="'+A+'" charset="utf-8"></script>');if(x.test("ie<6")||x.test("webkit<420")||x.test("mozilla<1.9.1")||x.test("opera<9")){x.supported=false}var B={},C=["css","js"],D,E;for(var w=0;D=C[w++];){E=u.getAttribute("data-"+D,2);if(E){B[D]=E.split(" ")}}return x}()