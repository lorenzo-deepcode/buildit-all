package com.buildit.encryptor

import org.junit.Test
import static org.assertj.core.api.Assertions.*

class EncryptorTest {

    static final String AES_128_KEY    = "1234567812345678"
    static final String SHORT_PASSWORD = "password"
    static final String LONG_PASSWORD  = "afgsafsdlkfjlasfdjskadfjasdljfasjdfasjdflsjdfasdjflasdjfasldjfldsjfklsjfsdfjsdlj"

    @Test
    void should_not_wrap() {
        String encrypted = Encryptor.encrypt(AES_128_KEY, SHORT_PASSWORD)
        assertThat(encrypted).doesNotContain(Encryptor.NEWLINE)
    }

    @Test
    void should_be_wrapped() {
        String encrypted = Encryptor.encrypt(AES_128_KEY, LONG_PASSWORD)
        assertThat(encrypted).contains(Encryptor.NEWLINE)
    }

    @Test
    void decrypt_with_no_wrap() {
        String encrypted = Encryptor.encrypt(AES_128_KEY, SHORT_PASSWORD)
        String expected = Encryptor.decrypt(AES_128_KEY, encrypted)
        assertThat(expected).isEqualTo(SHORT_PASSWORD)
    }

    @Test
    void decrypt_with_wrap() {
        String encrypted = Encryptor.encrypt(AES_128_KEY, LONG_PASSWORD)
        String expected = Encryptor.decrypt(AES_128_KEY, encrypted)
        assertThat(expected).isEqualTo(LONG_PASSWORD)
    }

    @Test
    void decrypt_with_wrap_and_space_characters() {
        String encrypted = Encryptor.encrypt(AES_128_KEY, LONG_PASSWORD)
        String formatted = encrypted.replaceAll(/\n/, "\n       ")
        String expected = Encryptor.decrypt(AES_128_KEY, formatted)
        assertThat(expected).isEqualTo(LONG_PASSWORD)
    }
}
