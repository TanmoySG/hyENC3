import zlib, sys, os, zipfile, time
from Crypto.Cipher import Blowfish, PKCS1_OAEP, AES
from Crypto.PublicKey import RSA
from Crypto.Util.Padding import pad, unpad
from binascii import hexlify , unhexlify
import hashlib , json, string, random
from stegano import lsb
from datetime import datetime

# Compressor
def compress(file_names):

    with open('./test.txt', 'w') as f:
        f.write('inside compress')

    compression = zipfile.ZIP_DEFLATED
    
    zipfile_path = "../src/operating_files/encryption/operating_zip.zip"

    zf = zipfile.ZipFile(zipfile_path, mode="w")
    try:
        for file_name in file_names:
            zf.write(file_name, file_name, compress_type=compression)

    except FileNotFoundError:
        print("An error occurred")
    finally:
        zf.close()
        
    encryptFile(cover_image_path, user_password)



# Key Generator

def key_generator(size, case="default", punctuations="required"):
    if case=="default" and punctuations=="required":
        return ''.join(random.choices(string.ascii_uppercase + string.ascii_lowercase + string.digits + string.punctuation, k = size))
    elif case=="upper-case-only" and punctuations=="required":
        return ''.join(random.choices(string.ascii_uppercase + string.digits + string.punctuation, k = size))
    elif case=="lower-case-only"  and punctuations=="required":
        return ''.join(random.choices(string.ascii_lowercase + string.digits + string.punctuation, k = size))
    elif case=="default" and punctuations=="none":
        return ''.join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k = size))
    elif case=="lower-case-only"  and punctuations=="none":
        return ''.join(random.choices(string.ascii_lowercase + string.digits , k = size))
    elif case=="upper-case-only" and punctuations=="none":
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k = size))
    
    
    
# Encryption Funtion

def encryptFile(cover_image_path, password):
    # Plaintext Input
    with open('../src/operating_files/encryption/operating_zip.zip', 'rb') as file:
        plaintext = file.read()


    log_plaintext_length = len(hexlify(plaintext))

    # Password for Keys
    log_password_length = len(password)

    log_start_time = datetime.now()

    hash = hashlib.sha1()
    hash.update(password.encode())
    password_encryption_cipher = AES.new( hash.hexdigest()[:16].encode() , AES.MODE_CBC, iv= '16bitAESInitVect'.encode())

    # Dictionary of Keys
    keys_iv = {}

    # Blowfish Layer 1

    blowfish_key =  key_generator(size=16).encode()
    blowfish_cipher = Blowfish.new(blowfish_key, Blowfish.MODE_CBC)

    blowfish_ciphertext = blowfish_cipher.encrypt(pad(plaintext, Blowfish.block_size ))

    keys_iv['blowfish_iv'] = hexlify(blowfish_cipher.iv).decode()
    keys_iv['blowfish_key'] = hexlify(blowfish_key).decode()

    # RSA Layer 2

    rsa_key = RSA.generate(2048)
    rsa_private_key = rsa_key
    rsa_public_key = rsa_key.publickey()

    cipher_rsa = PKCS1_OAEP.new(rsa_public_key)
    rsa_plaintext = blowfish_ciphertext

    rsa_ciphertext = bytearray()
    for i in range(0, len(rsa_plaintext), 190):
        rsa_ciphertext.extend(cipher_rsa.encrypt(rsa_plaintext[i:i+190]))

    keys_iv['rsa_n'] = rsa_private_key.n
    keys_iv['rsa_e'] = rsa_private_key.e
    keys_iv['rsa_d'] = rsa_private_key.d

    # AES Layer 3
    aes_key =  key_generator(size=16).encode()
    aes_cipher = AES.new(aes_key, AES.MODE_CBC)
    aes_plaintext = rsa_ciphertext

    aes_ciphertext = aes_cipher.encrypt(pad(aes_plaintext, AES.block_size))

    ciphertext = aes_ciphertext
    
    encrypted_filename = "hyenc_"+str(time.strftime("%Y%m%d%H%M%S"))+".encrypted"

    with open('../src/operating_files/encryption/'+encrypted_filename, 'w+') as file:
        file.write(hexlify(ciphertext).decode())

    log_ciphertext_length = len(hexlify(ciphertext))

    keys_iv['aes_iv'] = hexlify(aes_cipher.iv).decode()
    keys_iv['aes_key'] = hexlify(aes_key).decode()


    # Encryption of Key and IV String
    encrypted_keys_and_iv = hexlify(password_encryption_cipher.encrypt(pad(json.dumps(keys_iv).encode(), AES.block_size)))

    stego_image_name = "stego_" + os.path.basename(cover_image_path)
    
    #LSB Steg
    lsb_stegano_image = lsb.hide(cover_image_path , encrypted_keys_and_iv.decode())
    lsb_stegano_image.save("../src/operating_files/encryption/" + stego_image_name) 

    log_end_time = datetime.now()

    log_duration = str(log_end_time - log_start_time)

    with open('../src/operating_files/logs/encryption-log.txt', 'a+') as log_file:
        log_file.write( "\n| "   +str(log_plaintext_length)
                       +"          | "+str(log_ciphertext_length)
                       +"          | "+str(log_password_length)
                       +"         | "+log_start_time.strftime("%H:%M:%S")
                       +"   | "+log_end_time.strftime("%H:%M:%S")
                       +"  | "+str(log_duration)
                       +" |"
                      )

    print('File Encryption Complete!')
    print(encrypted_filename)
    print(stego_image_name)


json_data = sys.argv[1]

#print("returned"+json_data)

data_jsonified = json.loads(json_data)

files_to_zip = data_jsonified['_listFiles']
cover_image_path = data_jsonified['_coverImage']
user_password = data_jsonified['_password']

#print("list files: " , type(cover_image_path))

compress(files_to_zip)