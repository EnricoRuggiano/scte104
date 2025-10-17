.PHONY: build install pre-install test

pre-install:
	npm install
test:
	npm run test
build:
	npm run build
install:
	npm install .
example-client:
	npx ts-node src/examples/client.ts --host 127.0.0.1  --port 5167 --dpi-pid-index 2965 --log-level info --pre-roll-time 2000 --auto-return-flag 1 --splice-insert-type 1 --buffer-size 100
example-server:
	npx ts-node src/examples/server.ts --host 127.0.0.1  --port 5167 