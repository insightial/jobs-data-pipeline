esbuild index.ts \
    --bundle \
    --platform=node \
    --target=es2020 \
    --external:aws-sdk \
    --outfile=dist/index.js 
