import os

files = ['D:/Users/Yan/project/clawdbot/lazharfa-landing/index.html', 'D:/Users/Yan/project/clawdbot/lazharfa-landing/app.js']
replacements = {
    'ðŸŒ¿': '🌿',
    'ðŸ’³': '💳',
    'ðŸ“²': '📲',
    'ðŸ’ª': '💪',
    'ðŸ\x8f¥': '🏥',
    'ðŸ ¥': '🏥',
    'ðŸ‘€': '👀',
    '🔍¥': '🔥',
    '🔍—': '🔗',
    '🔍´': '🔴'
}

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    for bad, good in replacements.items():
        text = text.replace(bad, good)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)
print('Fixed leftover mojibake')
