 mkdir -p dist/nodejs/node18 && \
    cd dist/nodejs/node18 && \
    yarn init -y && \
    touch yarn.lock && \
    yarn add aws-sdk aws-lambda axios && \
    cd ../../.. && \
    mkdir -p dist/nodejs/node18/node_modules/.prisma && \
    cp -r ../../node_modules/.prisma/* dist/nodejs/node18/node_modules/.prisma && \
    mkdir -p dist/nodejs/node18/node_modules/@prisma/client && \
    cp -r ../../node_modules/@prisma/client/* dist/nodejs/node18/node_modules/@prisma/client
