package com.buildit.artifactfetcher.utils

import org.eclipse.jetty.server.Handler
import org.eclipse.jetty.server.Server
import org.eclipse.jetty.server.handler.DefaultHandler
import org.eclipse.jetty.server.handler.HandlerList
import org.eclipse.jetty.server.handler.ResourceHandler

class HttpServer {

    static withServer(base, port=8080, cl) throws Exception {

        Server server = new Server(port as Integer)

        ResourceHandler resource_handler = new ResourceHandler()
        resource_handler.setDirectoriesListed(true)
        resource_handler.setResourceBase(base as String)

        HandlerList handlers = new HandlerList()
        handlers.setHandlers([resource_handler, new DefaultHandler()] as Handler[])
        server.setHandler(handlers)

        server.start()

        println("Serving ${base}. Url is ${server.getURI()}")

        cl()

        server.stop()
    }
}
