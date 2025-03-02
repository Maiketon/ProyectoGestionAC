from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
import base64
import os

# Clave de cifrado de 32 bytes (256 bits) 
SECRET_KEY = b'cifradorAlcaldia'

# Función para cifrar datos
def cifrar_dato(dato: str) -> str:
    iv = os.urandom(16)  # Vector de inicialización aleatorio
    cipher = Cipher(algorithms.AES(SECRET_KEY), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()

    # Rellenar el dato para que sea múltiplo de 16 bytes
    padder = padding.PKCS7(algorithms.AES.block_size).padder()
    padded_data = padder.update(str(dato).encode()) + padder.finalize()  # Conversión a str

    encrypted_data = encryptor.update(padded_data) + encryptor.finalize()
    
    # Retornamos en Base64 para facilitar el manejo en el frontend
    return base64.b64encode(iv + encrypted_data).decode()

# Función para descifrar datos
def descifrar_dato(dato_cifrado: str) -> str:
    raw_data = base64.b64decode(dato_cifrado)
    iv = raw_data[:16]  # Extraemos el IV
    encrypted_data = raw_data[16:]

    cipher = Cipher(algorithms.AES(SECRET_KEY), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()

    decrypted_padded_data = decryptor.update(encrypted_data) + decryptor.finalize()

    # Quitar el padding
    unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
    decrypted_data = unpadder.update(decrypted_padded_data) + unpadder.finalize()

    return decrypted_data.decode()
