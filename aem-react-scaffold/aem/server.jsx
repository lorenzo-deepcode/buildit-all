import ServerRenderer from 'aem-with-react/ServerRenderer'
import RootComponentRegistry from 'aem-with-react/RootComponentRegistry'
import componentRegistry from './componentRegistry'

const rootComponentRegistry = new RootComponentRegistry()

rootComponentRegistry.add(componentRegistry)
rootComponentRegistry.init()
const serverRenderer = new ServerRenderer(rootComponentRegistry)

if (typeof AemGlobal === 'undefined') {
  throw 'this is not the server side AEM javascript context'
}

AemGlobal.renderReactComponent = serverRenderer.renderReactComponent.bind(serverRenderer)
AemGlobal.registry = rootComponentRegistry
