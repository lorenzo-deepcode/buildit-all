package com.buildit.bookit

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("bookit")
data class BookitProperties(
    var allowTestTokens: Boolean? = null,
    var databaseUrl: String? = null,
    var databaseDriver: String? = null,
    var databaseDialect: String? = null,
    var databaseDdlAuto: String? = null,
    var requireSsl: Boolean? = null
)
