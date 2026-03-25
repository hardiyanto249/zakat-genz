import os

filepath = 'D:/Users/Yan/project/clawdbot/lazharfa-landing/index.html'

with open(filepath, 'rb') as f:
    byte_content = f.read()

# Approach: Read it as a latin-1 string, which maps every byte to a unicode point exactly.
raw_str = byte_content.decode('utf-8', errors='ignore')

# Now we need to manually replace the Mojibake strings with their proper emojis.
replacements = {
    'ðŸ¤”': '🤔', 'âœ¨': '✨', 'â€”': '—', 'Ã—': '×', 'Â·': '·',
    'ðŸ§®': '🧮', 'â†’': '→', 'âœ…': '✅', 'ðŸ”’': '🔒', 'ðŸ“Š': '📊',
    'âš¡': '⚡', 'ðŸ“±': '📱', 'ðŸ’¼': '💼', 'ðŸ’°': '💰', 'ðŸŒ¾': '🌾',
    'âˆ’': '−', 'ðŸŽ‰': '🎉', 'ðŸ’š': '💚', 'ðŸ“¤': '📤', 'ðŸ” ': '🔍',
    'ðŸŒŸ': '🌟', 'ðŸ”¥': '🔥', 'ðŸ› ï¸ ': '🛍️', 'ðŸ™ ': '🙏', 'ðŸ¤²': '🤲',
    'ðŸŒŠ': '🌊', 'ðŸ’§': '💧', 'ðŸš€': '🚀', 'ðŸ †': '🏆', 'ðŸ‘¨': '👨',
    'ðŸ‘©': '👩', 'ðŸ‘¦': '👦', 'ðŸ‘§': '👧', 'ðŸ§•': '🧕', 'ðŸ§‘': '🧑',
    'ðŸ’Ž': '💎', 'ðŸ‘‘': '👑', 'ðŸŽ“': '🎓', 'ðŸ ¥': '🏥', 'ðŸŒ±': '🌱',
    'ðŸ¤–': '🤖', 'â­ ': '⭐', 'ðŸ¤ ': '🤝', 'ðŸ”—': '🔗', 'Â©': '©',
    'ðŸŒ™': '🌙', 'ðŸ’¸': '💸', 'ðŸ—¿': '🗿', 'ðŸ™Œ': '🙌', 'âž¡ï¸ ': '➡️'
}

for bad, good in replacements.items():
    raw_str = raw_str.replace(bad, good)

# also fix any leftover latin-1 things
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(raw_str)
print("Done fixing strings.")
