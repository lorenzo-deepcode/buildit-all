package com.buildit.encryptor

import org.junit.Assume
import org.junit.Before
import org.junit.Test

import java.security.InvalidKeyException

import static org.assertj.core.api.Assertions.assertThat


class AESEncryptionUtilsTest {

    static final String AES_128_KEY        = "1234567812345678"                 // 16 bytes
    static final String AES_192_KEY        = "123456781234567812345678"         // 24 bytes
    static final String AES_256_KEY        = "12345678123456781234567812345678" // 32 bytes
    static final String INVALID_LENGTH_KEY = "132456"                           // 6 bytes - wrong!
    static final String PASSWORD           = "mysecretpassword"

    @Before
    void reset_metaclass() {
        GroovySystem.metaClassRegistry.removeMetaClass(AESEncryptionUtils.class)
    }

    @Test
    void encrypt_with_aes_128(){
        String encrypted = AESEncryptionUtils.encrypt(AES_128_KEY, PASSWORD)
        String decrypted = AESEncryptionUtils.decrypt(AES_128_KEY, encrypted)

        assertThat(decrypted as String).isEqualTo(PASSWORD)
    }

    @Test
    void encrypt_with_aes_192(){
        Assume.assumeTrue(AESEncryptionUtils.isJceInstalled())

        String encrypted = AESEncryptionUtils.encrypt(AES_192_KEY, PASSWORD)
        String decrypted = AESEncryptionUtils.decrypt(AES_192_KEY, encrypted)

        assertThat(decrypted as String).isEqualTo(PASSWORD)
    }

    @Test
    void encrypt_with_aes_256(){
        Assume.assumeTrue(AESEncryptionUtils.isJceInstalled())

        String encrypted = AESEncryptionUtils.encrypt(AES_256_KEY, PASSWORD)
        String decrypted = AESEncryptionUtils.decrypt(AES_256_KEY, encrypted)

        assertThat(decrypted as String).isEqualTo(PASSWORD)
    }

    @Test(expected = InvalidKeyException.class)
    void should_fail_with_invalid_key_length(){
        AESEncryptionUtils.encrypt(INVALID_LENGTH_KEY, PASSWORD)
    }

    @Test
    void no_jce_aes_128() {
        AESEncryptionUtils.metaClass.static.isJceInstalled = {
            return false
        }
        String encrypted = AESEncryptionUtils.encrypt(AES_128_KEY, PASSWORD)
        String decrypted = AESEncryptionUtils.decrypt(AES_128_KEY, encrypted)

        assertThat(decrypted as String).isEqualTo(PASSWORD)
    }

    @Test(expected = InvalidKeyException.class)
    void should_fail_no_jce_aes_192() {
        AESEncryptionUtils.metaClass.static.isJceInstalled = {
            return false
        }
        AESEncryptionUtils.encrypt(AES_192_KEY, PASSWORD)
    }

    @Test(expected = InvalidKeyException.class)
    void should_fail_no_jce_aes_256() {
        AESEncryptionUtils.metaClass.static.isJceInstalled = {
            return false
        }
        AESEncryptionUtils.encrypt(AES_256_KEY, PASSWORD)
    }

}
