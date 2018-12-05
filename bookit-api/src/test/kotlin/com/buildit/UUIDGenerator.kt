package com.buildit

import java.util.UUID

fun main(args: Array<String>) {
    for (i in 1..15) {
        println(UUID.randomUUID().toString())
    }
}
