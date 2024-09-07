esbuild index.ts \
    --bundle \
    --platform=node \
    --target=es2020 \
    --external:aws-sdk \
    --external:date-fns \
    --outfile=dist/index.js 
