.PHONY: build install test tests example-client example-server

tests:
	npm run test
test:
	npm run test
build:
	npm run build
install:
	npm install
example-client:
	npx ts-node examples/client.ts --host 127.0.0.1  --port 5167 --dpi-pid-index 2965 --log-level info --pre-roll-time 2000 --auto-return-flag 1 --splice-insert-type 1 --buffer-size 100
example-server:
	npx ts-node examples/server.ts --host 127.0.0.1  --port 5167 
global:
	make build
	npm install -g