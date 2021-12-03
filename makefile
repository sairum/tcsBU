.PHONY: css tcsbujs clean watch optimize

#CAT = @cat
CAT =	@sed '/\#DEBUG/,/!DEBUG/d' 

cssfiles = src/css/tcsBU.scss

tcsbu = src/tcsbu/src/*.js

css: $(cssfiles)
	@echo Built style.css
	@sassc src/css/tcsBU.scss css/tcsBU.css
	
tcsbujs: $(tcsbu)
	@echo Building tcsBU.js
	@echo '/* tcsBU 1.1 (nightly) (c)  amsantos@fc.up.pt */' > js/tcsBU.js
	@echo '"use strict";' >> js/tcsBU.js
	@echo '$$(function(){' >> js/tcsBU.js
	$(CAT) src/tcsbu/global.js >> js/tcsBU.js
	$(CAT) $^ >> js/tcsBU.js
	$(CAT) src/tcsbu/main.js >> js/tcsBU.js
	@echo '});' >> js/tcsBU.js
	
watch:
	@echo Watching for changes...
	@while true; do \
		inotifywait -qr -e close -e create -e delete \
		src/tcsbu/*.js src/tcsbu/src/*.js src/css/*.scss; \
		make optimize; \
	done
	
optimize: tcsbujs css
#	@echo Optimizing...
#	@jsmin < js/tcsBU.js > js/tcsBU.min.js
#	@jsmin < css/tcsBU.css > css/tcsBU.min.css
	@minify js/tcsBU.js > js/tcsBU.min.js
	@minify css/tcsBU.css > css/tcsBU.min.css
	
clean:
	@rm -f js/tcsBU*.js css/tcsBU*.css
