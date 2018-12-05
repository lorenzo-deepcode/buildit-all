package com.buildit.encryptor

import java.security.SecureRandom

import static org.apache.commons.codec.binary.Hex.encodeHexString

class AESKeyGenerator {

    static String generate(KeySize keySize) {
        final SecureRandom secureRandom = new SecureRandom()
        final byte[] bytes  = new byte[keySize.length / 2]
        secureRandom.nextBytes(bytes)
        return encodeHexString(bytes)
    }

    static enum KeySize {

        AES_128_BIT(16),
        AES_192_BIT(24),
        AES_256_BIT(32)

        private final int length

        KeySize(int length) {
            this.length = length
        }

        int getLength() {
            return length
        }
    }
}
