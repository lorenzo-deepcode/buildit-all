package com.buildit.encryptor

import javax.crypto.Cipher
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec
import java.nio.ByteBuffer
import java.security.InvalidKeyException
import java.security.SecureRandom

class AESEncryptionUtils {

    static final String CIPHER_TRANSFORMATION = "AES/GCM/NoPadding"
    static final String SECRET_KEY_ALGORITHM  = "AES"
    static final int AUTH_TAG_LENGTH          = 128

    static encrypt(String key, String plainText) {
        validateKeySize(key)
        SecretKey secretKey = new SecretKeySpec(key.getBytes(), SECRET_KEY_ALGORITHM)

        byte[] initialisationVector = new byte[12]
        SecureRandom secureRandom = new SecureRandom()
        secureRandom.nextBytes(initialisationVector)

        Cipher cipher = Cipher.getInstance(CIPHER_TRANSFORMATION)
        GCMParameterSpec parameterSpec = new GCMParameterSpec(AUTH_TAG_LENGTH, initialisationVector)
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, parameterSpec)

        byte[] cipherText = cipher.doFinal(plainText.getBytes())

        ByteBuffer byteBuffer = ByteBuffer.allocate(4 + initialisationVector.length + cipherText.length)
        byteBuffer.putInt(initialisationVector.length).put(initialisationVector).put(cipherText)
        byte[] cipherMessage = byteBuffer.array()

        encode(cipherMessage)
    }

    static decrypt(String key, String encryptedText) {
        validateKeySize(key)
        byte[] decoded = decode(encryptedText)
        ByteBuffer byteBuffer = ByteBuffer.wrap(decoded)
        int initialisationVectorLength = byteBuffer.getInt()
        byte[] initialisationVector = new byte[initialisationVectorLength]
        byteBuffer.get(initialisationVector)
        byte[] cipherText = new byte[byteBuffer.remaining()]
        byteBuffer.get(cipherText)

        final Cipher cipher = Cipher.getInstance(CIPHER_TRANSFORMATION)
        cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(key.getBytes(), SECRET_KEY_ALGORITHM),
                new GCMParameterSpec(AUTH_TAG_LENGTH, initialisationVector))
        new String(cipher.doFinal(cipherText))
    }

    static void validateKeySize(String key) {
        def keyLength = key.length()

        if (isJceInstalled()) {
            if (keyLength != 16 && keyLength != 24 && keyLength != 32) {
                throw new InvalidKeyException("Valid key sizes are: 16, 24 or 32 bytes.")
            }
        }
        else {
            if (keyLength != 16) {
                throw new InvalidKeyException("Valid key sizes are: 16 bytes. You must have the JCE installed for stronger encryption.")
            }
        }
    }

    static String encode(byte[] bytes) {
        Base64.getEncoder().encodeToString(bytes)
    }

    static byte[] decode(String string) {
        Base64.getDecoder().decode(string)
    }

    static boolean isJceInstalled() {
        (Cipher.getMaxAllowedKeyLength(CIPHER_TRANSFORMATION) / 8) > 128
    }

}
