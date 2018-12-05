/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.buildit.harvesttattletale;

import com.google.inject.Guice;
import com.google.inject.Injector;

/**
 *
 * @author benhernandez
 */
public class HarvestTattletale {
    public static void main(String[] args) throws Exception {
        Injector injector = Guice.createInjector(new TattletaleModule());
        Config config = injector.getInstance(Config.class);
        config.loadConfig();
        Slack slack = injector.getInstance(Slack.class);
        slack.getSlackUsers();
        Harvest hi = injector.getInstance(Harvest.class);
        hi.getAndChideUsers();
    }
}
