
#!/usr/bin/env python3
import sys
import os

FILES_TO_CONVERT = [
    ('profile-light.jpg', 'profile-light.webp'),
    ('profile-dark.jpg', 'profile-dark.webp'),
    ('resume.jpg', 'resume.webp')
]

ASSETS_DIR = os.path.dirname(os.path.abspath(__file__))

def ensure_pillow():
    try:
        from PIL import Image
        return Image
    except ImportError:
        print('Pillow not installed, installing now...')
        import subprocess
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'Pillow'])
            from PIL import Image
            return Image
        except Exception as e:
            print('Failed to install Pillow:', e)
            sys.exit(1)

def convert_images():
    Image = ensure_pillow()
    for src, dst in FILES_TO_CONVERT:
        src_path = os.path.join(ASSETS_DIR, src)
        dst_path = os.path.join(ASSETS_DIR, dst)
        if not os.path.exists(src_path):
            print(f'SKIP: source not found: {src_path}')
            continue
        try:
            with Image.open(src_path) as img:
                img = img.convert('RGB')
                img.save(dst_path, 'WEBP', quality=80, method=6)
            print(f'Created {dst_path}')
        except Exception as e:
            print(f'Error converting {src_path}: {e}')

if __name__ == '__main__':
    convert_images()
    print('Done')
