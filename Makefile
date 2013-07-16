
build: components
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components

test: build
	open http://localhost:7777

server:
	node server

.PHONY: clean test