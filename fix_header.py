with open('lazharfa-landing/index.html', 'rb') as f:
    raw = f.read()

# Dari debug: bytes tepat adalah \xc3\xb0\xc5\xb8\xe2\x80\x9c\xc5\xa0 Transparan & Nyata
# (tanpa &amp; — pakai & biasa di sini)
old_bytes = b'section-tag">\xc3\xb0\xc5\xb8\xe2\x80\x9c\xc5\xa0 Transparan & Nyata</div>'
new_bytes = b'section-tag">&#x1F49A; Infak &amp; Sedekah</div>'

if old_bytes in raw:
    raw = raw.replace(old_bytes, new_bytes)
    print('FIXED OK')
    with open('lazharfa-landing/index.html', 'wb') as f:
        f.write(raw)
else:
    # Cari posisi exact
    idx = raw.find(b'Transparan')
    print('Transparan at:', idx)
    print(repr(raw[max(0,idx-30):idx+60]))
print('Done')
