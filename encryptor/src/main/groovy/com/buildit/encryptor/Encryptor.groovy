package com.buildit.encryptor

import org.apache.commons.text.WordUtils


class Encryptor {

    static final String NEWLINE  = "\n"
    static final String ILLEGAL_CHARACTER_REGEX  = /\n|\s/
    static final int WRAP_LENGTH = 100

    static encrypt(String secret, String string){
        WordUtils.wrap(AESEncryptionUtils.encrypt(secret, string), WRAP_LENGTH, NEWLINE, true)
    }

    static decrypt(String secret, String string){
        AESEncryptionUtils.decrypt(secret, string.replaceAll(ILLEGAL_CHARACTER_REGEX, ""))
    }
}