# Create necessary directories
New-Item -ItemType Directory -Force -Path frontend\public
New-Item -ItemType Directory -Force -Path frontend\styles

# Move files to frontend
Move-Item -Path public\* -Destination frontend\public\ -Force
Move-Item -Path styles\* -Destination frontend\styles\ -Force -ErrorAction SilentlyContinue
Move-Item -Path next-env.d.ts -Destination frontend\ -Force
Move-Item -Path postcss.config.js -Destination frontend\ -Force
Move-Item -Path tailwind.config.ts -Destination frontend\ -Force

# Move backend files
New-Item -ItemType Directory -Force -Path backend\src
Move-Item -Path lib\* -Destination backend\src\ -Force

# Remove empty directories
Remove-Item -Path public, styles, lib -Recurse -Force -ErrorAction SilentlyContinue
