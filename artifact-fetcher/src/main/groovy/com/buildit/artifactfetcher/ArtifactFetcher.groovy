package com.buildit.artifactfetcher

import org.apache.ivy.Ivy
import org.apache.ivy.core.module.descriptor.DefaultDependencyArtifactDescriptor
import org.apache.ivy.core.module.descriptor.DefaultDependencyDescriptor
import org.apache.ivy.core.module.descriptor.DefaultModuleDescriptor
import org.apache.ivy.core.module.id.ModuleRevisionId
import org.apache.ivy.core.report.ResolveReport
import org.apache.ivy.core.resolve.ResolveOptions
import org.apache.ivy.core.settings.IvySettings
import org.apache.ivy.plugins.parser.xml.XmlModuleDescriptorWriter
import org.apache.ivy.plugins.resolver.URLResolver

class ArtifactFetcher {
    def fetch(pattern, artifacts, cache=null) {

        IvySettings ivySettings = new IvySettings()
        if(cache){
            ivySettings.setDefaultCache(new File("${cache}"))
        }
        URLResolver resolver = new URLResolver()
        resolver.setM2compatible(true)
        resolver.setName('central')
        resolver.setCheckmodified(true)
        resolver.setChangingMatcher("regexp")
        resolver.addArtifactPattern(pattern)
        ivySettings.addResolver(resolver)
        ivySettings.setDefaultResolver(resolver.getName())
        Ivy ivy = Ivy.newInstance(ivySettings)

        File ivyfile = File.createTempFile('ivy', '.xml')
        ivyfile.deleteOnExit()

        DefaultModuleDescriptor md = DefaultModuleDescriptor.newDefaultInstance(ModuleRevisionId.newInstance('', '', ''))

        artifacts.each {
            def bits = it.toString().split(":")
            if(bits.length != 3){
                throw new IllegalArgumentException("Error parsing plugin pluginArtifact: ${it.toString()}")
            }
            def groupId = bits[0]
            def artifactId = bits[1]
            def version = bits[2].split("@")[0]

            def extBits = it.toString().split("@")
            def ext = "jar"
            if(extBits.length == 2){
                ext = extBits[1]
            }

            DefaultDependencyDescriptor dd = new DefaultDependencyDescriptor(md, ModuleRevisionId.newInstance(groupId, artifactId, version, [:]), false, false, true)
            DefaultDependencyArtifactDescriptor dad = new DefaultDependencyArtifactDescriptor(dd, artifactId, ext, ext, null, [:])
            dd.addDependencyArtifact('default', dad)
            md.addDependency(dd)
        }
        XmlModuleDescriptorWriter.write(md, ivyfile)

        String[] confs = ['default']
        ResolveOptions resolveOptions = new ResolveOptions().setConfs(confs)

        ResolveReport report = ivy.resolve(ivyfile.toURL(), resolveOptions)

        def results = []
        report.getAllArtifactsReports().each {
            results.add(it.getLocalFile())
        }

        return results
    }
}
