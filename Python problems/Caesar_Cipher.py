def caesar_cipher(message, shift, mode='encode'):
    shift %= 26
    if mode == 'decode':
        shift = -shift

    result = ''
    for char in message:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            shifted = (ord(char) - base + shift) % 26 + base
            result += chr(shifted)
        else:
            result += char
    return result
encoded = caesar_cipher(input(""), 3)
print("Encoded:", encoded)  

decoded = caesar_cipher(encoded, 3, mode='decode')
print("Decoded:", decoded)  
