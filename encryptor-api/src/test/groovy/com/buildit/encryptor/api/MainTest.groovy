package com.buildit.encryptor.api

import com.jayway.restassured.RestAssured
import com.jayway.restassured.response.Response
import org.junit.BeforeClass
import org.junit.Test

import static ResourcePath.resourcePath
import static com.buildit.encryptor.AESKeyGenerator.KeySize.AES_128_BIT
import static com.buildit.encryptor.AESKeyGenerator.KeySize.AES_192_BIT
import static com.buildit.encryptor.AESKeyGenerator.KeySize.AES_256_BIT
import static org.hamcrest.CoreMatchers.equalTo
import static org.hamcrest.MatcherAssert.assertThat
import static com.jayway.restassured.RestAssured.given


class MainTest {

    public static final String BASE_URL = "http://localhost:4567"
    public static final String ENCRYPTOR_URL = "${BASE_URL}/api/encrypted"
    public static final String KEY_GENERATOR_URL = "${BASE_URL}/api/key"

    @BeforeClass
    static void setUp(){
        Main.main()
        RestAssured.baseURI = "localhost"
        RestAssured.port = 4567
    }

    @Test
    void shouldReturnEncryptedString() {
        Response response = given().
                formParam("password", "Sup3rS3cr3tStr1ng").
                formParam("secret", "828sjfhsdurtoing").
                when().
                post(ENCRYPTOR_URL)

        assertThat(response.getStatusCode(), equalTo(200))
        assertThat(response.asString().length(), equalTo(68))
    }

    @Test
    void shouldReturnEncryptedStringFromFile() {
        Response response = given().
                multiPart(new File(resourcePath("secret_text_file.txt"))).
                formParam("secret", "828sjfhsdurtoing").
                when().
                post(ENCRYPTOR_URL)

        assertThat(response.getStatusCode(), equalTo(200))
        assertThat(response.asString().length(), equalTo(84))
    }

    @Test
    void shouldReturnErrorTextAndStatusCode() {
        Response response = given().
                multiPart(new File(resourcePath("secret_text_file.txt"))).
                formParam("secret", "").
                when().
                post(ENCRYPTOR_URL)

        assertThat(response.getStatusCode(), equalTo(400))
    }

    @Test
    void shouldReturnAes128Key() {
        Response response = given().
                formParam("keySize", AES_128_BIT.name()).
                when().
                post(KEY_GENERATOR_URL)

        assertThat(response.getStatusCode(), equalTo(200))
        assertThat(response.asString().length(), equalTo(16))
    }

    @Test
    void shouldReturnAes192Key() {
        Response response = given().
                formParam("keySize", AES_192_BIT.name()).
                when().
                post(KEY_GENERATOR_URL)

        assertThat(response.getStatusCode(), equalTo(200))
        assertThat(response.asString().length(), equalTo(24))
    }

    @Test
    void shouldReturnAes256Key() {
        Response response = given().
                formParam("keySize", AES_256_BIT.name()).
                when().
                post(KEY_GENERATOR_URL)

        assertThat(response.getStatusCode(), equalTo(200))
        assertThat(response.asString().length(), equalTo(32))
    }

    @Test
    void shouldReturnErrorOnIncorrectInput() {
        Response response = given().
                formParam("keySize", "foo").
                when().
                post(KEY_GENERATOR_URL)

        assertThat(response.getStatusCode(), equalTo(400))
    }
}
