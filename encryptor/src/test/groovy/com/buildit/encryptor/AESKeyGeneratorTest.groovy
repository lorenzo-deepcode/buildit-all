package com.buildit.encryptor

import org.junit.Test

import static com.buildit.encryptor.AESKeyGenerator.generate
import static org.assertj.core.api.Assertions.assertThat

class AESKeyGeneratorTest {

    @Test
    void should_generate_correct_128_key_length() {
        String key = generate(com.buildit.encryptor.AESKeyGenerator.KeySize.AES_128_BIT)
        assertThat(key.length()).isEqualTo(16)
    }

    @Test
    void should_generate_correct_192_key_length() {
        String key = generate(com.buildit.encryptor.AESKeyGenerator.KeySize.AES_192_BIT)
        assertThat(key.length()).isEqualTo(24)
    }

    @Test
    void should_generate_correct_256_key_length() {
        String key = generate(com.buildit.encryptor.AESKeyGenerator.KeySize.AES_256_BIT)
        assertThat(key.length()).isEqualTo(32)
    }
}
