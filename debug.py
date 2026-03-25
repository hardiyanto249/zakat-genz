content = open('lazharfa-landing/index.html', encoding='utf-8').read()

# Cari exact bytes section-tag di area impact-viz
idx = content.find('impact-viz')
area = content[idx:idx+600]
print('RAW area:')
print(repr(area[:400]))
