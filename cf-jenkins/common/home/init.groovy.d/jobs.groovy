import jenkins.model.Jenkins

import static groovy.io.FileType.DIRECTORIES
import static groovy.io.FileType.FILES

def jenkinsHome = Jenkins.getInstance().getProperties().get("rootPath").toString()
def jobDir = new File("${jenkinsHome}/jobs-config")

createJobs(dirMap(jobDir))
runSeed()

def createJobs(map) {
    map.each {
        jobName, file ->
            def stream = new ByteArrayInputStream(file.text.getBytes())
            println("Creating job with name ${jobName}")
            Jenkins.getInstance().createProjectFromXML(jobName, stream)
    }
}

def runSeed() {
    def seed = Jenkins.getInstance().getItem("seed")
    if (seed) {
        println("Found job with name ${seed.getName()}. Scheduling run")
        Jenkins.getInstance().getQueue().schedule(seed)
    }
}

def dirMap(File source) {
    def map = [:]
    source.traverse(type: DIRECTORIES) {
        dir ->
            null
            dir.traverse(type: FILES, nameFilter: ~/.*\.xml$/) {
                map.put(dir.name, it)
            }
    }
    return map
}
