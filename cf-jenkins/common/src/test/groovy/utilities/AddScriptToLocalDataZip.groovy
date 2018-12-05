package utilities

import org.junit.Test
import org.zeroturnaround.zip.ZipUtil

import static utilities.ResourcePath.resourcePath

class AddScriptToLocalDataZip {
    public static void addScriptToLocalDataZip(Class testClass, String scriptName, String scriptPath, String targetPath){
        def script = new File("${scriptPath}/${scriptName}")
        testClass.getMethods().each {
            if(it.getAnnotation(Test) != null){
                def zip = new File(resourcePath("${it.getName()}.zip",  testClass.getCanonicalName().replace(".", "/")))
                if(zip.exists()){
                    println("Found zip with name ${zip.getName()}")
                    if(ZipUtil.containsEntry(zip, "${targetPath}/${scriptName}")){
                        println("Replacing script with name ${scriptName} to ${zip.getName()}")
                        ZipUtil.replaceEntry(zip, "${targetPath}/${scriptName}", script.text.bytes)
                    }else{
                        println("Adding script with name ${scriptName} to ${zip.getName()}")
                        ZipUtil.addEntry(zip, "${targetPath}/${scriptName}", script.text.bytes)
                    }
                }
            }
        }
    }
}
