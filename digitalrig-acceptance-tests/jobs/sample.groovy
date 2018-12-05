import hudson.FilePath
import hudson.model.Executor

def suiteFolder = parentFolder
//this.hasProperty('parentFolder') ? this.getProperty('parentFolder') : null

if(suiteFolder) {
    folder(suiteFolder)
}
FilePath workspace = Executor.currentExecutor().getCurrentWorkspace()
workspace.list('src/test/pipeline/*.groovy').each { iter ->

    pipelineJob([suiteFolder, iter.baseName].findAll().join('/')) {
        definition {
            cps {
                script(iter.readToString())
                sandbox()
            }
        }
    }

}


