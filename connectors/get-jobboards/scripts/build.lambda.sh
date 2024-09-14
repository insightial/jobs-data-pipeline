esbuild index.ts \
    --bundle \
    --platform=node \
    --target=es2020 \
    --external:aws-sdk \
    --external:axios \
    --external:aws-lambda \
    --external:pg \
    --external:@prisma/client \
    --outfile=dist/index.js 
