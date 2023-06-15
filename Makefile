install:
	yarn cache clean
	yarn install

dev:
	rm -r ./.next
	yarn dev

build:
	rm -r ./.next
	yarn lint
	yarn build

export:
	yarn export
